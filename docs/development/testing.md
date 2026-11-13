---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-11
---

# Testing

## Rust server

```sh
cargo test --manifest-path server-rust/Cargo.toml
cargo clippy --manifest-path server-rust/Cargo.toml --all-targets -- -D warnings
cargo fmt --manifest-path server-rust/Cargo.toml --check
```

The tests run on the host; they do not need the device or the RISC-V toolchain.
Tests that touch real devices or commands skip themselves when the tool is
missing (the remote-download test needs `/usr/bin/curl`).

On macOS, `api::storage::tests::accepts_image_inside_storage_root` fails: the
storage code returns the canonical path (`/private/var/...`) while the test
expects the temporary directory's `/var/...` path. It passes on Linux.

Clippy is clean; `-D warnings` makes any new warning an error locally (CI does not run clippy).

## Standalone checks

```sh
node scripts/test-wifi-provisioning-result.cjs
node scripts/test-web-input-hygiene.cjs
python3 scripts/test-kvm-system-ap-key.py
```

The first runs the real handler of the AP setup page against synthetic responses: only
`code: 0` is success, every other code, a missing response or a failed request is a
failure. It needs the web dependencies (or `--typescript-module`). The second compiles
`ap_key.h` of `kvm_system` for the host and checks the key's alphabet, uniformity,
failure handling and 0600 storage. It needs Linux (`getrandom`), so run it in a
container on a Mac. The second runs the real keymap, wheel, IME-gate and HID-socket modules against stubs
([web input hygiene](web-input-hygiene.md)). None touches a device; the OLED layout and the C++ build are
checked in CI only.

The init-script tests `scripts/test-s50sshd.sh`, `test-udhcpc6-script.sh`,
`test-s49ntp.sh`, `test-s30wifi.sh`, `test-s01fs.sh`, `test-s95-pid-files.sh` and `test-s03usb-ids.sh` run BusyBox in private user, network and mount namespaces, so they need a
Linux host that allows unprivileged overlayfs. The sshd and ntp ones also need host builds
of OpenSSH and of ntpd with the rootfs patch (`SSHD_BIN`, `SSH_KEYGEN_BIN`, `NTPD_BIN`,
`NTPQ_BIN`). They have not been run on this tree, except `test-s30wifi.sh`, which passes in a
privileged Debian container with `busybox-static` and fails against the earlier `S30wifi`; `test-s01fs.sh`,
`test-s03usb-ids.sh` and `test-s95-pid-files.sh` also pass there (the latter as a non-root user, so that a file of another
account exists).

## Web UI

```sh
corepack pnpm --dir web test
corepack pnpm --dir web lint
corepack pnpm --dir web build
```

`translations.test.ts` guards every language file against the English one and
the copy rules. See [Web UI](web.md).

To look at a page without a device, use the screenshot check below, or MSW's mocked
mode (`pnpm mocked`) in a normal browser.

### Screenshot check

`web/scripts/ui-check/` serves a built `dist` with mocked `/api/...` answers
(`mock-api.mjs`) and screenshots it in Chromium through Playwright, at 1280px and at
390px in the touch layout: the sign-in pages, the menu bar popovers, the Shortcuts,
Leader key and image tips dialogs, and every Settings page, scrolled. Run it on the
build before and after a styling change and compare:

```sh
corepack pnpm --dir web exec playwright install chromium   # once
corepack pnpm --dir web build
corepack pnpm --dir web ui:shots dist /tmp/ui-after
# build the base branch in a worktree, then:
corepack pnpm --dir web ui:shots /path/to/base/web/dist /tmp/ui-before
corepack pnpm --dir web ui:compare /tmp/ui-before /tmp/ui-after --out /tmp/ui-diff
```

`ui:shots` exits non-zero when a page crashes, throws, or calls an endpoint the mock
does not answer; `report.txt` names them. A page that reads a new endpoint needs an
answer in `mock-api.mjs`, with values in the documentation ranges (192.0.2.0/24,
2001:db8::/32, example.com). The answers are fixed, so two runs of one build compare
equal. `ui:compare` lets each 128px tile move a few pixels and ignores sub-pixel text
shifts, then lists what still differs, largest first; `--out` writes before, after and
the changes in red for each one. Pages are found by their English titles, so a renamed
page or menu item needs the same change in `shots.mjs`.

### Layout check across languages (to set up)

Extend the screenshot check: open Settings in the touch layout
(375px wide, touch and mobile on) for each of the 26 languages and each of the 14 pages, and flag:

- a label that overlaps its control, or any element that runs past the screen edge;
- a navigation tab whose label is cut, or that runs past the screen edge;
- a label that wraps to a second line only as information: the rules allow it beside a
  switch and a badge may drop under its text, so it is not a failure, and the count will not
  go to zero.

English must report no clash and no broken navigation label. A first run, done by hand with
Playwright on 2026-10-30, found 0 clashes in 2,548 rows and 5 broken navigation labels, which are
fixed; it also counted 61 wrapped labels, which are fine and stay at that number. The
screenshot check's mock already answers every Settings page. Rerun it after a change to a label
or to the text of a control.

## Shell scripts

Init scripts run under BusyBox `ash`. At least check the syntax:

```sh
sh -n kvmapp/system/init.d/<script>
```

For logic that builds firewall rules or parses config files, source the function
with stubbed commands, or point the script at a fake `nft` that records its input, and
compare the output for a few inputs.

Three scripts already do this for the init scripts and need no device; run them
with `bash` from the repository root:

```sh
bash scripts/test-hardware-macs.sh
bash scripts/test-hid-only-mode.sh
bash scripts/test-s30eth-static-dns.sh
```

## The image workflow

For a change to `.github/workflows/system-image-6x.yml` or a script it calls:

1. Parse the YAML: `ruby -ryaml -e 'YAML.load_file(".github/workflows/system-image-6x.yml")'`.
2. Extract each step's `run:` block and check it with `bash -n`.
3. If anything other than comments changed, dispatch a real run
   ([CI image build](ci-image-build.md)) and wait for it before calling the
   change done. Much of the pipeline depends on environment variables passed from
   workflow steps to scripts, so a change that reads correctly can still fail.

## On a device

After deploying, run the smoke checks in
[Build and deploy the server](cross-build.md#smoke-checks). Changes to native
code, USB gadget scripts, the firewall or system updates need a device test; keep
a recovery card at hand.
