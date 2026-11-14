use std::{
    fs,
    net::{IpAddr, SocketAddr},
    path::PathBuf,
};

use serde::{Deserialize, Serialize};
use tracing::warn;

use crate::{AppError, Result, fsutil::write_0600_atomic, http::proxy::TrustedProxies};

const DEFAULT_CONFIG_PATH: &str = "/etc/kvm/server.yaml";
const DEFAULT_SECRET_PATH: &str = "/etc/kvm/session_secret";

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Config {
    pub proto: String,
    pub host: String,
    pub port: Port,
    pub cert: Cert,
    pub logger: Logger,
    pub authentication: String,
    pub jwt: Jwt,
    pub stun: String,
    pub turn: Turn,
    pub security: Security,
    pub paths: Paths,
    pub compatibility_mode: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Port {
    pub http: u16,
    pub https: u16,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Cert {
    pub crt: String,
    pub key: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Logger {
    pub level: String,
    pub file: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Jwt {
    pub secret_key: String,
    #[serde(alias = "secretKey")]
    pub secret_key_legacy: String,
    #[serde(alias = "refreshTokenDuration")]
    pub refresh_token_duration: u64,
    #[serde(alias = "revokeTokensOnLogout")]
    pub revoke_tokens_on_logout: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
#[derive(Default)]
pub struct Turn {
    #[serde(alias = "turnAddr")]
    pub turn_addr: String,
    #[serde(alias = "turnUser")]
    pub turn_user: String,
    #[serde(alias = "turnCred")]
    pub turn_cred: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Security {
    #[serde(alias = "loginLockoutDuration")]
    pub login_lockout_duration: u64,
    #[serde(alias = "loginMaxFailures")]
    pub login_max_failures: u32,
    pub require_csrf: bool,
    pub websocket_origin_check: bool,
    pub access_token_duration: u64,
    /// Issue the session cookie without a lifetime, so the browser drops it on close.
    pub logout_on_browser_close: bool,
    pub refresh_token_duration: u64,
    pub revoke_tokens_on_password_change: bool,
    pub allow_unsigned_updates: bool,
    pub allow_terminal: bool,
    pub allow_remote_image_download: bool,
    pub allow_auth_disable: bool,
    pub allow_default_admin: bool,
    /// Require a TOTP second factor for web login.
    ///
    /// Enabling this through the API is refused until the account has
    /// confirmed an enrolment. If it is set some other way -- a hand-edited
    /// file, a restored config, a reset `/etc/kvm/pwd` -- login still succeeds
    /// and forces enrolment instead, because refusing would leave a headless
    /// device with no way back in.
    pub require_totp: bool,
    pub allowed_origins: Vec<String>,
    /// Reverse proxies (addresses or ranges) whose `X-Forwarded-For` and
    /// `X-Forwarded-Proto` are believed. Empty: the headers are ignored.
    pub trusted_proxies: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(default)]
pub struct Paths {
    pub account_file: PathBuf,
    pub session_secret_file: PathBuf,
    pub web_root: PathBuf,
    pub image_directory: PathBuf,
    pub update_cache_dir: PathBuf,
    pub system_update_public_key: PathBuf,
    pub system_update_local_public_key: PathBuf,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            proto: "http".to_string(),
            host: "0.0.0.0".to_string(),
            port: Port::default(),
            cert: Cert::default(),
            logger: Logger::default(),
            authentication: "enable".to_string(),
            jwt: Jwt::default(),
            stun: "stun.l.google.com:19302".to_string(),
            turn: Turn::default(),
            security: Security::default(),
            paths: Paths::default(),
            compatibility_mode: false,
        }
    }
}

impl Default for Port {
    fn default() -> Self {
        Self {
            http: 80,
            https: 443,
        }
    }
}

impl Default for Cert {
    fn default() -> Self {
        Self {
            crt: "server.crt".to_string(),
            key: "server.key".to_string(),
        }
    }
}

impl Default for Logger {
    fn default() -> Self {
        Self {
            level: "info".to_string(),
            file: "stdout".to_string(),
        }
    }
}

impl Default for Jwt {
    fn default() -> Self {
        Self {
            secret_key: String::new(),
            secret_key_legacy: String::new(),
            refresh_token_duration: 2_678_400,
            revoke_tokens_on_logout: true,
        }
    }
}

impl Default for Security {
    fn default() -> Self {
        Self {
            login_lockout_duration: 600,
            login_max_failures: 5,
            require_csrf: true,
            websocket_origin_check: true,
            access_token_duration: 900,
            logout_on_browser_close: true,
            refresh_token_duration: 604_800,
            revoke_tokens_on_password_change: true,
            allow_unsigned_updates: false,
            allow_terminal: false,
            allow_remote_image_download: false,
            allow_auth_disable: false,
            allow_default_admin: false,
            require_totp: false,
            allowed_origins: Vec::new(),
            trusted_proxies: Vec::new(),
        }
    }
}

impl Default for Paths {
    fn default() -> Self {
        Self {
            account_file: PathBuf::from("/etc/kvm/pwd"),
            session_secret_file: PathBuf::from(DEFAULT_SECRET_PATH),
            web_root: PathBuf::from("/kvmapp/server/web"),
            image_directory: PathBuf::from("/data"),
            update_cache_dir: PathBuf::from("/data/.hardened-kvmcache"),
            system_update_public_key: PathBuf::from("/etc/kvm/system-update-signing.pub.pem"),
            system_update_local_public_key: PathBuf::from("/etc/kvm/system-update-local.pub.pem"),
        }
    }
}

impl Config {
    pub fn load() -> Result<Self> {
        Self::read()
    }

    pub fn read() -> Result<Self> {
        let path = std::env::var("NANOKVM_CONFIG")
            .map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from(DEFAULT_CONFIG_PATH));
        let mut config = if path.exists() {
            let data = fs::read_to_string(&path)?;
            serde_norway::from_str::<Config>(&data).map_err(|err| {
                AppError::Config(format!("failed to parse {}: {err}", path.display()))
            })?
        } else {
            Config::default()
        };
        config.normalize_legacy_fields();
        Ok(config)
    }

    pub fn write(&self) -> Result<()> {
        let path = std::env::var("NANOKVM_CONFIG")
            .map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from(DEFAULT_CONFIG_PATH));
        let data = serde_norway::to_string(self)
            .map_err(|err| AppError::Config(format!("failed to serialize config: {err}")))?;
        write_0600_atomic(&path, data.as_bytes())?;
        Ok(())
    }

    pub fn listen_addr(&self) -> Result<SocketAddr> {
        self.socket_addr(self.port.http)
    }

    pub fn https_listen_addr(&self) -> Result<SocketAddr> {
        self.socket_addr(self.port.https)
    }

    pub fn loopback_listen_addr(&self) -> SocketAddr {
        SocketAddr::from(([127, 0, 0, 1], self.port.http))
    }

    pub fn needs_dedicated_loopback_listener(&self) -> bool {
        let host = self.host.trim().trim_matches(['[', ']']);
        if host.is_empty() {
            return false;
        }

        match host.parse::<IpAddr>() {
            Ok(ip) => !ip.is_loopback() && !ip.is_unspecified(),
            Err(_) => !host.eq_ignore_ascii_case("localhost"),
        }
    }

    fn socket_addr(&self, port: u16) -> Result<SocketAddr> {
        let ip: IpAddr = if self.host.is_empty() {
            "0.0.0.0"
        } else {
            self.host.as_str()
        }
        .parse()
        .map_err(|err| AppError::Config(format!("invalid host {}: {err}", self.host)))?;
        Ok(SocketAddr::new(ip, port))
    }

    pub fn auth_disabled(&self) -> bool {
        self.authentication == "disable" && self.security.allow_auth_disable
    }

    pub fn log_runtime_warnings(&self) {
        if self.authentication == "disable" {
            warn!("authentication is disabled in config");
        }
        if self.security.login_lockout_duration == 0 {
            warn!("login lockout is disabled");
        }
        if self.proto == "http" {
            warn!("HTTP without TLS is enabled");
        }
        if self.security.allow_terminal {
            warn!("web terminal is enabled");
        }
        if self.security.allow_remote_image_download {
            warn!("remote ISO download is enabled");
        }
        if self.security.allow_unsigned_updates {
            warn!("unsigned updates are allowed");
        }
        if self.security.allow_default_admin {
            warn!("legacy admin/admin bootstrap is enabled");
        }
        let (trusted, rejected) = TrustedProxies::from_entries(&self.security.trusted_proxies);
        for entry in rejected {
            warn!(entry, "ignoring invalid security.trusted_proxies entry");
        }
        if !trusted.is_empty() {
            warn!(
                proxies = ?trusted.entries(),
                "forwarded client address and scheme are trusted from these proxies"
            );
        }
    }

    fn normalize_legacy_fields(&mut self) {
        if self.jwt.secret_key.is_empty() && !self.jwt.secret_key_legacy.is_empty() {
            self.jwt.secret_key = self.jwt.secret_key_legacy.clone();
        }
        if self.paths.update_cache_dir == *"/root/.kvmcache" {
            self.paths.update_cache_dir = PathBuf::from("/data/.hardened-kvmcache");
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::os::unix::fs::{PermissionsExt, symlink};

    #[test]
    fn default_disables_legacy_admin_bootstrap() {
        assert!(!Config::default().security.allow_default_admin);
    }

    #[test]
    fn dedicated_loopback_listener_matches_go_host_rules() {
        let mut config = Config::default();

        for host in ["", "0.0.0.0", "::", "127.0.0.1", "::1", "localhost"] {
            config.host = host.to_string();
            assert!(
                !config.needs_dedicated_loopback_listener(),
                "{host} should not need a dedicated loopback listener"
            );
        }

        for host in ["10.0.87.133", "192.168.1.10", "kvm-bd3e.local"] {
            config.host = host.to_string();
            assert!(
                config.needs_dedicated_loopback_listener(),
                "{host} should need a dedicated loopback listener"
            );
        }
    }

    #[test]
    fn config_write_uses_0600_permissions() {
        let dir = tempfile::tempdir().unwrap();
        // Canonicalized because macOS temp dirs sit under /var, itself a
        // symlink, which the writer refuses to traverse.
        let path = dir.path().canonicalize().unwrap().join("server.yaml");
        write_0600_atomic(&path, b"proto: http\n").unwrap();

        let mode = fs::metadata(&path).unwrap().permissions().mode() & 0o777;
        assert_eq!(mode, 0o600);
        assert_eq!(fs::read_to_string(path).unwrap(), "proto: http\n");
    }

    #[test]
    fn config_write_rejects_symlink_target() {
        let dir = tempfile::tempdir().unwrap();
        let target = dir.path().join("target.yaml");
        let link = dir.path().join("server.yaml");
        fs::write(&target, b"proto: http\n").unwrap();
        symlink(&target, &link).unwrap();

        let err = write_0600_atomic(&link, b"proto: https\n").unwrap_err();
        assert!(err.to_string().contains("symlink"));
        assert_eq!(fs::read_to_string(target).unwrap(), "proto: http\n");
    }
}
