//! The capture engine: libkvm's kvm_vision.cpp in Rust. State, lifecycle, HDMI control and
//! the reads; the detection and watchdog threads are in `detect.rs`, the bridge in
//! `bridge.rs`. tests/capture/golden holds the behaviour it keeps.

use std::sync::{
    Arc, Mutex, MutexGuard,
    atomic::{AtomicBool, AtomicU8, AtomicU16, AtomicU64, Ordering::*},
};

use super::{
    bridge::LastCsi,
    platform::{GpioHandle, Platform, ThreadHandle},
};

pub const IMG_VENC_ERROR: i32 = -2;
pub const IMG_NOT_EXIST: i32 = -1;
pub const IMG_MJPEG_TYPE: i32 = 0;
pub const IMG_H264_TYPE_IF: i32 = 3;
pub const IMG_H264_TYPE_PF: i32 = 4;

pub(super) const NORMAL_RES: u8 = 0;
pub(super) const NEW_RES: u8 = 1;
pub(super) const UNSUPPORT_RES: u8 = 2;
pub(super) const UNKNOWN_RES: u8 = 3;
pub(super) const ERROR_RES: u8 = 4;

pub(super) const HDMI_MODE_BRIDGE: u8 = 0;
pub(super) const HDMI_MODE_SCAN: u8 = 1;
pub(super) const HDMI_MODE_MANUAL: u8 = 2;
pub(super) const HDMI_MODE_MAX: u8 = HDMI_MODE_MANUAL;

pub(super) const DEFAULT_WIDTH: u16 = 1920;
pub(super) const DEFAULT_HEIGHT: u16 = 1080;

pub(super) const HDMI_SIGNAL_FILE: &str = "/kvmapp/kvm/state";

const VENC_MJPEG: u8 = 0;
const VENC_H264: u8 = 1;
const DEFAULT_VENC_CHN: u8 = 1;
const MAX_TRY_NUM: u8 = 2;
const FRAME_SAMPLE_SIZE: usize = 76_800; // 320 * 240
const DEFAULT_H264_FPS: u8 = 30;
const H264_IDR_SECONDS: u32 = 10;
const H264_IDR_MIN_GAP_MS: u64 = 500;
const FRESH_FRAME_DISCARD_COUNT: u8 = 5;
const READ_LOCK_MS: u64 = 1000;
const DEINIT_JOIN_MS: u64 = 2000;
const HW_FILE: &str = "/etc/kvm/hw";

#[derive(Clone, Copy, PartialEq, Eq)]
enum Lifecycle {
    Stopped,
    Running,
    Stopping,
}

/// State shared between the API and the threads (kvmv_cfg_t's cross-thread fields).
#[derive(Default)]
pub(super) struct Shared {
    pub cam: AtomicBool,
    pub vi_width: AtomicU16,
    pub vi_height: AtomicU16,
    pub reopen_cam: AtomicBool,
    pub cable_present: AtomicBool,
    pub hdmi_stop: AtomicBool,
    pub hdmi_reading: AtomicBool,
    pub res_type: AtomicU8,
    pub res_err: AtomicU8,
    pub detect_state: AtomicU8,
    pub fresh_frames: AtomicU8,
    pub frame_detect: AtomicU8,
    pub stream_stop: AtomicBool,
    pub h264_fps: AtomicU8,
    pub keyframe_requested: AtomicBool,
    pub capture_enabled: AtomicBool,
    pub signal_active: AtomicBool,
    pub stop_threads: AtomicBool,
    pub hw_version: AtomicU8,
    pub last_vi_refresh_ms: AtomicU64,
}

#[derive(Default)]
struct H264 {
    init: bool,
    w: u16,
    h: u16,
    gop: u32,
    fps: u32,
    bitrate: u32,
    last_requested_idr_ms: u64,
}

/// What the capture lock protects (vi_mutex in the C++).
struct Vi {
    vpss_width: u16,
    vpss_height: u16,
    venc_type: u8,
    reinit: bool,
    /// The input size applied while following it (0 x 0 reads).
    auto_res: Option<(u16, u16)>,
    frame_undetect_count: u8,
    sample: Vec<u8>,
    sample_raw_size: usize,
    h264: H264,
}

struct Life {
    state: Lifecycle,
    detection: Option<ThreadHandle>,
    watchdog: Option<ThreadHandle>,
}

pub struct Engine<P: Platform> {
    pub(super) p: P,
    pub(super) s: Shared,
    vi: Mutex<Vi>,
    life: Mutex<Life>,
    signal: Mutex<()>,
    hdmi_reset: Mutex<Option<GpioHandle>>,
    pub(super) last_csi: LastCsi,
}

/// The capture lock with its data; unlocks when dropped.
struct ViGuard<'a, P: Platform> {
    p: &'a P,
    data: Option<MutexGuard<'a, Vi>>,
}

impl<P: Platform> std::ops::Deref for ViGuard<'_, P> {
    type Target = Vi;
    fn deref(&self) -> &Vi {
        self.data.as_ref().expect("held")
    }
}

impl<P: Platform> std::ops::DerefMut for ViGuard<'_, P> {
    fn deref_mut(&mut self) -> &mut Vi {
        self.data.as_mut().expect("held")
    }
}

impl<P: Platform> Drop for ViGuard<'_, P> {
    fn drop(&mut self) {
        self.data = None;
        self.p.unlock();
    }
}

fn lock<T>(m: &Mutex<T>) -> MutexGuard<'_, T> {
    m.lock().unwrap_or_else(|e| e.into_inner())
}

/// A frame read: the code and the frame after `headroom` zero bytes (empty without one).
pub type ReadResult = (Vec<u8>, i32);

impl<P: Platform> Engine<P> {
    pub fn new(p: P) -> Arc<Self> {
        let s = Shared::default();
        s.vi_width.store(DEFAULT_WIDTH, Relaxed);
        s.vi_height.store(DEFAULT_HEIGHT, Relaxed);
        s.h264_fps.store(DEFAULT_H264_FPS, Relaxed);
        Arc::new(Engine {
            p,
            s,
            vi: Mutex::new(Vi {
                vpss_width: DEFAULT_WIDTH,
                vpss_height: DEFAULT_HEIGHT,
                venc_type: VENC_MJPEG,
                reinit: true,
                auto_res: None,
                frame_undetect_count: 0,
                sample: vec![0; FRAME_SAMPLE_SIZE],
                sample_raw_size: 0,
                h264: H264::default(),
            }),
            life: Mutex::new(Life {
                state: Lifecycle::Stopped,
                detection: None,
                watchdog: None,
            }),
            signal: Mutex::new(()),
            hdmi_reset: Mutex::new(None),
            last_csi: LastCsi::default(),
        })
    }

    pub fn platform(&self) -> &P {
        &self.p
    }

    fn vi_lock(&self, deadline_ms: Option<u64>) -> Option<ViGuard<'_, P>> {
        if !self.p.lock(deadline_ms) {
            return None;
        }
        Some(ViGuard {
            p: &self.p,
            data: Some(lock(&self.vi)),
        })
    }

    // ---- HDMI signal state -----------------------------------------------------------

    fn write_hdmi_signal_file(&self, active: bool) {
        let data: &[u8] = if active { b"1\n" } else { b"0\n" };
        if !self.p.write_atomic(HDMI_SIGNAL_FILE, data) {
            tracing::debug!("failed to publish the HDMI state file");
        }
    }

    fn set_hdmi_signal_state(&self, active: bool) {
        let _g = lock(&self.signal);
        let next = self.s.capture_enabled.load(Acquire) && active;
        if self.s.signal_active.swap(next, AcqRel) != next {
            self.write_hdmi_signal_file(next);
        }
    }

    fn set_hdmi_capture_enabled(&self, enabled: bool) {
        let _g = lock(&self.signal);
        self.s.capture_enabled.store(enabled, Release);
        // Re-enabling keeps the last known cable state instead of 0 until the next VI check.
        let active = enabled && self.s.cable_present.load(Acquire);
        self.s.signal_active.store(active, Release);
        self.write_hdmi_signal_file(active);
    }

    pub(super) fn set_hdmi_detection_state(&self, active: bool) {
        self.s.cable_present.store(active, Release);
        self.set_hdmi_signal_state(active);
    }

    /// Whether capture is enabled and a signal is present.
    pub fn hdmi_signal_active(&self) -> bool {
        self.s.capture_enabled.load(Acquire) && self.s.signal_active.load(Acquire)
    }

    // ---- camera restarts from the detection thread ------------------------------------

    pub(super) fn restart_camera_from_worker(&self) -> bool {
        if self.s.stop_threads.load(Acquire) {
            return false;
        }
        let Some(mut vi) = self.vi_lock(None) else {
            return false;
        };
        if self.s.cam.load(Acquire) && !self.s.stop_threads.load(Acquire) {
            self.p.cam_restart(DEFAULT_WIDTH, DEFAULT_HEIGHT);
            // The restart resets the output size; the next read applies the requested one
            vi.vpss_width = DEFAULT_WIDTH;
            vi.vpss_height = DEFAULT_HEIGHT;
            vi.auto_res = None;
            return true;
        }
        false
    }

    // ---- lifecycle -----------------------------------------------------------------

    fn open_camera(&self) -> bool {
        let cam = self.p.cam_create(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        self.s.cam.store(cam, Release);
        if !cam {
            tracing::warn!("media init failed; running without video");
            if self.p.mmf_is_init() {
                self.p.mmf_deinit(true);
            }
        }
        cam
    }

    /// Opens the camera and starts the detection and watchdog threads.
    pub fn init(self: &Arc<Self>) {
        let mut life = lock(&self.life);
        if life.state != Lifecycle::Stopped {
            return;
        }
        self.s.stop_threads.store(false, Release);
        life.detection = None;
        life.watchdog = None;
        if !self.s.cam.load(Acquire) && !self.open_camera() {
            life.state = Lifecycle::Running;
            return;
        }
        if let Some(_vi) = self.vi_lock(None) {
            self.p.cam_mirror_flip();
        }
        let engine = Arc::clone(self);
        life.detection = self.p.spawn(
            "hdmi-detect",
            Box::new(move || engine.vi_subsystem_detection()),
        );
        if life.detection.is_none() {
            tracing::warn!("hdmi detection thread not started");
        }
        let engine = Arc::clone(self);
        life.watchdog = self
            .p
            .spawn("capture-watchdog", Box::new(move || engine.watchdog_feed()));
        if life.watchdog.is_none() {
            tracing::warn!("capture watchdog thread not started");
        }
        life.state = Lifecycle::Running;
    }

    /// Stops the threads (2 s at most) and releases the media stack.
    pub fn deinit(&self) {
        let (detection, watchdog) = {
            let mut life = lock(&self.life);
            if life.state != Lifecycle::Running {
                return;
            }
            life.state = Lifecycle::Stopping;
            self.s.stop_threads.store(true, Release);
            (life.detection, life.watchdog)
        };
        let deadline = self.p.now_ms() + DEINIT_JOIN_MS;
        let detection_stopped = detection.is_none_or(|t| self.p.join(t, deadline));
        let watchdog_stopped = watchdog.is_none_or(|t| self.p.join(t, deadline));

        let mut life = lock(&self.life);
        if detection_stopped {
            life.detection = None;
        }
        if watchdog_stopped {
            life.watchdog = None;
        }
        if !detection_stopped || !watchdog_stopped {
            tracing::warn!("capture threads did not stop; leaving the media stack up");
            return;
        }
        self.set_hdmi_capture_enabled(false);
        if let Some(_vi) = self.vi_lock(None) {
            if self.s.cam.load(Acquire) {
                self.p.cam_close();
            }
            // Release the whole vendor stack, not one reference.
            self.p.mmf_deinit(true);
        }
        life.state = Lifecycle::Stopped;
    }

    // ---- HDMI control ----------------------------------------------------------------

    /// Turns capture on or off; on PCIe also drives the bridge's reset line. 255 on boards
    /// without one, as the C API's (uint8_t)-1.
    pub fn hdmi_control(&self, en: bool) -> u8 {
        if !en {
            self.set_hdmi_capture_enabled(false);
        }
        if self.s.hw_version.load(Acquire) == 0 && self.p.exists(HW_FILE) {
            let Some(data) = self.p.read(HW_FILE, 1) else {
                return 255;
            };
            let v = match data.first() {
                Some(&c @ (b'a' | b'b' | b'p')) => c,
                _ => b'a',
            };
            self.s.hw_version.store(v, Release);
        }
        if self.s.hw_version.load(Acquire) != b'p' {
            if en {
                self.set_hdmi_capture_enabled(true);
            }
            return 255;
        }
        // Held for the process lifetime and claimed out of reset, as kvmhwd used to leave it
        let line = {
            let mut slot = lock(&self.hdmi_reset);
            if slot.is_none() {
                *slot = self.p.gpio_claim("hdmi-reset", "libkvm", true);
                if slot.is_none() {
                    tracing::debug!("hdmi-reset GPIO unavailable");
                }
            }
            *slot
        };
        if !en {
            self.s.hdmi_stop.store(true, Release);
            while self.s.hdmi_reading.load(Acquire) {
                self.p.sleep_ms(10);
            }
            if let Some(line) = line {
                self.p.gpio_set(line, false);
            }
        } else {
            self.s.hdmi_stop.store(false, Release);
            if let Some(line) = line {
                self.p.gpio_set(line, true);
            }
            self.set_hdmi_capture_enabled(true);
            // Keep the VI channel and drop the frames queued while idle.
            self.s
                .fresh_frames
                .store(FRESH_FRAME_DISCARD_COUNT, Release);
        }
        0
    }

    // ---- reads -------------------------------------------------------------------------

    pub fn set_h264_fps(&self, fps: u8) {
        self.s.h264_fps.store(fps.clamp(1, 60), Relaxed);
    }

    /// Asks for an IDR; the read path issues it, at most one per 500 ms.
    pub fn request_keyframe(&self) {
        self.s.keyframe_requested.store(true, Relaxed);
    }

    pub fn set_frame_detect(&self, frames: u8) {
        self.s.frame_detect.store(frames.min(100), Relaxed);
        self.s.stream_stop.store(false, Relaxed);
    }

    fn issue_requested_keyframe(&self, vi: &mut Vi) {
        if !self.s.keyframe_requested.load(Relaxed) {
            return;
        }
        let now = self.p.now_ms();
        if now.saturating_sub(vi.h264.last_requested_idr_ms) < H264_IDR_MIN_GAP_MS {
            return;
        }
        if !self.s.keyframe_requested.swap(false, Relaxed) {
            return;
        }
        vi.h264.last_requested_idr_ms = now;
        if self.p.venc_request_idr(DEFAULT_VENC_CHN) {
            tracing::debug!("requested h264 IDR");
        }
    }

    fn init_venc_h264(&self, vi: &mut Vi, w: u16, h: u16, bitrate: u16, fps: u32) {
        let gop = fps * H264_IDR_SECONDS;
        vi.h264 = H264 {
            init: false,
            w,
            h,
            gop,
            fps,
            bitrate: bitrate.into(),
            last_requested_idr_ms: vi.h264.last_requested_idr_ms,
        };
        self.p.venc_del(DEFAULT_VENC_CHN);
        if !self
            .p
            .venc_add(DEFAULT_VENC_CHN, w, h, gop, fps, bitrate.into())
        {
            tracing::warn!("h264 encoder init failed");
            return;
        }
        vi.h264.init = true;
        // A new channel starts with an IDR, which answers any pending request.
        self.s.keyframe_requested.store(false, Relaxed);
        vi.h264.last_requested_idr_ms = self.p.now_ms();
    }

    fn raw_to_h264(
        &self,
        vi: &mut Vi,
        frame: (u16, u16),
        bitrate: u16,
        out: &mut Vec<u8>,
        headroom: usize,
    ) -> i32 {
        let fps = u32::from(self.s.h264_fps.load(Relaxed));
        let (w, h) = frame;
        let c = &vi.h264;
        if !c.init
            || w != c.w
            || h != c.h
            || u32::from(bitrate) != c.bitrate
            || fps != c.fps
            || fps * H264_IDR_SECONDS != c.gop
        {
            self.init_venc_h264(vi, w, h, bitrate, fps);
        }
        self.issue_requested_keyframe(vi);
        if !self.p.frame_venc_push(DEFAULT_VENC_CHN) {
            self.p.venc_del(DEFAULT_VENC_CHN);
            vi.h264.init = false;
            return -1;
        }
        let mut ret = IMG_VENC_ERROR;
        if !self.p.venc_pop(DEFAULT_VENC_CHN, &mut |packs| {
            ret = h264_stream_dump(packs, out, headroom);
        }) {
            self.p.venc_free(DEFAULT_VENC_CHN);
            self.p.venc_del(DEFAULT_VENC_CHN);
            vi.h264.init = false;
            return -1;
        }
        self.p.venc_free(DEFAULT_VENC_CHN);
        ret
    }

    fn frame_changed(&self, vi: &mut Vi, size: usize) -> bool {
        let mut changed = false;
        let Vi {
            sample,
            sample_raw_size,
            ..
        } = vi;
        self.p.frame_pixels(&mut |pixels| {
            let Some(raw) = pixels.filter(|_| size != 0) else {
                changed = true;
                return;
            };
            if size != *sample_raw_size {
                *sample_raw_size = size;
                changed = true;
            }
            let count = size.min(FRAME_SAMPLE_SIZE);
            let interval = size / count;
            for (i, slot) in sample.iter_mut().take(count).enumerate() {
                let offset = (i * interval).min(size - 1);
                let byte = raw.get(offset).copied().unwrap_or(0);
                if byte != *slot {
                    *slot = byte;
                    changed = true;
                }
            }
        });
        changed
    }

    /// Takes one frame of the discard count; false when none is left.
    fn take_fresh_frame(&self) -> bool {
        let mut n = self.s.fresh_frames.load(Acquire);
        while n != 0 {
            match self
                .s
                .fresh_frames
                .compare_exchange_weak(n, n - 1, AcqRel, Acquire)
            {
                Ok(_) => return true,
                Err(now) => n = now,
            }
        }
        false
    }

    fn check_kvmv(&self, vi: &mut Vi, try_num: u8) -> bool {
        if !self.s.cable_present.load(Acquire) || try_num >= MAX_TRY_NUM {
            return false;
        }
        if self.s.reopen_cam.load(Relaxed) && self.s.cam.load(Acquire) {
            // The input size changed
            self.s.reopen_cam.store(false, Relaxed);
            self.p.cam_restart(DEFAULT_WIDTH, DEFAULT_HEIGHT);
            vi.vpss_width = DEFAULT_WIDTH;
            vi.vpss_height = DEFAULT_HEIGHT;
            vi.auto_res = None;
        }
        true
    }

    /// One encoded frame at `width` x `height` (0 x 0: the input size). `kind` 0 is MJPEG
    /// with `quality` 51-99, 1 H.264 with `quality` the bitrate. The frame goes after
    /// `headroom` zero bytes. Codes as libkvm's kvmv_read_img_alloc.
    pub fn read_img(
        &self,
        width: u16,
        height: u16,
        kind: u8,
        quality: u16,
        headroom: usize,
    ) -> ReadResult {
        let mut out = Vec::new();
        let code = self.read_img_into(width, height, kind, quality, &mut out, headroom);
        if out.len() <= headroom {
            out.clear();
        }
        (out, code)
    }

    fn read_img_into(
        &self,
        width: u16,
        height: u16,
        kind: u8,
        quality: u16,
        out: &mut Vec<u8>,
        headroom: usize,
    ) -> i32 {
        if !self.s.cam.load(Acquire) {
            return -1;
        }
        let deadline = self.p.now_ms() + READ_LOCK_MS;
        let Some(mut vi) = self.vi_lock(Some(deadline)) else {
            return -5;
        };
        if self.s.res_err.load(Relaxed) == ERROR_RES {
            return -7;
        }
        if self.s.res_type.load(Relaxed) == UNSUPPORT_RES {
            return -6;
        }
        if self.s.detect_state.load(Relaxed) == 1 {
            return -4;
        }
        let mut try_num = 0;
        loop {
            if let Some(code) = self.read_once(&mut vi, width, height, kind, quality, out, headroom)
            {
                return code;
            }
            let more = self.check_kvmv(&mut vi, try_num);
            try_num += 1;
            if !more {
                return IMG_NOT_EXIST;
            }
        }
    }

    /// One pass of the read loop; None goes on to the retry check.
    #[allow(clippy::too_many_arguments)]
    fn read_once(
        &self,
        vi: &mut Vi,
        width: u16,
        height: u16,
        kind: u8,
        quality: u16,
        out: &mut Vec<u8>,
        headroom: usize,
    ) -> Option<i32> {
        if vi.vpss_width != width || vi.vpss_height != height {
            if width == 0 || height == 0 {
                // Follow the HDMI input
                vi.vpss_width = self.s.vi_width.load(Relaxed);
                vi.vpss_height = self.s.vi_height.load(Relaxed);
                let input = (vi.vpss_width, vi.vpss_height);
                if vi.auto_res != Some(input) {
                    vi.auto_res = Some(input);
                    self.p.cam_set_size(input.0, input.1);
                    vi.reinit = true;
                }
            } else {
                vi.auto_res = None;
                vi.vpss_width = width;
                vi.vpss_height = height;
                self.p.cam_set_size(width, height);
                vi.reinit = true;
            }
        }
        if vi.reinit {
            self.p.cam_mirror_flip();
            vi.reinit = false;
        }
        let (mut fw, mut fh, mut size) = self.p.frame_read()?;
        // Drop the frames queued while HDMI was idle, all in this read: each used to cost
        // one of its two retries, so the first read after re-enabling failed.
        while self.take_fresh_frame() {
            self.p.frame_release();
            (fw, fh, size) = self.p.frame_read()?;
        }
        let detect = self.s.frame_detect.load(Relaxed);
        if kind == VENC_MJPEG && detect != 0 {
            if !self.s.stream_stop.load(Relaxed) {
                vi.frame_undetect_count = vi.frame_undetect_count.wrapping_add(1);
            } else {
                vi.frame_undetect_count = detect;
            }
            if vi.frame_undetect_count == detect {
                vi.frame_undetect_count = 0;
                if !self.frame_changed(vi, size) {
                    self.s.stream_stop.store(true, Relaxed);
                    self.p.frame_release();
                    return Some(5);
                }
                self.s.stream_stop.store(false, Relaxed);
            }
        }

        // The H.264 channel lives on through MJPEG; coming back, a decoder needs an IDR.
        if kind == VENC_H264 && vi.venc_type != VENC_H264 {
            self.s.keyframe_requested.store(true, Relaxed);
        }
        vi.venc_type = kind;
        if kind == VENC_MJPEG {
            let q = quality.clamp(51, 99) as u8;
            let encoded = self.p.frame_jpeg(q, out, headroom);
            self.p.frame_release();
            return Some(if encoded.is_some() {
                IMG_MJPEG_TYPE
            } else {
                out.clear();
                IMG_VENC_ERROR
            });
        }
        if kind == VENC_H264 {
            let ret = self.raw_to_h264(vi, (fw, fh), quality.clamp(500, 10000), out, headroom);
            self.p.frame_release();
            if ret < 0 {
                out.clear();
            }
            return Some(ret);
        }
        // Neither encoder: retry, as the C++ falls through to its loop condition.
        None
    }
}

/// Packs into `out` after `headroom` zero bytes: SPS + PPS + I (3 packs) or P (1 pack).
fn h264_stream_dump(packs: &[&[u8]], out: &mut Vec<u8>, headroom: usize) -> i32 {
    let ret = match packs.len() {
        3 => IMG_H264_TYPE_IF,
        1 => IMG_H264_TYPE_PF,
        _ => return IMG_VENC_ERROR,
    };
    let mut total: usize = 0;
    for p in packs {
        if p.is_empty() || total > u32::MAX as usize - p.len() {
            return IMG_VENC_ERROR;
        }
        total += p.len();
    }
    if out.try_reserve_exact(headroom + total).is_err() {
        return IMG_VENC_ERROR;
    }
    out.clear();
    out.resize(headroom, 0);
    for p in packs {
        out.extend_from_slice(p);
    }
    ret
}
