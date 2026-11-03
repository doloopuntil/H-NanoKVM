//! The reverse proxies whose `X-Forwarded-*` headers are believed (see `http::proxy`).
//!
//! Changing the list is a step-up action: a listed address picks the client address that
//! the login lockout and the audit log use, so a stolen session must not be able to add one.

use axum::{Extension, Json, extract::State, response::IntoResponse};
use serde::{Deserialize, Serialize};

use crate::{
    Result,
    api::account::{require_second_factor, verify_password_limited},
    config::Config,
    error::ApiResponse,
    http::{
        middleware::CurrentSession,
        proxy::{ClientInfo, TrustedProxies, normalize_entries},
    },
    state::AppState,
    system::audit,
};

#[derive(Debug, Serialize)]
pub struct TrustedProxiesRsp {
    pub proxies: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct SetTrustedProxiesReq {
    pub proxies: Vec<String>,
    pub password: String,
    #[serde(default)]
    pub code: Option<String>,
}

pub async fn get(State(state): State<AppState>) -> Result<impl IntoResponse> {
    Ok(Json(ApiResponse::ok(TrustedProxiesRsp {
        proxies: state.trusted_proxies().entries(),
    })))
}

pub async fn set(
    State(state): State<AppState>,
    Extension(CurrentSession(session)): Extension<CurrentSession>,
    client: ClientInfo,
    Json(req): Json<SetTrustedProxiesReq>,
) -> Result<impl IntoResponse> {
    let proxies = normalize_entries(&req.proxies)?;

    let source_ip = client.source_ip();
    verify_password_limited(&state, &source_ip, &session.username, &req.password).await?;
    require_second_factor(&state, &session.username, &source_ip, req.code.as_deref()).await?;

    let mut config = Config::read()?;
    config.security.trusted_proxies = proxies.clone();
    config.write()?;

    let (trusted, _) = TrustedProxies::from_entries(&proxies);
    state.set_trusted_proxies(trusted);
    audit::trusted_proxies_changed(&session.username, &source_ip, &proxies);

    Ok(Json(ApiResponse::ok(TrustedProxiesRsp { proxies })))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::AppError;

    async fn state() -> (tempfile::TempDir, AppState, crate::auth::session::Session) {
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

    async fn request(
        state: &AppState,
        session: &crate::auth::session::Session,
        proxies: &[&str],
        password: &str,
    ) -> Result<()> {
        set(
            State(state.clone()),
            Extension(CurrentSession(session.clone())),
            ClientInfo::direct([127, 0, 0, 1].into()),
            Json(SetTrustedProxiesReq {
                proxies: proxies.iter().map(|entry| entry.to_string()).collect(),
                password: password.to_string(),
                code: None,
            }),
        )
        .await
        .map(|_| ())
    }

    #[tokio::test]
    async fn changing_the_list_needs_the_password() {
        let (_dir, state, session) = state().await;

        let wrong = request(&state, &session, &["10.66.0.1"], "not the password").await;

        assert!(matches!(wrong, Err(AppError::InvalidCredentials)));
        assert!(state.trusted_proxies().is_empty());
    }

    #[tokio::test]
    async fn an_invalid_entry_is_refused_before_the_password_is_checked() {
        let (_dir, state, session) = state().await;

        let result = request(&state, &session, &["0.0.0.0/0"], "correct horse battery").await;

        assert!(matches!(result, Err(AppError::BadRequest(_))), "{result:?}");
        assert!(state.trusted_proxies().is_empty());
    }

    #[tokio::test]
    async fn the_list_starts_from_the_config() {
        let mut config = Config::default();
        config.security.trusted_proxies = vec!["10.66.0.1".to_string(), "oops".to_string()];
        let state = AppState::new(config).await.unwrap();

        assert_eq!(state.trusted_proxies().entries(), ["10.66.0.1"]);
    }
}
