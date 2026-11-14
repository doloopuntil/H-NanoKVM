---
status: current
applies-to: system 1.0.0 / app 3.0.0 (Linux 6.18)
last-checked: 2026-11-13
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
| Passwords | Argon2id for new passwords, bcrypt still accepted. Changing the password needs the current one and also sets the `root` password. A new password may not contain NUL, CR or LF (they cannot pass the two-line `passwd` input), and a user name may not contain control characters; existing passwords still verify. |
| Sessions | Opaque in-memory sessions, per-device secret, revoked on logout and password change. Optional idle lock. At most 32 live sessions: a login drops the expired ones and, at the cap, revokes the one closest to expiry. The terminal, HID, MJPEG and H.264 direct sockets and the PicoClaw chat end with the login that opened them (logout, a password change or expiry). WebRTC peers are not tied to it. |
| Two-factor | Optional TOTP with backup codes; every change needs the password and, once enrolled, a fresh code; `security.require_totp` confines an unenrolled session to enrolment. |
| CSRF and origin | CSRF token (compared in constant time) plus `Origin`/`Referer` check on every state-changing request; an `Origin` or `Referer` that is not text is refused, not ignored. WebSockets check `Origin`. |
| Brute force | Lockout after 5 failures per source and user, for 10 minutes; the source is an IPv4 address or the /64 of an IPv6 address, so one host cannot rotate through its network. A source also has one budget of four times that across all names, so rotating names does not get around the lockout, and each table keeps at most 1024 entries. A login name over 256 bytes or empty, and a password over 4 KiB as sent, are refused before the lockout or the hash. One password check runs at a time on a blocking thread, and a wrong username takes as long as a wrong password. TOTP failures count too. The address is the TCP peer's, or, from a peer in `security.trusted_proxies` only, the rightmost `X-Forwarded-For` hop that is not itself trusted. |
| Reverse proxy | `X-Forwarded-For` and `X-Forwarded-Proto` are ignored unless the peer is in `security.trusted_proxies` (empty by default). A trusted peer sets the client address of the lockout and the log, the `Secure` flag of the cookies, and pins the scheme of the `Origin` checks. The raw peer still decides loopback-only routes. [Guide](../guide/reverse-proxy.md). |
| Step-up | Changing the password, disabling two-factor, reissuing backup codes, unlocking the terminal, running a script, setting or removing the local update key, changing the HTTPS certificate source, changing the trusted proxies and turning remote image download on need the password and, when the account has two-factor, a fresh code. |
| Password re-checks | Password change, two-factor changes, the local update key and the terminal share one lockout per address and user, apart from the login's. Wrong codes lock out separately. |
| Public routes | The routes that need no session (health, version, sign-in, setup, AP-mode Wi-Fi) answer an internal error with `internal error` and log the detail. The HTTP to HTTPS redirect uses the `Host` header only when it is a host name, an IPv4 address or a bracketed IPv6 address with an optional port, and answers 400 otherwise. |
| Online app update | Moves forward only: signed metadata for an older or equal version is refused before the download. A manual import is the way to install an older release. Metadata has no expiry or sequence number, so withholding newer releases is not detected. |
| Browser | Security headers on every response; the CSP allows scripts and images only from the device (images also from `data:`), so chat output cannot load external content; `base-uri` is `none`, forms post to the device only, and the device cannot be framed. |
| Commands | Privileged commands go through an argv-only allowlist (`system/command.rs`) with timeouts and bounded output; no shell strings. |
| Files and archives | Atomic `0600` writes for secrets, symlink and traversal checks, bounded archive extraction. |
| Updates | Signed metadata and payload hashes for application and system updates; raw partition writes happen only after the install confirmation; boot watchdog rollback. An optional local key, set with the password and logged, signs bundles uploaded from the browser only. |
| Virtual media | Images served read-only to the host; `/data` has one writer at a time; image paths confined to `/data`; remote download off by default, limited to `http`/`https` ISO files, and refused for hosts on private, loopback, link-local or local-name addresses, including after a redirect. |
| Network | Managed firewall, Moderate (local sources only) by default; WebRTC blocked in Restricted and Paranoid; WireGuard peers admitted only on `wg0` from their allowed ranges. A Let's Encrypt order opens the HTTPS port to any source for its length only (`S40firewall acme-open`/`acme-close`), then closes it; Paranoid blocks the order. |
| Audit | Sign-ins, two-factor changes, WireGuard changes and trusted-proxy changes are logged to syslog with the source address. |
| PicoClaw | Gateway on `127.0.0.1` with a token; internal routes accept only loopback requests with the internal token; installer pinned to a SHA-256; a stored model key is reused only for the same API origin. |

## Kernel (Linux 6.18)

The kernel config is `board/sg2002/linux-6.18/nanokvm_defconfig` plus `nanokvm.fragment`
in `buildroot-external/hardened-sg2002`. Everything the system needs is built in; only the
media drivers and the Wi-Fi/BT stack are modules.

| | Settings |
| --- | --- |
| On | Strong stack protector, virtually mapped stacks, read-only kernel and module text (`STRICT_KERNEL_RWX`, `STRICT_MODULE_RWX`), zeroed stack variables and allocations (`INIT_STACK_ALL_ZERO`, `INIT_ON_ALLOC_DEFAULT_ON`), randomised slab freelists, `dmesg` for root only (`SECURITY_DMESG_RESTRICT`), seccomp, signed modules only (`MODULE_SIG_FORCE`), lockdown in integrity mode (next paragraph), hardened usercopy, `FORTIFY_SOURCE`, slab freelist pointer hardening and per-call-site kmalloc buckets (`SLAB_BUCKETS`), zeroing on free (`INIT_ON_FREE_DEFAULT_ON`), list hardening that stops on corruption (`LIST_HARDENED`, `BUG_ON_DATA_CORRUPTION`), kernel stack offset randomisation on every syscall (`RANDOMIZE_KSTACK_OFFSET_DEFAULT`), a stack-end check on every schedule (`SCHED_STACK_END_CHECK`). Zeroed allocations, randomised freelists and root-only `dmesg` carry over the 5.10 hardening, as does the missing user namespace support. |
| Not built | Namespaces (user namespaces included), the `bpf()` syscall, io_uring, userfaultfd, kexec, `/dev/mem` and `/dev/port`, `/proc/kcore`, `/proc/<pid>/pagemap` and `smaps` (`PROC_PAGE_MONITOR`), BSD ptys (`LEGACY_PTYS`), 32-bit compat, SELinux, AppArmor, audit, ftrace and kprobes. |
| Not enabled | KASLR: nothing passes the kernel a random seed (no RNG driver or node, no `kaslr-seed` from U-Boot), so the kernel would load at the same address every boot. `RANDOM_KMALLOC_CACHES` (16 copies of every kmalloc cache, too much for 161 MB). `ZERO_CALL_USED_REGS`. `kernel.kptr_restrict` is 0 and `kernel.sysrq` is 1. |
| Needed by the system | `DEBUG_FS`, read only under lockdown (the server reads `clk_summary`, the initramfs reads the User Key from `/sys/kernel/debug/gpio`). |

Root cannot reach kernel memory directly. There is no `/dev/mem` (and BusyBox has no
`devmem`); the kernel loads only modules signed with a key it generates at build time and
keeps only the public half of, so a new key comes with every build and the private one is
never stored; and lockdown (integrity) also blocks raw I/O ports, unsafe module parameters
and writes through debugfs. Every module comes with the system image and a system update
replaces kernel and modules together, so no module has to be signed after the build. The
media middleware (`libsys`) maps its buffers through `/dev/cvi-sys`, which
maps only buffers the media `sys` driver allocated in the 75 MiB carveout (uncached when
opened with `O_SYNC`) and refuses kernel memory, registers and free carveout. The video
encoder keeps every stream packet it hands to userspace in the carveout; the vendor driver
used kernel heap memory for H.264 headers, which userspace then mapped through `/dev/mem`.
The init scripts read the RTC registers they need through nvmem devices (see
[Files on the device](device-files.md#rtc-registers)). Checking the signatures of the media
modules adds about 0.4 s to boot (measured on a Lite). These are barriers for code that has
already gained root; every process involved runs as root, so they add nothing for an
unprivileged user.

## Open items

- The server runs as root. Splitting privileged operations into a smaller
  helper is future work.
- The login lockout is per address and user, plus a budget per address across all names; there is no counter across addresses.
- `/tmp` and `/dev/shm` are mounted with the tmpfs defaults. Mounting them `noexec` (woffko's
  4f541063) would stop the server: S95nanokvm runs `NanoKVM-Server` and `kvm_system` from copies in
  `/tmp`. Moving those copies is the prerequisite.
- Remote ISO download has no allowlist of sources, only the public-host check; it stays off by default.
- Retained vendor components with `NOASSERTION` licence metadata remain a
  documented limitation.
- Kernel: the settings under "Not enabled" above, each to be measured on the device before
  it is turned on.

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
  script inventory and remains a root-required administrative feature. Running a
  script passes the terminal's gate: terminal access is on, authentication is on,
  and each run consumes a fresh unlock ticket of the same session (header
  `X-NanoKVM-Terminal-Ticket`), issued after the password, and the code when the
  account has two-factor, was entered again. Listing, deleting and adding a script
  under a new name need only the session, because nothing executes a file in the
  script directory except a run. Replacing an existing script needs the same
  unlock as a run. The names of the scripts that were run are kept in
  `/etc/kvm/scripts-approved.json`; a script that is not in it (new, or deleted and
  added again) makes the web UI warn before the run and ask the user to look at
  it in the terminal first. Nothing checks a script's content, so a script edited
  over SSH is not flagged.
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
- Update cache: `/data/.hardened-kvmcache`; application updates use
  `application-update`, system updates use `system-update`.
- System-update archives are constrained to declared payload roots and reject
  runtime/cache roots such as `/dev`, `/proc`, `/sys`, `/run`, `/tmp`, `/data`,
  `/kvmapp`, and `/root/.kvmcache`.
- Image directory: `/data`, with resolved containment and symlink rejection.
- Script directory: `/etc/kvm/scripts`, with basename inventory and explicit
  execution only.
- Autostart directory: `/etc/kvm/autostart`, with traversal rejection.
- Settings files (syslog, time and timezone, firewall, inittab): replaced through one shared
  writer that creates a uniquely named temporary file exclusively without following links,
  fsyncs it, renames it and fsyncs the directory. A timezone must be a compiled zone, and a
  static IPv4 address and router must be hosts of their subnet.
- Firewall: a change to Restricted or Paranoid leaves `/etc/kvm/firewall-pending.json`; if the
  backend stops before the change is confirmed, the next start puts the previous mode back.
  `usb0` leads to the computer under control: in every mode its new connections are dropped
  first, until the operator creates `/etc/kvm/usb_management`. A new SD card no longer ships
  the `usb.rndis0` default, so USB networking is opt-in.
- sshd starts with three tries per connection, a one-minute login window and penalties for
  failed or unknown-user connections, counted per /64 for IPv6; `sshd -t` checks them first and
  an sshd that refuses them still starts without them.
- ntpd is a client only: the default restriction adds `noserve`, each configured server gets its
  own `restrict source` entry. The NULL-interface crash fix woffko added as a rootfs patch is not
  needed: Buildroot 2026.05.1 already carries it.
- The DHCPv6 hook lets only an address literal reach `ip` or a `nameserver` line and only domain
  names reach `search`, and it removes the `/128` it added when the lease ends or changes.
- The root hwmon helper writes its snapshot through a random exclusive temporary file in `/tmp`.
- HID: a failed write resets the USB gadget only when the controller state says that can help
  (not while the host is off or asleep), and at most once a minute. An H.264 keyframe is
  requested at most once a second for all viewers.
- Optional packages: Tailscale installs only from a pinned release file (size and SHA-256 in the
  source, HTTPS only, no wget fallback); PicoClaw uses the same downloader with its pinned
  release. See [package pins](../development/package-pins.md). A Wi-Fi SSID is 1-32
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
