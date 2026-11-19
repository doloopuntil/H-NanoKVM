//! The camera and encoders over libkvm_mmf, ported from libkvm's C++ (`kvm_capture.cpp`,
//! `kvm_media.cpp`): one VI channel, one leased frame, the JPEG and H.264 encoders.
//! `tests/media_golden.rs` replays the C++'s recorded `mmf_*` calls against it.

/// Packs a returned H.264 frame may carry (`MMF_STREAM_MAX_PACKS`).
pub const MAX_PACKS: usize = 8;

/// `mmf_venc_cfg_t`.
#[repr(C)]
#[derive(Clone, Copy, Debug, Default)]
pub struct VencCfg {
    pub kind: u8,
    pub w: i32,
    pub h: i32,
    pub fmt: i32,
    pub jpg_quality: u8,
    pub gop: i32,
    pub input_fps: i32,
    pub output_fps: i32,
    pub bitrate: i32,
}

/// `mmf_stream_t`: the encoded packs, valid until `venc_free`.
#[repr(C)]
#[derive(Clone, Copy, Debug)]
pub struct Stream {
    pub data: [*mut u8; MAX_PACKS],
    pub data_size: [i32; MAX_PACKS],
    pub count: i32,
}

impl Default for Stream {
    fn default() -> Self {
        Self {
            data: [std::ptr::null_mut(); MAX_PACKS],
            data_size: [0; MAX_PACKS],
            count: 0,
        }
    }
}

/// What `mmf_vi_frame_pop` reports about the leased frame.
#[derive(Clone, Copy, Debug)]
pub struct ViFrame {
    pub len: i32,
    pub width: i32,
    pub height: i32,
    pub format: i32,
}

/// libkvm_mmf's API (`kvm_mmf.hpp`). Pointers follow its rules: a mapped frame stays valid
/// until the frame is freed or released, JPEG data until `enc_jpg_free`, packs until
/// `venc_free`; `data` NULL hands the encoders the leased VPSS frame.
pub trait Mmf {
    fn init(&mut self) -> i32;
    fn vi_init(&mut self) -> i32;
    fn vi_deinit(&mut self) -> i32;
    fn try_deinit(&mut self, force: bool) -> i32;
    fn is_init(&mut self) -> bool;
    fn get_vi_unused_channel(&mut self) -> i32;
    fn add_vi_channel(&mut self, ch: i32, w: i32, h: i32, fmt: i32) -> i32;
    fn del_vi_channel(&mut self, ch: i32) -> i32;
    fn vi_chn_is_open(&mut self, ch: i32) -> bool;
    fn vi_aligned_width(&mut self, ch: i32) -> i32;
    fn set_vi_hmirror(&mut self, ch: i32, en: bool);
    fn set_vi_vflip(&mut self, ch: i32, en: bool);
    fn vi_frame_pop(&mut self, ch: i32) -> Result<ViFrame, i32>;
    fn vi_frame_map(&mut self, ch: i32) -> *const u8;
    fn vi_frame_free(&mut self, ch: i32);
    fn vi_frame_release(&mut self, ch: i32);
    /// `mmf_invert_format_to_mmf(MMF_INPUT_FMT_NV21)`.
    fn nv21_format(&mut self) -> i32;
    /// # Safety
    /// `data` is NULL or holds a w x h NV21 frame for the call.
    unsafe fn enc_jpg_push(
        &mut self,
        ch: i32,
        data: *mut u8,
        w: i32,
        h: i32,
        fmt: i32,
        q: i32,
    ) -> i32;
    fn enc_jpg_pop(&mut self, ch: i32) -> Result<(*const u8, i32), i32>;
    fn enc_jpg_free(&mut self, ch: i32) -> i32;
    fn add_venc_channel(&mut self, ch: i32, cfg: &VencCfg) -> i32;
    fn del_venc_channel(&mut self, ch: i32) -> i32;
    /// # Safety
    /// As `enc_jpg_push`.
    unsafe fn venc_push(&mut self, ch: i32, data: *mut u8, w: i32, h: i32, fmt: i32) -> i32;
    fn venc_pop(&mut self, ch: i32) -> Result<Stream, i32>;
    fn venc_free(&mut self, ch: i32) -> i32;
    fn venc_request_idr(&mut self, ch: i32) -> i32;
}

struct Camera {
    ch: i32,
    width: i32,
    height: i32,
    align_need: bool,
}

/// A copy (padded rows packed), or the VPSS frame itself (`vi_ch`), held until the next read.
struct Frame {
    data: Option<Vec<u8>>,
    size: usize,
    width: i32,
    height: i32,
    vi_ch: i32,
}

impl Frame {
    const EMPTY: Frame = Frame {
        data: None,
        size: 0,
        width: 0,
        height: 0,
        vi_ch: -1,
    };

    fn leased(&self) -> bool {
        self.data.is_some() || self.vi_ch >= 0
    }

    fn data_ptr(&mut self) -> *mut u8 {
        self.data
            .as_mut()
            .map_or(std::ptr::null_mut(), |d| d.as_mut_ptr())
    }
}

/// The camera, the leased frame and the encoders; the caller serialises every call.
pub struct Media<M: Mmf> {
    mmf: M,
    cam: Option<Camera>,
    frame: Frame,
}

impl<M: Mmf> Media<M> {
    pub fn new(mmf: M) -> Self {
        Self {
            mmf,
            cam: None,
            frame: Frame::EMPTY,
        }
    }

    pub fn mmf_mut(&mut self) -> &mut M {
        &mut self.mmf
    }

    /// Brings up MMF and opens the VI channel at w x h; false when MMF init fails.
    pub fn cam_create(&mut self, w: i32, h: i32) -> bool {
        if self.cam.is_none() {
            let mut cam = Camera::new();
            if cam.start(&mut self.mmf, w, h) {
                self.cam = Some(cam);
            } else {
                cam.stop(&mut self.mmf);
            }
        }
        self.cam.is_some()
    }

    /// Tears the media stack down and starts it again; the VI rereads its input size.
    pub fn cam_restart(&mut self, w: i32, h: i32) {
        if let Some(cam) = &mut self.cam {
            cam.stop(&mut self.mmf);
            cam.start(&mut self.mmf, w, h);
        }
    }

    pub fn cam_set_size(&mut self, w: i32, h: i32) -> bool {
        let Some(cam) = &mut self.cam else {
            return false;
        };
        cam.close(&mut self.mmf);
        cam.width = w;
        cam.height = h;
        cam.open_channel(&mut self.mmf)
    }

    /// The bridge delivers the picture mirrored and upside down.
    pub fn cam_mirror_flip(&mut self) {
        let Some(cam) = &mut self.cam else {
            return;
        };
        if !cam.is_open(&mut self.mmf) {
            return;
        }
        cam.close(&mut self.mmf);
        // The flags belong to a channel and apply when it is added: set them on the one that opens.
        let ch = self.mmf.get_vi_unused_channel();
        if ch >= 0 {
            self.mmf.set_vi_hmirror(ch, true);
            self.mmf.set_vi_vflip(ch, true);
        }
        if !cam.open_channel_at(&mut self.mmf, ch) {
            tracing::warn!("camera reopen failed");
        }
    }

    pub fn cam_close(&mut self) {
        if let Some(cam) = &mut self.cam {
            cam.close(&mut self.mmf);
        }
    }

    pub fn mmf_is_init(&mut self) -> bool {
        self.mmf.is_init()
    }

    pub fn mmf_deinit(&mut self, force: bool) {
        self.mmf.try_deinit(force);
    }

    /// Leases the next frame (libkvm_mmf waits up to 1 s): width, height and size.
    pub fn frame_read(&mut self) -> Option<(i32, i32, usize)> {
        self.frame = Frame::EMPTY;
        let cam = self.cam.as_mut()?;
        if !cam.read(&mut self.mmf, &mut self.frame) {
            return None;
        }
        Some((self.frame.width, self.frame.height, self.frame.size))
    }

    /// The leased frame's pixels for the CPU.
    pub fn frame_pixels(&mut self) -> Option<&[u8]> {
        if let Some(data) = &self.frame.data {
            return Some(data);
        }
        if self.frame.vi_ch < 0 {
            return None;
        }
        let ptr = self.mmf.vi_frame_map(self.frame.vi_ch);
        if ptr.is_null() {
            return None;
        }
        // SAFETY: the mapping covers the leased frame's `size` bytes (the read checked the
        // length) and stays valid until the next read or release, which need &mut self.
        Some(unsafe { std::slice::from_raw_parts(ptr, self.frame.size) })
    }

    pub fn frame_release(&mut self) {
        self.frame = Frame::EMPTY;
    }

    /// JPEG of the leased frame; `sink` takes the bytes and says whether it kept them.
    pub fn frame_jpeg(&mut self, quality: i32, sink: &mut dyn FnMut(&[u8]) -> bool) -> Option<u32> {
        // With no frame leased, NULL data would hand the encoder whatever VPSS frame it held.
        if !self.frame.leased() {
            return None;
        }
        let fmt = self.mmf.nv21_format();
        let data = self.frame.data_ptr();
        let (w, h) = (self.frame.width, self.frame.height);
        // SAFETY: data is NULL or the frame copy of w x h, owned by self.frame for the call.
        if unsafe { self.mmf.enc_jpg_push(0, data, w, h, fmt, quality) } != 0 {
            return None;
        }
        let (ptr, size) = self.mmf.enc_jpg_pop(0).ok()?;
        let mut ok = false;
        if !ptr.is_null() && size > 0 {
            // SAFETY: the encoder's output holds `size` bytes until enc_jpg_free below.
            ok = sink(unsafe { std::slice::from_raw_parts(ptr, size as usize) });
        }
        self.mmf.enc_jpg_free(0);
        ok.then_some(size as u32)
    }

    pub fn venc_add(&mut self, ch: i32, w: i32, h: i32, gop: i32, fps: i32, bitrate: i32) -> i32 {
        let cfg = VencCfg {
            kind: 2, // H.264
            w,
            h,
            fmt: self.mmf.nv21_format(),
            gop,
            input_fps: fps,
            output_fps: fps,
            bitrate,
            ..VencCfg::default()
        };
        self.mmf.add_venc_channel(ch, &cfg)
    }

    pub fn venc_del(&mut self, ch: i32) -> i32 {
        self.mmf.del_venc_channel(ch)
    }

    /// Sends the leased frame to the H.264 channel.
    pub fn frame_venc_push(&mut self, ch: i32) -> i32 {
        if !self.frame.leased() {
            return -1;
        }
        let fmt = self.mmf.nv21_format();
        let data = self.frame.data_ptr();
        let (w, h) = (self.frame.width, self.frame.height);
        // SAFETY: as in frame_jpeg.
        unsafe { self.mmf.venc_push(ch, data, w, h, fmt) }
    }

    /// The encoded packs (pointer, size), at most `max`, valid until `venc_free`; the count
    /// libkvm_mmf reported, or -1.
    pub fn venc_pop(&mut self, ch: i32, max: usize, packs: &mut Vec<(*const u8, i32)>) -> i32 {
        packs.clear();
        let Ok(stream) = self.mmf.venc_pop(ch) else {
            return -1;
        };
        let n = usize::try_from(stream.count)
            .unwrap_or(0)
            .min(max)
            .min(MAX_PACKS);
        packs.extend((0..n).map(|i| (stream.data[i].cast_const(), stream.data_size[i])));
        stream.count
    }

    pub fn venc_free(&mut self, ch: i32) -> i32 {
        self.mmf.venc_free(ch)
    }

    pub fn venc_request_idr(&mut self, ch: i32) -> i32 {
        self.mmf.venc_request_idr(ch)
    }
}

impl Camera {
    fn new() -> Self {
        Self {
            ch: -1,
            width: 0,
            height: 0,
            align_need: false,
        }
    }

    fn start(&mut self, mmf: &mut impl Mmf, w: i32, h: i32) -> bool {
        if mmf.init() != 0 {
            tracing::warn!("mmf init failed");
            return false;
        }
        if mmf.vi_init() != 0 {
            tracing::warn!("mmf vi init failed");
        }
        self.width = w;
        self.height = h;
        if !self.open_channel(mmf) {
            tracing::warn!("camera open failed");
        }
        true
    }

    fn stop(&mut self, mmf: &mut impl Mmf) {
        self.close(mmf);
        if mmf.vi_deinit() != 0 {
            tracing::warn!("mmf vi deinit failed");
        }
        mmf.try_deinit(true);
    }

    fn is_open(&self, mmf: &mut impl Mmf) -> bool {
        self.ch >= 0 && mmf.vi_chn_is_open(self.ch)
    }

    fn open_channel(&mut self, mmf: &mut impl Mmf) -> bool {
        let ch = mmf.get_vi_unused_channel();
        self.open_channel_at(mmf, ch)
    }

    fn open_channel_at(&mut self, mmf: &mut impl Mmf, ch: i32) -> bool {
        if ch < 0 {
            tracing::warn!("no free vi channel");
            return false;
        }
        let fmt = mmf.nv21_format();
        if mmf.add_vi_channel(ch, self.width, self.height, fmt) != 0 {
            tracing::warn!("mmf add vi channel failed");
            return false;
        }
        self.ch = ch;
        self.align_need = self
            .width
            .checked_rem(mmf.vi_aligned_width(ch))
            .is_some_and(|r| r != 0);
        true
    }

    fn close(&mut self, mmf: &mut impl Mmf) {
        if self.is_open(mmf) && mmf.del_vi_channel(self.ch) != 0 {
            tracing::warn!("mmf del vi channel failed");
        }
    }

    fn read(&mut self, mmf: &mut impl Mmf, frame: &mut Frame) -> bool {
        *frame = Frame::EMPTY;
        if !self.is_open(mmf) {
            return false;
        }
        let Ok(vi) = mmf.vi_frame_pop(self.ch) else {
            return false;
        };
        let size = self.width as usize * self.height as usize * 3 / 2;
        if !self.align_need
            && vi.width == self.width
            && vi.height == self.height
            && vi.format == mmf.nv21_format()
            && vi.len as usize >= size
        {
            // Zero copy: the encoders take this frame straight from VPSS, unmapped.
            *frame = Frame {
                data: None,
                size,
                width: self.width,
                height: self.height,
                vi_ch: self.ch,
            };
            mmf.vi_frame_free(self.ch);
            return true;
        }

        let buffer = mmf.vi_frame_map(self.ch);
        if buffer.is_null() {
            mmf.vi_frame_release(self.ch);
            return false;
        }
        // VPSS rows are padded to the aligned width; the copy reads `need` bytes.
        let width = self.width as usize;
        let rows = (self.height * 3 / 2) as usize;
        let pitch = if self.align_need {
            let align = mmf.vi_aligned_width(self.ch);
            if align <= 0 {
                mmf.vi_frame_release(self.ch);
                return false;
            }
            ((vi.width + align - 1) / align * align) as usize
        } else {
            width
        };
        let need = if self.align_need {
            rows.saturating_sub(1) * pitch + width
        } else {
            size
        };
        // A frame smaller than the camera size (VPSS not yet at a new size) is dropped, not
        // read past its end.
        if need > usize::try_from(vi.len).unwrap_or(0) {
            mmf.vi_frame_release(self.ch);
            return false;
        }
        // SAFETY: the mapping covers the frame's `len` bytes, checked above to hold `need`.
        let frame_bytes = unsafe { std::slice::from_raw_parts(buffer, need) };
        let mut copy = Vec::with_capacity(size);
        if self.align_need {
            for row in 0..rows {
                copy.extend_from_slice(&frame_bytes[row * pitch..row * pitch + width]);
            }
        } else {
            copy.extend_from_slice(frame_bytes);
        }
        mmf.vi_frame_release(self.ch);
        *frame = Frame {
            data: Some(copy),
            size,
            width: self.width,
            height: self.height,
            vi_ch: -1,
        };
        true
    }
}
