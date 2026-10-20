use std::{
    collections::HashMap,
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};

use tokio::sync::RwLock;

use crate::auth::token::random_token;

#[path = "session_lifetime.rs"]
mod lifetime;
pub(crate) use lifetime::SessionLifetime;

#[derive(Debug, Clone)]
pub struct Session {
    pub token: String,
    pub username: String,
    pub csrf_token: String,
    pub expires_at: Instant,
    pub expires_at_unix: u64,
    lifetime: SessionLifetime,
}

impl Session {
    // Transports capture liveness without retaining the bearer/CSRF credentials.
    pub(crate) fn lifetime(&self) -> SessionLifetime {
        self.lifetime.clone()
    }
}

fn deadline(ttl_secs: u64) -> (Instant, u64) {
    let ttl = Duration::from_secs(ttl_secs);
    let expires_at_unix = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .saturating_add(ttl)
        .as_secs();
    (Instant::now() + ttl, expires_at_unix)
}

#[derive(Debug, Default)]
pub struct SessionStore {
    sessions: RwLock<HashMap<String, Session>>,
}

impl SessionStore {
    pub fn new() -> Self {
        Self::default()
    }

    pub async fn issue(&self, username: &str, ttl_secs: u64) -> Session {
        let token = random_token(32);
        let csrf_token = random_token(32);
        let (expires_at, expires_at_unix) = deadline(ttl_secs);
        let session = Session {
            token: token.clone(),
            username: username.to_string(),
            csrf_token,
            expires_at,
            expires_at_unix,
            lifetime: SessionLifetime::new(expires_at),
        };
        if let Some(previous) = self.sessions.write().await.insert(token, session.clone()) {
            previous.lifetime.revoke();
        }
        session
    }

    pub async fn validate(&self, token: &str) -> Option<Session> {
        let mut sessions = self.sessions.write().await;
        let session = sessions.get(token).cloned()?;
        if !session.lifetime.is_active() {
            sessions.remove(token);
            return None;
        }
        Some(session)
    }

    pub async fn retime(&self, token: &str, ttl_secs: u64) -> Option<Session> {
        let (expires_at, expires_at_unix) = deadline(ttl_secs);
        let mut sessions = self.sessions.write().await;
        let session = sessions.get_mut(token)?;
        if !session.lifetime.retime(expires_at) {
            sessions.remove(token);
            return None;
        }
        session.expires_at = expires_at;
        session.expires_at_unix = expires_at_unix;
        Some(session.clone())
    }

    /// Slide a live session to a full `ttl_secs` from now. Like `retime`, it never revives a
    /// session that has already run out.
    pub async fn touch(&self, token: &str, ttl_secs: u64) -> Option<Session> {
        self.retime(token, ttl_secs).await
    }

    pub async fn revoke(&self, token: &str) {
        if let Some(session) = self.sessions.write().await.remove(token) {
            session.lifetime.revoke();
        }
    }

    pub async fn revoke_user(&self, username: &str) {
        self.sessions.write().await.retain(|_, session| {
            if session.username == username {
                session.lifetime.revoke();
                false
            } else {
                true
            }
        });
    }

    /// Revoke an account's sessions apart from `keep_token`.
    ///
    /// Used when a security setting is changed from the web UI: every other
    /// session should be invalidated, but logging out the session performing
    /// the change would be gratuitous.
    pub async fn revoke_user_except(&self, username: &str, keep_token: &str) {
        self.sessions.write().await.retain(|token, session| {
            if session.username != username || token == keep_token {
                true
            } else {
                session.lifetime.revoke();
                false
            }
        });
    }
}

impl Drop for SessionStore {
    fn drop(&mut self) {
        for session in self.sessions.get_mut().values() {
            session.lifetime.revoke();
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use lifetime::SessionEnd;

    #[tokio::test]
    async fn logout_revokes_old_captures_but_not_a_same_name_login() {
        let store = SessionStore::new();
        let old = store.issue("admin", 60).await;
        let capture = store.validate(&old.token).await.unwrap().lifetime();
        let next = store.issue("admin", 60).await;
        store.revoke(&old.token).await;
        assert_eq!(capture.ended().await, SessionEnd::Revoked);
        assert!(store.validate(&old.token).await.is_none());
        assert!(store.retime(&old.token, 300).await.is_none());
        assert!(next.lifetime().is_active());
        assert!(store.validate(&next.token).await.is_some());
    }

    #[tokio::test]
    async fn user_revocation_ends_all_of_that_users_handles_only() {
        let store = SessionStore::new();
        let first = store.issue("admin", 60).await;
        let second = store.issue("admin", 60).await;
        let unrelated = store.issue("other", 60).await;
        store.revoke_user("admin").await;
        assert_eq!(first.lifetime().ended().await, SessionEnd::Revoked);
        assert_eq!(second.lifetime().ended().await, SessionEnd::Revoked);
        assert!(unrelated.lifetime().is_active());
        assert!(store.validate(&first.token).await.is_none());
        assert!(store.validate(&second.token).await.is_none());
        assert!(store.validate(&unrelated.token).await.is_some());
    }

    #[tokio::test]
    async fn retime_of_an_expired_store_entry_does_not_resurrect_captures() {
        let store = SessionStore::new();
        let session = store.issue("admin", 0).await;
        assert!(store.retime(&session.token, 300).await.is_none());
        assert_eq!(session.lifetime().ended().await, SessionEnd::Expired);
        assert!(store.validate(&session.token).await.is_none());
        let next = store.issue("admin", 60).await;
        assert!(next.lifetime().is_active());
        assert_eq!(session.lifetime().ended().await, SessionEnd::Expired);
    }

    #[tokio::test]
    async fn retime_updates_a_capture_and_zero_ttl_ends_it_without_validate() {
        let store = SessionStore::new();
        let session = store.issue("admin", 60).await;
        let capture = session.lifetime();
        let renewed = store.retime(&session.token, 300).await.unwrap();
        assert!(renewed.expires_at > session.expires_at);
        assert!(capture.is_active());
        store.retime(&session.token, 0).await.unwrap();
        assert_eq!(capture.ended().await, SessionEnd::Expired);
        assert!(store.retime(&session.token, 300).await.is_none());
    }

    #[tokio::test]
    async fn revoke_and_retime_in_either_order_cannot_renew_a_revoked_login() {
        for renew_first in [false, true] {
            let store = SessionStore::new();
            let session = store.issue("admin", 60).await;
            if renew_first {
                store.retime(&session.token, 300).await.unwrap();
            }
            store.revoke(&session.token).await;
            assert_eq!(session.lifetime().ended().await, SessionEnd::Revoked);
            assert!(store.retime(&session.token, 300).await.is_none());
            assert!(store.issue("admin", 60).await.lifetime().is_active());
            assert_eq!(session.lifetime().ended().await, SessionEnd::Revoked);
        }
    }

    #[tokio::test]
    async fn losing_the_store_revokes_captures_without_a_reference_cycle() {
        let captured = {
            let store = SessionStore::new();
            store.issue("admin", 60).await.lifetime()
        };
        assert_eq!(captured.ended().await, SessionEnd::Revoked);
    }

    #[tokio::test]
    async fn touching_a_live_session_slides_its_deadline() {
        let store = SessionStore::new();
        let session = store.issue("admin", 2).await;

        let touched = store.touch(&session.token, 3600).await.unwrap();
        assert!(touched.expires_at > session.expires_at + Duration::from_secs(3000));
        assert!(touched.expires_at_unix >= session.expires_at_unix + 3000);
        assert_eq!(touched.token, session.token);
        assert_eq!(touched.csrf_token, session.csrf_token);

        let valid = store.validate(&session.token).await.unwrap();
        assert_eq!(valid.expires_at, touched.expires_at);
    }

    #[tokio::test]
    async fn touching_an_expired_session_does_not_revive_it() {
        let store = SessionStore::new();
        let session = store.issue("admin", 0).await;

        assert!(store.touch(&session.token, 3600).await.is_none());
        assert!(store.validate(&session.token).await.is_none());
    }

    #[tokio::test]
    async fn touching_an_unknown_token_does_nothing() {
        let store = SessionStore::new();
        assert!(store.touch("missing", 3600).await.is_none());
    }
}
