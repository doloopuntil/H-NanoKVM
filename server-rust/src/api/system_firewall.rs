use std::{
    fs,
    future::Future,
    path::Path,
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use axum::{Json, response::IntoResponse};
use serde::{Deserialize, Serialize};
use tokio::time;

use crate::{
    AppError, Result,
    config::Config,
    error::ApiResponse,
    system::command::{AllowedCommand, CommandOutput, run_allowed},
};

const CONFIG_FILE: &str = "/etc/kvm/firewall.json";
const NFT_PATH: &str = "/usr/sbin/nft";
const IPTABLES_NFT_PATH: &str = "/usr/sbin/iptables-nft";
// On the root filesystem, not in /tmp: a crash or power loss inside the confirmation window must
// still leave the record, so that the next start can undo the unconfirmed mode.
const PENDING_FILE: &str = "/etc/kvm/firewall-pending.json";
const MAX_PENDING_BYTES: u64 = 4096;
const MODE_BASELINE: &str = "baseline";
const MODE_MODERATE: &str = "moderate";
const MODE_RESTRICTED: &str = "restricted";
const MODE_PARANOID: &str = "paranoid";
const PARANOID_BLOCKED_MESSAGE: &str = "online updates are blocked by Paranoid Firewall mode";
const WEBRTC_BLOCKED_MESSAGE: &str =
    "H.264 WebRTC is disabled in Restricted and Paranoid Firewall modes";

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase", default)]
pub struct FirewallConfig {
    pub mode: String,
}

impl Default for FirewallConfig {
    fn default() -> Self {
        Self {
            mode: MODE_MODERATE.to_string(),
        }
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetFirewallReq {
    pub mode: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FirewallStatusRsp {
    config: FirewallConfig,
    effective_mode: String,
    moderate_active: bool,
    restricted_active: bool,
    paranoid_active: bool,
    webrtc_blocked: bool,
    paranoid_available: bool,
    confirmation_required: bool,
    https_enabled: bool,
    https_port: u16,
    backend: FirewallBackendRsp,
    rules: FirewallRulesRsp,
    message: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FirewallBackendRsp {
    iptables: ToolStatus,
    ip6tables: ToolStatus,
    nft: ToolStatus,
    preferred: &'static str,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ToolStatus {
    installed: bool,
    detail: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FirewallRulesRsp {
    ipv4: String,
    ipv6: String,
    nft: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct PendingRollback {
    previous_mode: String,
    requested_mode: String,
    created_at: u64,
}

pub fn paranoid_mode_enabled() -> bool {
    effective_mode()
        .map(|mode| mode == MODE_PARANOID)
        .unwrap_or(false)
}

pub fn paranoid_blocked_message() -> &'static str {
    PARANOID_BLOCKED_MESSAGE
}

pub fn webrtc_blocked_by_firewall() -> bool {
    effective_mode()
        .map(|mode| matches!(mode.as_str(), MODE_RESTRICTED | MODE_PARANOID))
        .unwrap_or(false)
}

pub fn webrtc_blocked_message() -> &'static str {
    WEBRTC_BLOCKED_MESSAGE
}

/// The mode in the firewall config, whether or not HTTPS lets it take effect.
pub(crate) fn configured_mode() -> String {
    read_config().unwrap_or_default().mode
}

/// Put a firewall mode back, for a protocol change that was not confirmed.
pub(crate) async fn restore_mode(mode: &str) -> Result<()> {
    write_config(&normalize_mode(mode)?)?;
    apply_firewall().await
}

pub async fn force_moderate_mode() -> Result<()> {
    let moderate = FirewallConfig {
        mode: MODE_MODERATE.to_string(),
    };
    write_config(&moderate)?;
    remove_file_if_exists(PENDING_FILE)?;
    apply_firewall().await
}

pub async fn get_status() -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(build_status().await?)))
}

pub async fn set_config(Json(req): Json<SetFirewallReq>) -> Result<impl IntoResponse> {
    let requested = normalize_mode(&req.mode)?;
    let previous = read_config().unwrap_or_default();

    if mode_requires_https(&requested.mode) {
        ensure_https_mode_can_be_enabled(&requested.mode).await?;
        write_pending(&PendingRollback {
            previous_mode: previous.mode.clone(),
            requested_mode: requested.mode.clone(),
            created_at: unix_now(),
        })?;
    } else {
        remove_file_if_exists(PENDING_FILE)?;
    }

    write_config(&requested)?;
    if let Err(err) = apply_firewall().await {
        write_config(&previous)?;
        let _ = apply_firewall().await;
        remove_file_if_exists(PENDING_FILE)?;
        return Err(err);
    }

    if mode_requires_https(&requested.mode) {
        spawn_pending_rollback(previous);
    }

    Ok(Json(ApiResponse::ok(build_status().await?)))
}

pub async fn confirm_pending() -> Result<impl IntoResponse> {
    remove_file_if_exists(PENDING_FILE)?;
    Ok(Json(ApiResponse::ok(build_status().await?)))
}

async fn build_status() -> Result<FirewallStatusRsp> {
    let config = read_config().unwrap_or_default();
    let server_config = Config::read().unwrap_or_default();
    let https_enabled = https_enabled(&server_config);
    let effective_mode = effective_mode_for(&config, &server_config);
    let moderate_active = effective_mode == MODE_MODERATE;
    let restricted_active = effective_mode == MODE_RESTRICTED;
    let paranoid_active = effective_mode == MODE_PARANOID;
    let webrtc_blocked = restricted_active || paranoid_active;
    let confirmation_required = Path::new(PENDING_FILE).exists();

    let message = if mode_requires_https(&config.mode) && !https_enabled {
        "Enable HTTPS before restricted firewall modes can be applied.".to_string()
    } else if paranoid_active {
        PARANOID_BLOCKED_MESSAGE.to_string()
    } else {
        String::new()
    };

    Ok(FirewallStatusRsp {
        config,
        effective_mode,
        moderate_active,
        restricted_active,
        paranoid_active,
        webrtc_blocked,
        paranoid_available: https_enabled,
        confirmation_required,
        https_enabled,
        https_port: server_config.port.https,
        backend: FirewallBackendRsp {
            iptables: tool_status("/usr/sbin/iptables"),
            ip6tables: tool_status("/usr/sbin/ip6tables"),
            nft: tool_status(NFT_PATH),
            preferred: firewall_backend().name(),
        },
        rules: read_rules().await,
        message,
    })
}

fn effective_mode() -> Result<String> {
    let config = read_config().unwrap_or_default();
    let server_config = Config::read().unwrap_or_default();
    Ok(effective_mode_for(&config, &server_config))
}

fn effective_mode_for(config: &FirewallConfig, server_config: &Config) -> String {
    if mode_requires_https(&config.mode) && !https_enabled(server_config) {
        return MODE_MODERATE.to_string();
    }

    config.mode.clone()
}

fn https_enabled(config: &Config) -> bool {
    config.proto.eq_ignore_ascii_case("https")
}

fn mode_requires_https(mode: &str) -> bool {
    matches!(mode, MODE_RESTRICTED | MODE_PARANOID)
}

async fn ensure_https_mode_can_be_enabled(mode: &str) -> Result<()> {
    let config = Config::read()?;
    if !https_enabled(&config) {
        return Err(AppError::BadRequest(format!(
            "enable HTTPS before enabling {mode} Firewall mode"
        )));
    }

    let output = run_allowed(
        AllowedCommand::Curl,
        ["-kfsS", "--max-time", "3", "https://127.0.0.1/api/health"],
        Duration::from_secs(5),
    )
    .await?;
    if output.status != 0 {
        return Err(AppError::BadRequest(command_error(
            "HTTPS health check failed",
            output,
        )));
    }

    Ok(())
}

fn normalize_mode(mode: &str) -> Result<FirewallConfig> {
    match mode {
        MODE_BASELINE | MODE_MODERATE | MODE_RESTRICTED | MODE_PARANOID => Ok(FirewallConfig {
            mode: mode.to_string(),
        }),
        _ => Err(AppError::BadRequest("invalid firewall mode".to_string())),
    }
}

fn read_config() -> Result<FirewallConfig> {
    match fs::read_to_string(CONFIG_FILE) {
        Ok(content) => {
            let config: FirewallConfig = serde_json::from_str(&content)
                .map_err(|err| AppError::Config(format!("invalid firewall config: {err}")))?;
            normalize_mode(&config.mode)
        }
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => Ok(FirewallConfig::default()),
        Err(err) => Err(AppError::Io(err)),
    }
}

fn write_config(config: &FirewallConfig) -> Result<()> {
    write_config_to(Path::new(CONFIG_FILE), config)
}

fn write_config_to(path: &Path, config: &FirewallConfig) -> Result<()> {
    let content = serde_json::to_vec_pretty(config)
        .map_err(|err| AppError::Internal(format!("encode firewall config: {err}")))?;
    crate::system::files::write_atomic(path, &content, 0o644)
}

fn write_pending(pending: &PendingRollback) -> Result<()> {
    let content = serde_json::to_vec_pretty(pending)
        .map_err(|err| AppError::Internal(format!("encode firewall pending state: {err}")))?;
    crate::system::files::write_atomic(Path::new(PENDING_FILE), &content, 0o600)
}

/// A record is a small regular file naming two known modes; anything else is left alone and
/// keeps requiring a person's recovery.
fn read_pending_at(path: &Path) -> Result<PendingRollback> {
    let metadata = fs::symlink_metadata(path)?;
    if !metadata.file_type().is_file() || metadata.len() > MAX_PENDING_BYTES {
        return Err(AppError::Config(
            "the firewall pending record is not a small regular file".to_string(),
        ));
    }
    let record: PendingRollback = serde_json::from_slice(&fs::read(path)?)
        .map_err(|err| AppError::Config(format!("invalid firewall pending record: {err}")))?;
    normalize_mode(&record.previous_mode)?;
    normalize_mode(&record.requested_mode)?;
    Ok(record)
}

/// Undoes a mode change that was never confirmed: the backend stopped before its timer ran out,
/// so only the durable record is left. False when there is no record.
async fn roll_back_unconfirmed_in<F, Fut>(pending: &Path, config: &Path, apply: F) -> Result<bool>
where
    F: FnOnce() -> Fut,
    Fut: Future<Output = Result<()>>,
{
    if !pending.try_exists()? {
        return Ok(false);
    }
    let record = read_pending_at(pending)?;
    write_config_to(config, &normalize_mode(&record.previous_mode)?)?;
    apply().await?;
    fs::remove_file(pending)?;
    Ok(true)
}

/// Runs at start, before any request, as the confirmation timer would have.
pub async fn roll_back_unconfirmed_at_start() {
    match roll_back_unconfirmed_in(
        Path::new(PENDING_FILE),
        Path::new(CONFIG_FILE),
        apply_firewall,
    )
    .await
    {
        Ok(true) => tracing::warn!("rolled back a firewall mode that was never confirmed"),
        Ok(false) => {}
        Err(err) => tracing::warn!(
            error = %err,
            "could not roll back an unconfirmed firewall mode; the record stays"
        ),
    }
}

fn spawn_pending_rollback(previous: FirewallConfig) {
    tokio::spawn(async move {
        time::sleep(Duration::from_secs(60)).await;
        if !Path::new(PENDING_FILE).exists() {
            return;
        }

        if let Err(err) = write_config(&previous) {
            tracing::warn!(error = ?err, "failed to restore previous firewall config");
            return;
        }
        if let Err(err) = apply_firewall().await {
            tracing::warn!(error = ?err, "failed to rollback unconfirmed firewall mode");
            return;
        }
        if let Err(err) = fs::remove_file(PENDING_FILE) {
            tracing::warn!(error = ?err, "failed to clear firewall pending rollback marker");
        }
    });
}

/// Lets the internet reach the HTTPS port until closed, for a certificate authority's check.
/// Closing happens on `close`, or on drop if the order is abandoned.
pub(crate) struct AcmeWindow {
    closed: bool,
}

impl AcmeWindow {
    pub(crate) async fn open() -> Result<Self> {
        run_acme_window("acme-open").await?;
        Ok(Self { closed: false })
    }

    pub(crate) async fn close(mut self) {
        self.closed = true;
        close_acme_window().await;
    }
}

impl Drop for AcmeWindow {
    fn drop(&mut self) {
        if !self.closed
            && let Ok(runtime) = tokio::runtime::Handle::try_current()
        {
            runtime.spawn(close_acme_window());
        }
    }
}

/// Idempotent; also used at startup to clear a window a crash left open.
pub(crate) async fn close_acme_window() {
    if let Err(err) = run_acme_window("acme-close").await {
        tracing::warn!(error = %err, "failed to close the certificate validation window");
    }
}

async fn run_acme_window(action: &str) -> Result<()> {
    let output = run_allowed(
        AllowedCommand::ServiceFirewall,
        [action],
        Duration::from_secs(10),
    )
    .await?;
    if output.status != 0 {
        return Err(AppError::Internal(command_error(
            "failed to change the firewall for the certificate check",
            output,
        )));
    }
    Ok(())
}

pub async fn apply_firewall() -> Result<()> {
    let output = run_allowed(
        AllowedCommand::ServiceFirewall,
        ["restart"],
        Duration::from_secs(10),
    )
    .await?;
    if output.status != 0 {
        return Err(AppError::Internal(command_error(
            "failed to apply firewall settings",
            output,
        )));
    }
    Ok(())
}

/// The tools S40firewall uses, chosen the same way: nft, then iptables-nft, then iptables.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum FirewallBackend {
    Nftables,
    IptablesNft,
    Iptables,
}

impl FirewallBackend {
    fn name(self) -> &'static str {
        match self {
            Self::Nftables => "nftables",
            Self::IptablesNft => "iptables-nft",
            Self::Iptables => "iptables",
        }
    }
}

fn firewall_backend() -> FirewallBackend {
    backend_for(
        Path::new(NFT_PATH).exists(),
        Path::new(IPTABLES_NFT_PATH).exists(),
    )
}

fn backend_for(nft: bool, iptables_nft: bool) -> FirewallBackend {
    if nft {
        FirewallBackend::Nftables
    } else if iptables_nft {
        FirewallBackend::IptablesNft
    } else {
        FirewallBackend::Iptables
    }
}

async fn read_rules() -> FirewallRulesRsp {
    let no_args = std::iter::empty::<&str>;
    match firewall_backend() {
        FirewallBackend::Nftables => FirewallRulesRsp {
            ipv4: String::new(),
            ipv6: String::new(),
            nft: command_text(AllowedCommand::Nft, ["list", "ruleset"]).await,
        },
        FirewallBackend::IptablesNft => FirewallRulesRsp {
            ipv4: command_text(AllowedCommand::IptablesNftSave, no_args()).await,
            ipv6: command_text(AllowedCommand::Ip6tablesNftSave, no_args()).await,
            nft: String::new(),
        },
        FirewallBackend::Iptables => FirewallRulesRsp {
            ipv4: command_text(AllowedCommand::IptablesSave, no_args()).await,
            ipv6: command_text(AllowedCommand::Ip6tablesSave, no_args()).await,
            nft: String::new(),
        },
    }
}

async fn command_text<I, S>(command: AllowedCommand, args: I) -> String
where
    I: IntoIterator<Item = S>,
    S: AsRef<std::ffi::OsStr>,
{
    match run_allowed(command, args, Duration::from_secs(5)).await {
        Ok(output) if output.status == 0 => String::from_utf8_lossy(&output.stdout).to_string(),
        Ok(output) => command_error("command failed", output),
        Err(err) => err.to_string(),
    }
}

fn tool_status(path: &str) -> ToolStatus {
    ToolStatus {
        installed: Path::new(path).exists(),
        detail: path.to_string(),
    }
}

fn remove_file_if_exists(path: &str) -> Result<()> {
    match fs::remove_file(path) {
        Ok(()) => Ok(()),
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => Ok(()),
        Err(err) => Err(AppError::Io(err)),
    }
}

fn unix_now() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

fn command_error(message: &str, output: CommandOutput) -> String {
    let stderr = String::from_utf8_lossy(&output.stderr);
    let stdout = String::from_utf8_lossy(&output.stdout);
    let detail = stderr.trim();
    if !detail.is_empty() {
        format!("{message}: {detail}")
    } else if !stdout.trim().is_empty() {
        format!("{message}: {}", stdout.trim())
    } else {
        message.to_string()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn record(previous: &str) -> String {
        format!(r#"{{"previousMode":"{previous}","requestedMode":"restricted","createdAt":1}}"#)
    }

    #[tokio::test]
    async fn an_unconfirmed_mode_is_rolled_back_at_start() {
        let dir = tempfile::tempdir().unwrap();
        let (pending, config) = (dir.path().join("pending"), dir.path().join("firewall.json"));
        fs::write(&config, br#"{"mode":"restricted"}"#).unwrap();
        fs::write(&pending, record("moderate")).unwrap();
        let applied = std::sync::atomic::AtomicBool::new(false);

        let rolled = roll_back_unconfirmed_in(&pending, &config, || async {
            applied.store(true, std::sync::atomic::Ordering::SeqCst);
            Ok(())
        })
        .await
        .unwrap();

        assert!(rolled && applied.load(std::sync::atomic::Ordering::SeqCst));
        assert!(fs::read_to_string(&config).unwrap().contains("moderate"));
        assert!(!pending.exists());
    }

    #[tokio::test]
    async fn nothing_happens_without_a_record() {
        let dir = tempfile::tempdir().unwrap();
        let (pending, config) = (dir.path().join("pending"), dir.path().join("firewall.json"));
        let rolled = roll_back_unconfirmed_in(&pending, &config, || async {
            panic!("no record, nothing to apply")
        })
        .await
        .unwrap();
        assert!(!rolled);
        assert!(!config.exists());
    }

    #[tokio::test]
    async fn a_failed_apply_keeps_the_record() {
        let dir = tempfile::tempdir().unwrap();
        let (pending, config) = (dir.path().join("pending"), dir.path().join("firewall.json"));
        fs::write(&pending, record("baseline")).unwrap();
        let result = roll_back_unconfirmed_in(&pending, &config, || async {
            Err(AppError::Internal("apply failed".to_string()))
        })
        .await;
        assert!(result.is_err());
        assert!(pending.exists());
    }

    #[tokio::test]
    async fn an_unusable_record_stays_and_changes_nothing() {
        let dir = tempfile::tempdir().unwrap();
        let (pending, config) = (dir.path().join("pending"), dir.path().join("firewall.json"));
        fs::write(&config, br#"{"mode":"restricted"}"#).unwrap();
        let untouched = || async { panic!("an unusable record must not be applied") };

        for content in [record("off"), "not json".to_string(), "x".repeat(5000)] {
            fs::write(&pending, content).unwrap();
            assert!(
                roll_back_unconfirmed_in(&pending, &config, untouched)
                    .await
                    .is_err()
            );
            assert!(pending.exists());
        }

        // a link is not a record, even one that points at a good file
        fs::remove_file(&pending).unwrap();
        let target = dir.path().join("target");
        fs::write(&target, record("moderate")).unwrap();
        std::os::unix::fs::symlink(&target, &pending).unwrap();
        assert!(
            roll_back_unconfirmed_in(&pending, &config, untouched)
                .await
                .is_err()
        );
        assert_eq!(
            fs::read_to_string(&config).unwrap(),
            r#"{"mode":"restricted"}"#
        );
    }

    #[test]
    fn picks_the_backend_s40firewall_uses() {
        assert_eq!(backend_for(true, true), FirewallBackend::Nftables);
        assert_eq!(backend_for(true, false), FirewallBackend::Nftables);
        assert_eq!(backend_for(false, true), FirewallBackend::IptablesNft);
        assert_eq!(backend_for(false, false), FirewallBackend::Iptables);
        assert_eq!(FirewallBackend::Nftables.name(), "nftables");
    }

    #[test]
    fn validates_firewall_modes() {
        assert_eq!(normalize_mode("baseline").unwrap().mode, MODE_BASELINE);
        assert_eq!(normalize_mode("moderate").unwrap().mode, MODE_MODERATE);
        assert_eq!(normalize_mode("restricted").unwrap().mode, MODE_RESTRICTED);
        assert_eq!(normalize_mode("paranoid").unwrap().mode, MODE_PARANOID);
        assert!(normalize_mode("off").is_err());
    }

    #[test]
    fn defaults_to_moderate_mode() {
        assert_eq!(FirewallConfig::default().mode, MODE_MODERATE);
    }

    #[test]
    fn paranoid_requires_https_for_effective_mode() {
        let firewall = FirewallConfig {
            mode: MODE_PARANOID.to_string(),
        };
        let mut config = Config {
            proto: "http".to_string(),
            ..Config::default()
        };
        assert_eq!(effective_mode_for(&firewall, &config), MODE_MODERATE);

        config.proto = "https".to_string();
        assert_eq!(effective_mode_for(&firewall, &config), MODE_PARANOID);
    }

    #[test]
    fn restricted_requires_https_for_effective_mode() {
        let firewall = FirewallConfig {
            mode: MODE_RESTRICTED.to_string(),
        };
        let mut config = Config {
            proto: "http".to_string(),
            ..Config::default()
        };
        assert_eq!(effective_mode_for(&firewall, &config), MODE_MODERATE);

        config.proto = "https".to_string();
        assert_eq!(effective_mode_for(&firewall, &config), MODE_RESTRICTED);
    }

    #[test]
    fn moderate_does_not_require_https_for_effective_mode() {
        let firewall = FirewallConfig {
            mode: MODE_MODERATE.to_string(),
        };
        let config = Config {
            proto: "http".to_string(),
            ..Config::default()
        };
        assert_eq!(effective_mode_for(&firewall, &config), MODE_MODERATE);
    }
}
