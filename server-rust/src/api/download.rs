use axum::{
    Extension, Json,
    extract::{Multipart, State},
    http::{HeaderMap, header},
    response::IntoResponse,
};
use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};
use bytes::Bytes;
use rand_core::{OsRng, RngCore};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    ffi::OsString,
    fs,
    io::{ErrorKind, Read, Seek, SeekFrom, Write},
    net::IpAddr,
    os::unix::fs::{OpenOptionsExt, PermissionsExt},
    path::{Path, PathBuf},
    sync::{LazyLock, Mutex},
    time::{Duration, Instant},
};
use tokio::{
    io::{AsyncWriteExt, BufWriter},
    sync::watch,
    time,
};
use url::{Host, Url};

use crate::{
    AppError, Result,
    api::account::{require_second_factor, verify_password_limited},
    config::Config,
    error::ApiResponse,
    http::{middleware::CurrentSession, proxy::ClientInfo},
    state::AppState,
    system::{
        audit,
        command::{AllowedCommand, run_allowed},
    },
};

pub const MAX_UPLOAD_BYTES: usize = 8 * 1024 * 1024 * 1024;

const SENTINEL_PATH: &str = "/tmp/.download_in_progress";
const ISO9660_MAGIC_OFFSET: u64 = 0x8001;
const ISO9660_MAGIC: &[u8; 5] = b"CD001";
const SECTOR_SIZE: usize = 512;
const MASS_STORAGE_HEADER_BYTES: usize = 128 * 1024;
const GPT_HEADER_OFFSET: usize = SECTOR_SIZE;
const GPT_MAGIC: &[u8; 8] = b"EFI PART";
const EXT_SUPERBLOCK_MAGIC_OFFSET: usize = 1024 + 56;
const BTRFS_SUPERBLOCK_MAGIC_OFFSET: usize = 0x10040;
const BTRFS_MAGIC: &[u8; 8] = b"_BHRfS_M";
const REMOTE_DOWNLOAD_TIMEOUT: Duration = Duration::from_secs(2 * 60 * 60);
const UPLOAD_STATUS_STALE_TIMEOUT: Duration = Duration::from_secs(2 * 60);
const REMOTE_STATUS_STALE_TIMEOUT: Duration = Duration::from_secs((2 * 60 * 60) + (5 * 60));
const SHA256_HEADER: &str = "x-sha256-sum";
const CHECKSUM_QUEUE_CHUNKS: usize = 8;
const SHA256_MISMATCH: &str = "sha256 mismatch";
const REMOTE_PROGRESS_INTERVAL: Duration = Duration::from_secs(1);
const UPLOAD_PROGRESS_INTERVAL: Duration = Duration::from_secs(1);
// Batches the ~16 KiB request chunks into fewer blocking-pool writes.
const UPLOAD_WRITE_BUFFER: usize = 256 * 1024;
const CANCELED_CODE: i32 = -499;
const MAX_REDIRECTS: usize = 5;
const HOST_LOOKUP_TIMEOUT: Duration = Duration::from_secs(10);

/// Image whose remote download failed the checksum; reported once by the status
/// endpoint, because the background task has no other way to tell the UI.
static CHECKSUM_FAILURE: Mutex<Option<String>> = Mutex::new(None);

/// Bumped to ask the running remote download to stop.
static CANCEL_GENERATION: LazyLock<watch::Sender<u64>> = LazyLock::new(|| watch::channel(0).0);

#[derive(Debug, Deserialize)]
pub struct DownloadImageReq {
    #[serde(default)]
    pub file: String,
    #[serde(default)]
    pub sha256sum: String,
}

#[derive(Debug, Serialize)]
pub struct ImageEnabledRsp {
    pub enabled: bool,
    #[serde(rename = "remoteEnabled")]
    pub remote_enabled: bool,
}

#[derive(Debug, Deserialize)]
pub struct SetRemoteImageDownloadReq {
    pub enabled: bool,
    /// Needed to turn it on, with a second-factor code when the account has one.
    #[serde(default)]
    pub password: Option<String>,
    #[serde(default)]
    pub code: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct StatusImageRsp {
    pub status: String,
    pub file: String,
    pub percentage: String,
    /// Bytes received so far; 0 when unknown.
    pub written: u64,
}

pub async fn image_enabled(State(state): State<AppState>) -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(ImageEnabledRsp {
        enabled: storage_writable(&state.config.paths.image_directory),
        remote_enabled: state.remote_image_download_enabled(),
    })))
}

pub async fn get_remote_image_download_enabled(
    State(state): State<AppState>,
) -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(ImageEnabledRsp {
        enabled: storage_writable(&state.config.paths.image_directory),
        remote_enabled: state.remote_image_download_enabled(),
    })))
}

pub async fn set_remote_image_download_enabled(
    State(state): State<AppState>,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    client: ClientInfo,
    Json(req): Json<SetRemoteImageDownloadReq>,
) -> Result<impl IntoResponse> {
    // Turning it off needs only the session. Turning it on lets the device fetch URLs, and
    // downloads themselves need no password, so this is the one gate.
    let source_ip = client.source_ip();
    if req.enabled {
        let password = req.password.as_deref().ok_or_else(|| {
            AppError::BadRequest(
                "the password is required to enable remote image download".to_string(),
            )
        })?;
        verify_password_limited(&state, &source_ip, &session.username, password).await?;
        require_second_factor(&state, &session.username, &source_ip, req.code.as_deref()).await?;
    }

    let mut config = Config::read()?;
    config.security.allow_remote_image_download = req.enabled;
    config.write()?;
    state.set_remote_image_download_enabled(req.enabled);
    audit::remote_download_changed(&session.username, &source_ip, req.enabled);

    Ok(Json(ApiResponse::<()>::ok_empty()))
}

/// Whether an image download or upload is running.
pub fn transfer_in_progress() -> bool {
    read_status_image(Path::new(SENTINEL_PATH))
        .map(|status| status.status == "in_progress")
        .unwrap_or(false)
}

pub async fn status_image() -> Result<impl IntoResponse> {
    let status = read_status_image(Path::new(SENTINEL_PATH))?;
    if status.status == "idle"
        && let Some(file) = take_checksum_failure()
    {
        return Ok(Json(ApiResponse::ok(StatusImageRsp::checksum_failed(file))));
    }
    Ok(Json(ApiResponse::ok(status)))
}

pub async fn download_image(
    State(state): State<AppState>,
    Json(req): Json<DownloadImageReq>,
) -> Result<Json<ApiResponse<StatusImageRsp>>> {
    if !state.remote_image_download_enabled() {
        return Err(AppError::Api {
            code: -403,
            msg: "remote image download is disabled".to_string(),
        });
    }

    crate::api::storage::ensure_writable(&state.config.paths.image_directory)?;
    let expected_sha256 = parse_sha256(&req.sha256sum)?;
    let remote = validate_remote_iso_url(&req.file)?;
    // refuse a private host now, so the answer is immediate; every hop is checked again
    pin_public_host(
        &Url::parse(&remote.url).map_err(|_| AppError::BadRequest("invalid url".into()))?,
    )
    .await?;
    let target = safe_upload_target(&state.config.paths.image_directory, &remote.filename)?;
    ensure_not_mounted(&target)?;
    let guard = DownloadGuard::acquire(&remote.url)?;
    let root = state.config.paths.image_directory.clone();

    tokio::spawn(async move {
        match download_remote_iso(remote, root, target, expected_sha256, guard).await {
            Ok(()) => {}
            Err(AppError::Api {
                code: CANCELED_CODE,
                ..
            }) => tracing::info!("remote ISO download canceled"),
            Err(err) => tracing::error!(error = %err, "remote ISO download failed"),
        }
    });

    Ok(Json(ApiResponse::ok(StatusImageRsp {
        status: "in_progress".to_string(),
        file: req.file,
        percentage: String::new(),
        written: 0,
    })))
}

/// Stops the running remote download; uploads are canceled by the browser.
pub async fn cancel_download() -> Result<impl IntoResponse> {
    let status = read_status_image(Path::new(SENTINEL_PATH))?;
    if status.status != "in_progress" || !is_remote_status_label(&status.file) {
        return Err(AppError::Conflict(
            "no remote download is running".to_string(),
        ));
    }

    CANCEL_GENERATION.send_modify(|generation| *generation += 1);
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

pub async fn upload_image_file(
    State(state): State<AppState>,
    headers: HeaderMap,
    mut multipart: Multipart,
) -> Result<impl IntoResponse> {
    let content_length = headers
        .get(header::CONTENT_LENGTH)
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.parse::<u64>().ok());
    if content_length
        .map(|len| len as usize > MAX_UPLOAD_BYTES + 1024 * 1024)
        .unwrap_or(false)
    {
        return Err(AppError::BadRequest("upload is too large".to_string()));
    }

    crate::api::storage::ensure_writable(&state.config.paths.image_directory)?;
    let expected_sha256 = parse_sha256(
        headers
            .get(SHA256_HEADER)
            .and_then(|value| value.to_str().ok())
            .unwrap_or_default(),
    )?;
    let guard = DownloadGuard::acquire("upload")?;
    let mut uploaded = false;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|err| AppError::BadRequest(format!("invalid multipart data: {err}")))?
    {
        if field.name() != Some("file") {
            continue;
        }
        if uploaded {
            return Err(AppError::BadRequest(
                "only one file upload is allowed".to_string(),
            ));
        }

        let filename = valid_upload_filename(field.file_name().unwrap_or_default())?;
        guard.update(&filename, 0, content_length)?;

        let target = safe_upload_target(&state.config.paths.image_directory, &filename)?;
        ensure_not_mounted(&target)?;
        let mut temp = TempUpload::create(&state.config.paths.image_directory, &filename)?;
        let mut file = BufWriter::with_capacity(UPLOAD_WRITE_BUFFER, temp.open()?);
        let mut total = 0_usize;
        let mut reported = Instant::now();
        let checksum = expected_sha256.map(|_| ChecksumWorker::spawn());
        let mut field = field;

        while let Some(chunk) = field
            .chunk()
            .await
            .map_err(|err| AppError::BadRequest(format!("invalid multipart chunk: {err}")))?
        {
            total = total.saturating_add(chunk.len());
            if total > MAX_UPLOAD_BYTES {
                return Err(AppError::BadRequest("upload is too large".to_string()));
            }
            if let Some(worker) = &checksum {
                worker.feed(chunk.clone()).await?;
            }
            file.write_all(&chunk).await?;
            if reported.elapsed() >= UPLOAD_PROGRESS_INTERVAL {
                guard.update(&filename, total as u64, content_length)?;
                reported = Instant::now();
            }
        }
        file.flush().await?;
        drop(file);

        if let (Some(expected), Some(worker)) = (expected_sha256, checksum)
            && worker.finish().await? != expected
        {
            return Err(AppError::BadRequest(SHA256_MISMATCH.to_string()));
        }

        validate_uploaded_image(temp.path(), &filename)?;

        // The image may have been mounted while it uploaded.
        ensure_not_mounted(&target)?;
        fs::rename(temp.path(), &target)?;
        fs::set_permissions(&target, fs::Permissions::from_mode(0o644))?;
        temp.keep();
        uploaded = true;
    }

    if !uploaded {
        return Err(AppError::BadRequest("no file part found".to_string()));
    }

    drop(guard);
    Ok(Json(ApiResponse::ok(StatusImageRsp::idle())))
}

#[derive(Debug, Clone, Copy, Eq, PartialEq)]
enum UploadImageKind {
    Iso,
    MassStorage,
}

#[derive(Debug)]
struct RemoteIso {
    url: String,
    filename: String,
}

async fn download_remote_iso(
    remote: RemoteIso,
    root: PathBuf,
    target: PathBuf,
    expected_sha256: Option<[u8; 32]>,
    guard: DownloadGuard,
) -> Result<()> {
    let mut temp = TempUpload::create(&root, &remote.filename)?;
    let mut cancel = CANCEL_GENERATION.subscribe();

    // Dropping the curl future kills the process, and the guards then remove
    // the partial file and the status marker.
    let output = tokio::select! {
        output = download_remote_with_curl(&remote.url, temp.path()) => output?,
        never = report_remote_progress(&guard, &remote.url, temp.path()) => match never {},
        _ = cancel.changed() => {
            return Err(AppError::Api {
                code: CANCELED_CODE,
                msg: "download canceled".to_string(),
            });
        }
    };
    if output.status != 0 {
        return Err(AppError::Internal(command_error(
            "download remote ISO failed",
            output,
        )));
    }

    let size = fs::metadata(temp.path())?.len();
    if size == 0 || size > MAX_UPLOAD_BYTES as u64 {
        return Err(AppError::BadRequest(
            "invalid downloaded ISO size".to_string(),
        ));
    }

    if let Some(expected) = expected_sha256 {
        let path = temp.path().to_path_buf();
        let actual = tokio::task::spawn_blocking(move || sha256_file(&path))
            .await
            .map_err(|err| AppError::Internal(format!("checksum task failed: {err}")))??;
        if actual != expected {
            record_checksum_failure(&remote.filename);
            return Err(AppError::BadRequest(SHA256_MISMATCH.to_string()));
        }
    }

    if !is_iso9660(temp.path())? {
        return Err(AppError::BadRequest(
            "file is not a valid ISO image".to_string(),
        ));
    }

    ensure_not_mounted(&target)?;
    fs::rename(temp.path(), &target)?;
    fs::set_permissions(&target, fs::Permissions::from_mode(0o644))?;
    temp.keep();
    Ok(())
}

/// Publishes how much of the remote file has arrived, once a second.
async fn report_remote_progress(
    guard: &DownloadGuard,
    url: &str,
    path: &Path,
) -> std::convert::Infallible {
    let total = remote_content_length(url).await;
    loop {
        tokio::time::sleep(REMOTE_PROGRESS_INTERVAL).await;
        let written = fs::metadata(path).map(|meta| meta.len()).unwrap_or(0);
        let _ = guard.update(url, written, total);
    }
}

/// Size announced by the server, when it announces one.
async fn remote_content_length(url: &str) -> Option<u64> {
    let args = vec![
        OsString::from("--silent"),
        OsString::from("--head"),
        OsString::from("--fail"),
        OsString::from("--location"),
        OsString::from("--proto"),
        OsString::from("=http,https"),
        OsString::from("--proto-redir"),
        OsString::from("=http,https"),
        OsString::from("--max-redirs"),
        OsString::from("5"),
        OsString::from("--connect-timeout"),
        OsString::from("10"),
        OsString::from("--max-time"),
        OsString::from("15"),
        OsString::from(url),
    ];
    let output = run_allowed(AllowedCommand::Curl, args, Duration::from_secs(20))
        .await
        .ok()?;
    if output.status != 0 {
        return None;
    }

    parse_content_length(&String::from_utf8_lossy(&output.stdout))
}

/// Content-Length of the last response in a `curl --head --location` dump.
fn parse_content_length(headers: &str) -> Option<u64> {
    let headers = headers.replace("\r\n", "\n");
    let last = headers
        .split("\n\n")
        .filter(|block| !block.trim().is_empty())
        .last()?;

    last.lines()
        .filter_map(|line| line.split_once(':'))
        .find(|(name, _)| name.trim().eq_ignore_ascii_case("content-length"))
        .and_then(|(_, value)| value.trim().parse().ok())
        .filter(|length| *length > 0)
}

// Redirects are followed one hop at a time, so every hop is checked against the public
// internet before curl connects to it.
async fn download_remote_with_curl(
    url: &str,
    target: &Path,
) -> Result<crate::system::command::CommandOutput> {
    let mut current =
        Url::parse(url).map_err(|_| AppError::BadRequest("invalid url".to_string()))?;
    for _ in 0..=MAX_REDIRECTS {
        let addr = pin_public_host(&current).await?;
        let output = curl_hop(&current, addr, target).await?;
        if output.status != 0 {
            return Ok(output);
        }
        match parse_hop(&output.stdout) {
            Hop::Done => return Ok(output),
            Hop::Redirect(next) => current = checked_redirect(&next)?,
        }
    }
    Err(AppError::BadRequest("too many redirects".to_string()))
}

async fn curl_hop(
    url: &Url,
    addr: IpAddr,
    target: &Path,
) -> Result<crate::system::command::CommandOutput> {
    let host = url.host_str().unwrap_or_default();
    let port = url.port_or_known_default().unwrap_or(443);
    // pinned to the address that was checked, so the name cannot resolve elsewhere now
    let pin = match addr {
        IpAddr::V4(addr) => format!("{host}:{port}:{addr}"),
        IpAddr::V6(addr) => format!("{host}:{port}:[{addr}]"),
    };
    let args = vec![
        OsString::from("--silent"),
        OsString::from("--show-error"),
        OsString::from("--fail"),
        OsString::from("--proto"),
        OsString::from("=http,https"),
        OsString::from("--connect-timeout"),
        OsString::from("20"),
        OsString::from("--max-time"),
        OsString::from(REMOTE_DOWNLOAD_TIMEOUT.as_secs().to_string()),
        OsString::from("--speed-limit"),
        OsString::from("1024"),
        OsString::from("--speed-time"),
        OsString::from("120"),
        OsString::from("--max-filesize"),
        OsString::from(MAX_UPLOAD_BYTES.to_string()),
        OsString::from("--resolve"),
        OsString::from(pin),
        OsString::from("--write-out"),
        OsString::from("%{http_code} %{redirect_url}"),
        OsString::from("--output"),
        target.as_os_str().to_os_string(),
        OsString::from(url.as_str()),
    ];
    run_allowed(AllowedCommand::Curl, args, REMOTE_DOWNLOAD_TIMEOUT).await
}

enum Hop {
    Done,
    Redirect(String),
}

// curl prints "<status> <redirect url>" after each hop.
fn parse_hop(stdout: &[u8]) -> Hop {
    let text = String::from_utf8_lossy(stdout);
    let mut parts = text.trim().splitn(2, ' ');
    let code = parts.next().and_then(|code| code.parse::<u16>().ok());
    match (code, parts.next().map(str::trim)) {
        (Some(301 | 302 | 303 | 307 | 308), Some(next)) if !next.is_empty() => {
            Hop::Redirect(next.to_string())
        }
        _ => Hop::Done,
    }
}

fn checked_redirect(next: &str) -> Result<Url> {
    let url = Url::parse(next).map_err(|_| AppError::BadRequest("invalid redirect".to_string()))?;
    if !matches!(url.scheme(), "http" | "https")
        || url.host_str().is_none()
        || !url.username().is_empty()
        || url.password().is_some()
    {
        return Err(AppError::BadRequest("invalid redirect".to_string()));
    }
    Ok(url)
}

const NOT_PUBLIC: &str = "remote images can only be fetched from public hosts";

// Lets a test serve from its own listener; one exact address and port, nothing else.
#[cfg(test)]
static TEST_LOCAL_SERVER: Mutex<Option<(IpAddr, u16)>> = Mutex::new(None);

/// The address to connect to: the URL's host must be on the public internet, not on the
/// device's own network. A name has to resolve to public addresses only.
async fn pin_public_host(url: &Url) -> Result<IpAddr> {
    let refuse = || AppError::BadRequest(NOT_PUBLIC.to_string());
    #[cfg(test)]
    if let (Some(Host::Ipv4(addr)), Some(port)) = (url.host(), url.port())
        && *TEST_LOCAL_SERVER.lock().unwrap() == Some((IpAddr::V4(addr), port))
    {
        return Ok(IpAddr::V4(addr));
    }
    match url.host() {
        Some(Host::Ipv4(addr)) => is_public_ip(IpAddr::V4(addr))
            .then_some(IpAddr::V4(addr))
            .ok_or_else(refuse),
        Some(Host::Ipv6(addr)) => is_public_ip(IpAddr::V6(addr))
            .then_some(IpAddr::V6(addr))
            .ok_or_else(refuse),
        Some(Host::Domain(name)) => {
            if !host_name_allowed(name) {
                return Err(refuse());
            }
            let port = url.port_or_known_default().unwrap_or(443);
            let addrs: Vec<IpAddr> =
                time::timeout(HOST_LOOKUP_TIMEOUT, tokio::net::lookup_host((name, port)))
                    .await
                    .map_err(|_| {
                        AppError::BadRequest("the host name did not resolve in time".to_string())
                    })?
                    .map_err(|_| AppError::BadRequest("the host name did not resolve".to_string()))?
                    .map(|addr| addr.ip())
                    .collect();
            if addrs.is_empty() || !addrs.iter().copied().all(is_public_ip) {
                return Err(refuse());
            }
            Ok(addrs
                .iter()
                .copied()
                .find(IpAddr::is_ipv4)
                .unwrap_or(addrs[0]))
        }
        None => Err(AppError::BadRequest("invalid url".to_string())),
    }
}

// Names that stay on the local network, or resolve through it: no dot at all, or a local suffix.
fn host_name_allowed(name: &str) -> bool {
    let name = name.trim_end_matches('.').to_ascii_lowercase();
    name.contains('.')
        && !name.ends_with(".local")
        && !name.ends_with(".localhost")
        && !name.ends_with(".internal")
        && !name.ends_with(".lan")
        && !name.ends_with(".home.arpa")
}

fn is_public_ip(ip: IpAddr) -> bool {
    match ip {
        IpAddr::V4(addr) => {
            let [a, b, c, _] = addr.octets();
            !(addr.is_unspecified()
                || addr.is_loopback()
                || addr.is_private()
                || addr.is_link_local()
                || addr.is_broadcast()
                || addr.is_multicast()
                || addr.is_documentation()
                // shared address space, 100.64.0.0/10
                || (a == 100 && (64..128).contains(&b))
                // IETF protocol assignments, 192.0.0.0/24
                || (a == 192 && b == 0 && c == 0)
                // benchmarking, 198.18.0.0/15
                || (a == 198 && (18..20).contains(&b))
                // reserved, 240.0.0.0/4
                || a >= 240)
        }
        IpAddr::V6(addr) => {
            if let Some(mapped) = addr.to_ipv4_mapped() {
                return is_public_ip(IpAddr::V4(mapped));
            }
            let seg = addr.segments();
            !(addr.is_unspecified()
                || addr.is_loopback()
                || addr.is_multicast()
                || addr.is_unique_local()
                || addr.is_unicast_link_local()
                // documentation, 2001:db8::/32
                || (seg[0] == 0x2001 && seg[1] == 0x0db8)
                // NAT64 (64:ff9b::/96) carries an IPv4 address; refuse it as a whole
                || (seg[0] == 0x0064 && seg[1] == 0xff9b))
        }
    }
}

/// Parses an optional SHA-256 checksum given as 64 hexadecimal characters.
/// Hashes an upload as it streams in, on its own thread, so the async worker
/// stays free and no read-back is needed once the last byte has arrived.
struct ChecksumWorker {
    tx: tokio::sync::mpsc::Sender<Bytes>,
    task: tokio::task::JoinHandle<[u8; 32]>,
}

impl ChecksumWorker {
    fn spawn() -> Self {
        let (tx, mut rx) = tokio::sync::mpsc::channel::<Bytes>(CHECKSUM_QUEUE_CHUNKS);
        let task = tokio::task::spawn_blocking(move || {
            let mut hasher = Sha256::new();
            while let Some(chunk) = rx.blocking_recv() {
                hasher.update(&chunk);
            }
            hasher.finalize().into()
        });
        Self { tx, task }
    }

    /// Waits when the hasher is behind, which slows the upload to its pace.
    async fn feed(&self, chunk: Bytes) -> Result<()> {
        self.tx
            .send(chunk)
            .await
            .map_err(|_| AppError::Internal("checksum task stopped".to_string()))
    }

    async fn finish(self) -> Result<[u8; 32]> {
        drop(self.tx);
        self.task
            .await
            .map_err(|err| AppError::Internal(format!("checksum task failed: {err}")))
    }
}

fn parse_sha256(value: &str) -> Result<Option<[u8; 32]>> {
    let value = value.trim();
    if value.is_empty() {
        return Ok(None);
    }

    let invalid = || AppError::BadRequest("invalid sha256sum".to_string());
    if value.len() != 64 || !value.is_ascii() {
        return Err(invalid());
    }

    let mut sum = [0_u8; 32];
    for (byte, pair) in sum.iter_mut().zip(value.as_bytes().chunks(2)) {
        let pair = std::str::from_utf8(pair).map_err(|_| invalid())?;
        *byte = u8::from_str_radix(pair, 16).map_err(|_| invalid())?;
    }
    Ok(Some(sum))
}

fn sha256_file(path: &Path) -> Result<[u8; 32]> {
    let mut file = fs::File::open(path)?;
    let mut hasher = Sha256::new();
    let mut buffer = vec![0_u8; 64 * 1024];
    loop {
        let read = file.read(&mut buffer)?;
        if read == 0 {
            break;
        }
        hasher.update(&buffer[..read]);
    }
    Ok(hasher.finalize().into())
}

fn record_checksum_failure(file: &str) {
    if let Ok(mut failure) = CHECKSUM_FAILURE.lock() {
        *failure = Some(file.to_string());
    }
}

fn take_checksum_failure() -> Option<String> {
    CHECKSUM_FAILURE.lock().ok()?.take()
}

fn validate_remote_iso_url(raw: &str) -> Result<RemoteIso> {
    let raw = raw.trim();
    if raw.is_empty() || raw.len() > 2048 || raw.chars().any(char::is_control) {
        return Err(AppError::BadRequest("invalid url".to_string()));
    }

    let parsed = Url::parse(raw).map_err(|_| AppError::BadRequest("invalid url".to_string()))?;
    match parsed.scheme() {
        "http" | "https" => {}
        _ => {
            return Err(AppError::BadRequest(
                "only http and https URLs are allowed".to_string(),
            ));
        }
    }
    if parsed.host_str().is_none() || !parsed.username().is_empty() || parsed.password().is_some() {
        return Err(AppError::BadRequest("invalid url".to_string()));
    }

    let filename = parsed
        .path_segments()
        .and_then(|mut segments| segments.rfind(|segment| !segment.is_empty()))
        .ok_or_else(|| AppError::BadRequest("url must end with an ISO filename".to_string()))?;
    let filename = valid_upload_filename(filename)?;
    if upload_image_kind(&filename) != Some(UploadImageKind::Iso) {
        return Err(AppError::BadRequest(
            "url must end with an ISO filename".to_string(),
        ));
    }

    Ok(RemoteIso {
        url: parsed.to_string(),
        filename,
    })
}

impl StatusImageRsp {
    fn idle() -> Self {
        Self {
            status: "idle".to_string(),
            file: String::new(),
            percentage: String::new(),
            written: 0,
        }
    }

    fn in_progress(file: String, percentage: String, written: u64) -> Self {
        Self {
            status: "in_progress".to_string(),
            file,
            percentage,
            written,
        }
    }

    fn checksum_failed(file: String) -> Self {
        Self {
            status: "checksum_failed".to_string(),
            file,
            percentage: String::new(),
            written: 0,
        }
    }

    fn failed(file: String, percentage: String, written: u64) -> Self {
        Self {
            status: "failed".to_string(),
            file,
            percentage,
            written,
        }
    }
}

fn read_status_image(path: &Path) -> Result<StatusImageRsp> {
    let content = match fs::read_to_string(path) {
        Ok(content) => content,
        Err(err) if err.kind() == ErrorKind::NotFound => return Ok(StatusImageRsp::idle()),
        Err(err) => return Err(err.into()),
    };

    // "label", "label;percentage" or "label;percentage;bytes written"
    let mut parts = content.splitn(3, ';');
    let file = parts.next().unwrap_or_default().to_string();
    let percentage = parts.next().unwrap_or_default().to_string();
    let written = parts
        .next()
        .and_then(|bytes| bytes.trim().parse().ok())
        .unwrap_or(0);

    if status_sentinel_is_stale(path, &file)? {
        let _ = fs::remove_file(path);
        return Ok(StatusImageRsp::failed(file, percentage, written));
    }

    Ok(StatusImageRsp::in_progress(file, percentage, written))
}

fn status_sentinel_is_stale(path: &Path, label: &str) -> Result<bool> {
    let modified = fs::metadata(path)?.modified()?;
    let Some(age) = modified.elapsed().ok() else {
        return Ok(false);
    };

    Ok(status_label_is_stale(label, age))
}

fn status_label_is_stale(label: &str, age: Duration) -> bool {
    let timeout = if is_remote_status_label(label) {
        REMOTE_STATUS_STALE_TIMEOUT
    } else {
        UPLOAD_STATUS_STALE_TIMEOUT
    };

    age > timeout
}

fn is_remote_status_label(label: &str) -> bool {
    label.starts_with("http://") || label.starts_with("https://")
}

/// "12.34%", or empty when the total is unknown.
fn percentage_label(written: u64, total: Option<u64>) -> String {
    total
        .filter(|total| *total > 0)
        .map(|total| format!("{:.2}%", (written as f64 / total as f64 * 100.0).min(100.0)))
        .unwrap_or_default()
}

struct DownloadGuard;

impl DownloadGuard {
    fn acquire(initial: &str) -> Result<Self> {
        fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .mode(0o600)
            .open(SENTINEL_PATH)?
            .write_all(initial.as_bytes())?;
        // A new transfer supersedes an unreported checksum failure.
        let _ = take_checksum_failure();
        Ok(Self)
    }

    fn update(&self, label: &str, written: u64, total: Option<u64>) -> Result<()> {
        let percentage = percentage_label(written, total);
        let content = format!("{label};{percentage};{written}");
        fs::write(SENTINEL_PATH, content.as_bytes())?;
        Ok(())
    }
}

impl Drop for DownloadGuard {
    fn drop(&mut self) {
        let _ = fs::remove_file(SENTINEL_PATH);
    }
}

struct TempUpload {
    path: PathBuf,
    keep: bool,
}

impl TempUpload {
    fn create(root: &Path, filename: &str) -> Result<Self> {
        let path = root.join(format!(".{filename}.{}.upload", random_suffix()));
        Ok(Self { path, keep: false })
    }

    fn open(&self) -> Result<tokio::fs::File> {
        let file = fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .mode(0o600)
            .open(&self.path)?;
        Ok(tokio::fs::File::from_std(file))
    }

    fn path(&self) -> &Path {
        &self.path
    }

    fn keep(&mut self) {
        self.keep = true;
    }
}

impl Drop for TempUpload {
    fn drop(&mut self) {
        if !self.keep {
            let _ = fs::remove_file(&self.path);
        }
    }
}

fn storage_writable(root: &Path) -> bool {
    let path = root.join(format!(".nanokvm-write-test-{}", random_suffix()));
    let result = fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .mode(0o600)
        .open(&path);
    let ok = result.is_ok();
    drop(result);
    let _ = fs::remove_file(path);
    ok
}

fn valid_upload_filename(filename: &str) -> Result<String> {
    let path = Path::new(filename);
    if filename.is_empty()
        || path.file_name().and_then(|name| name.to_str()) != Some(filename)
        || filename.contains("..")
        || upload_image_kind(filename).is_none()
        || !filename
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'_' | b'-'))
    {
        return Err(AppError::BadRequest("invalid filename".to_string()));
    }
    Ok(filename.to_string())
}

fn upload_image_kind(filename: &str) -> Option<UploadImageKind> {
    match Path::new(filename)
        .extension()
        .and_then(|extension| extension.to_str())
    {
        Some(extension) if extension.eq_ignore_ascii_case("iso") => Some(UploadImageKind::Iso),
        Some(extension) if extension.eq_ignore_ascii_case("img") => {
            Some(UploadImageKind::MassStorage)
        }
        _ => None,
    }
}

/// Replacing a mounted image would leave the host serving the old, unlinked copy
/// and keep /data from going read-only.
fn ensure_not_mounted(target: &Path) -> Result<()> {
    if crate::api::storage::mounted_image_matches(target) {
        return Err(AppError::Conflict(
            "this image is mounted; unmount it before replacing it".to_string(),
        ));
    }
    Ok(())
}

fn safe_upload_target(root: &Path, filename: &str) -> Result<PathBuf> {
    let root = fs::canonicalize(root)?;
    let target = root.join(filename);

    if let Ok(metadata) = fs::symlink_metadata(&target)
        && (metadata.file_type().is_symlink() || !metadata.is_file())
    {
        return Err(AppError::BadRequest("invalid destination file".to_string()));
    }

    Ok(target)
}

fn is_iso9660(path: &Path) -> Result<bool> {
    let mut file = fs::File::open(path)?;
    file.seek(SeekFrom::Start(ISO9660_MAGIC_OFFSET))?;
    let mut magic = [0_u8; 5];
    if let Err(err) = file.read_exact(&mut magic) {
        if err.kind() == ErrorKind::UnexpectedEof {
            return Ok(false);
        }
        return Err(err.into());
    }
    Ok(&magic == ISO9660_MAGIC)
}

fn validate_uploaded_image(path: &Path, filename: &str) -> Result<()> {
    let valid = match upload_image_kind(filename) {
        Some(UploadImageKind::Iso) => is_iso9660(path)?,
        Some(UploadImageKind::MassStorage) => is_mass_storage_image(path)?,
        None => false,
    };

    if !valid {
        return Err(AppError::BadRequest(
            "file is not a valid ISO or mass storage image".to_string(),
        ));
    }

    Ok(())
}

fn is_mass_storage_image(path: &Path) -> Result<bool> {
    let size = fs::metadata(path)?.len();
    if size < SECTOR_SIZE as u64 || size > MAX_UPLOAD_BYTES as u64 {
        return Ok(false);
    }

    let mut file = fs::File::open(path)?;
    let mut header = vec![0_u8; MASS_STORAGE_HEADER_BYTES.min(size as usize)];
    let read = file.read(&mut header)?;
    header.truncate(read);

    Ok(has_partition_table(&header)
        || has_superfloppy_filesystem(&header)
        || has_raw_filesystem(&header))
}

fn has_partition_table(header: &[u8]) -> bool {
    has_gpt_header(header)
        || header
            .get(..SECTOR_SIZE)
            .is_some_and(has_mbr_partition_table)
}

fn has_gpt_header(header: &[u8]) -> bool {
    header
        .get(GPT_HEADER_OFFSET..GPT_HEADER_OFFSET + GPT_MAGIC.len())
        .is_some_and(|magic| magic == GPT_MAGIC)
}

fn has_mbr_partition_table(sector: &[u8]) -> bool {
    has_boot_signature(sector)
        && sector[446..510].chunks_exact(16).any(|entry| {
            let boot_flag = entry[0];
            let partition_type = entry[4];
            let start_lba = u32::from_le_bytes([entry[8], entry[9], entry[10], entry[11]]);
            let sectors = u32::from_le_bytes([entry[12], entry[13], entry[14], entry[15]]);

            matches!(boot_flag, 0x00 | 0x80)
                && partition_type != 0
                && start_lba != 0
                && sectors != 0
        })
}

fn has_superfloppy_filesystem(header: &[u8]) -> bool {
    let Some(sector) = header.get(..SECTOR_SIZE) else {
        return false;
    };
    if !has_boot_signature(sector) {
        return false;
    }

    if sector.get(3..11) == Some(b"EXFAT   ") {
        return true;
    }

    let jump = sector[0];
    if !matches!(jump, 0xeb | 0xe9) {
        return false;
    }

    let bytes_per_sector = u16::from_le_bytes([sector[11], sector[12]]);
    let sectors_per_cluster = sector[13];
    let reserved_sectors = u16::from_le_bytes([sector[14], sector[15]]);
    let fat_count = sector[16];
    let total_sectors_16 = u16::from_le_bytes([sector[19], sector[20]]);
    let total_sectors_32 = u32::from_le_bytes([sector[32], sector[33], sector[34], sector[35]]);
    let has_fat_label = sector
        .get(54..62)
        .is_some_and(|label| label.starts_with(b"FAT"))
        || sector
            .get(82..90)
            .is_some_and(|label| label.starts_with(b"FAT"));

    matches!(bytes_per_sector, 512 | 1024 | 2048 | 4096)
        && sectors_per_cluster != 0
        && sectors_per_cluster.is_power_of_two()
        && reserved_sectors != 0
        && fat_count != 0
        && (total_sectors_16 != 0 || total_sectors_32 != 0)
        && has_fat_label
}

fn has_raw_filesystem(header: &[u8]) -> bool {
    header.starts_with(b"XFSB")
        || header
            .get(EXT_SUPERBLOCK_MAGIC_OFFSET..EXT_SUPERBLOCK_MAGIC_OFFSET + 2)
            .is_some_and(|magic| magic == [0x53, 0xef])
        || header
            .get(BTRFS_SUPERBLOCK_MAGIC_OFFSET..BTRFS_SUPERBLOCK_MAGIC_OFFSET + BTRFS_MAGIC.len())
            .is_some_and(|magic| magic == BTRFS_MAGIC)
}

fn has_boot_signature(sector: &[u8]) -> bool {
    sector.len() >= SECTOR_SIZE && sector[510] == 0x55 && sector[511] == 0xaa
}

fn random_suffix() -> String {
    let mut bytes = [0_u8; 9];
    OsRng.fill_bytes(&mut bytes);
    URL_SAFE_NO_PAD.encode(bytes)
}

fn command_error(message: &str, output: crate::system::command::CommandOutput) -> String {
    let stderr = String::from_utf8_lossy(&output.stderr);
    let stdout = String::from_utf8_lossy(&output.stdout);
    let detail = stderr.trim();
    if !detail.is_empty() {
        format!("{message}: {detail}")
    } else {
        let detail = stdout.trim();
        if detail.is_empty() {
            message.to_string()
        } else {
            format!("{message}: {detail}")
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{fs::File, io::Write, os::unix::fs as unix_fs};
    use tempfile::tempdir;

    #[test]
    fn upload_filename_accepts_simple_image_names() {
        assert_eq!(
            valid_upload_filename("rescue-1.0_x86.iso").unwrap(),
            "rescue-1.0_x86.iso"
        );
        assert_eq!(
            valid_upload_filename("usb-stick_2026.IMG").unwrap(),
            "usb-stick_2026.IMG"
        );
    }

    #[test]
    fn upload_filename_rejects_paths_and_non_image_files() {
        for name in [
            "../evil.iso",
            "nested/evil.iso",
            "evil.raw",
            "evil iso.iso",
            "",
        ] {
            let err = valid_upload_filename(name).unwrap_err();
            assert!(matches!(err, AppError::BadRequest(_)));
        }
    }

    #[test]
    fn remote_iso_url_accepts_http_and_https_iso_files() {
        let https =
            validate_remote_iso_url("https://example.com/images/rescue.iso?token=abc").unwrap();
        assert_eq!(https.filename, "rescue.iso");
        assert!(
            https
                .url
                .starts_with("https://example.com/images/rescue.iso")
        );

        let http = validate_remote_iso_url("http://example.com/rescue.iso").unwrap();
        assert_eq!(http.filename, "rescue.iso");
    }

    #[test]
    fn remote_iso_url_rejects_unsafe_or_non_iso_urls() {
        for url in [
            "file:///tmp/rescue.iso",
            "https://example.com/",
            "https://example.com/rescue.img",
            "https://user:pass@example.com/rescue.iso",
            "https://example.com/rescue iso.iso",
            "not a url",
        ] {
            assert!(validate_remote_iso_url(url).is_err(), "{url}");
        }
    }

    #[test]
    fn stale_status_detects_orphaned_upload_marker() {
        assert!(!status_label_is_stale(
            "debian.iso",
            UPLOAD_STATUS_STALE_TIMEOUT - Duration::from_secs(1)
        ));
        assert!(status_label_is_stale(
            "debian.iso",
            UPLOAD_STATUS_STALE_TIMEOUT + Duration::from_secs(1)
        ));
    }

    #[test]
    fn stale_status_allows_long_remote_download_marker() {
        assert!(!status_label_is_stale(
            "https://example.com/debian.iso",
            UPLOAD_STATUS_STALE_TIMEOUT + Duration::from_secs(1)
        ));
        assert!(status_label_is_stale(
            "https://example.com/debian.iso",
            REMOTE_STATUS_STALE_TIMEOUT + Duration::from_secs(1)
        ));
    }

    #[test]
    fn safe_upload_target_rejects_symlink_destination() {
        let dir = tempdir().unwrap();
        let real = dir.path().join("real.iso");
        let link = dir.path().join("link.iso");
        File::create(&real).unwrap();
        unix_fs::symlink(&real, &link).unwrap();

        let err = safe_upload_target(dir.path(), "link.iso").unwrap_err();
        assert!(matches!(err, AppError::BadRequest(_)));
    }

    #[test]
    fn iso_magic_is_checked_at_primary_volume_descriptor_offset() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("valid.iso");
        let mut file = File::create(&path).unwrap();
        file.write_all(&vec![0_u8; ISO9660_MAGIC_OFFSET as usize])
            .unwrap();
        file.write_all(ISO9660_MAGIC).unwrap();

        assert!(is_iso9660(&path).unwrap());
    }

    #[test]
    fn iso_magic_rejects_short_files() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("short.iso");
        File::create(&path).unwrap();

        assert!(!is_iso9660(&path).unwrap());
    }

    #[test]
    fn mass_storage_image_accepts_mbr_partition_table() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("usb.img");
        let mut sector = [0_u8; SECTOR_SIZE];
        sector[446] = 0x00;
        sector[446 + 4] = 0x0c;
        sector[446 + 8..446 + 12].copy_from_slice(&2048_u32.to_le_bytes());
        sector[446 + 12..446 + 16].copy_from_slice(&4096_u32.to_le_bytes());
        sector[510] = 0x55;
        sector[511] = 0xaa;
        File::create(&path).unwrap().write_all(&sector).unwrap();

        assert!(is_mass_storage_image(&path).unwrap());
        validate_uploaded_image(&path, "usb.img").unwrap();
    }

    #[test]
    fn mass_storage_image_accepts_gpt_header() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("usb.img");
        let mut image = vec![0_u8; SECTOR_SIZE * 2];
        image[GPT_HEADER_OFFSET..GPT_HEADER_OFFSET + GPT_MAGIC.len()].copy_from_slice(GPT_MAGIC);
        File::create(&path).unwrap().write_all(&image).unwrap();

        assert!(is_mass_storage_image(&path).unwrap());
    }

    #[test]
    fn mass_storage_image_accepts_fat_superfloppy() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("usb.img");
        let mut sector = [0_u8; SECTOR_SIZE];
        sector[0] = 0xeb;
        sector[1] = 0x3c;
        sector[2] = 0x90;
        sector[3..11].copy_from_slice(b"MSDOS5.0");
        sector[11..13].copy_from_slice(&512_u16.to_le_bytes());
        sector[13] = 1;
        sector[14..16].copy_from_slice(&1_u16.to_le_bytes());
        sector[16] = 2;
        sector[19..21].copy_from_slice(&2880_u16.to_le_bytes());
        sector[54..62].copy_from_slice(b"FAT16   ");
        sector[510] = 0x55;
        sector[511] = 0xaa;
        File::create(&path).unwrap().write_all(&sector).unwrap();

        assert!(is_mass_storage_image(&path).unwrap());
    }

    #[test]
    fn mass_storage_image_accepts_raw_ext_filesystem() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("usb.img");
        let mut image = vec![0_u8; EXT_SUPERBLOCK_MAGIC_OFFSET + 2];
        image[EXT_SUPERBLOCK_MAGIC_OFFSET..EXT_SUPERBLOCK_MAGIC_OFFSET + 2]
            .copy_from_slice(&[0x53, 0xef]);
        File::create(&path).unwrap().write_all(&image).unwrap();

        assert!(is_mass_storage_image(&path).unwrap());
    }

    #[test]
    fn mass_storage_image_rejects_random_data() {
        let dir = tempdir().unwrap();
        let path = dir.path().join("random.img");
        File::create(&path)
            .unwrap()
            .write_all(&vec![0x42_u8; SECTOR_SIZE * 2])
            .unwrap();

        assert!(!is_mass_storage_image(&path).unwrap());
        let err = validate_uploaded_image(&path, "random.img").unwrap_err();
        assert!(matches!(err, AppError::BadRequest(_)));
    }

    #[test]
    fn content_length_comes_from_the_final_response() {
        let dump = "HTTP/1.1 302 Found\r\nContent-Length: 120\r\nLocation: https://cdn/x.iso\r\n\r\n\
                    HTTP/2 200\r\ncontent-length: 4700372992\r\ncontent-type: application/octet-stream\r\n\r\n";
        assert_eq!(parse_content_length(dump), Some(4_700_372_992));
    }

    #[test]
    fn content_length_ignores_redirect_body_size_when_final_has_none() {
        let dump = "HTTP/1.1 302 Found\nContent-Length: 120\n\nHTTP/1.1 200 OK\nTransfer-Encoding: chunked\n\n";
        assert_eq!(parse_content_length(dump), None);
    }

    #[test]
    fn content_length_rejects_missing_or_bad_values() {
        assert_eq!(parse_content_length(""), None);
        assert_eq!(parse_content_length("HTTP/1.1 200 OK\n\n"), None);
        assert_eq!(
            parse_content_length("HTTP/1.1 200 OK\ncontent-length: abc\n\n"),
            None
        );
        assert_eq!(
            parse_content_length("HTTP/1.1 200 OK\ncontent-length: 0\n\n"),
            None
        );
    }

    // Serves 20 x 100 bytes at 250 ms intervals, so a download takes about 5 s.
    async fn serve_slow_file(listener: tokio::net::TcpListener) {
        use tokio::io::{AsyncReadExt, AsyncWriteExt};

        while let Ok((mut socket, _)) = listener.accept().await {
            tokio::spawn(async move {
                let mut request = [0u8; 1024];
                let read = socket.read(&mut request).await.unwrap_or(0);
                let is_head = request[..read].starts_with(b"HEAD");
                let headers =
                    "HTTP/1.1 200 OK\r\nContent-Length: 2000\r\nConnection: close\r\n\r\n";
                if socket.write_all(headers.as_bytes()).await.is_err() || is_head {
                    return;
                }
                for _ in 0..20 {
                    if socket.write_all(&[b'x'; 100]).await.is_err() {
                        return;
                    }
                    tokio::time::sleep(Duration::from_millis(250)).await;
                }
            });
        }
    }

    #[tokio::test]
    async fn remote_download_reports_progress_and_can_be_canceled() {
        if !Path::new("/usr/bin/curl").exists() {
            return;
        }

        // Nothing is running yet, so there is nothing to cancel.
        assert!(matches!(
            cancel_download().await,
            Err(AppError::Conflict(_))
        ));

        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let local = listener.local_addr().unwrap();
        *TEST_LOCAL_SERVER.lock().unwrap() = Some((local.ip(), local.port()));
        let url = format!("http://{local}/test.iso");
        tokio::spawn(serve_slow_file(listener));

        let root = std::env::temp_dir().join(format!("nanokvm-dl-test-{}", random_suffix()));
        fs::create_dir_all(&root).unwrap();

        let guard = DownloadGuard::acquire(&url).unwrap();
        let remote = RemoteIso {
            url: url.clone(),
            filename: "test.iso".to_string(),
        };
        let task = tokio::spawn(download_remote_iso(
            remote,
            root.clone(),
            root.join("test.iso"),
            None,
            guard,
        ));

        let mut percentage = String::new();
        for _ in 0..30 {
            tokio::time::sleep(Duration::from_millis(200)).await;
            percentage = read_status_image(Path::new(SENTINEL_PATH))
                .unwrap()
                .percentage;
            if !percentage.is_empty() {
                break;
            }
        }
        assert!(
            percentage.ends_with('%'),
            "no progress reported: {percentage:?}"
        );

        cancel_download().await.unwrap();
        let result = task.await.unwrap();
        assert!(matches!(
            result,
            Err(AppError::Api {
                code: CANCELED_CODE,
                ..
            })
        ));

        assert!(!Path::new(SENTINEL_PATH).exists());
        assert_eq!(
            fs::read_dir(&root).unwrap().count(),
            0,
            "partial file left behind"
        );
        fs::remove_dir_all(&root).unwrap();
    }

    #[test]
    fn status_file_carries_percentage_and_bytes_written() {
        let path = std::env::temp_dir().join(format!("nanokvm-status-{}", random_suffix()));
        let cases = [
            ("https://host/a.iso;12.50%;1234", "12.50%", 1234),
            ("https://host/a.iso;;987", "", 987),
            ("a.iso;5.00%", "5.00%", 0),
            ("a.iso", "", 0),
        ];
        for (content, percentage, written) in cases {
            fs::write(&path, content).unwrap();
            let status = read_status_image(&path).unwrap();
            assert_eq!(status.status, "in_progress", "{content}");
            assert_eq!(status.percentage, percentage, "{content}");
            assert_eq!(status.written, written, "{content}");
        }
        fs::remove_file(&path).unwrap();
    }

    #[test]
    fn percentage_label_formats_and_clamps() {
        assert_eq!(percentage_label(50, Some(200)), "25.00%");
        assert_eq!(percentage_label(300, Some(200)), "100.00%");
        assert_eq!(percentage_label(10, None), "");
        assert_eq!(percentage_label(10, Some(0)), "");
    }

    #[test]
    fn parses_sha256_in_either_case() {
        let lower = "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad";
        let upper = lower.to_ascii_uppercase();
        let expected = parse_sha256(lower).unwrap().unwrap();
        assert_eq!(expected[0], 0xba);
        assert_eq!(expected[31], 0xad);
        assert_eq!(
            parse_sha256(&format!("  {upper}\n")).unwrap(),
            Some(expected)
        );
    }

    #[test]
    fn empty_sha256_means_no_check() {
        assert_eq!(parse_sha256("").unwrap(), None);
        assert_eq!(parse_sha256("   ").unwrap(), None);
    }

    #[test]
    fn rejects_malformed_sha256() {
        for value in [
            "abc",
            &"a".repeat(63),
            &"a".repeat(65),
            &"g".repeat(64),
            &"é".repeat(32),
        ] {
            let err = parse_sha256(value).unwrap_err();
            assert!(matches!(err, AppError::BadRequest(_)), "{value}");
        }
    }

    #[test]
    fn hashes_a_file() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("abc.iso");
        fs::write(&path, b"abc").unwrap();
        assert_eq!(
            sha256_file(&path).unwrap(),
            parse_sha256("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")
                .unwrap()
                .unwrap()
        );
    }

    #[test]
    fn checksum_failure_is_reported_once() {
        record_checksum_failure("broken.iso");
        assert_eq!(take_checksum_failure().as_deref(), Some("broken.iso"));
        assert_eq!(take_checksum_failure(), None);
    }
    #[tokio::test]
    async fn checksum_worker_hashes_streamed_chunks() {
        let worker = ChecksumWorker::spawn();
        for part in [&b"a"[..], &b"b"[..], &b"c"[..]] {
            worker.feed(Bytes::copy_from_slice(part)).await.unwrap();
        }
        let expected =
            parse_sha256("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad")
                .unwrap()
                .unwrap();
        assert_eq!(worker.finish().await.unwrap(), expected);
    }

    fn ip(text: &str) -> IpAddr {
        text.parse().unwrap()
    }

    #[test]
    fn only_public_addresses_pass() {
        for public in [
            "93.184.216.34",
            "8.8.8.8",
            "2606:4700:4700::1111",
            "1.1.1.1",
        ] {
            assert!(is_public_ip(ip(public)), "{public}");
        }
        for private in [
            "127.0.0.1",
            "0.0.0.0",
            "10.0.0.5",
            "172.16.3.4",
            "192.168.1.1",
            "169.254.1.1",
            "100.64.0.1",
            "100.127.255.255",
            "198.18.0.1",
            "192.0.0.1",
            "192.0.2.1",
            "224.0.0.1",
            "255.255.255.255",
            "240.0.0.1",
            "::1",
            "::",
            "fe80::1",
            "fc00::1",
            "fd12:3456::1",
            "ff02::1",
            "2001:db8::1",
            "::ffff:127.0.0.1",
            "::ffff:10.0.0.1",
            "64:ff9b::7f00:1",
        ] {
            assert!(!is_public_ip(ip(private)), "{private}");
        }
        // just outside the ranges
        assert!(is_public_ip(ip("100.63.255.255")));
        assert!(is_public_ip(ip("100.128.0.1")));
        assert!(is_public_ip(ip("198.20.0.1")));
    }

    #[test]
    fn names_that_stay_local_are_refused() {
        for name in [
            "localhost",
            "router",
            "kvm.local",
            "x.localhost",
            "nas.lan",
            "a.internal",
            "h.home.arpa",
            "KVM.LOCAL.",
        ] {
            assert!(!host_name_allowed(name), "{name}");
        }
        for name in ["releases.ubuntu.com", "mirror.example.org"] {
            assert!(host_name_allowed(name), "{name}");
        }
    }

    #[tokio::test]
    async fn a_private_literal_or_name_is_refused_before_curl_runs() {
        for url in [
            "http://127.0.0.1/x.iso",
            "http://[::1]/x.iso",
            "https://192.168.0.10:8443/x.iso",
            "http://localhost/x.iso",
            "http://router/x.iso",
            "http://nas.local/x.iso",
        ] {
            let result = pin_public_host(&Url::parse(url).unwrap()).await;
            assert!(matches!(result, Err(AppError::BadRequest(_))), "{url}");
        }
        let public = pin_public_host(&Url::parse("https://93.184.216.34/x.iso").unwrap())
            .await
            .unwrap();
        assert_eq!(public, ip("93.184.216.34"));
    }

    #[test]
    fn a_redirect_is_read_from_curls_output() {
        assert!(matches!(parse_hop(b"200 "), Hop::Done));
        assert!(matches!(parse_hop(b"302 "), Hop::Done));
        assert!(matches!(parse_hop(b""), Hop::Done));
        match parse_hop(b"302 https://mirror.example.org/x.iso") {
            Hop::Redirect(next) => assert_eq!(next, "https://mirror.example.org/x.iso"),
            Hop::Done => panic!("expected a redirect"),
        }
    }

    #[test]
    fn a_redirect_may_not_leave_http_or_carry_credentials() {
        assert!(checked_redirect("https://mirror.example.org/x.iso").is_ok());
        for next in [
            "ftp://a.example.org/x.iso",
            "file:///etc/passwd",
            "https://u:p@a.example.org/x.iso",
            "not a url",
        ] {
            assert!(checked_redirect(next).is_err(), "{next}");
        }
    }

    #[tokio::test]
    async fn a_redirect_to_a_private_host_is_refused() {
        if !Path::new("/usr/bin/curl").exists() {
            return;
        }

        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let local = listener.local_addr().unwrap();
        *TEST_LOCAL_SERVER.lock().unwrap() = Some((local.ip(), local.port()));
        tokio::spawn(async move {
            use tokio::io::{AsyncReadExt, AsyncWriteExt};
            loop {
                let (mut stream, _) = listener.accept().await.unwrap();
                let mut buf = [0_u8; 1024];
                let _ = stream.read(&mut buf).await;
                let reply = "HTTP/1.1 302 Found\r\nLocation: http://10.0.0.5/x.iso\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
                let _ = stream.write_all(reply.as_bytes()).await;
            }
        });

        let target = std::env::temp_dir().join(format!("nanokvm-redirect-{}", random_suffix()));
        let result = download_remote_with_curl(&format!("http://{local}/start.iso"), &target).await;
        let _ = fs::remove_file(&target);

        assert!(
            matches!(result, Err(AppError::BadRequest(ref msg)) if msg == NOT_PUBLIC),
            "{result:?}"
        );
    }

    async fn enable_request(
        state: &AppState,
        session: &crate::auth::session::Session,
        password: Option<&str>,
    ) -> Result<()> {
        set_remote_image_download_enabled(
            State(state.clone()),
            Extension(CurrentSession(session.clone())),
            ClientInfo::direct([127, 0, 0, 1].into()),
            Json(SetRemoteImageDownloadReq {
                enabled: true,
                password: password.map(str::to_string),
                code: None,
            }),
        )
        .await
        .map(|_| ())
    }

    #[tokio::test]
    async fn turning_remote_download_on_needs_the_password_first() {
        let dir = tempfile::tempdir().unwrap();
        let mut config = Config::default();
        config.paths.account_file = dir.path().canonicalize().unwrap().join("pwd");
        let state = AppState::new(config).await.unwrap();
        state
            .accounts
            .set_account("operator", "correct horse battery")
            .unwrap();
        let session = state.sessions.issue("operator", 900).await;

        let none = enable_request(&state, &session, None).await;
        assert!(matches!(none, Err(AppError::BadRequest(_))));
        let wrong = enable_request(&state, &session, Some("not the password")).await;
        assert!(matches!(wrong, Err(AppError::InvalidCredentials)));
        assert!(!state.remote_image_download_enabled());
    }
}
