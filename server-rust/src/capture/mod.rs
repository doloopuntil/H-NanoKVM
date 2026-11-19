//! HDMI capture: the LT6911 bridge, input detection, the frame reads, the camera and the
//! encoders, ported from libkvm's C++. The media pipeline below them is libkvm_mmf (`ffi::mmf`).

mod bridge;
mod detect;
mod device;
mod engine;
pub mod media;
pub mod platform;

use std::{
    path::Path,
    sync::{Arc, LazyLock, Mutex},
    thread,
    time::Duration,
};

pub use engine::{Engine, ReadResult};
pub use platform::{Command, GpioHandle, Platform, ThreadHandle, ViState};

use crate::{AppError, Result, ffi::mmf};
use device::Device;

pub const HDMI_DISABLE_FILE: &str = "/etc/kvm/hdmi_disable";

/// The engine, with a lock that serialises the API calls as the C API required.
struct Capture {
    engine: Arc<Engine<Device>>,
    calls: Mutex<()>,
}

static CAPTURE: LazyLock<std::result::Result<Capture, String>> = LazyLock::new(load);

fn load() -> std::result::Result<Capture, String> {
    if !mmf::LINKED {
        return Err("libkvm_mmf is linked only into the device build".to_string());
    }
    let engine = Engine::new(Device::new());
    engine.init();
    // Reset the bridge, then enable capture unless it was turned off.
    engine.hdmi_control(false);
    thread::sleep(Duration::from_millis(10));
    if !Path::new(HDMI_DISABLE_FILE).exists() {
        engine.hdmi_control(true);
    }
    Ok(Capture {
        engine,
        calls: Mutex::new(()),
    })
}

fn capture() -> Result<&'static Capture> {
    CAPTURE
        .as_ref()
        .map_err(|err| AppError::Internal(format!("failed to initialize capture: {err}")))
}

fn with<T>(f: impl FnOnce(&Engine<Device>) -> T) -> Result<T> {
    let c = capture()?;
    let _calls = c
        .calls
        .lock()
        .map_err(|_| AppError::Internal("capture lock poisoned".to_string()))?;
    Ok(f(&c.engine))
}

/// Opens the camera and starts detection; call once from inside the Tokio runtime.
pub fn init() -> Result<()> {
    capture().map(drop)
}

pub fn read_mjpeg(width: u16, height: u16, quality: u16) -> Result<ReadResult> {
    with(|e| e.read_img(width, height, 0, quality, 0))
}

/// The encoder is rebuilt when `fps` differs from the running channel's. A frame starts with
/// `headroom` zero bytes for the caller's header.
pub fn read_h264(
    width: u16,
    height: u16,
    fps: u8,
    bit_rate: u16,
    headroom: usize,
) -> Result<ReadResult> {
    with(|e| {
        e.set_h264_fps(fps);
        e.read_img(width, height, 1, bit_rate, headroom)
    })
}

pub fn set_frame_detect(frames: u8) -> Result<()> {
    with(|e| e.set_frame_detect(frames))
}

pub fn set_hdmi(enabled: bool) -> Result<u8> {
    with(|e| e.hdmi_control(enabled))
}

/// Asks for an IDR on the next H.264 frame; does not wait for a read in progress.
pub fn request_keyframe() {
    if let Ok(c) = capture() {
        c.engine.request_keyframe();
    }
}

/// Whether capture is enabled and a signal is present; does not wait for a read.
pub fn hdmi_signal_active() -> bool {
    capture().is_ok_and(|c| c.engine.hdmi_signal_active())
}

/// Stops detection and releases the media stack. Blocks up to about 2 s.
pub fn shutdown() -> Result<()> {
    with(|e| e.deinit())
}
