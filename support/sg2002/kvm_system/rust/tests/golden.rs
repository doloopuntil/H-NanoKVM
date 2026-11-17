//! Runs the C++ harness scenarios (../harness/scenarios) against the Rust port and
//! compares the traces with the goldens recorded from the C++ (../harness/golden).
//! The scenario semantics and trace format follow ../harness/fake.cpp line for line.

use std::collections::{BTreeMap, BTreeSet, VecDeque};
use std::fmt::Write as _;
use std::fs;
use std::net::Ipv4Addr;
use std::path::{Path, PathBuf};

use kvm_system::{Command, IfaceFlags, KeyEvent, Platform, System};

/// Scenarios where the port deliberately differs from the C++, and why.
const EXPECTED_DIFFERENCES: &[(&str, &str)] = &[(
    "full-wifi-ap-press-connecting",
    "keys are timed by their event timestamps, not after waiting for the status thread",
)];

#[derive(Default, Clone)]
struct Iface {
    up: bool,
    running: bool,
    ip: Option<Ipv4Addr>,
    gateway: Option<Ipv4Addr>,
}

struct Run {
    t: u64,
    bus: u8,
    addr: u8,
    nack: bool,
    mode: u8,
    bytes: Vec<u8>,
}

struct Sim {
    root: PathBuf,
    out: String,
    run: Option<Run>,
    now: u64,
    base: u64,
    ifaces: BTreeMap<String, Iface>,
    i2c_ack: BTreeSet<(u8, u8)>,
    input: bool,
    sta: bool,
    wpa_state: String,
    random_fail: bool,
    rng: u32,
    vi_publish: bool,
    vi_fps: u32,
    shutdown: bool,
    actions: VecDeque<(u64, String)>,
    keys: VecDeque<(u64, bool)>,
    end: u64,
}

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

impl Sim {
    fn new(scenario: &Path, root: PathBuf) -> Sim {
        let mut sim = Sim {
            root,
            out: String::new(),
            run: None,
            now: 0,
            base: 0,
            ifaces: BTreeMap::new(),
            i2c_ack: BTreeSet::new(),
            input: false,
            sta: false,
            wpa_state: "SCANNING".into(),
            random_fail: false,
            rng: 0x2545_F491,
            vi_publish: false,
            vi_fps: 0,
            shutdown: false,
            actions: VecDeque::new(),
            keys: VecDeque::new(),
            end: 0,
        };
        let mut t = 0;
        let mut actions = Vec::new();
        let mut keys = Vec::new();
        for line in fs::read_to_string(scenario).unwrap().lines() {
            let line = line.trim_start_matches([' ', '\t']);
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            let mut words = line.split_whitespace();
            let op = words.next().unwrap();
            match op {
                "at" => t = words.next().unwrap().parse().unwrap(),
                "i2c" => {
                    let num = |s: &str| {
                        if let Some(h) = s.strip_prefix("0x") {
                            u8::from_str_radix(h, 16)
                        } else {
                            s.parse()
                        }
                        .unwrap()
                    };
                    let bus = num(words.next().unwrap());
                    let addr = num(words.next().unwrap());
                    sim.i2c_ack.insert((bus, addr));
                }
                "input" => sim.input = true,
                "clock" => sim.base = words.next().unwrap().parse().unwrap(),
                "key" => {
                    actions.push((t, line.to_string()));
                    match words.next().unwrap() {
                        "press" => {
                            let ms: u64 = words.next().unwrap().parse().unwrap();
                            keys.push((t, true));
                            keys.push((t + ms, false));
                        }
                        what => keys.push((t, what == "down")),
                    }
                }
                _ => {
                    if op == "end" {
                        sim.end = t;
                    }
                    actions.push((t, line.to_string()));
                }
            }
        }
        actions.sort_by_key(|a| a.0);
        keys.sort_by_key(|k| k.0);
        sim.actions = actions.into();
        sim.keys = keys.into();
        assert!(sim.end > 0, "scenario has no end");
        sim
    }

    fn host(&self, path: &str) -> PathBuf {
        self.root.join(path.trim_start_matches('/'))
    }

    fn flush_run(&mut self) {
        let Some(run) = self.run.take() else {
            return;
        };
        let mode = match run.mode {
            0x00 => 'C',
            0x40 => 'D',
            _ => '?',
        };
        write!(
            self.out,
            "@{} i2c {}:{:02x} {}{}",
            run.t,
            run.bus,
            run.addr,
            if run.nack { "NACK " } else { "" },
            mode
        )
        .unwrap();
        let b = &run.bytes;
        let mut i = 0;
        while i < b.len() {
            let mut j = i;
            while j < b.len() && b[j] == b[i] {
                j += 1;
            }
            if j - i >= 4 {
                write!(self.out, " {:02x}*{}", b[i], j - i).unwrap();
                i = j;
            } else {
                write!(self.out, " {:02x}", b[i]).unwrap();
                i += 1;
            }
        }
        self.out.push('\n');
    }

    fn trace(&mut self, line: &str) {
        self.flush_run();
        writeln!(self.out, "@{} {}", self.now, line).unwrap();
    }

    fn put_file(&self, path: &str, data: &[u8]) {
        let host = self.host(path);
        fs::create_dir_all(host.parent().unwrap()).unwrap();
        fs::write(host, data).unwrap();
    }

    fn write_route_file(&self) {
        let mut s = String::from(
            "Iface\tDestination\tGateway \tFlags\tRefCnt\tUse\tMetric\tMask\t\tMTU\tWindow\tIRTT\n",
        );
        for (name, f) in &self.ifaces {
            if let Some(gw) = f.gateway {
                let raw = u32::from_le_bytes(gw.octets());
                writeln!(
                    s,
                    "{name}\t00000000\t{raw:08X}\t0003\t0\t0\t0\t00000000\t0\t0\t0"
                )
                .unwrap();
            }
        }
        self.put_file("/proc/net/route", s.as_bytes());
    }

    fn publish_vi(&self) {
        if !self.vi_publish {
            return;
        }
        let words = [
            2u32,
            0x4e4b_5649,
            1,
            (self.base + self.now) as u32,
            self.vi_fps,
            self.vi_fps,
            0,
            0,
            0,
            0,
        ];
        let bytes: Vec<u8> = words.iter().flat_map(|w| w.to_ne_bytes()).collect();
        self.put_file("/dev/shm/nanokvm_vi_state", &bytes);
    }

    fn apply(&mut self, line: &str) {
        self.trace(&format!("> {line}"));
        let mut words = line.split_whitespace();
        let op = words.next().unwrap();
        let ip = |s: Option<&str>| {
            s.filter(|s| *s != "-")
                .map(|s| s.parse::<Ipv4Addr>().unwrap())
        };
        match op {
            "file" => {
                let path = words.next().unwrap();
                let rest = line.splitn(3, ' ').nth(2).unwrap_or("");
                self.put_file(path, &unescape(rest));
            }
            "rm" => {
                let _ = fs::remove_file(self.host(words.next().unwrap()));
            }
            "iface" => {
                let name = words.next().unwrap().to_string();
                let state = words.next().unwrap();
                if state == "absent" {
                    self.ifaces.remove(&name);
                } else {
                    let address = ip(words.next());
                    let f = self.ifaces.entry(name).or_default();
                    f.up = state == "up" || state == "running";
                    f.running = state == "running";
                    f.ip = address;
                }
                self.write_route_file();
            }
            "route" => {
                let name = words.next().unwrap().to_string();
                let gw = ip(words.next());
                self.ifaces.entry(name).or_default().gateway = gw;
                self.write_route_file();
            }
            "vi" => match words.next().unwrap() {
                "off" => {
                    self.vi_publish = false;
                    let _ = fs::remove_file(self.host("/dev/shm/nanokvm_vi_state"));
                }
                "freeze" => self.vi_publish = false,
                fps => {
                    self.vi_publish = true;
                    self.vi_fps = fps.parse().unwrap();
                    self.publish_vi();
                }
            },
            "sta" => self.sta = words.next() == Some("on"),
            "wpa" => self.wpa_state = words.next().unwrap().to_string(),
            "random" => self.random_fail = words.next() == Some("fail"),
            "key" => {}
            "end" => self.shutdown = true,
            _ => panic!("unknown scenario line: {line}"),
        }
    }

    fn apply_due(&mut self, until: u64) {
        while self.actions.front().is_some_and(|a| a.0 <= until) {
            let (t, line) = self.actions.pop_front().unwrap();
            if t > self.now {
                self.now = t;
            }
            self.publish_vi();
            self.apply(&line);
        }
    }
}

impl Platform for Sim {
    fn now_ms(&mut self) -> u64 {
        self.base + self.now
    }

    fn shutdown_requested(&mut self) -> bool {
        self.shutdown
    }

    fn open_key_device(&mut self) -> bool {
        self.input
    }

    fn next_key(&mut self, deadline_ms: u64) -> Option<KeyEvent> {
        let deadline = deadline_ms - self.base;
        loop {
            if let Some(&(t, pressed)) = self.keys.front().filter(|k| k.0 <= self.now) {
                self.keys.pop_front();
                return Some(KeyEvent {
                    time_ms: self.base + t,
                    pressed,
                });
            }
            if self.now >= deadline || self.shutdown {
                return None;
            }
            let mut next = deadline;
            if let Some(k) = self.keys.front() {
                next = next.min(k.0);
            }
            if let Some(a) = self.actions.front() {
                next = next.min(a.0);
            }
            if self.actions.front().is_some_and(|a| a.0 <= next) {
                self.apply_due(next);
            } else {
                self.now = next;
                self.publish_vi();
            }
        }
    }

    fn i2c_write(&mut self, bus: u8, addr: u8, bytes: &[u8]) -> bool {
        if !self.i2c_ack.iter().any(|d| d.0 == bus) {
            return false;
        }
        let nack = !self.i2c_ack.contains(&(bus, addr));
        if bytes.len() != 2 {
            let hex: String = bytes.iter().map(|b| format!(" {b:02x}")).collect();
            self.trace(&format!(
                "i2c {bus}:{addr:02x} {}raw{hex}",
                if nack { "NACK " } else { "" }
            ));
            return !nack;
        }
        let now = self.now;
        let same = self.run.as_ref().is_some_and(|r| {
            r.t == now && r.bus == bus && r.addr == addr && r.nack == nack && r.mode == bytes[0]
        });
        if !same {
            self.flush_run();
            self.run = Some(Run {
                t: now,
                bus,
                addr,
                nack,
                mode: bytes[0],
                bytes: Vec::new(),
            });
        }
        self.run.as_mut().unwrap().bytes.push(bytes[1]);
        !nack
    }

    fn read(&mut self, path: &str, limit: usize) -> Option<Vec<u8>> {
        let mut data = fs::read(self.host(path)).ok()?;
        data.truncate(limit);
        Some(data)
    }

    fn exists(&mut self, path: &str) -> bool {
        self.host(path).exists()
    }

    fn write(&mut self, path: &str, data: &[u8]) -> bool {
        if fs::write(self.host(path), data).is_err() {
            return false;
        }
        self.trace(&format!("write {path} {}", quote(data)));
        true
    }

    fn set_marker(&mut self, path: &str, present: bool) {
        let host = self.host(path);
        if present && !host.exists() {
            if fs::write(&host, b"").is_ok() {
                self.trace(&format!("create {path} 0644"));
            }
        } else if !present && fs::remove_file(&host).is_ok() {
            self.trace(&format!("unlink {path}"));
        }
    }

    fn remove(&mut self, path: &str) {
        if fs::remove_file(self.host(path)).is_ok() {
            self.trace(&format!("unlink {path}"));
        }
    }

    fn write_secret(&mut self, path: &str, data: &[u8]) -> bool {
        let scratch = format!("{path}.new");
        self.remove(&scratch);
        if fs::write(self.host(&scratch), data).is_err() {
            return false;
        }
        self.trace(&format!("create {scratch} 0600"));
        self.trace(&format!("chmod {scratch} 0600"));
        if !data.is_empty() {
            self.trace(&format!("write {scratch} {}", quote(data)));
        }
        fs::rename(self.host(&scratch), self.host(path)).unwrap();
        self.trace(&format!("rename {scratch} {path}"));
        true
    }

    fn run(&mut self, cmd: Command) -> Option<String> {
        self.trace(&format!("run {}", cmd.argv().join(" ")));
        Some(match cmd {
            Command::HostapdAllSta if self.sta => {
                "02:11:22:33:44:55\nflags=[AUTH][ASSOC][AUTHORIZED]\naid=1\ncapability=0x431\n"
                    .into()
            }
            Command::WpaStatus => {
                format!(
                    "bssid=00:00:00:00:00:00\nwpa_state={}\naddress=02:00:00:00:00:01\n",
                    self.wpa_state
                )
            }
            _ => String::new(),
        })
    }

    fn iface_flags(&mut self, name: &str) -> Option<IfaceFlags> {
        self.ifaces.get(name).map(|f| IfaceFlags {
            up: f.up,
            running: f.running,
        })
    }

    fn iface_ipv4(&mut self, name: &str) -> Option<Ipv4Addr> {
        self.ifaces.get(name).and_then(|f| f.ip)
    }

    fn random(&mut self, buf: &mut [u8]) -> bool {
        if self.random_fail {
            return false;
        }
        for b in buf {
            self.rng ^= self.rng << 13;
            self.rng ^= self.rng >> 17;
            self.rng ^= self.rng << 5;
            *b = (self.rng >> 24) as u8;
        }
        true
    }
}

fn run_scenario(scenario: &Path) -> String {
    let root = std::env::temp_dir().join(format!(
        "kvm-system-golden-{}-{}",
        std::process::id(),
        scenario.file_stem().unwrap().to_string_lossy()
    ));
    let _ = fs::remove_dir_all(&root);
    fs::create_dir_all(&root).unwrap();
    let mut sim = Sim::new(scenario, root.clone());
    sim.write_route_file();
    sim.apply_due(0);
    let mut system = System::new(sim);
    system.run();
    let mut sim = system.into_platform();
    sim.flush_run();
    let end = sim.end;
    writeln!(sim.out, "@{end} exit 0").unwrap();
    fs::remove_dir_all(&root).unwrap();
    sim.out
}

#[test]
fn goldens() {
    let harness = Path::new(env!("CARGO_MANIFEST_DIR")).join("../harness");
    let out_dir = std::env::var_os("KVM_SYSTEM_TRACE_DIR").map(PathBuf::from);
    let mut names: Vec<_> = fs::read_dir(harness.join("scenarios"))
        .unwrap()
        .map(|e| e.unwrap().path())
        .filter(|p| p.extension().is_some_and(|e| e == "scn"))
        .collect();
    names.sort();
    let mut failures = Vec::new();
    for scenario in &names {
        let name = scenario.file_stem().unwrap().to_string_lossy().into_owned();
        let got = run_scenario(scenario);
        if let Some(dir) = &out_dir {
            fs::write(dir.join(format!("{name}.trace")), &got).unwrap();
        }
        let want =
            fs::read_to_string(harness.join("golden").join(format!("{name}.trace"))).unwrap();
        let expected_diff = EXPECTED_DIFFERENCES.iter().find(|d| d.0 == name);
        match (got == want, expected_diff) {
            (true, None) => eprintln!("ok      {name}"),
            (false, Some((_, why))) => eprintln!("differs {name} (expected: {why})"),
            (true, Some(_)) => failures.push(format!("{name}: expected a difference, got none")),
            (false, None) => {
                let line = got
                    .lines()
                    .zip(want.lines())
                    .position(|(a, b)| a != b)
                    .unwrap_or(0);
                failures.push(format!(
                    "{name}: first difference at line {}\n  want: {}\n  got:  {}",
                    line + 1,
                    want.lines().nth(line).unwrap_or("<end>"),
                    got.lines().nth(line).unwrap_or("<end>")
                ));
            }
        }
    }
    assert!(failures.is_empty(), "{}", failures.join("\n"));
}
