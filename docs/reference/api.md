---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-07
source: server-rust/src/http/routes.rs
---

# Backend API


This document maps the current Rust backend surface in `server-rust/`.

## Runtime And Serving Model

- Active backend binary on device: `/kvmapp/server/NanoKVM-Server`.
- Rust backend source: `server-rust/`.
- Native Rust backend runtime assets: `server-rust/native/`, packaged to
  `/kvmapp/server/dl_lib` where needed.
- Static frontend path: configured `paths.web_root`, normally
  `/kvmapp/server/web`.
- Config file: `/etc/kvm/server.yaml`.
- Default HTTP bind: `host: ""`, port `80`, effectively all interfaces.
- Optional HTTPS: `proto: https`, `port.https`, and configured cert/key.
- HTTPS mode keeps a restricted loopback HTTP surface for PicoClaw internal
  routes, answers `/api/health` over HTTP (the boot watchdog asks every 10 s and
  saves a TLS handshake) and redirects normal HTTP clients to HTTPS. The redirect target is
  taken from `Host` only when it is a host name, an IPv4 address or a bracketed
  IPv6 address with an optional numeric port; any other value gets `400`.

## Response Envelope

Most REST handlers preserve the existing NanoKVM envelope:

```json
{ "code": 0, "msg": "success", "data": {} }
```

The Rust backend may use HTTP status codes for transport/security failures such
as authentication, CSRF, origin, malformed uploads, or internal errors.

## Public Routes

| Method   | Path                       | Rust Status                                                                                                                                           |
| -------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET      | `/api/health`              | Implemented; returns Rust backend health.                                                                                                             |
| POST     | `/api/auth/login`          | Implemented with opaque session token, CSRF token, login lockout, and configurable session duration. Returns `totpRequired` instead of a session when the account has a second factor enrolled. |
| POST     | `/api/auth/login/totp`     | Implemented; second login step. Exchanges the pending-ticket cookie plus a TOTP or backup code for a session. Public because the caller holds a ticket, not a session. |
| GET/POST | `/api/auth/setup`          | Implemented for first-account setup flow; GET reports whether setup is required, POST creates the first account only while `/etc/kvm/pwd` is missing. |
| POST     | `/api/network/wifi`        | Implemented for AP-mode no-auth Wi-Fi flow with AP key verification. Wrong keys lock out: 5 per source and 20 in all, for 10 minutes (`-5`).         |
| POST     | `/api/network/wifi/verify` | Implemented for AP-mode verification.                                                                                                                 |

On these routes an I/O, configuration or internal failure is reported as
`{"code": -500, "msg": "internal error"}`; the text, which may name paths or
configuration detail, goes only to the backend log. `/api/application/current-version`
is handled the same way. Authenticated routes keep the detailed message.

## Authenticated REST Routes

### Auth And Account

| Method   | Path                 | Rust Status                                                                                                    |
| -------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| POST     | `/api/auth/logout`   | Implemented; revokes current session.                                                                          |
| GET      | `/api/auth/account`  | Implemented.                                                                                                   |
| GET/POST | `/api/auth/password` | Implemented; requires the current password, Argon2id writes, legacy verification, password-change session revocation, and root password sync. Existing TOTP enrolment is preserved across a password change, and a `code` is required when the account has one. |
| GET/DELETE | `/api/auth/totp` | Implemented; GET reports enrolment state, clock-sync state, and remaining backup codes. DELETE disables the second factor and requires the account password, which counts against the shared password lockout, and a `code`. |
| POST | `/api/auth/totp/enroll` | Implemented; requires the account password (and a `code` if already enrolled). Generates a secret held pending confirmation and returns it with an `otpauth://` URI. Refused while the device clock is unsynchronized. |
| POST | `/api/auth/totp/confirm` | Implemented; verifies one code against the pending secret, activates it, and returns the backup codes once. |
| POST | `/api/auth/totp/backup-codes` | Implemented; reissues backup codes. Requires the account password and a `code`. |
| POST | `/api/auth/totp/required` | Implemented; toggles `security.require_totp`. Refuses to enable until the account has confirmed an enrolment. |

### Application Updates

| Method   | Path                               | Rust Status                                                                                                                                                                                                                                                                                             |
| -------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET      | `/api/application/current-version` | Implemented as an unauthenticated lightweight endpoint for the login screen; reads only the local `/kvmapp/version` and does not query GitHub release metadata.                                                                                                                                         |
| GET      | `/api/application/version`         | Implemented; reads `/kvmapp/version` and validates signed Hardened GitHub release `latest.json` metadata. When Paranoid firewall mode is active, returns the current version with a blocked update message instead of opening outbound GitHub traffic.                                                  |
| POST     | `/api/application/update`          | Implemented release path; verifies signed metadata, downloads the Hardened GitHub release archive, validates source URL, verifies sha512, safely extracts, rejects symlinks and unexpected backend artifacts, installs `/kvmapp`, and restarts service. Blocked while Paranoid firewall mode is active. |
| GET      | `/api/application/upload-check`    | Implemented; refuses without a registered local update key, and refuses an application bundle upload up front (read-only `/data`, update running, image transfer running, no space) so the browser shows the reason. |
| POST     | `/api/application/upload`          | Implemented; takes one signed bundle (see [system-update-bundles.md](system-update-bundles.md#application-bundles)), verifies it and stages it in the update cache. Returns the staged `version`, `name`, `size` and `signer`. |
| GET      | `/api/application/staged`          | Implemented; the staged application bundle, or `null`. |
| DELETE   | `/api/application/staged`          | Implemented; drops the staged bundle. |
| POST     | `/api/application/install`         | Implemented; checks the staged archive again, installs `/kvmapp` and restarts the service. |

### System Updates

| Method | Path                          | Rust Status                                                                                                                                                                                                                                                                                                                                     |
| ------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/system-update/version`  | Implemented read-only; reports persisted `/etc/kvm/system-version.json` when present, otherwise falls back to `/boot/ver`, kernel release, Buildroot version, hardware marker, and target `sg2002-hnanokvm-sd`.                                                                                                                             |
| GET    | `/api/system-update/check`    | Implemented read-only; reads GitHub `hardened-system-stable/system-latest.json`, validates metadata shape, trusted URLs, archive name, size, sha256, sha512, and reports update availability. When Paranoid firewall mode is active, returns the current system state with a blocked update message instead of opening outbound GitHub traffic. |
| GET    | `/api/system-update/status`   | Implemented read-only; reports the verified staged system bundle, pending installed update marker, boot-health summary, and latest rollback backup when present.                                                                                                                                                                                |
| POST   | `/api/system-update/download` | Implemented staging-only; downloads the GitHub release asset, checks size, sha256, sha512, extracts it safely, verifies `manifest.json`, verifies every payload file hash/size/path, and writes `staged.json`. It does not install or reboot. Blocked while Paranoid firewall mode is active.                                                   |
| POST   | `/api/system-update/install`  | Implemented guarded install; re-verifies staged archive, backs up each target file, applies payload files atomically, writes `/etc/kvm/system-version.json`, writes pending/backup markers, generates `/etc/kvm/system-update-rollback.sh` for init-time recovery, and returns without rebooting.                                               |
| POST   | `/api/system-update/discard`  | Implemented; drops the staged system update and keeps the rollback backups; refused while an update waits for its boot confirmation. |
| GET    | `/api/system-update/upload-check` | Query `size`. Answers before the browser sends the bundle whether the upload can proceed: `/data` writable, the size within the limit, enough free space for the bundle and its unpacked copy, no update running, no image transfer running. Failure reasons are returned as readable messages. |
| POST   | `/api/system-update/upload` | Stages a bundle uploaded as one multipart `file` (a tar holding `system-latest.json`, its `.sig` and the archive); verifies the signature (release key, local key, or unsigned when allowed) and then as for download. |
| GET, PUT, DELETE | `/api/system-update/local-key` | Reports, registers or removes the local update key. PUT and DELETE need the account password and, when the account has two-factor, a `code`; wrong passwords and codes count against lockouts, as for the terminal unlock. |
| POST   | `/api/system-update/rollback` | Implemented manual rollback; restores files from the latest backup marker, clears pending/boot-good/rollback-attempt markers, and returns without rebooting.                                                                                                                                                                                    |
| POST   | `/api/system-update/confirm`  | Implemented manual boot-good confirmation; validates pending version/target against current system identity and basic boot/web-root markers, writes `/etc/kvm/system-update-boot-good.json`, and clears pending marker.                                                                                                                         |

### System Log

| Method   | Path                       | Rust Status                                                                                                                                                                                                                                                         |
| -------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET/POST | `/api/system-log/config`   | Implemented in app `2.0.20`; persists `/etc/kvm/syslog.json`, renders `/etc/default/syslogd` and `/etc/default/klogd`, restarts BusyBox `syslogd`/`klogd`, keeps local logs in tmpfs at `/tmp/hardened-syslog/messages`, and supports UDP remote syslog forwarding. |
| GET      | `/api/system-log/messages` | Implemented; GUI uses the unified `kind=system` tmpfs syslog tail. Hidden/debug reads remain for `kind=kernel` from the current `dmesg` ring buffer and `kind=backend` from `/tmp/nanokvm-server.log`. Line count is clamped to 1-1000.                             |
| POST     | `/api/system-log/test`     | Implemented; emits a test syslog message through `/dev/log` so local and remote forwarding paths can be verified.                                                                                                                                                   |

### System Time

| Method   | Path                    | Rust Status                                                                                                                                                                                                                                                                     |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET/POST | `/api/system/time`      | Implemented in app `2.0.20`; persists `/etc/kvm/time.json`, validates timezone names against `/usr/share/zoneinfo` (a compiled TZif zone only, never a text table such as `leapseconds`), writes `/etc/localtime`, writes `/etc/ntp.conf`, and starts/stops the managed `S49ntp` service. NTP defaults to enabled with public `pool.ntp.org` servers. |
| POST     | `/api/system/time/sync` | Implemented; runs `ntpdate -u` against the first configured NTP server, then restarts `ntpd`.                                                                                                                                                                                   |
| GET/POST | `/api/system/wireguard` | Implemented; GET returns the config, whether a private key is set, the public key derived from it, the interface state, the peer's last handshake and transfer counters, and whether Paranoid Firewall mode blocks the tunnel. POST validates and persists `/etc/kvm/wireguard/kvm.conf` (one peer, IPv4 address and allowed ranges, `/0` ranges refused) and restarts or stops `S45wireguard`, then reapplies the firewall. Enabling needs a private key and a complete peer. |
| POST     | `/api/system/wireguard/private-key` | Implemented; write-only. Stores a validated key in `/etc/kvm/wireguard/private.key` (0600) and rebuilds a running tunnel. The key is never returned. |
| POST     | `/api/system/wireguard/private-key/generate` | Implemented; runs `wg genkey`, stores the key the same way and returns only the derived public key in the status. |
| POST     | `/api/system/wireguard/private-key/remove` | Implemented; turns WireGuard off and deletes the key file. |

### System Firewall

| Method | Path                           | Rust Status                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/system/firewall`         | Implemented in app `2.0.20`; reports persisted firewall mode, effective mode, HTTPS readiness, backend tool availability, local-source policy state, whether H.264 WebRTC is blocked by firewall policy, and the rules in force: `nft list ruleset` with the nftables backend, otherwise `iptables-nft-save`/`ip6tables-nft-save` (or `iptables-save`/`ip6tables-save`).                                                                                                                                                                                                                                                                                                  |
| POST   | `/api/system/firewall`         | Implemented; accepts `baseline`, `moderate`, `restricted`, or `paranoid`, persists `/etc/kvm/firewall.json`, and restarts managed `S40firewall`. Moderate is the default profile and keeps baseline services reachable only from private IPv4, IPv4 link-local/loopback, IPv6 ULA, IPv6 link-local, and IPv6 loopback sources. Restricted allows local-only HTTPS/SSH plus needed outbound DNS/NTP/syslog/update traffic; H.264 WebRTC UDP is not opened. Restricted and Paranoid modes require HTTPS configuration and a successful local HTTPS health check before rules are applied. |
| POST   | `/api/system/firewall/confirm` | Implemented; clears the pending restricted-mode confirmation marker after the GUI remains reachable. A short rollback task restores moderate/previous mode if Restricted or Paranoid is enabled but not confirmed.                                                                                                                                                                                                                                                                                                                                                                      |

### VM, Device, And Settings

| Method          | Path                       | Rust Status                                                                                                        |
| --------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| GET             | `/api/vm/info`             | Implemented; includes image version, application version, hostname, IP, mDNS, and uptime.                          |
| GET             | `/api/vm/hardware`         | Implemented; reports the board family and `lite`, a guess (beta, no OLED, no Wi-Fi) the web UI uses to hide Power. |
| GET/POST        | `/api/vm/hostname`         | Implemented.                                                                                                       |
| GET/POST        | `/api/vm/web-title`        | Implemented.                                                                                                       |
| GET/POST        | `/api/vm/gpio`             | Implemented. A power or reset pulse (50 ms to 5 s) runs in its own task and always releases the line, even after a lost client or at shutdown; an overlapping pulse on the same line is refused (-409). |
| POST            | `/api/vm/screen`           | Implemented; writes legacy-compatible video mode/resolution/quality/FPS files and coordinates stream mode changes. |
| GET/POST        | `/api/vm/device/virtual`   | Implemented.                                                                                                       |
| GET/POST        | `/api/vm/oled`             | Implemented.                                                                                                       |
| GET             | `/api/vm/hdmi`             | Implemented; returns `enabled`, `signal` (input present) and `idleTimeout` (minutes).                              |
| POST            | `/api/vm/hdmi/reset`       | Implemented. Off, 1 s, on, in a task of its own: a lost client cannot leave HDMI capture off. Refused while capture is disabled. libkvm calls run on a blocking thread. |
| POST            | `/api/vm/hdmi/enable`      | Implemented.                                                                                                       |
| POST            | `/api/vm/hdmi/disable`     | Implemented.                                                                                                       |
| POST            | `/api/vm/hdmi/timeout`     | Implemented; `{minutes}` 0-10080, 0 disables the idle stop.                                                        |
| GET             | `/api/vm/ssh`              | Implemented.                                                                                                       |
| POST            | `/api/vm/ssh/enable`       | Implemented.                                                                                                       |
| POST            | `/api/vm/ssh/disable`      | Implemented.                                                                                                       |
| GET             | `/api/vm/mdns`             | Implemented.                                                                                                       |
| POST            | `/api/vm/mdns/enable`      | Implemented.                                                                                                       |
| POST            | `/api/vm/mdns/disable`     | Implemented.                                                                                                       |
| POST            | `/api/vm/system/reboot`    | Implemented.                                                                                                       |
| POST            | `/api/vm/system/poweroff`  | Implemented; answers, then runs `poweroff` a second later. The device stays unreachable until it is powered on again. |
| POST            | `/api/vm/terminal/unlock`  | Implemented; takes `username`, `password` and, when the account has two-factor, a `code`. Returns the one-use ticket for the WebSocket. A missing or wrong code answers `-6`. |
| GET/POST        | `/api/vm/terminal/enabled` | Implemented; also controls whether the terminal WebSocket is available. |
| POST            | `/api/vm/session-lock/touch` | Implemented; slides the session while the user is active, so the lock counts idle time.                          |
| GET/POST        | `/api/vm/trusted-proxies`  | Implemented; the reverse proxies whose forwarded client address and scheme are trusted. POST takes `proxies`, `password` and, with two-factor, `code`, applies at once and is logged. |
| GET/POST        | `/api/vm/session-lock`     | Implemented; supports 5, 15, 30, and 60 minute durations and `logoutOnBrowserClose`; retimes the session. |
| GET/POST        | `/api/vm/memory/limit`     | Implemented.                                                                                                       |
| GET/POST        | `/api/vm/swap`             | Implemented. Reads the swap file size and `availableMb`, the space a swap file may take (free space of `/` plus the current file). Sizes are 0, 64, 128 or 256 MB; a size that leaves less than 32 MB free is refused. |
| GET             | `/api/vm/reboot-pending`   | Implemented; `reasons` lists what waits for a reboot: `hostname`, `overdrive`, `systemUpdate`. Each is derived from the state that setting keeps. |
| GET/POST        | `/api/vm/overdrive`        | Implemented. Reads or sets the boot clock profile (`available`, `enabled`, `active`, `keepAfterUpdate`, `rebootRequired` when the running clocks differ from the wanted profile). The POST body takes `enabled` and/or `keepAfterUpdate`; the profile applies after a reboot.      |
| GET/POST        | `/api/vm/watchdog`         | Implemented. Reads or sets the hardware watchdog (`available`, `enabled`, `running`, `lastRestart`). The POST body is `{enabled}`; it creates or removes `/boot/disable_watchdog` and starts or stops `S02watchdog` at once. |
| GET             | `/api/vm/monitor`          | Implemented. Reads clocks (`cpuMhz`, `videoMhz`, `overdrive`), temperature, memory and swap, the CPU load of the last second (`cpu.userPercent`, `cpu.systemPercent`, from `/proc/stat`) the `/` and `/data` disks, `uptimeSeconds` (from `/proc/uptime`), plus up to 300 one-second `samples` (temperature, RAM, swap and total CPU percent). With `since` and `epoch` it sends only samples newer than `since` of that server run. The clocks come from `clk_summary` once per server run. |
| GET/POST        | `/api/vm/mouse-jiggler`    | Implemented.                                                                                                       |
| POST            | `/api/vm/tls`              | Implemented; generates self-signed certs when needed, keeps the previous settings, then restarts the server (not the device). Refused while an earlier switch waits for confirmation. |
| GET             | `/api/vm/tls/pending`      | Implemented; `pending` and `secondsLeft` of the confirmation window of a protocol switch.                                       |
| POST            | `/api/vm/tls/confirm`      | Implemented; keeps the new protocol.                                                                                           |
| POST            | `/api/vm/tls/revert`       | Implemented; puts the previous protocol and firewall mode back and restarts the server.                                        |
| GET/POST        | `/api/vm/cert`             | Implemented. GET: the certificate source (`selfSigned`, `tailscale`, `acme`), domain, email, status (expiry, last attempt and error), whether a request runs (`busy`), `tailscaleAvailable`, and `blocker` (`clockUnsynced`, `httpsOff` or `paranoidFirewall`) when something stops both managed sources. POST: changes the source after the account password and, if set, a two-factor code; the request runs in the background and a new certificate waits for confirmation (`/api/vm/tls/confirm`) or is reverted without a restart. |
| POST            | `/api/vm/cert/renew`       | Implemented; requests a new certificate for the current source now. |
| GET/POST/DELETE | `/api/vm/autostart*`       | Implemented with basename/path validation and size limits.                                                         |
| GET/POST/DELETE | `/api/vm/script*`          | Basename/path validation; run, and an upload that replaces an existing script, need terminal access and a fresh terminal unlock ticket; adding a new name, listing and deleting need only the session. The list also returns `unapproved`, the scripts not run since they were added. |

### Video And HID

| Method      | Path                            | Rust Status                                                                                                                                                                  |
| ----------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/api/ws`                       | Implemented HID keyboard/mouse WebSocket plus capture-status events.                                                                                                         |
| GET         | `/api/stream/mjpeg`             | Implemented through `libkvm` with shared fanout.                                                                                                                             |
| POST        | `/api/stream/mjpeg/detect`      | Implemented.                                                                                                                                                                 |
| POST        | `/api/stream/mjpeg/detect/stop` | Implemented. Frame detection is paused for the given seconds in a task of its own, so a lost client cannot leave it off; libkvm calls run on a blocking thread.               |
| GET         | `/api/stream/h264/direct`       | Implemented NanoKVM-compatible direct H.264 binary frame WebSocket.                                                                                                          |
| GET         | `/api/stream/h264`              | Implemented H.264 WebRTC signaling and RTP sample streaming for Baseline/Moderate firewall modes; returns forbidden while Restricted or Paranoid firewall mode is effective. |
| GET         | `/api/hid/shortcuts`            | Implemented.                                                                                                                                                                 |
| POST/DELETE | `/api/hid/shortcut`             | Implemented.                                                                                                                                                                 |
| GET/POST    | `/api/hid/shortcut/leader-key`  | Implemented.                                                                                                                                                                 |
| GET/POST    | `/api/hid/mode`                 | Implemented.                                                                                                                                                                 |
| GET         | `/api/hid/leds`                 | Implemented; host lock LEDs, pushed as `hid-led-status` on the websocket.                                                                                                    |
| POST        | `/api/hid/reset`                | Implemented.                                                                                                                                                                 |
| POST        | `/api/hid/paste`                | Implemented.                                                                                                                                                                 |

### Storage And Image Download

| Method   | Path                                 | Rust Status                                                                                                                                                               |
| -------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET      | `/api/storage/image`                 | Implemented. Returns `files` and `sizes` (bytes by path).                                                                                                                 |
| GET      | `/api/storage/image/mounted`         | Implemented.                                                                                                                                                              |
| POST     | `/api/storage/image/mount`           | Implemented with `/data` path validation, ISO/CD-ROM and IMG/mass-storage mode validation, LUN eject/insert media changes, and USB reconnect when the media type changes. |
| POST     | `/api/storage/usb/reconnect`         | Implemented as an explicit fallback for hosts that do not notice virtual-media changes.                                                                                   |
| GET      | `/api/storage/cdrom`                 | Implemented.                                                                                                                                                              |
| POST     | `/api/storage/image/delete`          | Implemented with containment checks.                                                                                                                                      |
| GET      | `/api/download/image/enabled`        | Implemented.                                                                                                                                                              |
| GET      | `/api/download/image/status`         | Implemented.                                                                                                                                                              |
| GET      | `/api/download/image/upload-check`   | Query `size` and `name`. Answers before the browser sends an image whether the upload can proceed: image storage writable, no other transfer running, the name valid and not the mounted image, the size within 8 GiB and enough free space. Failure reasons are returned as readable messages. |
| POST     | `/api/download/file`                 | Implemented browser ISO upload with size and path validation. The body is streamed to a temporary file in 256 KiB writes, optionally hashed (`X-SHA256-Sum`), synced to the card, validated and then renamed into place. |
| GET/POST | `/api/download/image/remote/enabled` | Implemented disabled-by-default remote ISO toggle. Turning it on needs `password` and, with two-factor, a `code`, and is logged; turning it off needs only the session.                                                                                                                        |
| POST     | `/api/download/image`                | Implemented guarded remote ISO download with protocol, public-host (every redirect hop, address pinned), filename, destination, size, redirect, and ISO signature checks.                                                   |

### Network And Tailscale

| Method     | Path                           | Rust Status                                                                   |
| ---------- | ------------------------------ | ----------------------------------------------------------------------------- |
| POST       | `/api/network/wol`             | Implemented.                                                                  |
| GET/DELETE | `/api/network/wol/mac`         | Implemented.                                                                  |
| POST       | `/api/network/wol/mac/name`    | Implemented.                                                                  |
| GET/POST   | `/api/network/dns`             | Implemented. GET reports `ipv4Mode` (static or DHCP address) and `dnsMode` (manual or DHCP servers) separately; `mode` repeats `dnsMode`. POST sets both together, and manual mode needs a static IPv4 address. A manual IPv4 address and its router must be hosts of their subnet (not its network or broadcast address), must differ, and a subnet mask must match an address prefix given with it. |
| POST       | `/api/network/dns/servers`     | Implemented; sets only the DNS servers (`manual` with a list, or `dhcp`), so a DHCP network can use fixed servers. `dhcp` is refused while the IPv4 address is static. |
| GET        | `/api/network/wifi`            | Implemented.                                                                  |
| POST       | `/api/network/wifi/connect`    | Implemented.                                                                  |
| POST       | `/api/network/wifi/disconnect` | Implemented.                                                                  |
| GET/POST   | `/api/extensions/tailscale/*`  | Implemented lifecycle/status/login/install flow with safer command execution. Install fetches only the pinned Tailscale 1.104.2 static riscv64 archive over HTTPS and keeps it only when its SHA-256 matches the pin ([optional package pins](security-optional-packages.md)). |

### PicoClaw

| Method          | Path                          | Rust Status                                                                      |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------- |
| GET/POST        | `/api/picoclaw/model/config`  | Implemented compatibility route.                                                 |
| POST            | `/api/picoclaw/agent/profile` | Implemented compatibility route.                                                 |
| GET             | `/api/picoclaw/sessions`      | Implemented session list compatibility; full real-history validation remains.    |
| GET/DELETE      | `/api/picoclaw/sessions/{id}` | Implemented compatibility shape; real session history behavior needs validation. |
| GET/POST/DELETE | `/api/picoclaw/runtime/*`     | Implemented runtime status/session/install/uninstall/start/stop flows. Install fetches only the pinned v0.2.8 archive over HTTPS (size and SHA-256 in source). |
| GET             | `/api/picoclaw/gateway/ws`    | Implemented gateway WebSocket relay.                                             |
| GET             | `/api/picoclaw/screenshot`    | Implemented loopback-only internal route.                                        |
| POST            | `/api/picoclaw/actions`       | Implemented loopback-only HID action route.                                      |
| POST            | `/api/picoclaw/mcp`           | Implemented loopback-only MCP bridge.                                            |
| POST            | `/api/picoclaw/load-image`    | Implemented loopback-only load-image bridge.                                     |

## WebSocket Controls

| Path                       | Purpose                                       | Rust Control                                                                                                    |
| -------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/api/ws`                  | HID keyboard/mouse control and capture status | Authenticated session, Origin validation, bounded message size, queued HID writes.                              |
| `/api/vm/terminal`         | PTY shell                                     | Disabled by default, controlled by Terminal menu toggle, authenticated session, Origin validation.              |
| `/api/stream/h264`         | WebRTC H.264 signaling                        | Authenticated session, Origin validation, slow-client handling, and firewall-mode block in Restricted/Paranoid. |
| `/api/stream/h264/direct`  | Direct H.264 stream                           | Authenticated session, Origin validation, shared producer/fanout.                                               |
| `/api/picoclaw/gateway/ws` | PicoClaw runtime gateway                      | Authenticated session, Origin validation, session lock, upstream timeout/message limits.                        |

## Config Fields

See [Server configuration](config.md).

## External Components To Preserve

- `kvm_system` (OLED, buttons, Wi-Fi provisioning) remains an external native
  component.
- `libkvm.so` and `libkvm_mmf.so` remain the native video boundary; the Rust
  server calls them through FFI. They are built from `support/sg2002` in CI.
- Init scripts under `/etc/init.d/` remain the service-control boundary
  ([Init scripts](init-scripts.md)).
- The video capture and encoder pipeline is not rewritten in Rust.

## Current Gaps

- Less common settings and exact error semantics still need route-by-route
  regression testing.
- H.264 WebRTC needs longer browser/ICE testing in Baseline and Moderate modes;
  Restricted and Paranoid disable it on purpose.
- PicoClaw runtime and history need more testing against the real runtime.
