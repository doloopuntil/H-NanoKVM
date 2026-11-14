//! Serves HTTP/1.1 connections with a deadline for request headers.
//! axum 0.8's `serve` sets no hyper timer; 0.9 does (tokio-rs/axum#3478): switch back then.

use std::{net::SocketAddr, time::Duration};

use axum::{Router, extract::connect_info::ConnectInfo, serve::Listener};
use hyper::{body::Incoming, server::conn::http1, service::service_fn};
use hyper_util::rt::{TokioIo, TokioTimer};
use tower::ServiceExt;
use tracing::debug;

use super::tls::ClientAddr;

/// A client gets this long to send request headers, on a new connection and between requests.
const HEADER_TIMEOUT: Duration = Duration::from_secs(30);

/// Serves `router` on `listener` until the process ends.
pub async fn serve<L>(listener: L, router: Router)
where
    L: Listener<Addr = SocketAddr>,
{
    serve_with_timeout(listener, router, HEADER_TIMEOUT).await;
}

async fn serve_with_timeout<L>(mut listener: L, router: Router, header_timeout: Duration)
where
    L: Listener<Addr = SocketAddr>,
{
    loop {
        let (io, addr) = listener.accept().await;
        let router = router.clone();
        tokio::spawn(async move {
            let service = service_fn(move |mut req: hyper::Request<Incoming>| {
                req.extensions_mut().insert(ConnectInfo(ClientAddr(addr)));
                router.clone().oneshot(req)
            });
            let served = http1::Builder::new()
                .timer(TokioTimer::new())
                .header_read_timeout(header_timeout)
                .serve_connection(TokioIo::new(io), service)
                .with_upgrades()
                .await;
            if let Err(err) = served {
                debug!(%addr, error = %err, "connection ended");
            }
        });
    }
}

#[cfg(test)]
mod tests {
    use axum::routing::get;
    use tokio::{
        io::{AsyncReadExt, AsyncWriteExt},
        net::{TcpListener, TcpStream},
        time,
    };

    use super::*;
    use crate::http::limits::{ConnLimiter, LimitedListener};

    async fn peer(ConnectInfo(ClientAddr(peer)): ConnectInfo<ClientAddr>) -> String {
        peer.to_string()
    }

    async fn start(header_timeout: Duration) -> SocketAddr {
        let router = Router::new().route("/", get(peer));
        let tcp = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = tcp.local_addr().unwrap();
        let listener = LimitedListener::new(tcp, ConnLimiter::new());
        tokio::spawn(serve_with_timeout(listener, router, header_timeout));
        addr
    }

    /// Reads until the server closes the connection, failing if that takes too long.
    async fn read_until_closed(stream: &mut TcpStream) -> String {
        let mut out = Vec::new();
        time::timeout(Duration::from_secs(5), stream.read_to_end(&mut out))
            .await
            .expect("the server kept the connection open")
            .unwrap();
        String::from_utf8_lossy(&out).into_owned()
    }

    #[tokio::test]
    async fn requests_see_the_client_address_and_idle_connections_close() {
        let addr = start(Duration::from_millis(200)).await;
        let mut stream = TcpStream::connect(addr).await.unwrap();
        let local = stream.local_addr().unwrap();
        stream
            .write_all(b"GET / HTTP/1.1\r\nHost: kvm\r\n\r\n")
            .await
            .unwrap();
        // The response arrives, then the keep-alive connection is closed once idle.
        let response = read_until_closed(&mut stream).await;
        assert!(response.starts_with("HTTP/1.1 200"), "{response}");
        assert!(response.ends_with(&local.to_string()), "{response}");
    }

    #[tokio::test]
    async fn a_client_that_never_finishes_its_headers_is_dropped() {
        let addr = start(Duration::from_millis(200)).await;
        let mut stream = TcpStream::connect(addr).await.unwrap();
        stream.write_all(b"GET / HTTP/1.1\r\nHost:").await.unwrap();
        let response = read_until_closed(&mut stream).await;
        assert!(!response.contains("200"), "{response}");
    }

    #[tokio::test]
    async fn a_silent_client_is_dropped() {
        let addr = start(Duration::from_millis(200)).await;
        let mut stream = TcpStream::connect(addr).await.unwrap();
        read_until_closed(&mut stream).await;
    }
}
