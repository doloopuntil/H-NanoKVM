# Hardened NanoKVM documentation

Current for **system 0.4.0 / application 2.1.0**. Every current page starts with
a small header: `status`, the release it `applies-to`, and when it was
`last-checked`. Pages in `archive/` are historical records and are not
maintained.

## Guides

For people running the device.

- [Install: flash an SD card](guide/install.md), including the first boot
- [Updates](guide/updates.md): application and system updates (channels for 0.4.0 pending)
- [Sign-in and two-factor](guide/sign-in.md)
- [Firewall modes](guide/firewall.md)
- [HTTPS certificate](guide/https-certificate.md): Tailscale or Let's Encrypt instead of the self-signed one
- [WireGuard](guide/wireguard.md)
- [Reverse proxy with Caddy and WireGuard](guide/reverse-proxy.md): your own domain in front of the KVM
- [Tailscale](guide/tailscale.md)
- [Virtual media](guide/virtual-media.md): mounting images, the virtual disk, uploads and downloads
- [USB devices, keyboard and mouse](guide/usb-and-input.md), including HID-only mode
- [Power control and hardware](guide/power-and-hardware.md)
- [PicoClaw assistant](guide/picoclaw.md)

## Reference

- [Backend API](reference/api.md): every route and WebSocket
- [Server configuration](reference/config.md): `/etc/kvm/server.yaml`
- [Files on the device](reference/device-files.md)
- [Init scripts](reference/init-scripts.md)
- [Security model](reference/security-model.md): controls and open items
- [System-update bundles and channels](reference/system-update-bundles.md)

## Development

- [Rust backend](development/backend.md): what is implemented, two-factor design
- [Build and deploy the server](development/cross-build.md), including a Docker cross-build
- [Web UI](development/web.md)
- [Web UI layout rules](development/web-ui-layout-rules.md), including the copy rules
- [CI image build](development/ci-image-build.md): rebuilding the SD image from source
- [Kernel 6.x migration plan](development/kernel-6x-migration-plan.md): moving from the vendor 5.10 kernel to mainline 6.18 (plan, not implemented)
- [Kernel 6.x Phase 0 baseline](development/kernel-6x-phase0-baseline.md): what the 5.10 Lite uses and how fast it is, for comparison
- [Testing](development/testing.md)
- [Rust dependency audit](development/dependency-audit.md)
- [riscv64 thread stack alignment](development/riscv-musl-stack-alignment.md): why the
  server runs on Buildroot's musl loader
- [Native runtime libraries](../server-rust/native/README.md): provenance of every native file
- [AGENTS.md](../AGENTS.md): commands and rules for coding agents

## Releases

- [Changelog](../CHANGELOG.md): the list of release pages
- [System 0.4.0 / application 2.1.0](releases/0.4.0.md) (unreleased)
- [RC12: application 2.0.42 / system 0.3.0-raw.12](releases/rc12-2.0.42-raw.12.md)
  and its [key transition](releases/2.0.42-key-transition.md)
- [RC11: application 2.0.40 / system 0.3.0-raw.10](releases/rc11-2.0.40-raw.10.md)

## Archive

Engineering records from the RC9 to RC12 work in woffko/Hardened_NanoKVM, kept
for provenance:

- Kernel 5.10.265 port: [plan](archive/vendor-kernel-5.10-security-plan.md),
  [recovery candidate](archive/kernel-5.10.265-recovery-candidate.md), hardening
  batches ([dmesg](archive/kernel-5.10.265-phase3-dmesg-restrict.md),
  [user namespaces](archive/kernel-5.10.265-phase3-userns-disable.md),
  [SLUB freelist](archive/kernel-5.10.265-phase3-slab-freelist.md),
  [init-on-alloc](archive/kernel-5.10.265-phase3-init-on-alloc.md))
- Buildroot port: [2026.05 port log](archive/latest-buildroot-port.md),
  [raw.11 security maintenance](archive/security-maintenance-raw11.md),
  [newer-Buildroot study](archive/new-buildroot-sysupgrade-study.md),
  [2023.11 backport plan](archive/buildroot-2023-security-backport-plan.md),
  [vendor SDK build](archive/vendor-sdk-build.md)
- Updates and releases: [update plan](archive/system-update-plan.md),
  [update safety notes](archive/system-update-live-inventory.md),
  [key transition](archive/key-transition-2026q3.md),
  [release channel archive](archive/release-archive.md)
- Acceptance: [raw.9 checklist](archive/raw9-physical-acceptance-checklist.md),
  [RC12 physical gates](archive/rc12-final-physical-gates.md)
- Native code: [C/C++ audit and remediation](archive/native-code-audit.md),
  [kvm_system migration plan](archive/kvm-system-rust-migration-plan.md)
- Working notes: [developer handoff](archive/handoff.md),
  [sysupgrade build trace](archive/current-sysupgrade-build-trace.md)
