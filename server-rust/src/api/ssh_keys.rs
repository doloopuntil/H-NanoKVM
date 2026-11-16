//! SSH public keys for root, managed from the web UI. SSH takes keys only once a key is
//! registered or the web account has two-factor auth.
//!
//! The server owns `authorized_keys`: it lists every key there, appends validated keys and
//! removes them by fingerprint. Lines it cannot read stay as they are.

use std::{fs, os::unix::fs::PermissionsExt, path::Path, sync::Mutex, time::Duration};

use axum::{Extension, Json, extract::State, response::IntoResponse};
use base64::{
    Engine,
    engine::general_purpose::{STANDARD, STANDARD_NO_PAD},
};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use tokio::task;
use tracing::{info, warn};

use crate::{
    AppError, Result,
    api::{
        account::{require_second_factor, verify_password_limited},
        vm,
    },
    error::ApiResponse,
    fsutil::write_0600_atomic,
    http::{middleware::CurrentSession, proxy::ClientInfo},
    state::AppState,
    system::{
        audit,
        command::{AllowedCommand, run_allowed},
    },
};

const MAX_KEYS: usize = 32;
const MAX_KEY_TEXT: usize = 16 * 1024;
const MAX_LABEL: usize = 64;
const MIN_RSA_BITS: usize = 3072;
const MAX_RSA_BITS: usize = 16384;

/// Serialises the read-modify-write of `authorized_keys`.
static KEYS_FILE: Mutex<()> = Mutex::new(());

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SshKeysRsp {
    keys: Vec<SshKeyInfo>,
    /// A key is registered or two-factor auth is on: SSH accepts keys only.
    keys_only: bool,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SshKeyInfo {
    fingerprint: String,
    key_type: String,
    label: String,
    /// The line carries `authorized_keys` options (added outside the web UI).
    has_options: bool,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AddSshKeyReq {
    pub password: String,
    pub public_key: String,
    #[serde(default)]
    pub label: Option<String>,
    /// Second factor, needed when the account has one.
    #[serde(default)]
    pub code: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RemoveSshKeyReq {
    pub fingerprint: String,
}

pub async fn list_keys(State(state): State<AppState>) -> Result<impl IntoResponse> {
    let path = state.config.paths.ssh_authorized_keys.clone();
    let keys =
        blocking(move || Ok(read_lines(&path)?.iter().filter_map(Line::info).collect())).await?;
    Ok(Json(ApiResponse::ok(SshKeysRsp {
        keys,
        keys_only: state.config.paths.ssh_keys_only_flag.exists(),
    })))
}

/// Adds a key. A key is a lasting way in, so this asks for the password (and the code) again.
pub async fn add_key(
    State(state): State<AppState>,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    client: ClientInfo,
    Json(req): Json<AddSshKeyReq>,
) -> Result<impl IntoResponse> {
    let source_ip = client.source_ip();
    verify_password_limited(&state, &source_ip, &session.username, &req.password).await?;
    require_second_factor(&state, &session.username, &source_ip, req.code.as_deref()).await?;

    let key = parse_new_key(&req.public_key, req.label.as_deref())?;
    let path = state.config.paths.ssh_authorized_keys.clone();
    let fingerprint = key.fingerprint.clone();
    let keys = blocking(move || {
        let _guard = KEYS_FILE.lock().map_err(|_| locked())?;
        let mut lines = read_lines(&path)?;
        let keys = lines.iter().filter_map(Line::info).collect::<Vec<_>>();
        if keys.iter().any(|k| k.fingerprint == key.fingerprint) {
            return Err(AppError::Conflict(
                "this key is already registered".to_string(),
            ));
        }
        if keys.len() >= MAX_KEYS {
            return Err(AppError::Conflict(format!(
                "at most {MAX_KEYS} SSH keys can be registered"
            )));
        }
        lines.push(Line::Key(key));
        write_lines(&path, &lines)?;
        Ok(lines.iter().filter_map(Line::info).collect())
    })
    .await?;

    audit::ssh_key_added(&session.username, &fingerprint);
    sync_keys_only(&state).await;
    Ok(Json(ApiResponse::ok(SshKeysRsp {
        keys,
        keys_only: state.config.paths.ssh_keys_only_flag.exists(),
    })))
}

pub async fn remove_key(
    State(state): State<AppState>,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    Json(req): Json<RemoveSshKeyReq>,
) -> Result<impl IntoResponse> {
    let path = state.config.paths.ssh_authorized_keys.clone();
    let fingerprint = req.fingerprint.clone();
    let keys = blocking(move || {
        let _guard = KEYS_FILE.lock().map_err(|_| locked())?;
        let mut lines = read_lines(&path)?;
        let before = lines.len();
        lines.retain(|line| line.info().is_none_or(|k| k.fingerprint != fingerprint));
        if lines.len() == before {
            return Err(AppError::NotFound(
                "no SSH key with that fingerprint".to_string(),
            ));
        }
        write_lines(&path, &lines)?;
        Ok(lines.iter().filter_map(Line::info).collect())
    })
    .await?;

    audit::ssh_key_removed(&session.username, &req.fingerprint);
    sync_keys_only(&state).await;
    Ok(Json(ApiResponse::ok(SshKeysRsp {
        keys,
        keys_only: state.config.paths.ssh_keys_only_flag.exists(),
    })))
}

/// Sets the keys-only flag when a key is registered or the account has two-factor auth, and
/// restarts a running sshd when it changes. Failures are logged: the web change has happened.
pub async fn sync_keys_only(state: &AppState) {
    let totp = match state.accounts.load() {
        Ok(account) => account.is_some_and(|a| a.totp.is_some()),
        Err(err) => {
            warn!(error = %err, "cannot read the account; SSH password logins unchanged");
            return;
        }
    };
    let keys = state.config.paths.ssh_authorized_keys.clone();
    let flag = state.config.paths.ssh_keys_only_flag.clone();
    let result = blocking(move || {
        let has_key = read_lines(&keys)?.iter().any(|line| line.info().is_some());
        let wanted = totp || has_key;
        Ok((wanted, set_flag(&flag, wanted)?))
    })
    .await;
    let (wanted, changed) = match result {
        Ok(result) => result,
        Err(err) => {
            warn!(error = %err, "cannot update the SSH keys-only flag");
            return;
        }
    };
    if !changed || !vm::sshd_should_run().await {
        return;
    }
    match run_allowed(
        AllowedCommand::ServiceSshd,
        ["restart"],
        Duration::from_secs(5),
    )
    .await
    {
        Ok(output) if output.status == 0 => {
            info!(
                keys_only = wanted,
                "sshd restarted for the SSH password setting"
            );
        }
        Ok(output) => warn!(
            stderr = %String::from_utf8_lossy(&output.stderr).trim(),
            "sshd restart failed"
        ),
        Err(err) => warn!(error = %err, "sshd restart failed"),
    }
}

/// Creates or removes the flag; true when it changed.
fn set_flag(flag: &Path, wanted: bool) -> Result<bool> {
    if flag.exists() == wanted {
        return Ok(false);
    }
    if wanted {
        write_0600_atomic(flag, b"")?;
    } else {
        match fs::remove_file(flag) {
            Ok(()) => {}
            Err(err) if err.kind() == std::io::ErrorKind::NotFound => {}
            Err(err) => return Err(err.into()),
        }
    }
    Ok(true)
}

async fn blocking<T: Send + 'static>(
    work: impl FnOnce() -> Result<T> + Send + 'static,
) -> Result<T> {
    task::spawn_blocking(work)
        .await
        .map_err(|err| AppError::Internal(format!("SSH key task failed: {err}")))?
}

fn locked() -> AppError {
    AppError::Internal("SSH key lock poisoned".to_string())
}

#[derive(Debug, Clone, PartialEq)]
struct Key {
    /// The whole line as it stands in the file.
    raw: String,
    key_type: String,
    label: String,
    fingerprint: String,
    has_options: bool,
}

#[derive(Debug, Clone, PartialEq)]
enum Line {
    Key(Key),
    /// A comment, blank line or anything this module does not read; kept as it is.
    Other(String),
}

impl Line {
    fn info(&self) -> Option<SshKeyInfo> {
        match self {
            Line::Key(key) => Some(SshKeyInfo {
                fingerprint: key.fingerprint.clone(),
                key_type: key.key_type.clone(),
                label: key.label.clone(),
                has_options: key.has_options,
            }),
            Line::Other(_) => None,
        }
    }

    fn text(&self) -> &str {
        match self {
            Line::Key(key) => &key.raw,
            Line::Other(text) => text,
        }
    }
}

fn read_lines(path: &Path) -> Result<Vec<Line>> {
    let text = match fs::read_to_string(path) {
        Ok(text) => text,
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => String::new(),
        Err(err) => return Err(err.into()),
    };
    Ok(text.lines().map(parse_line).collect())
}

fn write_lines(path: &Path, lines: &[Line]) -> Result<()> {
    if let Some(dir) = path.parent() {
        fs::create_dir_all(dir)?;
        fs::set_permissions(dir, fs::Permissions::from_mode(0o700))?;
    }
    let mut text = String::new();
    for line in lines {
        text.push_str(line.text());
        text.push('\n');
    }
    write_0600_atomic(path, text.as_bytes())
}

/// Reads an existing line: optional options, a key type, the key, an optional comment.
fn parse_line(raw: &str) -> Line {
    let trimmed = raw.trim();
    if trimmed.is_empty() || trimmed.starts_with('#') {
        return Line::Other(raw.to_string());
    }
    let tokens = split_tokens(trimmed);
    for i in 0..tokens.len().saturating_sub(1) {
        let Some(blob) = decode_blob(&tokens[i], &tokens[i + 1]) else {
            continue;
        };
        return Line::Key(Key {
            raw: raw.to_string(),
            key_type: tokens[i].clone(),
            label: tokens[i + 2..].join(" "),
            fingerprint: fingerprint(&blob),
            has_options: i > 0,
        });
    }
    Line::Other(raw.to_string())
}

/// Whitespace-separated tokens; double quotes (in options) keep spaces together.
fn split_tokens(line: &str) -> Vec<String> {
    let mut tokens = Vec::new();
    let mut current = String::new();
    let mut quoted = false;
    for c in line.chars() {
        match c {
            '"' => {
                quoted = !quoted;
                current.push(c);
            }
            c if c.is_whitespace() && !quoted => {
                if !current.is_empty() {
                    tokens.push(std::mem::take(&mut current));
                }
            }
            c => current.push(c),
        }
    }
    if !current.is_empty() {
        tokens.push(current);
    }
    tokens
}

/// The key blob when `data` is base64 for a key whose wire type is `key_type`.
fn decode_blob(key_type: &str, data: &str) -> Option<Vec<u8>> {
    let blob = STANDARD.decode(data).ok()?;
    let mut reader = Wire(&blob);
    (reader.string()? == key_type.as_bytes()).then_some(blob)
}

/// `SHA256:` fingerprint, as `ssh-keygen -l` shows it.
fn fingerprint(blob: &[u8]) -> String {
    format!("SHA256:{}", STANDARD_NO_PAD.encode(Sha256::digest(blob)))
}

/// Checks a key pasted into the web UI: exactly `type base64 [comment]`, no options, a type
/// sshd accepts and the key structure that type needs.
fn parse_new_key(text: &str, label: Option<&str>) -> Result<Key> {
    let invalid = |why: &str| AppError::BadRequest(format!("not a usable SSH public key: {why}"));
    if text.len() > MAX_KEY_TEXT {
        return Err(invalid("too long"));
    }
    let text = text.trim();
    if text.contains(['\n', '\r']) {
        return Err(invalid("paste one key, on one line"));
    }
    let mut parts = text.splitn(3, char::is_whitespace);
    let key_type = parts.next().unwrap_or_default();
    let data = parts.next().map(str::trim).unwrap_or_default();
    let comment = parts.next().map(str::trim).unwrap_or_default();
    if !ALLOWED_TYPES.contains(&key_type) {
        return Err(invalid(
            "the type must be ssh-ed25519, ecdsa-sha2-nistp256/384/521, ssh-rsa, or a \
             security-key (sk-) type; authorized_keys options are not accepted",
        ));
    }
    let blob = STANDARD
        .decode(data)
        .map_err(|_| invalid("the key data is not base64"))?;
    check_blob(key_type, &blob).map_err(invalid)?;

    let label = clean_label(label.unwrap_or(comment))?;
    let encoded = STANDARD.encode(&blob);
    let raw = if label.is_empty() {
        format!("{key_type} {encoded}")
    } else {
        format!("{key_type} {encoded} {label}")
    };
    Ok(Key {
        raw,
        key_type: key_type.to_string(),
        label,
        fingerprint: fingerprint(&blob),
        has_options: false,
    })
}

const ALLOWED_TYPES: [&str; 7] = [
    "ssh-ed25519",
    "ecdsa-sha2-nistp256",
    "ecdsa-sha2-nistp384",
    "ecdsa-sha2-nistp521",
    "ssh-rsa",
    "sk-ssh-ed25519@openssh.com",
    "sk-ecdsa-sha2-nistp256@openssh.com",
];

fn check_blob(key_type: &str, blob: &[u8]) -> std::result::Result<(), &'static str> {
    let mut r = Wire(blob);
    if r.string() != Some(key_type.as_bytes()) {
        return Err("the key data does not match its type");
    }
    let ok = match key_type {
        "ssh-ed25519" => r.string().is_some_and(|k| k.len() == 32),
        "sk-ssh-ed25519@openssh.com" => {
            r.string().is_some_and(|k| k.len() == 32) && r.string().is_some()
        }
        "ecdsa-sha2-nistp256" | "ecdsa-sha2-nistp384" | "ecdsa-sha2-nistp521" => {
            let curve = &key_type["ecdsa-sha2-".len()..];
            r.string() == Some(curve.as_bytes()) && r.string().is_some_and(|p| ec_point(curve, p))
        }
        "sk-ecdsa-sha2-nistp256@openssh.com" => {
            r.string() == Some(b"nistp256".as_slice())
                && r.string().is_some_and(|p| ec_point("nistp256", p))
                && r.string().is_some()
        }
        "ssh-rsa" => {
            let e = r.mpint();
            let bits = r.mpint().map(mpint_bits);
            if e.is_none_or(|e| e.is_empty()) {
                return Err("the RSA key is malformed");
            }
            match bits {
                Some(bits) if bits < MIN_RSA_BITS => {
                    return Err("RSA keys need at least 3072 bits");
                }
                Some(bits) if bits <= MAX_RSA_BITS => true,
                _ => false,
            }
        }
        _ => false,
    };
    if !ok || !r.0.is_empty() {
        return Err("the key data is malformed");
    }
    Ok(())
}

fn ec_point(curve: &str, point: &[u8]) -> bool {
    let coordinate = match curve {
        "nistp256" => 32,
        "nistp384" => 48,
        "nistp521" => 66,
        _ => return false,
    };
    point.len() == 1 + 2 * coordinate && point[0] == 4
}

fn mpint_bits(value: &[u8]) -> usize {
    let value = match value.iter().position(|&b| b != 0) {
        Some(start) => &value[start..],
        None => return 0,
    };
    value.len() * 8 - value[0].leading_zeros() as usize
}

fn clean_label(label: &str) -> Result<String> {
    let label = label.trim();
    if label.len() > MAX_LABEL {
        return Err(AppError::BadRequest(format!(
            "the label can be at most {MAX_LABEL} characters"
        )));
    }
    if !label.chars().all(|c| c.is_ascii_graphic() || c == ' ') {
        return Err(AppError::BadRequest(
            "the label can use printable ASCII characters only".to_string(),
        ));
    }
    Ok(label.to_string())
}

/// SSH wire format reader: uint32 length-prefixed strings.
struct Wire<'a>(&'a [u8]);

impl<'a> Wire<'a> {
    fn string(&mut self) -> Option<&'a [u8]> {
        let len = u32::from_be_bytes(self.0.get(..4)?.try_into().ok()?) as usize;
        let value = self.0.get(4..4 + len)?;
        self.0 = &self.0[4 + len..];
        Some(value)
    }

    /// A non-negative mpint (a set top bit would make it negative).
    fn mpint(&mut self) -> Option<&'a [u8]> {
        let value = self.string()?;
        (value.first().is_none_or(|&b| b & 0x80 == 0)).then_some(value)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn wire(parts: &[&[u8]]) -> Vec<u8> {
        let mut out = Vec::new();
        for part in parts {
            out.extend_from_slice(&(part.len() as u32).to_be_bytes());
            out.extend_from_slice(part);
        }
        out
    }

    fn ed25519_line(seed: u8, comment: &str) -> String {
        let blob = wire(&[b"ssh-ed25519", &[seed; 32]]);
        format!("ssh-ed25519 {} {comment}", STANDARD.encode(blob))
    }

    fn rsa_line(bits: usize) -> String {
        let mut n = vec![0u8; bits / 8 + 1];
        n[1] = 0x80;
        let blob = wire(&[b"ssh-rsa", &[1, 0, 1], &n]);
        format!("ssh-rsa {}", STANDARD.encode(blob))
    }

    #[test]
    fn accepts_an_ed25519_key_and_takes_its_comment_as_label() {
        let key = parse_new_key(&ed25519_line(7, "laptop"), None).unwrap();
        assert_eq!(key.key_type, "ssh-ed25519");
        assert_eq!(key.label, "laptop");
        assert!(key.fingerprint.starts_with("SHA256:"));
        assert!(key.raw.ends_with(" laptop"));
    }

    #[test]
    fn an_explicit_label_replaces_the_comment() {
        let key = parse_new_key(&ed25519_line(7, "laptop"), Some("work desk")).unwrap();
        assert_eq!(key.label, "work desk");
        assert!(key.raw.ends_with(" work desk"));
    }

    #[test]
    fn rejects_options_other_types_and_bad_data() {
        let line = ed25519_line(1, "x");
        for bad in [
            format!("command=\"/bin/sh\" {line}"),
            line.replace("ssh-ed25519 ", "ssh-dss "),
            "ssh-ed25519 notbase64!".to_string(),
            format!("{line}\n{line}"),
            format!(
                "ssh-ed25519 {}",
                STANDARD.encode(wire(&[b"ssh-ed25519", &[1; 31]]))
            ),
            format!(
                "ssh-ed25519 {}",
                STANDARD.encode(wire(&[b"ssh-rsa", &[1; 32]]))
            ),
        ] {
            assert!(parse_new_key(&bad, None).is_err(), "{bad}");
        }
        assert!(parse_new_key(&line, Some("bad\tlabel")).is_err());
    }

    #[test]
    fn rsa_needs_3072_bits() {
        assert!(parse_new_key(&rsa_line(2048), None).is_err());
        assert!(parse_new_key(&rsa_line(3072), None).is_ok());
    }

    #[test]
    fn ecdsa_point_must_match_the_curve() {
        let mut point = vec![4u8; 65];
        point[1] = 9;
        let good = wire(&[b"ecdsa-sha2-nistp256", b"nistp256", &point]);
        let wrong_curve = wire(&[b"ecdsa-sha2-nistp256", b"nistp384", &point]);
        assert!(
            parse_new_key(
                &format!("ecdsa-sha2-nistp256 {}", STANDARD.encode(good)),
                None
            )
            .is_ok()
        );
        assert!(
            parse_new_key(
                &format!("ecdsa-sha2-nistp256 {}", STANDARD.encode(wrong_curve)),
                None
            )
            .is_err()
        );
    }

    #[test]
    fn existing_lines_are_listed_and_kept() {
        let text = format!(
            "# managed\n{}\nfrom=\"10.0.0.0/8\",no-pty {}\ngarbage line\n",
            ed25519_line(1, "a"),
            ed25519_line(2, "b c")
        );
        let lines: Vec<Line> = text.lines().map(parse_line).collect();
        let keys: Vec<_> = lines.iter().filter_map(Line::info).collect();
        assert_eq!(keys.len(), 2);
        assert_eq!(keys[0].label, "a");
        assert!(!keys[0].has_options);
        assert_eq!(keys[1].label, "b c");
        assert!(keys[1].has_options);
        let rewritten: Vec<&str> = lines.iter().map(Line::text).collect();
        assert_eq!(rewritten.join("\n") + "\n", text);
    }

    #[test]
    fn write_and_read_round_trip_with_private_permissions() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("ssh/authorized_keys");
        let key = parse_new_key(&ed25519_line(3, "k"), None).unwrap();
        write_lines(
            &path,
            &[Line::Other("# kept".into()), Line::Key(key.clone())],
        )
        .unwrap();
        let mode = fs::metadata(&path).unwrap().permissions().mode() & 0o777;
        assert_eq!(mode, 0o600);
        let dir_mode = fs::metadata(path.parent().unwrap())
            .unwrap()
            .permissions()
            .mode()
            & 0o777;
        assert_eq!(dir_mode, 0o700);
        let lines = read_lines(&path).unwrap();
        assert_eq!(lines[1].info().unwrap().fingerprint, key.fingerprint);
    }

    #[tokio::test]
    async fn a_registered_key_turns_password_logins_off() {
        let dir = tempfile::tempdir().unwrap();
        let root = dir.path().canonicalize().unwrap();
        let mut config = crate::config::Config::default();
        config.paths.account_file = root.join("pwd");
        config.paths.ssh_authorized_keys = root.join("ssh/authorized_keys");
        config.paths.ssh_keys_only_flag = root.join("ssh_keys_only");
        let state = AppState::new(config).await.unwrap();
        state
            .accounts
            .set_account("operator", "correct horse battery")
            .unwrap();
        let flag = state.config.paths.ssh_keys_only_flag.clone();
        let keys = state.config.paths.ssh_authorized_keys.clone();

        sync_keys_only(&state).await;
        assert!(!flag.exists());

        let key = parse_new_key(&ed25519_line(4, "k"), None).unwrap();
        write_lines(&keys, &[Line::Other("# not a key".into()), Line::Key(key)]).unwrap();
        sync_keys_only(&state).await;
        assert!(flag.exists());

        write_lines(&keys, &[Line::Other("# not a key".into())]).unwrap();
        sync_keys_only(&state).await;
        assert!(!flag.exists());
    }

    #[test]
    fn the_flag_follows_the_wanted_state() {
        let dir = tempfile::tempdir().unwrap();
        let flag = dir.path().join("ssh_keys_only");
        assert!(set_flag(&flag, true).unwrap());
        assert!(flag.exists());
        assert!(!set_flag(&flag, true).unwrap());
        assert!(set_flag(&flag, false).unwrap());
        assert!(!flag.exists());
        assert!(!set_flag(&flag, false).unwrap());
    }
}
