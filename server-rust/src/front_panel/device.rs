//! The device side of the front panel: i2c-dev, the button, files, interfaces and commands.

use std::{
    collections::HashMap,
    fs::{self, File, OpenOptions},
    io::{Read, Write},
    net::Ipv4Addr,
    os::{
        fd::{AsFd, AsRawFd},
        unix::{fs::OpenOptionsExt, net::UnixStream},
    },
    path::Path,
    sync::{
        Mutex, OnceLock,
        atomic::{AtomicBool, Ordering},
    },
    thread::{self, JoinHandle},
    time::{Duration, Instant},
};

use nix::{
    ifaddrs::getifaddrs,
    libc,
    net::if_::InterfaceFlags,
    poll::{PollFd, PollFlags, PollTimeout, poll},
    time::{ClockId, clock_gettime},
};
use tokio::runtime::Handle;
use tracing::{info, warn};

use super::{Command, IfaceFlags, KeyEvent, Platform, System};
use crate::{
    fsutil::write_0600_atomic,
    system::command::{AllowedCommand, run_allowed},
};

const KEY_DEVICE: &str = "/dev/input/event0";
const EV_KEY: u16 = 0x01;
// struct input_event on 64-bit Linux: timeval (two i64), type, code, value.
const INPUT_EVENT_SIZE: usize = 24;
#[cfg(target_os = "linux")]
const _: () = assert!(std::mem::size_of::<libc::input_event>() == INPUT_EVENT_SIZE);
const WIFI_SCRIPT_TIMEOUT: Duration = Duration::from_secs(120);
const CLI_TIMEOUT: Duration = Duration::from_secs(5);

nix::ioctl_write_int_bad!(i2c_slave, 0x0703);
// EVIOCSCLOCKID: timestamp the button's events with this clock.
nix::ioctl_write_ptr!(evdev_set_clock, b'E', 0xa0, libc::clockid_t);

static SHUTDOWN: AtomicBool = AtomicBool::new(false);
static WAKE: OnceLock<UnixStream> = OnceLock::new();
static THREAD: Mutex<Option<JoinHandle<()>>> = Mutex::new(None);

/// Starts the front panel on its own thread. Call from inside the Tokio runtime: the
/// thread runs its commands on it.
pub fn start() {
    let runtime = Handle::current();
    let (wake_rx, wake_tx) = match UnixStream::pair() {
        Ok(pair) => pair,
        Err(err) => {
            warn!(error = %err, "front panel not started");
            return;
        }
    };
    let _ = WAKE.set(wake_tx);
    let spawned = thread::Builder::new()
        .name("front-panel".to_string())
        .spawn(move || {
            System::new(Device::new(runtime, wake_rx)).run();
            info!("front panel stopped");
        });
    match spawned {
        Ok(handle) => {
            if let Ok(mut slot) = THREAD.lock() {
                *slot = Some(handle);
            }
            info!("front panel started");
        }
        Err(err) => warn!(error = %err, "front panel not started"),
    }
}

/// Asks the front panel to clear the OLED and stop; waits up to `timeout`. Blocks.
pub fn stop(timeout: Duration) {
    SHUTDOWN.store(true, Ordering::Relaxed);
    if let Some(mut wake) = WAKE.get() {
        let _ = wake.write(&[1]);
    }
    let Some(handle) = THREAD.lock().ok().and_then(|mut slot| slot.take()) else {
        return;
    };
    let started = Instant::now();
    while !handle.is_finished() && started.elapsed() < timeout {
        thread::sleep(Duration::from_millis(20));
    }
}

struct Device {
    runtime: Handle,
    wake: UnixStream,
    buses: HashMap<u8, Option<File>>,
    key: Option<File>,
}

impl Device {
    fn new(runtime: Handle, wake: UnixStream) -> Self {
        Device {
            runtime,
            wake,
            buses: HashMap::new(),
            key: None,
        }
    }
}

fn monotonic_ms() -> u64 {
    clock_gettime(ClockId::CLOCK_MONOTONIC)
        .map(|ts| ts.tv_sec() as u64 * 1000 + ts.tv_nsec() as u64 / 1_000_000)
        .unwrap_or(0)
}

/// A key press or release from one raw input_event.
fn parse_key_event(buf: &[u8; INPUT_EVENT_SIZE]) -> Option<KeyEvent> {
    let sec = i64::from_ne_bytes(buf[0..8].try_into().ok()?);
    let usec = i64::from_ne_bytes(buf[8..16].try_into().ok()?);
    let kind = u16::from_ne_bytes(buf[16..18].try_into().ok()?);
    let value = i32::from_ne_bytes(buf[20..24].try_into().ok()?);
    if kind != EV_KEY || !(0..=1).contains(&value) {
        return None;
    }
    Some(KeyEvent {
        time_ms: sec.max(0) as u64 * 1000 + usec.max(0) as u64 / 1000,
        pressed: value == 1,
    })
}

impl Platform for Device {
    fn now_ms(&mut self) -> u64 {
        monotonic_ms()
    }

    fn shutdown_requested(&mut self) -> bool {
        SHUTDOWN.load(Ordering::Relaxed)
    }

    fn open_key_device(&mut self) -> bool {
        let Ok(file) = OpenOptions::new()
            .read(true)
            .custom_flags(libc::O_NONBLOCK)
            .open(KEY_DEVICE)
        else {
            return false;
        };
        let clock = ClockId::CLOCK_MONOTONIC.as_raw();
        // SAFETY: EVIOCSCLOCKID reads one clockid_t from a valid pointer.
        let _ = unsafe { evdev_set_clock(file.as_raw_fd(), &clock) };
        self.key = Some(file);
        true
    }

    fn next_key(&mut self, deadline_ms: u64) -> Option<KeyEvent> {
        loop {
            if SHUTDOWN.load(Ordering::Relaxed) {
                return None;
            }
            let now = monotonic_ms();
            if now >= deadline_ms {
                return None;
            }
            let timeout = PollTimeout::try_from(deadline_ms - now).unwrap_or(PollTimeout::MAX);
            let mut fds = vec![PollFd::new(self.wake.as_fd(), PollFlags::POLLIN)];
            if let Some(key) = &self.key {
                fds.push(PollFd::new(key.as_fd(), PollFlags::POLLIN));
            }
            if poll(&mut fds, timeout).unwrap_or(0) <= 0 {
                continue;
            }
            let key_ready = fds
                .get(1)
                .and_then(|fd| fd.revents())
                .unwrap_or(PollFlags::empty());
            drop(fds);
            if key_ready.intersects(PollFlags::POLLERR | PollFlags::POLLHUP | PollFlags::POLLNVAL) {
                warn!("front panel button device failed; ignoring the button");
                self.key = None;
                continue;
            }
            if !key_ready.contains(PollFlags::POLLIN) {
                continue;
            }
            let mut buf = [0_u8; INPUT_EVENT_SIZE];
            let Some(key) = self.key.as_mut() else {
                continue;
            };
            if key.read(&mut buf).ok() != Some(INPUT_EVENT_SIZE) {
                continue;
            }
            if let Some(event) = parse_key_event(&buf) {
                return Some(event);
            }
        }
    }

    fn i2c_write(&mut self, bus: u8, addr: u8, bytes: &[u8]) -> bool {
        let file = self.buses.entry(bus).or_insert_with(|| {
            OpenOptions::new()
                .read(true)
                .write(true)
                .open(format!("/dev/i2c-{bus}"))
                .ok()
        });
        let Some(file) = file else {
            return false;
        };
        // SAFETY: I2C_SLAVE takes the address as the argument value.
        if unsafe { i2c_slave(file.as_raw_fd(), addr.into()) }.is_err() {
            return false;
        }
        file.write(bytes).is_ok_and(|n| n == bytes.len())
    }

    fn read(&mut self, path: &str, limit: usize) -> Option<Vec<u8>> {
        let mut options = OpenOptions::new();
        options.read(true);
        if path.starts_with("/dev/shm/") {
            options.custom_flags(libc::O_NOFOLLOW);
        }
        let file = options.open(path).ok()?;
        let mut data = Vec::new();
        file.take(limit as u64).read_to_end(&mut data).ok()?;
        Some(data)
    }

    fn exists(&mut self, path: &str) -> bool {
        fs::metadata(path).is_ok()
    }

    fn write(&mut self, path: &str, data: &[u8]) -> bool {
        File::create(path)
            .and_then(|mut f| f.write_all(data))
            .is_ok()
    }

    fn set_marker(&mut self, path: &str, present: bool) {
        if present {
            let _ = OpenOptions::new()
                .write(true)
                .create(true)
                .truncate(false)
                .mode(0o644)
                .open(path);
        } else {
            let _ = fs::remove_file(path);
        }
    }

    fn remove(&mut self, path: &str) {
        let _ = fs::remove_file(path);
    }

    fn write_secret(&mut self, path: &str, data: &[u8]) -> bool {
        write_0600_atomic(Path::new(path), data).is_ok()
    }

    fn run(&mut self, cmd: Command) -> Option<String> {
        let (program, args, timeout): (_, &[&str], _) = match cmd {
            Command::WifiRestart => (
                AllowedCommand::ServiceWifi,
                &["restart"],
                WIFI_SCRIPT_TIMEOUT,
            ),
            Command::WifiAp => (AllowedCommand::ServiceWifi, &["ap"], WIFI_SCRIPT_TIMEOUT),
            Command::HostapdAllSta => (AllowedCommand::HostapdCli, &["all", "sta"], CLI_TIMEOUT),
            Command::WpaStatus => (
                AllowedCommand::WpaCli,
                &["-i", "wlan0", "status"],
                CLI_TIMEOUT,
            ),
        };
        match self.runtime.block_on(run_allowed(program, args, timeout)) {
            Ok(out) => Some(String::from_utf8_lossy(&out.stdout).into_owned()),
            Err(err) => {
                warn!(command = ?cmd, error = %err, "front panel command failed");
                None
            }
        }
    }

    fn iface_flags(&mut self, name: &str) -> Option<IfaceFlags> {
        let flags = getifaddrs()
            .ok()?
            .find(|ifa| ifa.interface_name == name)?
            .flags;
        Some(IfaceFlags {
            up: flags.contains(InterfaceFlags::IFF_UP),
            running: flags.contains(InterfaceFlags::IFF_RUNNING),
        })
    }

    fn iface_ipv4(&mut self, name: &str) -> Option<Ipv4Addr> {
        // The last address listed wins, as in the C++.
        getifaddrs()
            .ok()?
            .filter(|ifa| ifa.interface_name == name)
            .filter_map(|ifa| ifa.address?.as_sockaddr_in().map(|sin| sin.ip()))
            .last()
    }

    fn random(&mut self, buf: &mut [u8]) -> bool {
        if getrandom::fill(buf).is_ok() {
            return true;
        }
        buf.fill(0);
        false
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn event(sec: i64, usec: i64, kind: u16, value: i32) -> [u8; INPUT_EVENT_SIZE] {
        let mut buf = [0_u8; INPUT_EVENT_SIZE];
        buf[0..8].copy_from_slice(&sec.to_ne_bytes());
        buf[8..16].copy_from_slice(&usec.to_ne_bytes());
        buf[16..18].copy_from_slice(&kind.to_ne_bytes());
        buf[18..20].copy_from_slice(&30_u16.to_ne_bytes());
        buf[20..24].copy_from_slice(&value.to_ne_bytes());
        buf
    }

    #[test]
    fn parses_key_presses_and_releases() {
        let press = parse_key_event(&event(12, 345_678, EV_KEY, 1)).unwrap();
        assert_eq!((press.time_ms, press.pressed), (12_345, true));
        let release = parse_key_event(&event(13, 0, EV_KEY, 0)).unwrap();
        assert_eq!((release.time_ms, release.pressed), (13_000, false));
    }

    #[test]
    fn ignores_repeats_and_other_events() {
        assert!(parse_key_event(&event(1, 0, EV_KEY, 2)).is_none());
        assert!(parse_key_event(&event(1, 0, 0, 0)).is_none());
    }
}
