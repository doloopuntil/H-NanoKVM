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
  `ring`, `rustls`, `tungstenite`, `tokio-tungstenite`, `webrtc-srtp`, `aes`,
  `aes-gcm`, `ctr`, `ghash`, `polyval`, `hmac`, `sha1` are built at `opt-level=3`.
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

Fixed by the `cargo update`: rustls RUSTSEC-2026-0285, -0346, -0348, -0349;
rustls-webpki RUSTSEC-2026-0382; tokio RUSTSEC-2026-0386 (unsound `AsyncFd::new`, not
called by our code); yanked `spin 0.9.8`.

## Open advisories

| Crate | Advisory | Reachability | Blocker |
|---|---|---|---|
| crypto-bigint 0.5.5 | RUSTSEC-2026-0387, timing variability; fix needs 0.7.6 | In the build via `webrtc → dtls → p256/p384 → elliptic-curve` (DTLS ECDSA) | No compatible fix. Needs webrtc 0.21 |
| unsafe-libyaml 0.2.11 | RUSTSEC-2024-0449, unmaintained | Via `serde_yaml` (deprecated), used only in `api/picoclaw.rs` | Replace serde_yaml |

## Held back

| Crate | Current / latest | Reason |
|---|---|---|
| tokio-tungstenite | 0.29 / 0.30 | axum's WebSocket support uses tungstenite 0.29, so 0.30 links two tungstenite versions plus a second RustCrypto stack (sha1 0.11, rand 0.10, digest 0.11, chacha20). Wait for axum, or move with the RustCrypto group. Tried and reverted. |
| webrtc | 0.17.2 / 0.21.1 | Rewrite, see below |
| aes, cbc, cipher, hmac, md-5, sha1, sha2, argon2, rand_core | 0.8 / 0.1 / 0.4 / 0.12 / 0.10 / 0.10 / 0.10 / 0.5 / 0.6 vs 0.9.4 / 0.2.1 / 0.5.2 / 0.13 / 0.11 / 0.11 / 0.11 / 0.6 / 0.10 | Must move together; webrtc 0.17 still needs the old generation, so we would link both. Do after webrtc 0.21. `argon2` 0.6 and `rand_core` 0.10 also rename features (`std`, `getrandom`; cargo already warns). |
| serde_yaml | 0.9.34 deprecated | Replace with a maintained crate or a minimal parser; separate task. |

`cargo machete` flags `md-5` as unused, which is a false positive: `auth/compat_crypto.rs`
uses `md5::Md5`. No other unused dependencies.

## webrtc 0.21.1

Bumping `webrtc` and running `cargo update` fails in `src/api/webrtc_stream.rs`
(619 lines, the only user of `webrtc`):

- The `api`, `ice`, `ice_transport`, `dtls`, `interceptor`, `sdp`, `rtp`, `track` modules
  are gone from the crate root, and `rtp_sender` is private. 0.21 is a thin async
  layer over a sans-I/O core (`rtc`), with a background driver task that owns the sockets
  and timers.
- Compiler errors also report `dyn rtc_srtp::cipher::Cipher` and `dyn
  rtc_dtls::cipher_suite::CipherSuite` as not shareable between threads, hitting our
  spawned tasks (`webrtc_stream.rs:75`, `:254`, `:373`). Expect ownership or `Send` changes.
- Fixes crypto-bigint; `cargo audit` then reports only unsafe-libyaml.
- Crypto: default feature `crypto-ring` (already in our tree); `crypto-aws-lc-rs` is
  optional and must stay off (C code, larger, harder to cross-build).
- Resolved crates: 368 to 403 (+35). Size delta unknown because it does not compile yet.
- Cargo warns that the profile entries `webrtc-srtp`, `aes-gcm`, `ghash`, `polyval` match no
  package; replace them with the crates that do SRTP in 0.21 (for example `rtc-srtp`)
  after checking `cargo tree`.
- Wildcard UDP/TCP binds now open one socket per interface (loopback and link-local
  skipped), and an unbindable address is skipped with a log line instead of failing. Check this
  with eth0, USB and WireGuard present.
- The crates publish no `rust-version`; Rust 1.99 is new enough in practice.

Stability (from the 0.21.1 crate source and changelog):

- The crate ships `docs/semver.md`: growable enums are `#[non_exhaustive]` and
  library-implemented traits (`PeerConnection`, `DataChannel`, `RtpSender`,
  `RtpReceiver`) are sealed, so later releases can add variants and methods without
  breaking users. Its stated reason is that neither can be added after 1.0, so the
  breaking changes are being made before a 1.0 release.
- The sans-I/O core plus async driver looks like the intended end state, and crypto
  provider selection is explicit (`crypto-ring` default).
- Still pre-1.0: 0.17 to 0.21 is four breaking releases, the changelog has an
  `[Unreleased]` section with API changes (for example `PeerConnectionBuilder::build` now
  requires `A: Send + 'static`), and its history only starts at 0.20.0 (2026-07-31), so
  0.21's churn cannot be judged yet.
- Pin an exact version (`=0.21.x`) when adopting it. Later 0.x bumps should be smaller
  than this one.

Suggested approach: do it on a branch, rewrite `webrtc_stream.rs` against the new API,
keep the signalling endpoints and the browser-visible behaviour unchanged, build for
riscv in CI and compare size, then test video, stats, ICE and reconnect on the device.

## Size

Host x86_64 release binary (not the image target):

| State | Bytes |
|---|---|
| before this work | 10,057,392 |
| after `cargo update` | 10,123,016 (+0.65%) |
| after all six commits | 10,152,224 (+0.94%) |

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

## Next steps

1. Add `deny.toml` with documented ignores for the two open advisories, and a CI step.
2. Replace serde_yaml.
3. webrtc 0.21 rewrite, then the RustCrypto group together, then tokio-tungstenite
   once axum's WebSocket stack matches.
