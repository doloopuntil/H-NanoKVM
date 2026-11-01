# AGENTS.md

Guide for coding agents working in this repository. People should start with
[README.md](README.md) and [docs/README.md](docs/README.md).

## What this is

Firmware for the SG2002 NanoKVM: a Rust web server (`server-rust/`) that
replaces upstream's Go server, the React UI (`web/`), the application package
installed to `/kvmapp` (`kvmapp/`), a Buildroot external tree
(`buildroot-external/`), and native video code (`support/sg2002/`). The whole SD
image is built by `.github/workflows/system-image.yml`.

## Commands

```sh
cargo test --manifest-path server-rust/Cargo.toml
cargo clippy --manifest-path server-rust/Cargo.toml --all-targets -- -D warnings
cargo fmt --manifest-path server-rust/Cargo.toml
corepack pnpm --dir web install --frozen-lockfile
corepack pnpm --dir web test
corepack pnpm --dir web lint
corepack pnpm --dir web build
sh -n kvmapp/system/init.d/<script>
gh workflow run system-image.yml --ref <branch>   # multi-hour full image build
```

Details and known failures: [docs/development/testing.md](docs/development/testing.md).

## Rules that are easy to break

- **Versions** live in three places that must agree, or the image build fails:
  `kvmapp/version`, `HARDENED_NANOKVM_KVMAPP_VERSION` in
  `buildroot-external/hardened-sg2002/package/hardened-nanokvm-kvmapp/hardened-nanokvm-kvmapp.mk`,
  and `EXPECTED_SYSTEM_VERSION`/`EXPECTED_KVMAPP_VERSION` in the workflow. The
  application version is plain `x.y.z`.
- **Boot scripts** are listed in `kvmapp/system/init.d/S95nanokvm`, the kvmapp
  `.mk` and `server-rust/src/main.rs`. A new init script goes into all three.
- **One CPU core.** The server's Tokio runtime has one worker thread. Never block
  in an async handler; use `spawn_blocking` for HID writes, slow file I/O and
  anything that waits on the host.
- **Commands** run only through `system::command::run_allowed` with an
  `AllowedCommand` variant: argv only, no shell strings.
- **Secrets and config** are written with `fsutil::write_0600_atomic`. Files that
  init scripts read with `sed` (`/etc/kvm/wireguard/kvm.conf` and similar) hold
  only validated values, one `Key=value` per line.
- **UI strings**: every new or changed English string in
  `web/src/i18n/locales/en.ts` goes into every other language file too;
  `translations.test.ts` enforces keys and copy rules. Follow
  [docs/development/web-ui-layout-rules.md](docs/development/web-ui-layout-rules.md).
- **Tailwind 4 and antd share cascade layers**
  (`@layer theme, base, antd, components, utilities` in `web/src/assets/styles/index.css`;
  antd joins through `StyleProvider layer` in `main.tsx`). Preflight is on and
  cannot restyle antd; utilities override antd without `!`. Keep that order.
- **Image workflow**: do not reintroduce downloads of published Hardened
  artifacts (the raw.12 system, the 2.0.42 app archive); `libkvm` and
  `kvm_system` are built from source. The `build/rc12-run` path name is a
  deliberate leftover. Change the workflow
  only with a real CI run to prove it
  ([docs/development/ci-image-build.md](docs/development/ci-image-build.md)).
- **Update channels** in `application.rs` and `system_update.rs` still point at
  `woffko/Hardened_NanoKVM`; this is a known open decision, not a bug to fix
  silently.

## Style

- Keep source comments short, one or two lines. Reasoning goes in commit
  messages and docs.
- Match the surrounding code; the repository has no global formatter config
  beyond `cargo fmt` and the web Prettier setup.
- Shell scripts target BusyBox `ash`, not bash.

## Documentation

- User guides go in `docs/guide/`, facts to look up in `docs/reference/`,
  contributor material in `docs/development/`, release notes in `docs/releases/`.
- `CHANGELOG.md` only lists the release pages. Write notes for a change in the release's
  page (unreleased work: `docs/releases/0.4.0.md`), not in `CHANGELOG.md`.
- Current pages start with front matter: `status`, `applies-to`, `last-checked`.
  Update `last-checked` when you verify a page against the code.
- `docs/archive/` holds historical records. Do not update them; link to them.
- No lab IP addresses or personal paths outside the archive.
