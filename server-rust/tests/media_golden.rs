//! Replays the media scenarios (`tests/media`) against `capture::media` with a recording fake
//! of libkvm_mmf, and compares the traces with what libkvm's C++ produced.

use std::{collections::HashSet, collections::VecDeque, fs, path::Path};

use nanokvm_rust_server::capture::media::{MAX_PACKS, Media, Mmf, Stream, VencCfg, ViFrame};

/// Scenarios whose Rust trace differs from the C++ golden on purpose, with the reason; their
/// Rust traces are checked against `tests/media/fixed`.
const EXPECTED_DIFFERENCES: &[(&str, &str)] = &[
    (
        "copy",
        "a frame smaller than the camera size is dropped, not read past its end",
    ),
    (
        "full-hd",
        "a frame smaller than the camera size is dropped, not read past its end",
    ),
    (
        "jpeg",
        "a frame smaller than the camera size is dropped, not read past its end",
    ),
    (
        "venc",
        "a frame smaller than the camera size is dropped, not read past its end",
    ),
    ("no-frame", "no encode without a leased frame"),
    (
        "channel",
        "mirror and flip are set on the channel that opens; short padded frame dropped",
    ),
    (
        "restart",
        "a padded frame shorter than its rows is dropped, not read past its end",
    ),
];

const NV21: i32 = 19;

fn hash(data: &[u8]) -> String {
    let mut h: u32 = 2_166_136_261;
    for &b in data {
        h = (h ^ u32::from(b)).wrapping_mul(16_777_619);
    }
    format!("{h:08x}")
}

fn data_str(ptr: *const u8, n: usize) -> String {
    if ptr.is_null() {
        "null".to_string()
    } else {
        // SAFETY: the fake's buffers are larger than any n the scenarios ask for.
        hash(unsafe { std::slice::from_raw_parts(ptr, n) })
    }
}

struct Pop {
    rc: i32,
    len: i32,
    w: i32,
    h: i32,
    fmt: i32,
}

struct Fake {
    trace: Vec<String>,
    fail: HashSet<String>,
    pops: VecDeque<Pop>,
    map_fail: bool,
    align: i32,
    unused: i32,
    is_init: bool,
    open: [bool; 8],
    frames: u64,
    frame: Vec<u8>,
    jpg_size: i32,
    jpg_null: bool,
    jpg_seq: u64,
    jpg: Vec<u8>,
    packs: Vec<i32>,
    venc_seq: u64,
    pack_data: Vec<Vec<u8>>,
}

impl Fake {
    fn new() -> Self {
        Self {
            trace: Vec::new(),
            fail: HashSet::new(),
            pops: VecDeque::new(),
            map_fail: false,
            align: 64,
            unused: 0,
            is_init: true,
            open: [false; 8],
            frames: 0,
            frame: Vec::new(),
            jpg_size: 100,
            jpg_null: false,
            jpg_seq: 0,
            jpg: Vec::new(),
            packs: vec![40],
            venc_seq: 0,
            pack_data: Vec::new(),
        }
    }

    fn out(&mut self, line: String) {
        self.trace.push(line);
    }

    fn rc(&mut self, name: &str) -> i32 {
        if self.fail.remove(name) { -1 } else { 0 }
    }
}

impl Mmf for Fake {
    fn init(&mut self) -> i32 {
        let rc = self.rc("init");
        self.out(format!("mmf init -> {rc}"));
        rc
    }
    fn vi_init(&mut self) -> i32 {
        let rc = self.rc("vi_init");
        self.out(format!("mmf vi_init -> {rc}"));
        rc
    }
    fn vi_deinit(&mut self) -> i32 {
        let rc = self.rc("vi_deinit");
        self.out(format!("mmf vi_deinit -> {rc}"));
        rc
    }
    fn try_deinit(&mut self, force: bool) -> i32 {
        self.out(format!("mmf try_deinit {}", u8::from(force)));
        0
    }
    fn is_init(&mut self) -> bool {
        self.out(format!("mmf is_init -> {}", u8::from(self.is_init)));
        self.is_init
    }
    fn get_vi_unused_channel(&mut self) -> i32 {
        self.out(format!("mmf get_vi_unused_channel -> {}", self.unused));
        self.unused
    }
    fn add_vi_channel(&mut self, ch: i32, w: i32, h: i32, fmt: i32) -> i32 {
        let rc = self.rc("add_vi");
        if rc == 0 && (0..8).contains(&ch) {
            self.open[ch as usize] = true;
        }
        self.out(format!("mmf add_vi_channel {ch} {w}x{h} fmt={fmt} -> {rc}"));
        rc
    }
    fn del_vi_channel(&mut self, ch: i32) -> i32 {
        let rc = self.rc("del_vi");
        if rc == 0 && (0..8).contains(&ch) {
            self.open[ch as usize] = false;
        }
        self.out(format!("mmf del_vi_channel {ch} -> {rc}"));
        rc
    }
    fn vi_chn_is_open(&mut self, ch: i32) -> bool {
        let open = (0..8).contains(&ch) && self.open[ch as usize];
        self.out(format!("mmf vi_chn_is_open {ch} -> {}", u8::from(open)));
        open
    }
    fn vi_aligned_width(&mut self, ch: i32) -> i32 {
        self.out(format!("mmf vi_aligned_width {ch} -> {}", self.align));
        self.align
    }
    fn set_vi_hmirror(&mut self, ch: i32, en: bool) {
        self.out(format!("mmf set_vi_hmirror {ch} {}", u8::from(en)));
    }
    fn set_vi_vflip(&mut self, ch: i32, en: bool) {
        self.out(format!("mmf set_vi_vflip {ch} {}", u8::from(en)));
    }
    fn vi_frame_pop(&mut self, ch: i32) -> Result<ViFrame, i32> {
        let Some(p) = self.pops.pop_front() else {
            self.out(format!("mmf vi_frame_pop {ch} -> -1"));
            return Err(-1);
        };
        if p.rc != 0 {
            self.out(format!("mmf vi_frame_pop {ch} -> {}", p.rc));
            return Err(p.rc);
        }
        self.frames += 1;
        let n = p.len as usize + p.w as usize * p.h as usize * 4 + (1 << 20);
        let f = self.frames;
        self.frame = (0..n as u64)
            .map(|i| (f.wrapping_mul(131) + i * 7 + (i >> 9)) as u8)
            .collect();
        self.out(format!(
            "mmf vi_frame_pop {ch} -> 0 len={} {}x{} fmt={}",
            p.len, p.w, p.h, p.fmt
        ));
        Ok(ViFrame {
            len: p.len,
            width: p.w,
            height: p.h,
            format: p.fmt,
        })
    }
    fn vi_frame_map(&mut self, ch: i32) -> *const u8 {
        let fail = std::mem::take(&mut self.map_fail);
        if fail {
            self.out(format!("mmf vi_frame_map {ch} -> null"));
            return std::ptr::null();
        }
        self.out(format!("mmf vi_frame_map {ch} -> frame#{}", self.frames));
        self.frame.as_ptr()
    }
    fn vi_frame_free(&mut self, ch: i32) {
        self.out(format!("mmf vi_frame_free {ch}"));
    }
    fn vi_frame_release(&mut self, ch: i32) {
        self.out(format!("mmf vi_frame_release {ch}"));
    }
    fn nv21_format(&mut self) -> i32 {
        NV21
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
        let rc = self.rc("jpg_push");
        let d = data_str(data, w as usize * h as usize * 3 / 2);
        self.out(format!(
            "mmf enc_jpg_push {ch} data={d} {w}x{h} fmt={fmt} q={q} -> {rc}"
        ));
        rc
    }
    fn enc_jpg_pop(&mut self, ch: i32) -> Result<(*const u8, i32), i32> {
        if self.rc("jpg_pop") != 0 {
            self.out(format!("mmf enc_jpg_pop {ch} -> -1"));
            return Err(-1);
        }
        self.jpg_seq += 1;
        let seq = self.jpg_seq;
        let n = if self.jpg_size > 0 {
            self.jpg_size as u64
        } else {
            1
        };
        self.jpg = (0..n).map(|i| (seq * 17 + i * 3) as u8).collect();
        let null = std::mem::take(&mut self.jpg_null);
        let ptr = if null {
            std::ptr::null()
        } else {
            self.jpg.as_ptr()
        };
        self.out(format!(
            "mmf enc_jpg_pop {ch} -> 0 size={}{}",
            self.jpg_size,
            if null { " data=null" } else { "" }
        ));
        Ok((ptr, self.jpg_size))
    }
    fn enc_jpg_free(&mut self, ch: i32) -> i32 {
        self.out(format!("mmf enc_jpg_free {ch}"));
        0
    }
    fn add_venc_channel(&mut self, ch: i32, cfg: &VencCfg) -> i32 {
        let rc = self.rc("venc_add");
        self.out(format!(
            "mmf add_venc_channel {ch} type={} {}x{} fmt={} q={} gop={} fps={}/{} bitrate={} -> {rc}",
            cfg.kind,
            cfg.w,
            cfg.h,
            cfg.fmt,
            cfg.jpg_quality,
            cfg.gop,
            cfg.input_fps,
            cfg.output_fps,
            cfg.bitrate
        ));
        rc
    }
    fn del_venc_channel(&mut self, ch: i32) -> i32 {
        let rc = self.rc("venc_del");
        self.out(format!("mmf del_venc_channel {ch} -> {rc}"));
        rc
    }
    unsafe fn venc_push(&mut self, ch: i32, data: *mut u8, w: i32, h: i32, fmt: i32) -> i32 {
        let rc = self.rc("venc_push");
        let d = data_str(data, w as usize * h as usize * 3 / 2);
        self.out(format!(
            "mmf venc_push {ch} data={d} {w}x{h} fmt={fmt} -> {rc}"
        ));
        rc
    }
    fn venc_pop(&mut self, ch: i32) -> Result<Stream, i32> {
        if self.rc("venc_pop") != 0 {
            self.out(format!("mmf venc_pop {ch} -> -1"));
            return Err(-1);
        }
        self.venc_seq += 1;
        let seq = self.venc_seq;
        let mut stream = Stream {
            count: self.packs.len() as i32,
            ..Stream::default()
        };
        self.pack_data = self
            .packs
            .iter()
            .take(MAX_PACKS)
            .enumerate()
            .map(|(k, &size)| {
                let n = if size > 0 { size as u64 } else { 1 };
                (0..n)
                    .map(|i| (k as u64 * 29 + i * 5 + seq) as u8)
                    .collect()
            })
            .collect();
        for (k, d) in self.pack_data.iter_mut().enumerate() {
            let size = self.packs[k];
            stream.data[k] = if size > 0 {
                d.as_mut_ptr()
            } else {
                std::ptr::null_mut()
            };
            stream.data_size[k] = size;
        }
        let sizes: Vec<String> = self.packs.iter().map(i32::to_string).collect();
        self.out(format!("mmf venc_pop {ch} -> 0 packs={}", sizes.join(",")));
        Ok(stream)
    }
    fn venc_free(&mut self, ch: i32) -> i32 {
        let rc = self.rc("venc_free");
        self.out(format!("mmf venc_free {ch} -> {rc}"));
        rc
    }
    fn venc_request_idr(&mut self, ch: i32) -> i32 {
        let rc = self.rc("idr");
        self.out(format!("mmf venc_request_idr {ch} -> {rc}"));
        rc
    }
}

fn num(word: Option<&str>) -> i32 {
    match word {
        Some("nv21") => NV21,
        Some(w) => w.parse().expect("number"),
        None => panic!("missing number"),
    }
}

fn run(scenario: &str) -> String {
    let mut m = Media::new(Fake::new());
    for line in scenario.lines() {
        let mut words = line.split_whitespace();
        let Some(op) = words.next() else { continue };
        if op.starts_with('#') {
            continue;
        }
        let mut n = || num(words.next());
        m.mmf_mut().out(format!("> {line}"));
        let out = match op {
            "pop" => {
                let mut rest = line.split_whitespace().skip(1);
                let w = rest.next().unwrap();
                let fake = m.mmf_mut();
                if w == "fail" {
                    fake.pops.push_back(Pop {
                        rc: -1,
                        len: 0,
                        w: 0,
                        h: 0,
                        fmt: 0,
                    });
                } else {
                    let w = w.parse().unwrap();
                    let (h, fmt, len) = (num(rest.next()), num(rest.next()), num(rest.next()));
                    fake.pops.push_back(Pop {
                        rc: 0,
                        len,
                        w,
                        h,
                        fmt,
                    });
                }
                None
            }
            "map_fail" => {
                m.mmf_mut().map_fail = true;
                None
            }
            "fail" => {
                let name = line.split_whitespace().nth(1).unwrap().to_string();
                m.mmf_mut().fail.insert(name);
                None
            }
            "align" => {
                m.mmf_mut().align = n();
                None
            }
            "unused" => {
                m.mmf_mut().unused = n();
                None
            }
            "set_init" => {
                m.mmf_mut().is_init = n() != 0;
                None
            }
            "jpg_null" => {
                m.mmf_mut().jpg_null = true;
                None
            }
            "jpg_size" => {
                m.mmf_mut().jpg_size = n();
                None
            }
            "packs" => {
                m.mmf_mut().packs = line
                    .split_whitespace()
                    .skip(1)
                    .map(|s| s.parse().unwrap())
                    .collect();
                None
            }
            "create" => {
                let (w, h) = (n(), n());
                Some(format!(
                    "call create -> {}",
                    if m.cam_create(w, h) { 0 } else { -1 }
                ))
            }
            "restart" => {
                let (w, h) = (n(), n());
                m.cam_restart(w, h);
                None
            }
            "size" => {
                let (w, h) = (n(), n());
                Some(format!(
                    "call size -> {}",
                    if m.cam_set_size(w, h) { 0 } else { -1 }
                ))
            }
            "mirror" => {
                m.cam_mirror_flip();
                None
            }
            "close" => {
                m.cam_close();
                None
            }
            "isinit" => Some(format!("call isinit -> {}", u8::from(m.mmf_is_init()))),
            "deinit" => {
                let force = n() != 0;
                m.mmf_deinit(force);
                None
            }
            "read" => Some(match m.frame_read() {
                Some((w, h, size)) => format!("call read -> 0 {w}x{h} size={size}"),
                None => "call read -> -1".to_string(),
            }),
            "pixels" => {
                let len = n() as usize;
                Some(format!(
                    "call pixels -> {}",
                    m.frame_pixels()
                        .map_or("null".to_string(), |p| hash(&p[..len]))
                ))
            }
            "release" => {
                m.frame_release();
                None
            }
            "jpeg" => {
                let q = n();
                let refuse = line.split_whitespace().nth(2) == Some("refuse");
                let mut kept = Vec::new();
                let mut sink = |jpeg: &[u8]| {
                    if refuse {
                        return false;
                    }
                    kept = jpeg.to_vec();
                    true
                };
                Some(match m.frame_jpeg(q, &mut sink) {
                    Some(size) => format!("call jpeg -> 0 size={size} {}", hash(&kept)),
                    None => "call jpeg -> -1 size=0".to_string(),
                })
            }
            "vadd" => {
                let (ch, w, h, gop, fps, br) = (n(), n(), n(), n(), n(), n());
                Some(format!(
                    "call vadd -> {}",
                    m.venc_add(ch, w, h, gop, fps, br)
                ))
            }
            "vdel" => {
                let ch = n();
                Some(format!("call vdel -> {}", m.venc_del(ch)))
            }
            "vpush" => {
                let ch = n();
                Some(format!("call vpush -> {}", m.frame_venc_push(ch)))
            }
            "vpop" => {
                let (ch, max) = (n(), n() as usize);
                let mut packs = Vec::new();
                let count = m.venc_pop(ch, max, &mut packs);
                let mut s = format!("call vpop -> {count}");
                for &(data, size) in &packs {
                    let len = if size > 0 { size as usize } else { 0 };
                    s += &format!(" {size}:{}", data_str(data, len));
                }
                Some(s)
            }
            "vfree" => {
                let ch = n();
                Some(format!("call vfree -> {}", m.venc_free(ch)))
            }
            "vidr" => {
                let ch = n();
                Some(format!("call vidr -> {}", m.venc_request_idr(ch)))
            }
            _ => panic!("unknown op: {line}"),
        };
        if let Some(out) = out {
            m.mmf_mut().out(out);
        }
    }
    // Rust frees what it drops; the C++ trace ends with its leak check.
    let fake = m.mmf_mut();
    fake.out("end leaks=0".to_string());
    let mut text = fake.trace.join("\n");
    text.push('\n');
    text
}

#[test]
fn media_matches_the_cxx_goldens() {
    let dir = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/media");
    let out_dir = std::env::var_os("MEDIA_TRACES_OUT").map(std::path::PathBuf::from);
    let mut names: Vec<_> = fs::read_dir(dir.join("scenarios"))
        .unwrap()
        .map(|e| e.unwrap().path())
        .filter(|p| p.extension().is_some_and(|e| e == "scn"))
        .collect();
    names.sort();
    assert!(!names.is_empty());
    let mut failures = Vec::new();
    for path in names {
        let name = path.file_stem().unwrap().to_str().unwrap().to_string();
        let trace = run(&fs::read_to_string(&path).unwrap());
        if let Some(out) = &out_dir {
            fs::create_dir_all(out).unwrap();
            fs::write(out.join(format!("{name}.trace")), &trace).unwrap();
        }
        let golden = fs::read_to_string(dir.join("golden").join(format!("{name}.trace"))).unwrap();
        if EXPECTED_DIFFERENCES.iter().any(|(n, _)| *n == name) {
            let fixed = fs::read_to_string(dir.join("fixed").join(format!("{name}.trace")));
            if trace == golden || fixed.ok().as_deref() != Some(trace.as_str()) {
                failures.push(name);
            }
        } else if trace != golden {
            failures.push(name);
        }
    }
    assert!(
        failures.is_empty(),
        "traces differ from the goldens: {failures:?}"
    );
}
