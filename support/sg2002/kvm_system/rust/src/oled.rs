//! The OLED controller over i2c-dev, drawn exactly as oled_ctrl.cpp does: one two-byte
//! write per command or data byte.

use crate::font::{ETH_ERROR, FONT_4X8, FONT_6X8, KVM_LOGO, SIPEED_LOGO, STATE_ICONS};
use crate::{Hw, IpKind, Platform, System};

const OLED_ADDR: u8 = 0x3D;
const OLED_PCIE_ADDR: u8 = 0x3C;
const CMD: u8 = 0x00;
const DATA: u8 = 0x40;
const ALIGN_RIGHT_END: u8 = 127;
const ALIGN_RIGHT_END_P: u8 = 63;

pub(crate) const HDMI_STATE: u8 = 0x01;
pub(crate) const HID_STATE: u8 = 0x02;
pub(crate) const ETH_STATE: u8 = 0x04;
pub(crate) const WIFI_STATE: u8 = 0x08;

pub(crate) const TYPE_MJPG: u8 = 1;
pub(crate) const TYPE_H264: u8 = 2;

impl<P: Platform> System<P> {
    fn device(&self) -> (u8, u8) {
        match self.hw {
            Hw::Alpha => (1, OLED_ADDR),
            Hw::Beta => (5, OLED_ADDR),
            Hw::Pcie => (5, OLED_PCIE_ADDR),
        }
    }

    fn reg(&mut self, mode: u8, byte: u8) {
        if self.oled_present {
            let (bus, addr) = self.device();
            self.p.i2c_write(bus, addr, &[mode, byte]);
        }
    }

    fn cmd(&mut self, byte: u8) {
        self.reg(CMD, byte);
    }

    fn data(&mut self, byte: u8) {
        self.reg(DATA, byte);
    }

    /// Reads /etc/kvm/hw and probes the panel with "display off".
    pub(crate) fn oled_detect(&mut self) -> bool {
        if let Some(hw) = self.p.read("/etc/kvm/hw", 2) {
            match hw.first() {
                Some(b'b') => self.hw = Hw::Beta,
                Some(b'p') => self.hw = Hw::Pcie,
                _ => {}
            }
        }
        let (bus, addr) = self.device();
        self.p.i2c_write(bus, addr, &[CMD, 0xAE])
    }

    pub(crate) fn oled_init(&mut self) {
        for byte in [
            0xAE, 0x00, 0x10, 0x40, 0x81, 0xCF, 0xA1, 0xC8, 0xA6, 0xA8, 0x3F, 0xD3, 0x00, 0xD5,
            0x80, 0xD9, 0xF1, 0xDA, 0x12, 0xDB, 0x40, 0x20, 0x02, 0x8D, 0x14, 0xA4, 0xA6,
        ] {
            self.cmd(byte);
        }
        self.oled_clear();
        self.cmd(0xAF);
    }

    pub(crate) fn oled_color_turn(&mut self, inverse: u8) {
        match inverse {
            0 => self.cmd(0xA6),
            1 => self.cmd(0xA7),
            _ => {}
        }
    }

    pub(crate) fn oled_display_turn(&mut self, flipped: u8) {
        match flipped {
            0 => {
                self.cmd(0xC8);
                self.cmd(0xA1);
            }
            1 => {
                self.cmd(0xC0);
                self.cmd(0xA0);
            }
            _ => {}
        }
    }

    pub(crate) fn oled_revolve(&mut self) {
        self.cmd(0xA0);
        self.cmd(0xC0);
    }

    fn set_pos(&mut self, mut x: u8, mut y: u8) {
        if self.hw == Hw::Pcie {
            x = x.wrapping_add(32);
            y = y.wrapping_add(8);
        }
        self.cmd(0xB0u8.wrapping_add(y));
        self.cmd(((x & 0xF0) >> 4) | 0x10);
        self.cmd(x & 0x0F);
    }

    fn fill_all(&mut self, byte: u8) {
        for page in 0..8u8 {
            self.cmd(0xB0 + page);
            self.cmd(0x00);
            self.cmd(0x10);
            for _ in 0..128 {
                self.data(byte);
            }
        }
    }

    pub(crate) fn oled_clear(&mut self) {
        self.fill_all(0x00);
    }

    pub(crate) fn oled_fill(&mut self) {
        self.fill_all(0xFF);
    }

    fn glyph(c: u8, size: u8) -> Option<&'static [u8]> {
        if !(b' '..=b'~').contains(&c) {
            return None;
        }
        let i = (c - b' ') as usize;
        match size {
            8 => FONT_6X8.get(i).map(|g| &g[..]),
            4 => FONT_4X8.get(i).map(|g| &g[..]),
            _ => None,
        }
    }

    fn show_char(&mut self, x: u8, y: u8, c: u8, size: u8) {
        if let Some(glyph) = Self::glyph(c, size) {
            self.set_pos(x, y);
            for &b in glyph {
                self.data(b);
            }
        }
    }

    fn show_char_turn(&mut self, x: u8, y: u8, c: u8) {
        if let Some(glyph) = Self::glyph(c, 8) {
            self.set_pos(x, y);
            for &b in glyph {
                self.data(!b);
            }
        }
    }

    fn advance(size: u8) -> u8 {
        match size {
            8 => 6,
            4 => 4,
            _ => size / 2,
        }
    }

    pub(crate) fn show_string(&mut self, mut x: u8, y: u8, s: &str, size: u8) {
        for &c in s.as_bytes() {
            self.show_char(x, y, c, size);
            x = x.wrapping_add(Self::advance(size));
        }
    }

    pub(crate) fn show_string_turn(&mut self, mut x: u8, y: u8, s: &str) {
        for &c in s.as_bytes() {
            self.show_char_turn(x, y, c);
            x = x.wrapping_add(6);
        }
    }

    pub(crate) fn show_string_right(&mut self, x_end: u8, y: u8, s: &str, size: u8) {
        let mut x = x_end;
        for &c in s.as_bytes().iter().rev() {
            x = x.wrapping_sub(if size == 8 { 6 } else { 4 });
            self.show_char(x, y, c, size);
        }
    }

    /// `len` digits, leading zeros as spaces.
    fn show_num(&mut self, x: u8, y: u8, num: u8, len: u8, size: u8) {
        let step = size / 2 + if size == 8 { 2 } else { 0 };
        let mut shown = false;
        for t in 0..len {
            let digit = (num as u32 / 10u32.pow((len - t - 1) as u32)) % 10;
            let xt = (x as u32 + step as u32 * t as u32) as u8;
            if !shown && t < len - 1 {
                if digit == 0 {
                    self.show_char(xt, y, b' ', size);
                    continue;
                }
                shown = true;
            }
            self.show_char(xt, y, b'0' + digit as u8, size);
        }
    }

    fn show_state_icon(&mut self, x: u8, y: u8, icon: usize, width: usize) {
        self.set_pos(x, y);
        for &b in &STATE_ICONS[icon][..width] {
            self.data(b);
        }
    }

    pub(crate) fn show_kvm_logo(&mut self) {
        self.show_logo_columns(20, &KVM_LOGO);
    }

    /// The last two columns of the KVM logo: the divider on the PCIe screen.
    pub(crate) fn show_line_pcie(&mut self) {
        self.show_logo_columns(18, &KVM_LOGO[112..]);
    }

    /// Two pages high, one column per byte pair, starting at column `x0 + 1`.
    fn show_logo_columns(&mut self, x0: u8, bytes: &[u8]) {
        let mut x = x0;
        for (i, &b) in bytes.iter().enumerate() {
            if i % 2 == 0 {
                x = x.wrapping_add(1);
            }
            self.set_pos(x, (i % 2) as u8);
            self.data(b);
        }
    }

    /// Sipeed's logo, or /boot/logo.bin when it is exactly 32 bytes.
    pub(crate) fn show_logo(&mut self) {
        let custom = self.p.read("/boot/logo.bin", 33).filter(|d| d.len() == 32);
        let logo: Vec<u8> = custom.unwrap_or_else(|| SIPEED_LOGO.to_vec());
        self.show_logo_columns(0, &logo);
    }

    pub(crate) fn show_line(&mut self) {
        for y in 2..8u8 {
            self.set_pos(3, y);
            let b = if y == 2 { 0xC0 } else { 0xFF };
            for _ in 0..3 {
                self.data(b);
            }
        }
    }

    pub(crate) fn show_img(&mut self, x: u8, y: u8, img: &[u8], width: usize, height: usize) {
        for (count, &b) in img.iter().take(width * height).enumerate() {
            if count % width == 0 {
                self.set_pos(x, y + (count / width) as u8);
            }
            self.data(b);
        }
    }

    pub(crate) fn show_kvm_state(&mut self, which: u8, en: i8) {
        let (x0, x1) = if self.hw == Hw::Pcie {
            (24, 43)
        } else {
            (84, 104)
        };
        if which & HDMI_STATE != 0 {
            self.show_state_icon(x1, 1, if en != 0 { 1 } else { 0 }, 21);
        }
        if which & HID_STATE != 0 {
            self.show_state_icon(x0, 1, if en != 0 { 3 } else { 2 }, 15);
        }
        if which & ETH_STATE != 0 {
            self.show_state_icon(x0, 0, if en != 0 { 5 } else { 4 }, 15);
        }
        if which & WIFI_STATE != 0 {
            match en {
                1 => self.show_state_icon(x1, 0, 7, 15),
                0 => self.show_state_icon(x1, 0, 6, 15),
                _ => self.show_string(x1, 0, " -- ", 4),
            }
        }
    }

    pub(crate) fn show_stream_labels(&mut self) {
        if self.hw != Hw::Pcie {
            self.show_string(10, 3, "IP:                ", 8);
            self.show_string(10, 4, "RES:               ", 8);
            self.show_string(10, 5, "TYPE:              ", 8);
            self.show_string(10, 6, "STREAM:            ", 8);
            self.show_string(10, 7, "QUALITY:           ", 8);
        }
    }

    /// The IP line; an empty address shows "--".
    pub(crate) fn show_ip(&mut self, kind: IpKind, addr: &str) {
        let pcie = self.hw == Hw::Pcie;
        if !pcie {
            match kind {
                IpKind::Eth => self.show_string(10, 3, "IP:                ", 8),
                IpKind::Wifi => self.show_string(10, 3, "W:               ", 8),
            }
        } else {
            self.show_string_right(ALIGN_RIGHT_END_P, 2, "               ", 4);
        }
        let text = if addr.is_empty() { "--" } else { addr };
        if !pcie {
            self.show_string_right(ALIGN_RIGHT_END, 3, text, 8);
        } else {
            self.show_string(0, 2, if kind == IpKind::Eth { "E" } else { "W" }, 4);
            self.show_string_right(ALIGN_RIGHT_END_P, 2, text, 4);
        }
    }

    pub(crate) fn show_stream_type(&mut self, stream_type: u8) {
        if self.hw != Hw::Pcie {
            self.show_string(10, 5, "TYPE:              ", 8);
            let name = match stream_type {
                TYPE_MJPG => "MJPG",
                TYPE_H264 => "H264",
                _ => "--",
            };
            self.show_string_right(ALIGN_RIGHT_END, 5, name, 8);
        }
    }

    pub(crate) fn show_fps(&mut self, fps: u8) {
        if self.hw != Hw::Pcie {
            self.show_string_right(ALIGN_RIGHT_END, 6, "FPS", 8);
            self.show_num(88, 6, fps, 3, 8);
        } else {
            self.show_string_right(ALIGN_RIGHT_END_P, 3, "  FPS", 4);
            self.show_num(42, 3, fps, 3, 4);
            self.show_string_right(ALIGN_RIGHT_END_P - 13, 3, &fps.to_string(), 4);
        }
    }

    pub(crate) fn show_quality(&mut self, bucket: u8) {
        if self.hw != Hw::Pcie {
            self.show_string(10, 7, "QUALITY:           ", 8);
            let name = match bucket {
                1 => "LOW",
                2 => "Middle",
                3 => "HIGH",
                4 => "EXTRA",
                _ => "--",
            };
            self.show_string_right(ALIGN_RIGHT_END, 7, name, 8);
        }
    }

    pub(crate) fn show_resolution(&mut self, w: u16, h: u16) {
        let pcie = self.hw == Hw::Pcie;
        if w != 0 || h != 0 {
            let mut res = format!("{w}*{h}");
            if !pcie {
                self.show_string(10, 4, "RES:               ", 8);
                self.show_string_right(ALIGN_RIGHT_END, 4, &res, 8);
            } else {
                res.truncate(10);
                self.show_string_right(36, 3, "         ", 4);
                self.show_string_right(36, 3, &res, 4);
            }
        } else if !pcie {
            self.show_string(10, 4, "RES:             --", 8);
        } else {
            self.show_string_right(36, 3, "         ", 4);
        }
    }

    /// The "[!]" next to the IP while Ethernet has an address but no route (Full only).
    pub(crate) fn show_network_error(&mut self, error: bool) {
        if self.hw == Hw::Pcie {
            return;
        }
        if error {
            self.set_pos(28, 3);
            for b in ETH_ERROR {
                self.data(b);
            }
        } else {
            self.show_string(28, 3, " ", 8);
        }
    }
}
