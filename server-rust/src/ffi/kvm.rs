use std::sync::{LazyLock, Mutex};
#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
use std::{os::raw::c_void, path::Path, thread, time::Duration};

use crate::{AppError, Result};

pub const HDMI_DISABLE_FILE: &str = "/etc/kvm/hdmi_disable";

static VISION: LazyLock<std::result::Result<Mutex<KvmVision>, String>> = LazyLock::new(|| {
    KvmVision::load()
        .map(Mutex::new)
        .map_err(|err| err.to_string())
});

pub fn read_mjpeg(width: u16, height: u16, quality: u16) -> Result<(Vec<u8>, i32)> {
    vision()?
        .lock()
        .map_err(lock_error)?
        .read_img(width, height, 0, quality, 0)
}

/// libkvm rebuilds the encoder when `fps` differs from the running channel's. A frame starts with
/// `headroom` zero bytes for the caller's header.
pub fn read_h264(
    width: u16,
    height: u16,
    fps: u8,
    bit_rate: u16,
    headroom: usize,
) -> Result<(Vec<u8>, i32)> {
    let mut vision = vision()?.lock().map_err(lock_error)?;
    vision.set_h264_fps(fps);
    vision.read_img(width, height, 1, bit_rate, headroom)
}

pub fn set_frame_detect(frame: u8) -> Result<()> {
    vision()?
        .lock()
        .map_err(lock_error)?
        .set_frame_detect(frame);
    Ok(())
}

pub fn set_hdmi(enabled: bool) -> Result<u8> {
    Ok(vision()?.lock().map_err(lock_error)?.set_hdmi(enabled))
}

/// Asks libkvm for an IDR on the next H.264 frame. Only sets a flag in libkvm,
/// so it does not wait for the vision lock that frame reads hold.
pub fn request_keyframe() {
    request_keyframe_impl();
}

/// Whether HDMI capture is enabled and a signal is present. Reads libkvm's
/// atomic state without taking the vision lock, which frame reads hold.
pub fn hdmi_signal_active() -> bool {
    hdmi_signal_active_impl()
}

pub fn init() -> Result<()> {
    let _ = vision()?;
    Ok(())
}

pub fn shutdown() -> Result<()> {
    vision()?.lock().map_err(lock_error)?.shutdown();
    Ok(())
}

fn vision() -> Result<&'static Mutex<KvmVision>> {
    VISION
        .as_ref()
        .map_err(|err| AppError::Internal(format!("failed to initialize libkvm: {err}")))
}

fn lock_error<T>(_: T) -> AppError {
    AppError::Internal("libkvm lock poisoned".to_string())
}

#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
#[link(name = "kvm")]
unsafe extern "C" {
    fn kvmv_init(debug_info_en: u8);
    fn kvmv_read_img_alloc(
        width: u16,
        height: u16,
        kind: u8,
        quality_or_rate: u16,
        alloc: unsafe extern "C" fn(ctx: *mut c_void, size: u32) -> *mut u8,
        ctx: *mut c_void,
        data_size: *mut u32,
    ) -> i32;
    #[link_name = "set_frame_detact"]
    fn kvm_set_frame_detect(frame: u8);
    fn kvmv_deinit();
    fn kvmv_hdmi_control(enabled: u8) -> u8;
    fn kvmv_hdmi_signal_active() -> u8;
    fn kvmv_set_h264_fps(fps: u8);
    fn kvmv_request_keyframe();
}

#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
fn hdmi_signal_active_impl() -> bool {
    // SAFETY: Reads atomic state; matches server-rust/native/include/kvm_vision.h.
    unsafe { kvmv_hdmi_signal_active() != 0 }
}

#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
fn request_keyframe_impl() {
    // SAFETY: Stores an atomic flag; matches server-rust/native/include/kvm_vision.h.
    unsafe { kvmv_request_keyframe() }
}

#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
struct KvmVision {
    deinitialized: bool,
}

#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
impl KvmVision {
    fn load() -> Result<Self> {
        // SAFETY: Initializes libkvm with logging disabled, matching Go backend.
        unsafe {
            kvmv_init(0);
        }
        let vision = Self {
            deinitialized: false,
        };
        vision.initialize_hdmi();
        Ok(vision)
    }

    fn shutdown(&mut self) {
        if self.deinitialized {
            return;
        }
        // SAFETY: Deinitializes the libkvm singleton once before process exit.
        unsafe {
            kvmv_deinit();
        }
        self.deinitialized = true;
    }

    fn initialize_hdmi(&self) {
        let disabled = Path::new(HDMI_DISABLE_FILE).exists();

        // SAFETY: Mirrors Go backend startup: reset HDMI, wait briefly, then
        // re-enable it unless the persisted disable flag is present.
        unsafe {
            kvmv_hdmi_control(0);
        }
        thread::sleep(Duration::from_millis(10));
        if !disabled {
            // SAFETY: libkvm accepts 0/1 for HDMI state.
            unsafe {
                kvmv_hdmi_control(1);
            }
        }
    }

    fn set_frame_detect(&self, frame: u8) {
        // SAFETY: Direct binding matches server-rust/native/include/kvm_vision.h.
        unsafe {
            kvm_set_frame_detect(frame);
        }
    }

    fn set_h264_fps(&self, fps: u8) {
        // SAFETY: Direct binding matches server-rust/native/include/kvm_vision.h.
        unsafe {
            kvmv_set_h264_fps(fps);
        }
    }

    fn set_hdmi(&self, enabled: bool) -> u8 {
        // SAFETY: libkvm accepts 0/1 for HDMI state.
        unsafe { kvmv_hdmi_control(u8::from(enabled)) }
    }

    fn read_img(
        &mut self,
        width: u16,
        height: u16,
        kind: u8,
        quality_or_rate: u16,
        headroom: usize,
    ) -> Result<(Vec<u8>, i32)> {
        let mut out = FrameOut {
            data: Vec::new(),
            headroom,
            given: None,
        };
        let mut len: u32 = 0;
        // SAFETY: alloc_frame matches kvmv_alloc_fn; libkvm calls it at most once, during this
        // call, with ctx = &mut out, and writes `size` bytes into what it returns.
        let result = unsafe {
            kvmv_read_img_alloc(
                width,
                height,
                kind,
                quality_or_rate,
                alloc_frame,
                (&raw mut out).cast(),
                &mut len,
            )
        };
        let mut data = out.data;
        if result >= 0 && len > 0 && out.given == Some(len as usize) {
            // SAFETY: alloc_frame reserved headroom + len bytes and zeroed the headroom; libkvm
            // copied the len-byte frame after it before returning.
            unsafe { data.set_len(headroom + len as usize) };
        } else {
            data = Vec::new();
        }
        Ok((data, result))
    }
}

/// Where libkvm copies a frame: `headroom` zero bytes for the caller's header, then the frame.
#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
struct FrameOut {
    data: Vec<u8>,
    headroom: usize,
    given: Option<usize>,
}

/// kvmv_alloc_fn: memory for a `size`-byte frame after the headroom, or null to drop it.
#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
unsafe extern "C" fn alloc_frame(ctx: *mut c_void, size: u32) -> *mut u8 {
    // SAFETY: ctx is the FrameOut that read_img passes for the duration of the call.
    let out = unsafe { &mut *ctx.cast::<FrameOut>() };
    let size = size as usize;
    if out.given.is_some() || out.data.try_reserve_exact(out.headroom + size).is_err() {
        return std::ptr::null_mut();
    }
    out.data.resize(out.headroom, 0);
    out.given = Some(size);
    // SAFETY: the capacity covers headroom + size bytes.
    unsafe { out.data.as_mut_ptr().add(out.headroom) }
}

#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
impl Drop for KvmVision {
    fn drop(&mut self) {
        self.shutdown();
    }
}

/// Host builds and tests have no capture: libkvm is linked only into the device build.
#[cfg(not(all(target_arch = "riscv64", feature = "linked-libkvm")))]
struct KvmVision;

#[cfg(not(all(target_arch = "riscv64", feature = "linked-libkvm")))]
impl KvmVision {
    fn load() -> Result<Self> {
        Err(AppError::Internal(
            "libkvm is linked only into the device build".to_string(),
        ))
    }

    fn shutdown(&mut self) {}

    fn set_frame_detect(&self, _frame: u8) {}

    fn set_h264_fps(&self, _fps: u8) {}

    fn set_hdmi(&self, _enabled: bool) -> u8 {
        0
    }

    fn read_img(&mut self, _: u16, _: u16, _: u8, _: u16, _: usize) -> Result<(Vec<u8>, i32)> {
        Ok((Vec::new(), -1))
    }
}

#[cfg(not(all(target_arch = "riscv64", feature = "linked-libkvm")))]
fn request_keyframe_impl() {}

#[cfg(not(all(target_arch = "riscv64", feature = "linked-libkvm")))]
fn hdmi_signal_active_impl() -> bool {
    false
}
