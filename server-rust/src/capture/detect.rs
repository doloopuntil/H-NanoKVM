//! The HDMI detection thread (bridge interrupts, size scan, manual size), the VI state from
//! /proc/cvitek/vi_dbg, and the carveout watchdog thread.

use std::sync::atomic::Ordering::*;

use super::{
    bridge::{Chip, res_list},
    engine::{
        DEFAULT_HEIGHT, DEFAULT_WIDTH, ERROR_RES, Engine, HDMI_MODE_BRIDGE, HDMI_MODE_MANUAL,
        HDMI_MODE_MAX, HDMI_MODE_SCAN, NEW_RES, NORMAL_RES, UNKNOWN_RES,
    },
    platform::{Command, Platform, ViState},
};

const WIDTH_FILE: &str = "/kvmapp/kvm/width";
const HEIGHT_FILE: &str = "/kvmapp/kvm/height";
const HDMI_MODE_FILE: &str = "/etc/kvm/hdmi_mode";
const HDMI_VERSION_FILE: &str = "/etc/kvm/hdmi_version";
const LT_INT_FILE: &str = "/proc/lt_int";
const VI_DBG_FILE: &str = "/proc/cvitek/vi_dbg";
const WATCHDOG_MODE_FILE: &str = "/etc/kvm/watchdog";
const WATCHDOG_TEMP_FILE: &str = "/tmp/watchdog";
const WATCHDOG_FILE: &str = "/tmp/nanokvm_wd";

const VI_MIN_WIDTH: u16 = 32;
const VI_MIN_HEIGHT: u16 = 3;
const VI_MAX_WIDTH: u16 = 1920;
const VI_MAX_HEIGHT: u16 = 1080;
const TRY_ROUNDS_HDMI_ERR_RES: u8 = 5;
const VI_STATE_PUBLISH_INTERVAL_MS: u32 = 10_000;

/// What the detection thread keeps between passes (locals and statics in the C++).
struct Detect {
    chip: Chip,
    hdmi_mode: u8,
    try_rounds: u8,
    auto_change_mode: bool,
    last_vi_state_code: u8,
}

/// Decimal digits with at most one trailing newline, the whole file, up to 65535.
pub(super) fn parse_u16_file(data: &[u8]) -> Option<u16> {
    if data.is_empty() || data.len() > 35 {
        return None;
    }
    let digits = data.strip_suffix(b"\n").unwrap_or(data);
    if digits.is_empty() || !digits.iter().all(u8::is_ascii_digit) {
        return None;
    }
    digits
        .iter()
        .try_fold(0_u32, |n, d| {
            n.checked_mul(10)?
                .checked_add(u32::from(d - b'0'))
                .filter(|&n| n <= u32::from(u16::MAX))
        })
        .map(|n| n as u16)
}

/// C atoi: leading whitespace, an optional sign, digits.
fn atoi(data: &[u8]) -> i64 {
    let mut it = data
        .iter()
        .copied()
        .skip_while(u8::is_ascii_whitespace)
        .peekable();
    let neg = match it.peek() {
        Some(b'-') => {
            it.next();
            true
        }
        Some(b'+') => {
            it.next();
            false
        }
        _ => false,
    };
    let mut n: i64 = 0;
    for c in it.take_while(u8::is_ascii_digit) {
        n = n.saturating_mul(10).saturating_add(i64::from(c - b'0'));
    }
    if neg { -n } else { n }
}

/// strtol for the carveout field: Some(value) only with digits and no overflow.
fn strtol(text: &str) -> Option<i64> {
    let t = text.trim_start();
    let (neg, rest) = match t.as_bytes().first() {
        Some(b'-') => (true, &t[1..]),
        Some(b'+') => (false, &t[1..]),
        _ => (false, t),
    };
    let digits: &str = &rest[..rest.bytes().take_while(u8::is_ascii_digit).count()];
    if digits.is_empty() {
        return None;
    }
    let n: i64 = digits.parse().ok()?;
    Some(if neg { -n } else { n })
}

/// One `NAME : VALUE` line of vi_dbg, as sscanf(" %31[^ :\t] %*[: \t] %u").
fn parse_vi_line(line: &str) -> Option<(&str, u32)> {
    let s = line.trim_start();
    let name_len = s
        .bytes()
        .take(31)
        .take_while(|c| !matches!(c, b' ' | b':' | b'\t'))
        .count();
    if name_len == 0 {
        return None;
    }
    let (name, rest) = s.split_at(name_len);
    let rest = rest.trim_start();
    let sep = rest
        .bytes()
        .take_while(|c| matches!(c, b' ' | b':' | b'\t'))
        .count();
    if sep == 0 {
        return None;
    }
    let rest = rest[sep..].trim_start();
    let (neg, rest) = match rest.as_bytes().first() {
        Some(b'-') => (true, &rest[1..]),
        Some(b'+') => (false, &rest[1..]),
        _ => (false, rest),
    };
    let digits = &rest[..rest.bytes().take_while(u8::is_ascii_digit).count()];
    if digits.is_empty() {
        return None;
    }
    let v = digits.parse::<u64>().map(|v| v as u32).unwrap_or(u32::MAX);
    Some((name, if neg { v.wrapping_neg() } else { v }))
}

/// The VI counters and whether both FPS fields were there; None without any known field.
fn parse_vi_dbg(text: &str) -> Option<(ViState, bool)> {
    let mut s = ViState::default();
    let (mut any, mut dev, mut fps) = (false, false, false);
    for line in text.split_inclusive('\n') {
        let Some((name, v)) = parse_vi_line(line) else {
            continue;
        };
        match name {
            "VIDevFPS" => (s.dev_fps, dev) = (v, true),
            "VIFPS" => (s.fps, fps) = (v, true),
            "VICsiCh0WidthGTCnt" => s.width_gt = v,
            "VICsiCh0WidthLSCnt" => s.width_ls = v,
            "VICsiCh0HeightGTCnt" => s.height_gt = v,
            "VICsiCh0HeightLSCnt" => s.height_ls = v,
            _ => continue,
        }
        any = true;
    }
    any.then_some((s, dev && fps))
}

/// 0 VI not up, 1 normal, 2 no HDMI, 3-6 CSI width/height too small/large, 7 unknown.
fn classify(s: &ViState) -> u8 {
    if s.dev_fps == 0 {
        2
    } else if s.fps != 0 {
        1
    } else if s.width_gt != 0 {
        3
    } else if s.width_ls != 0 {
        4
    } else if s.height_gt != 0 {
        5
    } else if s.height_ls != 0 {
        6
    } else {
        7
    }
}

impl<P: Platform> Engine<P> {
    fn monotonic_ms32(&self) -> u32 {
        self.p.now_ms() as u32
    }

    /// Reads vi_dbg (the driver blocks about a second), publishes it and classifies it.
    fn vi_state_refresh(&self) -> u8 {
        let Some(data) = self.p.read(VI_DBG_FILE, 1 << 16) else {
            return 0;
        };
        let text = String::from_utf8_lossy(&data);
        let Some((state, complete)) = parse_vi_dbg(&text) else {
            return 0;
        };
        if !complete || !self.p.publish_vi_state(&state) {
            return 0;
        }
        classify(&state)
    }

    fn refresh_vi_state(&self, d: &mut Detect) -> u8 {
        // Mark the deadline before the blocking read: the cadence measures wall-clock time.
        self.s
            .last_vi_refresh_ms
            .store(u64::from(self.monotonic_ms32()), Relaxed);
        d.last_vi_state_code = self.vi_state_refresh();
        self.set_hdmi_detection_state(d.last_vi_state_code == 1 || d.last_vi_state_code >= 3);
        d.last_vi_state_code
    }

    pub(super) fn write_res_to_file(&self, w: u16, h: u16) {
        self.p.write(WIDTH_FILE, format!("{w}\n").as_bytes());
        self.p.write(HEIGHT_FILE, format!("{h}\n").as_bytes());
        self.p.sync();
    }

    fn set_hdmi_mode(&self, mode: u8) -> bool {
        if mode > HDMI_MODE_MAX {
            return false;
        }
        self.p.write(HDMI_MODE_FILE, format!("{mode}\n").as_bytes());
        true
    }

    /// Rereads /etc/kvm/hdmi_mode; true when it changed.
    fn get_hdmi_mode(&self, d: &mut Detect) -> bool {
        if !self.p.exists(HDMI_MODE_FILE) {
            d.hdmi_mode = HDMI_MODE_BRIDGE;
            return false;
        }
        let parsed = self
            .p
            .read(HDMI_MODE_FILE, 36)
            .and_then(|data| parse_u16_file(&data))
            .filter(|&m| m <= u16::from(HDMI_MODE_MAX));
        let mode = match parsed {
            Some(m) => m as u8,
            None => {
                self.p.write(HDMI_MODE_FILE, b"0\n");
                HDMI_MODE_BRIDGE
            }
        };
        if mode != d.hdmi_mode {
            d.hdmi_mode = mode;
            return true;
        }
        false
    }

    fn watchdog_enabled(&self) -> bool {
        self.p.exists(WATCHDOG_MODE_FILE) || self.p.exists(WATCHDOG_TEMP_FILE)
    }

    /// The manual size from the width/height files, clamped (and written back) to the VI's
    /// limits; true when it changed.
    fn get_manual_resolution(&self) -> bool {
        let read = |path| self.p.read(path, 36).and_then(|data| parse_u16_file(&data));
        let mut w = read(WIDTH_FILE).unwrap_or(DEFAULT_WIDTH);
        let mut h = read(HEIGHT_FILE).unwrap_or(DEFAULT_HEIGHT);
        if w < VI_MIN_WIDTH {
            w = VI_MIN_WIDTH;
            self.p.write(WIDTH_FILE, format!("{w}\n").as_bytes());
        }
        if h < VI_MIN_HEIGHT {
            h = VI_MIN_HEIGHT;
            self.p.write(HEIGHT_FILE, format!("{h}\n").as_bytes());
        }
        if w > VI_MAX_WIDTH {
            w = VI_MAX_WIDTH;
            self.p.write(WIDTH_FILE, format!("{w}\n").as_bytes());
        }
        if h > VI_MAX_HEIGHT {
            h = VI_MAX_HEIGHT;
            self.p.write(HEIGHT_FILE, format!("{h}\n").as_bytes());
        }
        let mut changed = false;
        if self.s.vi_width.load(Relaxed) != w {
            self.s.vi_width.store(w, Relaxed);
            changed = true;
        }
        if self.s.vi_height.load(Relaxed) != h {
            self.s.vi_height.store(h, Relaxed);
            changed = true;
        }
        changed
    }

    /// Restarts the camera at each listed size until the VI reports a clean CSI.
    /// 1 found, 2 no HDMI, 0 nothing worked (or stopping).
    fn auto_try_res(&self, d: &mut Detect) -> u8 {
        for &(w, h) in res_list() {
            if self.s.stop_threads.load(Acquire) {
                return 0;
            }
            match self.refresh_vi_state(d) {
                0 => {
                    if !self.restart_camera_from_worker() {
                        return 0;
                    }
                }
                1 => return 1,
                2 => {
                    // No HDMI; the periodic checks go on
                    self.p.sleep_ms(250);
                    return 2;
                }
                3..=6 => {
                    tracing::debug!(width = w, height = h, "trying HDMI input size");
                    self.p.write(WIDTH_FILE, format!("{w}\n").as_bytes());
                    self.p.write(HEIGHT_FILE, format!("{h}\n").as_bytes());
                    self.s.vi_width.store(w, Relaxed);
                    self.s.vi_height.store(h, Relaxed);
                    if !self.restart_camera_from_worker() {
                        return 0;
                    }
                    self.p.sleep_ms(50);
                }
                _ => {}
            }
        }
        match self.refresh_vi_state(d) {
            code @ (1 | 2) => code,
            _ => 0,
        }
    }

    fn get_hdmi_version(&self) -> Chip {
        self.p.run(Command::HdmiVersion);
        if !self.p.exists(HDMI_VERSION_FILE) {
            return Chip::C;
        }
        let Some(data) = self.p.read(HDMI_VERSION_FILE, 2) else {
            return Chip::C;
        };
        let b = |i: usize| data.get(i).copied().unwrap_or(0);
        let chip = match (b(0), b(1)) {
            (b'u', b'e') => {
                self.set_hdmi_mode(HDMI_MODE_SCAN);
                Chip::Ue
            }
            (b'u', _) => Chip::Uxc,
            (b'd', _) => Chip::D,
            _ => Chip::C,
        };
        // Only this thread writes hdmi_mode; clear a scan mode left by an earlier run
        if chip != Chip::Ue {
            self.set_hdmi_mode(HDMI_MODE_BRIDGE);
        }
        chip
    }

    /// An interrupt in bridge mode: read the input and its size from the bridge.
    fn bridge_interrupt(&self, d: &mut Detect, edge: bool) {
        if !edge {
            return;
        }
        self.lt6911_enable(d.chip);
        if self.lt6911_get_hdmi_res(d.chip) {
            self.set_hdmi_detection_state(true);
            let res = self.refresh_csi_resolution(d.chip);
            self.s.res_type.store(res, Relaxed);
            if res == NEW_RES {
                self.s.reopen_cam.store(true, Relaxed);
            } else if res == UNKNOWN_RES {
                // Fall back to the scan instead of waiting on a size the bridge won't give
                d.auto_change_mode = true;
                self.set_hdmi_mode(HDMI_MODE_SCAN);
            }
        } else {
            self.set_hdmi_detection_state(false);
        }
        self.lt6911_disable(d.chip);
    }

    fn bridge_pass(&self, d: &mut Detect, mode_changed: bool) {
        if mode_changed {
            // Back to bridge mode: reset the interrupt count and the bridge
            self.s.detect_state.store(0, Relaxed);
            self.p.write(LT_INT_FILE, b"0\n");
            self.hdmi_control(false);
            self.p.sleep_ms(10);
            self.hdmi_control(true);
        }
        let Some(data) = self.p.read(LT_INT_FILE, 2) else {
            return;
        };
        let count = atoi(&data) as u8;
        if count == 0 {
            return;
        }
        self.p.write(LT_INT_FILE, b"0");
        // The kernel adds 1 per rising and 10 per falling edge
        let rising = !count.is_multiple_of(10);
        let falling = count / 10 != 0;
        if self.s.hdmi_stop.load(Acquire) {
            return;
        }
        self.s.hdmi_reading.store(true, Release);
        match d.chip {
            Chip::C => self.bridge_interrupt(d, rising),
            Chip::Uxc | Chip::D => self.bridge_interrupt(d, falling),
            Chip::Ue => tracing::debug!("bridge chip not supported for reading"),
        }
        self.s.hdmi_reading.store(false, Release);
    }

    fn scan_pass(&self, d: &mut Detect, mode_changed: bool, vi_state_refreshed: bool) {
        // detect_state: 0 not interfering, 1 scanning, 2 a size was found
        if mode_changed {
            self.s.detect_state.store(1, Relaxed);
        }
        match self.s.detect_state.load(Relaxed) {
            1 => match self.auto_try_res(d) {
                1 => {
                    self.s.res_err.store(NORMAL_RES, Relaxed);
                    d.try_rounds = 0;
                    self.s.detect_state.store(2, Relaxed);
                    // A fallback from bridge mode must not stick
                    if d.auto_change_mode {
                        d.auto_change_mode = false;
                        self.set_hdmi_mode(HDMI_MODE_BRIDGE);
                    }
                }
                0 => {
                    self.s.res_err.store(ERROR_RES, Relaxed);
                    d.try_rounds += 1;
                    if d.try_rounds >= TRY_ROUNDS_HDMI_ERR_RES {
                        d.try_rounds = 0;
                        self.s.detect_state.store(1, Relaxed);
                        if d.auto_change_mode {
                            d.auto_change_mode = false;
                            self.set_hdmi_mode(HDMI_MODE_BRIDGE);
                        } else {
                            self.set_hdmi_mode(HDMI_MODE_MANUAL);
                        }
                    }
                }
                2 => d.try_rounds = 0,
                _ => {}
            },
            2 => {
                if vi_state_refreshed && d.last_vi_state_code != 1 {
                    self.s.detect_state.store(1, Relaxed);
                }
            }
            _ => self.s.detect_state.store(1, Relaxed),
        }
    }

    fn manual_pass(&self, d: &mut Detect, init_now: bool, vi_state_due: bool) {
        if init_now {
            // Start at once on entering manual mode, not at the next periodic check.
            self.s.detect_state.store(1, Relaxed);
        }
        if !init_now && !vi_state_due {
            return;
        }
        match self.s.detect_state.load(Relaxed) {
            1 => {
                if self.get_manual_resolution() && !self.restart_camera_from_worker() {
                    return;
                }
                if self.refresh_vi_state(d) == 1 {
                    self.s.res_err.store(NORMAL_RES, Relaxed);
                    self.s.detect_state.store(2, Relaxed);
                }
            }
            2 => {
                if d.last_vi_state_code != 1 {
                    self.s.detect_state.store(1, Relaxed);
                }
            }
            _ => self.s.detect_state.store(1, Relaxed),
        }
    }

    /// The detection thread.
    pub(super) fn vi_subsystem_detection(&self) {
        if !self.p.exists(LT_INT_FILE) {
            self.p.sleep_ms(10);
        }
        let mut d = Detect {
            chip: Chip::C,
            hdmi_mode: HDMI_MODE_BRIDGE,
            try_rounds: 0,
            auto_change_mode: false,
            last_vi_state_code: 0,
        };
        d.chip = self.get_hdmi_version();
        // Refresh on elapsed time, not on passes, whose work varies widely.
        self.s.last_vi_refresh_ms.store(
            u64::from(
                self.monotonic_ms32()
                    .wrapping_sub(VI_STATE_PUBLISH_INTERVAL_MS),
            ),
            Relaxed,
        );
        while !self.s.stop_threads.load(Acquire) {
            let mode_changed = self.get_hdmi_mode(&mut d);
            if mode_changed && d.hdmi_mode == HDMI_MODE_BRIDGE {
                // A scan that gave up must not block reads once the bridge reports sizes.
                self.s.res_err.store(NORMAL_RES, Relaxed);
            }
            let detect_state = self.s.detect_state.load(Relaxed);
            let last = self.s.last_vi_refresh_ms.load(Relaxed) as u32;
            let vi_state_due =
                self.monotonic_ms32().wrapping_sub(last) >= VI_STATE_PUBLISH_INTERVAL_MS;
            let manual_init_now =
                d.hdmi_mode == HDMI_MODE_MANUAL && (mode_changed || detect_state == 0);
            let defer_refresh = (d.hdmi_mode == HDMI_MODE_SCAN
                && (detect_state == 1 || mode_changed))
                || (d.hdmi_mode == HDMI_MODE_MANUAL && (manual_init_now || detect_state == 1));
            let mut refreshed = false;
            if vi_state_due && !defer_refresh {
                self.refresh_vi_state(&mut d);
                refreshed = true;
            }
            match d.hdmi_mode {
                HDMI_MODE_BRIDGE => self.bridge_pass(&mut d, mode_changed),
                // Scan and manual mode answer reads with -4 while they work.
                HDMI_MODE_SCAN => self.scan_pass(&mut d, mode_changed, refreshed),
                HDMI_MODE_MANUAL => self.manual_pass(&mut d, manual_init_now, vi_state_due),
                _ => {}
            }
            self.p.sleep_ms(10);
        }
    }

    /// 1 when the carveout is at least 95 % used, 2 below, 0 when unknown.
    fn carveout_check(&self) -> u8 {
        let Some(rate) = self.p.carveout_usage().and_then(|s| strtol(&s)) else {
            return 0;
        };
        match rate {
            95..=100 => 1,
            0..=94 => 2,
            _ => 0,
        }
    }

    /// The watchdog thread: with /etc/kvm/watchdog or /tmp/watchdog, reboot on a full
    /// carveout and touch /tmp/nanokvm_wd every 500 ms.
    pub(super) fn watchdog_feed(&self) {
        while !self.s.stop_threads.load(Acquire) {
            for _ in 0..5 {
                if self.s.stop_threads.load(Acquire) {
                    break;
                }
                self.p.sleep_ms(100);
            }
            if self.s.stop_threads.load(Acquire) {
                break;
            }
            if self.watchdog_enabled() {
                if self.carveout_check() == 1 {
                    tracing::warn!("carveout full, rebooting");
                    self.p.run(Command::Reboot);
                }
                self.p.write(WATCHDOG_FILE, b"");
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn u16_files_take_digits_and_one_newline() {
        assert_eq!(parse_u16_file(b"1920\n"), Some(1920));
        assert_eq!(parse_u16_file(b"0"), Some(0));
        assert_eq!(parse_u16_file(b"65535"), Some(65535));
        for bad in [&b""[..], b"\n", b"65536", b" 12", b"12\n\n", b"-1", b"1x"] {
            assert_eq!(parse_u16_file(bad), None, "{bad:?}");
        }
    }

    #[test]
    fn vi_dbg_lines_need_a_colon() {
        assert_eq!(parse_vi_line("VIDevFPS : 60\n"), Some(("VIDevFPS", 60)));
        assert_eq!(parse_vi_line("  VIFPS:\t7"), Some(("VIFPS", 7)));
        assert_eq!(parse_vi_line("VIFPS 7"), None);
        assert_eq!(parse_vi_line("-----VI DEV STATUS-----\n"), None);
    }

    #[test]
    fn carveout_field_parses_like_strtol() {
        assert_eq!(strtol("40\n"), Some(40));
        assert_eq!(strtol(" 95%"), Some(95));
        assert_eq!(strtol("x"), None);
    }
}
