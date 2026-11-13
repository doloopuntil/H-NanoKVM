---
status: current
applies-to: system 1.0.0 / app 3.0.0 (Linux 6.18)
last-checked: 2026-11-13
source: kvmapp/system/init.d/
---

# Init scripts

The scripts live in `kvmapp/system/init.d/` and are installed to `/etc/init.d/`.
BusyBox init runs them in name order at boot. The server controls services only
through these scripts, never by starting daemons itself.

Before init, the kernel runs the initramfs from `boot.itb`. Its `/init` waits for the SD
card, checks for USB recovery (`/boot/rec`, the User Key held at power-on, or a root
filesystem that does not mount after `e2fsck -fp`; see
[Files on the device](device-files.md)), and otherwise switches to the root filesystem.
The kernel keeps feeding the watchdog the FSBL armed until `S02watchdog` takes it over.

Buildroot adds its own scripts between these (`S01seedrng`, `S02sysctl`, `S10udevd`,
`S11modules`, `S35nftables`, `S40network`, `S50crond`); the table lists ours. `S10udevd`'s
coldplug loads the AIC8800 Wi-Fi driver by the card's SDIO ID on boards that have one (options
in `/etc/modprobe.d/aic8800.conf`), so `wlan0` exists before `kvm_system` looks for it.

| Script | Does |
| --- | --- |
| `S00kmod` | Loads the 11 Sophgo media modules from `/lib/modules/<release>/extra` in dependency order (`soph_sys` first, `soph_vc_driver` last with 9 encoder and 9 decoder channels). Everything else the system needs is built into the kernel. |
| `S01fs` | Mounts and prepares the data partition, creating it from the space after the root partition on a new card; keeps `/data` read-only while the virtual disk shares it. Grows the root filesystem into its partition at every boot. A root filesystem flagged with errors, which blocks that growth, is checked with `e2fsck` first; the RTC register `RTC_INFO2` limits this to one attempt per power cycle. |
| `S01syslogd`, `S02klogd` | System and kernel logging, to the tmpfs buffer and optionally to remote syslog. |
| `S02watchdog` | Arms the SoC hardware watchdog (60 s timeout, fed every 10 s) and sets `kernel.panic=10`, so a hung or panicked system restarts by itself. Records why the chip last restarted in `/tmp/boot-reason`. `/boot/disable_watchdog` turns it off and disarms the timer the FSBL started. The raw system update stops it before writing the partitions. |
| `S03usbdev` | Builds the USB gadget: keyboard, mice, mass storage, network. Hands over to `S03usbhid` when `/boot/usb.hidonly` exists. |
| `S03usbhid` | The HID-only gadget: keyboard and mice only. |
| `S15kvmhwd` | Detects the board and the HDMI bridge once and writes `/etc/kvm/hw` (`beta` or `pcie`, rebooting after the first `pcie` detection) and `/etc/kvm/hdmi_version`; `re-detect` repeats it. The device tree muxes every pin (the Wi-Fi SDIO pins with `sdhci1`) and names the GPIO lines, which the server and libkvm claim by name; the script writes no registers. |
| `S30eth` | Wired network: DHCP or static IPv4, fixed DNS servers, IPv6 modes, MAC derived from the chip ID, and the opt-in receive batching (`/etc/kvm/network/eth.rx-batching`: `gro_flush_timeout` 200 µs, `napi_defer_hard_irqs` 2). |
| `S30wifi` | Wi-Fi client or access-point mode. |
| `S40firewall` | Applies the firewall mode from `/etc/kvm/firewall.json`, including the WireGuard rules. `acme-open` and `acme-close` add and remove one rule that lets any source reach the HTTPS port while a certificate authority validates an order. See [Firewall modes](../guide/firewall.md). |
| `S45wireguard` | Brings up `wg0` from `/etc/kvm/wireguard/` and runs the endpoint watcher. See [WireGuard](../guide/wireguard.md). |
| `S49ntp` | Sets the clock with NTP at boot and keeps it in sync. |
| `S50avahi-daemon` | mDNS, when enabled. |
| `S50ssdpd` | SSDP discovery. |
| `S50sshd` | SSH, unless `/etc/kvm/ssh_stop` exists. |
| `S95nanokvm` | Starts the Rust server (`/kvmapp/server/NanoKVM-Server`), restores configuration after a system update, runs the health watchdog, the boot watchdog that confirms or rolls back a system update, and the check after an application update that restores the previous application when the new server never answers. |
| `S96picoclaw` | The PicoClaw agent, when installed. |
| `S98tailscaled` | Tailscale, when installed and enabled. |

## Rules for changing them

- `S95nanokvm`, the kvmapp package (`buildroot-external/.../hardened-nanokvm-kvmapp.mk`)
  and `main.rs` each list the boot scripts. A new script must be added to all
  three.
- Scripts that read server-written files (`S40firewall`, `S45wireguard`) parse
  them with `sed`; the server validates every value it writes, so keep those
  files one `Key=value` per line.
