//! Caps on open connections, in total and per source, for every listener.

use std::{
    collections::HashMap,
    io::{self, IoSlice},
    net::{IpAddr, Ipv6Addr, SocketAddr},
    pin::Pin,
    sync::{Arc, Mutex},
    task::{Context, Poll},
    time::{Duration, Instant},
};

use axum::{
    extract::connect_info::Connected,
    serve::{IncomingStream, Listener},
};
use tokio::{
    io::{AsyncRead, AsyncWrite, ReadBuf},
    net::{TcpListener, TcpStream},
};
use tracing::warn;

use super::tls::ClientAddr;
use crate::api::stream::LogThrottle;

/// Open connections on all listeners together. Each costs a task and its buffers.
const MAX_CONNECTIONS: usize = 256;
/// Open connections from one source: a browser with several tabs stays far below it.
const MAX_CONNECTIONS_PER_SOURCE: usize = 64;
const REFUSAL_LOG_INTERVAL: Duration = Duration::from_secs(10);

#[derive(Debug)]
pub struct ConnLimiter {
    max_total: usize,
    max_per_source: usize,
    open: Mutex<Open>,
    refusals: Mutex<LogThrottle>,
}

#[derive(Debug, Default)]
struct Open {
    total: usize,
    per_source: HashMap<IpAddr, usize>,
}

/// One admitted connection; dropping it frees the place.
#[derive(Debug)]
pub struct ConnGuard {
    limiter: Arc<ConnLimiter>,
    source: Option<IpAddr>,
}

impl ConnLimiter {
    pub fn new() -> Arc<Self> {
        Self::with_limits(MAX_CONNECTIONS, MAX_CONNECTIONS_PER_SOURCE)
    }

    fn with_limits(max_total: usize, max_per_source: usize) -> Arc<Self> {
        Arc::new(Self {
            max_total,
            max_per_source,
            open: Mutex::default(),
            refusals: Mutex::new(LogThrottle::new()),
        })
    }

    /// A place for a connection from `addr`, or `None` when a cap is reached.
    pub fn admit(self: &Arc<Self>, addr: SocketAddr) -> Option<ConnGuard> {
        // Loopback (the watchdog, PicoClaw) counts toward the total only.
        let source = Some(source_of(addr.ip())).filter(|ip| !ip.is_loopback());
        let mut open = self.open.lock().unwrap_or_else(|err| err.into_inner());
        let from_source = source.map_or(0, |ip| open.per_source.get(&ip).copied().unwrap_or(0));
        if open.total >= self.max_total || from_source >= self.max_per_source {
            drop(open);
            self.log_refusal(addr);
            return None;
        }
        open.total += 1;
        if let Some(ip) = source {
            *open.per_source.entry(ip).or_insert(0) += 1;
        }
        Some(ConnGuard {
            limiter: self.clone(),
            source,
        })
    }

    fn log_refusal(&self, addr: SocketAddr) {
        let due = self
            .refusals
            .lock()
            .unwrap_or_else(|err| err.into_inner())
            .due(Instant::now(), REFUSAL_LOG_INTERVAL);
        if let Some(suppressed) = due {
            warn!(%addr, suppressed, "connection refused: too many open connections");
        }
    }
}

impl Drop for ConnGuard {
    fn drop(&mut self) {
        let mut open = self
            .limiter
            .open
            .lock()
            .unwrap_or_else(|err| err.into_inner());
        open.total = open.total.saturating_sub(1);
        if let Some(ip) = self.source
            && let Some(count) = open.per_source.get_mut(&ip)
        {
            *count -= 1;
            if *count == 0 {
                open.per_source.remove(&ip);
            }
        }
    }
}

/// What a cap applies to: an IPv4 address, or the /64 of an IPv6 address.
fn source_of(ip: IpAddr) -> IpAddr {
    match ip {
        IpAddr::V4(_) => ip,
        IpAddr::V6(v6) => match v6.to_ipv4_mapped() {
            Some(v4) => IpAddr::V4(v4),
            None => {
                let s = v6.segments();
                IpAddr::V6(Ipv6Addr::new(s[0], s[1], s[2], s[3], 0, 0, 0, 0))
            }
        },
    }
}

/// A connection that holds its place until it is dropped.
pub struct Guarded<S> {
    io: S,
    _guard: ConnGuard,
}

impl<S> Guarded<S> {
    pub fn new(io: S, guard: ConnGuard) -> Self {
        Self { io, _guard: guard }
    }

    pub fn get_ref(&self) -> &S {
        &self.io
    }
}

impl<S: AsyncRead + Unpin> AsyncRead for Guarded<S> {
    fn poll_read(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &mut ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        Pin::new(&mut self.io).poll_read(cx, buf)
    }
}

impl<S: AsyncWrite + Unpin> AsyncWrite for Guarded<S> {
    fn poll_write(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &[u8],
    ) -> Poll<io::Result<usize>> {
        Pin::new(&mut self.io).poll_write(cx, buf)
    }

    fn poll_write_vectored(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        bufs: &[IoSlice<'_>],
    ) -> Poll<io::Result<usize>> {
        Pin::new(&mut self.io).poll_write_vectored(cx, bufs)
    }

    fn is_write_vectored(&self) -> bool {
        self.io.is_write_vectored()
    }

    fn poll_flush(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        Pin::new(&mut self.io).poll_flush(cx)
    }

    fn poll_shutdown(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        Pin::new(&mut self.io).poll_shutdown(cx)
    }
}

/// A plain TCP listener that closes connections over the caps as it accepts them.
pub struct LimitedListener {
    inner: TcpListener,
    limiter: Arc<ConnLimiter>,
}

impl LimitedListener {
    pub fn new(inner: TcpListener, limiter: Arc<ConnLimiter>) -> Self {
        Self { inner, limiter }
    }
}

impl Listener for LimitedListener {
    type Io = Guarded<TcpStream>;
    type Addr = SocketAddr;

    async fn accept(&mut self) -> (Self::Io, Self::Addr) {
        loop {
            let (stream, addr) = Listener::accept(&mut self.inner).await;
            if let Some(guard) = self.limiter.admit(addr) {
                return (Guarded::new(stream, guard), addr);
            }
        }
    }

    fn local_addr(&self) -> io::Result<Self::Addr> {
        self.inner.local_addr()
    }
}

impl Connected<IncomingStream<'_, LimitedListener>> for ClientAddr {
    fn connect_info(stream: IncomingStream<'_, LimitedListener>) -> Self {
        Self(*stream.remote_addr())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn addr(text: &str) -> SocketAddr {
        text.parse().unwrap()
    }

    #[test]
    fn a_source_is_capped_and_freed_places_come_back() {
        let limiter = ConnLimiter::with_limits(8, 2);
        let first = limiter.admit(addr("192.0.2.1:1000")).unwrap();
        let _second = limiter.admit(addr("192.0.2.1:1001")).unwrap();
        assert!(limiter.admit(addr("192.0.2.1:1002")).is_none());
        // another source is not affected
        let _other = limiter.admit(addr("192.0.2.2:1000")).unwrap();
        drop(first);
        assert!(limiter.admit(addr("192.0.2.1:1003")).is_some());
        assert!(limiter.open.lock().unwrap().per_source.len() <= 2);
    }

    #[test]
    fn the_total_is_capped_across_sources_and_loopback_only_by_it() {
        let limiter = ConnLimiter::with_limits(3, 1);
        let _a = limiter.admit(addr("127.0.0.1:1")).unwrap();
        let _b = limiter.admit(addr("127.0.0.1:2")).unwrap();
        let _c = limiter.admit(addr("192.0.2.1:1")).unwrap();
        assert!(limiter.admit(addr("192.0.2.2:1")).is_none());
        assert!(limiter.admit(addr("127.0.0.1:3")).is_none());
    }

    #[test]
    fn addresses_of_one_ipv6_network_share_a_cap() {
        let limiter = ConnLimiter::with_limits(8, 1);
        let _a = limiter.admit(addr("[2001:db8:1:2::1]:1")).unwrap();
        assert!(limiter.admit(addr("[2001:db8:1:2:ffff::9]:1")).is_none());
        assert!(limiter.admit(addr("[2001:db8:1:3::1]:1")).is_some());
        // an IPv4-mapped address is its IPv4 source
        let _v4 = limiter.admit(addr("192.0.2.7:1")).unwrap();
        assert!(limiter.admit(addr("[::ffff:192.0.2.7]:1")).is_none());
    }

    #[test]
    fn dropping_every_guard_empties_the_table() {
        let limiter = ConnLimiter::with_limits(8, 4);
        let guards: Vec<_> = (0..4)
            .map(|port| limiter.admit(addr(&format!("192.0.2.1:{port}"))).unwrap())
            .collect();
        drop(guards);
        let open = limiter.open.lock().unwrap();
        assert_eq!(open.total, 0);
        assert!(open.per_source.is_empty());
    }
}
