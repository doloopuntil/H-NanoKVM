---
status: current
applies-to: system 1.0.0 / app 3.0.0 (Linux 6.18)
last-checked: 2026-11-11
source: constants in server-rust/src and kvmapp/system/init.d
---

# Files on the device

Where the NanoKVM keeps its state. Change these through the web UI where one
exists: the server validates what it writes, and several init scripts parse these
files with `sed`.

## SD card layout

| Partition | Mounted at | Holds |
| --- | --- | --- |
| `/dev/mmcblk0p1` (VFAT, 32 MiB) | `/boot` | Boot files and boot-time flags. |
| `/dev/mmcblk0p2` (ext4) | `/` | Buildroot root filesystem, `/etc/kvm`, `/kvmapp`. |
| data partition | `/data` | Disk images, the update cache, logs of system updates. |

A system update rewrites the first two; `/data` and the saved `/etc/kvm` survive.

The boot files:

| Path | Holds |
| --- | --- |
| `fip.bin` | What the boot ROM loads: FSBL, DDR parameters, OpenSBI and U-Boot. A copy of `fip.std.bin` or `fip.od.bin`. |
| `fip.std.bin`, `fip.od.bin` | The same with the standard and the overdrive clock tables. |
| `boot.scr` | U-Boot script: sets the kernel command line, loads `boot.itb` and boots it. |
| `boot.itb` | FIT image with the LZ4 kernel, the device tree and the recovery initramfs. U-Boot checks each part's SHA-256 hash before booting. |

## `/etc/kvm`: configuration

| Path | Holds |
| --- | --- |
| `server.yaml` | Server configuration ([reference](config.md)). |
| `pwd` | The account: user name, password hash, TOTP secret and backup-code hashes. |
| `session_secret` | Per-device session signing secret, generated on first start. |
| `server.crt`, `server.key` | TLS certificate and key. |
| `tls-pending.json` | The settings to put back while a switch between HTTP and HTTPS, or a change of certificate, waits for confirmation; removed once confirmed or reverted. |
| `certs/settings.json` | The certificate source, domain and email. |
| `certs/status.json` | Expiry, last attempt, last error and the next attempt of the managed certificate. |
| `certs/managed.pem` | The managed certificate chain and key in one 0600 file; `managed.pem.prev` is the copy kept during a confirmation window. |
| `certs/account-production.json`, `certs/account-staging.json` | The Let's Encrypt account key, one per CA. 0600. |
| `app-update-pending.json` | Written when an application update is installed: the new and the previous version. `S95nanokvm` removes it once the new server is healthy, or restores `/root/old` when it is not. |
| `firewall.json` | Firewall mode. |
| `firewall-pending.json` | A change to Restricted or Paranoid mode waiting for confirmation: the mode to put back. It is on the root filesystem so that a crash or power loss inside the confirmation window still leaves it; the next start puts the previous mode back and removes it. A record that is not a small regular file naming known modes stays. |
| `usb_management` | An empty file the operator creates to let the computer under control open connections to the NanoKVM over `usb0`; without it the firewall drops them in every mode. |
| `wireguard/kvm.conf`, `wireguard/private.key` | WireGuard settings and private key (0600). |
| `network/dns.mode`, `network/dns.servers` | DNS mode (`dhcp`/`manual`) and fixed DNS servers. |
| `time.json` | NTP servers and time zone. |
| `syslog.json` | Remote syslog and log buffer settings. |
| `system-update-signing.pub.pem` | Key that update metadata must be signed with. |
| `system-version.json` | Installed system version. |
| `system-update-*.json`, `system-update-rollback.sh` | Pending system update, backup, boot-good marker and rollback script. |
| `ssh_stop` | Present when SSH is turned off. |
| `hdmi_disable`, `hdmi_idle_timeout`, `h264_safe_mode` | Video capture settings. |
| `oled_sleep` | OLED timeout. |
| `mouse-jiggler`, `shortcuts.json`, `leader-key` | Input settings. |
| `web-title` | Browser tab title. |
| `scripts/`, `autostart/` | Uploaded user scripts and autostart scripts. |
| `scripts-approved.json` | Names of the scripts that were run (0600); a script that is not in it gets a warning before it runs. |
| `cache/wol` | Saved Wake-on-LAN MAC addresses. |
| `GOMEMLIMIT` | Tailscale memory limit. |
| `wifi.ssid`, `wifi.pass` | Wi-Fi credentials. |
| `hw` | Board, written by `S15kvmhwd` at first boot: `pcie` when an OLED answers at `0x3c` on I2C bus 5, otherwise `beta`. |
| `hdmi_version` | HDMI bridge, written by `S15kvmhwd` from I2C bus 4: `c` (LT6911C), `ux` (LT6911UXC), `d` (LT6911D) or `ue` (no answer). |
| `hdmi_mode` | How libkvm finds the input size: `0` reads it from the bridge on its interrupt, `1` tries a list of common sizes, `2` uses `/kvmapp/kvm/width` and `height`. libkvm writes it; it falls back to `1` when the bridge reports a size it does not know. |
| `oled_exist`, `wifi_exist` | OLED and Wi-Fi present, written by `kvm_system`. |
| `.picoclaw_internal_token` | Token PicoClaw uses to call the server's internal routes. |

## `/boot`: flags read before the root filesystem is up

| Path | Holds |
| --- | --- |
| `hostname` | Host name, copied to `/etc/hostname`. |
| `usb.hidonly` | HID-only mode. |
| `usb.disk0`, `usb.rndis0` | Virtual disk and virtual network on. |
| `usb.wakeup`, `usb.notwakeup` | USB wakeup setting. |
| `eth.nodhcp` | Static IPv4 configuration. |
| `eth.ipv6.mode`, `eth.ipv6` | IPv6 mode and static address. |
| `resolv.conf` | Fixed DNS servers. |
| `ver` | Base image version. |
| `cpu.overdrive` | Clock overdrive chosen. The server keeps `fip.bin` equal to `fip.od.bin` while it exists, and to `fip.std.bin` otherwise. |
| `swap.size` | Swap file size in MB, set by the Swap switch. A system update replaces the swap file, so `S01fs` makes it again from this size once the root filesystem has grown. |
| `disable_watchdog` | Leave the hardware watchdog off (`S02watchdog`). A system update keeps it. |
| `cpu.overdrive.keep` | Keep the overdrive choice across system updates. Without it the update script drops `cpu.overdrive`, so the device returns to the standard clocks. |
| `rec` | Read by the initramfs: export the whole SD card to the computer under control as USB mass storage (product "NanoKVM recovery") instead of booting. Holding the User Key at power-on, or a root filesystem that `e2fsck -fp` cannot make mountable, does the same. |

## GPIO lines

The kernel has no GPIO sysfs (`/sys/class/gpio` is gone). Programs claim lines by the name
the device tree gives them, through the GPIO character devices, and hold them while they
run. `/sys/kernel/debug/gpio` lists every line with its name, owner and level.

| Line | Owner | Use |
| --- | --- | --- |
| `atx-power`, `atx-reset` | server, output driven low | ATX power and reset buttons; a press drives the line high for about a second. |
| `atx-power-led` | server, input | ATX power LED. |
| `hdmi-reset` | libkvm, output high | HDMI bridge reset (PCIe board only). |
| `oled-reset` | device tree hog, output high | Keeps the OLED out of reset. |
| `hdmi-bridge-int` | kernel (`cif`), interrupt | LT6911 interrupt on a mode change; edges are counted in `/proc/lt_int`. |
| `user-key` | `gpio-keys` | The User Key, reported as an input device. |
| `user-led` | `gpio-leds` | The user LED. |

## Elsewhere

| Path | Holds |
| --- | --- |
| `/kvmapp/` | The application: `server/NanoKVM-Server`, `server/web/`, `server/dl_lib/` (native libraries), `system/init.d/`, `system/keys/`, `version`. Replaced by an application update. |
| `/kvmapp/kvm/` | Runtime state shared with the native video code: the HDMI input size (`width`, `height`), whether a signal is captured (`state`), frame rate, quality, Wi-Fi state. |
| `/data/.hardened-kvmcache/` | Downloaded and staged updates. |
| `/root/.picoclaw/` | PicoClaw configuration, `.security.yml` with the model API key, and `workspace/sessions/`. |
| `/root/.tailscale/` | Tailscale state. |
| `/tmp/hardened-syslog/messages` | Local log buffer (tmpfs, lost on reboot). |
| `/tmp/nanokvm-server.log`, `/tmp/picoclaw.log` | Server and PicoClaw logs. |
