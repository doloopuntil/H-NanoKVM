//! The transfer stage of an upload to the NanoKVM, shared by the image, the system bundle and
//! the application bundle uploads. A handler does what belongs to its kind before the transfer
//! (locks, names, who may upload) and after it (validation, unpacking, the rename into place).
//! Here a file field goes to disk in chunks, with a size cap, an optional SHA-256 and an fsync
//! before it returns, and the checks that the browser can ask for before it sends anything.

use axum::{
    body::Body,
    extract::{Request, multipart::Field},
};
use bytes::Bytes;
use futures_util::Stream;
use sha2::{Digest, Sha256};
use std::{
    path::Path,
    pin::Pin,
    task::{Context, Poll},
    time::{Duration, Instant},
};
use tokio::io::{AsyncWriteExt, BufWriter};

use crate::{AppError, Result};

/// Free space kept besides what an upload needs.
pub const FREE_SPACE_MARGIN: u64 = 64 * 1024 * 1024;

// Batches the ~16 KiB request chunks into fewer blocking-pool writes.
const WRITE_BUFFER: usize = 256 * 1024;
const CHECKSUM_QUEUE_CHUNKS: usize = 8;
const PROGRESS_INTERVAL: Duration = Duration::from_secs(1);
// Body bytes decrypted in one turn of the worker before an upload gives way.
const READ_SLICE: usize = 64 * 1024;

/// What one kind of upload accepts.
pub struct UploadLimits {
    /// The largest file, with the overhead of its container.
    pub max_bytes: u64,
    /// Bytes of free space needed for each byte uploaded: the file itself, and what is
    /// unpacked from it while both exist.
    pub space_factor: u64,
}

impl UploadLimits {
    pub fn space_needed(&self, len: u64) -> u64 {
        len.saturating_mul(self.space_factor)
            .saturating_add(FREE_SPACE_MARGIN)
    }
}

/// The checks every upload makes before it reads any data, so that the browser can refuse a
/// file with a readable message: a rejection after the browser has started sending the body
/// reaches it as a bare connection reset.
pub fn check_size_and_space(dir: &Path, len: Option<u64>, limits: &UploadLimits) -> Result<()> {
    let Some(len) = len else {
        return Ok(());
    };
    if len > limits.max_bytes {
        return Err(AppError::BadRequest("upload is too large".to_string()));
    }
    ensure_free_space(dir, limits.space_needed(len))
}

pub fn ensure_free_space(dir: &Path, needed: u64) -> Result<()> {
    // the staging folder may not exist yet; the filesystem under it is what counts
    let mut probe = dir;
    while !probe.exists() {
        match probe.parent() {
            Some(parent) => probe = parent,
            None => break,
        }
    }
    let stat = nix::sys::statvfs::statvfs(probe)
        .map_err(|err| AppError::Internal(format!("failed to read free space: {err}")))?;
    let available = (stat.blocks_available() as u64).saturating_mul(stat.fragment_size() as u64);
    if available < needed {
        return Err(AppError::BadRequest(format!(
            "not enough free space for the upload: {} MiB needed, {} MiB free",
            needed.div_ceil(1024 * 1024),
            available / (1024 * 1024)
        )));
    }
    Ok(())
}

/// What `receive_field` got.
pub struct Received {
    pub bytes: u64,
    /// Present when a checksum was asked for.
    pub sha256: Option<[u8; 32]>,
}

/// Writes the field to `file` and syncs it. `progress` gets the bytes written so far, about
/// once a second. A failure leaves the partial file to the caller, who owns its name.
pub async fn receive_field(
    field: &mut Field<'_>,
    file: tokio::fs::File,
    max_bytes: u64,
    with_checksum: bool,
    mut progress: impl FnMut(u64) -> Result<()>,
) -> Result<Received> {
    let mut writer = BufWriter::with_capacity(WRITE_BUFFER, file);
    let checksum = with_checksum.then(ChecksumWorker::spawn);
    let mut total = 0_u64;
    let mut reported = Instant::now();

    while let Some(chunk) = field
        .chunk()
        .await
        .map_err(|err| AppError::BadRequest(format!("invalid multipart data: {err}")))?
    {
        total = total.saturating_add(chunk.len() as u64);
        if total > max_bytes {
            return Err(AppError::BadRequest("upload is too large".to_string()));
        }
        if let Some(worker) = &checksum {
            worker.feed(chunk.clone()).await?;
        }
        writer.write_all(&chunk).await?;
        // lets the video stream have the worker between slices (see yield_between_reads)
        tokio::task::yield_now().await;
        if reported.elapsed() >= PROGRESS_INTERVAL {
            progress(total)?;
            reported = Instant::now();
        }
    }
    writer.flush().await?;
    writer.get_mut().sync_all().await?;

    let sha256 = match checksum {
        Some(worker) => Some(worker.finish().await?),
        None => None,
    };
    Ok(Received {
        bytes: total,
        sha256,
    })
}

/// Route layer for uploads: multer reads the body until it would block, which on a fast link
/// is ~128 TLS reads in one turn of the single worker, and the video stream stalls meanwhile.
pub async fn yield_between_reads(request: Request) -> Request {
    let (parts, body) = request.into_parts();
    let body = Body::from_stream(ReadSlices {
        inner: body.into_data_stream(),
        since_pending: 0,
    });
    Request::from_parts(parts, body)
}

/// Pends, and wakes itself, after READ_SLICE bytes without pending.
struct ReadSlices<S> {
    inner: S,
    since_pending: usize,
}

impl<S, E> Stream for ReadSlices<S>
where
    S: Stream<Item = std::result::Result<Bytes, E>> + Unpin,
{
    type Item = S::Item;

    fn poll_next(mut self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
        if self.since_pending >= READ_SLICE {
            self.since_pending = 0;
            cx.waker().wake_by_ref();
            return Poll::Pending;
        }
        let polled = Pin::new(&mut self.inner).poll_next(cx);
        match &polled {
            Poll::Ready(Some(Ok(chunk))) => self.since_pending += chunk.len(),
            Poll::Pending => self.since_pending = 0,
            _ => {}
        }
        polled
    }
}

struct ChecksumWorker {
    tx: tokio::sync::mpsc::Sender<Bytes>,
    task: tokio::task::JoinHandle<[u8; 32]>,
}

impl ChecksumWorker {
    fn spawn() -> Self {
        let (tx, mut rx) = tokio::sync::mpsc::channel::<Bytes>(CHECKSUM_QUEUE_CHUNKS);
        let task = tokio::task::spawn_blocking(move || {
            let mut hasher = Sha256::new();
            while let Some(chunk) = rx.blocking_recv() {
                hasher.update(&chunk);
            }
            hasher.finalize().into()
        });
        Self { tx, task }
    }

    /// Waits when the hasher is behind, which slows the upload to its pace.
    async fn feed(&self, chunk: Bytes) -> Result<()> {
        self.tx
            .send(chunk)
            .await
            .map_err(|_| AppError::Internal("checksum task stopped".to_string()))
    }

    async fn finish(self) -> Result<[u8; 32]> {
        drop(self.tx);
        self.task
            .await
            .map_err(|err| AppError::Internal(format!("checksum task failed: {err}")))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::{
        body::Body,
        extract::{FromRequest, Multipart},
        http::{Request, header},
    };

    const LIMITS: UploadLimits = UploadLimits {
        max_bytes: 1024,
        space_factor: 2,
    };

    fn multipart_request(parts: &[(&str, &[u8])]) -> Request<Body> {
        let mut body = Vec::new();
        for (name, data) in parts {
            body.extend_from_slice(
                format!(
                    "--B\r\nContent-Disposition: form-data; name=\"{name}\"; filename=\"f.bin\"\r\n\r\n"
                )
                .as_bytes(),
            );
            body.extend_from_slice(data);
            body.extend_from_slice(b"\r\n");
        }
        body.extend_from_slice(b"--B--\r\n");
        Request::builder()
            .header(header::CONTENT_TYPE, "multipart/form-data; boundary=B")
            .body(Body::from(body))
            .unwrap()
    }

    async fn receive(
        data: &[u8],
        max_bytes: u64,
        with_checksum: bool,
    ) -> (Result<Received>, Vec<u8>) {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("out");
        let mut multipart = Multipart::from_request(multipart_request(&[("file", data)]), &())
            .await
            .unwrap();
        let mut field = multipart.next_field().await.unwrap().unwrap();
        let file = tokio::fs::File::create(&path).await.unwrap();
        let received = receive_field(&mut field, file, max_bytes, with_checksum, |_| Ok(())).await;
        (received, std::fs::read(&path).unwrap_or_default())
    }

    #[tokio::test]
    async fn a_field_is_written_whole_and_its_checksum_matches() {
        let data = vec![0x5a_u8; 700];
        let (received, written) = receive(&data, 1024, true).await;
        let received = received.unwrap();
        assert_eq!(received.bytes, 700);
        assert_eq!(written, data);
        let expected: [u8; 32] = Sha256::digest(&data).into();
        assert_eq!(received.sha256, Some(expected));
    }

    #[tokio::test]
    async fn no_checksum_is_computed_unless_asked_for() {
        let (received, _) = receive(b"abc", 1024, false).await;
        assert_eq!(received.unwrap().sha256, None);
    }

    #[tokio::test]
    async fn a_field_over_the_cap_is_refused() {
        let (received, _) = receive(&vec![0_u8; 2048], 1024, false).await;
        assert!(matches!(received, Err(AppError::BadRequest(_))));
    }

    #[tokio::test]
    async fn an_empty_field_is_reported_as_zero_bytes_for_the_caller_to_refuse() {
        let (received, written) = receive(b"", 1024, true).await;
        assert_eq!(received.unwrap().bytes, 0);
        assert!(written.is_empty());
    }

    #[tokio::test]
    async fn an_upload_gives_way_to_other_tasks_between_read_slices() {
        use std::sync::{
            Arc,
            atomic::{AtomicBool, AtomicUsize, Ordering},
        };
        const CHUNK: usize = 16 * 1024;
        const CHUNKS: usize = 32;

        let read = Arc::new(AtomicUsize::new(0));
        let counted = read.clone();
        let mut parts = vec![Bytes::from_static(
            b"--B\r\nContent-Disposition: form-data; name=\"file\"; filename=\"f.bin\"\r\n\r\n",
        )];
        parts.extend((0..CHUNKS).map(|_| Bytes::from(vec![0x5a_u8; CHUNK])));
        parts.push(Bytes::from_static(b"\r\n--B--\r\n"));
        let body = futures_util::StreamExt::map(futures_util::stream::iter(parts), move |part| {
            counted.fetch_add(1, Ordering::Relaxed);
            Ok::<_, std::io::Error>(part)
        });
        let request = Request::builder()
            .header(header::CONTENT_TYPE, "multipart/form-data; boundary=B")
            .body(Body::from_stream(body))
            .unwrap();

        // the largest number of chunks read between two turns of another task
        let done = Arc::new(AtomicBool::new(false));
        let watcher = {
            let (read, done) = (read.clone(), done.clone());
            tokio::spawn(async move {
                let (mut last, mut most) = (0, 0);
                while !done.load(Ordering::Relaxed) {
                    let now = read.load(Ordering::Relaxed);
                    most = most.max(now - last);
                    last = now;
                    tokio::task::yield_now().await;
                }
                most
            })
        };

        let request = yield_between_reads(request).await;
        let mut multipart = Multipart::from_request(request, &()).await.unwrap();
        let mut field = multipart.next_field().await.unwrap().unwrap();
        let dir = tempfile::tempdir().unwrap();
        let file = tokio::fs::File::create(dir.path().join("out"))
            .await
            .unwrap();
        let received = receive_field(&mut field, file, u64::MAX, false, |_| Ok(()))
            .await
            .unwrap();
        done.store(true, Ordering::Relaxed);

        assert_eq!(received.bytes, (CHUNK * CHUNKS) as u64);
        let most = watcher.await.unwrap();
        assert!(
            most <= READ_SLICE / CHUNK + 2,
            "{most} chunks read in one turn"
        );
    }

    #[tokio::test]
    async fn the_checksum_worker_hashes_streamed_chunks() {
        let worker = ChecksumWorker::spawn();
        for part in [&b"a"[..], &b"b"[..], &b"c"[..]] {
            worker.feed(Bytes::copy_from_slice(part)).await.unwrap();
        }
        let expected: [u8; 32] = Sha256::digest(b"abc").into();
        assert_eq!(worker.finish().await.unwrap(), expected);
    }

    #[test]
    fn the_space_an_upload_needs_adds_the_margin_and_saturates() {
        assert_eq!(LIMITS.space_needed(0), FREE_SPACE_MARGIN);
        assert_eq!(LIMITS.space_needed(100), 200 + FREE_SPACE_MARGIN);
        assert_eq!(LIMITS.space_needed(u64::MAX), u64::MAX);
    }

    #[test]
    fn the_size_and_space_checks_refuse_what_cannot_be_taken() {
        let dir = tempfile::tempdir().unwrap();
        assert!(check_size_and_space(dir.path(), None, &LIMITS).is_ok());
        assert!(check_size_and_space(dir.path(), Some(10), &LIMITS).is_ok());
        let too_large = check_size_and_space(dir.path(), Some(2048), &LIMITS).unwrap_err();
        assert!(matches!(too_large, AppError::BadRequest(_)));

        let huge = UploadLimits {
            max_bytes: u64::MAX,
            space_factor: 1,
        };
        let err = check_size_and_space(dir.path(), Some(u64::MAX / 2), &huge).unwrap_err();
        assert!(err.to_string().contains("not enough free space"));
    }

    #[test]
    fn free_space_is_read_from_the_nearest_existing_parent() {
        let dir = tempfile::tempdir().unwrap();
        let missing = dir.path().join("not").join("there");
        assert!(ensure_free_space(&missing, 1).is_ok());
        let err = ensure_free_space(&missing, u64::MAX).unwrap_err();
        assert!(err.to_string().contains("not enough free space"));
        assert!(ensure_free_space(dir.path(), 1).is_ok());
        assert!(ensure_free_space(dir.path(), u64::MAX).is_err());
    }
}
