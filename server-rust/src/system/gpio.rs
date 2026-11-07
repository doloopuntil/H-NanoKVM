//! GPIO lines looked up by their device-tree name through the GPIO v2 character device.
//! A requested line stays claimed, at the level it was given, until its `Line` is dropped.

use std::fs::{self, File, OpenOptions};
use std::io;
use std::mem::MaybeUninit;
use std::os::fd::{AsRawFd, FromRawFd, OwnedFd};
use std::path::PathBuf;

const NAME_SIZE: usize = 32;
const LINES_MAX: usize = 64;
const NUM_ATTRS_MAX: usize = 10;

const FLAG_INPUT: u64 = 1 << 2;
const FLAG_OUTPUT: u64 = 1 << 3;
const ATTR_ID_OUTPUT_VALUES: u32 = 2;

// Layouts from include/uapi/linux/gpio.h; some fields are only read by the kernel.
#[repr(C)]
#[allow(dead_code)]
struct ChipInfo {
    name: [u8; NAME_SIZE],
    label: [u8; NAME_SIZE],
    lines: u32,
}

#[repr(C)]
#[allow(dead_code)]
#[derive(Clone, Copy)]
struct LineAttribute {
    id: u32,
    padding: u32,
    value: u64,
}

#[repr(C)]
#[allow(dead_code)]
#[derive(Clone, Copy)]
struct LineConfigAttribute {
    attr: LineAttribute,
    mask: u64,
}

#[repr(C)]
#[allow(dead_code)]
struct LineConfig {
    flags: u64,
    num_attrs: u32,
    padding: [u32; 5],
    attrs: [LineConfigAttribute; NUM_ATTRS_MAX],
}

#[repr(C)]
#[allow(dead_code)]
struct LineRequest {
    offsets: [u32; LINES_MAX],
    consumer: [u8; NAME_SIZE],
    config: LineConfig,
    num_lines: u32,
    event_buffer_size: u32,
    padding: [u32; 5],
    fd: i32,
}

#[repr(C)]
#[allow(dead_code)]
struct LineInfo {
    name: [u8; NAME_SIZE],
    consumer: [u8; NAME_SIZE],
    offset: u32,
    num_attrs: u32,
    flags: u64,
    attrs: [LineAttribute; NUM_ATTRS_MAX],
    padding: [u32; 4],
}

#[repr(C)]
#[allow(dead_code)]
struct LineValues {
    bits: u64,
    mask: u64,
}

const _: () = assert!(size_of::<ChipInfo>() == 68);
const _: () = assert!(size_of::<LineConfig>() == 272);
const _: () = assert!(size_of::<LineRequest>() == 592);
const _: () = assert!(size_of::<LineInfo>() == 256);
const _: () = assert!(size_of::<LineValues>() == 16);

nix::ioctl_read!(chip_info_ioctl, 0xB4, 0x01, ChipInfo);
nix::ioctl_readwrite!(line_info_ioctl, 0xB4, 0x05, LineInfo);
nix::ioctl_readwrite!(line_request_ioctl, 0xB4, 0x07, LineRequest);
nix::ioctl_readwrite!(get_values_ioctl, 0xB4, 0x0E, LineValues);
nix::ioctl_readwrite!(set_values_ioctl, 0xB4, 0x0F, LineValues);

/// All-zero instance of a uAPI struct; every field is an integer or an array of them.
fn zeroed<T>() -> T {
    // SAFETY: only used for the plain-integer repr(C) structs above.
    unsafe { MaybeUninit::<T>::zeroed().assume_init() }
}

#[derive(Debug, Clone, Copy)]
pub enum Direction {
    Input,
    /// Output, driven to the given level as soon as it is claimed.
    Output(bool),
}

#[derive(Debug)]
pub struct Line {
    fd: OwnedFd,
}

impl Line {
    /// Claims the line called `name` in the device tree.
    pub fn request(name: &str, consumer: &str, direction: Direction) -> io::Result<Self> {
        let (chip, offset) = find(name)?;
        let mut req: LineRequest = zeroed();
        req.offsets[0] = offset;
        req.num_lines = 1;
        copy_name(&mut req.consumer, consumer);
        match direction {
            Direction::Input => req.config.flags = FLAG_INPUT,
            Direction::Output(high) => {
                req.config.flags = FLAG_OUTPUT;
                req.config.num_attrs = 1;
                req.config.attrs[0] = LineConfigAttribute {
                    attr: LineAttribute {
                        id: ATTR_ID_OUTPUT_VALUES,
                        padding: 0,
                        value: u64::from(high),
                    },
                    mask: 1,
                };
            }
        }
        // SAFETY: valid chip fd and a properly sized, initialised request.
        unsafe { line_request_ioctl(chip.as_raw_fd(), &mut req) }.map_err(io::Error::from)?;
        // SAFETY: on success the kernel returns a new line fd (O_CLOEXEC) that we now own.
        let fd = unsafe { OwnedFd::from_raw_fd(req.fd) };
        Ok(Self { fd })
    }

    /// The physical level of the line.
    pub fn get(&self) -> io::Result<bool> {
        let mut values = LineValues { bits: 0, mask: 1 };
        // SAFETY: valid line fd and a properly sized values struct.
        unsafe { get_values_ioctl(self.fd.as_raw_fd(), &mut values) }.map_err(io::Error::from)?;
        Ok(values.bits & 1 != 0)
    }

    pub fn set(&self, high: bool) -> io::Result<()> {
        let mut values = LineValues {
            bits: u64::from(high),
            mask: 1,
        };
        // SAFETY: valid line fd and a properly sized values struct.
        unsafe { set_values_ioctl(self.fd.as_raw_fd(), &mut values) }.map_err(io::Error::from)?;
        Ok(())
    }
}

/// The chip holding the line called `name`, and its offset there.
fn find(name: &str) -> io::Result<(File, u32)> {
    for path in chip_paths()? {
        let chip = OpenOptions::new().read(true).write(true).open(&path)?;
        let mut info: ChipInfo = zeroed();
        // SAFETY: valid chip fd and a properly sized info struct.
        unsafe { chip_info_ioctl(chip.as_raw_fd(), &mut info) }.map_err(io::Error::from)?;
        for offset in 0..info.lines {
            let mut line: LineInfo = zeroed();
            line.offset = offset;
            // SAFETY: valid chip fd and a properly sized info struct.
            unsafe { line_info_ioctl(chip.as_raw_fd(), &mut line) }.map_err(io::Error::from)?;
            if c_name(&line.name) == name.as_bytes() {
                return Ok((chip, offset));
            }
        }
    }
    Err(io::Error::new(
        io::ErrorKind::NotFound,
        format!("no GPIO line named {name}"),
    ))
}

fn chip_paths() -> io::Result<Vec<PathBuf>> {
    let mut paths: Vec<PathBuf> = fs::read_dir("/dev")?
        .filter_map(|entry| entry.ok())
        .filter(|entry| entry.file_name().to_string_lossy().starts_with("gpiochip"))
        .map(|entry| entry.path())
        .collect();
    paths.sort();
    Ok(paths)
}

fn c_name(raw: &[u8; NAME_SIZE]) -> &[u8] {
    let end = raw.iter().position(|&b| b == 0).unwrap_or(NAME_SIZE);
    &raw[..end]
}

/// Copies `name` into a NUL-terminated uAPI name field, truncating it if needed.
fn copy_name(dst: &mut [u8; NAME_SIZE], name: &str) {
    let len = name.len().min(NAME_SIZE - 1);
    dst[..len].copy_from_slice(&name.as_bytes()[..len]);
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn names_are_nul_terminated_and_truncated() {
        let mut raw = [0u8; NAME_SIZE];
        copy_name(&mut raw, "atx-power");
        assert_eq!(c_name(&raw), b"atx-power");

        let mut raw = [0u8; NAME_SIZE];
        copy_name(&mut raw, &"x".repeat(40));
        assert_eq!(c_name(&raw).len(), NAME_SIZE - 1);
    }

    #[test]
    fn unterminated_name_uses_the_whole_field() {
        let raw = [b'a'; NAME_SIZE];
        assert_eq!(c_name(&raw).len(), NAME_SIZE);
    }
}
