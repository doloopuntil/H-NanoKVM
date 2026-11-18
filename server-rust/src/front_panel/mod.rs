//! The front panel: the status OLED and button of the Full and PCIe boards, Wi-Fi setup
//! over an access point, and the status files the server reads. Ported from the C++
//! kvm_system; tests/front_panel/golden holds the behaviour it must keep.

mod device;
mod font;
mod oled;
pub mod platform;
mod status;
mod ui;
mod wifi;

pub use device::{start, stop};
pub use platform::{Command, IfaceFlags, KeyEvent, Platform};

const STATE_DELAY_MS: u64 = 1000;
const OLED_DELAY_MS: u64 = 1000;
const KEY_LONG_PRESS_MS: u64 = 1500;

/// /etc/kvm/hw: no file (or anything else) is the first board, "beta" Full, "pcie" PCIe.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Hw {
    Alpha,
    Beta,
    Pcie,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum IpKind {
    Eth,
    Wifi,
}

/// What the status thread found (kvm_sys_state_t).
#[derive(Debug)]
struct SysState {
    page: i8,
    sub_page: i8,
    eth_route: String,
    wifi_route: String,
    eth_addr: String,
    wifi_addr: String,
    eth_state: i8,
    wifi_state: i8,
    hdmi_state: i8,
    usb_state: i8,
    hid_state: i8,
    udisk_state: i8,
    hdmi_width: i16,
    hdmi_height: i16,
    stream_type: i8,
    now_fps: i8,
    qlty: i16,
    wifi_config_process: i8,
    wifi_ap_pass: String,
}

impl Default for SysState {
    fn default() -> Self {
        SysState {
            page: 0,
            sub_page: 0,
            eth_route: String::new(),
            wifi_route: String::new(),
            eth_addr: String::new(),
            wifi_addr: String::new(),
            eth_state: -1,
            wifi_state: -1,
            hdmi_state: -1,
            usb_state: -1,
            hid_state: -1,
            udisk_state: -1,
            hdmi_width: 0,
            hdmi_height: 0,
            stream_type: 0,
            now_fps: 0,
            qlty: 0,
            wifi_config_process: -1,
            wifi_ap_pass: String::new(),
        }
    }
}

/// What the OLED shows (kvm_oled_state_t).
#[derive(Debug)]
struct OledState {
    page: i8,
    sub_page: i8,
    eth_addr: String,
    wifi_addr: String,
    eth_state: i8,
    wifi_state: i8,
    hdmi_state: i8,
    usb_state: i8,
    hdmi_width: i16,
    hdmi_height: i16,
    stream_type: i8,
    now_fps: i8,
    qlty: i16,
    sleep_param: u32,
    sleep_start: u64,
}

impl Default for OledState {
    fn default() -> Self {
        OledState {
            page: -1,
            sub_page: -1,
            eth_addr: String::new(),
            wifi_addr: String::new(),
            eth_state: -1,
            wifi_state: -1,
            hdmi_state: -1,
            usb_state: -1,
            hdmi_width: -1,
            hdmi_height: -1,
            stream_type: -1,
            now_fps: -1,
            qlty: -1,
            sleep_param: 0,
            sleep_start: 0,
        }
    }
}

pub struct System<P: Platform> {
    p: P,
    hw: Hw,
    oled_present: bool,
    sys: SysState,
    oled: OledState,
    ip_run_count: u8,
    ip_kind: IpKind,
    eth_kind_shown: Option<IpKind>,
    wifi_kind_shown: Option<IpKind>,
    hdmi: status::HdmiCache,
    persisted_wifi_state: Option<i8>,
    press_start: Option<u64>,
    connect_deadline: Option<u64>,
}

impl<P: Platform> System<P> {
    pub fn new(p: P) -> Self {
        System {
            p,
            hw: Hw::Alpha,
            oled_present: false,
            sys: SysState::default(),
            oled: OledState::default(),
            ip_run_count: 0,
            ip_kind: IpKind::Eth,
            eth_kind_shown: None,
            wifi_kind_shown: None,
            hdmi: status::HdmiCache::default(),
            persisted_wifi_state: None,
            press_start: None,
            connect_deadline: None,
        }
    }

    pub fn into_platform(self) -> P {
        self.p
    }

    /// Runs until `stop`: status every second, the OLED every second, keys at once.
    pub fn run(&mut self) {
        self.oled_present = self.oled_detect();
        self.p.set_marker("/etc/kvm/oled_exist", self.oled_present);

        self.sys_tick();
        let mut next_sys = self.p.now_ms() + STATE_DELAY_MS;
        let mut next_oled = u64::MAX;
        if self.oled_present {
            self.oled_init();
            self.oled_color_turn(0);
            self.oled_display_turn(0);
            self.oled_clear();
            self.oled_tick();
            next_oled = self.p.now_ms() + OLED_DELAY_MS;
        }
        let keys = self.p.open_key_device();

        loop {
            let deadline = next_sys.min(next_oled);
            if keys {
                if let Some(event) = self.p.next_key(deadline) {
                    self.key_event(event);
                    continue;
                }
            } else {
                self.p.next_key(deadline);
            }
            if self.p.shutdown_requested() {
                break;
            }
            let now = self.p.now_ms();
            if now >= next_sys {
                self.sys_tick();
                next_sys = self.p.now_ms() + STATE_DELAY_MS;
            }
            if now >= next_oled {
                self.oled_tick();
                next_oled = self.p.now_ms() + OLED_DELAY_MS;
            }
        }
        if self.oled_present {
            self.oled_clear();
        }
    }

    fn sys_tick(&mut self) {
        match self.sys.page {
            0 => {
                self.update_eth_state();
                self.update_wifi_state();
                self.update_usb_state();
                self.update_hdmi_state();
                self.update_stream_fps();
                self.update_hdmi_res();
                self.update_stream_type();
                self.update_stream_qlty();
                self.wifi_web_config_process();
            }
            1 => self.wifi_config_process(),
            _ => {}
        }
    }

    fn oled_tick(&mut self) {
        self.oled_auto_sleep();
        let page_changed = self.oled.page != self.sys.page;
        let sub_page_changed = self.oled.sub_page != self.sys.sub_page;
        self.oled.page = self.sys.page;
        self.oled.sub_page = self.sys.sub_page;
        match self.oled.page {
            0 => self.main_ui(page_changed, sub_page_changed),
            1 => self.wifi_config_ui(page_changed, sub_page_changed),
            _ => self.oled_clear(),
        }
    }

    fn key_event(&mut self, event: KeyEvent) {
        if event.pressed {
            self.press_start = Some(event.time_ms);
            return;
        }
        let Some(start) = self.press_start.take() else {
            return;
        };
        self.oled_sleep_time_update();
        if event.time_ms.saturating_sub(start) >= KEY_LONG_PRESS_MS {
            if self.sys.wifi_state == -2 {
                self.sys.page = 0;
                self.sys.sub_page = 0;
                return;
            }
            match self.sys.page {
                0 => {
                    self.sys.page = 1;
                    self.sys.sub_page = 0;
                }
                1 => {
                    self.p.run(Command::WifiRestart);
                    self.sys.page = 0;
                    self.sys.sub_page = 0;
                    self.sys.wifi_config_process = -1;
                    self.connect_deadline = None;
                }
                _ => {}
            }
            return;
        }
        let sub = self.sys.sub_page;
        match (self.sys.page, self.sys.wifi_config_process) {
            (0, _) => self.sys.sub_page = if sub == 0 { 1 } else { 0 },
            (1, 1) => self.sys.sub_page = if sub == 1 { 2 } else { 1 },
            (1, 2) => self.sys.sub_page = if (1..=3).contains(&sub) { sub + 1 } else { 1 },
            _ => {}
        }
    }
}
