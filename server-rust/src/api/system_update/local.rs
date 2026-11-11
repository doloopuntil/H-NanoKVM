//! Local trust for system updates: one operator-registered public key and an
//! offline bundle upload, so a device can be updated without the release
//! channel or an SD-card reflash.

use axum::{
    Extension, Json,
    extract::{Multipart, Query, State},
    http::{HeaderMap, header},
    response::IntoResponse,
};
use base64::engine::general_purpose::STANDARD;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    fs,
    io::{self, Read},
    os::unix::fs::PermissionsExt,
    path::{Path, PathBuf},
};
use tokio::fs as tokio_fs;

use super::*;
use crate::{
    api::account::{require_second_factor, verify_password_limited},
    api::upload::{self, UploadLimits},
    fsutil::write_0600_atomic,
    http::{middleware::CurrentSession, proxy::ClientInfo},
    system::audit,
};

pub const LOCAL_KEY_ID: &str = "local";
const PEM_BEGIN: &str = "-----BEGIN PUBLIC KEY-----";
const PEM_END: &str = "-----END PUBLIC KEY-----";
const MAX_LOCAL_KEY_BYTES: usize = 8 * 1024;
const MAX_UPLOAD_METADATA_BYTES: usize = 64 * 1024;
const MAX_UPLOAD_SIGNATURE_BYTES: usize = 16 * 1024;
const UPLOAD_PART_NAME: &str = "upload.part";
const UPLOAD_ARCHIVE_NAME: &str = "upload-archive.part";
const BUNDLE_OVERHEAD_BYTES: u64 = 1024 * 1024;
// The bundle and the archive unpacked from it exist together for a moment.
const UPLOAD_LIMITS: UploadLimits = UploadLimits {
    max_bytes: MAX_SYSTEM_UPDATE_BYTES + BUNDLE_OVERHEAD_BYTES,
    space_factor: 2,
};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LocalKeyRsp {
    pub configured: bool,
    pub fingerprint: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetLocalKeyReq {
    pub password: String,
    pub public_key: String,
    /// Second factor, needed when the account has one.
    #[serde(default)]
    pub code: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RemoveLocalKeyReq {
    pub password: String,
    #[serde(default)]
    pub code: Option<String>,
}

pub async fn get_local_key(State(state): State<AppState>) -> Result<impl IntoResponse> {
    let path = state.config.paths.system_update_local_public_key.clone();
    let rsp = task::spawn_blocking(move || read_local_key_info(&path))
        .await
        .map_err(|err| AppError::Internal(format!("local key task failed: {err}")))??;
    Ok(Json(ApiResponse::ok(rsp)))
}

pub async fn set_local_key(
    State(state): State<AppState>,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    client: ClientInfo,
    Json(req): Json<SetLocalKeyReq>,
) -> Result<impl IntoResponse> {
    verify_password_limited(
        &state,
        &client.source_ip(),
        &session.username,
        &req.password,
    )
    .await?;
    require_second_factor(
        &state,
        &session.username,
        &client.source_ip(),
        req.code.as_deref(),
    )
    .await?;
    let der = parse_public_key_pem(&req.public_key)?;
    check_public_key_with_openssl(&req.public_key).await?;

    let path = state.config.paths.system_update_local_public_key.clone();
    let pem = normalized_pem(&der);
    let rsp = task::spawn_blocking(move || {
        write_0600_atomic(&path, pem.as_bytes())?;
        read_local_key_info(&path)
    })
    .await
    .map_err(|err| AppError::Internal(format!("local key task failed: {err}")))??;

    audit::system_update_local_key_set(&session.username);
    Ok(Json(ApiResponse::ok(rsp)))
}

pub async fn remove_local_key(
    State(state): State<AppState>,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    client: ClientInfo,
    Json(req): Json<RemoveLocalKeyReq>,
) -> Result<impl IntoResponse> {
    verify_password_limited(
        &state,
        &client.source_ip(),
        &session.username,
        &req.password,
    )
    .await?;
    require_second_factor(
        &state,
        &session.username,
        &client.source_ip(),
        req.code.as_deref(),
    )
    .await?;
    let path = state.config.paths.system_update_local_public_key.clone();
    task::spawn_blocking(move || remove_file_if_exists(&path))
        .await
        .map_err(|err| AppError::Internal(format!("local key task failed: {err}")))??;

    audit::system_update_local_key_removed(&session.username);
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

#[derive(Debug, Deserialize)]
pub struct UploadCheckQuery {
    size: Option<u64>,
}

/// Runs the checks the upload makes before it reads any data, so the browser can
/// refuse a file with a readable message. A rejection after the browser has
/// started sending the body reaches it as a bare connection reset instead.
pub async fn upload_check(
    State(state): State<AppState>,
    Query(query): Query<UploadCheckQuery>,
) -> Result<impl IntoResponse> {
    ensure_local_key(&state.config.paths.system_update_local_public_key)?;
    upload_preflight(&state.config.paths.update_cache_dir, query.size)?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

fn upload_preflight(cache_dir: &Path, upload_len: Option<u64>) -> Result<()> {
    crate::api::storage::ensure_writable(cache_dir)?;
    if SYSTEM_UPDATE_LOCK.lock().map(|busy| *busy).unwrap_or(false) {
        return Err(AppError::Conflict(
            "system update already in progress".to_string(),
        ));
    }
    upload::check_size_and_space(cache_dir, upload_len, &UPLOAD_LIMITS)
}

/// Stage a system bundle uploaded from the browser.
///
/// The multipart field `file` is one bundle (`.tar`, or gzip-compressed) that
/// holds `system-latest.json`, its detached `system-latest.json.sig` (absent
/// for unsigned metadata) and the system archive. The staged result is installed through the normal install route.
pub async fn upload(
    State(state): State<AppState>,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Result<impl IntoResponse> {
    ensure_local_key(&state.config.paths.system_update_local_public_key)?;
    crate::api::storage::ensure_writable(&state.config.paths.update_cache_dir)?;
    let guard = acquire_update_lock()?;
    let config = Config::read().unwrap_or_else(|err| {
        tracing::warn!(error = %err, "failed to refresh config before system update upload");
        (*state.config).clone()
    });
    let current = read_current_system_version();
    let stage_dir = system_stage_dir(&state.config.paths.update_cache_dir);

    let prepare_dir = stage_dir.clone();
    run_blocking_system_update("prepare system update staging", move || {
        prepare_stage_dir(&prepare_dir)
    })
    .await?;

    let upload_len = headers
        .get(header::CONTENT_LENGTH)
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.parse::<u64>().ok());
    let staged = stage_upload(
        &config,
        &current,
        &stage_dir,
        &mut multipart,
        upload_len,
        guard,
        &session.username,
    )
    .await;
    match staged {
        Ok(rsp) => {
            let _ = remove_update_progress(&stage_dir);
            Ok(Json(ApiResponse::ok(rsp)))
        }
        Err(err) => {
            let _ = remove_dir_if_exists(&stage_dir);
            Err(err)
        }
    }
}

async fn stage_upload(
    config: &Config,
    current: &SystemVersion,
    stage_dir: &Path,
    multipart: &mut Multipart,
    upload_len: Option<u64>,
    guard: UpdateGuard,
    username: &str,
) -> Result<SystemDownloadRsp> {
    upload::check_size_and_space(stage_dir, upload_len, &UPLOAD_LIMITS)?;
    let parts = receive_upload(stage_dir, multipart).await?;

    let latest: SystemLatest = serde_json::from_slice(&parts.metadata)
        .map_err(|err| AppError::BadRequest(format!("invalid system-latest.json: {err}")))?;
    validate_latest_system(&latest)?;
    let signer = authorize_upload(config, &parts, &latest).await?;

    enforce_required_application_version(&latest)?;
    if latest.target != current.target {
        return Err(AppError::BadRequest(format!(
            "system update target mismatch: device {}, bundle {}",
            current.target, latest.target
        )));
    }
    // Local and unsigned builds may repeat or lower a version; release-key
    // bundles keep the forward-only rule.
    if !matches!(
        signer.as_str(),
        LOCAL_KEY_ID | SYSTEM_UPDATE_UNSIGNED_ALGORITHM
    ) && !system_update_is_newer(current, &latest)
    {
        return Err(AppError::BadRequest(format!(
            "no newer system update: current {}, bundle {}",
            current.version, latest.version
        )));
    }

    let archive = stage_dir.join(&latest.name);
    fs::rename(&parts.archive, &archive)?;

    let stage_dir = stage_dir.to_path_buf();
    let record_latest = latest.clone();
    let record_signer = signer.clone();
    let staged = run_blocking_system_update_with_guard(
        "verify and stage uploaded system update",
        guard,
        move || {
            let archive = stage_dir.join(&record_latest.name);
            verify_system_archive(&archive, &record_latest)?;
            let manifest = extract_and_verify_system_bundle(&archive, &stage_dir, &record_latest)?;
            let record = SystemStageRecord {
                staged_at: now_unix_seconds(),
                latest: record_latest,
                manifest,
                signer: Some(record_signer),
            };
            write_stage_record(&stage_dir, &record)?;
            Ok(staged_summary(&record))
        },
    )
    .await?;

    audit::system_update_uploaded(username, &signer, &latest.version);
    Ok(SystemDownloadRsp {
        current: current.clone(),
        latest,
        staged,
    })
}

struct UploadParts {
    archive: PathBuf,
    metadata: Vec<u8>,
    signature: Option<Vec<u8>>,
}

async fn receive_upload(stage_dir: &Path, multipart: &mut Multipart) -> Result<UploadParts> {
    let mut bundle = None;

    while let Some(mut field) = multipart
        .next_field()
        .await
        .map_err(|err| AppError::BadRequest(format!("invalid multipart data: {err}")))?
    {
        if field.name() != Some("file") {
            continue;
        }
        let target = stage_dir.join(UPLOAD_PART_NAME);
        let file = tokio_fs::File::create(&target).await?;
        let received =
            upload::receive_field(&mut field, file, UPLOAD_LIMITS.max_bytes, false, |_| Ok(()))
                .await?;
        if received.bytes == 0 {
            return Err(AppError::BadRequest(
                "empty system update bundle".to_string(),
            ));
        }
        bundle = Some(target);
    }

    let bundle = bundle
        .ok_or_else(|| AppError::BadRequest("no system update bundle uploaded".to_string()))?;
    let stage_dir = stage_dir.to_path_buf();
    task::spawn_blocking(move || {
        let parts = unwrap_bundle(&bundle, &stage_dir);
        let _ = fs::remove_file(&bundle);
        parts
    })
    .await
    .map_err(|err| AppError::Internal(format!("bundle unwrap task failed: {err}")))?
}

/// Unpack the outer bundle: `system-latest.json`, an optional
/// `system-latest.json.sig` and exactly one system archive. Nothing else is
/// accepted, and entry names are matched exactly, never joined into a path.
fn unwrap_bundle(bundle: &Path, stage_dir: &Path) -> Result<UploadParts> {
    let mut magic = [0_u8; 2];
    fs::File::open(bundle)?.read_exact(&mut magic)?;
    let file = fs::File::open(bundle)?;
    let reader: Box<dyn Read> = if magic == [0x1f, 0x8b] {
        Box::new(flate2::read::GzDecoder::new(file))
    } else {
        Box::new(file)
    };

    let mut metadata = None;
    let mut signature = None;
    let mut archive = None;
    let mut tar = tar::Archive::new(reader);
    for entry in tar
        .entries()
        .map_err(|err| AppError::BadRequest(format!("invalid system update bundle: {err}")))?
    {
        let mut entry = entry
            .map_err(|err| AppError::BadRequest(format!("invalid system update bundle: {err}")))?;
        if !entry.header().entry_type().is_file() {
            return Err(AppError::BadRequest(
                "system update bundle may hold regular files only".to_string(),
            ));
        }
        let name = entry
            .path()
            .ok()
            .and_then(|path| {
                path.to_str()
                    .map(|name| name.trim_start_matches("./").to_string())
            })
            .ok_or_else(|| {
                AppError::BadRequest("invalid system update bundle entry".to_string())
            })?;
        match name.as_str() {
            "system-latest.json" => {
                metadata = Some(read_bounded(&mut entry, MAX_UPLOAD_METADATA_BYTES, &name)?);
            }
            "system-latest.json.sig" => {
                signature = Some(read_bounded(&mut entry, MAX_UPLOAD_SIGNATURE_BYTES, &name)?);
            }
            _ if archive.is_none() && validate_system_archive_name(&name).is_ok() => {
                let target = stage_dir.join(UPLOAD_ARCHIVE_NAME);
                let mut out = fs::File::create(&target)?;
                let copied = io::copy(
                    &mut (&mut entry).take(MAX_SYSTEM_UPDATE_BYTES + 1),
                    &mut out,
                )?;
                if copied == 0 || copied > MAX_SYSTEM_UPDATE_BYTES {
                    return Err(AppError::BadRequest(
                        "invalid system update archive size".to_string(),
                    ));
                }
                out.sync_all()?;
                archive = Some(target);
            }
            _ => {
                return Err(AppError::BadRequest(format!(
                    "unexpected entry in system update bundle: {name}"
                )));
            }
        }
    }

    Ok(UploadParts {
        archive: archive
            .ok_or_else(|| AppError::BadRequest("bundle holds no system archive".to_string()))?,
        metadata: metadata.filter(|data| !data.is_empty()).ok_or_else(|| {
            AppError::BadRequest("bundle holds no system-latest.json".to_string())
        })?,
        signature: signature.filter(|data| !data.is_empty()),
    })
}

fn read_bounded(reader: &mut impl Read, limit: usize, name: &str) -> Result<Vec<u8>> {
    let mut data = Vec::new();
    reader
        .take(limit as u64 + 1)
        .read_to_end(&mut data)
        .map_err(|err| AppError::BadRequest(format!("invalid system update bundle: {err}")))?;
    if data.len() > limit {
        return Err(AppError::BadRequest(format!(
            "{name} in the system update bundle is too large"
        )));
    }
    Ok(data)
}

/// Check who vouches for the uploaded metadata; returns the signer label.
async fn authorize_upload(
    config: &Config,
    parts: &UploadParts,
    latest: &SystemLatest,
) -> Result<String> {
    if system_metadata_is_unsigned(latest) {
        if !config.security.allow_unsigned_updates {
            return Err(AppError::BadRequest(
                "unsigned system update metadata is not allowed".to_string(),
            ));
        }
        tracing::warn!(version = %latest.version, "accepting unsigned uploaded system update");
        return Ok(SYSTEM_UPDATE_UNSIGNED_ALGORITHM.to_string());
    }

    let signature = parts
        .signature
        .as_deref()
        .ok_or_else(|| AppError::BadRequest("missing system update signature".to_string()))?;
    let key_id = latest.signature_key_id.as_str();
    let public_key = if key_id == LOCAL_KEY_ID {
        local_public_key_path(&config.paths.system_update_local_public_key)?
    } else {
        resolve_update_public_key(&config.paths.system_update_public_key, key_id)?
    };
    verify_system_metadata_signature(&parts.metadata, signature, &public_key).await?;
    Ok(key_id.to_string())
}

pub(crate) fn local_public_key_path(path: &Path) -> Result<PathBuf> {
    let metadata = fs::symlink_metadata(path).map_err(|_| {
        AppError::BadRequest("no local update key is registered on this device".to_string())
    })?;
    if !metadata.file_type().is_file() || metadata.permissions().mode() & 0o022 != 0 {
        return Err(AppError::Config(
            "local update key must be a regular, non-writable-by-group-or-other file".to_string(),
        ));
    }
    Ok(path.to_path_buf())
}

fn read_local_key_info(path: &Path) -> Result<LocalKeyRsp> {
    let path = match local_public_key_path(path) {
        Ok(path) => path,
        Err(_) => {
            return Ok(LocalKeyRsp {
                configured: false,
                fingerprint: None,
            });
        }
    };
    let pem = fs::read_to_string(&path)?;
    let fingerprint = parse_public_key_pem(&pem).ok().map(|der| fingerprint(&der));
    Ok(LocalKeyRsp {
        configured: true,
        fingerprint,
    })
}

fn fingerprint(der: &[u8]) -> String {
    Sha256::digest(der)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect::<Vec<_>>()
        .join(":")
}

/// Accept exactly one `PUBLIC KEY` PEM block and return its DER bytes.
fn parse_public_key_pem(pem: &str) -> Result<Vec<u8>> {
    let invalid = || AppError::BadRequest("invalid public key".to_string());
    if pem.len() > MAX_LOCAL_KEY_BYTES {
        return Err(invalid());
    }
    let lines: Vec<&str> = pem
        .lines()
        .map(str::trim)
        .filter(|l| !l.is_empty())
        .collect();
    if lines.len() < 3 || lines[0] != PEM_BEGIN || lines[lines.len() - 1] != PEM_END {
        return Err(invalid());
    }
    let body: String = lines[1..lines.len() - 1].concat();
    if !body
        .bytes()
        .all(|b| b.is_ascii_alphanumeric() || matches!(b, b'+' | b'/' | b'='))
    {
        return Err(invalid());
    }
    let der = STANDARD.decode(body).map_err(|_| invalid())?;
    if !(64..=2048).contains(&der.len()) {
        return Err(invalid());
    }
    Ok(der)
}

fn normalized_pem(der: &[u8]) -> String {
    let encoded = STANDARD.encode(der);
    let mut pem = format!("{PEM_BEGIN}\n");
    for chunk in encoded.as_bytes().chunks(64) {
        pem.push_str(std::str::from_utf8(chunk).unwrap_or_default());
        pem.push('\n');
    }
    pem.push_str(PEM_END);
    pem.push('\n');
    pem
}

async fn check_public_key_with_openssl(pem: &str) -> Result<()> {
    let path = temp_verify_path("localkey")?;
    let result = async {
        write_verify_temp_file(&path, pem.as_bytes())?;
        let output = run_allowed(
            AllowedCommand::OpenSsl,
            ["pkey", "-pubin", "-noout", "-in", path_arg(&path)?],
            METADATA_TIMEOUT,
        )
        .await?;
        if output.status == 0 {
            Ok(())
        } else {
            Err(AppError::BadRequest("invalid public key".to_string()))
        }
    }
    .await;
    let _ = remove_file_if_exists(&path);
    result
}

/// Bundles from this computer are only taken once a local update key is registered.
pub(crate) fn ensure_local_key(path: &Path) -> Result<()> {
    local_public_key_path(path).map(|_| ())
}

#[cfg(test)]
mod tests {
    #[test]
    fn bundles_need_a_registered_local_key() {
        use std::os::unix::fs::PermissionsExt;

        let dir = tempfile::tempdir().unwrap();
        let key = dir.path().join("local.pub.pem");
        assert!(super::ensure_local_key(&key).is_err());

        std::fs::write(&key, "key").unwrap();
        std::fs::set_permissions(&key, std::fs::Permissions::from_mode(0o666)).unwrap();
        assert!(super::ensure_local_key(&key).is_err());

        std::fs::set_permissions(&key, std::fs::Permissions::from_mode(0o600)).unwrap();
        assert!(super::ensure_local_key(&key).is_ok());
    }

    use super::*;

    const KEY: &str = "-----BEGIN PUBLIC KEY-----\n\
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEq7aF5pQ3Z0m1b0v2eB9mYk4Qw3xV\n\
8m1sH0cJ5uD2oQ7r3n6yT4lK9aXb1pZfE8wGhVjNc2RtUiOs5dAeLxY7gQ==\n\
-----END PUBLIC KEY-----\n";

    #[test]
    fn pem_parsing_accepts_one_public_key_block() {
        let der = parse_public_key_pem(KEY).unwrap();
        let again = parse_public_key_pem(&normalized_pem(&der)).unwrap();
        assert_eq!(der, again);
    }

    #[test]
    fn pem_parsing_rejects_other_blocks_and_garbage() {
        assert!(parse_public_key_pem("").is_err());
        assert!(parse_public_key_pem(&KEY.replace("PUBLIC KEY", "PRIVATE KEY")).is_err());
        assert!(parse_public_key_pem(&KEY.replace("MFkw", "MF!w")).is_err());
        assert!(parse_public_key_pem(&"A".repeat(MAX_LOCAL_KEY_BYTES + 1)).is_err());
    }

    fn write_bundle(path: &Path, entries: &[(&str, &[u8])]) {
        let mut builder = tar::Builder::new(fs::File::create(path).unwrap());
        for (name, data) in entries {
            let mut header = tar::Header::new_gnu();
            header.set_size(data.len() as u64);
            header.set_mode(0o644);
            header.set_cksum();
            builder.append_data(&mut header, name, *data).unwrap();
        }
        builder.finish().unwrap();
    }

    const ARCHIVE: &str = "hardened-nanokvm-system-0.1.0.tar.gz";

    #[test]
    fn bundle_unwraps_metadata_signature_and_archive() {
        let dir = tempfile::tempdir().unwrap();
        let bundle = dir.path().join("b.tar");
        write_bundle(
            &bundle,
            &[
                ("system-latest.json", b"{}"),
                ("system-latest.json.sig", b"sig"),
                (ARCHIVE, b"payload"),
            ],
        );
        let parts = unwrap_bundle(&bundle, dir.path()).unwrap();
        assert_eq!(parts.metadata, b"{}");
        assert_eq!(parts.signature.as_deref(), Some(&b"sig"[..]));
        assert_eq!(fs::read(parts.archive).unwrap(), b"payload");
    }

    #[test]
    fn bundle_without_signature_is_unsigned_candidate() {
        let dir = tempfile::tempdir().unwrap();
        let bundle = dir.path().join("b.tar");
        write_bundle(&bundle, &[("system-latest.json", b"{}"), (ARCHIVE, b"x")]);
        assert!(
            unwrap_bundle(&bundle, dir.path())
                .unwrap()
                .signature
                .is_none()
        );
    }

    #[test]
    fn bundle_rejects_extra_or_missing_entries() {
        let dir = tempfile::tempdir().unwrap();
        let bundle = dir.path().join("b.tar");
        write_bundle(
            &bundle,
            &[
                ("system-latest.json", b"{}"),
                (ARCHIVE, b"x"),
                ("extra.txt", b"x"),
            ],
        );
        assert!(unwrap_bundle(&bundle, dir.path()).is_err());
        write_bundle(&bundle, &[("system-latest.json", b"{}")]);
        assert!(unwrap_bundle(&bundle, dir.path()).is_err());
        write_bundle(&bundle, &[(ARCHIVE, b"x")]);
        assert!(unwrap_bundle(&bundle, dir.path()).is_err());
    }

    #[test]
    fn fingerprint_is_colon_separated_sha256() {
        let value = fingerprint(b"abc");
        assert_eq!(value.split(':').count(), 32);
    }
}
