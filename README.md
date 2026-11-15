# H-NanoKVM

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="web/public/hardened-logo-dark.svg">
    <img src="web/public/hardened-logo.svg" alt="H-NanoKVM logo" width="720">
  </picture>
</p>

H-NanoKVM (Hardened NanoKVM) is a security-focused firmware for the
[Sipeed NanoKVM](https://github.com/sipeed/NanoKVM) (Cube Lite, Cube Full and
PCIe, all SG2002 based). It keeps the NanoKVM hardware support, the native video
pipeline and the familiar web UI, and replaces the rest: a Rust web server
instead of the Go one, a current Buildroot and Linux 5.10.265 base, signed
updates, and a locked-down default configuration. It builds on
[woffko/Hardened_NanoKVM](https://github.com/woffko/Hardened_NanoKVM).

> [!NOTE]
> This is beta firmware. The current version is **system 0.4.0 with
> application 2.1.0**. It is not published as a release yet: build the SD image
> in CI and flash it ([Install](docs/guide/install.md)). Online update channels
> for 0.4.0 are still to be set up.

## Coming from sipeed/NanoKVM

| | sipeed/NanoKVM | H-NanoKVM |
| --- | --- | --- |
| Web server | Go (`server/`) | Rust (`server-rust/`), same API and UI |
| Base system | Vendor SDK, Buildroot 2023.11, Linux 5.10.4 | Buildroot 2026.05.1, Linux 5.10.265 with kernel hardening |
| How it is built | Vendor build | Whole SD image rebuilt from source in GitHub Actions |
| First sign-in | `admin`/`admin` | You create the account on first boot; no default password, no reset |
| Sign-in security | Password | Argon2id, CSRF and origin checks, lockout, optional TOTP two-factor |
| Firewall | Not managed | Managed modes, local-only by default |
| Updates | Application OTA | Signed application updates and guarded full-system updates |
| Remote access | Tailscale | Tailscale and WireGuard |
| Web terminal | Hidden by a toggle | Off by default and guarded by the session |
| AI assistant | PicoClaw | PicoClaw 0.3.1 with a pinned installer and a redesigned sidebar |

Everything else you know from NanoKVM is still there: MJPEG and H.264 video,
keyboard and mouse emulation, ISO and disk image mounting, ATX power control,
Wake-on-LAN, the serial terminal, scripts, the OLED and Wi-Fi. Many recent
sipeed/NanoKVM improvements are ported, including zero-copy H.264 capture,
read-only image mounts and HDMI idle handling.

Not carried over: the Go server, multiple user accounts, upstream's OTA servers
(updates come from GitHub releases), and the factory default credentials.

## Features

- **Security**: first-boot account setup, [two-factor sign-in](docs/guide/sign-in.md),
  session lock, [firewall modes](docs/guide/firewall.md), signed
  [updates](docs/guide/updates.md), audit log entries in syslog.
- **Remote access**: [WireGuard](docs/guide/wireguard.md) and
  [Tailscale](docs/guide/tailscale.md), so the KVM never needs a public port.
- **Video**: H.264 Direct (low CPU, needs HTTPS), H.264 WebRTC and MJPEG.
- **Input**: [HID-only mode, USB wakeup, keyboard lock LEDs](docs/guide/usb-and-input.md),
  paste, shortcuts, mouse jiggler, a mobile view for phones and tablets.
- **Virtual media**: [read-only image mounts, uploads and downloads with
  SHA-256 checks](docs/guide/virtual-media.md).
- **System settings in the UI**: network (DHCP or static, fixed DNS, IPv6),
  time and NTP, remote syslog, firewall.
- **[PicoClaw assistant](docs/guide/picoclaw.md)**: an AI agent that can operate
  the host for you.

## Install and update

1. Build the image with the [CI image build](docs/development/ci-image-build.md),
   or use an older published image from woffko's releases.
2. Flash it to a microSD card: [Install](docs/guide/install.md).
3. Open the device in a browser and create the account.

Updates are explained in [Updates](docs/guide/updates.md).

## Documentation

Start at [docs/README.md](docs/README.md): user guides, reference (API,
configuration, files on the device, security model), development and release
notes. [AGENTS.md](AGENTS.md) is a short guide for coding agents working in this
repository.

## Repository layout

```text
server-rust/        Rust web server; native/ holds the libkvm runtime libraries
web/                React web UI
kvmapp/             The application package installed to /kvmapp: init scripts, keys, PicoClaw files
buildroot-external/ Buildroot external tree for the SG2002 image
support/sg2002/     Native code: libkvm, kvm_mmf, kvm_system, kernel patches
scripts/            Build, packaging and release scripts
tools/              EDID and logo utilities
docs/               Documentation
.github/workflows/  The SD image build
```

## Building

- Server and package: [Build and deploy the server](docs/development/cross-build.md)
- Web UI: [Web UI](docs/development/web.md)
- Full SD image: [CI image build](docs/development/ci-image-build.md)
- Tests: [Testing](docs/development/testing.md)

## Hardware

H-NanoKVM runs on the SG2002-based NanoKVM Cube Lite, Cube Full and PCIe.
It does not support the NanoKVM Pro or NanoKVM-USB. Hardware documentation,
schematics and the original images are on the
[Sipeed wiki](https://wiki.sipeed.com/hardware/en/kvm/NanoKVM/introduction.html)
and in [sipeed/NanoKVM](https://github.com/sipeed/NanoKVM).

## Support

This firmware is not made or supported by Sipeed. Report problems with it in
this repository's issue tracker, not to Sipeed support.

## Credits and license

Based on [sipeed/NanoKVM](https://github.com/sipeed/NanoKVM) by Sipeed,
[woffko/Hardened_NanoKVM](https://github.com/woffko/Hardened_NanoKVM) by woffko, and
[dormancygrace/NanoKVM-OS](https://github.com/dormancygrace/NanoKVM-OS) by dormancygrace.
Licensed under the GPL-3.0; see [LICENSE](LICENSE).
