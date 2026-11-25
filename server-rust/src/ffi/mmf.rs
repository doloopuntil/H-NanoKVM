//! libkvm_mmf's C API (support/sg2002/additional/kvm_mmf/include/kvm_mmf.hpp), linked only
//! into the device build; elsewhere every call fails. `capture::media` drives it.

use crate::capture::media::{Mmf, Stream, VencCfg, ViFrame};

/// Whether libkvm_mmf is linked into this build.
pub const LINKED: bool = cfg!(all(target_arch = "riscv64", feature = "linked-libkvm"));

/// libkvm_mmf as the `Mmf` the capture module uses.
pub struct LinkedMmf;

#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
mod linked {
    use std::os::raw::{c_int, c_void};

    use crate::capture::media::{Stream, VencCfg};

    #[link(name = "kvm_mmf")]
    unsafe extern "C" {
        pub fn mmf_init() -> c_int;
        pub fn mmf_try_deinit(force: bool) -> c_int;
        pub fn mmf_is_init() -> bool;
        pub fn mmf_get_vi_unused_channel() -> c_int;
        pub fn mmf_vi_init() -> c_int;
        pub fn mmf_vi_deinit() -> c_int;
        pub fn mmf_add_vi_channel(ch: c_int, w: c_int, h: c_int, fmt: c_int) -> c_int;
        pub fn mmf_del_vi_channel(ch: c_int) -> c_int;
        pub fn mmf_vi_chn_is_open(ch: c_int) -> bool;
        pub fn mmf_vi_aligned_width(ch: c_int) -> c_int;
        pub fn mmf_set_vi_hmirror(ch: c_int, en: bool);
        pub fn mmf_set_vi_vflip(ch: c_int, en: bool);
        pub fn mmf_vi_frame_pop(
            ch: c_int,
            len: *mut c_int,
            w: *mut c_int,
            h: *mut c_int,
            fmt: *mut c_int,
        ) -> c_int;
        pub fn mmf_vi_frame_map(ch: c_int) -> *mut c_void;
        pub fn mmf_vi_frame_free(ch: c_int);
        pub fn mmf_vi_frame_release(ch: c_int);
        pub fn mmf_invert_format_to_mmf(input_format: c_int) -> c_int;
        pub fn mmf_enc_jpg_push_with_quality(
            ch: c_int,
            data: *mut u8,
            w: c_int,
            h: c_int,
            fmt: c_int,
            quality: c_int,
        ) -> c_int;
        pub fn mmf_enc_jpg_pop(ch: c_int, data: *mut *mut u8, size: *mut c_int) -> c_int;
        pub fn mmf_enc_jpg_free(ch: c_int) -> c_int;
        pub fn mmf_add_venc_channel(ch: c_int, cfg: *mut VencCfg) -> c_int;
        pub fn mmf_del_venc_channel(ch: c_int) -> c_int;
        pub fn mmf_venc_push(ch: c_int, data: *mut u8, w: c_int, h: c_int, fmt: c_int) -> c_int;
        pub fn mmf_venc_pop(ch: c_int, stream: *mut Stream) -> c_int;
        pub fn mmf_venc_free(ch: c_int) -> c_int;
        pub fn mmf_venc_request_idr(ch: c_int) -> c_int;
    }
}

/// `MMF_INPUT_FMT_NV21`.
#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
const INPUT_FMT_NV21: i32 = 8;

// SAFETY (every call below): plain integers and booleans, or out pointers to locals that
// live for the call; libkvm_mmf keeps its own state and the capture module serialises calls.
#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
impl Mmf for LinkedMmf {
    fn init(&mut self) -> i32 {
        unsafe { linked::mmf_init() }
    }
    fn vi_init(&mut self) -> i32 {
        unsafe { linked::mmf_vi_init() }
    }
    fn vi_deinit(&mut self) -> i32 {
        unsafe { linked::mmf_vi_deinit() }
    }
    fn try_deinit(&mut self, force: bool) -> i32 {
        unsafe { linked::mmf_try_deinit(force) }
    }
    fn is_init(&mut self) -> bool {
        unsafe { linked::mmf_is_init() }
    }
    fn get_vi_unused_channel(&mut self) -> i32 {
        unsafe { linked::mmf_get_vi_unused_channel() }
    }
    fn add_vi_channel(&mut self, ch: i32, w: i32, h: i32, fmt: i32) -> i32 {
        unsafe { linked::mmf_add_vi_channel(ch, w, h, fmt) }
    }
    fn del_vi_channel(&mut self, ch: i32) -> i32 {
        unsafe { linked::mmf_del_vi_channel(ch) }
    }
    fn vi_chn_is_open(&mut self, ch: i32) -> bool {
        unsafe { linked::mmf_vi_chn_is_open(ch) }
    }
    fn vi_aligned_width(&mut self, ch: i32) -> i32 {
        unsafe { linked::mmf_vi_aligned_width(ch) }
    }
    fn set_vi_hmirror(&mut self, ch: i32, en: bool) {
        unsafe { linked::mmf_set_vi_hmirror(ch, en) }
    }
    fn set_vi_vflip(&mut self, ch: i32, en: bool) {
        unsafe { linked::mmf_set_vi_vflip(ch, en) }
    }
    fn vi_frame_pop(&mut self, ch: i32) -> Result<ViFrame, i32> {
        let (mut len, mut width, mut height, mut format) = (0, 0, 0, 0);
        let rc =
            unsafe { linked::mmf_vi_frame_pop(ch, &mut len, &mut width, &mut height, &mut format) };
        if rc != 0 {
            return Err(rc);
        }
        Ok(ViFrame {
            len,
            width,
            height,
            format,
        })
    }
    fn vi_frame_map(&mut self, ch: i32) -> *const u8 {
        unsafe { linked::mmf_vi_frame_map(ch) }.cast_const().cast()
    }
    fn vi_frame_free(&mut self, ch: i32) {
        unsafe { linked::mmf_vi_frame_free(ch) }
    }
    fn vi_frame_release(&mut self, ch: i32) {
        unsafe { linked::mmf_vi_frame_release(ch) }
    }
    fn nv21_format(&mut self) -> i32 {
        unsafe { linked::mmf_invert_format_to_mmf(INPUT_FMT_NV21) }
    }
    unsafe fn enc_jpg_push(
        &mut self,
        ch: i32,
        data: *mut u8,
        w: i32,
        h: i32,
        fmt: i32,
        q: i32,
    ) -> i32 {
        // SAFETY: the caller's contract.
        unsafe { linked::mmf_enc_jpg_push_with_quality(ch, data, w, h, fmt, q) }
    }
    fn enc_jpg_pop(&mut self, ch: i32) -> Result<(*const u8, i32), i32> {
        let mut data = std::ptr::null_mut();
        let mut size = 0;
        let rc = unsafe { linked::mmf_enc_jpg_pop(ch, &mut data, &mut size) };
        if rc != 0 {
            return Err(rc);
        }
        Ok((data.cast_const(), size))
    }
    fn enc_jpg_free(&mut self, ch: i32) -> i32 {
        unsafe { linked::mmf_enc_jpg_free(ch) }
    }
    fn add_venc_channel(&mut self, ch: i32, cfg: &VencCfg) -> i32 {
        let mut cfg = *cfg;
        unsafe { linked::mmf_add_venc_channel(ch, &mut cfg) }
    }
    fn del_venc_channel(&mut self, ch: i32) -> i32 {
        unsafe { linked::mmf_del_venc_channel(ch) }
    }
    unsafe fn venc_push(&mut self, ch: i32, data: *mut u8, w: i32, h: i32, fmt: i32) -> i32 {
        // SAFETY: the caller's contract.
        unsafe { linked::mmf_venc_push(ch, data, w, h, fmt) }
    }
    fn venc_pop(&mut self, ch: i32) -> Result<Stream, i32> {
        let mut stream = Stream::default();
        let rc = unsafe { linked::mmf_venc_pop(ch, &mut stream) };
        if rc != 0 {
            return Err(rc);
        }
        Ok(stream)
    }
    fn venc_free(&mut self, ch: i32) -> i32 {
        unsafe { linked::mmf_venc_free(ch) }
    }
    fn venc_request_idr(&mut self, ch: i32) -> i32 {
        unsafe { linked::mmf_venc_request_idr(ch) }
    }
}

/// Host builds and tests have no capture: every call fails.
#[cfg(not(all(target_arch = "riscv64", feature = "linked-libkvm")))]
impl Mmf for LinkedMmf {
    fn init(&mut self) -> i32 {
        -1
    }
    fn vi_init(&mut self) -> i32 {
        -1
    }
    fn vi_deinit(&mut self) -> i32 {
        -1
    }
    fn try_deinit(&mut self, _: bool) -> i32 {
        -1
    }
    fn is_init(&mut self) -> bool {
        false
    }
    fn get_vi_unused_channel(&mut self) -> i32 {
        -1
    }
    fn add_vi_channel(&mut self, _: i32, _: i32, _: i32, _: i32) -> i32 {
        -1
    }
    fn del_vi_channel(&mut self, _: i32) -> i32 {
        -1
    }
    fn vi_chn_is_open(&mut self, _: i32) -> bool {
        false
    }
    fn vi_aligned_width(&mut self, _: i32) -> i32 {
        0
    }
    fn set_vi_hmirror(&mut self, _: i32, _: bool) {}
    fn set_vi_vflip(&mut self, _: i32, _: bool) {}
    fn vi_frame_pop(&mut self, _: i32) -> Result<ViFrame, i32> {
        Err(-1)
    }
    fn vi_frame_map(&mut self, _: i32) -> *const u8 {
        std::ptr::null()
    }
    fn vi_frame_free(&mut self, _: i32) {}
    fn vi_frame_release(&mut self, _: i32) {}
    fn nv21_format(&mut self) -> i32 {
        -1
    }
    unsafe fn enc_jpg_push(&mut self, _: i32, _: *mut u8, _: i32, _: i32, _: i32, _: i32) -> i32 {
        -1
    }
    fn enc_jpg_pop(&mut self, _: i32) -> Result<(*const u8, i32), i32> {
        Err(-1)
    }
    fn enc_jpg_free(&mut self, _: i32) -> i32 {
        -1
    }
    fn add_venc_channel(&mut self, _: i32, _: &VencCfg) -> i32 {
        -1
    }
    fn del_venc_channel(&mut self, _: i32) -> i32 {
        -1
    }
    unsafe fn venc_push(&mut self, _: i32, _: *mut u8, _: i32, _: i32, _: i32) -> i32 {
        -1
    }
    fn venc_pop(&mut self, _: i32) -> Result<Stream, i32> {
        Err(-1)
    }
    fn venc_free(&mut self, _: i32) -> i32 {
        -1
    }
    fn venc_request_idr(&mut self, _: i32) -> i32 {
        -1
    }
}
