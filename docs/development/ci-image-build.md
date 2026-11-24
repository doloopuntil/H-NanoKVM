---
status: current
applies-to: system 1.0.0 / app 3.0.0 (Linux 6.18)
last-checked: 2026-11-24
source: .github/workflows/system-image-6x.yml
---

# CI image build

## Run it

```sh
gh workflow run system-image-6x.yml --ref <branch>
```

The run takes about 40 minutes with warm caches and longer from cold. When it finishes:

- `sg2002-6x-sd-image` (kept 14 days) holds `sd-image/hardened-sg2002-6x.img.xz` with its
  `SHA256SUMS`, and `_reports/` with the boot-partition listing, the FIT summary, the module
  list, the hashes and `summary.md`.
- `system-update-archive-6x` (14 days) holds the unsigned system-update archive made from the
  same image.

Flash the `.img.xz` as described in [Install](../guide/install.md).

Three places must carry the same version or the build fails: `kvmapp/version`,
`HARDENED_NANOKVM_KVMAPP_VERSION` in
`buildroot-external/hardened-sg2002/package/hardened-nanokvm-kvmapp/hardened-nanokvm-kvmapp.mk`,
and `EXPECTED_SYSTEM_VERSION` / `EXPECTED_KVMAPP_VERSION` in the workflow (both jobs that
set them).

## What it builds

`.github/workflows/system-image-6x.yml` builds the SD image from source on
`ubuntu-latest`, `workflow_dispatch` only. One Buildroot tree, configured from
`hardened_sg2002_nanokvm_6x_defconfig` with two external trees (this repository's
`buildroot-external/hardened-sg2002` and the pinned licheerv tree fetched by
`scripts/fetch-licheerv-external.sh`), builds:

- the musl toolchain and the userland;
- Linux 6.18.29 with licheerv's patch series and our board patches 0001-0007, configured from
  `board/sg2002/linux-6.18/nanokvm_defconfig` plus `nanokvm.fragment`, and the
  `sg2002-nanokvm-lite.dts` device tree;
- the 11 Sophgo media modules (`hardened-soph-media`, `sophgo/osdrv` at `SOPHGO_OSDRV_SHA`);
- OpenSBI 1.8.1 (licheerv's reset driver with our warm-reset patch), U-Boot 2025.10, and the
  FSBL from `sophgo/fsbl` (branch `sg200x-dev`, pinned as `SOPHGO_FSBL_SHA`), packed into
  `fip.std.bin` and `fip.od.bin` (`hardened-sg2002-fip`; `fip.bin` is a copy of the standard
  one);
- the root filesystem with the `kvmapp` package.

`board/sg2002/linux-6.18/post-image.sh` then packs the boot FIT (`boot.itb`: LZ4 kernel,
DTB and the recovery initramfs, each with a SHA-256 hash U-Boot checks), `boot.scr`, the
32 MiB boot partition and `hardened-sg2002-6x.img` (`genimage.cfg`: a FAT boot partition and
an ext4 root partition).

## Pipeline shape

Two jobs. They hand each other files as workflow artifacts (tarred, since artifacts drop
permissions and symlinks), so "re-run failed jobs" reuses everything that already
succeeded. The vendor SDK is not built: nothing in the 6.18 image comes from its stock
image.

- **`build-buildroot`**: runs `scripts/build-buildroot-6x-image.sh toolchain` first, which
  configures Buildroot and builds only its cross-compiler (GCC 14.4) and musl 1.2.6. That one
  toolchain then builds the Sophgo middleware (`scripts/build-sdk-middleware.sh`), and, after
  `scripts/stage-sg2002-sdk.sh` has staged its headers, sample code and the patched LT6911
  driver, `libkvm_mmf.so` with plain CMake
  (`support/sg2002/CMakeLists.txt`, `scripts/build-sg2002-native.sh`). That script checks the
  stack protector, full RELRO, no RPATH, the T-Head scalar extensions and no vector code, and
  that `libkvm_mmf.so` exports exactly its map, which covers what the server binds. The Rust
  server links against the fresh `libkvm_mmf` and against `libc.so` and the
  headers from the sysroot of Buildroot's compiler, the same musl it runs on. The job then runs
  `scripts/build-buildroot-6x-image.sh build` in the same output directory: Buildroot without
  the post-image step, followed by checks on the result (the kernel
  release string and patches 0001-0007, `DEVMEM` off, signed modules only, lockdown and the memory-safety
  options in the kernel `.config`, a signature on every `.ko`, no `devmem` in BusyBox, U-Boot's `BOOTDELAY=0` and its TRNG seed options,
  the 11 modules in
  `/lib/modules/6.18.29/extra`, Buildroot's `libstdc++` and `libgcc_s` in `/usr/lib` and no
  GCC runtime, OpenCV or `libgomp` in `dl_lib`, a `libsys.so` that maps through
  `/dev/cvi-sys` and not `/dev/mem`, the `sg2002-hnanokvm-sd` target and
  kernel version in `system-version.json`, `scripts/validate-nanokvm-rootfs.sh`, and
  `scripts/validate-6x-rootfs.sh`: BusyBox not setuid, every account but root locked and root
  locked until the first setup, no empty SSH passwords, the pinned filesystem UUID, required and
  forbidden packages, the Avahi limits, musl built for the T-Head extensions, and the installed init scripts matching the packaged ones). It
  uploads the native build for inspection and a handoff for the next job: the images, the host tools without the cross
  toolchain, `gen_init_cpio`, the initramfs binaries and `SOURCE_DATE_EPOCH`. The compiler
  cache (2 GB) and the download cache are saved even when the build fails.
- **`assemble-image`** (`needs: build-buildroot`): runs `post-image.sh` from the handoff
  (`build-buildroot-6x-image.sh assemble`), checks the boot partition (three FIPs,
  `boot.scr`, `boot.itb`, `ver`) and the FIT (LZ4 kernel, DTB, initramfs), packages the
  system-update archive with `scripts/package-local-system-update.sh`, and compresses the
  image. It can be rerun alone, so a late failure does not cost the Buildroot hour.

All jobs run in the `sg2002-image-build-6x` concurrency group
(`cancel-in-progress: false`): dispatches queue rather than race.

### What the 6.18 build sources differently from the removed 5.10 pipeline

| Content | 5.10 pipeline | 6.18 pipeline |
| --- | --- | --- |
| Toolchain for kernel and modules | `sophgo/host-tools` GCC | Buildroot's own musl GCC |
| Kernel | vendor 5.10 rehydrated to 5.10.265 from `git.kernel.org` stable | Linux 6.18.29 from kernel.org through Buildroot, licheerv patches plus 0001-0007 |
| Kernel modules | 57 in-tree, external and media modules into the `/mnt/system/ko` skeleton | built in except the 11 media modules (`hardened-soph-media`) and the Wi-Fi/BT modules |
| FSBL, OpenSBI, U-Boot | vendor SDK stock build (U-Boot 2021.10) | FSBL from `sophgo/fsbl`, OpenSBI 1.8.1 and U-Boot 2025.10 from Buildroot |
| Boot payload | `boot.sd` | `boot.scr` and the verified FIT `boot.itb` |
| Media middleware and `libkvm` | `build-native-libkvm`, T-Head GCC 10.2 | Buildroot's GCC 14.4, in `build-buildroot` |
| GCC runtime | `vendor-sdk-stock` | Buildroot's, in `/usr/lib` |
| `libsns_lt6911.so` | `vendor-sdk-stock` | not shipped: nothing loads it |

The FIPs hold no vendor blob: Sophgo's FSBL sets up the DDR from its own source and no
longer packs `ddr_param.bin`. The board's memory map, `cvi_board_memmap.h` in the
`hardened-sg2002-fip` package, holds the seven addresses our BL2 build reads, taken from the
LicheeRV Nano SDK's `memmap.py`; the 5.10 carveouts (ION, ISP, boot logo) are left out.

## The 5.10 pipeline (removed)

The 5.10 workflow, `.github/workflows/system-image.yml`, was removed on 2026-11-13 with the
rest of the 5.10 build (its defconfig, scripts and `support/sg2002/kernel/5.10.265`); git
history keeps them. It had six jobs: `vendor-sdk-source`, `vendor-sdk`,
`build-native-libkvm`, `build-kernel` (the rehydrated 5.10.265 kernel), `build-modules`
(57 modules checked against the kernel's vermagic and `System.map` with `depmod -e`) and
`build-image` (Buildroot, the `kvmapp` bridge, rootfs, boot FIT and recovery-SD image).
Its artifact was `sg2002-recovery-sd-image` with `hardened-sg2002-port.img.xz`. The rest of
this page records how that pipeline stopped depending on published artifacts; the 6.18
pipeline inherits the result. Files it names that only the 5.10 build used are gone.

## Why this exists

The originally published `hardened-system-0.3.0-raw.12` release (and the
system-image releases before it) were built locally by the maintainer and
never had a CI job behind them -- `woffko/Hardened_NanoKVM` ships the build
scripts but no workflow invokes them (confirmed: its only workflow is an
unrelated issue-tracker webhook). Fixing the two missing CLI tools
(`nano`, `wg`) that started this work could have meant just patching the
published image. Instead, the goal became rebuilding the whole system from
source in CI so a result can be checked, not just claimed -- if this project
ever proposes an upstream PR, a maintainer should be able to see the
rebuild run clean rather than trust it blindly.

That goal only has teeth if the CI rebuild doesn't quietly lean on the
thing it's supposed to replace. The sections below track how the 5.10
pipeline stopped depending on the published raw.12 archive, and what closed
each dependency.

## raw.12 dependency status

Everything below refers to the *published* `hardened-nanokvm-system-0.3.0-raw.12.tar.gz`
system archive specifically -- not the separate `kvmapp` app-package
archive, which retains one deliberate exception (see "Explicitly out of
scope" below). **The pipeline no longer fetches this archive at all.**

### Closed

| Content | How it's sourced now | Evidence |
| --- | --- | --- |
| All kernel modules (in-tree, external and media; the manifests list them and `scripts/expected-module-count.sh` adds them up) | Rebuilt from source: in-tree modules from this pipeline's own kernel build; the video, codec and other `interdrv` modules (including the media modules) from public `sophgo/osdrv` at `SOPHGO_OSDRV_SHA` with the `sophgo-osdrv-1b3a496-*.patch` set; WiFi/BT/touch (`3rd/`) from the vendor SDK's `osdrv/extdrv` | `support/sg2002/kernel/5.10.265/manifests/external-modules.txt`; workflow steps "Fetch public sophgo/osdrv source" through "Substitute freshly-built modules into the runtime staging dir" |
| `libkvm_mmf.so` | Built from source in the `build-buildroot` job: `support/sg2002` with plain CMake and Buildroot's own GCC 14.4 (the toolchain that builds the rootfs), at `-O2`. `libkvm_mmf.so` compiles in the vendor SDK's LT6911 driver with the chip-ID probe removed, starts capture without the ISP and links no ISP/3A library. MaixCDK's camera, image and I2C layers are gone, and so is `libkvm.so`: the Rust backend links `libkvm_mmf.so` directly. Never depended on raw.12 either way | `scripts/build-sg2002-native.sh`; `server-rust/scripts/build-linked-libkvm.sh` |
| OpenCV (`core`/`highgui`/`imgcodecs`/`imgproc`, and `video`/`dnn`/`calib3d`/`features2d`/`flann`/`protobuf` before them) | No longer shipped: only MaixCDK's image class used OpenCV, and nothing links it any more. `libgomp` went with them (only `opencv_core` needed it) | `support/sg2002/CMakeLists.txt` |
| `/mnt/system/usr/bin` (49 CVITEK sample/test binaries) | Deleted entirely -- no static or `dlopen()` reference anywhere in tracked source | `server-rust/native/README.md` ("/mnt/system/usr") |
| `/mnt/system/usr/lib` minus one file (32 files incl. `3rd/`) | Deleted entirely -- proven redundant against `dl_lib`'s search-path priority | same |
| `libsys.so`, `libvenc.so`, `libvdec.so`, `libvi.so`, `libvpss.so`, `libvo.so`, `libgdc.so`, `librgn.so`, `libini.so` | Built from source in `build-buildroot` with Buildroot's GCC: public `sophgo/cvi_mpi` at `SOPHGO_CVI_MPI_SHA` (the same Sophgo release as the kernel modules), with its own flags but `-O2` instead of `-Os` and the T-Head scalar extensions and `support/sg2002/middleware-patches/`, by `scripts/build-sdk-middleware.sh`. The old `libvpu.so` is split into `libvi`/`libvpss`/`libvo`/`libgdc`/`librgn` and no longer ships. The sensor enum and names come from `sophgo/SensorSupportList` at `SOPHGO_SENSOR_LIST_SHA`. `libkvm_mmf.so` links against them, compiles against the same release's headers and sample code, and the image ships them | workflow steps "Fetch the Sophgo middleware source" through "Stage the headers, sample code and LT6911 driver for libkvm_mmf" |
| The ~19 other CVI/audio middleware libraries `dl_lib` carried (`libcvi_*`, `libaac*`, `libcli.so`, etc.) and the 8 closed ISP/3A libraries (`libisp*`, `libae`/`af`/`awb`, `libcvi_bin*`, `libcvi_ispd2`) | Removed: nothing loads them. The image build fails unless `dl_lib` holds exactly `libkvm`, `libkvm_mmf` and the nine source-built middleware libraries | `scripts/build-buildroot-6x-image.sh`; `server-rust/native/README.md` ("dl_lib's prebuilt middleware") |
| GCC runtime libs (`libstdc++`, `libgcc_s`) | Buildroot installs its own into `/usr/lib`, from the GCC that builds `libkvm` and the middleware. The T-Head GCC 10.2 copies (`libstdc++.so.6.0.28`, `libgcc_s.so.1`, `libatomic.so.1.2.0`) that `dl_lib` carried are gone, and the build fails if `dl_lib` ships any GCC runtime library. The vendor `libc.so` is no longer shipped: musl's loader serves `libc.so` itself | `scripts/build-buildroot-6x-image.sh` |
| T-Head musl loader (`ld-musl-riscv64xthead.so.1`) | No longer shipped: its riscv64 `__clone` misaligns thread stacks, so everything runs on Buildroot's musl 1.2.6 loader ([riscv64 thread stack alignment](riscv-musl-stack-alignment.md)) | same |
| `libsns_lt6911.so` (LT6911 HDMI sensor plugin) | Sourced from `vendor-sdk-stock` too, from real checked-in C source in the pinned vendor SDK commit (`middleware/v2/component/isp/sensor/cv182x/lontium_lt6911/`, `sg200x` symlinked to `cv182x`). No longer byte-identical to an unmodified vendor build, deliberately: `vendor-sdk-patches/lt6911-sensor-id-probe-removed.patch` removes the chip-ID probe, which never succeeds on this board while HDMI capture works without it. The other files `vendor-sdk-stock` produces are untouched, except `fip.bin` (next row) | `server-rust/native/README.md` ("libc.so, GCC runtime, loaders, and libsns_lt6911.so"); `buildroot-external/hardened-sg2002/board/sg2002/vendor-sdk-patches/lt6911-sensor-id-probe-removed.patch` |
| `fip.bin`, `fip.std.bin`, `fip.od.bin` (FSBL, OpenSBI, U-Boot) | `vendor-sdk-stock` builds with `vendor-sdk-patches/fsbl-overdrive-clocks.patch`, which sets `CONFIG_OD_CLK_SEL=y` in the board defconfig: the FSBL's overdrive table runs the C906 at 1050 MHz instead of 850 MHz, the video encoder at 515 MHz instead of 396 MHz, and raises VDDC from 0.96 V to 1.00 V. That build is kept as `fip.od.bin`; `build-vendor-sdk-stock.sh` then rebuilds only the FSBL with `CONFIG_OD_CLK_SEL=n` for the standard-clock `fip.bin`. The boot partition carries both, plus `fip.std.bin` as the standard copy; the server copies one over `fip.bin` (Settings > System > Performance). New images boot with standard clocks. System updates ship all three | `fsbl/plat/cv181x/platform.c` (`sys_pll_od`) in the pinned vendor SDK; `scripts/build-vendor-sdk-stock.sh`; `buildroot-external/hardened-sg2002/board/sg2002/vendor-sdk-patches/fsbl-overdrive-clocks.patch` |

**No file shipped in the final image still comes from raw.12.** The
kernel/rootfs closure work, the `dl_lib` middleware closure, and this last
round together account for every file the pipeline ever pulled from it.

### `kvm_system`: replaced by the server's front panel

`kvm_system` used to be the one exception: it was taken from the published
`kvmapp` app-package archive (`hardened-nanokvm-kvmapp-2.0.42.tar.gz`), because
the maintainer's build carried the 26 native-audit fixes and rebuilding it
needed MaixCDK, which the pipeline did not have. It was then built from source,
first with MaixCDK, later as a plain CMake target. Now it is gone: the OLED, the
button and the Wi-Fi setup are a thread of the Rust server (`server-rust/src/front_panel`),
checked against goldens recorded from the C++ program.

Nothing we build uses the vector extension (XTheadVector). The native code
and the middleware are compiled by Buildroot's GCC 14.4 with the same
`-march` as musl (`rv64gc` plus `xtheadba`, `xtheadbb`, `xtheadbs`,
`xtheadcondmov`, `xtheadmemidx`, `xtheadmempair`, `xtheadmac`) and
`-mtune=thead-c906`. Buildroot builds musl with the same T-Head scalar extensions as the
Rust server (`MUSL_EXTRA_CFLAGS` in `buildroot-external/hardened-sg2002/external.mk`),
and the rootfs validator checks `/usr/lib/libc.so`'s architecture tag; the rest of
Buildroot's userspace is plain `rv64gc`. Under QEMU's C906 model this musl runs
25–36% fewer instructions in `memcpy`, `memmove` and `memset` on 4 KB and larger
buffers, and 5–15% fewer in `malloc`, `qsort`, `strcmp` and `strlen`.
An audit of the image before this change found vector instructions
only in the vector loader's `memcpy`, used by `kvm_system` alone; on the scalar
loader `kvm_system` used the same CPU (7 vs 8 ticks per minute).

The pipeline downloads no published Hardened artifact at all.

### The module-tree structure: closed too, no image needed at all

The kernel module *paths* (some nest under `3rd/`) used to come from
raw.12's own `system/ko/` tree, purely so the pipeline knew where each
freshly-rebuilt `.ko` belonged -- module content itself was never sourced
from raw.12 once the kernel-module rebuild work closed that gap. This
turned out not to need any image at all:
`support/sg2002/kernel/5.10.265/manifests/external-modules.txt` already
encodes the full destination path for every external module (`3rd/`
included), `in-tree-modules.txt` gives the in-tree ones, and
`media-modules.txt` the media ones -- the complete structure,
entirely from files already tracked in this repo. `system-image.yml`
now builds this as an empty-file skeleton straight from the manifests, no
network fetch involved; `hardened-source-media-provenance.txt` is
regenerated from already-pinned values the same way.

**raw.12 is no longer fetched anywhere in this pipeline.** One
diagnostic, not a structural or content dependency worth keeping, was
removed while closing this: the old local `soph_vc_driver.ko` build script
(since retired with the rest of the mixed codec chain) used to diff `soph_vc_driver.ko`'s module parameters against an "old"
reference copy pulled from raw.12 -- a real comparison, since `modinfo`
needs an actual valid module, not something a placeholder could satisfy.
That comparison is gone rather than kept as a narrower exception.

## Verification methodology

Every claim above is backed by one of:

- **Byte-for-byte comparison** (`cmp`/`sha256sum`) between a candidate
  source and raw.12's shipped copy, not just matching filenames/sizes.
- **Exhaustive symbol-table analysis** (`readelf --dyn-syms`) for the
  `libkvm.so` OpenCV dependency removal, checking every undefined symbol
  against every candidate export set.
- **`dlopen()` reference search** across every native binary and every
  tracked script, for content removed on the basis of "nothing references
  it."
- **SHA-256 pinning** throughout the workflow and in the 5.10 rootfs
  validator (`scripts/validate-latest-buildroot-sg2002-rootfs.sh`, removed with
  the 5.10 build), which re-checked final image content against pinned hashes
  regardless of which step produced it.

Dead ends are documented, not silently dropped: the public
`sophgo/host-tools` cross-toolchain repo was tried for both the loaders and
`libc.so` before `vendor-sdk-stock` was tried -- it's a generic
cross-toolchain build (unstripped, wrong size), not the vendor's on-device
runtime build, and that negative result is recorded in
`server-rust/native/README.md` alongside the positive ones so it isn't
re-attempted.

## External dependency audit

Every external source the 6.18 build fetches, all pinned to a commit or a release:

| External source | What it provides |
| --- | --- |
| `buildroot.org` | The Buildroot release, and through it the cross-compiler (GCC 14.4, musl 1.2.6) that builds the whole image, native code included, and the Linux 6.18 source from kernel.org |
| `lone0/buildroot-external-licheervnano` | The licheerv patch series and board files for Linux 6.18 |
| `sophgo/fsbl` | The FSBL source |
| `sipeed/LicheeRV-Nano-Build` | The LT6911 sensor driver `libkvm_mmf.so` compiles in |
| `sophgo/osdrv` and `sophgo/cvi_mpi` (one dated release) | The media kernel modules and the middleware libraries; one release for both keeps the user/kernel structs consistent |
| `sophgo/SensorSupportList` | The sensor list the middleware build needs |

No toolchain is downloaded on its own: `sophgo/host-tools`, MaixCDK and the T-Head GCC are
gone (2026-11-15). The 5.10 pipeline's audit, with `host-tools` and the `git.kernel.org` 5.10
rehydration, is in git history.

## Related documents

- [`server-rust/native/README.md`](../../server-rust/native/README.md) -- the
  detailed per-file evidence this document summarizes.
- [`vendor-sdk-build.md`](../archive/vendor-sdk-build.md) -- how `make vendor-sdk-stock`
  itself works and what it produces.
- [`latest-buildroot-port.md`](../archive/latest-buildroot-port.md) -- a separate,
  earlier effort: the historical hardware-acceptance log for porting to
  official Buildroot with physical device testing (raw.1 through raw.10).
  This document's CI-rebuild work is downstream of that port already having
  landed as raw.11/raw.12; it does not repeat that acceptance testing.
