---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-07
---

# Rust backend

The Rust backend lives in `server-rust/`. It replaces upstream's Go `server/`
and runs as `NanoKVM-Server`, keeping the rest of the NanoKVM runtime:
`kvm_system`, `libkvm.so`, the USB gadget scripts, the Maix multimedia stack and
the React frontend. Its routes are listed in [Backend API](../reference/api.md)
and its configuration in [Server configuration](../reference/config.md).

The SG2002 has one CPU core, so the Tokio runtime has one worker thread. A
blocking call in an async handler (a HID write that waits for the host, a large
file read) stalls every other request: run such work with `spawn_blocking`.

## Build

Cross-building and manual device deployment are in
[Build and deploy the server](cross-build.md). Deploy only the `linked-libkvm`
RISC-V binary.

Run the normal host checks from the repository root:

```sh
cargo test --manifest-path server-rust/Cargo.toml
make web-app
```

For a video-enabled NanoKVM RISC-V binary, use the linked `libkvm` build. Copy
the NanoKVM runtime libraries into `server-rust/sysroot/lib` or point
`NANOKVM_SYSROOT_LIB` at a directory containing `libc.so` and `libgcc_s.so.1`,
then run. The NanoKVM native runtime libraries used for linking and packaging
are kept in `server-rust/native/dl_lib`.

```sh
rustup target add riscv64gc-unknown-linux-musl
server-rust/scripts/build-linked-libkvm.sh
```

That script builds with feature `linked-libkvm`, uses Buildroot's musl 1.2.6 loader
`/lib/ld-musl-riscv64.so.1` (not the vendor T-Head loader; see
[thread stack alignment](riscv-musl-stack-alignment.md)), and sets RUNPATH only to the root-owned
`/kvmapp/server/dl_lib`. S95 may stage the executable itself in a root-created
`/tmp/server`, but never copies or loads shared libraries from `/tmp`.

Package a deployable `kvmapp` layout with:

```sh
RUST_TARGET=riscv64gc-unknown-linux-musl scripts/package-rust-kvmapp.sh
```

The package is written to:

```text
build/kvmapp-rust/kvmapp/
build/artifacts/nanokvm-kvmapp-rust.tar.gz
```

## SD Image

The full SD image is built from source in CI; see
[CI image build](ci-image-build.md). For flashing, see
[Install](../guide/install.md).

## Implemented

- Rust HTTP and HTTPS listeners, including HTTP-to-HTTPS redirect.
- Static frontend serving from configured `paths.web_root`.
- Existing `code/msg/data` API response envelope.
- Auth setup, login, logout, account, password check/change.
- Argon2id password hashing for new writes and existing bcrypt verification.
- Session cookies compatible with the current React auth guard.
- CSRF token binding, Origin checks, security headers, login lockout, and
  logout/password-change session revocation.
- Optional TOTP (RFC 6238) second factor for web login, with single-use backup
  codes. See "Two-factor authentication" below. SSH is unaffected and remains
  password-only.
- VM info, hardware, hostname, web title, GPIO/ATX, OLED, HDMI, SSH, mDNS,
  swap, memory limit, TLS toggle, reboot, scripts, autostart, uptime, and
  session-lock routes.
- Managed firewall modes: Baseline compatibility, Moderate default local-only
  access, Restricted local-only service allowlist, and Paranoid local-only HTTPS
  with online updates intentionally blocked. Restricted and Paranoid block
  H.264 WebRTC; use H.264 Direct or MJPEG in those modes.
- MJPEG stream and frame-detect endpoints through `libkvm`. With frame
  detection on, an unchanged screen (`libkvm` result 5) sends nothing and is
  not a capture failure, so the stream resumes at the next changed frame
  without the failure backoff.
- H.264 Direct and H.264 WebRTC routes are implemented. Direct streaming is the
  preferred low-CPU mode and has been verified on hardware. WebRTC websocket
  signaling is available only when the effective firewall mode permits it.
- MJPEG and H.264 Direct use shared fanout producers, so multiple viewers do
  not multiply native capture reads. New browser sessions default to H.264
  Direct when HTTPS and WebCodecs are available, otherwise to H.264.
- The H.264 Direct socket takes `?flow=N` (1 to 8) to ask for decode-driven flow
  control. The player acknowledges each decoded frame with a 9-byte message, the
  byte `2` followed by the frame's timestamp as a little-endian u64, and can ask
  for a resync with the single byte `3`. The server keeps at most N frames in
  flight, drops the rest, and resumes at the next keyframe, so a slow client
  cannot build up stale frames in its buffers; a client that omits `flow` gets
  every frame. The server pings every 15 seconds, closes a client that is silent
  for 30 seconds, and closes a socket that cannot take a frame within 2 seconds.
  The player reconnects with a growing delay.
- Device startup uses an idempotent `S95nanokvm`: stale `S95nanokvm.*` backup
  scripts are moved out of boot autostart, old `kvm_system`/`NanoKVM-Server`
  processes are stopped before runtime copy/start, stale web backup directories
  are removed from `/kvmapp/server`, and port 443 is explicitly allowed for
  HTTPS.
- Keyboard and mouse HID websocket, queued HID writes, paste, shortcuts, HID
  mode/reset, mouse jiggler, mobile TouchSync pointer mode, and relative
  pointer sensitivity controls.
- Storage image listing, browser ISO upload, mount, unmount, delete, and CD-ROM
  mode with path validation. Runtime media changes now eject and insert the
  mass-storage LUN; switching between CD-ROM and mass-storage mode also
  reconnects the USB gadget so BIOS/boot menus rescan the device type. An
  explicit reconnect endpoint remains available as a compatibility fallback.
- Guarded remote ISO download by URL. It is disabled by default, controlled by
  Settings > User > Preferences, validates URL shape, filename, size, destination, and
  ISO9660 signature, and writes only under the configured image directory.
  Completed browser uploads and remote downloads refresh the virtual-media image
  list without requiring logout.
- One transfer stage for the three browser uploads (image, system bundle, application
  bundle), in `api/upload.rs`: `receive_field` streams a multipart file field to disk in
  chunks with a size cap, an optional SHA-256 on its own thread behind a bounded queue, and
  an fsync before it returns; `check_size_and_space` and the per-kind `upload-check` routes let
  the browser ask first, because a refusal after the body has started reaches it as a
  connection reset. A handler keeps what is its own around the transfer: locks and names
  before, validation, unpacking and the rename after. A new upload takes an `UploadLimits`
  (largest file, free-space factor) and these two functions rather than its own loop. The
  bundle uploads call `download::ensure_no_image_transfer()` first: both load the single core,
  and only an image transfer makes the watchdog patient.
- WOL, DNS, Wi-Fi status/connect/AP verification, and Tailscale lifecycle
  routes.
- Terminal websocket, disabled by default and controlled by the existing
  Terminal menu toggle.
- PicoClaw runtime routes, gateway WebSocket relay, screenshot, HID actions,
  MCP, load-image bridge, and session-list compatibility routes. Real
  runtime/session/history validation is still ongoing.
- Safer command execution through argv-only allowlists and timeouts.
- Safe archive/path handling for script upload, autostart files, ISO upload,
  storage image paths, and update archives.
- Online and offline `kvmapp` updates through Hardened GitHub Releases:
  `/api/application/version` reads `latest.json`, `/api/application/update`
  verifies signed release metadata, downloads the release archive, verifies
  sha512, installs it under `/kvmapp`, and restarts `S95nanokvm`.
- Read-only system-update version/check routes:
  `/api/system-update/version` reports the current base-system identity and
  `/api/system-update/check` validates GitHub-hosted `system-latest.json`
  metadata without installing the system archive.
- System-update download/status/install/rollback routes:
  `/api/system-update/download` downloads and verifies the system archive in
  the update cache, checks the archive digests and every manifest payload hash,
  and records `staged.json`; `/api/system-update/status` reports that staged
  bundle plus pending/boot-health/rollback state. `/api/system-update/install`
  re-verifies the staged archive, backs up touched files, applies payload files
  atomically, writes `/etc/kvm/system-version.json`, and records
  pending/backup markers. `/api/system-update/confirm` writes a boot-good
  marker after basic health checks. `/api/system-update/rollback` restores the
  latest backup manually. These routes do not reboot automatically.
- UI branding for Hardened NanoKVM, About-page app version display from
  `/kvmapp/version`, and an unauthenticated current-version endpoint used by
  the login screen.
- Guarded raw system-update switch in System updates. Raw boot/rootfs writes
  stay disabled by default and require an explicit warning confirmation before
  `/api/system-update/install` can apply a destructive staged bundle.
- First-boot web setup for SD-card flashes without `/etc/kvm/pwd`.
- Rust-only release artifacts with package validation for the expected runtime
  layout.
- WireGuard settings and key routes (`/api/system/wireguard*`), driving
  `S45wireguard` and reapplying the firewall.
- HID-only mode as the `/boot/usb.hidonly` flag; image mounts are refused while
  it is on.
- Remote keyboard lock LEDs (`/api/hid/leds` and a `hid-led-status` WebSocket
  event), read from `/dev/hidg0` by a dedicated thread.
- HDMI signal in `/api/vm/hdmi` and a capture idle timeout (`hdmi_idle.rs`).
- One H.264 capture shared by the Direct and WebRTC streams, with isolated
  subscribers.
- Read-only image mounts and one writer for `/data` at a time, with transfers
  refused while the host holds the virtual disk.
- Optional SHA-256 for image uploads (`X-SHA256-Sum`) and downloads; remote
  download progress in bytes and `/api/download/image/cancel`.
- Fixed DNS servers on a DHCP network (`/api/network/dns/servers`).
- `/api/vm/hardware` reports `lite`, a guess the web UI uses to hide the Power
  menu.
- PicoClaw: pinned v0.3.1 installer, model form with the stored key kept for the
  same API origin, session history read from PicoClaw's files, a mouse gate that
  fails fast when the host does not read the mouse, and a screenshot fallback
  that captures a frame when none is cached.

## Two-factor authentication

Opt-in TOTP (RFC 6238: HMAC-SHA1, 6 digits, 30-second steps, +/-1 step of drift)
for the **web UI only**. SSH authenticates against the root Unix password on a
separate path and is not covered.

### Login flow

`POST /api/auth/login` behaves as before for accounts without enrolment. For an
enrolled account it verifies the password and then, instead of issuing a
session, returns `code: 0` with `{ "totpRequired": true }` and sets a
short-lived HttpOnly pending-ticket cookie. `POST /api/auth/login/totp`
exchanges that ticket plus a code for the real session.

The discriminator lives inside `data` rather than being a new error code
because the frontend treats any nonzero `code` as a hard failure.

The pending ticket is not a session: it is single-use, expires in five minutes,
is bound to the address that obtained it, and resolves only to a username, so
no route can mistake it for authentication. A wrong code does not spend it.

### The device clock

This board has no battery-backed RTC. It boots at the Unix epoch and reaches
real wall-clock time only once NTP succeeds. Two consequences:

- **TOTP codes are refused with an explicit "clock not synchronized" error**
  while the clock is implausible, rather than reported as invalid codes.
- **Backup codes are deliberately exempt from that check.** They are the
  recovery path *for* an unsynchronized clock, so gating them on the clock
  would make them unreachable in exactly the situation they exist for. This is
  the single most important invariant in this feature; it has a dedicated
  regression test.

Sync is detected from a plausibility floor (`MIN_PLAUSIBLE_UNIX_TIME` in
`auth/clock.rs`, currently 2026-01-01) plus a flag set when a sync through the
API succeeds. The floor is a source constant rather than a build timestamp
because a build timestamp would break reproducible builds. `ntpq`/`ntpdc` are
not built into the image, so querying the daemon is not an option.

### Recovery

Enrolment issues nine single-use backup codes, displayed once. They are stored
as **SHA-256 hashes, not Argon2**: they are server-generated with 50 bits of
entropy, so the slow-KDF rationale (resisting offline brute force of a
guessable human password) does not apply, and one Argon2 verification takes
seconds on this hardware while checking a backup code has to compare against
every remaining hash. Online guessing is capped by the existing login lockout.

If both the authenticator and the backup codes are lost, recovery means SSH
access and removing the `totp` object from `/etc/kvm/pwd`.

### Replay protection

The last accepted step is held **in memory**, not persisted, because persisting
it would mean a flash write on every login. Sessions are already in-memory, so
a reboot clears no more than it otherwise would, and replaying a captured code
across a power cycle means beating a boot that takes far longer than the
30-second window.

### `security.require_totp`

Requires a second factor for web login. It is switched from **Settings >
Account** once enrolled. Enabling it through
`POST /api/auth/totp/required` is refused until the account has confirmed an
enrolment, mirroring how `system_firewall` refuses restricted modes until HTTPS
is on.

If the flag is set some other way -- a hand-edited `server.yaml`, a restored
config, a reset `/etc/kvm/pwd` -- **login still succeeds**, because refusing
would leave a headless device with no way back in. But the session is
**confined**: while the policy is on and the account is unenrolled, the
`protected` middleware answers every route with `403 two-factor enrolment
required` except the ones needed to enrol or leave -- `GET /api/auth/account`,
`GET /api/auth/totp`, `POST /api/auth/totp/enroll`, `POST /api/auth/totp/confirm`
and `POST /api/auth/logout`. The policy toggle is deliberately not among them,
so a confined session cannot switch the policy off. The frontend turns that 403
into a redirect to enrolment.

The check runs per request rather than being stored on the session, so
completing enrolment lifts the restriction for the session that did it, and
clearing the policy lifts it immediately. When the policy is off it costs one
atomic load; when on, it reads the account file, and an unreadable file counts
as unenrolled so the policy fails closed.

### Changing the second factor

Every change to the second factor requires the account password: enrolling,
disabling and reissuing backup codes. Without it a stolen session could bind
its own authenticator, which would replace the secret, void the owner's backup
codes and -- because enrolment revokes other sessions -- log the owner out.

`POST /api/auth/password` likewise requires the current password
(`currentPassword`), so a stolen session cannot change the password and take
over the account.

## Intentionally Disabled

- Signed application update metadata enforcement is implemented. Releases must
  include `latest.json.sig`; unsigned metadata is accepted only when
  `security.allow_unsigned_updates=true`.
- Signed system-update metadata enforcement is implemented. Stable
  metadata must verify against `paths.system_update_public_key`; unsigned
  metadata is accepted only when `security.allow_unsigned_updates=true`.
  `S95nanokvm` installs the bundled default public key from
  `/kvmapp/system/keys/system-update-signing.pub.pem` into `/etc/kvm` before
  the backend starts. The system-update installer also generates an init-time
  rollback script, and
  `S95nanokvm` runs a boot watchdog that rolls back pending system updates when
  local health checks fail after boot.
- Default `admin/admin` bootstrap is disabled by default in Rust config. New
  SD-card flashes use the first-boot web setup screen instead. Lost credentials
  are recovered by reflashing the SD card.

## Known Issues And Remaining Work

- Less common settings and exact error semantics still need route-by-route
  validation.
- H.264 WebRTC remains for Baseline/Moderate only; Restricted and Paranoid
  disable it on purpose. Mixing MJPEG and WebRTC viewers at the same time is a
  known limitation.
- The HTTP/HTTPS switch restarts the server process, like an application update,
  and the video stack starts again with it. `S95nanokvm` reboots only if the old
  server does not exit. Changing the HID mode still reboots the device.
- Remote ISO download has no allowlist of sources, so it should stay off by default.
  Turning it on needs the password and a two-factor code, and the URL host and every
  redirect hop must be on the public internet (`pin_public_host` in `download.rs`).
  Upstream's newer download code (sipeed/NanoKVM #957) has no allowlist, SSRF guard
  or switch, so there is nothing to take over.
- PicoClaw needs more end-to-end testing against the real runtime.
- The server runs with root privileges, like the original. Splitting privileged
  operations into a smaller helper is future work.
- See also the open items in [Security model](../reference/security-model.md#open-items).

## Device Deployment

Manual deployment to a test device:

```sh
scp server-rust/target/riscv64gc-unknown-linux-musl/release/nanokvm-rust-server root@nanokvm:/tmp/NanoKVM-Server.rust
scp scripts/install-rust-backend.sh root@nanokvm:/tmp/install-rust-backend.sh
ssh root@nanokvm 'sh /tmp/install-rust-backend.sh /tmp/NanoKVM-Server.rust'
```

The manual installer also removes stale backend backups and development helper
scripts left by older test builds.
