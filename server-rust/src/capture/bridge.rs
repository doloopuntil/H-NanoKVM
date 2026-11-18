//! The LT6911 HDMI bridge at 0x2b on i2c-4: bank select is a write of [0xff, bank], a read is
//! a one-byte register write followed by the read. Register use as in libkvm.

use std::sync::atomic::{AtomicU16, Ordering::*};

use super::{
    engine::{Engine, NEW_RES, NORMAL_RES, UNKNOWN_RES, UNSUPPORT_RES},
    platform::Platform,
};

const ADDR: u8 = 0x2b;

/// The bridge chip, from /etc/kvm/hdmi_version.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(super) enum Chip {
    /// LT6911C ("c", or anything unknown)
    C,
    /// LT6911UXC ("ux")
    Uxc,
    /// No bridge answers ("ue"): sizes are found by scanning
    Ue,
    /// LT6911D ("d")
    D,
}

const HDMI_RES_LIST: [(u16, u16); 12] = [
    (1920, 1080),
    (1600, 900),
    (1440, 1080),
    (1440, 900),
    (1280, 1024),
    (1280, 960),
    (1280, 800),
    (1280, 720),
    (1152, 864),
    (1024, 768),
    (800, 600),
    (640, 480),
];

const HDMI_UNSUPPORTED_RES_LIST: [(u16, u16); 6] = [
    (1680, 1050),
    (1440, 1050),
    (1400, 1050),
    (1368, 768),
    (1366, 768),
    (720, 576),
];

pub(super) fn res_list() -> &'static [(u16, u16)] {
    &HDMI_RES_LIST
}

pub(super) fn check_res(w: u16, h: u16) -> u8 {
    if HDMI_RES_LIST.contains(&(w, h)) {
        NORMAL_RES
    } else if HDMI_UNSUPPORTED_RES_LIST.contains(&(w, h)) {
        UNSUPPORT_RES
    } else {
        UNKNOWN_RES
    }
}

/// The last size lt6911_get_csi_res reported as new (statics in the C++).
#[derive(Default)]
pub(super) struct LastCsi {
    w: AtomicU16,
    h: AtomicU16,
}

impl<P: Platform> Engine<P> {
    fn lt_write(&self, bytes: &[u8]) {
        let _ = self.p.i2c_write(ADDR, bytes);
    }

    fn lt_reg(&self, reg: u8, val: u8) {
        self.lt_write(&[reg, val]);
    }

    /// Writes the register address, then reads `buf.len()` bytes.
    fn lt_read(&self, reg: u8, buf: &mut [u8]) -> bool {
        self.lt_write(&[reg]);
        let ok = self.p.i2c_read(ADDR, buf);
        if !ok {
            tracing::debug!(len = buf.len(), "LT6911 I2C read failed");
        }
        ok
    }

    fn lt_read16(&self, reg: u8) -> Option<u16> {
        let mut b = [0_u8; 2];
        self.lt_read(reg, &mut b).then(|| u16::from_be_bytes(b))
    }

    pub(super) fn lt6911_enable(&self, chip: Chip) {
        if chip == Chip::D {
            return;
        }
        self.lt_reg(0xff, 0x80);
        self.lt_reg(0xee, 0x01);
        if chip == Chip::Uxc {
            // The chip's own watchdog off
            self.lt_reg(0x10, 0x00);
        }
    }

    pub(super) fn lt6911_disable(&self, chip: Chip) {
        if chip == Chip::D {
            return;
        }
        self.lt_reg(0xff, 0x80);
        self.lt_reg(0xee, 0x00);
    }

    /// True when the bridge reports an HDMI input.
    pub(super) fn lt6911_get_hdmi_res(&self, chip: Chip) -> bool {
        match chip {
            Chip::C => {
                self.lt_reg(0xff, 0xd2);
                self.lt_reg(0x83, 0x11);
                self.p.sleep_ms(5);
                let Some(v) = self.lt_read16(0x96) else {
                    return false;
                };
                let Some(h) = self.lt_read16(0x8b) else {
                    return false;
                };
                v != 0 && h.wrapping_mul(2) != 0
            }
            Chip::Uxc => {
                self.lt_reg(0xff, 0x86);
                self.lt_reg(0xff, 0x86);
                // 0x55 stable, 0x88 gone
                let mut b = [0_u8; 1];
                self.lt_read(0xa3, &mut b) && b[0] == 0x55
            }
            Chip::D => {
                self.lt_reg(0xff, 0xe0);
                let Some(h) = self.lt_read16(0x8c) else {
                    return false;
                };
                let Some(v) = self.lt_read16(0x8e) else {
                    return false;
                };
                h.wrapping_mul(2) != 0 || v != 0
            }
            Chip::Ue => false,
        }
    }

    /// The size on the CSI side, classified; a new supported size is stored in `size` and
    /// written to /kvmapp/kvm/width and height.
    pub(super) fn lt6911_get_csi_res(&self, chip: Chip, size: &mut (u16, u16)) -> u8 {
        let (bank, v_reg, h_reg, h_double) = match chip {
            Chip::C => (0xc2, 0x06, 0x38, false),
            Chip::Uxc => (0x85, 0xf0, 0xea, false),
            Chip::D => (0xe0, 0x8e, 0x8c, true),
            Chip::Ue => return UNKNOWN_RES,
        };
        self.lt_reg(0xff, bank);
        let Some(v) = self.lt_read16(v_reg) else {
            return UNKNOWN_RES;
        };
        let Some(h) = self.lt_read16(h_reg) else {
            return UNKNOWN_RES;
        };
        let h = if h_double { h.wrapping_mul(2) } else { h };
        let mut res = check_res(h, v);
        let last = &self.last_csi;
        if res == NORMAL_RES && (last.w.load(Relaxed) != h || last.h.load(Relaxed) != v) {
            last.w.store(h, Relaxed);
            last.h.store(v, Relaxed);
            *size = (h, v);
            res = NEW_RES;
        }
        match res {
            NEW_RES => {
                tracing::info!(width = h, height = v, "HDMI input size");
                self.write_res_to_file(h, v);
            }
            UNSUPPORT_RES => tracing::info!(width = h, height = v, "unsupported HDMI input size"),
            UNKNOWN_RES => tracing::debug!(width = h, height = v, "unknown HDMI input size"),
            _ => {}
        }
        res
    }

    /// lt6911_get_csi_res with retries: sizes read mid-switch can be odd.
    pub(super) fn refresh_csi_resolution(&self, chip: Chip) -> u8 {
        let mut size = (
            self.s.vi_width.load(Relaxed),
            self.s.vi_height.load(Relaxed),
        );
        let mut result = self.lt6911_get_csi_res(chip, &mut size);
        for _ in 0..5 {
            if result != UNKNOWN_RES {
                break;
            }
            self.p.sleep_ms(200);
            result = self.lt6911_get_csi_res(chip, &mut size);
        }
        self.s.vi_width.store(size.0, Release);
        self.s.vi_height.store(size.1, Release);
        result
    }
}
