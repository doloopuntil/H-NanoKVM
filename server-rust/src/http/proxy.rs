//! Reverse-proxy support: who the client is, and which scheme it used.
//!
//! `X-Forwarded-For` and `X-Forwarded-Proto` are read only when the TCP peer is
//! in `security.trusted_proxies`. From anyone else they are ignored, so a client
//! cannot pick its own address for the login limiter or the audit log.

use std::net::{IpAddr, Ipv4Addr, Ipv6Addr};

use axum::{
    extract::{FromRequestParts, connect_info::ConnectInfo},
    http::{Extensions, HeaderMap, request::Parts},
};

use crate::{AppError, http::tls::ClientAddr, state::AppState};

/// Longest `trusted_proxies` list the API accepts.
pub const MAX_TRUSTED_PROXIES: usize = 16;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Network {
    addr: IpAddr,
    prefix: u8,
}

impl Network {
    fn contains(&self, ip: IpAddr) -> bool {
        match (self.addr, ip) {
            (IpAddr::V4(net), IpAddr::V4(ip)) => {
                mask_v4(u32::from(net), self.prefix) == mask_v4(u32::from(ip), self.prefix)
            }
            (IpAddr::V6(net), IpAddr::V6(ip)) => {
                mask_v6(u128::from(net), self.prefix) == mask_v6(u128::from(ip), self.prefix)
            }
            _ => false,
        }
    }
}

fn mask_v4(value: u32, prefix: u8) -> u32 {
    match prefix {
        0 => 0,
        prefix => value & (u32::MAX << (32 - u32::from(prefix))),
    }
}

fn mask_v6(value: u128, prefix: u8) -> u128 {
    match prefix {
        0 => 0,
        prefix => value & (u128::MAX << (128 - u32::from(prefix))),
    }
}

/// The addresses allowed to speak for a client, parsed from the config list.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub struct TrustedProxies {
    networks: Vec<Network>,
}

impl TrustedProxies {
    /// Parse a stored list. Entries that do not parse are returned beside the set,
    /// and left out of it: a typo trusts less, never more.
    pub fn from_entries(entries: &[String]) -> (Self, Vec<String>) {
        let mut networks = Vec::new();
        let mut rejected = Vec::new();
        for entry in entries {
            match parse_entry(entry) {
                Some(network) => networks.push(network),
                None => rejected.push(entry.clone()),
            }
        }
        (Self { networks }, rejected)
    }

    pub fn is_empty(&self) -> bool {
        self.networks.is_empty()
    }

    pub fn entries(&self) -> Vec<String> {
        self.networks.iter().map(format_network).collect()
    }

    pub fn contains(&self, ip: IpAddr) -> bool {
        let ip = ip.to_canonical();
        self.networks.iter().any(|network| network.contains(ip))
    }
}

/// Check and normalise a list submitted through the API: one address or range per entry,
/// the network address for a range, no duplicates.
pub fn normalize_entries(entries: &[String]) -> Result<Vec<String>, AppError> {
    if entries.len() > MAX_TRUSTED_PROXIES {
        return Err(AppError::BadRequest(format!(
            "at most {MAX_TRUSTED_PROXIES} trusted proxies are allowed"
        )));
    }
    let mut out: Vec<String> = Vec::new();
    for entry in entries {
        let network = parse_entry(entry).ok_or_else(|| {
            AppError::BadRequest(format!(
                "{} is not an IP address or a range like 10.66.0.0/24",
                entry.trim()
            ))
        })?;
        let text = format_network(&network);
        if !out.contains(&text) {
            out.push(text);
        }
    }
    Ok(out)
}

/// A bare address or `address/prefix`. A range that covers every address, and the
/// unspecified address, are refused: either would trust the whole internet.
fn parse_entry(entry: &str) -> Option<Network> {
    let entry = entry.trim();
    let (addr, prefix) = match entry.split_once('/') {
        Some((addr, prefix)) => (addr, Some(prefix.parse::<u8>().ok()?)),
        None => (entry, None),
    };
    let addr = addr.parse::<IpAddr>().ok()?.to_canonical();
    if addr.is_unspecified() || addr.is_multicast() {
        return None;
    }
    let max = if addr.is_ipv4() { 32 } else { 128 };
    let prefix = prefix.unwrap_or(max);
    if prefix == 0 || prefix > max {
        return None;
    }
    let addr = match addr {
        IpAddr::V4(ip) => IpAddr::V4(Ipv4Addr::from(mask_v4(u32::from(ip), prefix))),
        IpAddr::V6(ip) => IpAddr::V6(Ipv6Addr::from(mask_v6(u128::from(ip), prefix))),
    };
    Some(Network { addr, prefix })
}

fn format_network(network: &Network) -> String {
    let max = if network.addr.is_ipv4() { 32 } else { 128 };
    if network.prefix == max {
        network.addr.to_string()
    } else {
        format!("{}/{}", network.addr, network.prefix)
    }
}

/// What the server knows about the client of one request.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ClientInfo {
    /// The client's address: the forwarded one behind a trusted proxy, else the peer's.
    pub ip: IpAddr,
    /// Whether the browser reached the server over HTTPS.
    pub secure: bool,
    /// The scheme a trusted proxy reported, if it reported one.
    pub forwarded_https: Option<bool>,
}

impl ClientInfo {
    pub fn source_ip(&self) -> String {
        self.ip.to_string()
    }

    /// A client that connected directly, as in a handler test.
    #[cfg(test)]
    pub fn direct(ip: IpAddr) -> Self {
        Self {
            ip,
            secure: false,
            forwarded_https: None,
        }
    }

    pub fn resolve(
        trusted: &TrustedProxies,
        peer: IpAddr,
        headers: &HeaderMap,
        config_https: bool,
    ) -> Self {
        let peer = peer.to_canonical();
        if !trusted.contains(peer) {
            return Self {
                ip: peer,
                secure: config_https,
                forwarded_https: None,
            };
        }

        let forwarded_https = forwarded_proto(headers);
        Self {
            ip: forwarded_client(trusted, peer, headers),
            secure: forwarded_https.unwrap_or(config_https),
            forwarded_https,
        }
    }

    /// Resolve a request that went through the connect-info layer; `None` without it.
    pub fn from_request(
        state: &AppState,
        extensions: &Extensions,
        headers: &HeaderMap,
    ) -> Option<Self> {
        let ConnectInfo(ClientAddr(peer)) = extensions.get::<ConnectInfo<ClientAddr>>()?;
        Some(Self::resolve(
            &state.trusted_proxies(),
            peer.ip(),
            headers,
            state.config.proto.eq_ignore_ascii_case("https"),
        ))
    }
}

impl FromRequestParts<AppState> for ClientInfo {
    type Rejection = AppError;

    async fn from_request_parts(
        parts: &mut Parts,
        state: &AppState,
    ) -> Result<Self, Self::Rejection> {
        Self::from_request(state, &parts.extensions, &parts.headers)
            .ok_or_else(|| AppError::Internal("missing client address".to_string()))
    }
}

/// The client behind a trusted peer: the rightmost `X-Forwarded-For` hop that is not
/// itself trusted. When every hop is trusted it is the leftmost one. Without a usable
/// header, or at the first hop that is not an address, it is the peer.
fn forwarded_client(trusted: &TrustedProxies, peer: IpAddr, headers: &HeaderMap) -> IpAddr {
    let hops: Vec<&str> = headers
        .get_all("x-forwarded-for")
        .iter()
        .filter_map(|value| value.to_str().ok())
        .flat_map(|value| value.split(','))
        .map(str::trim)
        .collect();

    let mut client = peer;
    for hop in hops.iter().rev() {
        let Ok(ip) = hop.parse::<IpAddr>() else {
            return peer;
        };
        let ip = ip.to_canonical();
        client = ip;
        if !trusted.contains(ip) {
            break;
        }
    }
    client
}

/// The rightmost `X-Forwarded-Proto` value, which is the one the trusted peer wrote.
fn forwarded_proto(headers: &HeaderMap) -> Option<bool> {
    let value = headers
        .get_all("x-forwarded-proto")
        .iter()
        .filter_map(|value| value.to_str().ok())
        .flat_map(|value| value.split(','))
        .map(str::trim)
        .rfind(|value| !value.is_empty())?;
    if value.eq_ignore_ascii_case("https") {
        Some(true)
    } else if value.eq_ignore_ascii_case("http") {
        Some(false)
    } else {
        None
    }
}

#[cfg(test)]
mod tests {
    use axum::http::HeaderValue;

    use super::*;

    fn trusted(entries: &[&str]) -> TrustedProxies {
        let entries: Vec<String> = entries.iter().map(|entry| entry.to_string()).collect();
        let (set, rejected) = TrustedProxies::from_entries(&entries);
        assert!(rejected.is_empty(), "{rejected:?}");
        set
    }

    fn ip(text: &str) -> IpAddr {
        text.parse().unwrap()
    }

    fn headers(pairs: &[(&'static str, &'static str)]) -> HeaderMap {
        let mut map = HeaderMap::new();
        for (name, value) in pairs {
            map.append(*name, HeaderValue::from_static(value));
        }
        map
    }

    fn resolve(
        set: &TrustedProxies,
        peer: &str,
        pairs: &[(&'static str, &'static str)],
    ) -> ClientInfo {
        ClientInfo::resolve(set, ip(peer), &headers(pairs), false)
    }

    #[test]
    fn untrusted_peer_cannot_pick_its_address_or_scheme() {
        let set = trusted(&["10.66.0.1"]);
        let info = resolve(
            &set,
            "203.0.113.9",
            &[
                ("x-forwarded-for", "198.51.100.7"),
                ("x-forwarded-proto", "https"),
            ],
        );

        assert_eq!(info.ip, ip("203.0.113.9"));
        assert!(!info.secure);
        assert_eq!(info.forwarded_https, None);
    }

    #[test]
    fn nothing_is_trusted_by_default() {
        let info = resolve(
            &TrustedProxies::default(),
            "10.66.0.1",
            &[
                ("x-forwarded-for", "198.51.100.7"),
                ("x-forwarded-proto", "https"),
            ],
        );

        assert_eq!(info.ip, ip("10.66.0.1"));
        assert!(!info.secure);
    }

    #[test]
    fn trusted_peer_speaks_for_its_client() {
        let set = trusted(&["10.66.0.1"]);
        let info = resolve(
            &set,
            "10.66.0.1",
            &[
                ("x-forwarded-for", "198.51.100.7"),
                ("x-forwarded-proto", "https"),
            ],
        );

        assert_eq!(info.ip, ip("198.51.100.7"));
        assert!(info.secure);
        assert_eq!(info.forwarded_https, Some(true));
    }

    #[test]
    fn trusted_peer_without_headers_is_its_own_client() {
        let set = trusted(&["10.66.0.1"]);
        let info = resolve(&set, "10.66.0.1", &[]);

        assert_eq!(info.ip, ip("10.66.0.1"));
        assert!(!info.secure);
        assert_eq!(info.forwarded_https, None);
    }

    #[test]
    fn config_scheme_stands_when_the_proxy_names_none() {
        let set = trusted(&["10.66.0.1"]);
        let info = ClientInfo::resolve(&set, ip("10.66.0.1"), &HeaderMap::new(), true);

        assert!(info.secure);
        assert_eq!(info.forwarded_https, None);
    }

    #[test]
    fn spoofed_leftmost_hops_are_ignored() {
        let set = trusted(&["10.66.0.1"]);
        // The client sent "1.2.3.4"; the proxy appended the address it saw.
        let info = resolve(
            &set,
            "10.66.0.1",
            &[("x-forwarded-for", "1.2.3.4, 198.51.100.7")],
        );

        assert_eq!(info.ip, ip("198.51.100.7"));
    }

    #[test]
    fn trusted_hops_are_skipped_from_the_right() {
        let set = trusted(&["10.66.0.1", "192.0.2.0/24"]);
        let info = resolve(
            &set,
            "10.66.0.1",
            &[("x-forwarded-for", "1.2.3.4, 198.51.100.7, 192.0.2.50")],
        );

        assert_eq!(info.ip, ip("198.51.100.7"));
    }

    #[test]
    fn several_header_lines_count_as_one_list() {
        let set = trusted(&["10.66.0.1", "192.0.2.0/24"]);
        let info = resolve(
            &set,
            "10.66.0.1",
            &[
                ("x-forwarded-for", "1.2.3.4"),
                ("x-forwarded-for", "198.51.100.7"),
                ("x-forwarded-for", "192.0.2.50"),
            ],
        );

        assert_eq!(info.ip, ip("198.51.100.7"));
    }

    #[test]
    fn all_hops_trusted_gives_the_leftmost() {
        let set = trusted(&["10.66.0.0/24"]);
        let info = resolve(
            &set,
            "10.66.0.1",
            &[("x-forwarded-for", "10.66.0.7, 10.66.0.8")],
        );

        assert_eq!(info.ip, ip("10.66.0.7"));
    }

    #[test]
    fn garbage_hop_falls_back_to_the_peer() {
        let set = trusted(&["10.66.0.1"]);
        for value in ["not-an-ip", "1.2.3.4, unknown", "", "1.2.3.4:5000"] {
            let mut map = HeaderMap::new();
            map.insert("x-forwarded-for", HeaderValue::from_str(value).unwrap());
            let info = ClientInfo::resolve(&set, ip("10.66.0.1"), &map, false);
            assert_eq!(info.ip, ip("10.66.0.1"), "{value:?}");
        }
    }

    #[test]
    fn ipv6_clients_and_mapped_peers() {
        let set = trusted(&["10.66.0.1", "fd00::/8"]);
        let info = resolve(
            &set,
            "::ffff:10.66.0.1",
            &[("x-forwarded-for", "2001:db8::7")],
        );
        assert_eq!(info.ip, ip("2001:db8::7"));

        let info = resolve(
            &set,
            "fd00::5",
            &[("x-forwarded-for", "::ffff:198.51.100.7")],
        );
        assert_eq!(info.ip, ip("198.51.100.7"));
    }

    #[test]
    fn forwarded_proto_reads_the_rightmost_known_value() {
        let set = trusted(&["10.66.0.1"]);
        for (value, expected) in [
            ("https", Some(true)),
            ("HTTPS", Some(true)),
            ("http", Some(false)),
            ("http, https", Some(true)),
            ("https, http", Some(false)),
            ("wss", None),
            ("", None),
        ] {
            let mut map = HeaderMap::new();
            map.insert("x-forwarded-proto", HeaderValue::from_str(value).unwrap());
            let info = ClientInfo::resolve(&set, ip("10.66.0.1"), &map, false);
            assert_eq!(info.forwarded_https, expected, "{value:?}");
        }
    }

    #[test]
    fn forwarded_http_clears_the_secure_flag_of_an_https_server() {
        let set = trusted(&["10.66.0.1"]);
        let mut map = HeaderMap::new();
        map.insert("x-forwarded-proto", HeaderValue::from_static("http"));

        let info = ClientInfo::resolve(&set, ip("10.66.0.1"), &map, true);

        assert!(!info.secure);
    }

    #[test]
    fn ranges_match_by_prefix() {
        let set = trusted(&["10.66.0.0/24", "fd00:1::/32"]);

        assert!(set.contains(ip("10.66.0.200")));
        assert!(!set.contains(ip("10.66.1.1")));
        assert!(set.contains(ip("fd00:1:ffff::1")));
        assert!(!set.contains(ip("fd00:2::1")));
        assert!(!set.contains(ip("203.0.113.1")));
    }

    #[test]
    fn entries_are_normalised_and_deduplicated() {
        let entries = ["10.66.0.5/24", " 10.66.0.0/24 ", "10.66.0.1/32", "fd00::1"];
        let entries: Vec<String> = entries.iter().map(|entry| entry.to_string()).collect();

        assert_eq!(
            normalize_entries(&entries).unwrap(),
            ["10.66.0.0/24", "10.66.0.1", "fd00::1"]
        );
    }

    #[test]
    fn dangerous_or_malformed_entries_are_refused() {
        for entry in [
            "",
            "proxy.example.com",
            "0.0.0.0",
            "::",
            "0.0.0.0/0",
            "10.0.0.0/0",
            "::/0",
            "10.0.0.0/33",
            "fd00::/129",
            "10.0.0.1/",
            "10.0.0.1/-1",
            "224.0.0.1",
        ] {
            assert!(parse_entry(entry).is_none(), "{entry:?}");
            assert!(
                normalize_entries(&[entry.to_string()]).is_err(),
                "{entry:?}"
            );
        }
    }

    #[test]
    fn bad_stored_entries_are_skipped_not_trusted() {
        let entries = vec![
            "10.66.0.1".to_string(),
            "oops".to_string(),
            "0.0.0.0/0".to_string(),
        ];
        let (set, rejected) = TrustedProxies::from_entries(&entries);

        assert_eq!(rejected, ["oops", "0.0.0.0/0"]);
        assert_eq!(set.entries(), ["10.66.0.1"]);
        assert!(!set.contains(ip("203.0.113.1")));
    }

    #[test]
    fn list_length_is_capped() {
        let entries: Vec<String> = (0..=MAX_TRUSTED_PROXIES)
            .map(|i| format!("10.66.0.{}", i + 1))
            .collect();

        assert!(normalize_entries(&entries).is_err());
        assert!(normalize_entries(&entries[..MAX_TRUSTED_PROXIES]).is_ok());
    }

    mod routed {
        use axum::{
            body::{Body, to_bytes},
            http::{Method, Request, StatusCode, header},
        };
        use tower::ServiceExt;

        use super::*;
        use crate::{auth::session::Session, config::Config, http::routes};

        async fn state(proxies: &[&str]) -> (tempfile::TempDir, AppState) {
            let dir = tempfile::tempdir().unwrap();
            let mut config = Config::default();
            config.paths.account_file = dir.path().canonicalize().unwrap().join("pwd");
            config.security.login_max_failures = 2;
            config.security.trusted_proxies = proxies.iter().map(|p| p.to_string()).collect();
            let state = AppState::new(config).await.unwrap();
            state
                .accounts
                .set_account("operator", "correct horse battery")
                .unwrap();
            (dir, state)
        }

        async fn send(
            state: &AppState,
            peer: &str,
            method: Method,
            path: &str,
            extra: &[(&str, &str)],
            body: &'static str,
        ) -> (StatusCode, HeaderMap, serde_json::Value) {
            let mut req = Request::builder()
                .method(method)
                .uri(path)
                .header(header::CONTENT_TYPE, "application/json");
            for (name, value) in extra {
                req = req.header(*name, *value);
            }
            let mut req = req.body(Body::from(body)).unwrap();
            req.extensions_mut().insert(ConnectInfo(ClientAddr(
                format!("{peer}:50000").parse().unwrap(),
            )));
            let rsp = routes::build(state.clone()).oneshot(req).await.unwrap();
            let (parts, body) = rsp.into_parts();
            let bytes = to_bytes(body, usize::MAX).await.unwrap();
            let json = serde_json::from_slice(&bytes).unwrap_or(serde_json::Value::Null);
            (parts.status, parts.headers, json)
        }

        /// The API code of a login with the given password.
        async fn login(
            state: &AppState,
            peer: &str,
            forwarded: &[(&str, &str)],
            password: &'static str,
        ) -> (i64, HeaderMap) {
            let body: &'static str = match password {
                "wrong" => r#"{"username":"operator","password":"wrong"}"#,
                _ => r#"{"username":"operator","password":"correct horse battery"}"#,
            };
            let (_, headers, json) = send(
                state,
                peer,
                Method::POST,
                "/api/auth/login",
                forwarded,
                body,
            )
            .await;
            (json["code"].as_i64().unwrap(), headers)
        }

        const BAD: i64 = -2;
        const LOCKED: i64 = -5;

        #[tokio::test]
        async fn lockout_is_kept_per_forwarded_client_behind_a_trusted_proxy() {
            let (_dir, state) = state(&["10.66.0.1"]).await;
            let a = [("x-forwarded-for", "198.51.100.7")];
            let b = [("x-forwarded-for", "198.51.100.8")];

            assert_eq!(login(&state, "10.66.0.1", &a, "wrong").await.0, BAD);
            assert_eq!(login(&state, "10.66.0.1", &a, "wrong").await.0, BAD);
            assert_eq!(login(&state, "10.66.0.1", &a, "wrong").await.0, LOCKED);

            assert_eq!(login(&state, "10.66.0.1", &b, "wrong").await.0, BAD);
        }

        #[tokio::test]
        async fn untrusted_peer_cannot_dodge_the_lockout_with_forwarded_for() {
            let (_dir, state) = state(&["10.66.0.1"]).await;

            for client in ["198.51.100.1", "198.51.100.2"] {
                let spoof = [("x-forwarded-for", client)];
                assert_eq!(login(&state, "203.0.113.9", &spoof, "wrong").await.0, BAD);
            }
            let spoof = [("x-forwarded-for", "198.51.100.3")];
            assert_eq!(
                login(&state, "203.0.113.9", &spoof, "wrong").await.0,
                LOCKED
            );
        }

        #[tokio::test]
        async fn headers_are_ignored_when_no_proxy_is_trusted() {
            let (_dir, state) = state(&[]).await;

            for client in ["198.51.100.1", "198.51.100.2"] {
                let spoof = [("x-forwarded-for", client)];
                assert_eq!(login(&state, "10.66.0.1", &spoof, "wrong").await.0, BAD);
            }
            let spoof = [("x-forwarded-for", "198.51.100.3")];
            assert_eq!(login(&state, "10.66.0.1", &spoof, "wrong").await.0, LOCKED);
        }

        fn cookie(headers: &HeaderMap) -> String {
            headers
                .get(header::SET_COOKIE)
                .unwrap()
                .to_str()
                .unwrap()
                .to_string()
        }

        #[tokio::test]
        async fn session_cookie_is_secure_only_for_a_trusted_proxys_https() {
            let (_dir, state) = state(&["10.66.0.1"]).await;
            let https = [("x-forwarded-proto", "https")];

            let (code, headers) = login(&state, "10.66.0.1", &https, "right").await;
            assert_eq!(code, 0);
            assert!(cookie(&headers).contains("Secure"), "{}", cookie(&headers));

            let (_, headers) = login(&state, "10.66.0.1", &[], "right").await;
            assert!(!cookie(&headers).contains("Secure"));

            let (_, headers) = login(&state, "203.0.113.9", &https, "right").await;
            assert!(!cookie(&headers).contains("Secure"));
        }

        async fn logout(
            state: &AppState,
            session: &Session,
            peer: &str,
            extra: &[(&str, &str)],
        ) -> StatusCode {
            let bearer = format!("Bearer {}", session.token);
            let mut headers = vec![
                ("authorization", bearer.as_str()),
                ("x-csrf-token", session.csrf_token.as_str()),
                ("host", "kvm.example.com"),
            ];
            headers.extend_from_slice(extra);
            send(state, peer, Method::POST, "/api/auth/logout", &headers, "")
                .await
                .0
        }

        #[tokio::test]
        async fn csrf_origin_follows_the_forwarded_scheme() {
            let (_dir, state) = state(&["10.66.0.1"]).await;
            let session = state.sessions.issue("operator", 900).await;
            let https = ("x-forwarded-proto", "https");
            let secure_origin = ("origin", "https://kvm.example.com");
            let plain_origin = ("origin", "http://kvm.example.com");

            let rsp = logout(&state, &session, "10.66.0.1", &[https, plain_origin]).await;
            assert_eq!(rsp, StatusCode::FORBIDDEN);

            let rsp = logout(&state, &session, "10.66.0.1", &[https, secure_origin]).await;
            assert_eq!(rsp, StatusCode::OK);
        }

        #[tokio::test]
        async fn csrf_origin_ignores_the_scheme_from_an_untrusted_peer() {
            let (_dir, state) = state(&["10.66.0.1"]).await;
            let session = state.sessions.issue("operator", 900).await;
            let extra = [
                ("x-forwarded-proto", "https"),
                ("origin", "http://kvm.example.com"),
            ];

            // Direct clients may use either scheme; a forged header changes nothing.
            let rsp = logout(&state, &session, "203.0.113.9", &extra).await;

            assert_eq!(rsp, StatusCode::OK);
        }
    }
}
