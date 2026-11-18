//! The board side of the capture engine: i2c-dev, GPIO, files, commands and libkvm.

use std::{
    fs::{self, File, OpenOptions},
    io::{Read, Write},
    os::{
        fd::AsRawFd,
        unix::fs::{FileExt, OpenOptionsExt, PermissionsExt},
    },
    path::Path,
    sync::{
        Condvar, Mutex, MutexGuard,
        atomic::{AtomicU32, Ordering},
    },
    thread::{self, JoinHandle},
    time::{Duration, Instant},
};

use nix::{
    libc,
    time::{ClockId, clock_gettime},
};
use tokio::runtime::Handle;
use tracing::warn;

use super::platform::{Command, GpioHandle, Platform, ThreadHandle, ViState};
use crate::{
    ffi::kvm,
    system::{
        command::{AllowedCommand, run_allowed},
        gpio::{Direction, Line},
    },
};

const I2C_BUS: &str = "/dev/i2c-4";
const SYS_MEM: &str = "/proc/cvitek/sys_mem";
const VI_STATE_FILE: &str = "/dev/shm/nanokvm_vi_state";
const VI_STATE_MAGIC: u32 = 0x4e4b_5649;
const VI_STATE_VERSION: u32 = 1;
const VI_STATE_SIZE: u64 = 40;
const COMMAND_TIMEOUT: Duration = Duration::from_secs(30);

nix::ioctl_write_int_bad!(i2c_slave, 0x0703);

fn lock<T>(m: &Mutex<T>) -> MutexGuard<'_, T> {
    m.lock().unwrap_or_else(|e| e.into_inner())
}

fn monotonic_ms() -> u64 {
    clock_gettime(ClockId::CLOCK_MONOTONIC)
        .map(|ts| ts.tv_sec() as u64 * 1000 + ts.tv_nsec() as u64 / 1_000_000)
        .unwrap_or(0)
}

pub(super) struct Device {
    runtime: Option<Handle>,
    i2c: Mutex<Option<File>>,
    threads: Mutex<Vec<Option<JoinHandle<()>>>>,
    gpio: Mutex<Vec<Line>>,
    held: Mutex<bool>,
    released: Condvar,
    /// Bytes of the leased frame, for frame_pixels.
    frame_size: Mutex<usize>,
}

impl Device {
    pub(super) fn new() -> Self {
        Device {
            runtime: Handle::try_current().ok(),
            i2c: Mutex::new(OpenOptions::new().read(true).write(true).open(I2C_BUS).ok()),
            threads: Mutex::new(Vec::new()),
            gpio: Mutex::new(Vec::new()),
            held: Mutex::new(false),
            released: Condvar::new(),
            frame_size: Mutex::new(0),
        }
    }

    fn i2c<T>(&self, addr: u8, f: impl FnOnce(&mut File) -> std::io::Result<T>) -> Option<T> {
        let mut bus = lock(&self.i2c);
        let file = bus.as_mut()?;
        // SAFETY: I2C_SLAVE takes the address as the argument value.
        unsafe { i2c_slave(file.as_raw_fd(), addr.into()) }.ok()?;
        f(file).ok()
    }
}

/// The "usage rate:" field of sys_mem, as `grep "usage rate:" | awk -F '[:%]' '{print $2}'`
/// printed it for the first matching line.
pub(super) fn usage_rate_field(text: &str) -> Option<String> {
    let line = text.lines().find(|l| l.contains("usage rate:"))?;
    let field = line.split([':', '%']).nth(1).unwrap_or("");
    Some(format!("{field}\n"))
}

impl Platform for Device {
    fn now_ms(&self) -> u64 {
        monotonic_ms()
    }

    fn sleep_ms(&self, ms: u64) {
        thread::sleep(Duration::from_millis(ms));
    }

    fn spawn(&self, name: &str, f: Box<dyn FnOnce() + Send>) -> Option<ThreadHandle> {
        let handle = thread::Builder::new()
            .name(name.to_string())
            .spawn(f)
            .ok()?;
        let mut threads = lock(&self.threads);
        threads.push(Some(handle));
        Some(threads.len() - 1)
    }

    fn join(&self, thread: ThreadHandle, deadline_ms: u64) -> bool {
        loop {
            let finished = lock(&self.threads)
                .get(thread)
                .and_then(Option::as_ref)
                .is_none_or(JoinHandle::is_finished);
            if finished {
                if let Some(handle) = lock(&self.threads).get_mut(thread).and_then(Option::take) {
                    let _ = handle.join();
                }
                return true;
            }
            if monotonic_ms() >= deadline_ms {
                return false;
            }
            thread::sleep(Duration::from_millis(10));
        }
    }

    fn lock(&self, deadline_ms: Option<u64>) -> bool {
        let started = Instant::now();
        let limit = deadline_ms.map(|d| Duration::from_millis(d.saturating_sub(monotonic_ms())));
        let mut held = lock(&self.held);
        while *held {
            match limit {
                None => held = self.released.wait(held).unwrap_or_else(|e| e.into_inner()),
                Some(limit) => {
                    let left = limit.saturating_sub(started.elapsed());
                    if left.is_zero() {
                        return false;
                    }
                    held = self
                        .released
                        .wait_timeout(held, left)
                        .unwrap_or_else(|e| e.into_inner())
                        .0;
                }
            }
        }
        *held = true;
        true
    }

    fn unlock(&self) {
        *lock(&self.held) = false;
        self.released.notify_one();
    }

    fn i2c_write(&self, addr: u8, bytes: &[u8]) -> bool {
        self.i2c(addr, |f| f.write(bytes))
            .is_some_and(|n| n == bytes.len())
    }

    fn i2c_read(&self, addr: u8, buf: &mut [u8]) -> bool {
        !buf.is_empty()
            && self
                .i2c(addr, |f| f.read(buf))
                .is_some_and(|n| n == buf.len())
    }

    fn read(&self, path: &str, limit: usize) -> Option<Vec<u8>> {
        let file = File::open(path).ok()?;
        let mut data = Vec::new();
        file.take(limit as u64).read_to_end(&mut data).ok()?;
        Some(data)
    }

    fn exists(&self, path: &str) -> bool {
        fs::metadata(path).is_ok()
    }

    fn write(&self, path: &str, data: &[u8]) -> bool {
        File::create(path)
            .and_then(|mut f| f.write_all(data))
            .is_ok()
    }

    fn write_atomic(&self, path: &str, data: &[u8]) -> bool {
        static SEQ: AtomicU32 = AtomicU32::new(0);
        let target = Path::new(path);
        let Some(name) = target.file_name().and_then(|n| n.to_str()) else {
            return false;
        };
        let temp = target.with_file_name(format!(
            ".{name}.tmp.{}.{}",
            std::process::id(),
            SEQ.fetch_add(1, Ordering::Relaxed)
        ));
        let result = (|| {
            let mut file = OpenOptions::new()
                .write(true)
                .create_new(true)
                .custom_flags(libc::O_NOFOLLOW)
                .open(&temp)?;
            file.set_permissions(fs::Permissions::from_mode(0o644))?;
            file.write_all(data)?;
            file.sync_all()?;
            fs::rename(&temp, target)
        })();
        if result.is_err() {
            let _ = fs::remove_file(&temp);
        }
        result.is_ok()
    }

    fn sync(&self) {
        nix::unistd::sync();
    }

    fn run(&self, cmd: Command) {
        let (program, args): (_, &[&str]) = match cmd {
            Command::HdmiVersion => (AllowedCommand::ServiceKvmHwd, &["get_hdmi_version"]),
            Command::Reboot => (AllowedCommand::Reboot, &[]),
        };
        let Some(runtime) = &self.runtime else {
            warn!(command = ?cmd, "no runtime for the capture command");
            return;
        };
        if let Err(err) = runtime.block_on(run_allowed(program, args, COMMAND_TIMEOUT)) {
            warn!(command = ?cmd, error = %err, "capture command failed");
        }
    }

    fn carveout_usage(&self) -> Option<String> {
        usage_rate_field(&fs::read_to_string(SYS_MEM).ok()?)
    }

    /// The seqlock record the front panel reads: sequence odd while writing.
    fn publish_vi_state(&self, s: &ViState) -> bool {
        let result = (|| -> std::io::Result<()> {
            let file = OpenOptions::new()
                .read(true)
                .write(true)
                .create(true)
                .truncate(false)
                .mode(0o600)
                .custom_flags(libc::O_NOFOLLOW)
                .open(VI_STATE_FILE)?;
            file.lock()?;
            let meta = file.metadata()?;
            if !meta.is_file() {
                return Err(std::io::ErrorKind::InvalidData.into());
            }
            file.set_permissions(fs::Permissions::from_mode(0o600))?;
            file.set_len(VI_STATE_SIZE)?;
            let mut seq = [0_u8; 4];
            file.read_exact_at(&mut seq, 0)?;
            let seq = (u32::from_ne_bytes(seq) & !1).wrapping_add(1);
            file.write_all_at(&seq.to_ne_bytes(), 0)?;
            let mut body = Vec::with_capacity(36);
            for v in [
                VI_STATE_MAGIC,
                VI_STATE_VERSION,
                monotonic_ms() as u32,
                s.dev_fps,
                s.fps,
                s.width_gt,
                s.width_ls,
                s.height_gt,
                s.height_ls,
            ] {
                body.extend_from_slice(&v.to_ne_bytes());
            }
            file.write_all_at(&body, 4)?;
            file.write_all_at(&seq.wrapping_add(1).to_ne_bytes(), 0)?;
            Ok(())
        })();
        result.is_ok()
    }

    fn gpio_claim(&self, name: &str, consumer: &str, high: bool) -> Option<GpioHandle> {
        let line = Line::request(name, consumer, Direction::Output(high)).ok()?;
        let mut lines = lock(&self.gpio);
        lines.push(line);
        Some(lines.len() - 1)
    }

    fn gpio_set(&self, line: GpioHandle, high: bool) {
        if let Some(line) = lock(&self.gpio).get(line) {
            let _ = line.set(high);
        }
    }

    fn cam_create(&self, w: u16, h: u16) -> bool {
        kvm::cam_create(w, h)
    }

    fn cam_restart(&self, w: u16, h: u16) {
        kvm::cam_restart(w, h)
    }

    fn cam_set_size(&self, w: u16, h: u16) -> bool {
        kvm::cam_set_size(w, h)
    }

    fn cam_mirror_flip(&self) {
        kvm::cam_mirror_flip()
    }

    fn cam_close(&self) {
        kvm::cam_close()
    }

    fn mmf_is_init(&self) -> bool {
        kvm::mmf_is_init()
    }

    fn mmf_deinit(&self, force: bool) {
        kvm::mmf_deinit(force)
    }

    fn frame_read(&self) -> Option<(u16, u16, usize)> {
        let frame = kvm::frame_read();
        *lock(&self.frame_size) = frame.map_or(0, |f| f.2);
        frame
    }

    fn frame_pixels(&self, f: &mut dyn FnMut(Option<&[u8]>)) {
        kvm::frame_pixels(*lock(&self.frame_size), f)
    }

    fn frame_release(&self) {
        kvm::frame_release();
        *lock(&self.frame_size) = 0;
    }

    fn frame_jpeg(&self, quality: u8, out: &mut Vec<u8>, headroom: usize) -> Option<u32> {
        kvm::frame_jpeg(quality, out, headroom)
    }

    fn venc_add(&self, ch: u8, w: u16, h: u16, gop: u32, fps: u32, bitrate: u32) -> bool {
        kvm::venc_add(ch, w, h, gop, fps, bitrate)
    }

    fn venc_del(&self, ch: u8) {
        kvm::venc_del(ch)
    }

    fn frame_venc_push(&self, ch: u8) -> bool {
        kvm::frame_venc_push(ch)
    }

    fn venc_pop(&self, ch: u8, f: &mut dyn FnMut(&[&[u8]])) -> bool {
        kvm::venc_pop(ch, f)
    }

    fn venc_free(&self, ch: u8) {
        kvm::venc_free(ch)
    }

    fn venc_request_idr(&self, ch: u8) -> bool {
        kvm::venc_request_idr(ch)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn usage_rate_is_the_second_field() {
        let text = "Summary:\n[0] carveout heap size:78643200 bytes, used:31436800 bytes\n\
                    usage rate:40%, memory usage peak 31436800 bytes\n";
        assert_eq!(usage_rate_field(text).as_deref(), Some("40\n"));
        assert_eq!(usage_rate_field("nothing\n"), None);
    }

    #[test]
    fn atomic_write_replaces_with_mode_0644() {
        let dir = tempfile::tempdir().unwrap();
        let path = dir.path().join("state");
        fs::write(&path, b"0\n").unwrap();
        let device = Device {
            runtime: None,
            i2c: Mutex::new(None),
            threads: Mutex::new(Vec::new()),
            gpio: Mutex::new(Vec::new()),
            held: Mutex::new(false),
            released: Condvar::new(),
            frame_size: Mutex::new(0),
        };
        assert!(device.write_atomic(path.to_str().unwrap(), b"1\n"));
        assert_eq!(fs::read(&path).unwrap(), b"1\n");
        assert_eq!(
            fs::metadata(&path).unwrap().permissions().mode() & 0o777,
            0o644
        );
        assert_eq!(fs::read_dir(dir.path()).unwrap().count(), 1);
    }
}
