---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-03
---

# Rust dependency audit (server-rust)

Audit of `server-rust/` dependencies on 2026-11-03, the updates already made on
`main`, and what is held back with the reason. Nothing here was measured on the
device or with the RISC-V toolchain; see "What to verify on hardware".

## Build context

- Image target `riscv64gc-unknown-linux-musl`, Rust 1.99.0 (pinned as `RUST_VERSION` in
  `system-image.yml`), edition 2024, rust-lld, static CRT (`.cargo/config.toml`).
- Release profile: `opt-level="z"`, LTO, `codegen-units=1`, strip, `panic=abort`;
  `ring`, `rustls`, `tungstenite`, `tokio-tungstenite`, `rtc-srtp`, `rtc-crypto`, `aes`,
  `ctr`, `hmac`, `sha1` are built at `opt-level=3`. SRTP AES-GCM goes through `ring`.
- The highest `rust-version` in the lock is 1.88 (`time`, `rcgen 0.14`), so MSRV does not block
  any update.
- Tools used: `cargo outdated --root-deps-only`, `cargo audit`, `cargo machete`.
  `cargo deny` is not configured (no `deny.toml`).

## Done on main

| Commit | Change |
|---|---|
| 90741ed | `cargo update` within semver ranges; release-notes line |
| 7232f8a | tower-http 0.6 to 0.7 |
| 53565d2 | base64 0.22 to 0.23 (webrtc still links 0.22) |
| a93f036 | bcrypt 0.16 to 0.19 (legacy-hash verification only) |
| cc77dad | rcgen 0.13 to 0.14 (`CertifiedKey.key_pair` is now `signing_key`) |
| 00fadb4 | nix 0.29 to 0.31 |

Each commit passed `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`
and `cargo test` (396 passed) on the host.

On the `video-stack` base, the webrtc 0.21.1 rewrite (see below) also passed `cargo fmt
--check` and `cargo test` (396 passed) in a Linux arm64 container. Clippy with Rust 1.99.1
reports three lints that are already on the base (`system_update/local.rs` unused
`Engine` import, `download.rs` `chunks_exact`, `picoclaw.rs` `result_large_err`), none in
`webrtc_stream.rs`. On macOS the crate does not build since nix 0.31: `api/vm.rs`
multiplies `statvfs` fields that are `u32` and `u64` there.

Fixed by the `cargo update`: rustls RUSTSEC-2026-0285, -0346, -0348, -0349;
rustls-webpki RUSTSEC-2026-0382; tokio RUSTSEC-2026-0386 (unsound `AsyncFd::new`, not
called by our code); yanked `spin 0.9.8`.

## Open advisories

| Crate | Advisory | Reachability | Blocker |
|---|---|---|---|
| unsafe-libyaml 0.2.11 | RUSTSEC-2024-0449, unmaintained | Via `serde_yaml` (deprecated), used only in `api/picoclaw.rs` | Replace serde_yaml |

## Held back

| Crate | Current / latest | Reason |
|---|---|---|
| tokio-tungstenite | 0.29 / 0.30 | axum's WebSocket support uses tungstenite 0.29, so 0.30 links two tungstenite versions plus a second RustCrypto stack (sha1 0.11, rand 0.10, digest 0.11, chacha20). Wait for axum, or move with the RustCrypto group. Tried and reverted. |
| aes, cbc, cipher, hmac, md-5, sha1, sha2, argon2, rand_core | 0.8 / 0.1 / 0.4 / 0.12 / 0.10 / 0.10 / 0.10 / 0.5 / 0.6 vs 0.9.4 / 0.2.1 / 0.5.2 / 0.13 / 0.11 / 0.11 / 0.11 / 0.6 / 0.10 | Must move together; webrtc 0.21's `rtc-crypto` still uses aes 0.8, hmac 0.12, sha1 0.10 and md-5 0.10, so moving now links both generations. `argon2` 0.6 and `rand_core` 0.10 also rename features (`std`, `getrandom`; cargo already warns). |
| serde_yaml | 0.9.34 deprecated | Replace with a maintained crate or a minimal parser; separate task. |

`cargo machete` flags `md-5` as unused, which is a false positive: `auth/compat_crypto.rs`
uses `md5::Md5`. No other unused dependencies.

## webrtc 0.21.1

`webrtc` is pinned to `=0.21.1`, with `rtc` (its sans-I/O core) as a direct dependency at
the same pin for the types the async layer does not re-export. `rtcp 0.17` is gone, so no
0.17 crates remain. Resolved crates: 368 to 328; `cargo audit` reports only
unsafe-libyaml. Crypto stays on the default `crypto-ring`; `crypto-aws-lc-rs` must stay
off (C code, larger, harder to cross-build).

`src/api/webrtc_stream.rs` keeps the signalling messages and the browser-visible
behaviour. What changed:

- `PeerConnectionBuilder` with `SettingEngineBuilder` (UDP4 only, mDNS off, the same two
  SRTP profiles), bound to `0.0.0.0:0`. A wildcard bind now opens one socket per interface
  (loopback and link-local skipped).
- Callbacks are a `PeerConnectionEventHandler`. The driver awaits them inline, so
  anything that calls back into the peer is spawned.
- There is no `signaling_state()`; a pending local or remote description counts as not
  stable.
- The track has its own SSRC and an H264 codec without fmtp, so it takes the first H264
  profile the offer and the default codecs share, as 0.17 did. The payload type is read from
  the sender once ICE connects, and frames go only to clients that have one.
- Inbound RTCP stops at the interceptors unless one marks it for the application. A small
  interceptor after the default chain marks PLI and FIR, and `TrackLocal::poll` delivers
  them to `request_h264_keyframe`. The stream ends when the peer closes.

Stability (from the 0.21.1 crate source and changelog):

- The crate ships `docs/semver.md`: growable enums are `#[non_exhaustive]` and
  library-implemented traits (`PeerConnection`, `DataChannel`, `RtpSender`,
  `RtpReceiver`) are sealed, so later releases can add variants and methods without
  breaking users. Its stated reason is that neither can be added after 1.0, so the
  breaking changes are being made before a 1.0 release.
- Still pre-1.0: 0.17 to 0.21 is four breaking releases, and the changelog only starts
  at 0.20.0 (2026-07-31). Hence the exact pin; later 0.x bumps should be smaller.

## Size

Host x86_64 release binary (not the image target):

| State | Bytes |
|---|---|
| before this work | 10,057,392 |
| after `cargo update` | 10,123,016 (+0.65%) |
| after all six commits | 10,152,224 (+0.94%) |

Host aarch64 Linux release binary, `video-stack` base:

| State | Bytes |
|---|---|
| webrtc 0.17 | 8,475,736 |
| webrtc 0.21.1 | 7,689,392 (-9.3%) |

bcrypt 0.19 adds a second `cipher`/`crypto-common` generation, which accounts for part of
the growth. The riscv numbers could not be measured: `ring` needs a RISC-V C cross
compiler (`riscv64-linux-musl-gcc`) that was not available. nix 0.31 was compile-checked on the host only.

## What to verify on hardware

1. `cargo build --release --target riscv64gc-unknown-linux-musl` with the image
   toolchain; record the binary size against `main` before 90741ed.
2. Boot, sign-in, HTTPS (rustls and webpki update), uploads (multer/axum update), Direct
   and WebRTC video, HID, and a Let's Encrypt issue/renew (instant-acme with the new rustls).
3. nix 0.31: mounts, signals, terminal/pty, network ioctls.
4. Legacy bcrypt password verification, and certificate generation (`generate_self_signed_cert`).
5. webrtc 0.21: video in Chrome, Firefox and Safari, a second viewer joining (keyframe on
   PLI), ICE over eth0, USB and WireGuard, STUN/TURN, and reconnect after a network drop.

## Next steps

1. Add `deny.toml` with documented ignores for the two open advisories, and a CI step.
2. Replace serde_yaml.
3. The RustCrypto group once `rtc-crypto` moves to the new generation, then
   tokio-tungstenite once axum's WebSocket stack matches.
