//! Keyboard and mouse input on a thread of its own.
//!
//! The one Tokio worker also sends the video and receives uploads, and under that load it can
//! take 100 ms to come back to a socket. A mostly idle thread gets the CPU within a few
//! milliseconds, so the input WebSocket is moved to a small runtime on its own thread once it
//! is upgraded. The handshake, TLS and the session check stay on the main worker.

use std::{
    future::Future,
    io,
    os::fd::AsFd,
    sync::{OnceLock, mpsc},
    thread,
};

use axum::{
    body::Body,
    http::{HeaderMap, HeaderValue, Response, StatusCode, header},
};
use bytes::Bytes;
use hyper::upgrade::{OnUpgrade, Upgraded};
use hyper_util::rt::TokioIo;
use tokio::{
    io::{AsyncRead, AsyncWrite},
    net::TcpStream,
    runtime::Handle,
};
use tokio_rustls::server::TlsStream;
use tokio_tungstenite::{
    WebSocketStream,
    tungstenite::{
        handshake::derive_accept_key,
        protocol::{Role, WebSocketConfig},
    },
};
use tracing::warn;

use crate::http::{limits::Guarded, tls::TlsIo};

/// The input runtime, started on first use; `None` if its thread could not start.
fn input_runtime() -> Option<&'static Handle> {
    static HANDLE: OnceLock<Option<Handle>> = OnceLock::new();
    HANDLE
        .get_or_init(|| {
            let (tx, rx) = mpsc::channel();
            let started = thread::Builder::new()
                .name("hid-input".to_string())
                .spawn(move || {
                    let runtime = match tokio::runtime::Builder::new_current_thread()
                        .enable_all()
                        .build()
                    {
                        Ok(runtime) => runtime,
                        Err(err) => {
                            warn!(error = %err, "failed to build the input runtime");
                            return;
                        }
                    };
                    let _ = tx.send(runtime.handle().clone());
                    runtime.block_on(std::future::pending::<()>());
                });
            if let Err(err) = started {
                warn!(error = %err, "failed to start the input thread");
                return None;
            }
            rx.recv().ok()
        })
        .as_ref()
}

/// A socket that can move to the runtime of the calling task.
pub trait Rehome {
    /// Registers the socket with the current runtime; call it from a task on that runtime.
    fn rehome(&mut self) -> io::Result<()>;
}

impl Rehome for TcpStream {
    fn rehome(&mut self) -> io::Result<()> {
        // A duplicate descriptor of the same socket, registered here; the old one is
        // deregistered from its runtime and closed when it drops.
        let socket = std::net::TcpStream::from(self.as_fd().try_clone_to_owned()?);
        let moved = TcpStream::from_std(socket)?;
        drop(std::mem::replace(self, moved));
        Ok(())
    }
}

impl<S: Rehome> Rehome for TlsStream<S> {
    fn rehome(&mut self) -> io::Result<()> {
        self.get_mut().0.rehome()
    }
}

impl<S: Rehome> Rehome for Guarded<S> {
    fn rehome(&mut self) -> io::Result<()> {
        self.get_mut().rehome()
    }
}

/// The 101 response for a valid WebSocket upgrade request, or `None`.
pub fn accept_upgrade(headers: &HeaderMap) -> Option<Response<Body>> {
    let has_token = |name: header::HeaderName, token: &str| {
        headers.get_all(name).iter().any(|value| {
            value.to_str().is_ok_and(|value| {
                value
                    .split(',')
                    .any(|part| part.trim().eq_ignore_ascii_case(token))
            })
        })
    };
    if !has_token(header::CONNECTION, "upgrade") || !has_token(header::UPGRADE, "websocket") {
        return None;
    }
    if headers.get(header::SEC_WEBSOCKET_VERSION)? != "13" {
        return None;
    }
    let key = headers.get(header::SEC_WEBSOCKET_KEY)?;
    let accept = HeaderValue::from_str(&derive_accept_key(key.as_bytes())).ok()?;
    Response::builder()
        .status(StatusCode::SWITCHING_PROTOCOLS)
        .header(header::CONNECTION, "upgrade")
        .header(header::UPGRADE, "websocket")
        .header(header::SEC_WEBSOCKET_ACCEPT, accept)
        .body(Body::empty())
        .ok()
}

/// Waits for the upgrade, then runs `handle` on the input thread, or here if the connection
/// type is unknown or the thread is missing.
pub fn on_upgrade<F, Fut>(upgrade: OnUpgrade, config: WebSocketConfig, handle: F)
where
    F: FnOnce(WebSocketStream<Box<dyn Socket>>) -> Fut + Send + 'static,
    Fut: Future<Output = ()> + Send + 'static,
{
    tokio::spawn(async move {
        let Ok(upgraded) = upgrade.await else {
            return;
        };
        let (socket, read_buf) = take_socket(upgraded);
        let run = async move {
            let socket = match socket {
                Taken::Movable(mut socket) => {
                    if let Err(err) = socket.rehome() {
                        warn!(error = %err, "failed to move the input socket");
                        return;
                    }
                    socket as Box<dyn Socket>
                }
                Taken::Fixed(socket) => socket,
            };
            let stream = WebSocketStream::from_partially_read(
                socket,
                read_buf.to_vec(),
                Role::Server,
                Some(config),
            )
            .await;
            handle(stream).await;
        };
        match input_runtime() {
            Some(runtime) => {
                runtime.spawn(run);
            }
            None => {
                tokio::spawn(run);
            }
        }
    });
}

/// What the input WebSocket runs over.
pub trait Socket: AsyncRead + AsyncWrite + Unpin + Send + 'static {}
impl<S: AsyncRead + AsyncWrite + Unpin + Send + 'static> Socket for S {}

trait MovableSocket: Socket + Rehome {}
impl<S: Socket + Rehome> MovableSocket for S {}

enum Taken {
    Movable(Box<dyn MovableSocket>),
    Fixed(Box<dyn Socket>),
}

impl Rehome for Box<dyn MovableSocket> {
    fn rehome(&mut self) -> io::Result<()> {
        (**self).rehome()
    }
}

/// The connection under the upgrade: HTTPS or plain HTTP from our listeners can move.
fn take_socket(upgraded: Upgraded) -> (Taken, Bytes) {
    let upgraded = match upgraded.downcast::<TokioIo<TlsIo>>() {
        Ok(parts) => {
            return (
                Taken::Movable(Box::new(parts.io.into_inner())),
                parts.read_buf,
            );
        }
        Err(upgraded) => upgraded,
    };
    match upgraded.downcast::<TokioIo<Guarded<TcpStream>>>() {
        Ok(parts) => (
            Taken::Movable(Box::new(parts.io.into_inner())),
            parts.read_buf,
        ),
        Err(upgraded) => (Taken::Fixed(Box::new(TokioIo::new(upgraded))), Bytes::new()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn upgrade_headers() -> HeaderMap {
        let mut headers = HeaderMap::new();
        headers.insert(
            header::CONNECTION,
            HeaderValue::from_static("keep-alive, Upgrade"),
        );
        headers.insert(header::UPGRADE, HeaderValue::from_static("websocket"));
        headers.insert(
            header::SEC_WEBSOCKET_VERSION,
            HeaderValue::from_static("13"),
        );
        headers.insert(
            header::SEC_WEBSOCKET_KEY,
            HeaderValue::from_static("dGhlIHNhbXBsZSBub25jZQ=="),
        );
        headers
    }

    #[test]
    fn a_valid_upgrade_gets_the_rfc_accept_key() {
        let response = accept_upgrade(&upgrade_headers()).unwrap();
        assert_eq!(response.status(), StatusCode::SWITCHING_PROTOCOLS);
        // RFC 6455, section 1.3
        assert_eq!(
            response.headers()[header::SEC_WEBSOCKET_ACCEPT],
            "s3pPLMBiTxaQ9kYGzzhZRbK+xOo="
        );
    }

    #[test]
    fn an_incomplete_upgrade_is_refused() {
        for missing in [
            header::CONNECTION,
            header::UPGRADE,
            header::SEC_WEBSOCKET_VERSION,
            header::SEC_WEBSOCKET_KEY,
        ] {
            let mut headers = upgrade_headers();
            headers.remove(&missing);
            assert!(accept_upgrade(&headers).is_none(), "{missing}");
        }
        let mut headers = upgrade_headers();
        headers.insert(header::SEC_WEBSOCKET_VERSION, HeaderValue::from_static("8"));
        assert!(accept_upgrade(&headers).is_none());
    }

    /// Answers each message with the name of the thread the socket runs on.
    async fn thread_echo(mut request: axum::extract::Request) -> Response<Body> {
        use futures_util::{SinkExt, StreamExt};
        use tokio_tungstenite::tungstenite::Message;
        let response = accept_upgrade(request.headers()).unwrap();
        let upgrade = request.extensions_mut().remove::<OnUpgrade>().unwrap();
        on_upgrade(upgrade, WebSocketConfig::default(), |mut ws| async move {
            while let Some(Ok(message)) = ws.next().await {
                if message.is_text() {
                    let name = thread::current().name().unwrap_or_default().to_string();
                    let _ = ws.send(Message::text(name)).await;
                }
            }
        });
        response
    }

    async fn thread_of_socket<S>(stream: S) -> String
    where
        S: AsyncRead + AsyncWrite + Unpin,
    {
        use futures_util::{SinkExt, StreamExt};
        use tokio_tungstenite::tungstenite::Message;
        let (mut ws, _) = tokio_tungstenite::client_async("ws://localhost/ws", stream)
            .await
            .unwrap();
        ws.send(Message::text("which thread")).await.unwrap();
        ws.next()
            .await
            .unwrap()
            .unwrap()
            .into_text()
            .unwrap()
            .to_string()
    }

    fn router() -> axum::Router {
        axum::Router::new().route("/ws", axum::routing::get(thread_echo))
    }

    #[tokio::test]
    async fn a_plain_http_websocket_runs_on_the_input_thread() {
        use crate::http::limits::{ConnLimiter, LimitedListener};
        let tcp = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = tcp.local_addr().unwrap();
        let listener = LimitedListener::new(tcp, ConnLimiter::new());
        tokio::spawn(crate::http::serve::serve(listener, router()));

        let stream = TcpStream::connect(addr).await.unwrap();
        assert_eq!(thread_of_socket(stream).await, "hid-input");
    }

    #[tokio::test]
    async fn an_https_websocket_runs_on_the_input_thread() {
        use std::sync::Arc;
        use tokio_rustls::{
            TlsConnector,
            rustls::{
                ClientConfig, RootCertStore,
                pki_types::{CertificateDer, ServerName, pem::PemObject},
            },
        };

        use crate::http::{limits::ConnLimiter, tls};
        tls::install_crypto_provider();
        let dir = tempfile::tempdir().unwrap();
        let (cert, key) = (dir.path().join("a.crt"), dir.path().join("a.key"));
        tls::generate_self_signed_cert(&cert, &key).unwrap();
        let (config, _) = tls::load_server_config(&cert, &key).unwrap();
        let tcp = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = tcp.local_addr().unwrap();
        let listener = tls::TlsListener::new(tcp, config, ConnLimiter::new()).unwrap();
        tokio::spawn(crate::http::serve::serve(listener, router()));

        let mut roots = RootCertStore::empty();
        for der in CertificateDer::pem_file_iter(&cert).unwrap() {
            roots.add(der.unwrap()).unwrap();
        }
        let client = ClientConfig::builder()
            .with_root_certificates(roots)
            .with_no_client_auth();
        let stream = TlsConnector::from(Arc::new(client))
            .connect(
                ServerName::try_from("localhost").unwrap(),
                TcpStream::connect(addr).await.unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(thread_of_socket(stream).await, "hid-input");
    }

    #[tokio::test]
    async fn a_rehomed_socket_keeps_its_connection() {
        use tokio::io::{AsyncReadExt, AsyncWriteExt};
        let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let client = tokio::spawn(async move {
            let mut client = TcpStream::connect(addr).await.unwrap();
            client.write_all(b"ping").await.unwrap();
            let mut reply = [0; 4];
            client.read_exact(&mut reply).await.unwrap();
            reply
        });
        let (server, _) = listener.accept().await.unwrap();
        let moved = input_runtime()
            .unwrap()
            .spawn(async move {
                let mut server = server;
                server.rehome().unwrap();
                let mut buf = [0; 4];
                server.read_exact(&mut buf).await.unwrap();
                server.write_all(b"pong").await.unwrap();
                buf
            })
            .await
            .unwrap();
        assert_eq!(&moved, b"ping");
        assert_eq!(&client.await.unwrap(), b"pong");
    }
}
