# NanoKVM Native Runtime Assets

This directory contains the native NanoKVM runtime pieces used by the Rust
backend.

- `dl_lib/` is not in git. CI fills it with that run's builds of `libkvm`, `libkvm_mmf` and
  the nine middleware libraries; the server links against them and the package installs them
  as `/kvmapp/server/dl_lib`, and the image build fails unless it holds exactly those. For a
  local device build, copy `libkvm.so` and `libkvm_mmf.so` from a device or a CI run into it.
- `include/` contains the C ABI header used by the Rust FFI bindings.

The corresponding native sources are under `support/sg2002/additional/kvm` and
`kvm_mmf`, built with plain CMake (`support/sg2002/CMakeLists.txt`,
[cross-build](../../docs/development/cross-build.md)). The Rust FFI mutex serializes calls made
by Rust, but native capture/detection threads still have their own lifecycle.
Known native lifecycle, VENC, bounds, and hardware-error findings are tracked in
[`docs/native-code-audit.md`](../../docs/archive/native-code-audit.md).

The Rust server is the only supported backend for these runtime assets.

Sections below that name `system-image.yml`, `vendor-sdk-stock` or `support/sg2002/kernel/5.10.265`
describe the 5.10 build, removed on 2026-11-13; git history keeps it. The 6.x workflow,
`system-image-6x.yml`, builds the native code in its `build-buildroot` job with Buildroot's GCC.

## No OpenCV

`libkvm.so` used to link MaixCDK's camera, image and I2C classes, and through the image
class four OpenCV modules (`core`, `imgcodecs`, `imgproc`, `highgui`; `libgomp` came with
`core`), after six others (`video`, `dnn`, `calib3d`, `features2d`, `flann`, `protobuf`) had
been dropped as unused. `libkvm` itself never called OpenCV. It now drives the VI channel
and the JPEG encoder through `libkvm_mmf.so` directly (`src/kvm_capture.cpp`) and talks to
the LT6911 over i2c-dev, and the image ships no OpenCV library.

## libkvm_mmf.so statically embeds its own copy of the LT6911 driver

The LT6911 patch applied to `vendor-sdk-stock`'s checkout of
`sipeed/LicheeRV-Nano-Build`
(`buildroot-external/hardened-sg2002/board/sg2002/vendor-sdk-patches/lt6911-sensor-id-probe-removed.patch`)
does not reach the code actually driving HDMI capture by itself. `libkvm_mmf.so` was
built by MaixCDK
against a *second*, independent copy of the same upstream sensor source --
`sipeed/MaixCDK`'s own `components/3rd_party/sophgo-middleware/` checkout
-- compiled directly into `libkvm_mmf.so` as source, not linked against
`/mnt/system/usr/lib/libsns_lt6911.so` (confirmed: `libkvm_mmf.so`'s
`NEEDED` entries don't include it, and the compiled-in `__FILE__` string
in `libkvm_mmf.so` points at `.../MaixCDK/components/3rd_party/...`, not
the vendor-sdk-stock path). Diffed MaixCDK's copy of `lt6911_sensor_ctl.c`
against vendor-sdk-stock's: byte-for-byte identical, same probe. `/mnt/system/usr/lib/libsns_lt6911.so` is real and
correctly patched, but nothing in the running process tree (`kvm_system`,
`libkvm.so`, `libkvm_mmf.so`) loads it.

`.github/workflows/system-image-6x.yml`'s `build-buildroot` job
builds `libkvm.so`/`libkvm_mmf.so` from this repository's own
`support/sg2002/additional/` sources instead of reusing the
prebuilt app 2.0.42 archive copies. Since MaixCDK left the build,
`scripts/stage-sg2002-sdk.sh` takes the driver from the pinned
`sipeed/LicheeRV-Nano-Build` commit (the same bytes as MaixCDK's copy) and applies the
patch there. Those sources carry the native changes the image relies on
(zero-copy capture, shared VI state, HDMI signal, the skipped stale-state
release on a fresh boot), and the job checks for them before building.
`woffko/Hardened_NanoKVM`'s own published `libkvm_mmf.so` still contains the
same unpatched `read sensor id error.`/`Sensor ID Mismatch!` strings.

On real hardware the chip-ID I2C read never succeeds on this board, at any
timing, while HDMI capture works without it.
`lt6911-sensor-id-probe-removed.patch` therefore removes the probe from
`lt6911_probe()` entirely (PinMux only); verified on hardware: no LT6911
errors in syslog and no boot delay.

Since 2026-11-12 the patch also drops the probe's ten `system("devmem …")` pinmux writes,
which set the MIPI RX pads (`0x0300116C`-`0x03001190`, MIPIRX4N-MIPIRX0P) to GPIO. The
Linux 6.18 DTS (`mipi-rx-pins`) sets them instead; before, it put `CAM_MCLK1` on MIPIRX0N,
a live data lane, which only these writes undid when the server started. The 5.10 image,
whose device tree does not set these pads, no longer gets them from libkvm either.

## /mnt/system/usr: pruned to the one file dl_lib doesn't cover

`/mnt/system/usr/bin` (CVITEK sample/test binaries: `sample_vcodec`,
`sample_venc`, `sample_vdec`, `ive_stress`, `sensor_test`, `test_mmf`, etc.)
and most of `/mnt/system/usr/lib` (the same CVI/ISP/audio libraries already
present in `dl_lib`, plus `libov_ov2685.so`, `libraw_replay.so`,
`libsample.so`, and 5 `libsns_*.so` sensor plugins for sensors this
hardware doesn't have -- only the LT6911 HDMI bridge is real here) look
like unpruned vendor SDK carry-forward, not load-bearing content.

Provenance: same as the loaders and `auto.sh` above -- extracted wholesale
via `debugfs rdump /mnt/system` from `make vendor-sdk-stock`'s own build
output by the old local runtime-extraction script (since removed),
frozen into the vendor-runtime staging bundle, carried forward unchanged
since.

`/etc/init.d/S95nanokvm` does wire `/mnt/system/usr/lib` and
`/mnt/system/usr/lib/3rd` into the native library search path
(`NANOKVM_NATIVE_LIBRARY_PATH`, passed to the musl loader's
`--library-path` when launching the server) -- so it's not simply
unreferenced, it's a deliberate fallback. But `/kvmapp/server/dl_lib` is checked first in that same path
and already contains every file `/mnt/system/usr/lib` and its `3rd/`
subdirectory (`libcli.so`, `libini.so`) have, except exactly the
suspect files above -- so the fallback never actually gets exercised for
anything these binaries need.

Compared the 22 overlapping libraries byte-for-byte on the same rootfs:
16 are identical between `dl_lib` and `/mnt/system/usr/lib`, but 6
(`libcvi_bin.so`, `libsys.so`, `libvdec.so`, `libvpu.so`, `libmisc.so`,
`libosdc.so`) are the same name and size but substantively different
content -- e.g. `libsys.so` differs in 38,510 of 60,472 bytes, far
beyond a timestamp/build-id difference. So `/mnt/system/usr/lib` isn't
simply "the same files copied twice"; it looks like a separate, older
snapshot of the vendor SDK's own libraries that happens to share
names/sizes with what got curated into `dl_lib`. Doesn't change the
functional conclusion (`dl_lib` still wins the search-path race
regardless of which build variant sits in the fallback), but it's a
more accurate description than "duplicate."

Checked for a `dlopen()`-style indirect reference (the one thing static
`strings`/symbol analysis can miss) in `libkvm.so`, `libkvm_mmf.so`,
`kvm_system`, and `nanokvm-hwmon`, plus every script under `/etc` and
`/kvmapp/system` and this repo's own tracked source
(`server-rust`, `web`, `support/sg2002`, `scripts`): zero genuine hits.
The one grep match (`support/sg2002/additional/sophgo-middleware/v2/sample/common/sample_common_sensor.c`)
is a false positive -- a self-referential filename comment and header
include, unrelated to the `/mnt/system/usr/bin` executables.

**Acted on, narrower than "drop it entirely."** Checking `dl_lib`'s actual
file listing against `/mnt/system/usr/lib`'s turned up one exception to
the above: `libsns_lt6911.so`, the sensor plugin for the LT6911 HDMI
bridge -- this device's one real sensor -- has no copy anywhere in
`dl_lib`, unlike every other file in `/mnt/system/usr/lib`. Deleting it
along with the rest would have risked the one thing this device actually
does (HDMI capture), for no size benefit worth that risk.

`hardened-sg2002-vendor-runtime.mk` (removed on 2026-11-15 with the T-Head toolchain)
removed `/mnt/system/usr/bin` entirely and pruned `/mnt/system/usr/lib` (including the `3rd/`
subdirectory) down to exactly `libsns_lt6911.so`. The 6.18 image has neither. Everything *removed* is
either proven redundant (shadowed by `dl_lib` in the library search order)
or has no reference anywhere in this repo's tracked source. The retained
file's own provenance is now fully resolved too -- see "libc.so, GCC
runtime, loaders, and libsns_lt6911.so" below; it no longer comes from
raw.12 either. Not yet verified on real hardware; if HDMI capture breaks
after this change, this is still the first thing to check.

## No ISP or 3A libraries

The LT6911 delivers YUV, which the VI driver routes around the ISP.
`libkvm_mmf.so` starts capture without the ISP: it sends the VI sensor info
itself (`VI_IOCTL_SET_SNR_INFO`, what `libisp` used to send) and carries its
own LT6911 sensor object and MIPI receiver calls (`src/kvm_mmf_noisp.c`).
The 8 closed ISP/3A libraries (`libisp.so`, `libisp_algo.so`, `libae.so`,
`libaf.so`, `libawb.so`, `libcvi_bin.so`, `libcvi_bin_isp.so`,
`libcvi_ispd2.so`) are no longer shipped. Checked on hardware on 2026-10-20:
capture at 1080p in Direct and MJPEG, resolution changes, replug and a cold
boot, with none of them on the library path.

## Middleware built from source

CI builds `libsys.so`, `libvenc.so`, `libvdec.so`, `libvi.so`, `libvpss.so`,
`libvo.so`, `libgdc.so`, `librgn.so` and `libini.so` from public `sophgo/cvi_mpi`
with `scripts/build-sdk-middleware.sh`. MaixCDK's prebuilt `libvpu.so` is split there
into `libvi`/`libvpss`/`libvo`/`libgdc`/`librgn`. Until 2026-11-17 the build also checked
that the source libraries kept every symbol MaixCDK's prebuilts exported; with the
prebuilts gone from git and only source builds in the image, that check went too.
The libraries, the headers and sample code `libkvm_mmf.so` compiles against,
the sensor list (`sophgo/SensorSupportList`) and every video kernel module come
from one Sophgo release (2026-08-24: `cvi_mpi` 693a72a, `osdrv` 1b3a496), so
user space and the drivers agree on every shared struct. Our changes on top:
- `libvi` never starts the VI debug thread, which ran `system("cat /proc/...")`
  on VI errors, and `libsys` maps media buffers through `/dev/cvi-sys` instead of
  `/dev/mem` (`support/sg2002/middleware-patches/`);
- the kernel side carries `/proc/lt_int` (LT6911 interrupt counter for
  `kvm_vision`), quiet VI and VPSS logging, a guard that skips DCI statistics
  on the LT6911 YUV bypass pipe, the `soph_sys` media-memory allocator that
  replaces ION, an `mmap` on `/dev/cvi-sys` limited to its buffers, video encoder
  packets kept in that carveout, and the 5.10.265 build fixes
  (`buildroot-external/hardened-sg2002/board/sg2002/kernel/patches/sophgo-osdrv-1b3a496-*.patch`).

## dl_lib's prebuilt middleware: removed

`dl_lib` used to carry about 30 prebuilt CVI, ISP and audio libraries from the vendor
image; none is left, and the directory itself left git with them. The ISP and 3A libraries went with the ISP; on 2026-11-17 the remaining 19 that
nothing loads went too (`libaac*`, `libcli`, `libcvi_RES1`, `libcvi_VoiceEngine`,
`libcvi_audio`, `libcvi_ive`, `libcvi_ssp`, `libcvi_vqe`, `libdnvqe`, `libjson-c`,
`libmipi_tx`, `libmisc`, `libosdc`, `libraw_dump`, `libtinyalsa`): no shipped library,
`kvm_system`, `nanokvm-hwmon` or the server lists or names them, and on a running Lite the
server maps only the source-built set. That was 528 KB of the 1.0 MB `dl_lib`.

## libc.so, GCC runtime, loaders, and libsns_lt6911.so: closed -- from our own build

Tried sourcing `libc.so` and the GCC runtime libs (`libstdc++.so.6.0.28`,
`libgcc_s.so.1`, `libgomp.so.1.0.0`, `libatomic.so.1.2.0`) from the public
`sophgo/host-tools` cross-toolchain repo instead of raw.12, the same way
the two T-Head loaders were tried there and rejected. Same dead end for
`libc.so`: that repo ships 4 ABI variant sysroots, and every one of the 6
candidate `libc.so` files across all of them is ~7-8x the size of raw.12's
copy (4.2-5.4 MB vs. 621 KB) -- a systematic mismatch, a generic
cross-toolchain build meant for linking against, not the vendor's
on-device runtime build. The GCC runtime libs were closer (matching
version numbers, and the `lib64v0p7_xthead` variant's RISC-V arch
attribute string is an exact match for `libkvm.so`'s own) but still
larger than raw.12's copies, apparently just carrying debug sections a
release strip would remove -- promising, but unconfirmed from that repo.

The actual answer was `make vendor-sdk-stock` (the `sg2002_licheervnano_sd`
defconfig, already built and cached by the `vendor-sdk` CI job) -- the
same real on-device build the old local runtime-extraction script
originally sourced this content from, not a generic toolchain package.
Checked all 8 remaining raw.12-only files against it on a real run: **7 are
byte-identical** -- `libc.so`, all 4 GCC runtime libs, and both T-Head
loaders (`ld-musl-riscv64xthead.so.1`, `ld-musl-riscv64v0p7_xthead.so.1`).
`system-image.yml` now sources all 7 from vendor-sdk-stock's own
`rootfs.sd` instead of raw.12, hard-failing if any isn't found (unlike the
diagnostic that discovered these paths, this is production extraction).

Update 2026-11-11 (Linux 6.18 image): the four GCC runtime libraries come from the
T-Head musl toolchain that builds libkvm, its plain `lib64/lp64d` build stripped with
`--strip-all -R .comment`. That output is byte-identical to the stock image's copies (checked
against a running Lite), and `scripts/stage-thead-runtime.sh` pinned the hashes. `libgomp`
left with OpenCV; three remain. The 6.18
image no longer ships `libsns_lt6911.so`: no process on the Lite maps it. The 5.10 pipeline
still takes all of these from `vendor-sdk-stock`.

Update 2026-11-15: the three GCC runtime libraries no longer ship in `dl_lib`. Buildroot's
GCC now builds the native code, and Buildroot installs its own `libstdc++` and `libgcc_s` in
`/usr/lib`; GCC 14 inlines the byte-sized atomics, so nothing needs `libatomic`.

Update 2026-11: `libc.so` and the T-Head loader are no longer extracted or shipped.
The loader's riscv64 `__clone` misaligns thread stacks, so the server
runs on Buildroot's musl 1.2.6 loader; see
[riscv64 thread stack alignment](../../docs/development/riscv-musl-stack-alignment.md).

`libsns_lt6911.so` was the 8th file checked, and its bytes differ (2,100 of
14,568) -- but tracing exactly *why* closed it too. The source is real,
checked-in C code at
`middleware/v2/component/isp/sensor/cv182x/lontium_lt6911/` in the pinned
`sipeed/LicheeRV-Nano-Build` commit (`sg200x` is a symlink to `cv182x`, so
this is the exact catalog this hardware uses) -- an earlier full-tree
search missed it because GitHub's tree API silently truncates large repos,
the same failure mode later caught and fixed for the `sophgo/host-tools`
`libc.so` search. It isn't in `build/sensors/sensor_list.json` because
that's a curated picker list for user-selectable board sensors, not the
full middleware catalog LT6911 is part of regardless (same as every other
`libsns_*.so`).

`make vendor-sdk-stock` already compiles this source as part of its normal
build (that's how the diagnostic found a `libsns_lt6911.so` there to
compare against in the first place). Diffing exactly where the two builds'
bytes diverge: 91% of the difference sits in `.rodata`, but every string
in it is character-for-character identical except one -- the compiler's
`__FILE__`-embedded absolute source path. raw.12's copy has
`/home/w0w/Hardened_NanoKVM/build/vendor/...`; `w0w` is the maintainer's
own local username, matching the hardcoded path already found in
the old `docs/build-notes.md` (`NanoKVM_PATH=/home/w0w/...`, since removed) and the old default
toolchain path in `scripts/prepare-kernel-5.10.265-vendor-runtime.sh` (since removed) --
raw.12 was built on the maintainer's own machine, not any CI. This
pipeline's build has `/home/runner/work/Hardened_NanoKVM/...` instead, the
standard GitHub Actions runner path. The differing path length cascades:
every later string in the section shifts by the delta, so a byte-offset
`cmp` reports "91% different" for what is, in content, one string. The
small `.text` diff (86 of 3,184 bytes) is the same shift rippling into
immediate offsets that reference those strings' addresses. Same source,
same compiled logic and data, different build-path debug string that's
never dereferenced as a real path at runtime.

That was true when this file was first traced. It no longer is, deliberately:
`lt6911_probe()`'s chip-ID I2C read never succeeded on real hardware and
logged a scary-looking (if already
non-fatal; both its own failure paths were already dead code) error on
every cold boot. `buildroot-external/hardened-sg2002/board/sg2002/vendor-sdk-patches/lt6911-sensor-id-probe-removed.patch`
removes that I2C probe entirely, applied to the vendor SDK checkout before
`make vendor-sdk-stock` builds it. `vendor-sdk-stock`'s `libsns_lt6911.so`
is therefore no longer byte-identical to a truly unmodified vendor build --
deliberately, and only for this one file; every other file
`vendor-sdk-stock` produces is untouched. See "libkvm_mmf.so statically
embeds its own copy of the LT6911 driver" above: this file is shipped for
provenance but isn't actually what drives HDMI capture at runtime.

`system-image.yml` now sources all 8 files from `vendor-sdk-stock`'s
own `rootfs.sd`. No file shipped in the final image comes from raw.12.

## The module-tree structure: also closed, needed no image at all

The last raw.12 fetch in the pipeline was purely structural: the
`/mnt/system/ko` tree's basenames and `3rd/` nesting (WiFi, Bluetooth and touch modules nest
there), used only to know where each freshly-rebuilt kernel module belongs
-- module *content* was never sourced from raw.12 once the kernel-module
rebuild work closed that gap. Turns out this didn't need any image at all:
`support/sg2002/kernel/5.10.265/manifests/external-modules.txt` already
encodes the full destination path for every external module (`3rd/`
prefixes included), `in-tree-modules.txt` gives the in-tree ones (all flat),
and `media-modules.txt` the media ones -- the complete module structure,
entirely from files already tracked in this repo.
`rebuild-vendor-external-modules-5.10-baseline.sh`'s own build output was
already placing artifacts at these exact relative paths; nothing needed
extracting them from somewhere else in the first place.

`system-image.yml` now builds this structure as an empty-file
skeleton straight from the manifests, no network fetch involved.
`hardened-source-media-provenance.txt` (a plain-text record: source
commits, a device-acceptance marker, a redistribution note) is
regenerated the same way, from values already pinned in the workflow,
rather than copied forward.

raw.12's `/mnt/system` also carried `auto.sh`, `sdk-release`, and (in
older releases) `root/`. Checked and confirmed dead the same way `usr/bin`
and most of `usr/lib` were: `auto.sh` is generic, unused vendor
evaluation-board boilerplate (sets `LD_LIBRARY_PATH`/`PATH` for a boot
flow nothing in this repo invokes) with zero references anywhere in
tracked source; `sdk-release` is a static, unread version string;
`root/` doesn't exist in raw.12 at all any more. None are reproduced.

One narrower, genuine content dependency came up while closing this:
the old local `soph_vc_driver.ko` build script used to diff `soph_vc_driver.ko`'s
module parameters (`modinfo -F parm`) against an "old" reference copy
pulled from raw.12 -- a real diagnostic, not a structural lookup, since
`modinfo` needs an actual valid compiled module. That comparison has been
removed rather than kept as a narrower exception, so this diagnostic no
longer runs.

**raw.12 is no longer fetched anywhere in this pipeline.**
