---
status: current
applies-to: system 1.0.0 / app 3.0.0 (Linux 6.18)
last-checked: 2026-11-11
source: .github/workflows/system-image-6x.yml
---

# CI image build

## Run it

```sh
gh workflow run system-image-6x.yml --ref <branch>
```

The run takes a few hours. When it finishes:

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

`system-image.yml` still builds the vendor 5.10 image. It is kept only until the 6.18
channel is stable ([migration plan](kernel-6x-migration-plan.md), Phase 6) and is described
under [The 5.10 pipeline](#the-510-pipeline).

## What it builds

`.github/workflows/system-image-6x.yml` builds the SD image from source on
`ubuntu-latest`, `workflow_dispatch` only. One Buildroot tree, configured from
`hardened_sg2002_nanokvm_6x_defconfig` with two external trees (this repository's
`buildroot-external/hardened-sg2002` and the pinned licheerv tree fetched by
`scripts/fetch-licheerv-external.sh`), builds:

- the musl toolchain and the userland;
- Linux 6.18.29 with licheerv's patch series and our board patches 0001-0003, configured from
  `board/sg2002/linux-6.18/nanokvm_defconfig` plus `nanokvm.fragment`, and the
  `sg2002-nanokvm-lite.dts` device tree;
- the 11 Sophgo media modules (`hardened-soph-media`, `sophgo/osdrv` at `SOPHGO_OSDRV_SHA`);
- OpenSBI 1.8.1, U-Boot 2025.10, and the FSBL from the pinned LicheeRV Nano SDK, packed into
  `fip.std.bin` and `fip.od.bin` (`hardened-sg2002-fip`; `fip.bin` is a copy of the standard
  one);
- the root filesystem with the `kvmapp` package.

`board/sg2002/linux-6.18/post-image.sh` then packs the boot FIT (`boot.itb`: LZ4 kernel,
DTB and the recovery initramfs, each with a SHA-256 hash U-Boot checks), `boot.scr`, the
32 MiB boot partition and `hardened-sg2002-6x.img` (`genimage.cfg`: the same two partitions
as the 5.10 image, so the raw updater can write both).

## Pipeline shape

Three jobs. Jobs hand each other files as workflow artifacts (tarred, since artifacts drop
permissions and symlinks), so "re-run failed jobs" reuses everything that already
succeeded. The vendor SDK is not built: nothing in the 6.18 image comes from its stock
image.

- **`build-native-libkvm`**: builds the Sophgo middleware, `libkvm.so`, `libkvm_mmf.so`
  and `kvm_system` with the toolchain MaixCDK pins (Xuantie GCC 10.2, musl), as described
  under [`kvm_system`](#kvm_system-built-from-source-too). `scripts/stage-maixcdk-runtime.sh`
  then takes the four GCC runtime libraries and the link-time `libc.so` from the same
  toolchain (plain `rv64gc` `lp64d`, stripped). The runtime libraries are pinned by hash to
  the stock vendor image's copies, which they match byte for byte.
- **`build-buildroot`** (`needs: build-native-libkvm`): builds the Rust server
  against the fresh `libkvm`, then runs `scripts/build-buildroot-6x-image.sh build`:
  Buildroot without the post-image step, followed by checks on the result (the kernel
  release string and patches 0001-0003, the 11 modules in
  `/lib/modules/6.18.29/extra`, the GCC runtime in `dl_lib`, the `sg2002-hnanokvm-sd` target and
  kernel version in `system-version.json`, and `scripts/validate-nanokvm-rootfs.sh`). It
  uploads a handoff for the next job: the images, the host tools without the cross
  toolchain, `gen_init_cpio`, the initramfs binaries and `SOURCE_DATE_EPOCH`. The compiler
  cache (2 GB) and the download cache are saved even when the build fails.
- **`assemble-image`** (`needs: build-buildroot`): runs `post-image.sh` from the handoff
  (`build-buildroot-6x-image.sh assemble`), checks the boot partition (three FIPs,
  `boot.scr`, `boot.itb`, `ver`) and the FIT (LZ4 kernel, DTB, initramfs), packages the
  system-update archive with `scripts/package-local-system-update.sh`, and compresses the
  image. It can be rerun alone, so a late failure does not cost the Buildroot hour.

All jobs run in the `sg2002-image-build-6x` concurrency group
(`cancel-in-progress: false`): dispatches queue rather than race.

### What the 6.18 build sources differently

| Content | 5.10 pipeline | 6.18 pipeline |
| --- | --- | --- |
| Toolchain for kernel and modules | `sophgo/host-tools` GCC | Buildroot's own musl GCC |
| Kernel | vendor 5.10 rehydrated to 5.10.265 from `git.kernel.org` stable | Linux 6.18.29 from kernel.org through Buildroot, licheerv patches plus 0001-0003 |
| Kernel modules | 57 in-tree, external and media modules into the `/mnt/system/ko` skeleton | built in except the 11 media modules (`hardened-soph-media`) and the Wi-Fi/BT modules |
| FSBL, OpenSBI, U-Boot | vendor SDK stock build (U-Boot 2021.10) | FSBL from the SDK source, OpenSBI 1.8.1 and U-Boot 2025.10 from Buildroot |
| Boot payload | `boot.sd` | `boot.scr` and the verified FIT `boot.itb` |
| Media middleware and `libkvm` | `build-native-libkvm` | same job |
| GCC runtime | `vendor-sdk-stock` | the MaixCDK toolchain (same bytes) |
| `libsns_lt6911.so` | `vendor-sdk-stock` | not shipped: nothing loads it |

`ddr_param.bin` is the one vendor blob inside the FIPs: no source exists for it anywhere,
and the SDK, licheerv and varyhin carry the same file.

## The 5.10 pipeline

`.github/workflows/system-image.yml` has six jobs: `vendor-sdk-source`, `vendor-sdk`,
`build-native-libkvm`, `build-kernel` (the rehydrated 5.10.265 kernel), `build-modules`
(57 modules checked against the kernel's vermagic and `System.map` with `depmod -e`) and
`build-image` (Buildroot, the `kvmapp` bridge, rootfs, boot FIT and recovery-SD image).
Its artifact is `sg2002-recovery-sd-image` with `hardened-sg2002-port.img.xz`. The rest of
this page records how that pipeline stopped depending on published artifacts; the 6.18
pipeline inherits the result.

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
| `libkvm.so` / `libkvm_mmf.so` | Built from source by the `build-native-libkvm` job: `support/sg2002` compiled with a pinned MaixCDK and its musl toolchain (the LT6911 chip-ID probe removed). The video-path components (`kvm`, `kvm_mmf`, `vision`) build at `-O2`; the rest keeps MaixCDK's `MinSizeRel` (`-Os`). `libkvm_mmf.so` starts LT6911 capture without the ISP and links no ISP/3A library. The Rust backend links against the result. Never depended on raw.12 either way | job `build-native-libkvm`; `server-rust/scripts/build-linked-libkvm.sh` |
| 4 OpenCV modules (`core`/`highgui`/`imgcodecs`/`imgproc`) | Sourced from `sipeed/NanoKVM` upstream (GPL-3.0), verified near-byte-identical (same MaixCDK toolchain build) | workflow step "Source OpenCV core/highgui/imgcodecs/imgproc from upstream"; `server-rust/native/README.md` |
| 6 OpenCV/protobuf modules (`video`/`dnn`/`calib3d`/`features2d`/`flann`/`protobuf`) | Deleted entirely -- proven via exhaustive symbol-table analysis that `libkvm.so` calls nothing from them, after a `patchelf --remove-needed` patch | `server-rust/native/README.md` ("libkvm.so: removed video NEEDED entry") |
| `/mnt/system/usr/bin` (49 CVITEK sample/test binaries) | Deleted entirely -- no static or `dlopen()` reference anywhere in tracked source | `server-rust/native/README.md` ("/mnt/system/usr") |
| `/mnt/system/usr/lib` minus one file (32 files incl. `3rd/`) | Deleted entirely -- proven redundant against `dl_lib`'s search-path priority | same |
| `libsys.so`, `libvenc.so`, `libvdec.so`, `libvi.so`, `libvpss.so`, `libvo.so`, `libgdc.so`, `librgn.so`, `libini.so` | Built from source in `build-native-libkvm`: public `sophgo/cvi_mpi` at `SOPHGO_CVI_MPI_SHA` (the same Sophgo release as the kernel modules), with its own flags but `-O2` instead of `-Os` and `support/sg2002/middleware-patches/`, by `scripts/build-sdk-middleware.sh`. The old `libvpu.so` is split into `libvi`/`libvpss`/`libvo`/`libgdc`/`librgn` and no longer ships. Together they must keep every export of the checked-in prebuilts, except 13 listed in the script that were removed upstream and that nothing we ship uses. The sensor enum and names come from `sophgo/SensorSupportList` at `SOPHGO_SENSOR_LIST_SHA`. `libkvm_mmf.so` links against them, compiles against the same release's headers and sample code, and the image ships them | workflow steps "Fetch the Sophgo middleware source" through "Replace MaixCDK's middleware headers with the cvi_mpi ones" |
| ~19 other CVI/audio middleware libraries in `dl_lib` (`libcvi_*`, `libaac*`, `libcli.so`, etc.). The 8 closed ISP/3A libraries (`libisp*`, `libae`/`af`/`awb`, `libcvi_bin*`, `libcvi_ispd2`) are removed | Already checked into `server-rust/native/dl_lib` since before this fork tracked raw.12 at all; diffed byte-for-byte against raw.12 and confirmed identical; the CI pipeline no longer extracts them from raw.12 | `server-rust/native/README.md` ("dl_lib's CVI/ISP/audio middleware") |
| 4 GCC runtime libs (`libstdc++.so.6.0.28`, `libgcc_s.so.1`, `libgomp.so.1.0.0`, `libatomic.so.1.2.0`) | Sourced from this pipeline's own `vendor-sdk-stock` build instead -- verified byte-identical on a real run. The vendor `libc.so` is no longer shipped: musl's loader serves `libc.so` itself | workflow step "Source the remaining runtime files from our own vendor-sdk-stock build"; `server-rust/native/README.md` |
| T-Head musl loader (`ld-musl-riscv64xthead.so.1`) | No longer shipped: its riscv64 `__clone` misaligns thread stacks, so everything runs on Buildroot's musl 1.2.6 loader ([riscv64 thread stack alignment](riscv-musl-stack-alignment.md)) | same |
| `libsns_lt6911.so` (LT6911 HDMI sensor plugin) | Sourced from `vendor-sdk-stock` too, from real checked-in C source in the pinned vendor SDK commit (`middleware/v2/component/isp/sensor/cv182x/lontium_lt6911/`, `sg200x` symlinked to `cv182x`). No longer byte-identical to an unmodified vendor build, deliberately: `vendor-sdk-patches/lt6911-sensor-id-probe-removed.patch` removes the chip-ID probe, which never succeeds on this board while HDMI capture works without it. The other files `vendor-sdk-stock` produces are untouched, except `fip.bin` (next row) | `server-rust/native/README.md` ("libc.so, GCC runtime, loaders, and libsns_lt6911.so"); `buildroot-external/hardened-sg2002/board/sg2002/vendor-sdk-patches/lt6911-sensor-id-probe-removed.patch` |
| `fip.bin`, `fip.std.bin`, `fip.od.bin` (FSBL, OpenSBI, U-Boot) | `vendor-sdk-stock` builds with `vendor-sdk-patches/fsbl-overdrive-clocks.patch`, which sets `CONFIG_OD_CLK_SEL=y` in the board defconfig: the FSBL's overdrive table runs the C906 at 1050 MHz instead of 850 MHz, the video encoder at 515 MHz instead of 396 MHz, and raises VDDC from 0.96 V to 1.00 V. That build is kept as `fip.od.bin`; `build-vendor-sdk-stock.sh` then rebuilds only the FSBL with `CONFIG_OD_CLK_SEL=n` for the standard-clock `fip.bin`. The boot partition carries both, plus `fip.std.bin` as the standard copy; the server copies one over `fip.bin` (Settings > System > Performance). New images boot with standard clocks. System updates ship all three | `fsbl/plat/cv181x/platform.c` (`sys_pll_od`) in the pinned vendor SDK; `scripts/build-vendor-sdk-stock.sh`; `buildroot-external/hardened-sg2002/board/sg2002/vendor-sdk-patches/fsbl-overdrive-clocks.patch` |

**No file shipped in the final image still comes from raw.12.** The
kernel/rootfs closure work, the `dl_lib` middleware closure, and this last
round together account for every file the pipeline ever pulled from it.

### `kvm_system`: built from source too

`kvm_system` used to be the one exception: it was taken from the published
`kvmapp` app-package archive (`hardened-nanokvm-kvmapp-2.0.42.tar.gz`), because
the maintainer's build carried the 26 native-audit fixes and rebuilding it
needed MaixCDK, which the pipeline did not have. Once the `build-native-libkvm`
job brought MaixCDK in for `libkvm`, the same job could run `./build kvm_system`.
It now does, strips the build-host RPATH, sets its interpreter to Buildroot's musl
1.2.6 loader `/lib/ld-musl-riscv64.so.1`, and checks that it has no `v0p7` in its
architecture tag and needs only `libstdc++`, `libgcc_s` and `libc`.

Nothing we build uses the vector extension (XTheadVector). The MaixCDK projects
and the middleware are compiled with `-mcpu=c906fd -march=rv64imafdcxthead`
instead of `c906fdv`/`v0p7`, and link against the scalar `lib64xthead`
multilib. Buildroot builds musl with the same T-Head scalar extensions as the
Rust server (`MUSL_EXTRA_CFLAGS` in `buildroot-external/hardened-sg2002/external.mk`),
and the rootfs validator checks `/usr/lib/libc.so`'s architecture tag; the rest of
Buildroot's userspace is plain `rv64gc`. Under QEMU's C906 model this musl runs
25–36% fewer instructions in `memcpy`, `memmove` and `memset` on 4 KB and larger
buffers, and 5–15% fewer in `malloc`, `qsort`, `strcmp` and `strlen`.
An audit of the image before this change found vector instructions
only in the vector loader's `memcpy`, used by `kvm_system` alone; on the scalar
loader `kvm_system` used the same CPU (7 vs 8 ticks per minute).

Before switching, a one-off workflow built `kvm_system` from the RC10 source
(`26a2986`) with the same pins: every code and data section matched the
published 2.0.42 binary byte for byte; only an `$ORIGIN/dl_lib` RPATH differed,
which the job strips. The current source differs from RC10 only by sipeed's
shared VI-state reader, so the image now ships both halves of that port. With
this, the pipeline downloads no published Hardened artifact at all.

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
- **SHA-256 pinning** throughout the workflow and in
  `scripts/validate-latest-buildroot-sg2002-rootfs.sh`, which re-checks
  final image content against pinned hashes regardless of which step
  produced it.

Dead ends are documented, not silently dropped: the public
`sophgo/host-tools` cross-toolchain repo was tried for both the loaders and
`libc.so` before `vendor-sdk-stock` was tried -- it's a generic
cross-toolchain build (unstripped, wrong size), not the vendor's on-device
runtime build, and that negative result is recorded in
`server-rust/native/README.md` alongside the positive ones so it isn't
re-attempted.

## External dependency audit

Closing raw.12 could have quietly traded one external dependency for
another unnecessary one. Auditing every non-raw.12 external fetch this
pipeline makes, against whether the already-cloned vendor SDK could have
supplied the same content instead:

| External source | What it provides | Redundant with the vendor SDK? |
| --- | --- | --- |
| `sophgo/host-tools` | The actual riscv64 cross-compiler toolchain, used to build the kernel and every kernel module | No -- this is the compiler itself; a prebuilt rootfs can't substitute for a toolchain. Confirmed by grepping every script that references it: all of them use `TOOLCHAIN_BIN=.../host-tools/gcc/riscv64-linux-musl-x86_64/bin` to invoke `gcc`/`ld`/`strip` directly. |
| `sipeed/NanoKVM` upstream | 4 OpenCV modules (`core`/`highgui`/`imgcodecs`/`imgproc`) | No -- confirmed by reading the historical local runtime-extraction script (since removed) that originally extracted content from `vendor-sdk-stock`'s own rootfs: its own OpenCV set is `video`/`dnn`/`calib3d`/`features2d`/`flann`/`protobuf` at `/usr/lib/` -- exactly the 6 modules already proven unused and deleted, not the 4 this pipeline needs. `vendor-sdk-stock` never had the right OpenCV variant. |
| `sophgo/osdrv` and `sophgo/cvi_mpi` (public, one dated release) | Every `interdrv` kernel module and the five middleware libraries | No -- one release for both keeps the user/kernel structs and the shared `struct cvi_buffer` consistent; the vendor SDK's copies are an older snapshot of the same tree. |
| `git.kernel.org` stable tree | Real upstream Linux 5.10.265 fixes for the kernel rehydration | Not applicable -- the whole point is pulling genuine upstream fixes the vendor's own kernel snapshot doesn't have. |
| `buildroot.org` | The Buildroot release tarball itself | Not applicable -- an unrelated upstream project, not vendor SDK content. |

One narrower finding, since fixed: `build-linked-libkvm.sh` used to link
`libkvm.so` against `sophgo/host-tools`' own `libc.so`/`libgcc_s.so.1`
sysroot copies -- the same files independently confirmed elsewhere in this
pipeline to *not* be the on-device runtime build. It worked in practice
(linking only needs matching symbol tables, not byte-identical content),
but meant linking and runtime used two different sources for the same
files. `vendor-sdk-stock`'s rootfs.sd is available from the start of the
`build-image` job (the same cache restored early on), so no reordering was
actually needed -- `scripts/extract-vendor-sdk-stock-file.sh` now extracts
the sysroot copies the same way the runtime files are extracted later,
and both steps share that one script instead of duplicating the
probe-multiple-candidate-paths logic.

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
