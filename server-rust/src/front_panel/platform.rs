//! Everything the front panel needs from the outside. `device::Device` is the board;
//! the tests drive the same code through a recorded scenario.

use std::net::Ipv4Addr;

/// A button edge, timestamped by the input device in milliseconds (CLOCK_MONOTONIC).
#[derive(Clone, Copy, Debug)]
pub struct KeyEvent {
    pub time_ms: u64,
    pub pressed: bool,
}

/// The commands the front panel runs, argv only.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Command {
    WifiRestart,
    WifiAp,
    HostapdAllSta,
    WpaStatus,
}

impl Command {
    /// As the C++ ran them; the golden traces record this. The board answers `WpaStatus`
    /// from wpa_supplicant's control socket: the image has no wpa_cli.
    pub fn argv(self) -> &'static [&'static str] {
        match self {
            Command::WifiRestart => &["/etc/init.d/S30wifi", "restart"],
            Command::WifiAp => &["/etc/init.d/S30wifi", "ap"],
            Command::HostapdAllSta => &["hostapd_cli", "all", "sta"],
            Command::WpaStatus => &["wpa_cli", "-i", "wlan0", "status"],
        }
    }
}

/// Interface flags, reduced to what the front panel looks at.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct IfaceFlags {
    pub up: bool,
    pub running: bool,
}

pub trait Platform {
    fn now_ms(&mut self) -> u64;
    /// True once the server asked the panel to stop.
    fn shutdown_requested(&mut self) -> bool;
    /// Opens the button; false when there is none.
    fn open_key_device(&mut self) -> bool;
    /// The next button edge, waiting until `deadline` at the latest.
    fn next_key(&mut self, deadline_ms: u64) -> Option<KeyEvent>;

    /// One I2C write to a 7-bit address; false on any failure.
    fn i2c_write(&mut self, bus: u8, addr: u8, bytes: &[u8]) -> bool;

    /// At most `limit` bytes of a file; None if it cannot be opened or read.
    fn read(&mut self, path: &str, limit: usize) -> Option<Vec<u8>>;
    fn exists(&mut self, path: &str) -> bool;
    /// Truncates and writes; false on failure.
    fn write(&mut self, path: &str, data: &[u8]) -> bool;
    /// Creates an empty file (0644) or removes it.
    fn set_marker(&mut self, path: &str, present: bool);
    fn remove(&mut self, path: &str);
    /// Writes mode 0600 through `PATH.new` and a rename; false leaves `path` unchanged.
    fn write_secret(&mut self, path: &str, data: &[u8]) -> bool;

    /// Runs a command without a shell and returns its stdout.
    fn run(&mut self, cmd: Command) -> Option<String>;
    fn iface_flags(&mut self, name: &str) -> Option<IfaceFlags>;
    fn iface_ipv4(&mut self, name: &str) -> Option<Ipv4Addr>;
    /// Fills `buf` from the kernel CSPRNG; false on failure.
    fn random(&mut self, buf: &mut [u8]) -> bool;
}
