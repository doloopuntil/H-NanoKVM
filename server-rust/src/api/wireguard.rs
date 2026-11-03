use std::{
    fs,
    net::{IpAddr, Ipv4Addr},
    path::Path,
    sync::LazyLock,
    time::Duration,
};

use axum::{Json, response::IntoResponse};
use base64::{Engine as _, engine::general_purpose::STANDARD};
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;

use crate::{
    AppError, Result,
    api::system_firewall,
    error::ApiResponse,
    fsutil::write_0600_atomic,
    http::proxy::ClientInfo,
    system::{
        audit,
        command::{AllowedCommand, CommandOutput, run_allowed, run_allowed_with_stdin},
    },
};

const CONFIG_FILE: &str = "/etc/kvm/wireguard/kvm.conf";
const KEY_FILE: &str = "/etc/kvm/wireguard/private.key";
const WG_PATH: &str = "/usr/bin/wg";
const INTERFACE: &str = "wg0";
const MAX_ALLOWED_IPS: usize = 16;
const DEFAULT_KEEPALIVE: u16 = 25;
const COMMAND_TIMEOUT: Duration = Duration::from_secs(20);

// Config and key changes, and the service restarts they cause, must not interleave.
static LOCK: LazyLock<Mutex<()>> = LazyLock::new(|| Mutex::new(()));

#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct WireguardConfig {
    pub enabled: bool,
    pub address: String,
    pub peer: WireguardPeer,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct WireguardPeer {
    pub public_key: String,
    pub endpoint_host: String,
    pub endpoint_port: u16,
    pub allowed_ips: Vec<String>,
    pub persistent_keepalive: u16,
}

impl Default for WireguardPeer {
    fn default() -> Self {
        Self {
            public_key: String::new(),
            endpoint_host: String::new(),
            endpoint_port: 0,
            allowed_ips: Vec::new(),
            persistent_keepalive: DEFAULT_KEEPALIVE,
        }
    }
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetPrivateKeyReq {
    pub private_key: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct WireguardRsp {
    config: WireguardConfig,
    private_key_set: bool,
    /// Derived from the stored private key, for pasting into the other end's peer settings.
    public_key: String,
    tool_installed: bool,
    running: bool,
    /// Unix seconds of the last handshake with the peer, 0 if there has been none.
    latest_handshake: u64,
    rx_bytes: u64,
    tx_bytes: u64,
    firewall_blocked: bool,
}

pub async fn get_status() -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(build_response().await?)))
}

pub async fn set_config(
    client: ClientInfo,
    Json(req): Json<WireguardConfig>,
) -> Result<impl IntoResponse> {
    let _guard = LOCK.lock().await;

    let config = validate_config(req)?;
    if config.enabled {
        if !Path::new(WG_PATH).is_file() {
            return Err(AppError::BadRequest(
                "WireGuard tools are not installed".to_string(),
            ));
        }
        if !private_key_set() {
            return Err(AppError::BadRequest(
                "set a private key before enabling WireGuard".to_string(),
            ));
        }
        require_complete(&config)?;
        if system_firewall::paranoid_mode_enabled() {
            return Err(AppError::BadRequest(
                "WireGuard is blocked by Paranoid Firewall mode".to_string(),
            ));
        }
    }

    write_0600_atomic(Path::new(CONFIG_FILE), render_config(&config).as_bytes())?;
    audit::wireguard_changed(&client.source_ip(), config.enabled);

    apply_service(config.enabled).await?;
    system_firewall::apply_firewall().await?;

    Ok(Json(ApiResponse::ok(build_response().await?)))
}

pub async fn set_private_key(
    client: ClientInfo,
    Json(req): Json<SetPrivateKeyReq>,
) -> Result<impl IntoResponse> {
    let _guard = LOCK.lock().await;

    let key = req.private_key.trim();
    validate_key(key, "private key")?;
    store_private_key(key, &client.source_ip()).await?;

    Ok(Json(ApiResponse::ok(build_response().await?)))
}

pub async fn generate_private_key(client: ClientInfo) -> Result<impl IntoResponse> {
    let _guard = LOCK.lock().await;

    let output = run_allowed(AllowedCommand::Wg, ["genkey"], COMMAND_TIMEOUT).await?;
    if output.status != 0 {
        return Err(AppError::Internal(command_error(
            "failed to generate a private key",
            output,
        )));
    }
    let key = String::from_utf8_lossy(&output.stdout).trim().to_string();
    validate_key(&key, "generated key")?;
    store_private_key(&key, &client.source_ip()).await?;

    Ok(Json(ApiResponse::ok(build_response().await?)))
}

pub async fn remove_private_key(client: ClientInfo) -> Result<impl IntoResponse> {
    let _guard = LOCK.lock().await;

    let mut config = read_config();
    if config.enabled {
        config.enabled = false;
        write_0600_atomic(Path::new(CONFIG_FILE), render_config(&config).as_bytes())?;
        apply_service(false).await?;
        system_firewall::apply_firewall().await?;
    }
    match fs::remove_file(KEY_FILE) {
        Ok(()) => {}
        Err(err) if err.kind() == std::io::ErrorKind::NotFound => {}
        Err(err) => return Err(err.into()),
    }
    audit::wireguard_key_removed(&client.source_ip());

    Ok(Json(ApiResponse::ok(build_response().await?)))
}

async fn store_private_key(key: &str, source: &str) -> Result<()> {
    write_0600_atomic(Path::new(KEY_FILE), format!("{key}\n").as_bytes())?;
    audit::wireguard_key_set(source);

    // A running tunnel keeps using the old key until it is rebuilt.
    if read_config().enabled {
        apply_service(true).await?;
    }
    Ok(())
}

async fn apply_service(enabled: bool) -> Result<()> {
    let action = if enabled { "restart" } else { "stop" };
    let output = run_allowed(AllowedCommand::ServiceWireguard, [action], COMMAND_TIMEOUT).await?;
    if output.status != 0 {
        return Err(AppError::Internal(command_error(
            "failed to apply WireGuard settings",
            output,
        )));
    }
    Ok(())
}

async fn build_response() -> Result<WireguardRsp> {
    let config = read_config();
    let key = read_private_key();
    let public_key = match &key {
        Some(key) => derive_public_key(key).await.unwrap_or_default(),
        None => String::new(),
    };
    let tool_installed = Path::new(WG_PATH).is_file();
    let (running, latest_handshake, rx_bytes, tx_bytes) = if tool_installed {
        read_runtime(&config.peer.public_key).await
    } else {
        (false, 0, 0, 0)
    };

    Ok(WireguardRsp {
        config,
        private_key_set: key.is_some(),
        public_key,
        tool_installed,
        running,
        latest_handshake,
        rx_bytes,
        tx_bytes,
        firewall_blocked: system_firewall::paranoid_mode_enabled(),
    })
}

async fn derive_public_key(private_key: &str) -> Option<String> {
    let output = run_allowed_with_stdin(
        AllowedCommand::Wg,
        ["pubkey"],
        format!("{private_key}\n").as_bytes(),
        COMMAND_TIMEOUT,
    )
    .await
    .ok()?;
    if output.status != 0 {
        return None;
    }
    Some(String::from_utf8_lossy(&output.stdout).trim().to_string())
}

/// Runtime state of the interface: running, last handshake and transfer counters for the peer.
/// Uses the `latest-handshakes` and `transfer` views because `dump` includes the private key.
async fn read_runtime(peer_key: &str) -> (bool, u64, u64, u64) {
    let handshakes = run_allowed(
        AllowedCommand::Wg,
        ["show", INTERFACE, "latest-handshakes"],
        COMMAND_TIMEOUT,
    )
    .await;
    let Ok(handshakes) = handshakes else {
        return (false, 0, 0, 0);
    };
    if handshakes.status != 0 {
        return (false, 0, 0, 0);
    }
    let handshake = peer_columns(&handshakes.stdout, peer_key)
        .first()
        .copied()
        .unwrap_or(0);

    let transfer = run_allowed(
        AllowedCommand::Wg,
        ["show", INTERFACE, "transfer"],
        COMMAND_TIMEOUT,
    )
    .await;
    let (rx, tx) = match transfer {
        Ok(output) if output.status == 0 => {
            let columns = peer_columns(&output.stdout, peer_key);
            (
                columns.first().copied().unwrap_or(0),
                columns.get(1).copied().unwrap_or(0),
            )
        }
        _ => (0, 0),
    };

    (true, handshake, rx, tx)
}

/// The numeric columns after the public key on the line for `peer_key`.
fn peer_columns(output: &[u8], peer_key: &str) -> Vec<u64> {
    String::from_utf8_lossy(output)
        .lines()
        .filter_map(|line| {
            let mut fields = line.split('\t');
            (fields.next()? == peer_key).then(|| fields.filter_map(|f| f.parse().ok()).collect())
        })
        .next()
        .unwrap_or_default()
}

fn private_key_set() -> bool {
    read_private_key().is_some()
}

fn read_private_key() -> Option<String> {
    let key = fs::read_to_string(KEY_FILE).ok()?;
    let key = key.trim();
    validate_key(key, "private key").ok()?;
    Some(key.to_string())
}

fn read_config() -> WireguardConfig {
    fs::read_to_string(CONFIG_FILE)
        .map(|text| parse_config(&text))
        .unwrap_or_default()
}

fn parse_config(text: &str) -> WireguardConfig {
    let mut config = WireguardConfig::default();
    for line in text.lines() {
        let Some((key, value)) = line.split_once('=') else {
            continue;
        };
        let value = value.trim();
        match key.trim() {
            "Enabled" => config.enabled = value == "yes",
            "Address" => config.address = value.to_string(),
            "PublicKey" => config.peer.public_key = value.to_string(),
            "EndpointHost" => config.peer.endpoint_host = value.to_string(),
            "EndpointPort" => config.peer.endpoint_port = value.parse().unwrap_or(0),
            "AllowedIPs" => {
                config.peer.allowed_ips = value
                    .split(',')
                    .filter(|part| !part.is_empty())
                    .map(str::to_string)
                    .collect()
            }
            "PersistentKeepalive" => {
                config.peer.persistent_keepalive = value.parse().unwrap_or(DEFAULT_KEEPALIVE)
            }
            _ => {}
        }
    }
    config
}

/// The file is read by `S45wireguard` and `S40firewall` with `sed`, so keep it one `Key=value`
/// per line and only write values that went through `validate_config`.
fn render_config(config: &WireguardConfig) -> String {
    format!(
        "# Written by the NanoKVM server; change it in Settings > System > WireGuard.\n\
         Enabled={}\n\
         Address={}\n\
         PublicKey={}\n\
         EndpointHost={}\n\
         EndpointPort={}\n\
         AllowedIPs={}\n\
         PersistentKeepalive={}\n",
        if config.enabled { "yes" } else { "no" },
        config.address,
        config.peer.public_key,
        config.peer.endpoint_host,
        config.peer.endpoint_port,
        config.peer.allowed_ips.join(","),
        config.peer.persistent_keepalive,
    )
}

/// Checks every field that is filled in and returns the config in canonical form. Fields may be
/// empty while WireGuard is off; `require_complete` is for turning it on.
fn validate_config(mut config: WireguardConfig) -> Result<WireguardConfig> {
    config.address = config.address.trim().to_string();
    if !config.address.is_empty() {
        config.address = validate_address(&config.address)?;
    }

    let peer = &mut config.peer;
    peer.public_key = peer.public_key.trim().to_string();
    if !peer.public_key.is_empty() {
        validate_key(&peer.public_key, "peer public key")?;
    }

    peer.endpoint_host = peer.endpoint_host.trim().to_string();
    if !peer.endpoint_host.is_empty() {
        validate_endpoint_host(&peer.endpoint_host)?;
    }

    let mut allowed = Vec::new();
    for entry in &peer.allowed_ips {
        let entry = entry.trim();
        if entry.is_empty() {
            continue;
        }
        let normalized = normalize_allowed_ip(entry)?;
        if !allowed.contains(&normalized) {
            allowed.push(normalized);
        }
    }
    if allowed.len() > MAX_ALLOWED_IPS {
        return Err(AppError::BadRequest(format!(
            "at most {MAX_ALLOWED_IPS} allowed IP ranges are supported"
        )));
    }
    peer.allowed_ips = allowed;

    Ok(config)
}

fn require_complete(config: &WireguardConfig) -> Result<()> {
    let peer = &config.peer;
    if config.address.is_empty() {
        return Err(AppError::BadRequest(
            "the WireGuard address is required".to_string(),
        ));
    }
    if peer.public_key.is_empty() {
        return Err(AppError::BadRequest(
            "the peer public key is required".to_string(),
        ));
    }
    if peer.endpoint_host.is_empty() || peer.endpoint_port == 0 {
        return Err(AppError::BadRequest(
            "the peer endpoint and port are required".to_string(),
        ));
    }
    if peer.allowed_ips.is_empty() {
        return Err(AppError::BadRequest(
            "at least one allowed IP range is required".to_string(),
        ));
    }
    Ok(())
}

fn validate_key(key: &str, what: &str) -> Result<()> {
    let valid = key.len() == 44
        && STANDARD
            .decode(key)
            .is_ok_and(|bytes| bytes.len() == 32 && STANDARD.encode(&bytes) == key);
    if valid {
        Ok(())
    } else {
        Err(AppError::BadRequest(format!(
            "the {what} must be a 44-character base64 WireGuard key"
        )))
    }
}

fn parse_ipv4_cidr(text: &str) -> Option<(Ipv4Addr, u8)> {
    let (addr, prefix) = text.split_once('/')?;
    let prefix: u8 = prefix.parse().ok()?;
    (prefix <= 32).then_some(())?;
    Some((addr.parse().ok()?, prefix))
}

fn netmask(prefix: u8) -> u32 {
    u32::MAX.checked_shl(32 - u32::from(prefix)).unwrap_or(0)
}

fn validate_address(text: &str) -> Result<String> {
    let invalid =
        || AppError::BadRequest("the WireGuard address must look like 10.0.0.1/24".to_string());
    let (addr, prefix) = parse_ipv4_cidr(text).ok_or_else(invalid)?;
    if prefix == 0 || addr.is_unspecified() || addr.is_loopback() || addr.is_multicast() {
        return Err(invalid());
    }
    let host = u32::from(addr) & !netmask(prefix);
    if prefix < 31 && (host == 0 || host == !netmask(prefix)) {
        return Err(AppError::BadRequest(
            "the WireGuard address must be a host address, not the network or broadcast address"
                .to_string(),
        ));
    }
    Ok(format!("{addr}/{prefix}"))
}

/// An IPv4 range in canonical `network/prefix` form. A bare address means one host.
fn normalize_allowed_ip(text: &str) -> Result<String> {
    let invalid =
        || AppError::BadRequest(format!("\"{text}\" is not an IPv4 range like 10.0.0.0/24"));
    let (addr, prefix) = match text.contains('/') {
        true => parse_ipv4_cidr(text).ok_or_else(invalid)?,
        false => (text.parse().map_err(|_| invalid())?, 32),
    };
    if prefix == 0 {
        return Err(AppError::BadRequest(
            "a range that covers every address would route all traffic through the tunnel"
                .to_string(),
        ));
    }
    if addr.is_unspecified() || addr.is_loopback() || addr.is_multicast() {
        return Err(invalid());
    }
    let network = Ipv4Addr::from(u32::from(addr) & netmask(prefix));
    Ok(format!("{network}/{prefix}"))
}

/// A host name or an IP address, with nothing the init scripts could mistake for syntax.
fn validate_endpoint_host(host: &str) -> Result<()> {
    if host.parse::<IpAddr>().is_ok() {
        return Ok(());
    }
    let valid = host.len() <= 253
        && host.split('.').all(|label| {
            !label.is_empty()
                && label.len() <= 63
                && !label.starts_with('-')
                && !label.ends_with('-')
                && label
                    .bytes()
                    .all(|byte| byte.is_ascii_alphanumeric() || byte == b'-')
        });
    if valid {
        Ok(())
    } else {
        Err(AppError::BadRequest(
            "the endpoint must be a host name or an IP address".to_string(),
        ))
    }
}

fn command_error(prefix: &str, output: CommandOutput) -> String {
    let text = String::from_utf8_lossy(if output.stderr.is_empty() {
        &output.stdout
    } else {
        &output.stderr
    })
    .trim()
    .to_string();
    if text.is_empty() {
        format!("{prefix} (status {})", output.status)
    } else {
        format!("{prefix}: {text}")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const KEY: &str = "YNqHbfBQKaGvzefSZ7a0zoxkQpXVcZ6uPy1ga0gGlnA=";

    fn filled() -> WireguardConfig {
        WireguardConfig {
            enabled: true,
            address: "10.0.0.1/24".to_string(),
            peer: WireguardPeer {
                public_key: KEY.to_string(),
                endpoint_host: "vpn.example.com".to_string(),
                endpoint_port: 51800,
                allowed_ips: vec!["10.0.0.0/24".to_string()],
                persistent_keepalive: 25,
            },
        }
    }

    #[test]
    fn config_round_trips_through_the_file_format() {
        let config = filled();
        assert_eq!(parse_config(&render_config(&config)), config);
    }

    #[test]
    fn an_empty_file_is_the_default_config() {
        assert_eq!(parse_config(""), WireguardConfig::default());
    }

    #[test]
    fn accepts_valid_keys_only() {
        assert!(validate_key(KEY, "key").is_ok());
        assert!(validate_key("", "key").is_err());
        assert!(validate_key("short", "key").is_err());
        assert!(validate_key(&KEY.replace('Y', "*"), "key").is_err());
        assert!(validate_key(&format!("{KEY}\n"), "key").is_err());
        assert!(validate_key(&"A".repeat(44), "key").is_err());
    }

    #[test]
    fn address_must_be_a_host_in_a_subnet() {
        assert_eq!(validate_address("10.0.0.1/24").unwrap(), "10.0.0.1/24");
        assert_eq!(validate_address("10.0.0.2/32").unwrap(), "10.0.0.2/32");
        assert!(validate_address("10.0.0.0/24").is_err());
        assert!(validate_address("10.0.0.255/24").is_err());
        assert!(validate_address("10.0.0.1").is_err());
        assert!(validate_address("10.0.0.1/33").is_err());
        assert!(validate_address("127.0.0.1/8").is_err());
        assert!(validate_address("0.0.0.0/0").is_err());
        assert!(validate_address("fd00::1/64").is_err());
        assert!(validate_address("10.0.0.1/24; reboot").is_err());
    }

    #[test]
    fn allowed_ips_are_normalized_and_never_cover_everything() {
        assert_eq!(normalize_allowed_ip("10.0.0.5/24").unwrap(), "10.0.0.0/24");
        assert_eq!(normalize_allowed_ip("10.0.0.2").unwrap(), "10.0.0.2/32");
        assert!(normalize_allowed_ip("0.0.0.0/0").is_err());
        assert!(normalize_allowed_ip("10.0.0.0/0").is_err());
        assert!(normalize_allowed_ip("::/0").is_err());
        assert!(normalize_allowed_ip("127.0.0.0/8").is_err());
        assert!(normalize_allowed_ip("224.0.0.0/4").is_err());
        assert!(normalize_allowed_ip("10.0.0.0/24,10.1.0.0/24").is_err());
    }

    #[test]
    fn endpoint_host_rejects_anything_but_names_and_addresses() {
        for ok in ["vpn.example.com", "203.0.113.7", "2001:db8::1", "a-b.c1"] {
            assert!(validate_endpoint_host(ok).is_ok(), "{ok}");
        }
        for bad in [
            "",
            "-a.com",
            "a..com",
            "a b",
            "a;b",
            "a$(x).com",
            "a.com:51820",
            "a_b.com",
        ] {
            assert!(validate_endpoint_host(bad).is_err(), "{bad}");
        }
    }

    #[test]
    fn validation_normalizes_and_deduplicates_allowed_ips() {
        let mut config = filled();
        config.peer.allowed_ips = vec![
            " 10.0.0.9/24 ".to_string(),
            "10.0.0.0/24".to_string(),
            String::new(),
        ];
        let config = validate_config(config).unwrap();
        assert_eq!(config.peer.allowed_ips, vec!["10.0.0.0/24".to_string()]);
    }

    #[test]
    fn too_many_allowed_ips_are_refused() {
        let mut config = filled();
        config.peer.allowed_ips = (0..=MAX_ALLOWED_IPS)
            .map(|n| format!("10.{n}.0.0/16"))
            .collect();
        assert!(validate_config(config).is_err());
    }

    #[test]
    fn a_disabled_config_may_be_incomplete_but_not_wrong() {
        let blank = validate_config(WireguardConfig::default()).unwrap();
        assert!(require_complete(&blank).is_err());

        let mut config = WireguardConfig::default();
        config.peer.public_key = "nonsense".to_string();
        assert!(validate_config(config).is_err());
    }

    #[test]
    fn enabling_needs_every_field() {
        assert!(require_complete(&filled()).is_ok());

        let mut config = filled();
        config.peer.endpoint_port = 0;
        assert!(require_complete(&config).is_err());

        let mut config = filled();
        config.peer.allowed_ips.clear();
        assert!(require_complete(&config).is_err());
    }

    #[test]
    fn reads_the_peer_line_out_of_wg_output() {
        let peer = KEY;
        let other = "other-peer-key";
        let output = format!("{other}\t5\t6\n{peer}\t1700000000\t12\n");
        assert_eq!(
            peer_columns(output.as_bytes(), peer),
            vec![1_700_000_000, 12]
        );
        assert!(peer_columns(b"", peer).is_empty());
    }
}
