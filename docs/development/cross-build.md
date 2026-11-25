---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-24
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
failed to initialize capture: libkvm_mmf is linked only into the device build
```

For hardware video, the Rust backend must be built with the `linked-libkvm`
feature through:

```sh
server-rust/scripts/build-linked-libkvm.sh
```

That script sets the NanoKVM dynamic loader, RPATH, sysroot libraries and headers,
and the `linked-libkvm` feature expected by `server-rust/src/ffi/mmf.rs`, which links
`libkvm_mmf`. Without that feature (host builds and tests) the server has no video; it never
loads `libkvm_mmf` at run time.

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
- **Allocator.** The device build uses mimalloc instead of musl's `malloc`, which
  hands memory back to the kernel and asks for it again under the server's many
  small allocations. On a Lite, MJPEG over HTTPS went from 25.8 to 28.6 fps and
  from ~133 to ~117 ms of CPU per MB sent, almost all of it kernel time; the
  binary grows by about 120 KB. It is built in secure mode (guard pages, encoded and
  randomised free lists, freed memory checked for double frees), which measured under 1%
  more CPU per MB on MJPEG over HTTPS. mimalloc's C code needs the musl headers in
  `server-rust/sysroot/include` (`HNANOKVM_SYSROOT_INCLUDE`); CI copies them from
  Buildroot's sysroot. Host builds and tests keep the system allocator.
- **Vector TLS code.** The device build assembles the XTheadVector ChaCha20 and the
  CRYPTOGAMS Poly1305 in `server-rust/native/` with GNU binutils (LLVM has no XTheadVector)
  and generates the scalar Poly1305 from its perlasm. `build.rs` runs
  `${HNANOKVM_XTHEADVECTOR_PREFIX}gcc` (default `riscv64-linux-gnu-`; CI passes Buildroot's
  prefix) and `perl`, and stops if either is missing. Debian trixie's binutils 2.44 works.
  Host builds and tests use RustCrypto stand-ins for the assembly.

### Cross-building in Docker (macOS or Linux)

This matches CI closely and needs no RISC-V toolchain on the host:

1. Copy the device's C library and libgcc into the sysroot. From the device:

   ```sh
   ssh root@<nanokvm> 'cd / && tar -cf - $(ls -d lib/libc.so* usr/lib/libc.so* lib/libgcc_s.so* usr/lib/libgcc_s.so* 2>/dev/null)' > device-libs.tar
   ```

   Put `libc.so` and `libgcc_s.so.1` into `server-rust/sysroot/lib/`.
   For the headers, install Debian's `musl-dev:riscv64` in the container
   (`dpkg --add-architecture riscv64`) and copy `/usr/include/riscv64-linux-musl`
   to `server-rust/sysroot/include`.
2. Build a clean tree, not the working copy, in a scratch directory:
   `git archive HEAD server-rust kvmapp/version | tar -x -C <scratch>`.
3. In a `rust:1-trixie` container with `clang`, `lld` and `gcc-riscv64-linux-gnu` installed,
   `rustup default 1.99.0 && rustup target add riscv64gc-unknown-linux-musl`,
   set `CARGO_TARGET_RISCV64GC_UNKNOWN_LINUX_MUSL_LINKER=ld.lld`, and run
   `server-rust/scripts/build-linked-libkvm.sh`.
4. Put `CARGO_TARGET_DIR` on a Docker volume rather than a bind mount; a
   bind-mounted target directory fails with "File exists (os error 17)" on macOS.

Check the result: a PIE executable with interpreter
`/lib/ld-musl-riscv64.so.1`, `NEEDED` entries `libkvm_mmf.so`, `libgcc_s.so.1`
and `libc.so`, and RUNPATH `/kvmapp/server/dl_lib`.

### Native prerequisites

Install the Rust target once:

```sh
rustup target add riscv64gc-unknown-linux-musl
```

The linked build needs NanoKVM runtime libraries in `server-rust/sysroot/lib`,
or `HNANOKVM_SYSROOT_LIB` must point at a directory with at least:

```text
libc.so
libgcc_s.so or libgcc_s.so.1
```

CI copies `libc.so`, `libgcc_s.so.1` and the headers from the sysroot of Buildroot's
compiler (`riscv64-buildroot-linux-musl-gcc -print-sysroot`): the musl the server runs on. If the active
checkout does not have `server-rust/sysroot/lib`, point the build at such a
sysroot explicitly:

```sh
HNANOKVM_SYSROOT_LIB=/path/to/nanokvm/sysroot/lib \
  server-rust/scripts/build-linked-libkvm.sh
```

It also needs the musl C headers (for mimalloc) in `server-rust/sysroot/include`,
or `HNANOKVM_SYSROOT_INCLUDE` pointing at them; the script stops if `stdlib.h` is
missing.

Do not run `make rust-kvmapp` unless `RUST_TARGET` is explicitly set. Without
that environment variable it can package an x86-64 host binary that installs
successfully but fails on the device with `Exec format error`.

## Rebuild Native libkvm_mmf

Native video changes are not rebuilt by Cargo. `libkvm_mmf.so` is a plain CMake target in `support/sg2002/CMakeLists.txt`
(`cmake/buildroot-musl.cmake`), built with Buildroot's own GCC, the toolchain
that builds the rootfs. CI's `build-buildroot` job is the reference build;
locally, run the same scripts on a Linux host or in a Linux container (on macOS,
keep the Buildroot output on a Docker volume, not a bind mount):

1. Build Buildroot's cross-compiler and musl. This needs the security-patched
   Buildroot source and the licheerv external tree, as in the workflow:

   ```sh
   make buildroot-bootstrap buildroot-security-source
   LICHEERV_EXTERNAL_SHA=<from the workflow> scripts/fetch-licheerv-external.sh
   HNANOKVM_6X_OUTPUT_DIR=/work/br scripts/build-buildroot-6x-image.sh toolchain
   CROSS=/work/br/host/bin/riscv64-buildroot-linux-musl-
   ```

   `scripts/build-buildroot-6x-image.sh build` later continues in the same output.
2. Fetch the sources the job fetches, at the SHAs in the workflow's `env`:
   `sophgo/cvi_mpi`, `sophgo/osdrv` (`interdrv/include`) and
   `sophgo/SensorSupportList` (`common`).
   Apply the patches in `support/sg2002/middleware-patches/` to cvi_mpi, in the order
   the workflow applies them.
3. Build the middleware, stage the SDK directory, then build and check the
   library:

   ```sh
   SDK_MIDDLEWARE_OPT_FLAGS=-O2 scripts/build-sdk-middleware.sh cvi_mpi osdrv mw "$CROSS"
   scripts/stage-sg2002-sdk.sh cvi_mpi osdrv sensor-list mw sg2002-sdk
   scripts/build-sg2002-native.sh "$CROSS" sg2002-sdk build/native-libkvm
   ```

`build-sg2002-native.sh` stops if an output lacks the stack protector, full
RELRO or the T-Head extensions, has an RPATH or vector code, if `libkvm_mmf.so` exports
anything other than `support/sg2002/additional/kvm_mmf/libkvm_mmf.map`, or lacks a function
`server-rust/src/ffi/mmf.rs` binds.

Copy `libkvm_mmf.so` and the middleware into `server-rust/native/dl_lib/` (not in git)
before running the linked Rust build and packaging. `scripts/package-rust-kvmapp.sh`
packages that directory as `/kvmapp/server/dl_lib`. Never let packaging
silently reuse an old `libkvm_mmf` after changing source.

Review [`native-code-audit.md`](../archive/native-code-audit.md) before modifying the
native code, and test native changes on a device.

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
file server-rust/target/riscv64gc-unknown-linux-musl/release/hnanokvm-server
file build/kvmapp-rust/kvmapp/server/hnanokvm-server
```

Expected shape:

```text
ELF 64-bit LSB pie executable, UCB RISC-V, dynamically linked,
interpreter /lib/ld-musl-riscv64.so.1
```

If `file build/kvmapp-rust/kvmapp/server/hnanokvm-server` reports `x86-64`, stop
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
  /kvmapp/server/hnanokvm-server \
  /kvmapp/backends/hnanokvm-server.rust
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
pidof hnanokvm-server
curl -kfsS --max-time 6 https://127.0.0.1/api/health
tail -n 80 /tmp/hnanokvm-server.log
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
`mjpeg`, and restarts only `hnanokvm-server`.

## SD And Raw System Update Builds

The SD image and its system-update archive are built by CI from source
([CI image build](ci-image-build.md)). To make a raw boot/rootfs bundle from an image
by hand:

```sh
scripts/extract-sd-raw-images.sh hnanokvm-6x.img.xz build/raw
RAW_IMAGE_COMPRESSION=gzip REQUIRED_FREE_BYTES=671088640 \
  scripts/create-raw-system-update-bundle.sh "<system-version>" sg2002-hnanokvm-sd \
  build/raw/boot.vfat build/raw/rootfs.sd build/system-updates
```

`scripts/extract-sd-raw-images.sh` accepts either `.img` or `.img.xz`; compressed
images are decompressed to a temporary file before partition extraction.

The bundle must package boot/rootfs images extracted from an H-NanoKVM SD image,
not a stock rootfs without `/kvmapp`, `/etc/kvm`, NanoKVM init, or web assets.

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
