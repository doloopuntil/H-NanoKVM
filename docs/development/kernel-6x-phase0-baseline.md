---
status: current
applies-to: system 0.4.34 (vendor 5.10.265 kernel) on a NanoKVM Lite
last-checked: 2026-11-05
---

# Kernel 6.x migration: Phase 0 baseline on the Lite

Measurements and captures from a working 5.10 Lite, taken for Phase 0 of the
[6.18 migration plan](kernel-6x-migration-plan.md). Phase 1 to 3 compare against
these numbers. Everything here was read from the running device; nothing was
changed on it.

## Device

| Item | Value |
| --- | --- |
| Board | NanoKVM Lite: `/etc/kvm/hw` = `beta`, no `oled_exist`, no `wifi_exist` |
| HDMI bridge variant | `ux` (`/etc/kvm/hdmi_version`) |
| System / app | 0.4.34 / 2.1.0, Buildroot 2026.05.1, kernel `5.10.265-tag-` |
| Build | the commit that became `aebe6ec` on `main` (T-Head musl 1.2.6); `main` has since changed only server code |
| CPU mode | overdrive FIP (`cpu.overdrive`, `cpu.overdrive.keep`) |
| `/boot` | 31.9 MiB, 12.4 MiB used: `boot.sd` 11.7 MB, three FIPs of 441 KB each |
| `boot.sd` (FIT) | uncompressed kernel 8.7 MiB, gzip ramdisk 2.4 MiB, DTB 22 KiB |

## Memory

| Item | Value |
| --- | --- |
| RAM seen by the kernel | 254 MiB (`80000000-8fdfffff`); `MemTotal` 158 MiB |
| Reserved at boot | 101 MB: media carveout, `cvifb`, OpenSBI (`0x80000000`, 256 KiB), initrd |
| Kernel | 5.6 MB code, 0.66 MB rwdata, 2.4 MB rodata, 0.26 MB bss (`-Os`) |
| Media carveout | 75 MiB (`ion` node, size only); the kernel placed it at `0x85178000-0x89c77fff`, not at the `0x8b300000` of the vendor memmap |
| `cvifb` | 7.8 MiB at `0x8ab30000`; unused (no `/dev/fb*`, no `soph_fb`) |
| Carveout peak | 31.3 MB with only H.264 allocated; **43.8 MB** after MJPEG (adds `jpeg_ion` 9 MiB and a 3 MB pool) |
| Idle | 41 MB used, `MemAvailable` 103 MiB; `tailscaled` is the largest process (37 MB RSS) |

## Streaming, 1080p

| | Idle | MJPEG | H.264 WebRTC |
| --- | --- | --- | --- |
| Capture (VI) | 61 fps | 61 fps, 0 lost | 60 fps, 0 lost |
| Encoded | none | **12 fps** (quality 99) | **53 fps** (57 sent) |
| Hardware time per frame | | 7.4 ms (max 11.7) | 9.1 ms (max 9.7) |
| CPU busy | 17% (half of it `top`) | **100%** (server 67%) | 59% (server 39%) |

MJPEG is CPU-bound: the JPEG encoder could do about 130 fps. During the H.264
capture the JPEG channel was still encoding 14 fps (a second client), so the
H.264 CPU figure is an upper bound. Latency was not measured.

Interrupt rates while streaming: VI about 110/s, the scaler 60 to 120/s, `h264`
58/s. The JPEG encoder raises **no** interrupt (its DT node has IRQ `0x14`, but no
`jpeg` line appears in `/proc/interrupts`): the 5.10 driver polls.

## Kernel modules and device nodes (decides plan Q6)

Use counts and open files of the server were the same at idle, during MJPEG and
during H.264, except for the encoder channels (`cvi_vc_enc1` for H.264 from start,
`cvi_vc_enc0` added for JPEG).

| Module | Use count | Opened by the server | Verdict for 6.18 |
| --- | --- | --- | --- |
| `sys` `base` `mipi_rx` `vi` `vpss` `vcodec` `jpeg` `vc_driver` | > 0 | yes (`cvi-sys`, `cvi-base`, `cvi-mipi-rx`, `cvi-vi`, `cvi-vpss`, `cvi_vc_enc*`) | keep |
| `dwa` `vo` `rgn` | 1 | yes, at start-up, never used for KVM | keep, or prove the middleware starts without them |
| `snsr_i2c` | 0 | no (no device node; the LT6911 is reached through `/dev/i2c-4`) | drop candidate: removes risk R2 |
| `ive` `mon` `fast_image` `wiegand` `pwm` `clock_cooling` | 0 | no | drop |
| `rtos_cmdqu` | 1 (held by `fast_image` only) | no | drop |
| `wdt` `rtc` | 1 | watchdog / RTC | mainline drivers |

`kvm_system` opens only `/dev/i2c-1`, `/dev/i2c-5` and `/dev/input/event0`.
`nanokvm-hwmon` opens no device.

`libkvm_mmf` reloads the modules itself: `reinit_soph_vb()`
(`support/sg2002/additional/kvm_mmf/src/kvm_mmf.cpp`) runs `rmmod`/`insmod` with
a hard-coded list and `/mnt/system/ko/` paths when it finds stale VB pools. The
6.18 module list and install path must be reflected there.

## Boot

| Point | Time |
| --- | --- |
| Power-on to `/init` (FSBL, OpenSBI, U-Boot, kernel) | 4.52 s (vendor `early_time_log`) |
| Kernel start to `/init` | 0.50 s |
| Root mounted | 7.1 s (this boot included an ext4 journal recovery) |
| `udevd` | 10.5 s |
| `kvm_system` / server / hwmon | 23.3 s / 24.5 s / 24.5 s |
| `getty` | 34.8 s |

Times after `/init` are kernel uptime (process `starttime`). A clean-boot time
needs a reboot and was not measured.

The **initramfs** (`ramdisk-1` in `boot.sd`, the vendor SDK `boot.cpio`) holds the
BOOT-button reflash mode (plan Q5). Its `/init` exports the whole card
(`/dev/mmcblk0`) as USB mass storage through configfs and `/proc/cviusb/otg_role`
when `/boot/rec` exists, when the User Key (GPIO 510, pad A30) is held at power-on
(sampled twice, 0.5 s apart), or when `mmcblk0p2` does not mount after `e2fsck`.
Otherwise it mounts `mmcblk0p2` and runs `switch_root`. It ships its own BusyBox,
a vendor `libc.so`, `e2fsck`, `parted` and `resize2fs`.

## Pins, GPIO, I2C

- GPIO bases [verified]: port A 480 (`3020000`), B 448 (`3021000`), C 416, D 384,
  PWR 352 (`5021000`). HDMI reset 451 is port B pin 3; the sensor reset
  `snsr-rst-gpio` is PWR pin 1 (353).
- Exported through sysfs on the Lite: 451, 502, 503, 504, 505. User Key 510 and
  `led-user` 494 are claimed by drivers.
- FMUX registers match the plan's table (section 2.3) exactly; full dump
  `0x03001000-0x030011FC` in the captures.
- I2C buses 0, 1, 3, 4 (DesignWare) and 5 (`i2c5@gpio`, bit-bang on A15/A27, GPIO
  495/507). There is no bus 2.

## Odd things worth carrying into the port

- `clk_h264c` / `clk_axi_video_codec` have an enable count of about 432,000 after
  1.5 h: the 5.10 codec driver enables them far more often than it disables
  them, so they never gate off. Check the balance in the 6.18 port.
- `cif` claims GPIO 353 as the sensor reset, then the `lt-int` osdrv patch
  requests the same line and fails (`lt_int: gpio 353 request failed, -16`).
- `soph_rtos_cmdqu` waits 210 ms at load and logs `communicate with rtos fail`:
  the C906L does not answer the vendor protocol on this image.
- The 1-minute load average sits at 4.5 to 5.5 even when the CPU is 80% idle:
  kernel threads such as `vi_event_handle` wait in uninterruptible sleep.

## Captures

Raw captures were saved outside the repository (they include addresses and
host names). To repeat them, run over SSH with key login: `/proc/modules`,
`/proc/iomem`, `/proc/interrupts` twice 10 s apart, `/proc/meminfo`,
`/sys/kernel/debug/clk/clk_summary`, `/proc/cvitek/{sys_mem,vb,venc,vi}`,
`ls -l /proc/<pid>/fd` and the `/dev` lines of `/proc/<pid>/maps` for the server
and `kvm_system`, `devmem` reads of the FMUX range, `/sys/kernel/debug/gpio`,
`dmesg`, `/sys/firmware/fdt` (decompile with `dtc`), and `/boot/boot.sd` (unpack
with `dumpimage -l` / `-p 1`). `strace` is not in the image; open files and
module use counts replace it.
