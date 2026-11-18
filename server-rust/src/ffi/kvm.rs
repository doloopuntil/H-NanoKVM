//! libkvm's camera and encoder API (support/sg2002/additional/kvm/include/kvm_media.h).
//! Linked only into the device build; elsewhere every call fails. The capture module
//! serialises the calls.

#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
mod linked {
    use std::os::raw::{c_int, c_void};

    pub type AllocFn = unsafe extern "C" fn(ctx: *mut c_void, size: u32) -> *mut u8;

    #[link(name = "kvm")]
    unsafe extern "C" {
        pub fn kvmc_cam_create(w: c_int, h: c_int) -> c_int;
        pub fn kvmc_cam_restart(w: c_int, h: c_int);
        pub fn kvmc_cam_set_size(w: c_int, h: c_int) -> c_int;
        pub fn kvmc_cam_mirror_flip();
        pub fn kvmc_cam_close();
        pub fn kvmc_mmf_is_init() -> c_int;
        pub fn kvmc_mmf_deinit(force: c_int);
        pub fn kvmc_frame_read(w: *mut c_int, h: *mut c_int, size: *mut usize) -> c_int;
        pub fn kvmc_frame_pixels() -> *const u8;
        pub fn kvmc_frame_release();
        pub fn kvmc_frame_jpeg(
            quality: c_int,
            alloc: AllocFn,
            ctx: *mut c_void,
            size: *mut u32,
        ) -> c_int;
        pub fn kvmc_venc_add(
            ch: c_int,
            w: c_int,
            h: c_int,
            gop: c_int,
            fps: c_int,
            bitrate: c_int,
        ) -> c_int;
        pub fn kvmc_venc_del(ch: c_int) -> c_int;
        pub fn kvmc_frame_venc_push(ch: c_int) -> c_int;
        pub fn kvmc_venc_pop(
            ch: c_int,
            data: *mut *const u8,
            size: *mut c_int,
            max: c_int,
        ) -> c_int;
        pub fn kvmc_venc_free(ch: c_int) -> c_int;
        pub fn kvmc_venc_request_idr(ch: c_int) -> c_int;
    }
}

#[cfg(all(target_arch = "riscv64", feature = "linked-libkvm"))]
mod imp {
    use std::os::raw::c_void;

    use super::linked::*;

    const MAX_PACKS: usize = 8;

    pub fn cam_create(w: u16, h: u16) -> bool {
        // SAFETY: plain integers; libkvm keeps its own camera state.
        unsafe { kvmc_cam_create(w.into(), h.into()) == 0 }
    }

    pub fn cam_restart(w: u16, h: u16) {
        // SAFETY: as above.
        unsafe { kvmc_cam_restart(w.into(), h.into()) }
    }

    pub fn cam_set_size(w: u16, h: u16) -> bool {
        // SAFETY: as above.
        unsafe { kvmc_cam_set_size(w.into(), h.into()) == 0 }
    }

    pub fn cam_mirror_flip() {
        // SAFETY: no arguments.
        unsafe { kvmc_cam_mirror_flip() }
    }

    pub fn cam_close() {
        // SAFETY: no arguments.
        unsafe { kvmc_cam_close() }
    }

    pub fn mmf_is_init() -> bool {
        // SAFETY: no arguments.
        unsafe { kvmc_mmf_is_init() != 0 }
    }

    pub fn mmf_deinit(force: bool) {
        // SAFETY: an integer flag.
        unsafe { kvmc_mmf_deinit(force.into()) }
    }

    pub fn frame_read() -> Option<(u16, u16, usize)> {
        let (mut w, mut h, mut size) = (0, 0, 0);
        // SAFETY: valid out pointers for the duration of the call.
        if unsafe { kvmc_frame_read(&mut w, &mut h, &mut size) } != 0 {
            return None;
        }
        Some((w as u16, h as u16, size))
    }

    pub fn frame_pixels(size: usize, f: &mut dyn FnMut(Option<&[u8]>)) {
        // SAFETY: libkvm returns the leased frame's mapping or NULL.
        let ptr = unsafe { kvmc_frame_pixels() };
        if ptr.is_null() {
            f(None);
            return;
        }
        // SAFETY: the mapping covers the frame's `size` bytes and stays valid until the
        // frame is released, which cannot happen during this call.
        f(Some(unsafe { std::slice::from_raw_parts(ptr, size) }));
    }

    pub fn frame_release() {
        // SAFETY: no arguments.
        unsafe { kvmc_frame_release() }
    }

    struct Out<'a> {
        data: &'a mut Vec<u8>,
        headroom: usize,
        given: Option<usize>,
    }

    /// kvmc_alloc_fn: room for `size` bytes after the headroom, or null to drop the frame.
    unsafe extern "C" fn alloc_frame(ctx: *mut c_void, size: u32) -> *mut u8 {
        // SAFETY: ctx is the Out that frame_jpeg passes for the duration of the call.
        let out = unsafe { &mut *ctx.cast::<Out>() };
        let size = size as usize;
        if out.given.is_some() || out.data.try_reserve_exact(out.headroom + size).is_err() {
            return std::ptr::null_mut();
        }
        out.data.clear();
        out.data.resize(out.headroom, 0);
        out.given = Some(size);
        // SAFETY: the capacity covers headroom + size bytes.
        unsafe { out.data.as_mut_ptr().add(out.headroom) }
    }

    pub fn frame_jpeg(quality: u8, data: &mut Vec<u8>, headroom: usize) -> Option<u32> {
        let mut out = Out {
            data,
            headroom,
            given: None,
        };
        let mut len = 0_u32;
        // SAFETY: alloc_frame matches kvmc_alloc_fn and is called at most once, during this
        // call, with ctx = &mut out; libkvm writes `size` bytes into what it returns.
        let ok = unsafe {
            kvmc_frame_jpeg(quality.into(), alloc_frame, (&raw mut out).cast(), &mut len)
        } == 0;
        if !ok || out.given != Some(len as usize) {
            return None;
        }
        // SAFETY: alloc_frame reserved headroom + len bytes and zeroed the headroom; libkvm
        // copied the len-byte frame after it.
        unsafe { out.data.set_len(headroom + len as usize) };
        Some(len)
    }

    pub fn venc_add(ch: u8, w: u16, h: u16, gop: u32, fps: u32, bitrate: u32) -> bool {
        // SAFETY: plain integers.
        unsafe {
            kvmc_venc_add(
                ch.into(),
                w.into(),
                h.into(),
                gop as i32,
                fps as i32,
                bitrate as i32,
            ) == 0
        }
    }

    pub fn venc_del(ch: u8) {
        // SAFETY: as above.
        unsafe { kvmc_venc_del(ch.into()) };
    }

    pub fn frame_venc_push(ch: u8) -> bool {
        // SAFETY: as above.
        unsafe { kvmc_frame_venc_push(ch.into()) == 0 }
    }

    pub fn venc_pop(ch: u8, f: &mut dyn FnMut(&[&[u8]])) -> bool {
        let mut data = [std::ptr::null::<u8>(); MAX_PACKS];
        let mut size = [0_i32; MAX_PACKS];
        // SAFETY: arrays of MAX_PACKS entries, as passed.
        let count = unsafe {
            kvmc_venc_pop(
                ch.into(),
                data.as_mut_ptr(),
                size.as_mut_ptr(),
                MAX_PACKS as i32,
            )
        };
        if count < 0 {
            return false;
        }
        let n = (count as usize).min(MAX_PACKS);
        let packs: Vec<&[u8]> = (0..n)
            .map(|i| {
                if data[i].is_null() || size[i] <= 0 {
                    &[][..]
                } else {
                    // SAFETY: the encoder's pack mappings stay valid until kvmc_venc_free.
                    unsafe { std::slice::from_raw_parts(data[i], size[i] as usize) }
                }
            })
            .collect();
        f(&packs);
        true
    }

    pub fn venc_free(ch: u8) {
        // SAFETY: as above.
        unsafe { kvmc_venc_free(ch.into()) };
    }

    pub fn venc_request_idr(ch: u8) -> bool {
        // SAFETY: as above.
        unsafe { kvmc_venc_request_idr(ch.into()) == 0 }
    }
}

/// Host builds and tests have no capture: libkvm is linked only into the device build.
#[cfg(not(all(target_arch = "riscv64", feature = "linked-libkvm")))]
mod imp {
    pub fn cam_create(_: u16, _: u16) -> bool {
        false
    }
    pub fn cam_restart(_: u16, _: u16) {}
    pub fn cam_set_size(_: u16, _: u16) -> bool {
        false
    }
    pub fn cam_mirror_flip() {}
    pub fn cam_close() {}
    pub fn mmf_is_init() -> bool {
        false
    }
    pub fn mmf_deinit(_: bool) {}
    pub fn frame_read() -> Option<(u16, u16, usize)> {
        None
    }
    pub fn frame_pixels(_: usize, f: &mut dyn FnMut(Option<&[u8]>)) {
        f(None)
    }
    pub fn frame_release() {}
    pub fn frame_jpeg(_: u8, _: &mut Vec<u8>, _: usize) -> Option<u32> {
        None
    }
    pub fn venc_add(_: u8, _: u16, _: u16, _: u32, _: u32, _: u32) -> bool {
        false
    }
    pub fn venc_del(_: u8) {}
    pub fn frame_venc_push(_: u8) -> bool {
        false
    }
    pub fn venc_pop(_: u8, _: &mut dyn FnMut(&[&[u8]])) -> bool {
        false
    }
    pub fn venc_free(_: u8) {}
    pub fn venc_request_idr(_: u8) -> bool {
        false
    }
}

pub use imp::*;

/// Whether libkvm is linked into this build.
pub const LINKED: bool = cfg!(all(target_arch = "riscv64", feature = "linked-libkvm"));
