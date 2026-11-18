//! Everything the capture engine needs from the outside. `device::Device` is the board; the
//! tests run the same engine on a recorded scenario with virtual time and threads.

/// The commands the engine runs, argv only.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Command {
    /// `S15kvmhwd get_hdmi_version`: probes the bridge and writes /etc/kvm/hdmi_version.
    HdmiVersion,
    Reboot,
}

/// The VI counters from /proc/cvitek/vi_dbg, as published for the front panel.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct ViState {
    pub dev_fps: u32,
    pub fps: u32,
    pub width_gt: u32,
    pub width_ls: u32,
    pub height_gt: u32,
    pub height_ls: u32,
}

/// A thread started through the platform.
pub type ThreadHandle = usize;
/// A claimed GPIO line.
pub type GpioHandle = usize;

pub trait Platform: Send + Sync + 'static {
    /// CLOCK_MONOTONIC in milliseconds.
    fn now_ms(&self) -> u64;
    fn sleep_ms(&self, ms: u64);
    fn spawn(&self, name: &str, f: Box<dyn FnOnce() + Send>) -> Option<ThreadHandle>;
    /// Waits for the thread until `deadline_ms` (now_ms clock); false if it is still running.
    fn join(&self, thread: ThreadHandle, deadline_ms: u64) -> bool;

    /// The capture lock, held across camera calls that block. With a deadline, false when
    /// it passed first.
    fn lock(&self, deadline_ms: Option<u64>) -> bool;
    fn unlock(&self);

    /// One I2C write to a 7-bit address on the bridge's bus; false on any failure.
    fn i2c_write(&self, addr: u8, bytes: &[u8]) -> bool;
    /// One I2C read of `buf.len()` bytes; false on any failure.
    fn i2c_read(&self, addr: u8, buf: &mut [u8]) -> bool;

    /// At most `limit` bytes of a file; None if it cannot be opened or read.
    fn read(&self, path: &str, limit: usize) -> Option<Vec<u8>>;
    fn exists(&self, path: &str) -> bool;
    /// Truncates and writes.
    fn write(&self, path: &str, data: &[u8]) -> bool;
    /// Writes mode 0644 through a temporary file, fsync and a rename.
    fn write_atomic(&self, path: &str, data: &[u8]) -> bool;
    fn sync(&self);
    fn run(&self, cmd: Command);
    /// The carveout "usage rate" field of /proc/cvitek/sys_mem, as text.
    fn carveout_usage(&self) -> Option<String>;
    /// Publishes the VI state at /dev/shm/nanokvm_vi_state.
    fn publish_vi_state(&self, state: &ViState) -> bool;

    /// Claims the DT line `name` as an output at `high`.
    fn gpio_claim(&self, name: &str, consumer: &str, high: bool) -> Option<GpioHandle>;
    fn gpio_set(&self, line: GpioHandle, high: bool);

    // The camera and encoders (libkvm's kvm_media.h).
    fn cam_create(&self, w: u16, h: u16) -> bool;
    fn cam_restart(&self, w: u16, h: u16);
    fn cam_set_size(&self, w: u16, h: u16) -> bool;
    fn cam_mirror_flip(&self);
    fn cam_close(&self);
    fn mmf_is_init(&self) -> bool;
    fn mmf_deinit(&self, force: bool);
    /// Leases the next frame: (width, height, size in bytes).
    fn frame_read(&self) -> Option<(u16, u16, usize)>;
    /// Calls `f` with the leased frame's pixels (`size` bytes), None when unmapped.
    fn frame_pixels(&self, f: &mut dyn FnMut(Option<&[u8]>));
    fn frame_release(&self);
    /// JPEG of the leased frame into `out` after `headroom` zero bytes; the JPEG length.
    fn frame_jpeg(&self, quality: u8, out: &mut Vec<u8>, headroom: usize) -> Option<u32>;
    fn venc_add(&self, ch: u8, w: u16, h: u16, gop: u32, fps: u32, bitrate: u32) -> bool;
    fn venc_del(&self, ch: u8);
    fn frame_venc_push(&self, ch: u8) -> bool;
    /// Calls `f` with the encoded packs; false when the pop fails.
    fn venc_pop(&self, ch: u8, f: &mut dyn FnMut(&[&[u8]])) -> bool;
    fn venc_free(&self, ch: u8);
    fn venc_request_idr(&self, ch: u8) -> bool;
}
