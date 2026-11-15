//! Experiment (docs/development/c906l-send-tls.md): once a connection has sent a lot, its socket
//! writes move to a thread of their own, so the kernel sends one batch of records while the Tokio
//! thread waits for the C906L to seal the next.

use std::{
    io,
    os::fd::{AsFd, OwnedFd},
    pin::Pin,
    sync::{Arc, Condvar, Mutex},
    task::{Context, Poll, Waker},
    thread,
};

use nix::{
    errno::Errno,
    poll::{PollFd, PollFlags, poll},
};
use tokio::{
    io::{AsyncRead, AsyncWrite, ReadBuf},
    net::TcpStream,
};
use tracing::{info, warn};

/// Bytes sent directly before the writes move to a thread: past the page loads, into a stream.
const THRESHOLD: u64 = 1 << 20;
/// Bytes queued behind the one batch the thread is writing: the second half of a double buffer.
const CAP: usize = 128 * 1024;
/// `/tmp/c906l-pipe` forces it on or off; by default it follows the C906L offload.
fn enabled() -> bool {
    super::c906l::switch("pipe").unwrap_or_else(super::c906l::active)
}

pub struct PipeIo {
    tcp: TcpStream,
    sent: u64,
    checked: bool,
    writer: Option<Arc<Shared>>,
}

#[derive(Default)]
struct Shared {
    state: Mutex<State>,
    cond: Condvar,
}

#[derive(Default)]
struct State {
    queued: Vec<u8>,
    in_flight: usize,
    error: Option<io::ErrorKind>,
    waker: Option<Waker>,
    done: bool,
}

impl PipeIo {
    pub fn new(tcp: TcpStream) -> Self {
        Self {
            tcp,
            sent: 0,
            checked: false,
            writer: None,
        }
    }

    fn maybe_start(&mut self) {
        if self.checked || self.sent < THRESHOLD {
            return;
        }
        self.checked = true;
        if !enabled() {
            return;
        }
        match self.start() {
            Ok(()) => info!("socket writes of a streaming connection moved to a thread"),
            Err(err) => warn!(error = %err, "socket writer thread not started"),
        }
    }

    fn start(&mut self) -> io::Result<()> {
        let fd = self.tcp.as_fd().try_clone_to_owned()?;
        let shared = Arc::new(Shared::default());
        let theirs = shared.clone();
        thread::Builder::new()
            .name("tls-send".into())
            .stack_size(64 * 1024)
            .spawn(move || run(fd, &theirs))?;
        self.writer = Some(shared);
        Ok(())
    }

    fn queue(
        shared: &Shared,
        cx: &Context<'_>,
        bufs: &[io::IoSlice<'_>],
    ) -> Poll<io::Result<usize>> {
        let mut st = lock(shared);
        if let Some(kind) = st.error {
            return Poll::Ready(Err(kind.into()));
        }
        let mut room = CAP.saturating_sub(st.queued.len());
        if room == 0 {
            st.waker = Some(cx.waker().clone());
            return Poll::Pending;
        }
        let mut n = 0;
        for buf in bufs {
            let take = buf.len().min(room);
            st.queued.extend_from_slice(&buf[..take]);
            n += take;
            room -= take;
            if room == 0 {
                break;
            }
        }
        drop(st);
        shared.cond.notify_one();
        Poll::Ready(Ok(n))
    }
}

fn lock(shared: &Shared) -> std::sync::MutexGuard<'_, State> {
    shared.state.lock().unwrap_or_else(|err| err.into_inner())
}

fn run(fd: OwnedFd, shared: &Shared) {
    let mut spare = Vec::with_capacity(CAP);
    loop {
        let mut batch = {
            let mut st = lock(shared);
            while st.queued.is_empty() && !st.done {
                st = shared.cond.wait(st).unwrap_or_else(|err| err.into_inner());
            }
            if st.done {
                return;
            }
            let batch = std::mem::replace(&mut st.queued, std::mem::take(&mut spare));
            st.in_flight = batch.len();
            if let Some(waker) = st.waker.take() {
                waker.wake();
            }
            batch
        };
        let res = write_all(&fd, &batch, shared);
        let mut st = lock(shared);
        st.in_flight = 0;
        if let Err(err) = res {
            st.error = Some(err.kind());
        }
        if let Some(waker) = st.waker.take() {
            waker.wake();
        }
        if st.error.is_some() || st.done {
            return;
        }
        batch.clear();
        spare = batch;
    }
}

/// The socket is non-blocking (it is Tokio's); wait for room with poll.
fn write_all(fd: &OwnedFd, mut buf: &[u8], shared: &Shared) -> io::Result<()> {
    while !buf.is_empty() {
        match nix::unistd::write(fd, buf) {
            Ok(n) => buf = &buf[n..],
            Err(Errno::EINTR) => {}
            Err(Errno::EAGAIN) => {
                let mut fds = [PollFd::new(fd.as_fd(), PollFlags::POLLOUT)];
                match poll(&mut fds, 1000u16) {
                    Ok(_) | Err(Errno::EINTR) => {}
                    Err(err) => return Err(err.into()),
                }
                if lock(shared).done {
                    return Err(io::ErrorKind::BrokenPipe.into());
                }
            }
            Err(err) => return Err(err.into()),
        }
    }
    Ok(())
}

impl Drop for PipeIo {
    fn drop(&mut self) {
        if let Some(shared) = &self.writer {
            lock(shared).done = true;
            shared.cond.notify_one();
        }
    }
}

impl AsyncRead for PipeIo {
    fn poll_read(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &mut ReadBuf<'_>,
    ) -> Poll<io::Result<()>> {
        Pin::new(&mut self.tcp).poll_read(cx, buf)
    }
}

impl AsyncWrite for PipeIo {
    fn poll_write(
        self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        buf: &[u8],
    ) -> Poll<io::Result<usize>> {
        self.poll_write_vectored(cx, &[io::IoSlice::new(buf)])
    }

    fn poll_write_vectored(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
        bufs: &[io::IoSlice<'_>],
    ) -> Poll<io::Result<usize>> {
        self.maybe_start();
        if let Some(shared) = &self.writer {
            return Self::queue(shared, cx, bufs);
        }
        let res = Pin::new(&mut self.tcp).poll_write_vectored(cx, bufs);
        if let Poll::Ready(Ok(n)) = res {
            self.sent += n as u64;
        }
        res
    }

    fn is_write_vectored(&self) -> bool {
        true
    }

    /// Queued bytes count as handed over, like bytes in the socket's send buffer.
    fn poll_flush(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        match &self.writer {
            Some(shared) => Poll::Ready(match lock(shared).error {
                Some(kind) => Err(kind.into()),
                None => Ok(()),
            }),
            None => Pin::new(&mut self.tcp).poll_flush(cx),
        }
    }

    fn poll_shutdown(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
        if let Some(shared) = &self.writer {
            let mut st = lock(shared);
            if let Some(kind) = st.error {
                return Poll::Ready(Err(kind.into()));
            }
            if !st.queued.is_empty() || st.in_flight > 0 {
                st.waker = Some(cx.waker().clone());
                return Poll::Pending;
            }
        }
        Pin::new(&mut self.tcp).poll_shutdown(cx)
    }
}

#[cfg(test)]
mod tests {
    use tokio::{
        io::{AsyncReadExt, AsyncWriteExt},
        net::TcpListener,
    };

    use super::*;

    #[tokio::test(flavor = "multi_thread", worker_threads = 1)]
    async fn piped_writes_arrive_whole_and_in_order() {
        let listener = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let addr = listener.local_addr().unwrap();
        let reader = tokio::spawn(async move {
            let (mut s, _) = listener.accept().await.unwrap();
            let mut all = Vec::new();
            s.read_to_end(&mut all).await.unwrap();
            all
        });
        let mut io = PipeIo::new(TcpStream::connect(addr).await.unwrap());
        // forced on below, whatever the switch file says
        io.checked = true;
        let data: Vec<u8> = (0..(3 * THRESHOLD as usize))
            .map(|i| (i * 7) as u8)
            .collect();
        for chunk in data.chunks(16 * 1024 + 22) {
            if io.sent >= THRESHOLD && io.writer.is_none() {
                io.start().unwrap();
            }
            io.write_all(chunk).await.unwrap();
        }
        assert!(io.writer.is_some());
        io.shutdown().await.unwrap();
        drop(io);
        assert!(reader.await.unwrap() == data);
    }
}
