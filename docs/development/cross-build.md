---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-10-19
---

# Build and deploy the server

How to build the Rust server and the `kvmapp` package for real NanoKVM hardware
without running the full image build, and how to put them on a device. The full
SD image is built in CI ([CI image build](ci-image-build.md)).

## Important Rule

Do not deploy a plain `cargo build --target riscv64gc-unknown-linux-musl`
binary to the device. That binary starts the web server, but video capture will
fail with:

```text
load libkvm: Dynamic loading not supported
```

For hardware video, the Rust backend must be built with the `linked-libkvm`
feature through:

```sh
server-rust/scripts/build-linked-libkvm.sh
```

That script sets the NanoKVM dynamic loader, RPATH, sysroot libraries, and the
`linked-libkvm` feature expected by `server-rust/src/ffi/kvm.rs`.

## Toolchain

CI pins Rust `1.99.0` (`RUST_VERSION` in `.github/workflows/system-image-6x.yml`);
use the same version locally. The link step uses the position-independent C
runtime objects (`Scrt1.o`, `crtbeginS.o`, `crtendS.o`) because newer Rust no
longer links with the non-PIC `crt1.o`.

### Code generation

- **T-Head extensions.** The script builds for the SG2002's C906 core with its
  T-Head extensions (`THEAD_FEATURES`: `xtheadba`, `xtheadbb`, `xtheadbs`,
  `xtheadcondmov`, `xtheadmemidx`, `xtheadmempair`, `xtheadmac`). LLVM, and so
  `rustc`, has no C906 CPU model, so they are enabled one by one; `rustc` warns
  that they are unstable. The binary does not run on other RISC-V cores. C code
  that crates compile with `cc` (ring) gets the same extensions through
  `CFLAGS_riscv64gc_unknown_linux_musl`, which needs clang 17 or newer; Debian
  bookworm's clang 14 rejects them, so build in `rust:1-trixie` or override that
  variable. Rust's prebuilt standard library stays plain `rv64gc`.
- **Optimisation.** The release profile optimises for size (`opt-level = "z"`)
  because the init script runs the server from tmpfs, so its size is RAM. The
  crates that video passes through (TLS, WebSocket, SRTP and their ciphers) are
  built at `opt-level = 3` in `server-rust/Cargo.toml`; that costs about 0.2 MB,
  where `-O3` for everything costs about 3 MB.
- **Ciphers.** The TLS server prefers ChaCha20-Poly1305 over the client's order,
  because the C906 has no AES instructions. Measured on the device with `ring`
  and 16 KiB records: AES-128-GCM 3.3 MB/s at `"z"` and 5.1 MB/s at `-O3` with
  the extensions, ChaCha20-Poly1305 9.3 and 22.6 MB/s.

### Cross-building in Docker (macOS or Linux)

This matches CI closely and needs no RISC-V toolchain on the host:

1. Copy the device's C library and libgcc into the sysroot. From the device:

   ```sh
   ssh root@<nanokvm> 'cd / && tar -cf - $(ls -d lib/libc.so* usr/lib/libc.so* lib/libgcc_s.so* usr/lib/libgcc_s.so* 2>/dev/null)' > device-libs.tar
   ```

   Put `libc.so` and `libgcc_s.so.1` into `server-rust/sysroot/lib/`.
2. Build a clean tree, not the working copy, in a scratch directory:
   `git archive HEAD server-rust kvmapp/version | tar -x -C <scratch>`.
3. In a `rust:1-bookworm` container with `clang` and `lld` installed,
   `rustup default 1.99.0 && rustup target add riscv64gc-unknown-linux-musl`,
   set `CARGO_TARGET_RISCV64GC_UNKNOWN_LINUX_MUSL_LINKER=ld.lld`, and run
   `server-rust/scripts/build-linked-libkvm.sh`.
4. Put `CARGO_TARGET_DIR` on a Docker volume rather than a bind mount; a
   bind-mounted target directory fails with "File exists (os error 17)" on macOS.

Check the result: a PIE executable with interpreter
`/lib/ld-musl-riscv64.so.1`, `NEEDED` entries `libkvm.so`, `libgcc_s.so.1`
and `libc.so`, and RUNPATH `/kvmapp/server/dl_lib`.

### Native prerequisites

Install the Rust target once:

```sh
rustup target add riscv64gc-unknown-linux-musl
```

The linked build needs NanoKVM runtime libraries in `server-rust/sysroot/lib`,
or `NANOKVM_SYSROOT_LIB` must point at a directory with at least:

```text
libc.so
libgcc_s.so or libgcc_s.so.1
```

If the active checkout does not have `server-rust/sysroot/lib`, point the build
at an extracted NanoKVM sysroot explicitly:

```sh
NANOKVM_SYSROOT_LIB=/path/to/nanokvm/sysroot/lib \
  server-rust/scripts/build-linked-libkvm.sh
```

Do not run `make rust-kvmapp` unless `RUST_TARGET` is explicitly set. Without
that environment variable it can package an x86-64 host binary that installs
successfully but fails on the device with `Exec format error`.

## Rebuild Native libkvm Or kvm_system

Native video changes are not rebuilt by Cargo. CI's `build-native-libkvm` job
builds `libkvm.so` and `libkvm_mmf.so` from `support/sg2002` with a pinned
MaixCDK; that is the reference build. To build them locally, set the two paths
that `support/sg2002/build` defines internally for your checkout:

```sh
export MAIXCDK_PATH=~/MaixCDK
export NanoKVM_PATH=/path/to/this/checkout
```

Rebuild the video libraries through MaixCDK:

```sh
cd support/sg2002
./build update_lib
./build kvm_vision
```

`./build update_lib` currently exits with status `1` after printing success;
verify the copied component files instead of treating that status alone as a
copy failure. The generated libraries are expected under:

```text
support/sg2002/kvm_vision_test/dist/kvm_vision_test_release/dl_lib/
```

Copy the reviewed output into `server-rust/native/dl_lib/` before running the
linked Rust build and packaging. `scripts/package-rust-kvmapp.sh` packages that
directory as `/kvmapp/server/dl_lib`.

For `kvm_system` changes, build it the way CI does:

```sh
cd support/sg2002
./build kvm_system
```

The binary is `support/sg2002/kvm_system/dist/kvm_system_release/kvm_system`;
pass it to the package script as `KVM_SYSTEM_SOURCE`.

The package script consumes
`support/sg2002/kvm_system/build/kvm_system` by default. Never let packaging
silently reuse an older native helper or old `libkvm` after changing source.

Review [`native-code-audit.md`](../archive/native-code-audit.md) before modifying either
native component, and test native changes on a device.

## Build And Package Kvmapp

From the repository root:

```sh
cargo test --manifest-path server-rust/Cargo.toml
corepack pnpm --dir web build
server-rust/scripts/build-linked-libkvm.sh
RUST_TARGET=riscv64gc-unknown-linux-musl \
  APP_VERSION="$(cat kvmapp/version)" \
  scripts/package-rust-kvmapp.sh
```

The package script writes:

```text
build/kvmapp-rust/kvmapp/
build/artifacts/nanokvm-kvmapp-rust.tar.gz
build/artifacts/nanokvm-kvmapp-rust.tar.gz.sha256
```

The binary should be a dynamic RISC-V executable using the NanoKVM loader:

```sh
file server-rust/target/riscv64gc-unknown-linux-musl/release/nanokvm-rust-server
file build/kvmapp-rust/kvmapp/server/NanoKVM-Server
```

Expected shape:

```text
ELF 64-bit LSB pie executable, UCB RISC-V, dynamically linked,
interpreter /lib/ld-musl-riscv64.so.1
```

If `file build/kvmapp-rust/kvmapp/server/NanoKVM-Server` reports `x86-64`, stop
and rebuild before publishing or installing the archive.

## Manual Device Install

BusyBox `tar` on system 0.4.0 handles gzip (`tar -xzf`); images before 0.4.0 do
not. For those, create an uncompressed tar on the host:

```sh
tar -C build/kvmapp-rust -cf build/artifacts/nanokvm-kvmapp-rust.tar kvmapp MANIFEST.txt
sha256sum build/artifacts/nanokvm-kvmapp-rust.tar
scp -O build/artifacts/nanokvm-kvmapp-rust.tar root@nanokvm.local:/tmp/
```

On the device:

```sh
sha256sum /tmp/nanokvm-kvmapp-rust.tar
tar xf /tmp/nanokvm-kvmapp-rust.tar -C /
cp /kvmapp/system/init.d/S95nanokvm /etc/init.d/S95nanokvm
chmod 0755 /etc/init.d/S95nanokvm \
  /kvmapp/system/init.d/S95nanokvm \
  /kvmapp/server/NanoKVM-Server \
  /kvmapp/backends/NanoKVM-Server.rust
mkdir -p /etc/kvm /kvmapp/kvm
printf 'rust\n' > /etc/kvm/backend
printf 'mjpeg\n' > /kvmapp/kvm/type
rm -f /etc/kvm/h264_safe_mode
sync
/etc/init.d/S95nanokvm restart
```

`/etc/init.d/S95nanokvm` is a separate file on tested devices, not a symlink to
`/kvmapp/system/init.d/S95nanokvm`. Always copy the updated init script there
after extracting a manual package.

## Smoke Checks

On the device:

```sh
cat /kvmapp/version
cat /etc/kvm/backend
cat /kvmapp/kvm/type
pidof NanoKVM-Server
curl -kfsS --max-time 6 https://127.0.0.1/api/health
tail -n 80 /tmp/nanokvm-server.log
```

The log must include:

```text
initialized NanoKVM video backend
starting HTTP to HTTPS redirect listener addr=0.0.0.0:80
starting NanoKVM Rust HTTPS backend addr=0.0.0.0:443
```

It must not include:

```text
Dynamic loading not supported
```

From the host:

```sh
curl -vk --connect-timeout 5 --max-time 8 https://nanokvm.local/api/health
curl -v --connect-timeout 5 --max-time 8 http://nanokvm.local/api/health
```

Expected behavior:

- HTTPS returns JSON with `backend: "rust"`.
- HTTP returns `307 Temporary Redirect` to HTTPS when `proto: https`.

## H.264 Hang Guard

After `Guard H.264 capture against backend hangs`, the runtime intentionally
boots into MJPEG and lets the user opt into H.264 from the UI. This prevents a
bad H.264/VENC startup from leaving the device with open TCP ports but no
HTTP/TLS responses.

The init script also starts a local health watchdog. If `/api/health` fails
repeatedly, it writes `/etc/kvm/h264_safe_mode`, forces `/kvmapp/kvm/type` to
`mjpeg`, and restarts only `NanoKVM-Server`.

## SD And Raw System Update Builds (local, older path)

The 0.4.0 image is built by CI from source. The local flow below patches an
existing image and remains for raw-update bundle work:

```sh
cargo test --manifest-path server-rust/Cargo.toml
corepack pnpm --dir web build
server-rust/scripts/build-linked-libkvm.sh
RUST_TARGET=riscv64gc-unknown-linux-musl \
  APP_VERSION="$(cat kvmapp/version)" \
  scripts/package-rust-kvmapp.sh
make sd-image HARDENED_RELEASE_VERSION="$(cat kvmapp/version)"
make raw-system-update-images HARDENED_RELEASE_VERSION="$(cat kvmapp/version)"
make raw-system-update-bundle \
  HARDENED_RELEASE_VERSION="$(cat kvmapp/version)" \
  SYSTEM_UPDATE_VERSION="<system-version>" \
  RAW_IMAGE_COMPRESSION=gzip \
  REQUIRED_FREE_BYTES=671088640
```

`scripts/extract-sd-raw-images.sh` accepts either `.img` or `.img.xz`; compressed
images are decompressed to a temporary file before partition extraction.

`make raw-system-update-bundle` must package boot/rootfs images extracted from
the patched Hardened SD image. Do not point it at vendor SDK
`rawimages/rootfs.sd`; that is a stock Buildroot rootfs without `/kvmapp`,
`/etc/kvm`, NanoKVM init, or web assets.

Raw partition updates overwrite boot and rootfs. The app updater used to launch
them must preserve and restore user settings before reboot. Do not test or
publish a raw update path from an app older than `2.0.12` when the bundle uses
gzip payloads, because older app versions do not understand
`images/rootfs.sd.gz`. Do not publish a raw update path from an app older than
`2.0.11` even for uncompressed payloads, because those versions do not restore
`/boot` network settings, `/etc/kvm` account/config state, SSH host keys, root
password files, or extension state after the raw write.

Current raw bundles should use the default gzip payload mode. The updater keeps
`rootfs.sd.gz` and `boot.vfat.gz` compressed in the extracted staging tree and
streams them directly to `/dev/mmcblk0p2` and `/dev/mmcblk0p1`; this avoids
requiring enough `/data` or rootfs free space to hold an additional full 1.5GB
rootfs image.

The guard rail is:

```sh
scripts/validate-nanokvm-rootfs.sh <rootfs.sd>
```

The validator must pass before signing or uploading any raw system update.
