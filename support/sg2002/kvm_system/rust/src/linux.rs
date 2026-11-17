//! The device: i2c-dev, evdev, files, interfaces and commands on Linux.

use std::collections::HashMap;
use std::ffi::{CStr, CString};
use std::fs::{self, File, OpenOptions};
use std::io::{Read, Write};
use std::net::Ipv4Addr;
use std::os::fd::AsRawFd;
use std::os::unix::fs::OpenOptionsExt;
use std::process::Stdio;
use std::sync::atomic::{AtomicBool, Ordering};

use crate::{Command, IfaceFlags, KeyEvent, Platform};

const I2C_SLAVE: libc::c_ulong = 0x0703;
// _IOW('E', 0xa0, int): timestamp input events with this clock.
const EVIOCSCLOCKID: libc::c_ulong = 0x4004_45a0;
const EV_KEY: u16 = 0x01;

static SHUTDOWN: AtomicBool = AtomicBool::new(false);

extern "C" fn on_signal(_: libc::c_int) {
    SHUTDOWN.store(true, Ordering::Relaxed);
}

#[derive(Default)]
pub struct Linux {
    buses: HashMap<u8, Option<File>>,
    key: Option<File>,
}

impl Linux {
    pub fn new() -> Self {
        // SAFETY: the handler only stores to an atomic.
        unsafe {
            libc::signal(libc::SIGTERM, on_signal as *const () as libc::sighandler_t);
            libc::signal(libc::SIGINT, on_signal as *const () as libc::sighandler_t);
        }
        Linux::default()
    }
}

fn monotonic_ms() -> u64 {
    let mut ts = libc::timespec {
        tv_sec: 0,
        tv_nsec: 0,
    };
    // SAFETY: valid out pointer.
    unsafe { libc::clock_gettime(libc::CLOCK_MONOTONIC, &mut ts) };
    ts.tv_sec as u64 * 1000 + ts.tv_nsec as u64 / 1_000_000
}

impl Platform for Linux {
    fn now_ms(&mut self) -> u64 {
        monotonic_ms()
    }

    fn shutdown_requested(&mut self) -> bool {
        SHUTDOWN.load(Ordering::Relaxed)
    }

    fn open_key_device(&mut self) -> bool {
        let Ok(file) = OpenOptions::new()
            .read(true)
            .custom_flags(libc::O_NONBLOCK | libc::O_CLOEXEC)
            .open("/dev/input/event0")
        else {
            return false;
        };
        let clock: libc::c_int = libc::CLOCK_MONOTONIC;
        // SAFETY: EVIOCSCLOCKID reads one int.
        unsafe { libc::ioctl(file.as_raw_fd(), EVIOCSCLOCKID as _, &clock) };
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
            let timeout = (deadline_ms - now).min(i32::MAX as u64) as libc::c_int;
            let mut pfd = libc::pollfd {
                fd: self.key.as_ref().map_or(-1, |f| f.as_raw_fd()),
                events: libc::POLLIN,
                revents: 0,
            };
            // SAFETY: one pollfd; fd -1 just sleeps.
            let ready = unsafe { libc::poll(&mut pfd, 1, timeout) };
            if ready <= 0 || pfd.revents & libc::POLLIN == 0 {
                continue;
            }
            let mut ev: libc::input_event = unsafe { std::mem::zeroed() };
            let size = std::mem::size_of::<libc::input_event>();
            // SAFETY: reads at most one input_event into it.
            let n = unsafe { libc::read(pfd.fd, (&mut ev as *mut libc::input_event).cast(), size) };
            if n != size as isize || ev.type_ != EV_KEY || !(0..=1).contains(&ev.value) {
                continue;
            }
            let time_ms = ev.time.tv_sec as u64 * 1000 + ev.time.tv_usec as u64 / 1000;
            return Some(KeyEvent {
                time_ms,
                pressed: ev.value == 1,
            });
        }
    }

    fn i2c_write(&mut self, bus: u8, addr: u8, bytes: &[u8]) -> bool {
        let file = self.buses.entry(bus).or_insert_with(|| {
            OpenOptions::new()
                .read(true)
                .write(true)
                .custom_flags(libc::O_CLOEXEC)
                .open(format!("/dev/i2c-{bus}"))
                .ok()
        });
        let Some(file) = file else {
            return false;
        };
        // SAFETY: I2C_SLAVE takes the address as the argument value.
        if unsafe { libc::ioctl(file.as_raw_fd(), I2C_SLAVE as _, addr as libc::c_ulong) } != 0 {
            return false;
        }
        file.write(bytes).is_ok_and(|n| n == bytes.len())
    }

    fn read(&mut self, path: &str, limit: usize) -> Option<Vec<u8>> {
        let mut options = OpenOptions::new();
        options.read(true).custom_flags(libc::O_CLOEXEC);
        if path.starts_with("/dev/shm/") {
            options.custom_flags(libc::O_CLOEXEC | libc::O_NOFOLLOW);
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
        let scratch = format!("{path}.new");
        match fs::remove_file(&scratch) {
            Ok(()) => {}
            Err(e) if e.kind() == std::io::ErrorKind::NotFound => {}
            Err(_) => return false,
        }
        let written = (|| -> std::io::Result<()> {
            let mut f = OpenOptions::new()
                .write(true)
                .create_new(true)
                .mode(0o600)
                .custom_flags(libc::O_NOFOLLOW | libc::O_CLOEXEC)
                .open(&scratch)?;
            use std::os::unix::fs::PermissionsExt;
            f.set_permissions(fs::Permissions::from_mode(0o600))?;
            f.write_all(data)?;
            f.sync_all()
        })();
        if written.is_err() || fs::rename(&scratch, path).is_err() {
            let _ = fs::remove_file(&scratch);
            return false;
        }
        true
    }

    fn run(&mut self, cmd: Command) -> Option<String> {
        let argv = cmd.argv();
        let out = std::process::Command::new(argv[0])
            .args(&argv[1..])
            .stdin(Stdio::null())
            .stderr(Stdio::null())
            .output()
            .ok()?;
        Some(String::from_utf8_lossy(&out.stdout).into_owned())
    }

    fn iface_flags(&mut self, name: &str) -> Option<IfaceFlags> {
        // SAFETY: a plain socket for SIOCGIFFLAGS, closed below; ifr is zeroed and sized.
        unsafe {
            let sock = libc::socket(libc::AF_INET, libc::SOCK_DGRAM | libc::SOCK_CLOEXEC, 0);
            if sock < 0 {
                return None;
            }
            let mut ifr: libc::ifreq = std::mem::zeroed();
            for (dst, &src) in ifr
                .ifr_name
                .iter_mut()
                .zip(name.as_bytes().iter().take(libc::IFNAMSIZ - 1))
            {
                *dst = src as libc::c_char;
            }
            let r = libc::ioctl(sock, libc::SIOCGIFFLAGS as _, &mut ifr);
            libc::close(sock);
            if r < 0 {
                return None;
            }
            let flags = ifr.ifr_ifru.ifru_flags as libc::c_int;
            Some(IfaceFlags {
                up: flags & libc::IFF_UP != 0,
                running: flags & libc::IFF_RUNNING != 0,
            })
        }
    }

    fn iface_ipv4(&mut self, name: &str) -> Option<Ipv4Addr> {
        let want = CString::new(name).ok()?;
        let mut found = None;
        // SAFETY: the list is walked read-only and freed once.
        unsafe {
            let mut list: *mut libc::ifaddrs = std::ptr::null_mut();
            if libc::getifaddrs(&mut list) != 0 {
                return None;
            }
            let mut ifa = list;
            while !ifa.is_null() {
                let addr = (*ifa).ifa_addr;
                if !addr.is_null()
                    && (*addr).sa_family as libc::c_int == libc::AF_INET
                    && CStr::from_ptr((*ifa).ifa_name) == want.as_c_str()
                {
                    let sin = &*(addr as *const libc::sockaddr_in);
                    // The last address listed wins, as in the C++.
                    found = Some(Ipv4Addr::from(u32::from_be(sin.sin_addr.s_addr)));
                }
                ifa = (*ifa).ifa_next;
            }
            libc::freeifaddrs(list);
        }
        found
    }

    fn random(&mut self, buf: &mut [u8]) -> bool {
        let mut done = 0;
        while done < buf.len() {
            // SAFETY: writes within buf.
            let got =
                unsafe { libc::getrandom(buf[done..].as_mut_ptr().cast(), buf.len() - done, 0) };
            if got < 0 && std::io::Error::last_os_error().kind() == std::io::ErrorKind::Interrupted
            {
                continue;
            }
            if got <= 0 {
                buf.fill(0);
                return false;
            }
            done += got as usize;
        }
        true
    }
}
