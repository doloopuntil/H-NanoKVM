//! Keeps a managed certificate (Tailscale, later Let's Encrypt) fresh while the server runs:
//! when to renew, what to do after a failure and what the UI reports.

use std::{
    path::Path,
    sync::{
        Arc, OnceLock,
        atomic::{AtomicBool, Ordering},
    },
    time::Duration,
};

use serde::{Deserialize, Serialize};
use tokio::task;

use crate::{
    AppError, Result,
    api::{system_firewall, tailscale},
    auth::clock,
    config::Config,
    fsutil::write_0600_atomic,
    http::{
        acme, cert_store,
        tls::{self, CertResolver},
    },
};
use instant_acme::LetsEncrypt;

const SETTINGS_FILE: &str = "/etc/kvm/certs/settings.json";
const STATUS_FILE: &str = "/etc/kvm/certs/status.json";
/// The self-signed pair every HTTPS switch creates; the way out when a managed one fails.
const FALLBACK_CERT: &str = "/etc/kvm/server.crt";
const FALLBACK_KEY: &str = "/etc/kvm/server.key";

static RESOLVER: OnceLock<Arc<CertResolver>> = OnceLock::new();
static BUSY: AtomicBool = AtomicBool::new(false);
/// The settings name Let's Encrypt or Tailscale as the source.
static MANAGED: AtomicBool = AtomicBool::new(false);

const DAY: u64 = 24 * 60 * 60;
const RENEW_BEFORE: u64 = 30 * DAY;
const CHECK_EVERY: Duration = Duration::from_secs(60 * 60);
/// Waits after the first, second and later consecutive failures.
const BACKOFF: [u64; 3] = [60 * 60, 6 * 60 * 60, DAY];

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Source {
    #[default]
    SelfSigned,
    Tailscale,
    Acme,
}

#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Settings {
    pub source: Source,
    pub domain: String,
    pub email: String,
    /// Use Let's Encrypt's staging CA, whose certificates no browser trusts; for testing.
    pub staging: bool,
}

#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", default)]
pub struct Status {
    /// Unix time the served managed certificate expires.
    pub not_after: Option<u64>,
    pub last_attempt: Option<u64>,
    pub last_success: Option<u64>,
    pub last_error: Option<String>,
    /// Failures in a row since the last success.
    pub failures: u32,
    pub next_attempt: Option<u64>,
}

#[derive(Debug, PartialEq, Eq)]
enum Plan {
    Nothing,
    /// The managed certificate ran out: serve the self-signed one again.
    Fallback,
    Renew,
}

/// What a check does now. `force` skips the wait and the 30-day rule.
fn plan(source: Source, status: &Status, not_after: Option<u64>, now: u64, force: bool) -> Plan {
    if source == Source::SelfSigned {
        return Plan::Nothing;
    }
    let expired = not_after.is_some_and(|expiry| expiry <= now);
    let waiting = status.next_attempt.is_some_and(|at| at > now);
    let due = not_after.is_none_or(|expiry| expiry.saturating_sub(now) <= RENEW_BEFORE);
    if force || (due && !waiting) {
        Plan::Renew
    } else if expired {
        Plan::Fallback
    } else {
        Plan::Nothing
    }
}

/// The status after an attempt; a failure moves the next one out by the backoff.
fn after_attempt(mut status: Status, now: u64, result: std::result::Result<u64, String>) -> Status {
    status.last_attempt = Some(now);
    match result {
        Ok(not_after) => {
            status.not_after = Some(not_after);
            status.last_success = Some(now);
            status.last_error = None;
            status.failures = 0;
            status.next_attempt = None;
        }
        Err(error) => {
            status.failures = status.failures.saturating_add(1);
            let step = (status.failures as usize - 1).min(BACKOFF.len() - 1);
            status.last_error = Some(error);
            status.next_attempt = Some(now + BACKOFF[step]);
        }
    }
    status
}

/// Why a managed certificate cannot be requested right now.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum Blocker {
    ClockUnsynced,
    HttpsOff,
    ParanoidFirewall,
}

impl Blocker {
    pub fn reason(self) -> &'static str {
        match self {
            Blocker::ClockUnsynced => "the device clock is not synchronized",
            Blocker::HttpsOff => "HTTPS is off",
            Blocker::ParanoidFirewall => "Paranoid firewall mode blocks outgoing connections",
        }
    }
}

pub(crate) fn blocker(source: Source) -> Option<Blocker> {
    if source == Source::SelfSigned {
        return None;
    }
    if !clock::is_synced() {
        return Some(Blocker::ClockUnsynced);
    }
    if !Config::read().is_ok_and(|config| config.proto.eq_ignore_ascii_case("https")) {
        return Some(Blocker::HttpsOff);
    }
    if system_firewall::paranoid_mode_enabled() {
        return Some(Blocker::ParanoidFirewall);
    }
    None
}

pub(crate) fn blocked(source: Source) -> Option<&'static str> {
    blocker(source).map(Blocker::reason)
}

pub fn read_settings() -> Settings {
    read_json(Path::new(SETTINGS_FILE))
}

pub fn read_status() -> Status {
    read_json(Path::new(STATUS_FILE))
}

fn read_json<T: Default + for<'de> Deserialize<'de>>(path: &Path) -> T {
    std::fs::read(path)
        .ok()
        .and_then(|data| serde_json::from_slice(&data).ok())
        .unwrap_or_default()
}

fn write_json<T: Serialize>(path: &Path, value: &T) -> Result<()> {
    let data = serde_json::to_vec(value)
        .map_err(|err| AppError::Internal(format!("failed to encode {}: {err}", path.display())))?;
    write_0600_atomic(path, &data)
}

pub fn write_settings(settings: &Settings) -> Result<()> {
    write_json(Path::new(SETTINGS_FILE), settings)?;
    note_source(settings.source);
    Ok(())
}

fn note_source(source: Source) {
    MANAGED.store(source != Source::SelfSigned, Ordering::Release);
}

/// HTTPS serves a Let's Encrypt or Tailscale certificate that is not waiting for confirmation:
/// the only case where a browser keeps HSTS, so the only one it is sent in.
pub fn hsts_applies() -> bool {
    RESOLVER.get().is_some()
        && MANAGED.load(Ordering::Acquire)
        && !crate::api::tls_switch::is_pending()
}

fn write_status(status: &Status) {
    if let Err(err) = write_json(Path::new(STATUS_FILE), status) {
        tracing::warn!(error = %err, "failed to save the certificate status");
    }
}

fn unix(time: time::OffsetDateTime) -> u64 {
    u64::try_from(time.unix_timestamp()).unwrap_or(0)
}

/// What a check did.
#[derive(Debug, PartialEq, Eq)]
pub enum Outcome {
    /// Nothing was due, or another check was already running.
    Idle,
    Renewed,
    Failed(String),
}

/// The listener's certificate handle; set once the HTTPS server runs.
pub fn resolver() -> Option<Arc<CertResolver>> {
    RESOLVER.get().cloned()
}

/// A request for a certificate is running.
pub fn is_busy() -> bool {
    BUSY.load(Ordering::Acquire)
}

struct BusyGuard;

impl BusyGuard {
    fn take() -> Option<Self> {
        BUSY.compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
            .ok()
            .map(|_| Self)
    }
}

impl Drop for BusyGuard {
    fn drop(&mut self) {
        BUSY.store(false, Ordering::Release);
    }
}

fn serve_fallback(resolver: &CertResolver) {
    tracing::warn!("the managed certificate expired; serving the self-signed one");
    if let Err(err) = resolver.reload(FALLBACK_CERT, FALLBACK_KEY) {
        tracing::error!(error = %err, "failed to switch to the self-signed certificate");
    }
}

/// Check once and renew if it is time; the UI's "Renew now" passes `force`.
pub async fn check(resolver: &Arc<CertResolver>, force: bool) -> Outcome {
    let Some(_busy) = BusyGuard::take() else {
        return Outcome::Idle;
    };
    let settings = read_settings();
    let mut status = read_status();
    let now = clock::now_unix();
    let not_after = task::spawn_blocking(|| {
        std::fs::read(cert_store::MANAGED_PEM)
            .ok()
            .and_then(|pem| cert_store::not_after(&pem).ok())
            .map(unix)
    })
    .await
    .ok()
    .flatten();

    match plan(settings.source, &status, not_after, now, force) {
        Plan::Nothing => Outcome::Idle,
        Plan::Fallback => {
            serve_fallback(resolver);
            Outcome::Idle
        }
        Plan::Renew => {
            let result = match blocked(settings.source) {
                Some(reason) => Err(format!("Cannot request a certificate: {reason}")),
                None => renew(resolver, &settings).await,
            };
            if let Err(error) = &result {
                tracing::warn!(%error, "certificate renewal failed");
                // an expired certificate is not worth serving while the wait runs
                if not_after.is_some_and(|expiry| expiry <= now) {
                    serve_fallback(resolver);
                }
            }
            let outcome = match &result {
                Ok(_) => Outcome::Renewed,
                Err(error) => Outcome::Failed(error.clone()),
            };
            // a failed attempt keeps the old expiry, so the 30-day rule still applies
            status.not_after = status.not_after.or(not_after);
            let status = after_attempt(status, now, result);
            let _ = task::spawn_blocking(move || write_status(&status)).await;
            outcome
        }
    }
}

async fn renew(
    resolver: &Arc<CertResolver>,
    settings: &Settings,
) -> std::result::Result<u64, String> {
    match settings.source {
        Source::SelfSigned => unreachable!("planned as nothing"),
        Source::Tailscale => tailscale::install_cert(resolver)
            .await
            .map(|(_, expiry)| unix(expiry))
            .map_err(|err| err.to_string()),
        Source::Acme => renew_acme(resolver, settings)
            .await
            .map_err(|err| err.to_string()),
    }
}

async fn renew_acme(resolver: &Arc<CertResolver>, settings: &Settings) -> Result<u64> {
    let (directory_url, account_file) = if settings.staging {
        (LetsEncrypt::Staging.url(), "account-staging.json")
    } else {
        (LetsEncrypt::Production.url(), "account-production.json")
    };
    let account_path = Path::new(cert_store::CERT_DIR).join(account_file);
    let issued = acme::issue(
        resolver,
        &acme::Settings {
            directory_url,
            domain: &settings.domain,
            email: Some(settings.email.as_str()).filter(|email| !email.is_empty()),
            account_path: &account_path,
        },
    )
    .await?;

    let resolver = resolver.clone();
    let expiry = task::spawn_blocking(move || {
        cert_store::install(
            &resolver,
            Path::new(cert_store::MANAGED_PEM),
            &issued.cert_pem,
            &issued.key_pem,
        )
    })
    .await
    .map_err(|err| AppError::Internal(format!("install the certificate: {err}")))??;
    Ok(unix(expiry))
}

/// The listener's configuration from the configured files. If those are a managed certificate
/// that no longer loads, the self-signed pair serves instead, so the server still starts.
pub fn load_server_config(
    config: &Config,
) -> Result<(tokio_rustls::rustls::ServerConfig, Arc<CertResolver>)> {
    match tls::load_server_config(&config.cert.crt, &config.cert.key) {
        Err(err) if config.cert.crt == cert_store::MANAGED_PEM => {
            tracing::error!(error = %err, "the managed certificate does not load; using the self-signed one");
            tls::load_server_config(FALLBACK_CERT, FALLBACK_KEY)
        }
        result => result,
    }
}

/// Check every hour for as long as the server runs; the plan decides whether anything is due.
pub fn spawn(resolver: Arc<CertResolver>) {
    note_source(read_settings().source);
    let _ = RESOLVER.set(resolver.clone());
    tokio::spawn(async move {
        // a crash during an order can leave the validation window open
        if read_settings().source == Source::Acme {
            system_firewall::close_acme_window().await;
        }
        loop {
            let _ = check(&resolver, false).await;
            tokio::time::sleep(CHECK_EVERY).await;
        }
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    const NOW: u64 = 1_800_000_000;

    #[test]
    fn a_self_signed_certificate_is_never_renewed() {
        let status = Status::default();
        assert_eq!(
            plan(Source::SelfSigned, &status, None, NOW, true),
            Plan::Nothing
        );
    }

    #[test]
    fn a_certificate_is_renewed_in_its_last_30_days_only() {
        let status = Status::default();
        let at = |left: u64| plan(Source::Tailscale, &status, Some(NOW + left), NOW, false);
        assert_eq!(at(60 * DAY), Plan::Nothing);
        assert_eq!(at(31 * DAY), Plan::Nothing);
        assert_eq!(at(30 * DAY), Plan::Renew);
        assert_eq!(at(DAY), Plan::Renew);
        // no certificate yet
        assert_eq!(
            plan(Source::Tailscale, &status, None, NOW, false),
            Plan::Renew
        );
    }

    #[test]
    fn a_failure_waits_and_an_expired_certificate_falls_back_meanwhile() {
        let waiting = Status {
            next_attempt: Some(NOW + 3600),
            ..Status::default()
        };
        let plan_for = |left: Option<u64>, force| {
            plan(
                Source::Tailscale,
                &waiting,
                left.map(|l| NOW + l),
                NOW,
                force,
            )
        };
        assert_eq!(plan_for(Some(5 * DAY), false), Plan::Nothing);
        assert_eq!(plan_for(Some(5 * DAY), true), Plan::Renew);

        // expired while waiting for the next attempt
        let expired = plan(Source::Tailscale, &waiting, Some(NOW - 1), NOW, false);
        assert_eq!(expired, Plan::Fallback);
        // once the wait is over it tries again first
        let later = plan(
            Source::Tailscale,
            &waiting,
            Some(NOW - 1),
            NOW + 3601,
            false,
        );
        assert_eq!(later, Plan::Renew);
    }

    #[test]
    fn failures_back_off_and_a_success_resets() {
        let mut status = Status::default();
        for (failures, wait) in [(1, 3600), (2, 6 * 3600), (3, DAY), (4, DAY)] {
            status = after_attempt(status, NOW, Err("no route".to_string()));
            assert_eq!(status.failures, failures);
            assert_eq!(status.next_attempt, Some(NOW + wait));
            assert_eq!(status.last_error.as_deref(), Some("no route"));
        }

        let status = after_attempt(status, NOW + DAY, Ok(NOW + 90 * DAY));
        assert_eq!(status.failures, 0);
        assert_eq!(status.next_attempt, None);
        assert_eq!(status.last_error, None);
        assert_eq!(status.not_after, Some(NOW + 90 * DAY));
        assert_eq!(status.last_success, Some(NOW + DAY));
    }

    #[test]
    fn blockers_have_the_names_the_web_ui_reads() {
        let name = |blocker| serde_json::to_string(&blocker).unwrap();
        assert_eq!(name(Blocker::ClockUnsynced), r#""clockUnsynced""#);
        assert_eq!(name(Blocker::HttpsOff), r#""httpsOff""#);
        assert_eq!(name(Blocker::ParanoidFirewall), r#""paranoidFirewall""#);
    }

    #[test]
    fn missing_or_broken_files_read_as_defaults() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("settings.json");
        assert_eq!(read_json::<Settings>(&path), Settings::default());
        std::fs::write(&path, "not json").unwrap();
        assert_eq!(read_json::<Settings>(&path), Settings::default());

        let settings = Settings {
            source: Source::Acme,
            domain: "kvm.example.org".to_string(),
            email: String::new(),
            staging: false,
        };
        write_json(&path, &settings).unwrap();
        assert_eq!(read_json::<Settings>(&path), settings);
    }
}
