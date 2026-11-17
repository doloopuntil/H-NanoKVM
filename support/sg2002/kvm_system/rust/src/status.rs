//! Status from files and interfaces (system_state.cpp), and the wifi_state file.

use std::net::Ipv4Addr;

use crate::oled::{TYPE_H264, TYPE_MJPG};
use crate::{Platform, System};

const VI_SHARED_PATH: &str = "/dev/shm/nanokvm_vi_state";
const VI_SHARED_MAGIC: u32 = 0x4e4b_5649;
const VI_SHARED_SIZE: usize = 40;
const VI_SHARED_TTL_MS: u32 = 30_000;
const VI_FALLBACK_TTL_MS: u32 = 10_000;
const RTF_GATEWAY: u64 = 0x2;

/// HDMI state between reads (the statics of kvm_update_hdmi_state).
#[derive(Debug)]
pub(crate) struct HdmiCache {
    check_times: u8,
    fallback_fps: u32,
    fallback_updated_ms: u32,
    fallback_attempted_ms: Option<u32>,
    fallback_valid: bool,
    shared_failure_logged: bool,
    fallback_failure_logged: bool,
}

impl Default for HdmiCache {
    fn default() -> Self {
        HdmiCache {
            check_times: 4,
            fallback_fps: 0,
            fallback_updated_ms: 0,
            fallback_attempted_ms: None,
            fallback_valid: false,
            shared_failure_logged: false,
            fallback_failure_logged: false,
        }
    }
}

/// C strtoul(s, NULL, 10): spaces, a sign, digits; saturates; "-n" wraps.
pub(crate) fn strtoul(s: &[u8]) -> u64 {
    let mut i = 0;
    while i < s.len() && matches!(s[i], b' ' | b'\t' | b'\n' | 0x0b | 0x0c | b'\r') {
        i += 1;
    }
    let negative = i < s.len() && s[i] == b'-';
    if i < s.len() && (s[i] == b'+' || s[i] == b'-') {
        i += 1;
    }
    let mut value: u64 = 0;
    let mut overflow = false;
    while i < s.len() && s[i].is_ascii_digit() {
        match value
            .checked_mul(10)
            .and_then(|v| v.checked_add((s[i] - b'0') as u64))
        {
            Some(v) => value = v,
            None => overflow = true,
        }
        i += 1;
    }
    if overflow {
        return u64::MAX;
    }
    if negative {
        value.wrapping_neg()
    } else {
        value
    }
}

/// C atoi for the small numbers in /kvmapp/kvm (wraps where C is undefined).
fn atoi(s: &[u8]) -> i64 {
    let mut i = 0;
    while i < s.len() && matches!(s[i], b' ' | b'\t' | b'\n' | 0x0b | 0x0c | b'\r') {
        i += 1;
    }
    let negative = i < s.len() && s[i] == b'-';
    if i < s.len() && (s[i] == b'+' || s[i] == b'-') {
        i += 1;
    }
    let mut value: i64 = 0;
    while i < s.len() && s[i].is_ascii_digit() {
        value = value.wrapping_mul(10).wrapping_add((s[i] - b'0') as i64);
        i += 1;
    }
    if negative {
        value.wrapping_neg()
    } else {
        value
    }
}

fn stream_quality_bucket(raw: u64, stream_type: i8) -> i16 {
    let limits: [u64; 3] = if stream_type == TYPE_MJPG as i8 {
        [60, 75, 90]
    } else {
        [1500, 2500, 3500]
    };
    limits
        .iter()
        .position(|&l| raw < l)
        .map_or(4, |i| i as i16 + 1)
}

/// The default IPv4 gateway of `iface` in /proc/net/route.
fn default_gateway(route: &[u8], iface: &str) -> Option<Ipv4Addr> {
    let text = String::from_utf8_lossy(route);
    for line in text.lines().skip(1) {
        let mut f = line.split_whitespace();
        let (Some(name), Some(dest), Some(gw), Some(flags)) =
            (f.next(), f.next(), f.next(), f.next())
        else {
            continue;
        };
        let hex = |s: &str| u64::from_str_radix(s.trim_start_matches("0x"), 16).ok();
        let (Some(dest), Some(gw), Some(flags)) = (hex(dest), hex(gw), hex(flags)) else {
            continue;
        };
        if name != iface || dest != 0 || flags & RTF_GATEWAY == 0 {
            continue;
        }
        // The kernel prints the network-order address as a host (little-endian) integer.
        return Some(Ipv4Addr::from((gw as u32).to_le_bytes()));
    }
    None
}

/// VIFPS from /proc/cvitek/vi_dbg, parsed like sscanf(" %31[^ :\t] %*[: \t] %u").
fn proc_vi_fps(text: &[u8]) -> Option<u32> {
    let mut fps = None;
    for line in text.split(|&b| b == b'\n') {
        let line = line.trim_ascii_start();
        let end = line
            .iter()
            .position(|b| b" :\t".contains(b))
            .unwrap_or(line.len());
        let (field, rest) = line.split_at(end);
        if field.is_empty() || field.len() > 31 {
            continue;
        }
        // Whitespace, then at least one ':' (the whitespace is gone), then [: \t]*.
        let rest = rest.trim_ascii_start();
        if rest.first() != Some(&b':') {
            continue;
        }
        let start = rest
            .iter()
            .position(|b| !b": \t".contains(b))
            .unwrap_or(rest.len());
        let value = rest[start..].trim_ascii_start();
        let signed = matches!(value.first(), Some(b'+' | b'-'));
        if !value.get(signed as usize).is_some_and(u8::is_ascii_digit) {
            continue;
        }
        if field == b"VIFPS" {
            fps = Some(strtoul(value) as u32);
        }
    }
    fps
}

impl<P: Platform> System<P> {
    fn iface_running(&mut self, name: &str) -> bool {
        self.p.iface_flags(name).is_some_and(|f| f.up && f.running)
    }

    fn interface_ip(&mut self, name: &str) -> String {
        self.p
            .iface_ipv4(name)
            .map(|a| a.to_string())
            .unwrap_or_default()
    }

    pub(crate) fn refresh_wifi_addr(&mut self) -> bool {
        self.sys.wifi_addr = self.interface_ip("wlan0");
        !self.sys.wifi_addr.is_empty()
    }

    fn gateway(&mut self, iface: &str) -> String {
        self.p
            .read("/proc/net/route", 64 * 1024)
            .and_then(|r| default_gateway(&r, iface))
            .map(|a| a.to_string())
            .unwrap_or_default()
    }

    /// Text file contents, or None when missing or empty (the value is then kept).
    fn read_text(&mut self, path: &str, limit: usize) -> Option<Vec<u8>> {
        self.p.read(path, limit).filter(|d| !d.is_empty())
    }

    /// 0 down, 1 link without an address, 2 address, 3 address and a default route.
    pub(crate) fn update_eth_state(&mut self) {
        if !self.iface_running("eth0") {
            self.sys.eth_state = 0;
            return;
        }
        self.sys.eth_addr = self.interface_ip("eth0");
        if self.sys.eth_addr.is_empty() {
            self.sys.eth_route.clear();
            self.sys.eth_state = 1;
            return;
        }
        self.sys.eth_route = self.gateway("eth0");
        self.sys.eth_state = if self.sys.eth_route.is_empty() { 2 } else { 3 };
    }

    /// -2 no Wi-Fi module, 0 not connected, 1 address and a default route.
    pub(crate) fn update_wifi_state(&mut self) {
        if self.sys.wifi_state == -2 {
            return;
        }
        if self.sys.wifi_state == -1 {
            let exists = self.p.iface_flags("wlan0").is_some();
            self.p.set_marker("/etc/kvm/wifi_exist", exists);
            if !exists {
                self.sys.wifi_state = -2;
                return;
            }
        }
        let connected = self.refresh_wifi_addr() && {
            self.sys.wifi_route = self.gateway("wlan0");
            !self.sys.wifi_route.is_empty()
        };
        self.sys.wifi_state = if connected { 1 } else { 0 };
        let state = self.sys.wifi_state;
        if self.persisted_wifi_state != Some(state)
            && self
                .p
                .write("/kvmapp/kvm/wifi_state", format!("{state}\n").as_bytes())
        {
            self.persisted_wifi_state = Some(state);
        }
    }

    pub(crate) fn update_usb_state(&mut self) {
        let Some(state) = self.read_text("/sys/class/udc/4340000.usb/state", 9) else {
            self.sys.usb_state = -1;
            self.sys.hid_state = 0;
            self.sys.udisk_state = 0;
            return;
        };
        self.sys.usb_state = match state[0] {
            b'n' => 0,
            b'c' => 1,
            _ => -1,
        };
        if self.sys.usb_state == 1 {
            const C1: &str = "/sys/kernel/config/usb_gadget/g0/configs/c.1";
            let hid = ["hid.GS0", "hid.GS1", "hid.GS2"]
                .iter()
                .any(|f| self.p.exists(&format!("{C1}/{f}")));
            self.sys.hid_state = hid as i8;
            self.sys.udisk_state = self.p.exists(&format!("{C1}/mass_storage.disk0")) as i8;
        } else {
            self.sys.hid_state = 0;
            self.sys.udisk_state = 0;
        }
    }

    /// libkvm's shared VI state: (fps, updated_ms) when valid and stable.
    fn read_vi_shared(&mut self) -> Result<(u32, u32), &'static str> {
        let read = |p: &mut P| p.read(VI_SHARED_PATH, VI_SHARED_SIZE);
        let Some(a) = read(&mut self.p) else {
            return Err("unavailable");
        };
        if a.len() < VI_SHARED_SIZE {
            return Err("invalid");
        }
        let word = |d: &[u8], i: usize| u32::from_ne_bytes(d[i * 4..i * 4 + 4].try_into().unwrap());
        // A second read guards against a torn copy; the writer's sequence is odd while it writes.
        let b = read(&mut self.p).unwrap_or_default();
        if word(&a, 0) & 1 != 0 || a != b {
            return Err("busy");
        }
        if word(&a, 1) != VI_SHARED_MAGIC || word(&a, 2) != 1 {
            return Err("invalid");
        }
        let now = self.p.now_ms() as u32;
        if now.wrapping_sub(word(&a, 3)) > VI_SHARED_TTL_MS {
            return Err("stale");
        }
        Ok((word(&a, 5), word(&a, 3)))
    }

    /// Every sixth call: the shared VI state, else /proc/cvitek/vi_dbg at most every 10 s.
    pub(crate) fn update_hdmi_state(&mut self) {
        self.hdmi.check_times += 1;
        if self.hdmi.check_times <= 5 {
            return;
        }
        self.hdmi.check_times = 0;
        match self.read_vi_shared() {
            Ok((fps, _)) => {
                self.sys.hdmi_state = (fps != 0) as i8;
                if self.hdmi.shared_failure_logged {
                    eprintln!("[kvm_system] VI shared state recovered");
                }
                self.hdmi.shared_failure_logged = false;
                self.hdmi.fallback_failure_logged = false;
                return;
            }
            Err(why) => {
                if !self.hdmi.shared_failure_logged {
                    eprintln!("[kvm_system] VI shared state {why}; using direct fallback");
                    self.hdmi.shared_failure_logged = true;
                }
            }
        }
        let now = self.p.now_ms() as u32;
        let due = self
            .hdmi
            .fallback_attempted_ms
            .is_none_or(|t| now.wrapping_sub(t) >= VI_FALLBACK_TTL_MS);
        if due {
            self.hdmi.fallback_attempted_ms = Some(now);
            match self
                .p
                .read("/proc/cvitek/vi_dbg", 64 * 1024)
                .and_then(|t| proc_vi_fps(&t))
            {
                Some(fps) => {
                    self.hdmi.fallback_fps = fps;
                    self.hdmi.fallback_updated_ms = now;
                    self.hdmi.fallback_valid = true;
                    if self.hdmi.fallback_failure_logged {
                        eprintln!("[kvm_system] direct VI fallback recovered");
                    }
                    self.hdmi.fallback_failure_logged = false;
                }
                None => {
                    self.hdmi.fallback_valid = false;
                    if !self.hdmi.fallback_failure_logged {
                        eprintln!("[kvm_system] direct VI fallback unavailable");
                        self.hdmi.fallback_failure_logged = true;
                    }
                }
            }
        }
        self.sys.hdmi_state = if self.hdmi.fallback_valid
            && now.wrapping_sub(self.hdmi.fallback_updated_ms) <= VI_FALLBACK_TTL_MS
        {
            (self.hdmi.fallback_fps != 0) as i8
        } else {
            -1
        };
    }

    pub(crate) fn update_stream_fps(&mut self) {
        if let Some(t) = self.read_text("/kvmapp/kvm/now_fps", 9) {
            self.sys.now_fps = atoi(&t) as i32 as i8;
        }
    }

    pub(crate) fn update_stream_type(&mut self) {
        if let Some(t) = self.read_text("/kvmapp/kvm/type", 9) {
            self.sys.stream_type = match t[0] {
                b'm' => TYPE_MJPG as i8,
                b'h' => TYPE_H264 as i8,
                _ => 0,
            };
        }
    }

    pub(crate) fn update_stream_qlty(&mut self) {
        if let Some(t) = self.read_text("/kvmapp/kvm/qlty", 9) {
            self.sys.qlty = stream_quality_bucket(strtoul(&t), self.sys.stream_type);
        }
    }

    pub(crate) fn update_hdmi_res(&mut self) {
        if let Some(t) = self.read_text("/kvmapp/kvm/width", 9) {
            self.sys.hdmi_width = atoi(&t) as i32 as i16;
        }
        if let Some(t) = self.read_text("/kvmapp/kvm/height", 9) {
            self.sys.hdmi_height = atoi(&t) as i32 as i16;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn strtoul_matches_c() {
        assert_eq!(strtoul(b" 42\n"), 42);
        assert_eq!(strtoul(b"-5"), 5u64.wrapping_neg());
        assert_eq!(strtoul(b"99999999999999999999999"), u64::MAX);
        assert_eq!(strtoul(b"x"), 0);
    }

    #[test]
    fn route_gateway() {
        let route = b"Iface\tDestination\tGateway \tFlags\n\
            eth0\t0002A8C0\t00000000\t0001\n\
            eth0\t00000000\t0101A8C0\t0003\n";
        assert_eq!(
            default_gateway(route, "eth0"),
            Some(Ipv4Addr::new(192, 168, 1, 1))
        );
        assert_eq!(default_gateway(route, "wlan0"), None);
    }

    #[test]
    fn vi_dbg_fps() {
        assert_eq!(proc_vi_fps(b"VIDevFPS: 60\nVIFPS: 59\n"), Some(59));
        assert_eq!(proc_vi_fps(b"  VIFPS\t:\t0\n"), Some(0));
        assert_eq!(proc_vi_fps(b"nothing\n"), None);
        assert_eq!(proc_vi_fps(b"VIFPS 60\n"), None);
    }

    #[test]
    fn quality_buckets() {
        assert_eq!(stream_quality_bucket(59, 1), 1);
        assert_eq!(stream_quality_bucket(90, 1), 4);
        assert_eq!(stream_quality_bucket(2499, 2), 2);
        assert_eq!(stream_quality_bucket(3500, 0), 4);
    }
}
