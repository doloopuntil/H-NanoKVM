//! Replays tests/capture/scenarios against the capture engine and compares the traces with
//! the goldens recorded from libkvm's C++ kvm_vision (tests/capture/golden). The scheduler,
//! the hardware model and the camera stand-ins follow that harness (tests/capture/README.md):
//! virtual time, one thread running at a time, ties to whoever slept first.

use std::{
    cell::Cell,
    collections::{HashMap, VecDeque},
    fmt::Write as _,
    fs,
    path::{Path, PathBuf},
    sync::{Arc, Condvar, Mutex, MutexGuard},
    thread::{self, JoinHandle},
};

use hnanokvm_server::capture::{Command, Engine, GpioHandle, Platform, ThreadHandle, ViState};

/// Scenarios where the port deliberately differs from the C++, and why; their traces are
/// checked against `tests/capture/fixed`.
const EXPECTED_DIFFERENCES: &[(&str, &str)] = &[
    (
        "alpha-hdmi-disable",
        "#9 known signal; #13 no reads while off",
    ),
    ("c-beta-stream", "#14 restart before the read"),
    ("d-beta-stream", "#14 restart before the read"),
    ("pcie-hdmi", "#9 known signal; #10 discard in one read"),
    ("pcie-nogpio", "#9 re-enable keeps the known signal"),
    ("ue-manual-recovers", "#8 manual size clears the scan error"),
    ("ux-auto-size", "#12 follow every size; #14"),
    ("ux-beta-stream", "#9; #13 no reads while off; #14"),
    ("ux-h264", "#11 IDR on switching back to H.264"),
    (
        "ux-unknown-gives-up",
        "#8 scan error cleared in bridge mode; #9",
    ),
    (
        "ux-unknown-scan",
        "#9 known signal; #14 restart before read",
    ),
];

const BASE_MS: u64 = 5_000_000;
const GPIO_OFFSET: u32 = 3;

thread_local! {
    static SIM: Cell<usize> = const { Cell::new(0) };
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum State {
    Runnable,
    Sleeping,
    MutexWait,
    Done,
}

struct SimThread {
    st: State,
    wake: u64,
    seq: u64,
    go: bool,
    timed: bool,
    timed_out: bool,
}

impl SimThread {
    fn new(seq: u64) -> Self {
        SimThread {
            st: State::Runnable,
            wake: 0,
            seq,
            go: false,
            timed: false,
            timed_out: false,
        }
    }
}

#[derive(Default)]
struct Pending {
    text: String,
    first: u64,
    last: u64,
    count: u32,
}

struct Media {
    signal: bool,
    src: (u32, u32),
    input: (u32, u32),
    vidbg_auto: bool,
    frame_ms: u64,
    restart_ms: u64,
    frame_id: u8,
    cam_fail: bool,
    mmf_init: bool,
    venc_fail: String,
    idr_pending: bool,
    cam: (u16, u16),
    cam_open: bool,
    last: String,
    fb: Vec<u8>,
}

struct World {
    // scheduler
    sims: Vec<SimThread>,
    seq: u64,
    now: u64,
    owner: Option<usize>,
    os_threads: HashMap<usize, JoinHandle<()>>,
    // trace
    out: String,
    pending: Pending,
    // scenario
    root: PathBuf,
    actions: VecDeque<(u64, String)>,
    // hardware
    chip: String,
    gpio_line: bool,
    regs: Vec<[u8; 256]>,
    bank: u8,
    ptr: u8,
    nack: bool,
    lt_count: i64,
    lt_exists: bool,
    vidbg_ms: u64,
    carveout: String,
    vi_seq: u32,
    media: Media,
}

struct Sched {
    w: Mutex<World>,
    cv: Condvar,
}

#[derive(Clone)]
struct TestPlatform(Arc<Sched>);

fn quote(data: &[u8]) -> String {
    let mut s = String::from("\"");
    for &c in data {
        match c {
            b'\n' => s.push_str("\\n"),
            b'"' | b'\\' => {
                s.push('\\');
                s.push(c as char);
            }
            0x20..=0x7e => s.push(c as char),
            _ => write!(s, "\\x{c:02x}").unwrap(),
        }
    }
    s.push('"');
    s
}

fn hex(b: &[u8]) -> String {
    b.iter().fold(String::new(), |mut s, x| {
        write!(s, " {x:02x}").unwrap();
        s
    })
}

fn unescape(s: &str) -> Vec<u8> {
    let b = s.as_bytes();
    let mut out = Vec::new();
    let mut i = 0;
    while i < b.len() {
        if b[i] == b'\\' && i + 1 < b.len() {
            i += 1;
            match b[i] {
                b'x' if i + 2 < b.len() => {
                    out.push(u8::from_str_radix(&s[i + 1..i + 3], 16).unwrap());
                    i += 2;
                }
                b'n' => out.push(b'\n'),
                b't' => out.push(b'\t'),
                c => out.push(c),
            }
        } else {
            out.push(b[i]);
        }
        i += 1;
    }
    out
}

fn atoi(s: &str) -> i64 {
    let t = s.trim_start();
    let (neg, rest) = match t.as_bytes().first() {
        Some(b'-') => (true, &t[1..]),
        Some(b'+') => (false, &t[1..]),
        _ => (false, t),
    };
    let n = rest
        .bytes()
        .take_while(u8::is_ascii_digit)
        .fold(0_i64, |n, d| n * 10 + i64::from(d - b'0'));
    if neg { -n } else { n }
}

impl World {
    fn trace(&mut self, line: String) {
        if self.pending.count > 0 && self.pending.text == line {
            self.pending.count += 1;
            self.pending.last = self.now;
            return;
        }
        self.flush_pending();
        self.pending = Pending {
            text: line,
            first: self.now,
            last: self.now,
            count: 1,
        };
    }

    fn flush_pending(&mut self) {
        let p = std::mem::take(&mut self.pending);
        match p.count {
            0 => {}
            1 => writeln!(self.out, "@{} {}", p.first, p.text).unwrap(),
            n => writeln!(self.out, "@{}..@{} {} x{}", p.first, p.last, p.text, n).unwrap(),
        }
    }

    fn host(&self, path: &str) -> PathBuf {
        self.root.join(path.trim_start_matches('/'))
    }

    fn put_file(&self, path: &str, data: &[u8]) {
        let host = self.host(path);
        fs::create_dir_all(host.parent().unwrap()).unwrap();
        fs::write(host, data).unwrap();
    }

    fn write_lt_file(&self) {
        if self.lt_exists {
            self.put_file("/proc/lt_int", format!("{}\n", self.lt_count).as_bytes());
        } else {
            let _ = fs::remove_file(self.host("/proc/lt_int"));
        }
    }

    fn set_be16(&mut self, bank: u8, reg: u8, v: u32) {
        self.regs[bank as usize][reg as usize] = (v >> 8) as u8;
        self.regs[bank as usize][reg.wrapping_add(1) as usize] = v as u8;
    }

    fn set_source(&mut self, w: u32, h: u32) {
        match self.chip.as_str() {
            "c" => {
                self.set_be16(0xd2, 0x96, h);
                self.set_be16(0xd2, 0x8b, w / 2);
                self.set_be16(0xc2, 0x06, h);
                self.set_be16(0xc2, 0x38, w);
            }
            "ux" => {
                self.regs[0x86][0xa3] = if w != 0 && h != 0 { 0x55 } else { 0x88 };
                self.set_be16(0x85, 0xf0, h);
                self.set_be16(0x85, 0xea, w);
            }
            "d" => {
                self.set_be16(0xe0, 0x8c, w / 2);
                self.set_be16(0xe0, 0x8e, h);
            }
            _ => {}
        }
        self.media.signal = w != 0 && h != 0;
        self.media.src = (w, h);
    }

    fn frames_flow(&self) -> bool {
        self.media.signal && self.media.input == self.media.src
    }

    fn write_vidbg(&self, v: &[u32]) {
        const NAMES: [&str; 6] = [
            "VIDevFPS",
            "VIFPS",
            "VICsiCh0WidthGTCnt",
            "VICsiCh0WidthLSCnt",
            "VICsiCh0HeightGTCnt",
            "VICsiCh0HeightLSCnt",
        ];
        let mut s = String::from("-----VI DEV STATUS-----\n");
        for (name, x) in NAMES.iter().zip(v) {
            writeln!(s, "{name} : {x}").unwrap();
        }
        self.put_file("/proc/cvitek/vi_dbg", s.as_bytes());
    }

    fn write_vidbg_auto(&self) {
        let m = &self.media;
        let sig = m.signal;
        let flag = |b: bool| u32::from(b);
        self.write_vidbg(&[
            if sig { 60 } else { 0 },
            if self.frames_flow() { 60 } else { 0 },
            flag(sig && m.src.0 > m.input.0),
            flag(sig && m.src.0 < m.input.0),
            flag(sig && m.src.1 > m.input.1),
            flag(sig && m.src.1 < m.input.1),
        ]);
    }

    fn read_dimension(&self, path: &str, fallback: u32) -> u32 {
        let s = fs::read_to_string(self.host(path)).unwrap_or_default();
        let t = s.trim_start();
        let digits: String = t.chars().take_while(char::is_ascii_digit).collect();
        match digits.parse::<u64>() {
            Ok(v) if v != 0 && v <= 8192 => v as u32,
            _ => fallback,
        }
    }

    fn vi_start(&mut self) {
        self.media.input = (
            self.read_dimension("/kvmapp/kvm/width", 1920),
            self.read_dimension("/kvmapp/kvm/height", 1080),
        );
    }

    fn apply(&mut self, line: &str) {
        self.trace(format!("> {line}"));
        let mut it = line.split_whitespace();
        let op = it.next().unwrap_or("");
        match op {
            "file" => {
                let path = it.next().unwrap();
                let rest = line.splitn(3, ' ').nth(2).unwrap_or("").to_string();
                self.put_file(path, &unescape(&rest));
            }
            "rm" => {
                let _ = fs::remove_file(self.host(it.next().unwrap()));
            }
            "src" => {
                let w = it.next().unwrap();
                if w == "off" {
                    self.set_source(0, 0);
                } else {
                    let h = it.next().unwrap().parse().unwrap();
                    self.set_source(w.parse().unwrap(), h);
                }
            }
            "reg" => {
                let mut n = || u8::from_str_radix(it.next().unwrap(), 16).unwrap();
                let (b, r, v) = (n(), n(), n());
                self.regs[b as usize][r as usize] = v;
            }
            "int" => {
                self.lt_count += if it.next() == Some("rise") { 1 } else { 10 };
                self.write_lt_file();
            }
            "vidbg" => {
                let first = it.next().unwrap();
                self.media.vidbg_auto = first == "auto";
                match first {
                    "absent" => {
                        let _ = fs::remove_file(self.host("/proc/cvitek/vi_dbg"));
                    }
                    "auto" => self.write_vidbg_auto(),
                    _ => {
                        let v: Vec<u32> = std::iter::once(first)
                            .chain(it)
                            .map(|x| x.parse().unwrap())
                            .collect();
                        self.write_vidbg(&v);
                    }
                }
            }
            "nack" => self.nack = it.next() == Some("on"),
            "carveout" => {
                let v = it.next().unwrap();
                self.carveout = if v == "none" {
                    String::new()
                } else {
                    format!("{v}\n")
                };
            }
            "frame" => self.media.frame_id = it.next().unwrap().parse().unwrap(),
            "signal" => self.media.signal = it.next() == Some("on"),
            "venc" => {
                let _what = it.next();
                let v = it.next().unwrap();
                self.media.venc_fail = if v == "none" {
                    String::new()
                } else {
                    v.to_string()
                };
            }
            _ => panic!("unknown scenario line: {line}"),
        }
    }

    fn apply_due(&mut self, until: u64) {
        while self.actions.front().is_some_and(|a| a.0 <= until) {
            let (t, line) = self.actions.pop_front().unwrap();
            if t > self.now {
                self.now = t;
            }
            self.apply(&line);
        }
    }

    fn waits_on_time(s: &SimThread) -> bool {
        s.st == State::Sleeping || (s.st == State::MutexWait && s.timed)
    }

    /// The next thread to run, advancing virtual time; None when none can run.
    fn pick_next(&mut self) -> Option<usize> {
        loop {
            let runnable = (0..self.sims.len())
                .filter(|&i| self.sims[i].st == State::Runnable)
                .min_by_key(|&i| self.sims[i].seq);
            if runnable.is_some() {
                return runnable;
            }
            let Some(best) = (0..self.sims.len())
                .filter(|&i| Self::waits_on_time(&self.sims[i]))
                .min_by_key(|&i| (self.sims[i].wake, self.sims[i].seq))
            else {
                assert!(
                    !self.sims.iter().any(|s| s.st == State::MutexWait),
                    "deadlock"
                );
                return None;
            };
            let wake = self.sims[best].wake;
            if let Some(&(t, _)) = self.actions.front()
                && t <= wake
            {
                self.apply_due(t);
                continue;
            }
            if wake > self.now {
                self.now = wake;
            }
            let s = &mut self.sims[best];
            if s.st == State::MutexWait {
                s.timed_out = true;
            }
            s.st = State::Runnable;
            return Some(best);
        }
    }
}

impl Sched {
    fn world(&self) -> MutexGuard<'_, World> {
        self.w.lock().unwrap_or_else(|e| e.into_inner())
    }

    /// Hands the baton on; with `wait`, blocks until it comes back.
    fn hand_off<'a>(
        &'a self,
        mut w: MutexGuard<'a, World>,
        me: usize,
        wait: bool,
    ) -> MutexGuard<'a, World> {
        let next = w.pick_next();
        if next == Some(me) {
            return w;
        }
        if let Some(n) = next {
            w.sims[n].go = true;
            self.cv.notify_all();
        }
        if !wait {
            return w;
        }
        let mut w = self.cv.wait_while(w, |w| !w.sims[me].go).unwrap();
        w.sims[me].go = false;
        w
    }

    fn sleep<'a>(&'a self, mut w: MutexGuard<'a, World>, ms: u64) -> MutexGuard<'a, World> {
        let me = SIM.get();
        w.seq += 1;
        let (now, seq) = (w.now, w.seq);
        let s = &mut w.sims[me];
        s.st = State::Sleeping;
        s.wake = now + ms;
        s.seq = seq;
        self.hand_off(w, me, true)
    }
}

impl TestPlatform {
    fn w(&self) -> MutexGuard<'_, World> {
        self.0.world()
    }
}

impl Platform for TestPlatform {
    fn now_ms(&self) -> u64 {
        BASE_MS + self.w().now
    }

    fn sleep_ms(&self, ms: u64) {
        let w = self.w();
        drop(self.0.sleep(w, ms));
    }

    fn spawn(&self, _name: &str, f: Box<dyn FnOnce() + Send>) -> Option<ThreadHandle> {
        let mut w = self.w();
        w.seq += 1;
        let seq = w.seq;
        w.sims.push(SimThread::new(seq));
        let id = w.sims.len() - 1;
        let sched = Arc::clone(&self.0);
        let handle = thread::spawn(move || {
            SIM.set(id);
            {
                let w = sched.world();
                let mut w = sched.cv.wait_while(w, |w| !w.sims[id].go).unwrap();
                w.sims[id].go = false;
            }
            f();
            let mut w = sched.world();
            w.sims[id].st = State::Done;
            drop(sched.hand_off(w, id, false));
        });
        w.os_threads.insert(id, handle);
        Some(id)
    }

    fn join(&self, thread: ThreadHandle, deadline_ms: u64) -> bool {
        let deadline = deadline_ms.saturating_sub(BASE_MS);
        let mut w = self.w();
        while w.sims[thread].st != State::Done && w.now < deadline {
            w = self.0.sleep(w, 1);
        }
        if w.sims[thread].st != State::Done {
            return false;
        }
        let handle = w.os_threads.remove(&thread);
        drop(w);
        if let Some(h) = handle {
            h.join().unwrap();
        }
        true
    }

    fn lock(&self, deadline_ms: Option<u64>) -> bool {
        let me = SIM.get();
        let mut w = self.w();
        while w.owner.is_some_and(|o| o != me) {
            w.seq += 1;
            let seq = w.seq;
            let s = &mut w.sims[me];
            s.st = State::MutexWait;
            s.timed = deadline_ms.is_some();
            s.timed_out = false;
            if let Some(d) = deadline_ms {
                s.wake = d.saturating_sub(BASE_MS);
            }
            s.seq = seq;
            w = self.0.hand_off(w, me, true);
            w.sims[me].timed = false;
            if w.sims[me].timed_out && w.owner.is_some_and(|o| o != me) {
                return false;
            }
        }
        w.owner = Some(me);
        true
    }

    fn unlock(&self) {
        let mut w = self.w();
        w.owner = None;
        for s in &mut w.sims {
            if s.st == State::MutexWait {
                s.st = State::Runnable;
            }
        }
    }

    fn i2c_write(&self, addr: u8, bytes: &[u8]) -> bool {
        let mut w = self.w();
        let nack = w.nack || addr != 0x2b;
        w.trace(format!(
            "i2c {addr:02x} w{}{}",
            if nack { " NACK" } else { "" },
            hex(bytes)
        ));
        if nack {
            return false;
        }
        if bytes.len() >= 2 && bytes[0] == 0xff {
            w.bank = bytes[1];
        } else if bytes.len() == 1 {
            w.ptr = bytes[0];
        } else {
            let bank = w.bank as usize;
            for (i, &b) in bytes.iter().enumerate().skip(1) {
                w.regs[bank][bytes[0].wrapping_add(i as u8 - 1) as usize] = b;
            }
        }
        true
    }

    fn i2c_read(&self, addr: u8, buf: &mut [u8]) -> bool {
        let mut w = self.w();
        if w.nack || addr != 0x2b {
            w.trace(format!("i2c {addr:02x} r NACK {}", buf.len()));
            return false;
        }
        let bank = w.bank as usize;
        for (i, b) in buf.iter_mut().enumerate() {
            *b = w.regs[bank][w.ptr.wrapping_add(i as u8) as usize];
        }
        w.ptr = w.ptr.wrapping_add(buf.len() as u8);
        w.trace(format!("i2c {addr:02x} r{}", hex(buf)));
        true
    }

    fn read(&self, path: &str, limit: usize) -> Option<Vec<u8>> {
        let mut w = self.w();
        if path == "/proc/cvitek/vi_dbg" && w.host(path).exists() {
            let ms = w.vidbg_ms;
            w = self.0.sleep(w, ms);
            if w.media.vidbg_auto {
                w.write_vidbg_auto();
            }
        }
        if path == "/proc/lt_int" {
            w.write_lt_file();
        }
        let mut data = fs::read(w.host(path)).ok()?;
        data.truncate(limit);
        Some(data)
    }

    fn exists(&self, path: &str) -> bool {
        let w = self.w();
        if path == "/proc/lt_int" {
            w.write_lt_file();
        }
        w.host(path).exists()
    }

    fn write(&self, path: &str, data: &[u8]) -> bool {
        let mut w = self.w();
        if path == "/proc/lt_int" {
            w.lt_count = atoi(&String::from_utf8_lossy(data));
            w.write_lt_file();
        } else {
            w.put_file(path, data);
        }
        w.trace(format!("write {path} {}", quote(data)));
        true
    }

    fn write_atomic(&self, path: &str, data: &[u8]) -> bool {
        let mut w = self.w();
        w.put_file(path, data);
        w.trace(format!("write {path} {}", quote(data)));
        true
    }

    fn sync(&self) {
        self.w().trace("run sync".to_string());
    }

    fn run(&self, cmd: Command) {
        let mut w = self.w();
        match cmd {
            Command::HdmiVersion => {
                w.trace("run /kvmapp/system/init.d/S15kvmhwd get_hdmi_version".to_string());
                let chip = format!("{}\n", w.chip);
                w.put_file("/etc/kvm/hdmi_version", chip.as_bytes());
            }
            Command::Reboot => w.trace("run reboot".to_string()),
        }
    }

    fn carveout_usage(&self) -> Option<String> {
        let mut w = self.w();
        let c = w.carveout.clone();
        if c.is_empty() {
            w.trace("run carveout usage".to_string());
            return None;
        }
        w.trace(format!(
            "run carveout usage -> {}",
            c.trim_end_matches('\n')
        ));
        Some(c)
    }

    fn publish_vi_state(&self, s: &ViState) -> bool {
        let mut w = self.w();
        w.vi_seq += 2;
        let seq = w.vi_seq;
        w.trace(format!(
            "vi_state seq={seq} dev_fps={} fps={} width_gt={} width_ls={} height_gt={} height_ls={}",
            s.dev_fps, s.fps, s.width_gt, s.width_ls, s.height_gt, s.height_ls
        ));
        true
    }

    fn gpio_claim(&self, name: &str, consumer: &str, high: bool) -> Option<GpioHandle> {
        let mut w = self.w();
        if !(w.gpio_line && name == "hdmi-reset") {
            return None;
        }
        w.trace(format!(
            "gpio claim offset={GPIO_OFFSET} lines=1 out=1 value={} consumer={consumer}",
            u8::from(high)
        ));
        Some(0)
    }

    fn gpio_set(&self, _line: GpioHandle, high: bool) {
        self.w()
            .trace(format!("gpio hdmi-reset {}", u8::from(high)));
    }

    fn cam_create(&self, w_: u16, h: u16) -> bool {
        let mut w = self.w();
        if w.media.cam_fail {
            w.trace(format!("cam create {w_}x{h} fail"));
            w.media.mmf_init = true;
            return false;
        }
        w.vi_start();
        let input = w.media.input;
        w.trace(format!("cam create {w_}x{h} in={}x{}", input.0, input.1));
        w.media.mmf_init = true;
        w.media.cam_open = true;
        w.media.cam = (w_, h);
        true
    }

    fn cam_restart(&self, w_: u16, h: u16) {
        let mut w = self.w();
        w.vi_start();
        let input = w.media.input;
        w.trace(format!("cam restart {w_}x{h} in={}x{}", input.0, input.1));
        w.media.cam_open = true;
        w.media.cam = (w_, h);
        let ms = w.media.restart_ms;
        if ms != 0 {
            drop(self.0.sleep(w, ms));
        }
    }

    fn cam_set_size(&self, w_: u16, h: u16) -> bool {
        let mut w = self.w();
        w.trace(format!("cam size {w_}x{h}"));
        w.media.cam = (w_, h);
        true
    }

    fn cam_mirror_flip(&self) {
        self.w().trace("cam mirror_flip".to_string());
    }

    fn cam_close(&self) {
        let mut w = self.w();
        w.trace("cam close".to_string());
        w.media.cam_open = false;
    }

    fn mmf_is_init(&self) -> bool {
        self.w().media.mmf_init
    }

    fn mmf_deinit(&self, force: bool) {
        let mut w = self.w();
        w.trace(format!("mmf deinit{}", if force { " force" } else { "" }));
        w.media.mmf_init = false;
    }

    fn frame_read(&self) -> Option<(u16, u16, usize)> {
        let mut w = self.w();
        if !w.media.cam_open || !w.frames_flow() {
            drop(self.0.sleep(w, 1000));
            return None;
        }
        let ms = w.media.frame_ms;
        w = self.0.sleep(w, ms);
        let (cw, ch) = w.media.cam;
        let size = cw as usize * ch as usize * 3 / 2;
        let id = w.media.frame_id;
        w.media.fb = vec![id; size];
        Some((cw, ch, size))
    }

    fn frame_pixels(&self, f: &mut dyn FnMut(Option<&[u8]>)) {
        let w = self.w();
        f(Some(&w.media.fb));
    }

    fn frame_release(&self) {}

    fn frame_jpeg(&self, quality: u8, out: &mut Vec<u8>, headroom: usize) -> Option<u32> {
        let mut w = self.w();
        let size = 1000 + u32::from(quality);
        out.clear();
        out.resize(headroom, 0);
        out.resize(headroom + size as usize, 0xd8);
        let (cw, ch) = w.media.cam;
        w.media.last = format!("jpeg {cw}x{ch} q{quality}");
        Some(size)
    }

    fn venc_add(&self, ch: u8, w_: u16, h: u16, gop: u32, fps: u32, bitrate: u32) -> bool {
        let mut w = self.w();
        let fail = w.media.venc_fail == "add";
        w.trace(format!(
            "venc add {ch} {w_}x{h} gop={gop} fps={fps}/{fps} bitrate={bitrate}{}",
            if fail { " fail" } else { "" }
        ));
        if fail {
            return false;
        }
        w.media.idr_pending = true;
        true
    }

    fn venc_del(&self, ch: u8) {
        self.w().trace(format!("venc del {ch}"));
    }

    fn frame_venc_push(&self, _ch: u8) -> bool {
        let mut w = self.w();
        let (cw, chh) = w.media.cam;
        w.media.last = format!("h264 {cw}x{chh}");
        w.media.venc_fail != "push"
    }

    fn venc_pop(&self, _ch: u8, f: &mut dyn FnMut(&[&[u8]])) -> bool {
        static DATA: [u8; 8000] = [0; 8000];
        let mut w = self.w();
        if w.media.venc_fail == "pop" {
            return false;
        }
        if w.media.idr_pending {
            w.media.idr_pending = false;
            w.media.last.push_str(" I");
            drop(w);
            f(&[&DATA[..12], &DATA[..5], &DATA[..6000]]);
        } else {
            w.media.last.push_str(" P");
            drop(w);
            f(&[&DATA[..700]]);
        }
        true
    }

    fn venc_free(&self, _ch: u8) {}

    fn venc_request_idr(&self, ch: u8) -> bool {
        let mut w = self.w();
        w.trace(format!("venc idr {ch}"));
        w.media.idr_pending = true;
        true
    }
}

struct Scenario {
    calls: Vec<(u64, String)>,
    end: u64,
}

fn load(path: &Path, root: &Path) -> (World, Scenario) {
    let mut w = World {
        sims: vec![SimThread::new(0)],
        seq: 0,
        now: 0,
        owner: None,
        os_threads: HashMap::new(),
        out: String::new(),
        pending: Pending::default(),
        root: root.to_path_buf(),
        actions: VecDeque::new(),
        chip: "ux".to_string(),
        gpio_line: false,
        regs: vec![[0; 256]; 256],
        bank: 0,
        ptr: 0,
        nack: false,
        lt_count: 0,
        lt_exists: true,
        vidbg_ms: 1000,
        carveout: String::new(),
        vi_seq: 0,
        media: Media {
            signal: false,
            src: (0, 0),
            input: (0, 0),
            vidbg_auto: false,
            frame_ms: 16,
            restart_ms: 0,
            frame_id: 1,
            cam_fail: false,
            mmf_init: false,
            venc_fail: String::new(),
            idr_pending: false,
            cam: (0, 0),
            cam_open: false,
            last: String::new(),
            fb: Vec::new(),
        },
    };
    for dir in ["tmp", "etc/kvm", "kvmapp/kvm", "dev/shm", "proc/cvitek"] {
        fs::create_dir_all(root.join(dir)).unwrap();
    }
    let mut calls = Vec::new();
    let mut end = None;
    let mut t = 0;
    let text = fs::read_to_string(path).unwrap();
    for raw in text.lines() {
        let line = raw.trim_start();
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        let mut it = line.split_whitespace();
        match it.next().unwrap() {
            "at" => t = it.next().unwrap().parse().unwrap(),
            "chip" => w.chip = it.next().unwrap().to_string(),
            "board" => {
                let b = it.next().unwrap();
                if b != "none" {
                    w.put_file("/etc/kvm/hw", format!("{b}\n").as_bytes());
                }
                w.gpio_line = b == "pcie";
            }
            "nogpio" => w.gpio_line = false,
            "nolt" => w.lt_exists = false,
            "vidbg_ms" => w.vidbg_ms = it.next().unwrap().parse().unwrap(),
            "frame_ms" => w.media.frame_ms = it.next().unwrap().parse().unwrap(),
            "restart_ms" => w.media.restart_ms = it.next().unwrap().parse().unwrap(),
            "cam" => w.media.cam_fail = it.next() == Some("fail"),
            "call" => calls.push((t, line[5..].to_string())),
            "end" => end = Some(t),
            _ => w.actions.push_back((t, line.to_string())),
        }
    }
    w.actions.make_contiguous().sort_by_key(|a| a.0);
    let end = end.expect("scenario has no end");
    (w, Scenario { calls, end })
}

fn call(e: &Arc<Engine<TestPlatform>>, p: &TestPlatform, text: &str) {
    let trace = |s: String| p.w().trace(s);
    let mut it = text.split_whitespace();
    let name = it.next().unwrap();
    let mut n = || -> u32 { it.next().unwrap().parse().unwrap() };
    let read = |w: u32, h: u32, kind: u8, q: u32| {
        p.w().media.last.clear();
        let (data, r) = e.read_img(w as u16, h as u16, kind, q as u16, 0);
        let last = p.w().media.last.clone();
        if data.is_empty() {
            trace(format!("call {text} -> {r}"));
        } else {
            trace(format!("call {text} -> {r} {last} size={}", data.len()));
        }
    };
    match name {
        "init" => {
            trace("call init".to_string());
            e.init();
            e.hdmi_control(false);
            p.sleep_ms(10);
            let disabled = p.w().host("/etc/kvm/hdmi_disable").exists();
            if !disabled {
                e.hdmi_control(true);
            }
        }
        "hdmi" => {
            let en = n();
            trace(format!("call hdmi {en}"));
            let r = e.hdmi_control(en != 0);
            trace(format!("call hdmi {en} -> {r}"));
        }
        "mjpeg" => {
            let (w, h, q) = (n(), n(), n());
            read(w, h, 0, q);
        }
        "h264" => {
            let (w, h, fps, rate) = (n(), n(), n(), n());
            e.set_h264_fps(fps as u8);
            read(w, h, 1, rate);
        }
        "detect" => {
            let v = n();
            trace(format!("call detect {v}"));
            e.set_frame_detect(v as u8);
        }
        "idr" => {
            trace("call idr".to_string());
            e.request_keyframe();
        }
        "signal" => {
            let s = u8::from(e.hdmi_signal_active());
            trace(format!("call signal -> {s}"));
        }
        "deinit" => {
            trace("call deinit".to_string());
            e.deinit();
            trace("call deinit done".to_string());
        }
        _ => panic!("unknown call: {text}"),
    }
}

fn run_scenario(path: &Path) -> String {
    let dir = tempfile::tempdir().unwrap();
    let (world, sc) = load(path, dir.path());
    let p = TestPlatform(Arc::new(Sched {
        w: Mutex::new(world),
        cv: Condvar::new(),
    }));
    SIM.set(0);
    p.w().apply_due(0);
    let engine = Engine::new(p.clone());
    for (t, text) in &sc.calls {
        let (every, until, text) = match text.find(" every ") {
            Some(pos) => {
                let mut it = text[pos..].split_whitespace();
                it.next();
                let every: u64 = it.next().unwrap().parse().unwrap();
                it.next();
                let until: u64 = it.next().unwrap().parse().unwrap();
                (every, until, &text[..pos])
            }
            None => (0, 0, text.as_str()),
        };
        let now = p.w().now;
        if *t > now {
            p.sleep_ms(t - now);
        }
        if every == 0 {
            call(&engine, &p, text);
            continue;
        }
        let mut next = *t;
        while next < until {
            let now = p.w().now;
            if next > now {
                p.sleep_ms(next - now);
            }
            if p.w().now >= until {
                break;
            }
            call(&engine, &p, text);
            next += every;
        }
    }
    let now = p.w().now;
    if sc.end > now {
        p.sleep_ms(sc.end - now);
    }
    let mut w = p.w();
    w.trace("end".to_string());
    w.flush_pending();
    std::mem::take(&mut w.out)
}

#[test]
fn capture_matches_the_cpp_goldens() {
    let base = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/capture");
    let mut names: Vec<String> = fs::read_dir(base.join("scenarios"))
        .unwrap()
        .filter_map(|e| {
            let name = e.unwrap().file_name().into_string().unwrap();
            name.strip_suffix(".scn").map(str::to_string)
        })
        .collect();
    names.sort();
    assert!(!names.is_empty());
    // CAPTURE_TRACES_OUT=DIR writes each Rust trace there, for diffing.
    let out_dir = std::env::var_os("CAPTURE_TRACES_OUT").map(PathBuf::from);
    let mut failures = Vec::new();
    for name in &names {
        let trace = run_scenario(&base.join("scenarios").join(format!("{name}.scn")));
        if let Some(dir) = &out_dir {
            fs::write(dir.join(format!("{name}.trace")), &trace).unwrap();
        }
        let golden = fs::read_to_string(base.join("golden").join(format!("{name}.trace"))).unwrap();
        let expected_diff = EXPECTED_DIFFERENCES.iter().any(|(n, _)| n == name);
        let reference = if expected_diff {
            if trace == golden {
                failures.push(format!(
                    "{name}: listed as a deliberate difference, but matches the C++"
                ));
                continue;
            }
            fs::read_to_string(base.join("fixed").join(format!("{name}.trace"))).unwrap_or_default()
        } else {
            golden
        };
        if trace != reference {
            let golden = reference;
            let first = trace
                .lines()
                .zip(golden.lines())
                .position(|(a, b)| a != b)
                .unwrap_or(trace.lines().count().min(golden.lines().count()));
            failures.push(format!(
                "{name}: line {}\n  golden: {}\n  rust:   {}",
                first + 1,
                golden.lines().nth(first).unwrap_or("<end>"),
                trace.lines().nth(first).unwrap_or("<end>")
            ));
        }
    }
    assert!(failures.is_empty(), "{}", failures.join("\n"));
}
