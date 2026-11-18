//! The OLED pages (oled_ui.cpp): the status page, the Wi-Fi setup pages and auto-sleep.

use crate::oled::{ETH_STATE, HDMI_STATE, HID_STATE, WIFI_STATE};
use crate::{Hw, IpKind, Platform, STATE_DELAY_MS, System};

const IP_CHANGE_MS: u64 = 5000;
const OLED_SLEEP_DELAY_MIN: u32 = 10;
const OLED_SLEEP_DELAY_DEFAULT: u32 = 30;
const OLED_SLEEP_DELAY_MAX: u32 = 86400;
const OLED_SLEEP_FILE: &str = "/etc/kvm/oled_sleep";

/// Version 3, level M, byte mode, mask 4: libqr's qrInit(3, QR_EM_8BIT, 1, 4) in kvm_system.
/// None over 42 bytes. Rows of 29 modules, true is dark.
fn qr_matrix(text: &str) -> Option<[[bool; 29]; 29]> {
    use qrcodegen::{Mask, QrCode, QrCodeEcc, QrSegment, Version};
    let version = Version::new(3);
    let segs = [QrSegment::make_bytes(text.as_bytes())];
    let qr = QrCode::encode_segments_advanced(
        &segs,
        QrCodeEcc::Medium,
        version,
        version,
        Some(Mask::new(4)),
        false,
    )
    .ok()?;
    let mut m = [[false; 29]; 29];
    for (row, line) in m.iter_mut().enumerate() {
        for (col, dark) in line.iter_mut().enumerate() {
            *dark = qr.get_module(col as i32, row as i32);
        }
    }
    Some(m)
}

impl<P: Platform> System<P> {
    fn init_ui(&mut self) {
        if self.hw != Hw::Pcie {
            self.oled_clear();
            self.show_kvm_logo();
            self.show_logo();
            self.show_all_states_off();
            self.show_line();
            self.show_stream_labels();
            self.show_ip(IpKind::Eth, "");
            self.show_stream_type(0);
            self.show_fps(0);
            self.show_quality(80);
        } else {
            self.oled_revolve();
            self.show_line_pcie();
            self.show_logo();
            self.show_all_states_off();
            self.show_string_right(63, 3, "  FPS", 4);
        }
    }

    fn show_all_states_off(&mut self) {
        for which in [HDMI_STATE, HID_STATE, ETH_STATE, WIFI_STATE] {
            self.show_kvm_state(which, 0);
        }
    }

    /// QR code in a 33x32 box at column 29 of a filled screen.
    fn show_qr(&mut self, text: &str) {
        let Some(qr) = qr_matrix(text) else {
            return;
        };
        let mut img = [0xFFu8; 132];
        // Two light modules of quiet zone above and to the left.
        for (row, line) in qr.iter().enumerate() {
            for (col, _) in line.iter().enumerate().filter(|m| *m.1) {
                let (y, x) = (row + 2, col + 2);
                img[(y / 8) * 33 + x] &= !(1 << (y % 8));
            }
        }
        self.oled_fill();
        self.show_img(29, 0, &img, 33, 4);
        let b = text.as_bytes();
        if b.first() == Some(&b'W') {
            self.show_string_turn(3, 1, "WiFi");
            self.show_string_turn(3, 2, "AP:");
        } else if b.first() == Some(&b'h') {
            if b.get(7) == Some(&b'1') {
                self.show_string_turn(3, 1, "Web:");
            } else if b.get(8) == Some(&b'w') {
                self.show_string_turn(3, 1, "WiKi");
            }
        }
    }

    /// Ethernet or Wi-Fi on the IP line; both connected alternate every ~6 s.
    fn show_which_ip(&mut self) -> IpKind {
        if self.sys.wifi_state == -2 {
            return IpKind::Eth;
        }
        if self.oled.eth_state == 3 && self.oled.wifi_state != 1 {
            return IpKind::Eth;
        }
        if self.oled.eth_state != 3 && self.oled.wifi_state == 1 {
            return IpKind::Wifi;
        }
        self.ip_run_count = self.ip_run_count.wrapping_add(1);
        if self.ip_run_count as u64 > IP_CHANGE_MS / STATE_DELAY_MS {
            self.ip_run_count = 0;
            self.ip_kind = match self.ip_kind {
                IpKind::Eth => IpKind::Wifi,
                IpKind::Wifi => IpKind::Eth,
            };
        }
        self.ip_kind
    }

    /// True (and remembered) when the status address differs from the shown one.
    fn ip_changed(&mut self, kind: IpKind) -> bool {
        let (sys, shown) = match kind {
            IpKind::Eth => (&self.sys.eth_addr, &mut self.oled.eth_addr),
            IpKind::Wifi => (&self.sys.wifi_addr, &mut self.oled.wifi_addr),
        };
        if sys.is_empty() || sys == shown {
            return false;
        }
        shown.clone_from(sys);
        true
    }

    fn state_changed(&self) -> bool {
        let (s, o) = (&self.sys, &self.oled);
        s.eth_state != o.eth_state
            || s.wifi_state != o.wifi_state
            || s.usb_state != o.usb_state
            || s.hdmi_state != o.hdmi_state
            || s.hdmi_width != o.hdmi_width
            || s.hdmi_height != o.hdmi_height
            || s.stream_type != o.stream_type
            || s.qlty != o.qlty
    }

    fn eth_state_disp(&mut self, kind: IpKind, first: bool) {
        if !(self.oled.eth_state != self.sys.eth_state
            || self.eth_kind_shown != Some(kind)
            || first
            || self.ip_changed(IpKind::Eth))
        {
            return;
        }
        // An address state is shown once the address is known.
        if self.sys.eth_state < 2 || !self.sys.eth_addr.is_empty() {
            self.oled.eth_state = self.sys.eth_state;
        }
        self.eth_kind_shown = Some(kind);
        match self.oled.eth_state {
            -1 | 0 => {
                self.show_kvm_state(ETH_STATE, 0);
                if kind == IpKind::Eth {
                    self.show_ip(IpKind::Eth, "");
                }
            }
            1 => {
                self.show_kvm_state(ETH_STATE, 1);
                if kind == IpKind::Eth {
                    self.show_ip(IpKind::Eth, "");
                }
            }
            2 => self.show_network_error(true),
            3 => {
                self.show_network_error(false);
                self.show_kvm_state(ETH_STATE, 1);
                if kind == IpKind::Eth {
                    let addr = self.sys.eth_addr.clone();
                    self.show_ip(IpKind::Eth, &addr);
                }
            }
            _ => {}
        }
    }

    fn wifi_state_disp(&mut self, kind: IpKind, first: bool) {
        if !(self.oled.wifi_state != self.sys.wifi_state
            || self.wifi_kind_shown != Some(kind)
            || first
            || self.ip_changed(IpKind::Wifi))
        {
            return;
        }
        self.oled.wifi_state = self.sys.wifi_state;
        self.wifi_kind_shown = Some(kind);
        match self.oled.wifi_state {
            -2 => self.show_kvm_state(WIFI_STATE, -1),
            -1 | 0 => {
                self.show_kvm_state(WIFI_STATE, 0);
                if kind == IpKind::Wifi {
                    self.show_ip(IpKind::Wifi, "");
                }
            }
            1 => {
                self.show_kvm_state(WIFI_STATE, 1);
                if kind == IpKind::Wifi {
                    let addr = self.sys.wifi_addr.clone();
                    self.show_ip(IpKind::Wifi, &addr);
                }
            }
            _ => {}
        }
    }

    pub(crate) fn main_ui(&mut self, page_changed: bool, sub_page_changed: bool) {
        if self.state_changed() {
            self.oled_sleep_time_update();
        }
        let redraw = page_changed || sub_page_changed;
        if self.oled.sub_page == 1 {
            // Blank sub-page (OLED asleep).
            if redraw {
                self.oled_clear();
            }
            return;
        }
        let kind = self.show_which_ip();
        if redraw {
            self.oled_clear();
            self.init_ui();
        }
        self.eth_state_disp(kind, redraw);
        self.wifi_state_disp(kind, redraw);
        if self.oled.usb_state != self.sys.usb_state || redraw {
            self.oled.usb_state = self.sys.usb_state;
            match self.oled.usb_state {
                -1 | 0 => self.show_kvm_state(HID_STATE, 0),
                1 => self.show_kvm_state(HID_STATE, 1),
                _ => {}
            }
        }
        if self.oled.hdmi_state != self.sys.hdmi_state || redraw {
            self.oled.hdmi_state = self.sys.hdmi_state;
            match self.oled.hdmi_state {
                -1 | 0 => self.show_kvm_state(HDMI_STATE, 0),
                1 => self.show_kvm_state(HDMI_STATE, 1),
                _ => {}
            }
        }
        if self.oled.now_fps != self.sys.now_fps || redraw {
            self.oled.now_fps = self.sys.now_fps;
            self.show_fps(self.oled.now_fps as u8);
        }
        if self.oled.hdmi_width != self.sys.hdmi_width
            || self.oled.hdmi_height != self.sys.hdmi_height
            || redraw
        {
            self.oled.hdmi_width = self.sys.hdmi_width;
            self.oled.hdmi_height = self.sys.hdmi_height;
            self.show_resolution(self.sys.hdmi_width as u16, self.sys.hdmi_height as u16);
        }
        if self.oled.stream_type != self.sys.stream_type || redraw {
            self.oled.stream_type = self.sys.stream_type;
            self.show_stream_type(self.oled.stream_type as u8);
        }
        if self.oled.qlty != self.sys.qlty || redraw {
            self.oled.qlty = self.sys.qlty;
            self.show_quality(self.sys.qlty as u8);
        }
    }

    pub(crate) fn wifi_config_ui(&mut self, first: bool, sub_page_changed: bool) {
        if first && self.sys.wifi_config_process == -1 {
            self.sys.wifi_config_process = 0;
            self.sys.sub_page = 0;
        }
        if !(first || sub_page_changed) {
            return;
        }
        let pass = self.sys.wifi_ap_pass.clone();
        match self.oled.sub_page {
            0 => self.show_two_lines("WiFi AP is", "Starting.."),
            1 => self.show_qr(&format!("WIFI:T:WPA2;S:NanoKVM;P:{pass};;")),
            2 => {
                self.oled_clear();
                self.show_string(0, 0, "SSID:", 8);
                self.show_string_right(63, 1, "NanoKVM", 8);
                self.show_string(0, 2, "PASS:", 8);
                self.show_string_right(63, 3, &pass, 8);
            }
            3 => {
                self.oled_clear();
                self.refresh_wifi_addr();
                let url = format!("http://{}/#/WIFI?P={pass}", self.sys.wifi_addr);
                self.show_qr(&url);
            }
            4 => {
                self.oled_clear();
                self.refresh_wifi_addr();
                self.show_string(1, 0, "Config URL", 8);
                let addr = format!("{}/#/", self.sys.wifi_addr);
                self.show_string_right(63, 1, &addr, 4);
                self.show_string_right(63, 2, "WIFI?P=", 4);
                self.show_string_right(63, 3, &pass, 8);
            }
            5 => self.show_two_lines("WiFi", "Connect..."),
            6 => self.show_two_lines("WiFi AP", "failed"),
            _ => {}
        }
    }

    fn show_two_lines(&mut self, first: &str, second: &str) {
        self.oled_clear();
        self.show_string(0, 1, first, 8);
        self.show_string(0, 2, second, 8);
    }

    pub(crate) fn oled_sleep_time_update(&mut self) {
        self.oled.sleep_start = self.p.now_ms();
    }

    /// /etc/kvm/oled_sleep: seconds without a change or key before the status page blanks.
    pub(crate) fn oled_auto_sleep(&mut self) {
        let mut close = false;
        if self.p.exists(OLED_SLEEP_FILE) {
            let mut param = OLED_SLEEP_DELAY_DEFAULT;
            if let Some(text) = self.p.read(OLED_SLEEP_FILE, 15).filter(|t| !t.is_empty()) {
                param = crate::status::strtoul(&text) as u32;
                if param > OLED_SLEEP_DELAY_MAX {
                    param = OLED_SLEEP_DELAY_DEFAULT;
                }
            }
            if param != self.oled.sleep_param {
                self.oled.sleep_param = param;
                if param < OLED_SLEEP_DELAY_MIN {
                    close = true;
                } else {
                    self.oled_sleep_time_update();
                }
            }
        } else if self.oled.sleep_param != 0 {
            self.oled.sleep_param = 0;
            close = true;
        }

        if self.oled.page != 0 {
            return;
        }
        if self.oled.sleep_param < OLED_SLEEP_DELAY_MIN {
            if close {
                self.sys.sub_page = 0;
            }
        } else {
            let idle_s = self.p.now_ms().wrapping_sub(self.oled.sleep_start) / 1000;
            self.sys.sub_page = if idle_s >= self.oled.sleep_param as u64 {
                1
            } else {
                0
            };
        }
    }
}

#[cfg(test)]
mod tests {
    /// Same matrices as libqr for ../harness/qr-strings.txt (golden/qr-matrices.txt, made by qr_dump.c).
    #[test]
    fn qr_matches_libqr() {
        let harness = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../harness");
        let want = std::fs::read_to_string(harness.join("golden/qr-matrices.txt")).unwrap();
        let strings = std::fs::read_to_string(harness.join("qr-strings.txt")).unwrap();
        let mut got = String::new();
        for text in strings.lines() {
            got += &format!("> {text}\n");
            match super::qr_matrix(text) {
                None => got += "ERROR\n",
                Some(m) => {
                    for row in m {
                        got.extend(row.iter().map(|&d| if d { '#' } else { '.' }));
                        got.push('\n');
                    }
                }
            }
        }
        assert_eq!(got.lines().count(), want.lines().count());
        for (i, (g, w)) in got.lines().zip(want.lines()).enumerate() {
            assert_eq!(g, w, "line {}", i + 1);
        }
    }
}
