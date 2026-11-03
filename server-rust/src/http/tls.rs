use std::{
    collections::HashMap,
    fs::{self, File, OpenOptions},
    io,
    net::SocketAddr,
    os::unix::fs::{OpenOptionsExt, PermissionsExt},
    path::Path,
    sync::{Arc, RwLock},
    time::Duration,
};

use axum::{
    extract::connect_info::Connected,
    serve::{IncomingStream, Listener},
};
use rcgen::{
    CertificateParams, CertifiedKey, CustomExtension, KeyPair, generate_simple_self_signed,
};
use tokio::{
    net::{TcpListener, TcpStream},
    sync::mpsc,
    time,
};
use tokio_rustls::{
    TlsAcceptor,
    rustls::{
        CipherSuite, ServerConfig,
        crypto::{CryptoProvider, ring},
        pki_types::{CertificateDer, PrivateKeyDer, pem::PemObject},
        server::{ClientHello, ResolvesServerCert},
        sign::CertifiedKey as SignedKey,
    },
    server::TlsStream,
};
use tracing::warn;

use crate::{AppError, Result};

#[derive(Debug, Clone, Copy)]
pub struct ClientAddr(pub SocketAddr);

/// ALPN name of the ACME TLS-ALPN-01 validation handshake (RFC 8737).
const ACME_ALPN: &[u8] = b"acme-tls/1";

/// A client gets this long to finish its handshake before the connection is dropped.
const TLS_HANDSHAKE_TIMEOUT: Duration = Duration::from_secs(10);
const READY_QUEUE: usize = 16;

pub struct TlsListener {
    local_addr: SocketAddr,
    ready: mpsc::Receiver<(TlsStream<TcpStream>, SocketAddr)>,
}

impl Connected<IncomingStream<'_, TcpListener>> for ClientAddr {
    fn connect_info(stream: IncomingStream<'_, TcpListener>) -> Self {
        Self(*stream.remote_addr())
    }
}

impl TlsListener {
    /// Handshakes run in their own tasks, so a slow or silent client does not hold
    /// up the connections behind it.
    pub fn new(listener: TcpListener, config: ServerConfig) -> io::Result<Self> {
        let local_addr = listener.local_addr()?;
        let (tx, ready) = mpsc::channel(READY_QUEUE);
        tokio::spawn(accept_loop(
            listener,
            TlsAcceptor::from(Arc::new(config)),
            tx,
        ));
        Ok(Self { local_addr, ready })
    }
}

async fn accept_loop(
    listener: TcpListener,
    acceptor: TlsAcceptor,
    ready: mpsc::Sender<(TlsStream<TcpStream>, SocketAddr)>,
) {
    while !ready.is_closed() {
        let (stream, addr) = match listener.accept().await {
            Ok(stream) => stream,
            Err(err) => {
                warn!(error = ?err, "failed to accept tcp connection");
                time::sleep(Duration::from_secs(1)).await;
                continue;
            }
        };

        let acceptor = acceptor.clone();
        let ready = ready.clone();
        tokio::spawn(async move {
            match time::timeout(TLS_HANDSHAKE_TIMEOUT, acceptor.accept(stream)).await {
                // A validation handshake carries no HTTP.
                Ok(Ok(stream)) if stream.get_ref().1.alpn_protocol() == Some(ACME_ALPN) => {}
                Ok(Ok(stream)) => {
                    let _ = ready.send((stream, addr)).await;
                }
                Ok(Err(err)) => warn!(%addr, error = ?err, "failed to accept tls connection"),
                Err(_) => warn!(%addr, "tls handshake timed out"),
            }
        });
    }
}

impl Listener for TlsListener {
    type Io = TlsStream<TcpStream>;
    type Addr = SocketAddr;

    async fn accept(&mut self) -> (Self::Io, Self::Addr) {
        match self.ready.recv().await {
            Some(conn) => conn,
            // The accept loop only ends once this receiver is gone.
            None => std::future::pending().await,
        }
    }

    fn local_addr(&self) -> io::Result<Self::Addr> {
        Ok(self.local_addr)
    }
}

impl Connected<IncomingStream<'_, TlsListener>> for ClientAddr {
    fn connect_info(stream: IncomingStream<'_, TlsListener>) -> Self {
        Self(*stream.remote_addr())
    }
}

pub fn install_crypto_provider() {
    let _ = crypto_provider().install_default();
}

/// ring's provider with ChaCha20-Poly1305 first: the C906 has no AES instructions,
/// and ChaCha20 seals video several times faster there than AES-GCM.
fn crypto_provider() -> CryptoProvider {
    let mut provider = ring::default_provider();
    provider
        .cipher_suites
        .sort_by_key(|suite| !is_chacha20(suite.suite()));
    provider
}

fn is_chacha20(suite: CipherSuite) -> bool {
    matches!(
        suite,
        CipherSuite::TLS13_CHACHA20_POLY1305_SHA256
            | CipherSuite::TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256
            | CipherSuite::TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
    )
}

/// Serves the current certificate; `reload` swaps it for new connections without a restart.
#[derive(Debug)]
pub struct CertResolver {
    current: RwLock<Arc<SignedKey>>,
    /// Validation certificates for pending TLS-ALPN-01 challenges, by lowercase domain.
    challenges: RwLock<HashMap<String, Arc<SignedKey>>>,
}

impl CertResolver {
    fn load(cert_path: &Path, key_path: &Path) -> Result<Arc<SignedKey>> {
        let cert_file = File::open(cert_path)?;
        let certs: Vec<CertificateDer<'static>> = CertificateDer::pem_reader_iter(cert_file)
            .collect::<std::result::Result<Vec<_>, _>>()
            .map_err(|err| AppError::Config(format!("failed to read TLS certificate: {err}")))?;
        if certs.is_empty() {
            return Err(AppError::Config(
                "TLS certificate file is empty".to_string(),
            ));
        }

        let key_file = File::open(key_path)?;
        let key = PrivateKeyDer::from_pem_reader(key_file)
            .map_err(|err| AppError::Config(format!("failed to read TLS private key: {err}")))?;

        // Also checks that the key belongs to the certificate.
        SignedKey::from_der(certs, key, &crypto_provider())
            .map(Arc::new)
            .map_err(|err| AppError::Config(format!("failed to configure TLS certificate: {err}")))
    }

    /// Check that a certificate and key load and match, without serving them.
    pub fn check(cert_path: impl AsRef<Path>, key_path: impl AsRef<Path>) -> Result<()> {
        Self::load(cert_path.as_ref(), key_path.as_ref()).map(drop)
    }

    /// Read a new certificate and key; on any error the current one stays in use.
    pub fn reload(&self, cert_path: impl AsRef<Path>, key_path: impl AsRef<Path>) -> Result<()> {
        let loaded = Self::load(cert_path.as_ref(), key_path.as_ref())?;
        *self.current.write().unwrap_or_else(|err| err.into_inner()) = loaded;
        Ok(())
    }

    /// Answer `acme-tls/1` handshakes for `domain` with a validation certificate for `digest`,
    /// the SHA-256 of the key authorization.
    pub fn set_challenge(&self, domain: &str, digest: &[u8]) -> Result<()> {
        let key = validation_cert(domain, digest)?;
        self.challenges
            .write()
            .unwrap_or_else(|err| err.into_inner())
            .insert(domain.to_ascii_lowercase(), key);
        Ok(())
    }

    pub fn clear_challenge(&self, domain: &str) {
        self.challenges
            .write()
            .unwrap_or_else(|err| err.into_inner())
            .remove(&domain.to_ascii_lowercase());
    }
}

/// The self-signed certificate a CA expects for a TLS-ALPN-01 challenge.
fn validation_cert(domain: &str, digest: &[u8]) -> Result<Arc<SignedKey>> {
    let internal = |err: rcgen::Error| {
        AppError::Internal(format!(
            "failed to build the ACME validation certificate: {err}"
        ))
    };
    let mut params = CertificateParams::new(vec![domain.to_string()]).map_err(internal)?;
    params
        .custom_extensions
        .push(CustomExtension::new_acme_identifier(digest));
    let key_pair = KeyPair::generate().map_err(internal)?;
    let cert = params.self_signed(&key_pair).map_err(internal)?;
    let key = PrivateKeyDer::try_from(key_pair.serialize_der())
        .map_err(|err| AppError::Internal(format!("failed to encode the validation key: {err}")))?;
    // not from_der: it rejects the critical acmeIdentifier extension
    let signing_key = crypto_provider()
        .key_provider
        .load_private_key(key)
        .map_err(|err| AppError::Internal(format!("failed to load the validation key: {err}")))?;
    Ok(Arc::new(SignedKey::new(
        vec![cert.der().clone()],
        signing_key,
    )))
}

impl ResolvesServerCert for CertResolver {
    fn resolve(&self, client_hello: ClientHello<'_>) -> Option<Arc<SignedKey>> {
        let validating = client_hello
            .alpn()
            .is_some_and(|mut names| names.any(|name| name == ACME_ALPN));
        if validating
            && let Some(name) = client_hello.server_name()
            && let Some(key) = self
                .challenges
                .read()
                .unwrap_or_else(|err| err.into_inner())
                .get(&name.to_ascii_lowercase())
        {
            return Some(key.clone());
        }
        Some(
            self.current
                .read()
                .unwrap_or_else(|err| err.into_inner())
                .clone(),
        )
    }
}

pub fn load_server_config(
    cert_path: impl AsRef<Path>,
    key_path: impl AsRef<Path>,
) -> Result<(ServerConfig, Arc<CertResolver>)> {
    let resolver = Arc::new(CertResolver {
        current: RwLock::new(CertResolver::load(cert_path.as_ref(), key_path.as_ref())?),
        challenges: RwLock::default(),
    });

    let mut config = ServerConfig::builder_with_provider(Arc::new(crypto_provider()))
        .with_safe_default_protocol_versions()
        .map_err(|err| AppError::Config(format!("failed to configure TLS versions: {err}")))?
        .with_no_client_auth()
        .with_cert_resolver(resolver.clone());
    config.alpn_protocols = vec![b"http/1.1".to_vec(), ACME_ALPN.to_vec()];
    // Browsers with AES hardware list AES-GCM first; our suite order decides.
    config.ignore_client_order = true;
    Ok((config, resolver))
}

pub fn generate_self_signed_cert(
    cert_path: impl AsRef<Path>,
    key_path: impl AsRef<Path>,
) -> Result<()> {
    let CertifiedKey { cert, signing_key } = generate_simple_self_signed([
        "localhost".to_string(),
        "127.0.0.1".to_string(),
        "::1".to_string(),
    ])
    .map_err(|err| AppError::Internal(format!("failed to generate TLS certificate: {err}")))?;

    write_file(cert_path.as_ref(), cert.pem().as_bytes(), 0o644)?;
    write_file(
        key_path.as_ref(),
        signing_key.serialize_pem().as_bytes(),
        0o600,
    )?;
    Ok(())
}

fn write_file(path: &Path, data: &[u8], mode: u32) -> Result<()> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    let mut file = OpenOptions::new()
        .create(true)
        .truncate(true)
        .write(true)
        .mode(mode)
        .open(path)?;
    use std::io::Write as _;
    file.write_all(data)?;
    file.sync_all()?;
    fs::set_permissions(path, fs::Permissions::from_mode(mode))?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use std::os::unix::fs::PermissionsExt;

    use super::*;

    #[test]
    fn generated_cert_can_be_loaded_for_rustls() {
        install_crypto_provider();
        let dir = tempfile::tempdir().unwrap();
        let cert = dir.path().join("server.crt");
        let key = dir.path().join("server.key");

        generate_self_signed_cert(&cert, &key).unwrap();
        let mode = fs::metadata(&key).unwrap().permissions().mode() & 0o777;

        assert_eq!(mode, 0o600);
        assert!(load_server_config(&cert, &key).is_ok());
    }

    #[tokio::test]
    async fn a_reloaded_certificate_serves_new_connections_only() {
        use tokio_rustls::{
            TlsConnector,
            rustls::{ClientConfig, RootCertStore, pki_types::ServerName},
        };

        install_crypto_provider();
        let dir = tempfile::tempdir().unwrap();
        let (cert, key) = (dir.path().join("a.crt"), dir.path().join("a.key"));
        let (cert2, key2) = (dir.path().join("b.crt"), dir.path().join("b.key"));
        generate_self_signed_cert(&cert, &key).unwrap();
        generate_self_signed_cert(&cert2, &key2).unwrap();
        let (config, resolver) = load_server_config(&cert, &key).unwrap();
        let acceptor = TlsAcceptor::from(Arc::new(config));

        let tcp = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = tcp.local_addr().unwrap();
        tokio::spawn(async move {
            loop {
                let (stream, _) = tcp.accept().await.unwrap();
                let acceptor = acceptor.clone();
                tokio::spawn(async move {
                    let _ = acceptor.accept(stream).await;
                });
            }
        });

        let served = |trusted: std::path::PathBuf| async move {
            let mut roots = RootCertStore::empty();
            for der in CertificateDer::pem_file_iter(&trusted).unwrap() {
                roots.add(der.unwrap()).unwrap();
            }
            let client = ClientConfig::builder()
                .with_root_certificates(roots)
                .with_no_client_auth();
            let stream = TcpStream::connect(addr).await.unwrap();
            TlsConnector::from(Arc::new(client))
                .connect(ServerName::try_from("localhost").unwrap(), stream)
                .await
                .is_ok()
        };

        assert!(served(cert.clone()).await);
        assert!(!served(cert2.clone()).await);

        resolver.reload(&cert2, &key2).unwrap();
        assert!(served(cert2.clone()).await);
        assert!(!served(cert.clone()).await);

        // A bad file leaves the working certificate in place.
        fs::write(&cert, "garbage").unwrap();
        assert!(resolver.reload(&cert, &key).is_err());
        assert!(resolver.reload(&cert2, &key).is_err(), "mismatched key");
        assert!(served(cert2).await);
    }

    #[tokio::test]
    async fn a_pending_challenge_is_answered_only_to_the_acme_alpn() {
        use tokio_rustls::{
            TlsConnector,
            rustls::{
                ClientConfig,
                client::danger::{HandshakeSignatureValid, ServerCertVerified, ServerCertVerifier},
                pki_types::{ServerName, UnixTime},
            },
        };

        #[derive(Debug)]
        struct AcceptAny;
        impl ServerCertVerifier for AcceptAny {
            fn verify_server_cert(
                &self,
                _: &CertificateDer<'_>,
                _: &[CertificateDer<'_>],
                _: &ServerName<'_>,
                _: &[u8],
                _: UnixTime,
            ) -> std::result::Result<ServerCertVerified, tokio_rustls::rustls::Error> {
                Ok(ServerCertVerified::assertion())
            }
            fn verify_tls12_signature(
                &self,
                _: &[u8],
                _: &CertificateDer<'_>,
                _: &tokio_rustls::rustls::DigitallySignedStruct,
            ) -> std::result::Result<HandshakeSignatureValid, tokio_rustls::rustls::Error>
            {
                Ok(HandshakeSignatureValid::assertion())
            }
            fn verify_tls13_signature(
                &self,
                _: &[u8],
                _: &CertificateDer<'_>,
                _: &tokio_rustls::rustls::DigitallySignedStruct,
            ) -> std::result::Result<HandshakeSignatureValid, tokio_rustls::rustls::Error>
            {
                Ok(HandshakeSignatureValid::assertion())
            }
            fn supported_verify_schemes(&self) -> Vec<tokio_rustls::rustls::SignatureScheme> {
                crypto_provider()
                    .signature_verification_algorithms
                    .supported_schemes()
            }
        }

        install_crypto_provider();
        let dir = tempfile::tempdir().unwrap();
        let (cert, key) = (dir.path().join("a.crt"), dir.path().join("a.key"));
        generate_self_signed_cert(&cert, &key).unwrap();
        let (config, resolver) = load_server_config(&cert, &key).unwrap();
        let tcp = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = tcp.local_addr().unwrap();
        let mut listener = TlsListener::new(tcp, config).unwrap();
        resolver
            .set_challenge("kvm.example.org", &[7u8; 32])
            .unwrap();

        // The leaf certificate and negotiated protocol a client sees.
        let handshake = |alpn: &'static [u8], name: &'static str| async move {
            let mut client = ClientConfig::builder()
                .dangerous()
                .with_custom_certificate_verifier(Arc::new(AcceptAny))
                .with_no_client_auth();
            client.alpn_protocols = vec![alpn.to_vec()];
            let stream = TcpStream::connect(addr).await.unwrap();
            let tls = TlsConnector::from(Arc::new(client))
                .connect(ServerName::try_from(name).unwrap(), stream)
                .await
                .unwrap();
            let conn = tls.get_ref().1;
            (
                conn.peer_certificates().unwrap()[0].as_ref().to_vec(),
                conn.alpn_protocol().map(<[u8]>::to_vec),
            )
        };
        let has_acme_extension = |der: &[u8]| {
            // id-pe-acmeIdentifier, 1.3.6.1.5.5.7.1.31, as DER content bytes.
            der.windows(8)
                .any(|w| w == [0x2b, 0x06, 0x01, 0x05, 0x05, 0x07, 0x01, 0x1f])
        };

        let (leaf, alpn) = handshake(ACME_ALPN, "kvm.example.org").await;
        assert!(has_acme_extension(&leaf));
        assert_eq!(alpn.as_deref(), Some(ACME_ALPN));

        // Other names and other protocols get the real certificate.
        let (leaf, _) = handshake(ACME_ALPN, "other.example.org").await;
        assert!(!has_acme_extension(&leaf));
        let (leaf, alpn) = handshake(b"http/1.1", "kvm.example.org").await;
        assert!(!has_acme_extension(&leaf));
        assert_eq!(alpn.as_deref(), Some(&b"http/1.1"[..]));

        // Validation connections never reach the HTTP layer; the HTTP one does.
        let accepted = time::timeout(Duration::from_secs(5), listener.accept())
            .await
            .unwrap();
        assert_eq!(
            accepted.0.get_ref().1.alpn_protocol(),
            Some(&b"http/1.1"[..])
        );

        resolver.clear_challenge("kvm.example.org");
        let (leaf, _) = handshake(ACME_ALPN, "kvm.example.org").await;
        assert!(!has_acme_extension(&leaf));
    }

    async fn negotiated_suite(client_suites: &[CipherSuite]) -> CipherSuite {
        use tokio_rustls::{
            TlsConnector,
            rustls::{ClientConfig, RootCertStore, pki_types::ServerName},
        };

        let dir = tempfile::tempdir().unwrap();
        let cert = dir.path().join("server.crt");
        let key = dir.path().join("server.key");
        generate_self_signed_cert(&cert, &key).unwrap();
        let acceptor = TlsAcceptor::from(Arc::new(load_server_config(&cert, &key).unwrap().0));

        let mut roots = RootCertStore::empty();
        for der in CertificateDer::pem_file_iter(&cert).unwrap() {
            roots.add(der.unwrap()).unwrap();
        }
        // The client lists its suites in the given order, AES first by default.
        let mut provider = ring::default_provider();
        provider
            .cipher_suites
            .retain(|suite| client_suites.contains(&suite.suite()));
        provider
            .cipher_suites
            .sort_by_key(|suite| client_suites.iter().position(|s| *s == suite.suite()));
        let client = ClientConfig::builder_with_provider(Arc::new(provider))
            .with_safe_default_protocol_versions()
            .unwrap()
            .with_root_certificates(roots)
            .with_no_client_auth();

        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let server = tokio::spawn(async move {
            let (stream, _) = listener.accept().await.unwrap();
            acceptor.accept(stream).await.unwrap();
        });
        let stream = tokio::net::TcpStream::connect(addr).await.unwrap();
        let tls = TlsConnector::from(Arc::new(client))
            .connect(ServerName::try_from("localhost").unwrap(), stream)
            .await
            .unwrap();
        server.await.unwrap();
        tls.get_ref().1.negotiated_cipher_suite().unwrap().suite()
    }

    #[tokio::test]
    async fn server_prefers_chacha20_over_a_clients_aes_preference() {
        let suite = negotiated_suite(&[
            CipherSuite::TLS13_AES_128_GCM_SHA256,
            CipherSuite::TLS13_AES_256_GCM_SHA384,
            CipherSuite::TLS13_CHACHA20_POLY1305_SHA256,
        ])
        .await;
        assert_eq!(suite, CipherSuite::TLS13_CHACHA20_POLY1305_SHA256);
    }

    #[tokio::test]
    async fn a_client_without_chacha20_still_gets_aes_gcm() {
        let suite = negotiated_suite(&[CipherSuite::TLS13_AES_128_GCM_SHA256]).await;
        assert_eq!(suite, CipherSuite::TLS13_AES_128_GCM_SHA256);
    }

    #[tokio::test]
    async fn a_silent_client_does_not_hold_up_other_handshakes() {
        use tokio_rustls::{
            TlsConnector,
            rustls::{ClientConfig, RootCertStore, pki_types::ServerName},
        };

        install_crypto_provider();
        let dir = tempfile::tempdir().unwrap();
        let cert = dir.path().join("server.crt");
        let key = dir.path().join("server.key");
        generate_self_signed_cert(&cert, &key).unwrap();
        let tcp = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = tcp.local_addr().unwrap();
        let mut listener =
            TlsListener::new(tcp, load_server_config(&cert, &key).unwrap().0).unwrap();

        let mut roots = RootCertStore::empty();
        for der in CertificateDer::pem_file_iter(&cert).unwrap() {
            roots.add(der.unwrap()).unwrap();
        }
        let client = ClientConfig::builder()
            .with_root_certificates(roots)
            .with_no_client_auth();

        // Connects first and never sends a ClientHello.
        let _silent = TcpStream::connect(addr).await.unwrap();
        let handshake = tokio::spawn(async move {
            let stream = TcpStream::connect(addr).await.unwrap();
            TlsConnector::from(Arc::new(client))
                .connect(ServerName::try_from("localhost").unwrap(), stream)
                .await
                .unwrap()
        });

        let accepted = time::timeout(Duration::from_secs(5), listener.accept()).await;
        assert!(accepted.is_ok(), "the silent client blocked the handshake");
        handshake.await.unwrap();
    }
}
