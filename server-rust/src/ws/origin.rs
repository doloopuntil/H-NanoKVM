use axum::http::{HeaderMap, header};

use crate::{config::Config, http::proxy::ClientInfo};

/// Whether `origin` is the page's own host. A trusted proxy that named the scheme the
/// browser used pins the origin to it, so an `http://` origin is refused behind HTTPS.
pub fn is_host_origin(origin: &str, host: &str, forwarded_https: Option<bool>) -> bool {
    let http = origin == format!("http://{host}");
    let https = origin == format!("https://{host}");
    match forwarded_https {
        Some(true) => https,
        Some(false) => http,
        None => http || https,
    }
}

pub fn validate_ws_origin(headers: &HeaderMap, config: &Config, client: &ClientInfo) -> bool {
    if !config.security.websocket_origin_check {
        return true;
    }

    let Some(origin) = headers
        .get(header::ORIGIN)
        .and_then(|value| value.to_str().ok())
    else {
        return false;
    };

    if config
        .security
        .allowed_origins
        .iter()
        .any(|item| item == origin)
    {
        return true;
    }

    let host = headers
        .get(header::HOST)
        .and_then(|value| value.to_str().ok())
        .unwrap_or_default();
    is_host_origin(origin, host, client.forwarded_https)
}

#[cfg(test)]
mod tests {
    use axum::http::HeaderValue;

    use super::*;

    #[test]
    fn rejects_missing_origin() {
        assert!(!validate_ws_origin(
            &HeaderMap::new(),
            &Config::default(),
            &direct()
        ));
    }

    fn direct() -> ClientInfo {
        ClientInfo::direct([127, 0, 0, 1].into())
    }

    fn proxied(https: bool) -> ClientInfo {
        ClientInfo {
            forwarded_https: Some(https),
            secure: https,
            ..direct()
        }
    }

    fn headers(host: &'static str, origin: &'static str) -> HeaderMap {
        let mut headers = HeaderMap::new();
        headers.insert(header::HOST, HeaderValue::from_static(host));
        headers.insert(header::ORIGIN, HeaderValue::from_static(origin));
        headers
    }

    #[test]
    fn direct_clients_may_use_either_scheme() {
        let config = Config::default();
        for origin in ["http://kvm.example.com", "https://kvm.example.com"] {
            let headers = headers("kvm.example.com", origin);
            assert!(validate_ws_origin(&headers, &config, &direct()), "{origin}");
        }
    }

    #[test]
    fn forwarded_scheme_pins_the_origin_scheme() {
        let config = Config::default();
        let secure = headers("kvm.example.com", "https://kvm.example.com");
        let plain = headers("kvm.example.com", "http://kvm.example.com");

        assert!(validate_ws_origin(&secure, &config, &proxied(true)));
        assert!(!validate_ws_origin(&plain, &config, &proxied(true)));
        assert!(validate_ws_origin(&plain, &config, &proxied(false)));
        assert!(!validate_ws_origin(&secure, &config, &proxied(false)));
    }

    #[test]
    fn forwarded_scheme_does_not_open_other_hosts() {
        let headers = headers("kvm.example.com", "https://evil.example.com");

        assert!(!validate_ws_origin(
            &headers,
            &Config::default(),
            &proxied(true)
        ));
    }

    #[test]
    fn accepts_same_host_origin() {
        let mut headers = HeaderMap::new();
        headers.insert(header::HOST, HeaderValue::from_static("nanokvm.local"));
        headers.insert(
            header::ORIGIN,
            HeaderValue::from_static("http://nanokvm.local"),
        );
        assert!(validate_ws_origin(&headers, &Config::default(), &direct()));
    }
}
