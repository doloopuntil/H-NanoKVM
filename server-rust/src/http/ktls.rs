//! Kernel TLS: rustls does the handshake, then the kernel encrypts and decrypts the socket.
//! Only ChaCha20-Poly1305 sessions move; others stay with rustls.

use std::{
    io::{self, IoSlice, IoSliceMut},
    net::Ipv4Addr,
    os::fd::{AsRawFd, RawFd},
    pin::Pin,
    sync::OnceLock,
    task::{Context, Poll, ready},
};

use nix::{
    libc,
    sys::socket::{ControlMessageOwned, MsgFlags, TlsGetRecordType, recvmsg},
};
use tokio::{
    io::{AsyncRead, AsyncReadExt, AsyncWrite, Interest, ReadBuf},
    net::TcpStream,
};
use tokio_rustls::{
    rustls::{ConnectionTrafficSecrets, ProtocolVersion},
    server::TlsStream,
};

const RECORD_HEADER: usize = 5;
const CONTENT_ALERT: u8 = 21;
const ALERT_WARNING: u8 = 1;
const ALERT_CLOSE_NOTIFY: u8 = 0;
/// Plaintext rustls may already hold when the kernel takes over (the first request).
const MAX_DRAINED: usize = 64 * 1024;

type Crypto = libc::tls12_crypto_info_chacha20_poly1305;

/// Whether the kernel takes ChaCha20-Poly1305 sessions; probed once on a loopback socket.
pub fn available() -> bool {
    static AVAILABLE: OnceLock<bool> = OnceLock::new();
    *AVAILABLE.get_or_init(|| probe().is_ok())
}

fn probe() -> io::Result<()> {
    let listener = std::net::TcpListener::bind((Ipv4Addr::LOCALHOST, 0))?;
    let client = std::net::TcpStream::connect(listener.local_addr()?)?;
    let _server = listener.accept()?;
    set_ulp(client.as_raw_fd())?;
    set_crypto(
        client.as_raw_fd(),
        libc::TLS_TX,
        &mut crypto(libc::TLS_1_3_VERSION, 0, &[0; 32], &[0; 12])?,
    )
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum Mode {
    /// At most one TLS record per read, so no record is split between rustls and the kernel.
    Records,
    /// Like `Records`, but end of stream at the next record boundary.
    Corked,
    Passthrough,
}

/// The TCP stream under rustls.
pub struct RecordReader {
    tcp: TcpStream,
    mode: Mode,
    header: [u8; RECORD_HEADER],
    header_len: usize,
    body_left: usize,
}

impl RecordReader {
    pub fn new(tcp: TcpStream) -> Self {
        Self {
            tcp,
            mode: Mode::Records,
            header: [0; RECORD_HEADER],
            header_len: 0,
            body_left: 0,
        }
    }
}

impl AsyncRead for RecordReader {
    fn poll_read(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &mut ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        let this = &mut *self;
        if this.mode == Mode::Passthrough {
            return Pin::new(&mut this.tcp).poll_read(cx, buf);
        }
        let at_boundary = this.header_len == 0 && this.body_left == 0;
        if buf.remaining() == 0 || (this.mode == Mode::Corked && at_boundary) {
            return Poll::Ready(Ok(()));
        }
        let want = if this.body_left > 0 {
            this.body_left
        } else {
            RECORD_HEADER - this.header_len
        };
        let got = {
            let mut part = ReadBuf::new(buf.initialize_unfilled_to(want.min(buf.remaining())));
            ready!(Pin::new(&mut this.tcp).poll_read(cx, &mut part))?;
            let got = part.filled().len();
            if this.body_left > 0 {
                this.body_left -= got;
            } else {
                this.header[this.header_len..this.header_len + got].copy_from_slice(part.filled());
                this.header_len += got;
                if this.header_len == RECORD_HEADER {
                    this.body_left = u16::from_be_bytes([this.header[3], this.header[4]]).into();
                    this.header_len = 0;
                }
            }
            got
        };
        buf.advance(got);
        Poll::Ready(Ok(()))
    }
}

impl AsyncWrite for RecordReader {
    fn poll_write(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &[u8],
    ) -> Poll<io::Result<usize>> {
        Pin::new(&mut self.tcp).poll_write(cx, buf)
    }

    fn poll_write_vectored(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        bufs: &[IoSlice<'_>],
    ) -> Poll<io::Result<usize>> {
        Pin::new(&mut self.tcp).poll_write_vectored(cx, bufs)
    }

    fn is_write_vectored(&self) -> bool {
        self.tcp.is_write_vectored()
    }

    fn poll_flush(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        Pin::new(&mut self.tcp).poll_flush(cx)
    }

    fn poll_shutdown(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        Pin::new(&mut self.tcp).poll_shutdown(cx)
    }
}

/// Moves a finished ChaCha20-Poly1305 handshake into the kernel; rustls keeps the rest.
pub async fn take_over(mut stream: TlsStream<RecordReader>) -> io::Result<TlsIo> {
    let conn = stream.get_ref().1;
    let version = match conn.protocol_version() {
        Some(ProtocolVersion::TLSv1_3) => Some(libc::TLS_1_3_VERSION),
        Some(ProtocolVersion::TLSv1_2) => Some(libc::TLS_1_2_VERSION),
        _ => None,
    };
    let chacha = conn
        .negotiated_cipher_suite()
        .is_some_and(|suite| super::tls::is_chacha20(suite.suite()));
    // The kernel takes only established sockets: a peer that already closed stays with rustls.
    // The bare ULP passes data through until keys are set.
    let fd = stream.get_ref().0.tcp.as_raw_fd();
    let Some(version) = version.filter(|_| chacha && available() && set_ulp(fd).is_ok()) else {
        stream.get_mut().0.mode = Mode::Passthrough;
        return Ok(TlsIo::Rustls(Box::new(stream)));
    };

    stream.get_mut().0.mode = Mode::Corked;
    let drained = drain(&mut stream).await?;
    let (io, conn) = stream.into_inner();
    // The buffered connection has no KernelConnection; a peer key update ends the connection.
    #[allow(deprecated)]
    let secrets = conn.dangerous_extract_secrets().map_err(io::Error::other)?;
    let (seq, tx) = &secrets.tx;
    set_crypto(fd, libc::TLS_TX, &mut traffic_crypto(version, *seq, tx)?)?;
    let (seq, rx) = &secrets.rx;
    set_crypto(fd, libc::TLS_RX, &mut traffic_crypto(version, *seq, rx)?)?;
    Ok(TlsIo::Kernel(KernelStream {
        tcp: io.tcp,
        drained,
        drained_at: 0,
        cmsg: nix::cmsg_space!(u8),
        read_closed: false,
        write_closed: false,
    }))
}

/// Plaintext rustls decrypted before the cork, up to the next record boundary.
async fn drain(stream: &mut TlsStream<RecordReader>) -> io::Result<Vec<u8>> {
    let mut drained = Vec::new();
    let mut chunk = [0; 4096];
    loop {
        match stream.read(&mut chunk).await {
            Ok(0) => return Ok(drained),
            Ok(n) if drained.len() + n <= MAX_DRAINED => drained.extend_from_slice(&chunk[..n]),
            Ok(_) => return Err(io::Error::other("too much data before kernel TLS")),
            // the cork looks like a missing close_notify to rustls
            Err(err) if err.kind() == io::ErrorKind::UnexpectedEof => return Ok(drained),
            Err(err) => return Err(err),
        }
    }
}

fn traffic_crypto(
    version: u16,
    seq: u64,
    secrets: &ConnectionTrafficSecrets,
) -> io::Result<Crypto> {
    match secrets {
        ConnectionTrafficSecrets::Chacha20Poly1305 { key, iv } => {
            crypto(version, seq, key.as_ref(), iv.as_ref())
        }
        _ => Err(io::Error::other("not a ChaCha20-Poly1305 session")),
    }
}

fn crypto(version: u16, seq: u64, key: &[u8], iv: &[u8]) -> io::Result<Crypto> {
    let invalid = |_| io::Error::other("unexpected TLS key size");
    Ok(Crypto {
        info: libc::tls_crypto_info {
            version,
            cipher_type: libc::TLS_CIPHER_CHACHA20_POLY1305,
        },
        iv: iv.try_into().map_err(invalid)?,
        key: key.try_into().map_err(invalid)?,
        salt: [],
        rec_seq: seq.to_be_bytes(),
    })
}

fn set_ulp(fd: RawFd) -> io::Result<()> {
    let name = b"tls";
    // SAFETY: the option value is a live byte slice of the given length.
    let ret = unsafe {
        libc::setsockopt(
            fd,
            libc::SOL_TCP,
            libc::TCP_ULP,
            name.as_ptr().cast(),
            name.len() as libc::socklen_t,
        )
    };
    if ret == 0 {
        Ok(())
    } else {
        Err(io::Error::last_os_error())
    }
}

/// Hands the keys to the kernel and wipes this copy.
fn set_crypto(fd: RawFd, direction: libc::c_int, crypto: &mut Crypto) -> io::Result<()> {
    // SAFETY: `crypto` is an initialised struct of the size passed.
    let ret = unsafe {
        libc::setsockopt(
            fd,
            libc::SOL_TLS,
            direction,
            (crypto as *const Crypto).cast(),
            size_of::<Crypto>() as libc::socklen_t,
        )
    };
    // SAFETY: plain writes to owned fields; volatile so the wipe stays.
    unsafe {
        std::ptr::write_volatile(&mut crypto.key, [0; 32]);
        std::ptr::write_volatile(&mut crypto.iv, [0; 12]);
    }
    if ret == 0 {
        Ok(())
    } else {
        Err(io::Error::last_os_error())
    }
}

/// A socket the kernel encrypts.
pub struct KernelStream {
    tcp: TcpStream,
    drained: Vec<u8>,
    drained_at: usize,
    cmsg: Vec<u8>,
    read_closed: bool,
    write_closed: bool,
}

enum Record {
    Data,
    Alert,
    Other,
}

/// One recvmsg: the byte count and the kind of record the bytes came from.
fn recv_record(fd: RawFd, dst: &mut [u8], cmsg: &mut [u8]) -> io::Result<(usize, Record)> {
    let mut iov = [IoSliceMut::new(dst)];
    let msg = recvmsg::<()>(fd, &mut iov, Some(cmsg), MsgFlags::MSG_DONTWAIT)?;
    let mut record = Record::Data;
    for message in msg.cmsgs()? {
        if let ControlMessageOwned::TlsGetRecordType(kind) = message {
            record = match kind {
                TlsGetRecordType::ApplicationData => Record::Data,
                TlsGetRecordType::Alert => Record::Alert,
                _ => Record::Other,
            };
        }
    }
    Ok((msg.bytes, record))
}

impl AsyncRead for KernelStream {
    fn poll_read(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &mut ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        let this = &mut *self;
        if this.drained_at < this.drained.len() {
            let n = (this.drained.len() - this.drained_at).min(buf.remaining());
            buf.put_slice(&this.drained[this.drained_at..this.drained_at + n]);
            this.drained_at += n;
            if this.drained_at == this.drained.len() {
                this.drained = Vec::new();
                this.drained_at = 0;
            }
            return Poll::Ready(Ok(()));
        }
        if this.read_closed || buf.remaining() == 0 {
            return Poll::Ready(Ok(()));
        }
        let fd = this.tcp.as_raw_fd();
        loop {
            ready!(this.tcp.poll_read_ready(cx))?;
            let cmsg = &mut this.cmsg;
            let received = this.tcp.try_io(Interest::READABLE, || {
                recv_record(fd, buf.initialize_unfilled(), cmsg)
            });
            match received {
                Ok((n, Record::Data)) => {
                    buf.advance(n);
                    return Poll::Ready(Ok(()));
                }
                Ok((n, Record::Alert)) => {
                    let alert = &buf.initialize_unfilled()[..n];
                    if alert.get(1) == Some(&ALERT_CLOSE_NOTIFY) {
                        this.read_closed = true;
                        return Poll::Ready(Ok(()));
                    }
                    return Poll::Ready(Err(io::Error::new(
                        io::ErrorKind::ConnectionAborted,
                        "TLS alert from the peer",
                    )));
                }
                // key updates, renegotiation: not supported after the handover
                Ok((_, Record::Other)) => {
                    return Poll::Ready(Err(io::Error::new(
                        io::ErrorKind::InvalidData,
                        "unexpected TLS record after the handshake",
                    )));
                }
                Err(err) if err.kind() == io::ErrorKind::WouldBlock => continue,
                Err(err) => return Poll::Ready(Err(err)),
            }
        }
    }
}

impl AsyncWrite for KernelStream {
    fn poll_write(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &[u8],
    ) -> Poll<io::Result<usize>> {
        Pin::new(&mut self.tcp).poll_write(cx, buf)
    }

    fn poll_write_vectored(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        bufs: &[IoSlice<'_>],
    ) -> Poll<io::Result<usize>> {
        Pin::new(&mut self.tcp).poll_write_vectored(cx, bufs)
    }

    fn is_write_vectored(&self) -> bool {
        self.tcp.is_write_vectored()
    }

    fn poll_flush(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        Pin::new(&mut self.tcp).poll_flush(cx)
    }

    fn poll_shutdown(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        if !self.write_closed {
            self.write_closed = true;
            // best effort, as when rustls closes
            let _ = send_close_notify(self.tcp.as_raw_fd());
        }
        Pin::new(&mut self.tcp).poll_shutdown(cx)
    }
}

fn send_close_notify(fd: RawFd) -> io::Result<()> {
    let alert = [ALERT_WARNING, ALERT_CLOSE_NOTIFY];
    // aligned for cmsghdr, larger than CMSG_SPACE(1)
    let mut control = [0u64; 4];
    // SAFETY: the message, its iovec and control buffer live across the call, and the CMSG
    // macros stay inside the control buffer.
    let ret = unsafe {
        let mut iov = libc::iovec {
            iov_base: alert.as_ptr() as *mut libc::c_void,
            iov_len: alert.len(),
        };
        let mut msg: libc::msghdr = std::mem::zeroed();
        msg.msg_iov = &mut iov;
        msg.msg_iovlen = 1;
        msg.msg_control = control.as_mut_ptr().cast();
        msg.msg_controllen = libc::CMSG_SPACE(1) as _;
        let cmsg = libc::CMSG_FIRSTHDR(&msg);
        (*cmsg).cmsg_level = libc::SOL_TLS;
        (*cmsg).cmsg_type = libc::TLS_SET_RECORD_TYPE;
        (*cmsg).cmsg_len = libc::CMSG_LEN(1) as _;
        *libc::CMSG_DATA(cmsg) = CONTENT_ALERT;
        libc::sendmsg(fd, &msg, libc::MSG_DONTWAIT)
    };
    if ret < 0 {
        Err(io::Error::last_os_error())
    } else {
        Ok(())
    }
}

/// A served HTTPS connection: encrypted by rustls or by the kernel.
pub enum TlsIo {
    Rustls(Box<TlsStream<RecordReader>>),
    Kernel(KernelStream),
}

impl AsyncRead for TlsIo {
    fn poll_read(
        self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &mut ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        match self.get_mut() {
            Self::Rustls(stream) => Pin::new(&mut **stream).poll_read(cx, buf),
            Self::Kernel(stream) => Pin::new(stream).poll_read(cx, buf),
        }
    }
}

impl AsyncWrite for TlsIo {
    fn poll_write(
        self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &[u8],
    ) -> Poll<io::Result<usize>> {
        match self.get_mut() {
            Self::Rustls(stream) => Pin::new(&mut **stream).poll_write(cx, buf),
            Self::Kernel(stream) => Pin::new(stream).poll_write(cx, buf),
        }
    }

    fn poll_write_vectored(
        self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        bufs: &[IoSlice<'_>],
    ) -> Poll<io::Result<usize>> {
        match self.get_mut() {
            Self::Rustls(stream) => Pin::new(&mut **stream).poll_write_vectored(cx, bufs),
            Self::Kernel(stream) => Pin::new(stream).poll_write_vectored(cx, bufs),
        }
    }

    fn is_write_vectored(&self) -> bool {
        match self {
            Self::Rustls(stream) => stream.is_write_vectored(),
            Self::Kernel(stream) => stream.is_write_vectored(),
        }
    }

    fn poll_flush(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        match self.get_mut() {
            Self::Rustls(stream) => Pin::new(&mut **stream).poll_flush(cx),
            Self::Kernel(stream) => Pin::new(stream).poll_flush(cx),
        }
    }

    fn poll_shutdown(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        match self.get_mut() {
            Self::Rustls(stream) => Pin::new(&mut **stream).poll_shutdown(cx),
            Self::Kernel(stream) => Pin::new(stream).poll_shutdown(cx),
        }
    }
}

#[cfg(test)]
mod tests {
    use tokio::{io::AsyncWriteExt, net::TcpListener};

    use super::*;

    #[tokio::test]
    async fn reads_stop_at_record_boundaries_and_the_cork() {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let mut client = TcpStream::connect(listener.local_addr().unwrap())
            .await
            .unwrap();
        let (server, _) = listener.accept().await.unwrap();
        client
            .write_all(&[22, 3, 3, 0, 2, 1, 2, 23, 3, 3, 0, 1, 9])
            .await
            .unwrap();

        let mut reader = RecordReader::new(server);
        let mut buf = [0; 64];
        assert_eq!(reader.read(&mut buf).await.unwrap(), 5, "the first header");
        reader.mode = Mode::Corked;
        assert_eq!(
            reader.read(&mut buf).await.unwrap(),
            2,
            "the rest of its record"
        );
        assert_eq!(reader.read(&mut buf).await.unwrap(), 0, "the cork");
        reader.mode = Mode::Passthrough;
        assert_eq!(
            reader.read(&mut buf).await.unwrap(),
            6,
            "the next record at once"
        );
        assert_eq!(&buf[..6], &[23, 3, 3, 0, 1, 9]);
    }
}
