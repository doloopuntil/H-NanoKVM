//! Choosing where the HTTPS certificate comes from: the self-signed one, Tailscale or Let's Encrypt.
//!
//! A change is a step-up action. It runs in the background, since an order can take minutes, and
//! a new certificate is kept only once a signed-in browser confirms it (see `tls_switch`).

use std::{fs, path::Path};

use axum::{Extension, Json, extract::State, response::IntoResponse};
use serde::{Deserialize, Serialize};
use tokio::task;

use crate::{
    AppError, Result,
    api::{
        account::{require_second_factor, verify_password_limited},
        tailscale,
        tls_switch::{self, CertUndo},
    },
    config::Config,
    error::ApiResponse,
    http::{
        acme,
        cert_manager::{self, Outcome, Settings, Source, Status},
        cert_store,
        middleware::CurrentSession,
        proxy::ClientInfo,
        tls,
    },
    state::AppState,
};

const FALLBACK_CERT: &str = "/etc/kvm/server.crt";
const FALLBACK_KEY: &str = "/etc/kvm/server.key";
const BACKUP_PEM: &str = "/etc/kvm/certs/managed.pem.prev";
const NO_TAILSCALE_CERT: &str =
    "Tailscale is not running or HTTPS certificates are not enabled for the tailnet";

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CertRsp {
    https_enabled: bool,
    #[serde(flatten)]
    settings: Settings,
    status: Status,
    /// A request for a certificate is running.
    busy: bool,
    /// When the certificate in use expires, whichever source it has.
    current_not_after: Option<u64>,
    /// The name Tailscale issues a certificate for, when it can.
    tailscale_domain: Option<String>,
    /// Tailscale is running and the tailnet issues certificates.
    tailscale_available: bool,
    /// What stops both managed sources now: the clock, HTTPS being off or the Paranoid firewall.
    blocker: Option<cert_manager::Blocker>,
    /// Where to open the interface once a managed certificate is in use.
    url: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetCertReq {
    pub source: Source,
    #[serde(default)]
    pub domain: String,
    #[serde(default)]
    pub email: String,
    pub password: String,
    /// Second factor, needed when the account has one.
    #[serde(default)]
    pub code: Option<String>,
}

pub async fn get() -> Result<impl IntoResponse> {
    let config = Config::read()?;
    let settings = cert_manager::read_settings();
    let tailscale_domain = tailscale::cert_domain().await;

    let cert_path = config.cert.crt.clone();
    let current_not_after = task::spawn_blocking(move || {
        fs::read(cert_path)
            .ok()
            .and_then(|pem| cert_store::not_after(&pem).ok())
            .and_then(|time| u64::try_from(time.unix_timestamp()).ok())
    })
    .await
    .ok()
    .flatten();

    let url = match settings.source {
        Source::SelfSigned => None,
        Source::Tailscale => tailscale_domain
            .as_deref()
            .map(|name| site_url(name, &config)),
        Source::Acme => Some(site_url(&settings.domain, &config)),
    };

    Ok(Json(ApiResponse::ok(CertRsp {
        https_enabled: config.proto.eq_ignore_ascii_case("https"),
        settings,
        status: cert_manager::read_status(),
        busy: cert_manager::is_busy(),
        current_not_after,
        tailscale_available: tailscale_domain.is_some(),
        tailscale_domain,
        blocker: cert_manager::blocker(Source::Acme),
        url,
    })))
}

fn site_url(domain: &str, config: &Config) -> String {
    match config.port.https {
        443 => format!("https://{domain}/"),
        port => format!("https://{domain}:{port}/"),
    }
}

pub async fn set(
    State(state): State<AppState>,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    client: ClientInfo,
    Json(req): Json<SetCertReq>,
) -> Result<Json<ApiResponse<()>>> {
    let source_ip = client.source_ip();
    verify_password_limited(&state, &source_ip, &session.username, &req.password).await?;
    require_second_factor(&state, &session.username, &source_ip, req.code.as_deref()).await?;

    let resolver = cert_manager::resolver()
        .ok_or_else(|| AppError::Conflict("turn HTTPS on first".to_string()))?;
    if tls_switch::is_pending() {
        return Err(AppError::Conflict(
            "confirm or revert the pending change first".to_string(),
        ));
    }
    if cert_manager::is_busy() {
        return Err(AppError::Conflict(
            "a certificate request is already running".to_string(),
        ));
    }

    let mut settings = Settings {
        source: req.source,
        domain: req.domain.trim().to_ascii_lowercase(),
        email: req.email.trim().to_string(),
        staging: cert_manager::read_settings().staging,
    };
    match settings.source {
        Source::SelfSigned => {}
        Source::Tailscale => {
            settings.domain = tailscale::cert_domain()
                .await
                .ok_or_else(|| AppError::Conflict(NO_TAILSCALE_CERT.to_string()))?;
        }
        Source::Acme => {
            acme::validate_domain(&settings.domain)?;
            if !settings.email.is_empty() {
                acme::validate_email(&settings.email)?;
            }
        }
    }
    if let Some(reason) = cert_manager::blocked(settings.source) {
        return Err(AppError::Conflict(format!(
            "cannot request a certificate: {reason}"
        )));
    }

    let previous_config = Config::read()?;
    tracing::info!(source = ?settings.source, "applying a certificate change");
    tokio::spawn(apply(resolver, settings, previous_config));
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

/// Order the certificate and start the confirmation window; on any failure the previous
/// certificate and settings stay.
async fn apply(
    resolver: std::sync::Arc<tls::CertResolver>,
    settings: Settings,
    previous_config: Config,
) {
    let previous = cert_manager::read_settings();
    if let Err(err) = apply_inner(&resolver, &settings, &previous, &previous_config).await {
        tracing::warn!(error = %err, "the certificate change failed");
        let _ = cert_manager::write_settings(&previous);
        let _ = fs::remove_file(BACKUP_PEM);
    }
}

async fn apply_inner(
    resolver: &std::sync::Arc<tls::CertResolver>,
    settings: &Settings,
    previous: &Settings,
    previous_config: &Config,
) -> Result<()> {
    let backup = task::spawn_blocking(|| -> Result<Option<String>> {
        let managed = Path::new(cert_store::MANAGED_PEM);
        if !managed.exists() {
            return Ok(None);
        }
        fs::copy(managed, BACKUP_PEM)?;
        Ok(Some(BACKUP_PEM.to_string()))
    })
    .await
    .map_err(|err| AppError::Internal(format!("back up the certificate: {err}")))??;

    cert_manager::write_settings(settings)?;
    let mut config = previous_config.clone();

    if settings.source == Source::SelfSigned {
        resolver.reload(FALLBACK_CERT, FALLBACK_KEY)?;
        config.cert.crt = FALLBACK_CERT.to_string();
        config.cert.key = FALLBACK_KEY.to_string();
        config.write()?;
        let _ = fs::remove_file(BACKUP_PEM);
        return Ok(());
    }

    match cert_manager::check(resolver, true).await {
        Outcome::Renewed => {}
        Outcome::Failed(error) => return Err(AppError::Internal(error)),
        Outcome::Idle => {
            return Err(AppError::Conflict(
                "a certificate request is already running".to_string(),
            ));
        }
    }

    config.cert.crt = cert_store::MANAGED_PEM.to_string();
    config.cert.key = cert_store::MANAGED_PEM.to_string();
    let undo = CertUndo {
        settings: previous.clone(),
        backup: backup.clone(),
    };
    let marked = config
        .write()
        .and_then(|()| tls_switch::begin_cert_change(previous_config, undo));
    if let Err(err) = marked {
        // put the old certificate back for new connections before reporting
        if let Some(backup) = &backup {
            let _ = fs::rename(backup, cert_store::MANAGED_PEM);
        }
        let _ = previous_config.write();
        let _ = resolver.reload(&previous_config.cert.crt, &previous_config.cert.key);
        return Err(err);
    }
    Ok(())
}

/// Request a new certificate for the current settings now, without waiting for the 30-day mark.
pub async fn renew() -> Result<Json<ApiResponse<()>>> {
    let settings = cert_manager::read_settings();
    if settings.source == Source::SelfSigned {
        return Err(AppError::BadRequest(
            "the self-signed certificate is not renewed".to_string(),
        ));
    }
    let resolver = cert_manager::resolver()
        .ok_or_else(|| AppError::Conflict("turn HTTPS on first".to_string()))?;
    if tls_switch::is_pending() || cert_manager::is_busy() {
        return Err(AppError::Conflict(
            "a certificate change is already running".to_string(),
        ));
    }
    tokio::spawn(async move {
        let _ = cert_manager::check(&resolver, true).await;
    });
    Ok(Json(ApiResponse::<()>::ok_empty()))
}

#[cfg(test)]
mod tests {
    use axum::{
        body::{Body, to_bytes},
        extract::ConnectInfo,
        http::{HeaderValue, Method, Request, StatusCode, header},
    };
    use tower::ServiceExt;

    use super::*;
    use crate::{auth::session::Session, http::routes};

    async fn state() -> (tempfile::TempDir, AppState, Session) {
        let dir = tempfile::tempdir().unwrap();
        let mut config = Config::default();
        config.paths.account_file = dir.path().canonicalize().unwrap().join("pwd");
        let state = AppState::new(config).await.unwrap();
        state
            .accounts
            .set_account("operator", "correct horse battery")
            .unwrap();
        let session = state.sessions.issue("operator", 900).await;
        (dir, state, session)
    }

    async fn call(
        state: &AppState,
        session: Option<&Session>,
        method: Method,
        path: &str,
        body: &str,
    ) -> (StatusCode, serde_json::Value) {
        let mut req = Request::builder()
            .method(method)
            .uri(path)
            .header(header::CONTENT_TYPE, "application/json");
        if let Some(session) = session {
            req = req
                .header(header::AUTHORIZATION, format!("Bearer {}", session.token))
                .header(
                    "x-csrf-token",
                    HeaderValue::from_str(&session.csrf_token).unwrap(),
                );
        }
        let mut req = req.body(Body::from(body.to_string())).unwrap();
        req.extensions_mut().insert(ConnectInfo(tls::ClientAddr(
            "10.0.0.7:50000".parse().unwrap(),
        )));
        let rsp = routes::build(state.clone()).oneshot(req).await.unwrap();
        let status = rsp.status();
        let bytes = to_bytes(rsp.into_body(), usize::MAX).await.unwrap();
        let json = serde_json::from_slice(&bytes).unwrap_or(serde_json::Value::Null);
        (status, json)
    }

    fn request(password: &str) -> String {
        format!(
            r#"{{"source":"acme","domain":"kvm.example.org","email":"","password":{}}}"#,
            serde_json::to_string(password).unwrap()
        )
    }

    #[tokio::test]
    async fn the_endpoints_need_a_session() {
        let (_dir, state, _session) = state().await;
        for (method, path) in [
            (Method::GET, "/api/vm/cert"),
            (Method::POST, "/api/vm/cert"),
            (Method::POST, "/api/vm/cert/renew"),
        ] {
            let (status, _) = call(&state, None, method, path, "{}").await;
            assert_eq!(status, StatusCode::UNAUTHORIZED, "{path}");
        }
    }

    #[tokio::test]
    async fn the_password_is_checked_before_anything_else() {
        let (_dir, state, session) = state().await;
        let (_, wrong) = call(
            &state,
            Some(&session),
            Method::POST,
            "/api/vm/cert",
            &request("not the password"),
        )
        .await;
        assert_ne!(wrong["code"], 0, "{wrong}");
        assert!(!wrong["msg"].as_str().unwrap().contains("HTTPS"), "{wrong}");

        // the right password gets as far as the missing HTTPS server
        let (_, right) = call(
            &state,
            Some(&session),
            Method::POST,
            "/api/vm/cert",
            &request("correct horse battery"),
        )
        .await;
        assert!(right["msg"].as_str().unwrap().contains("HTTPS"), "{right}");
    }
}
