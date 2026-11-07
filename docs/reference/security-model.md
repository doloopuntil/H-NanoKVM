---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-07
---

# Security model

What the Hardened server protects, how, and what is still open. User-facing
behaviour is in the guides ([sign-in](../guide/sign-in.md),
[firewall](../guide/firewall.md), [updates](../guide/updates.md)).

## Threat model in brief

- The web UI and API are the main attack surface. Everything except sign-in,
  first-account setup, the static UI and a version endpoint needs a session.
- A signed-in user is the device's administrator: the account is also `root`
  over SSH, and the terminal and scripts run as root. The controls below keep
  out people who are not signed in, and limit what a stolen session can do
  without the password.
- The host machine is not trusted either: what it shows on screen reaches the
  PicoClaw agent, and what the agent returns is rendered in the browser.
- Updates must be signed; the device trusts only its bundled update keys and, for
  uploaded system bundles, one local key the administrator registered.

## Controls

| Area | Control |
| --- | --- |
| First boot | No default credential. Without `/etc/kvm/pwd`, the UI asks for the first account. `security.allow_default_admin` stays off. |
| Passwords | Argon2id for new passwords, bcrypt still accepted. Changing the password needs the current one and also sets the `root` password. |
| Sessions | Opaque in-memory sessions, per-device secret, revoked on logout and password change. Optional idle lock. |
| Two-factor | Optional TOTP with backup codes; every change needs the password and, once enrolled, a fresh code; `security.require_totp` confines an unenrolled session to enrolment. |
| CSRF and origin | CSRF token plus `Origin`/`Referer` check on every state-changing request; WebSockets check `Origin`. |
| Brute force | Lockout after 5 failures per source and user, for 10 minutes; the source is an IPv4 address or the /64 of an IPv6 address, so one host cannot rotate through its network. One password check runs at a time on a blocking thread, and a wrong username takes as long as a wrong password. TOTP failures count too. The address is the TCP peer's, or, from a peer in `security.trusted_proxies` only, the rightmost `X-Forwarded-For` hop that is not itself trusted. |
| Reverse proxy | `X-Forwarded-For` and `X-Forwarded-Proto` are ignored unless the peer is in `security.trusted_proxies` (empty by default). A trusted peer sets the client address of the lockout and the log, the `Secure` flag of the cookies, and pins the scheme of the `Origin` checks. The raw peer still decides loopback-only routes. [Guide](../guide/reverse-proxy.md). |
| Step-up | Changing the password, disabling two-factor, reissuing backup codes, unlocking the terminal, uploading or running a script, setting or removing the local update key, changing the HTTPS certificate source, changing the trusted proxies and turning remote image download on need the password and, when the account has two-factor, a fresh code. |
| Password re-checks | Password change, two-factor changes, the local update key and the terminal share one lockout per address and user, apart from the login's. Wrong codes lock out separately. |
| Browser | Security headers on every response; the CSP allows scripts and images only from the device (images also from `data:`), so chat output cannot load external content. |
| Commands | Privileged commands go through an argv-only allowlist (`system/command.rs`) with timeouts and bounded output; no shell strings. |
| Files and archives | Atomic `0600` writes for secrets, symlink and traversal checks, bounded archive extraction. |
| Updates | Signed metadata and payload hashes for application and system updates; raw partition writes happen only after the install confirmation; boot watchdog rollback. An optional local key, set with the password and logged, signs bundles uploaded from the browser only. |
| Virtual media | Images served read-only to the host; `/data` has one writer at a time; image paths confined to `/data`; remote download off by default, limited to `http`/`https` ISO files, and refused for hosts on private, loopback, link-local or local-name addresses, including after a redirect. |
| Network | Managed firewall, Moderate (local sources only) by default; WebRTC blocked in Restricted and Paranoid; WireGuard peers admitted only on `wg0` from their allowed ranges. A Let's Encrypt order opens the HTTPS port to any source for its length only (`S40firewall acme-open`/`acme-close`), then closes it; Paranoid blocks the order. |
| Audit | Sign-ins, two-factor changes, WireGuard changes and trusted-proxy changes are logged to syslog with the source address. |
| PicoClaw | Gateway on `127.0.0.1` with a token; internal routes accept only loopback requests with the internal token; installer pinned to a SHA-256; a stored model key is reused only for the same API origin. |

## Open items

- The server runs as root. Splitting privileged operations into a smaller
  helper is future work.
- The login lockout is per address and user, with no global counter.
- Remote ISO download has no allowlist of sources, only the public-host check; it stays off by default.
- Retained vendor components with `NOASSERTION` licence metadata remain a
  documented limitation.

## Root-Required Operations

These operations must remain behind narrow wrappers or a future privileged
helper:

- HID device writes: `/dev/hidg0`, `/dev/hidg1`, `/dev/hidg2`.
- USB mass-storage gadget sysfs writes under `/sys/kernel/config/usb_gadget/...`.
  Normal virtual-media changes should be limited to removable-LUN eject/insert
  and flag updates. USB gadget reconnect is allowed when switching the media
  type between CD-ROM and mass storage because many BIOS/boot menus cache the
  previous LUN type; otherwise it remains an explicit compatibility fallback.
- USB HID configfs topology changes must not be performed live from the web
  backend. A live UDC detach plus HID unlink/relink test on a device caused a
  kernel oops; only direct attribute writes or reboot-time config changes are
  acceptable.
- GPIO/ATX writes under hardware-specific device paths.
- Network writes under `/etc/kvm`, DNS hooks, Wi-Fi files, and service restarts.
- Application update promotion under `/kvmapp`.
- System update promotion for boot/rootfs files and raw partition payloads.
- Reboot and init-script service control.
- Terminal PTY shell, when explicitly enabled.

## Command Execution Inventory

Rust API modules should not spawn shell command strings directly. Normal
service control and utility execution goes through
`system::command::run_allowed`, which provides an allowlisted argv-only wrapper
with timeouts and bounded output.

Main command call sites:

- `server-rust/src/api/application.rs`: app metadata/download and service restart.
- `server-rust/src/api/system_update.rs`: signed system-update metadata,
  staging, and guarded loader execution.
- `server-rust/src/api/download.rs`: guarded remote ISO downloader.
- `server-rust/src/api/network.rs`: WOL, Wi-Fi service control, Ethernet
  restart, and IPv6 route inspection.
- `server-rust/src/api/system_firewall.rs`, `system_log.rs`, `system_time.rs`,
  `tailscale.rs`, `vm.rs`, `hid.rs`, and `account.rs`: allowlisted service or
  system utility calls.

Known exceptions:

- `server-rust/src/api/script.rs` runs user-managed scripts from the configured
  script inventory and remains a root-required administrative feature. Upload and
  run pass the terminal's gate: terminal access is on, authentication is on, and
  each operation consumes a fresh unlock ticket of the same session (header
  `X-NanoKVM-Terminal-Ticket`), issued after the password, and the code when the
  account has two-factor, was entered again. Listing and deleting need only the
  session.
- `server-rust/src/ws/hid.rs` invokes the fixed USB gadget init script for HID
  recovery.
- `server-rust/src/api/system_update.rs` runs a staged, generated loader from
  the signed system-update cache after path validation.
- Native SG2002 C/C++ support code contains fixed `system(...)` calls for
  hardware initialization and factory-compatible control paths. The 2026-07-11
  audit of that code and its remediation are in
  [`native-code-audit.md`](../archive/native-code-audit.md).

## File And Archive Risk Inventory

- Account file: `/etc/kvm/pwd`, mode `0600`.
- Session secret: `/etc/kvm/session_secret`, generated and written `0600`.
- Update cache: `/data/.hardened-kvmcache`; application updates use
  `application-update`, system updates use `system-update`.
- System-update archives are constrained to declared payload roots and reject
  runtime/cache roots such as `/dev`, `/proc`, `/sys`, `/run`, `/tmp`, `/data`,
  `/kvmapp`, and `/root/.kvmcache`.
- Image directory: `/data`, with resolved containment and symlink rejection.
- Script directory: `/etc/kvm/scripts`, with basename inventory and explicit
  execution only.
- Autostart directory: `/etc/kvm/autostart`, with traversal rejection.
- DNS/Wi-Fi files: strict value validation and atomic writes. A Wi-Fi SSID is 1-32
  bytes and a passphrase 8-63 bytes, as the supplicant accepts, and both are refused
  before anything is written.
- Wi-Fi AP key: each AP session gets a fresh 10-character key from the kernel CSPRNG
  (about 49 bits), stored in `ap.pass` with mode 0600; without a random source the AP
  is not started. The unauthenticated provisioning endpoints allow 5 wrong keys per
  source and 20 shared by all sources, each for 10 minutes. hostapd's cipher choice
  and an AP timeout are not covered.
- PicoClaw runs as root, so the backend enforces a local tool policy on its
  configuration at every start and at backend start: workspace restriction on, every
  workspace inside `<home>/workspace`, and the `exec`, serial, SPI and I2C tools,
  cron commands, path allowlists and local-command MCP servers off. The `nanokvm`
  MCP server, which controls the host, is untouched. `S96picoclaw` does not launch
  the runtime until the backend has applied the policy.
- WireGuard: `/etc/kvm/wireguard/kvm.conf` holds only validated values, one
  `Key=value` per line, because `S40firewall` and `S45wireguard` read it with
  `sed`; `private.key` is written `0600` and never returned by the API.
- PicoClaw: sessions are read only from PicoClaw's own sessions directory, file
  names derived from session keys have path separators replaced, and symlinked
  entries are skipped.
