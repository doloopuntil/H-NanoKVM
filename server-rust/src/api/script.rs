use axum::{
    Extension, Json,
    extract::{Multipart, State},
    http::HeaderMap,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use std::{
    collections::BTreeSet,
    ffi::OsStr,
    fs::{self, OpenOptions},
    io::Write,
    os::unix::fs::OpenOptionsExt,
    path::{Path, PathBuf},
    process::Stdio,
    sync::Mutex,
    time::Duration,
};
use tokio::{io::AsyncReadExt, process::Command, time};

use crate::{
    AppError, Result, auth::session::Session, error::ApiResponse, fsutil::write_0600_atomic,
    http::middleware::CurrentSession, state::AppState,
};

pub const MAX_SCRIPT_BYTES: usize = 256 * 1024;
/// Carries a terminal unlock ticket for exactly one script run.
pub const UNLOCK_HEADER: &str = "x-nanokvm-terminal-ticket";
const MAX_SCRIPT_OUTPUT_BYTES: usize = 64 * 1024;
const SCRIPT_DIRECTORY: &str = "/etc/kvm/scripts";
/// The names of the scripts the user has run: a name that is not in it was added or
/// replaced since, and the web UI warns before running it.
const APPROVED_FILE: &str = "/etc/kvm/scripts-approved.json";
const SCRIPT_TIMEOUT: Duration = Duration::from_secs(60);

#[derive(Debug, Serialize)]
pub struct GetScriptsRsp {
    pub files: Vec<String>,
    /// Scripts that were added or replaced since the user last ran them.
    pub unapproved: Vec<String>,
}

#[derive(Debug, Serialize)]
pub struct UploadScriptRsp {
    pub file: String,
}

#[derive(Debug, Deserialize)]
pub struct DeleteScriptReq {
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct RunScriptReq {
    pub name: String,
    #[serde(rename = "type")]
    pub kind: String,
}

#[derive(Debug, Serialize)]
pub struct RunScriptRsp {
    pub log: String,
}

pub async fn get_scripts() -> Result<impl IntoResponse> {
    let mut files = Vec::new();
    let dir = Path::new(SCRIPT_DIRECTORY);
    if dir.exists() {
        for entry in fs::read_dir(dir)? {
            let entry = entry?;
            let file_type = entry.file_type()?;
            if !file_type.is_file() {
                continue;
            }
            let Some(name) = entry.file_name().to_str().map(str::to_string) else {
                continue;
            };
            if is_script_name(&name) {
                files.push(name);
            }
        }
    }
    files.sort();
    let unapproved = unapproved_names(&files, &read_approved_at(Path::new(APPROVED_FILE)));

    Ok(Json(ApiResponse::ok(GetScriptsRsp { files, unapproved })))
}

// Scripts run as root, so running one passes the terminal's gate: terminal access is
// enabled, and each run consumes a fresh unlock ticket of this session, issued after
// its password was entered again. Adding a script under a new name does not need it:
// nothing executes a file in the script directory except a run. Replacing an existing
// script does, so that a script the user has run cannot be swapped by a session alone.
// A script that is new or was deleted and added again is warned about before it runs.
async fn require_terminal_unlock(
    state: &AppState,
    session: Option<&Session>,
    headers: &HeaderMap,
) -> Result<()> {
    let session = match session {
        Some(session) if !state.config.auth_disabled() && state.terminal_enabled() => session,
        _ => return Err(AppError::Forbidden("terminal is disabled".to_string())),
    };
    let ticket = headers
        .get(UNLOCK_HEADER)
        .and_then(|value| value.to_str().ok())
        .unwrap_or_default();
    if ticket.is_empty() || !state.terminal_tickets.consume(ticket, session).await {
        return Err(AppError::Forbidden(
            "terminal unlock is required".to_string(),
        ));
    }
    Ok(())
}

pub async fn upload_script(
    State(state): State<AppState>,
    session: Option<Extension<CurrentSession>>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Result<impl IntoResponse> {
    let session = session.map(|Extension(CurrentSession(session))| session);
    let mut uploaded = None;
    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|err| AppError::BadRequest(format!("invalid multipart script upload: {err}")))?
    {
        if field.name() != Some("file") {
            continue;
        }
        let filename = field
            .file_name()
            .ok_or_else(|| AppError::BadRequest("missing script filename".to_string()))?
            .to_string();
        let filename = validate_script_name(&filename)?;
        let data = field
            .bytes()
            .await
            .map_err(|err| AppError::BadRequest(format!("read script upload failed: {err}")))?;
        if data.len() > MAX_SCRIPT_BYTES {
            return Err(AppError::BadRequest("script file is too large".to_string()));
        }
        if data.is_empty() {
            return Err(AppError::BadRequest("script file is empty".to_string()));
        }

        let exists = fs::symlink_metadata(script_path(&filename)?).is_ok();
        if exists {
            require_terminal_unlock(&state, session.as_ref(), &headers).await?;
        }
        write_script_file(&filename, &data)?;
        if !exists {
            change_approved(|names| {
                names.remove(&filename);
            })?;
        }
        uploaded = Some(filename);
        break;
    }

    let file = uploaded.ok_or_else(|| AppError::BadRequest("missing script file".to_string()))?;
    Ok(Json(ApiResponse::ok(UploadScriptRsp { file })))
}

pub async fn delete_script(Json(req): Json<DeleteScriptReq>) -> Result<impl IntoResponse> {
    let path = checked_script_path(&req.name)?;
    remove_script_file(&path)?;
    change_approved(|names| {
        names.remove(&req.name);
    })?;
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn run_script(
    State(state): State<AppState>,
    session: Option<Extension<CurrentSession>>,
    headers: HeaderMap,
    Json(req): Json<RunScriptReq>,
) -> Result<impl IntoResponse> {
    let session = session.map(|Extension(CurrentSession(session))| session);
    require_terminal_unlock(&state, session.as_ref(), &headers).await?;
    let path = checked_script_path(&req.name)?;
    match req.kind.as_str() {
        "foreground" => {
            approve(&req.name)?;
            let log = run_script_foreground(&path).await?;
            Ok(Json(ApiResponse::ok(RunScriptRsp { log })))
        }
        "background" => {
            approve(&req.name)?;
            run_script_background(&path)?;
            Ok(Json(ApiResponse::ok(RunScriptRsp { log: String::new() })))
        }
        _ => Err(AppError::BadRequest("invalid script run type".to_string())),
    }
}

fn validate_script_name(name: &str) -> Result<String> {
    let name = name.trim();
    if !is_script_name(name) {
        return Err(AppError::BadRequest("invalid script filename".to_string()));
    }
    if name.contains('/') || name.contains('\\') || name == "." || name == ".." {
        return Err(AppError::BadRequest("invalid script filename".to_string()));
    }
    if !name
        .bytes()
        .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'_' | b'-'))
    {
        return Err(AppError::BadRequest("invalid script filename".to_string()));
    }
    Ok(name.to_string())
}

fn is_script_name(name: &str) -> bool {
    let lower = name.to_ascii_lowercase();
    (lower.ends_with(".sh") || lower.ends_with(".py")) && name.len() <= 128 && name.len() > 3
}

fn script_path(name: &str) -> Result<PathBuf> {
    Ok(Path::new(SCRIPT_DIRECTORY).join(validate_script_name(name)?))
}

fn checked_script_path(name: &str) -> Result<PathBuf> {
    let path = script_path(name)?;
    let metadata = fs::symlink_metadata(&path)?;
    if metadata.file_type().is_symlink() || !metadata.is_file() {
        return Err(AppError::BadRequest("invalid script file".to_string()));
    }
    Ok(path)
}

// The names the user has run. An unreadable or malformed file counts as empty, so every
// script is warned about once more.
fn read_approved_at(path: &Path) -> BTreeSet<String> {
    fs::read(path)
        .ok()
        .and_then(|data| serde_json::from_slice(&data).ok())
        .unwrap_or_default()
}

fn unapproved_names(files: &[String], approved: &BTreeSet<String>) -> Vec<String> {
    files
        .iter()
        .filter(|name| !approved.contains(*name))
        .cloned()
        .collect()
}

fn change_approved_at(path: &Path, change: impl FnOnce(&mut BTreeSet<String>)) -> Result<()> {
    static LOCK: Mutex<()> = Mutex::new(());
    let _guard = LOCK.lock().unwrap_or_else(|poisoned| poisoned.into_inner());
    let mut names = read_approved_at(path);
    let before = names.clone();
    change(&mut names);
    if names == before {
        return Ok(());
    }
    let data = serde_json::to_vec(&names)
        .map_err(|err| AppError::Internal(format!("encode approved scripts: {err}")))?;
    write_0600_atomic(path, &data)
}

fn change_approved(change: impl FnOnce(&mut BTreeSet<String>)) -> Result<()> {
    change_approved_at(Path::new(APPROVED_FILE), change)
}

fn approve(name: &str) -> Result<()> {
    change_approved(|names| {
        names.insert(name.to_string());
    })
}

fn write_script_file(name: &str, data: &[u8]) -> Result<()> {
    fs::create_dir_all(SCRIPT_DIRECTORY)?;
    let path = script_path(name)?;
    if let Ok(metadata) = fs::symlink_metadata(&path)
        && metadata.file_type().is_symlink()
    {
        return Err(AppError::BadRequest("invalid script file".to_string()));
    }

    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .mode(0o755)
        .custom_flags(nix::libc::O_NOFOLLOW)
        .open(&path)?;
    file.write_all(data)?;
    file.flush()?;
    Ok(())
}

fn remove_script_file(path: &Path) -> Result<()> {
    fs::remove_file(path)?;
    Ok(())
}

async fn run_script_foreground(path: &Path) -> Result<String> {
    let mut child = script_command(path)?
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true)
        .spawn()?;

    let mut stdout = child.stdout.take().expect("stdout piped");
    let mut stderr = child.stderr.take().expect("stderr piped");
    let stdout_task = tokio::spawn(async move { read_limited(&mut stdout).await });
    let stderr_task = tokio::spawn(async move { read_limited(&mut stderr).await });
    let status = time::timeout(SCRIPT_TIMEOUT, child.wait())
        .await
        .map_err(|_| AppError::Internal("script timed out".to_string()))??;
    let stdout = stdout_task
        .await
        .map_err(|err| AppError::Internal(format!("script stdout task failed: {err}")))??;
    let stderr = stderr_task
        .await
        .map_err(|err| AppError::Internal(format!("script stderr task failed: {err}")))??;

    let mut output = stdout;
    output.extend_from_slice(&stderr);
    if !status.success() {
        return Err(AppError::Internal("run script failed".to_string()));
    }
    Ok(String::from_utf8_lossy(&output).to_string())
}

fn run_script_background(path: &Path) -> Result<()> {
    script_command(path)?
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()?;
    Ok(())
}

fn script_command(path: &Path) -> Result<Command> {
    let extension = path
        .extension()
        .and_then(OsStr::to_str)
        .unwrap_or_default()
        .to_ascii_lowercase();
    if extension == "py" {
        let mut command = Command::new("python");
        command.arg(path);
        Ok(command)
    } else if extension == "sh" {
        Ok(Command::new(path))
    } else {
        Err(AppError::BadRequest("invalid script filename".to_string()))
    }
}

async fn read_limited<R>(reader: &mut R) -> std::io::Result<Vec<u8>>
where
    R: tokio::io::AsyncRead + Unpin,
{
    let mut out = Vec::new();
    let mut chunk = [0_u8; 4096];
    loop {
        let n = reader.read(&mut chunk).await?;
        if n == 0 {
            break;
        }
        let remaining = MAX_SCRIPT_OUTPUT_BYTES.saturating_sub(out.len());
        if remaining == 0 {
            break;
        }
        out.extend_from_slice(&chunk[..n.min(remaining)]);
    }
    Ok(out)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accepts_simple_script_names() {
        assert_eq!(validate_script_name("test.sh").unwrap(), "test.sh");
        assert_eq!(
            validate_script_name("hello_world-1.py").unwrap(),
            "hello_world-1.py"
        );
    }

    #[test]
    fn rejects_unsafe_script_names() {
        assert!(validate_script_name("../x.sh").is_err());
        assert!(validate_script_name("x.txt").is_err());
        assert!(validate_script_name("bad name.sh").is_err());
        assert!(validate_script_name("x.sh/evil").is_err());
    }

    #[test]
    fn the_approved_list_keeps_the_names_that_were_run_and_survives_garbage() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("approved.json");
        assert!(read_approved_at(&path).is_empty());
        change_approved_at(&path, |names| {
            names.insert("a.sh".to_string());
            names.insert("b.py".to_string());
        })
        .unwrap();
        change_approved_at(&path, |names| {
            names.remove("a.sh");
        })
        .unwrap();
        assert_eq!(
            read_approved_at(&path).into_iter().collect::<Vec<_>>(),
            vec!["b.py".to_string()]
        );
        fs::write(&path, b"not json").unwrap();
        assert!(read_approved_at(&path).is_empty());
    }

    #[test]
    fn a_script_that_was_not_run_is_listed_as_unapproved() {
        let files = vec!["a.sh".to_string(), "b.sh".to_string(), "c.py".to_string()];
        let approved: BTreeSet<String> = ["b.sh".to_string()].into_iter().collect();
        assert_eq!(unapproved_names(&files, &approved), vec!["a.sh", "c.py"]);
        assert!(unapproved_names(&files, &BTreeSet::new()).len() == 3);
    }

    #[tokio::test]
    async fn running_a_script_needs_terminal_access_and_a_fresh_unlock_of_this_session() {
        use std::sync::atomic::Ordering;
        let mut config = crate::config::Config {
            stun: "disable".into(),
            ..crate::config::Config::default()
        };
        config.security.allow_terminal = true;
        let state = AppState::new(config).await.unwrap();
        let session = state.sessions.issue("admin", 60).await;
        let other = state.sessions.issue("admin", 60).await;
        let header = |ticket: &str| {
            let mut headers = HeaderMap::new();
            headers.insert(UNLOCK_HEADER, ticket.parse().unwrap());
            headers
        };
        let refused = |result: Result<()>| matches!(result, Err(AppError::Forbidden(_)));
        assert!(refused(
            require_terminal_unlock(&state, None, &HeaderMap::new()).await
        ));
        assert!(refused(
            require_terminal_unlock(&state, Some(&session), &HeaderMap::new()).await
        ));
        let foreign = state.terminal_tickets.issue(&other, 120).await;
        assert!(refused(
            require_terminal_unlock(&state, Some(&session), &header(&foreign.token)).await
        ));
        // A fresh ticket of this session admits exactly one operation.
        let ticket = state.terminal_tickets.issue(&session, 120).await;
        require_terminal_unlock(&state, Some(&session), &header(&ticket.token))
            .await
            .unwrap();
        assert!(refused(
            require_terminal_unlock(&state, Some(&session), &header(&ticket.token)).await
        ));
        // With terminal access off, even a fresh ticket is refused.
        state.terminal_enabled.store(false, Ordering::SeqCst);
        let ticket = state.terminal_tickets.issue(&session, 120).await;
        assert!(refused(
            require_terminal_unlock(&state, Some(&session), &header(&ticket.token)).await
        ));
    }
}
