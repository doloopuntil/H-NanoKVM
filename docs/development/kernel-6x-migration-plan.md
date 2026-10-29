---
status: plan (nothing implemented yet)
applies-to: system 0.4.0 -> next system release on Linux 6.18
last-checked: 2026-10-27
---

# Plan: migrate from the vendor 5.10 kernel to mainline 6.18

This is a hand-off document. A new session should be able to start work from it
without the conversation that produced it. Read sections 1 to 3 first, then pick
a phase in section 7.

Evidence tags used throughout:

- **[V]** verified by reading source or by a trial build during the analysis.
- **[I]** inferred from names, docs or behaviour; plausible but not proven.
- **[U]** unverified; needs the device (the Lite) or more reading.

Nothing here has been run on hardware.

## 1. Decisions already made

| Topic | Decision |
| --- | --- |
| Target kernel | Mainline **6.18 LTS**, the version the licheerv tree pins (6.18.29). 5.10 LTS ends in December 2026. |
| Hardware to support | NanoKVM **Lite**, **Cube (Full)** and **PCIe**. **Not alpha** (early access, no longer sold). |
| Hardware available | **Lite only.** Cube and PCIe work is done by review and by testers. |
| Mailbox | Keep the **mainline `cv1800` mailbox driver**. Drop the vendor `soph_rtos_cmdqu`. |
| Allocator | Keep the **carveout allocator** in `soph_sys` (your `sys-carveout-allocator` patch). Do not switch to the CMA dma-heap design. |
| Goal | No new closed binaries; keep building everything possible from source (see section 4.4). |
| Integration shape | **Two `BR2_EXTERNAL` trees** in one build (section 1.1). |
| Boot payload | **FIT** (kernel + DTBs in one file, the successor of today's `boot.sd`). The FIPs are separate and unchanged in role (section 6.5). |
| FIP contents | **Built from source** (`ddr_param.bin`, `cvirtos.bin`, FSBL, OpenSBI, U-Boot). No prebuilt blobs from the licheerv/varyhin packages. |

### 1.1 The two external trees

```sh
make BR2_EXTERNAL=<repo>/buildroot-external/hardened-sg2002:<path>/buildroot-external-licheervnano \
     <defconfig>
```

| Tree | Path | `external.desc` name | Supplies |
| --- | --- | --- | --- |
| Hardened | `buildroot-external/hardened-sg2002` (a **subdirectory** of this repo, not the repo root) | `HARDENED_SG2002` | musl userland, `kvmapp`, vendor-runtime and firmware packages, BusyBox/OpenSSL CVE patches, NanoKVM genimage layout, the top-level defconfig, and the new media-module package |
| licheerv | root of `buildroot-external-licheervnano` | `SIPEED_LICHEERV_NANO` | Linux 6.18 patch series, U-Boot 2025.10, OpenSBI 1.8.1, FSBL and FIP packages, `soph-tpu` and `aic8800-modules` as module-package templates |

Base: Buildroot 2026.05.1. The defconfig lives in Hardened's `configs/` and sets
`BR2_GLOBAL_PATCH_DIR` to both `board/sg2002/patches` (Hardened) and
`board/licheervnano` (licheerv).

Collision check, 2026-10-29 [V]: no collisions.

- Package directories: Hardened has `hardened-aic8800-sdio-firmware`,
  `hardened-cvitek-riscv64-musl-sysroot`, `hardened-nanokvm-kvmapp`,
  `hardened-sg2002-codec-firmware`, `hardened-sg2002-vendor-runtime`. licheerv has
  `aic8800-modules`, `cv1800-mbox-demo`, `sg2002-8051-demo`, `soph-tpu`, and under
  `boot/` `fip-sg200x`, `fsbl-sg200x`, `licheervnano-firmware`. No shared names.
- Kconfig symbols (6 and 7) are all distinct; no make variable is assigned by both
  trees' `.mk` files.
- None of the 12 names matches a directory under `package/` or `boot/` in Buildroot
  2026.05.1 (compared against all 2,987).
- Global patch directories cover different packages: Hardened `busybox` and
  `libopenssl`; licheerv `linux`, `uboot` and `opensbi`.

Handle these in the combined defconfig (not name collisions):

- **AIC8800 firmware:** Hardened's package installs the lxowalle repo to
  `/usr/lib/firmware/aic8800_sdio/`; licheerv's `licheervnano-firmware` installs
  varyhin's copy to `/lib/firmware/aic8800_sdio/aic8800_and_aic8800D80/`. With a
  merged `/usr` these share one directory tree. Select **one** source (Hardened's
  fits the source-only goal). The `aic8800-modules` kernel package is still taken
  from licheerv.
- **Root filesystem overlays:** both trees ship `/etc/ssh/sshd_config`. Use
  Hardened's overlay only, or order them deliberately. licheerv's overlay also
  carries the AIC8800 `modprobe.d` and `modules-load.d` snippets
  (`options aic8800_fdrv aicwf_dbg_level=1 ps_on=0`; load `aic8800_bsp`,
  `aic8800_fdrv`, `aic8800_btlpm`, `i2c-dev`); copy them across if Wi-Fi is enabled
  (PCIe).
- **Prebuilt boot blobs:** selecting `BR2_TARGET_FIP_SG200X` depends on
  `licheervnano-firmware`, which installs prebuilt `ddr_param.bin` and
  `cvirtos.bin` from varyhin's repo. See open question Q3.
- `board/licheervnano/` also contains a `rootfs-overlay` directory; as a patch
  directory it is treated as a package name with no matching package, which is
  harmless.

Alternatives considered and not chosen: add NanoKVM as a board inside the licheerv
tree (B); copy licheerv's patches into this repo (C).

## 2. What the hardware is

Sources: the Sipeed wiki (NanoKVM Cube and PCIe pages), `S15kvmhwd`, the vendor
SDK DTS and U-Boot board init.

### 2.1 Product relationships [V]

- NanoKVM is "built on the LicheeRV Nano core board" and the image is "built on
  the LicheeRV Nano SDK and MaixCDK". LicheeRV materials apply to it; the KVM
  software does not run on a plain LicheeRV Nano.
- **Lite** = LicheeRV Nano **E** (100M Ethernet, no Wi-Fi) + an HDMI-to-CSI board.
  Ports: USB-C (HID/PC-USB), HDMI, Ethernet. No OLED, no ATX board.
- **Full** adds the NanoKVM-A/B boards and a shell: 128x64 0.96" OLED, ATX
  control and auxiliary power over USB-C.
- **PCIe**: "same SoC", not necessarily the Sipeed module. 64x32 0.49" OLED, ATX
  through a 9-pin header (no HDD LED), optional Wi-Fi, optional PoE, powered from
  the PCIe slot, BOOT button on the bracket.
- Cube and PCIe "share the same image and applications, automatically adapting
  to different hardware versions".
- The Cube wiki still describes camera/touch/mic/amp circuits kept on the PCB;
  application 2.2.6 and firmware 1.4.1 removed those drivers. The touchscreen
  modules (`gt9xx`, `hynitron`, `ts_gslX680`) in the 5.10 manifest need **not**
  be ported.

### 2.2 `/etc/kvm/hw` values [V]

| Value | Meaning | Status |
| --- | --- | --- |
| `alpha` | early access Full (OLED at `0x3d` on hardware I2C1) | **dropped** |
| `beta` | official Full and Lite | supported |
| `pcie` | NanoKVM PCIe (OLED at `0x3c` on bit-bang I2C bus 5) | supported |

Detection in `S15kvmhwd` today: probe `0x3d` on bus 1 (alpha); otherwise probe
`0x3c` on bus 5 (pcie); otherwise beta. Lite vs Full is **not** decided here: the
app uses `oled_exist` and `wifi_exist` (a Lite is "a `beta` board with no OLED
and no Wi-Fi"; see `docs/guide/power-and-hardware.md`).

### 2.3 Pin and GPIO facts for beta and pcie [V unless noted]

The device tree used today is the **unmodified Sipeed LicheeRV Nano DTS**
(`sg2002_licheervnano_sd.dtb`) plus `hardened-overrides.dtsi`. All NanoKVM
specific pin setup is done at boot by `devmem` pokes in `S15kvmhwd`, on top of
what the vendor U-Boot (`cvi_board_init.c`) already set. Pad names come from the
vendor `pinctrl-mars.h`; the table lists what survives after dropping alpha.

| FMUX reg (base `0x03001000`) | Pad | Vendor U-Boot default | `S15kvmhwd` (beta/pcie) | Use |
| --- | --- | --- | --- | --- |
| `0x3C 0x50 0x54 0x58 0x5C 0x60` | A15 A22 A25 A27 A23 A24 | GPIO (3) | GPIO (3), same | ATX power/reset/LEDs, OLED reset, bit-bang I2C (A15 SCL, A27 SDA) |
| `0x4C` | A26 | GPIO (3) | GPIO (3) | Wi-Fi enable (driven 1 after detection) |
| `0xD0..0xE4` | SD1 D3..CLK | SDIO (0) | SDIO (0), same | Wi-Fi SDIO (pcie optional) |
| `0x68` `0x64` | A18 A19 (JTAG pads) | UART1 CTS/RTS (4) | UART1 RX/TX (6) | serial port 1 |
| `0x70` `0x74` | A28 A29 | UART1 TX/RX (1) | UART2 TX/RX (2) | serial port 2 |

Only the two UART rows actually change anything. Everything else repeats the
default and can become pinctrl states in the DT.

GPIO numbers hard-coded in `S15kvmhwd` and `server-rust/src/api/vm.rs`:

- beta: reset key 505 (A25), power key 503 (A23), power LED 504 (A24), OLED reset 502 (A22).
- pcie adds HDMI-chip reset **451**.
- Wi-Fi enable 506 (A26).
- These are vendor-kernel sysfs numbers (port A base 480 [I]; 451 is port B, pin 3
  [I]). **They will not be stable under 6.18** (section 6.4).

HDMI bridge variant, probed on **I2C bus 4** (the camera I2C, pads
`PWR_GPIO6/8` = `IIC4`): `0x2c` = `c`, `0x2b` without `0x44` = `d`, `0x2b` with
`0x44` = `ux`, none = `ue`. Written to `/etc/kvm/hdmi_version`. The Lite will have
one of these; find out which with a manual probe in Phase 0.

Vendor DTS facts worth keeping [V]: `mipi_rx { snsr-reset = <&porte 1 ...> }`;
bit-bang `i2c5@gpio` on A15/A27; `spi4@gpio` on A22/A23/A24/A25 (these pads are
ATX lines on NanoKVM); user key on A30; user LED on A14; `4340000.usb` is the USB
device controller (UDC name used by scripts and by `kvm_system`).

## 3. Current system (what we are migrating from)

### 3.1 Boot chain [V]

BootROM -> **vendor FSBL** (with `fsbl-boot-guard.patch` and
`fsbl-overdrive-clocks.patch`; produces `fip.od.bin` and `fip.std.bin`, with
`fip.bin` a copy of one of them) -> OpenSBI -> **vendor U-Boot 2021.10** ->
`boot.sd` (FIT with kernel + DTB). The FSBL loads the vendor FreeRTOS image
(`cvirtos.bin`) onto the C906L core at `0x8fe00000` (2 MiB).

Vendor memory map (`reference/cvi_board_memmap.h`, `memmap.py`) [V]:
DRAM `0x80000000`, 256 MiB. FreeRTOS `0x8fe00000` (2 MiB). ION/media region
**75 MiB at `0x8b300000`** (just below FreeRTOS). Boot logo 7.8 MiB below that.
Kernel RAM is 254 MiB; the media region lies inside it and is a reserved node.

### 3.2 Kernel and modules [V]

- Vendor 5.10 kernel merged with stable 5.10.265 by patches `0001`-`0009`
  (about 6k lines: SG2002 port, CVITEK USB gadget stack, net/ioctl, stmmac, I2C
  numbering, module validation). Hardening fragments in
  `support/sg2002/kernel/5.10.265/configs/` (dmesg restrict, user namespaces off,
  SLUB freelist random on / hardened off, init-on-alloc on, ION off).
- Out-of-tree media modules from `sophgo/osdrv` at
  `1b3a49649d18488ecf54fb4fcb6c27599e433fdc` with 8 local patches (order is in
  `scripts/rebuild-vendor-external-modules-5.10-baseline.sh`). Loaded by
  `kvmapp/system/init.d/S00kmod` in this order: `soph_sys`, `soph_base`,
  `soph_rtos_cmdqu`, `soph_fast_image`, `soph_mipi_rx`, `soph_snsr_i2c`,
  `soph_vi`, `soph_vpss`, `soph_dwa`, `soph_vo`, `soph_rgn`, `soph_wdt`,
  `soph_clock_cooling`, `soph_vcodec`, `soph_jpeg`, `soph_vc_driver`, `soph_rtc`,
  `soph_ive`, `soph_mon`, `soph_pwm`, `soph_wiegand`.
- The ION removal is already done: `soph_sys` allocates from the reserved region
  (gen_pool, best fit) and exports `sys_ion_alloc[_nofd]` / `sys_ion_free[_nofd]`.

### 3.3 Userland [V]

Buildroot 2026.05.1, **musl**, SysV init, eudev, BusyBox 1.38 with CVE patches,
Rust server, React UI, `kvmapp`. Native video code runs on the vendor-provided
musl "xthead" loader and libc. Image: 32 MiB VFAT `/boot` (FIPs, `boot.sd`,
flag files), 1.5 GiB ext4 root, exFAT `/data` taking the rest. System updates
write whole raw images (`boot.vfat`, `rootfs.sd`) to partitions 1 and 2
(`system_update.rs`); the format is kernel-agnostic.

### 3.4 What is built from source in CI [V per `ci-image-build.md`; not re-run]

Source-built: kernel, osdrv modules, `libkvm`, `libkvm_mmf`, `kvm_system`, the
cvi_mpi libraries (`libsys libvenc libvdec libvi libvpss libvo libgdc librgn
libini`, release `693a72a1d52f2e08ea767e0a72905e81f10572a5`, plus the
`no-vi-dbg-thread` patch), the LT6911 sensor (compiled into `libkvm_mmf`), FSBL,
OpenSBI, U-Boot, FIP, and the musl loader/runtime from `vendor-sdk-stock`.

Still binary or unlicensed: audio/misc libraries checked into `dl_lib/`
(`libaac*`, `libcvi_audio`, `libcvi_VoiceEngine`, `libcvi_ssp`, `libcvi_vqe`,
`libdnvqe`, `libcvi_RES1`, `libcvi_ive`, `libosdc`, `libmisc`, `libmipi_tx`,
`libraw_dump`, `libcli`, `libtinyalsa`), 4 OpenCV modules from upstream
sipeed/NanoKVM, the video **codec firmware** (`sg2002_codec_fw`, unlicensed,
installed to `/usr/share/fw_vcodec`) and the AIC8800 firmware. The checked-in
copies of `libkvm`, `libsys`, `libvenc`... in `dl_lib/` may be leftovers; check
before relying on them.

## 4. The licheerv tree (what it gives us)

`buildroot-external-licheervnano`, 4 commits, MIT. Mainline stack for the
LicheeRV Nano B/E/W/WE. [V]

### 4.1 Provides

- Linux **6.18.29** with 20 patches (`board/licheervnano/linux/0001..0023`):
  DTS for B/E/W/WE, Ethernet PHY (`0002`, `0003`), I2C, UART, **USB dwc2
  `usb@4340000`** (`0007`), audio, DMAC, user LED, TPU node (`0017`), watchdog
  (`0019`), thermal (`0020`), pinmux (`0021`), RTC (`0022`), **mailbox node**
  (`0023`, `sophgo,cv1800b-mailbox` at `0x1900000`, IRQ 101).
- U-Boot 2025.10 (4 patches; `kernel_addr_r=0x80200000` so a large Image does not
  overlap the FDT, eFuse MAC, sysreset), OpenSBI 1.8.1 (1 patch).
- FSBL package (`boot/fsbl-sg200x`, Sipeed commit `d4003f1`, 5 patches for
  mainline toolchains, built with `OD_CLK_SEL=y TPU_PERF_MODE=y`), FIP assembly
  (`boot/fip-sg200x`, uses varyhin's `fiptool`).
- `soph-tpu` and `aic8800-modules` as 6.18 out-of-tree module packages: the
  template for the osdrv package (`soph-tpu.mk` uses `$(eval $(kernel-module))`,
  a post-extract patch hook, `LINUX_MAKE_FLAGS`, `depmod`).
- Boot via extlinux; a single image with four DTBs and a variant menu.

### 4.2 Lacks

Anything for media or KVM; musl (it uses glibc); your partition layout, update
flow and boot guard; hardware validation beyond the TPU (the TPU module patch
records a hardware run on 2026-06-02; the TPU DT patch still says unverified).

### 4.3 Things to watch in it

- `board/licheervnano/linux/0001` adds `reserved-memory` for **its own**
  `cvirtos.bin` at `0x83f40000` (768 KiB, no-map). That differs from the vendor
  RTOS at `0x8fe00000`. Which RTOS image is used decides which region is reserved.
- `licheervnano-firmware.mk` installs **prebuilt `ddr_param.bin` and
  `cvirtos.bin`** (varyhin's `cvirtos.bin` is only 13,480 bytes, a minimal blob,
  not the vendor FreeRTOS image, and his notes call both "closed vendor blobs") from varyhin's repo at `3bf6e4d`. Adopting that package as-is
  adds binaries that the vendor-SDK build currently produces from source [I:
  verify the SDK build really produces both from source].
- `linux.fragment` enables CMA 64 MiB, dma-heaps, mailbox, LEDs and audio; it
  does **not** enable the USB gadget functions NanoKVM needs, the netfilter and
  WireGuard options, exFAT, or the NanoKVM hardening settings.
- Buildroot config differences: glibc vs musl, 256 MiB root vs 1.5 GiB, no
  BR2_REPRODUCIBLE/force-hash settings.

### 4.4 Source pins to keep consistent

| Item | Pin |
| --- | --- |
| osdrv | `1b3a49649d18488ecf54fb4fcb6c27599e433fdc` (2026.08.24 weekly release) |
| cvi_mpi | `693a72a1d52f2e08ea767e0a72905e81f10572a5` |
| Sensor list | `e2824e1d07f516c41238e123fefbab71a34843bc` |
| Vendor SDK (Hardened) | `d88d58feca49ef15f4cc7bd1f27dbf17dc25f85e` (sipeed/LicheeRV-Nano-Build) |
| FSBL (licheerv) | `d4003f15b35d43ad4842f427050ab2bba0114fa5` (same repo, different commit; re-check the two Hardened FSBL patches apply) |
| Linux | 6.18.29 |
| U-Boot / OpenSBI | 2025.10 / 1.8.1 |
| varyhin/licheervnano | `3bf6e4d22956d8d36644abac4b514d68ef8f0e81` |

osdrv and cvi_mpi must stay on the same Sophgo release; the ioctl ABI between
them is what keeps the prebuilt closed libraries working.

## 5. Trial-build evidence (osdrv against 6.18) [V]

Method (Appendix A): the pinned osdrv with the 8 local patches applied, built
out of tree against Linux **v6.18** (not .29), clang 18, riscv `defconfig`,
`-Werror` removed, `-ferror-limit=0`. Compile-level only; nothing was linked or
run, and the config is not the real one.

First pass (no shim): about 50 hard errors, all mechanical. With a 20-line
compat header (Appendix B) plus `DEFINE_SEMAPHORE(x)` -> `(x, 1)`:

| Module | Result |
| --- | --- |
| `sys` `vi` `vpss` `vcodec` `jpeg` `rtos_cmdqu` `fast_image` | compile clean |
| `base` | needs vendor header `tee_cv_private.h` |
| `cif` (soph_mipi_rx) | needs vendor header `pinctrl-mars.h` (FMUX offsets) |
| `snsr_i2c` | `struct i2c_adapter.i2c_idx` and `I2C_M_WRSTOP` (vendor I2C core extensions) |
| `vo` | legacy GPIO API (`of_get_named_gpio_flags`, `GPIOF_*`), `pinctrl-mars.h` |
| `dwa` | missing `of_device_id` include |
| `rgn` | `<stdbool.h>` include (kernel builds with `-nostdinc`) |
| `mon` | `hrtimer_init` removed -> `hrtimer_setup` (manual) |
| `cvi_vc_drv` | missing `of_device_id` include; `set_fs/get_fs/mm_segment_t` in `vdi_osal.c`; two errors in `rcKernel/cvi_float_point/cvi_soft_float.c` (maybe clang-specific; try GCC) |

Kernel symbols the modules need that 6.18 does not export [V by `nm`]:
`arch_sync_dma_for_device` (used by the carveout allocator), `do_exit`,
`sched_setscheduler`. For the objects that compiled, everything else unresolved
was intra-osdrv (modules that failed to compile were not checked).

Headers that live only in the vendor kernel tree: `pinctrl-mars.h`
(`pinctrl-cv181x.h` in the SDK), `tee_cv_private.h`, `linux/streamline_annotate.h`.
Copy the first two from the vendor SDK (they are constants/macros); stub the
third (4 no-op macros).

Mechanical changes seen across the modules: `PDE_DATA`->`pde_data`,
`class_create` 2->1 args, `platform_driver.remove` returns `void`,
`del_timer_sync`->`timer_delete_sync`, `from_timer`->`timer_container_of`,
`MAX_USER_RT_PRIO`->`MAX_RT_PRIO`, `UTS_VERSION` needs `generated/utsversion.h`,
`DEFINE_SEMAPHORE` takes a count, `dma_buf_*` symbols are in namespace `DMA_BUF`
(`MODULE_IMPORT_NS("DMA_BUF")`) and have `*_unlocked` variants.

Clocks and resets [V by name match; vendor DTS not diffed]: every clock-name
literal found in osdrv has a mainline `CLK_*` ID (VC source/APB/AXI, VIP sys/ISP/
CSI/DISP/DSI, CAM0/1, `CLK_MIPIMPLL`, `CLK_DISPPLL`, `CLK_FPLL`, SC/IMG, DWA).
The `vi` name arrays were not enumerated. `clk_cpu` (clock cooling) has no match;
drop that module. Reset names used by the video modules: `phy0 phy-apb0 phy1
phy-apb1` (CIF); mainline has `RST_COMBO_PHY0` only, so check `phy-apb*` and
`phy1`.

Direct register access in the modules [V]: hard-coded `ioremap` of `0x03002xxx`
(clock/reset top), `0x0A0880F8`/`0x0A0C8018` (DDR PHY), `0x03000100`, and
FMUX writes in `cif`/`vo`. These bypass the mainline clk/pinctrl drivers and their
locking; see risk R3.

## 6. Gap analysis and decisions per area

### 6.1 Memory: carveout allocator and `/dev/mem`

What happens today [V]: `CVI_SYS_IonAlloc` -> `SYS_ION_ALLOC` ioctl on
`/dev/cvi-sys` (returns a physical address) -> libsys `mmap`s `/dev/mem`
(`O_SYNC` = uncached, plain = cached; cached mappings are followed by a
`SYS_CACHE_INVLD` ioctl). Kernel modules (`base/vb.c`, `vi`, `vpss`, `rgn`, `ive`,
codec `vdi`/`jdi`) allocate through the exported `sys_ion_alloc[_nofd]`.

Changes needed:

1. Replace `arch_sync_dma_for_device` with `dma_sync_single_for_device` /
   `_for_cpu` (the licheerv `soph-tpu` port did the same and was validated on
   hardware, on CMA memory). T-Head cache operations in 6.18 work on **physical**
   addresses (`th.dcache.cpa/ipa/cipa`) [V], so this should also work on a
   `no-map` region; **untested** [U].
2. Vendor reality check [V]: the vendor `ion_reserved` node (`ion-region`,
   `size` only, no `reg`, no `no-map`) is an ordinary **reserved RAM** region that
   the kernel places top-down at the end of its 254 MiB memory node, which is where
   `0x8b300000` comes from. It stays in the linear map, so the 5.10 allocator's
   `memremap(MEMREMAP_WB)` simply returned the cached linear address. The RTOS
   region (`0x8fe00000`, 2 MiB) is **outside** the vendor memory node, so the
   vendor DT needs no reservation for it. Two ways to reproduce this in 6.18:
   - **(a) reserved, mapped RAM** (no `no-map`): `memremap(WB)` returns the cached
     linear address, the same case licheerv's `soph-tpu` port validated on
     hardware. Cost: `/dev/mem` counts it as System RAM, so `STRICT_DEVMEM` must be
     off. This is the lowest-risk match to 5.10 behaviour.
   - **(b) `no-map`**: `/dev/mem` works with `STRICT_DEVMEM`, but `memremap(WB)` on
     non-RAM falls back to `arch_memremap_wb` (device attributes on riscv; `kernel/
     iomem.c` [V by reading, I for the riscv outcome]), so the kernel-side
     "cached" pointer would not be cached. User mappings come from `/dev/mem` and
     are separate.
   Prefer (a) for Phase 2 and revisit (b) only if you want `STRICT_DEVMEM`.
3. `/dev/mem`: riscv uses the generic `STRICT_DEVMEM` check, which blocks System
   RAM [I]. The 5.10 system already needs `/dev/mem`; record this in
   `docs/reference/security-model.md`.
4. DT: add a fixed-address `reserved-memory` node for the media region (75 MiB at
   `0x8b300000` unless re-planned; give it an explicit `reg` so it is
   deterministic) and either shrink the memory node to 254 MiB like the vendor DT or
   keep 256 MiB and reserve the RTOS region `0x8fe00000` (2 MiB, `no-map`). Give
   `soph_sys` a `memory-region`. Omit the `cvitek,rtos_image` node so
   `sys_mem_rtos_size()` skips nothing.
5. Drop licheerv's 64 MiB CMA and dma-heaps (they compete for the same RAM) or
   shrink them; keep `ERRATA_THEAD_MAE` and `ERRATA_THEAD_CMO` on (verify in the
   final `.config`).
6. Process death leaks buffers (`cvi_sys_close` only releases bindings). The
   vendor ioctl path had the same behaviour; do not treat as a regression, but
   consider tracking allocations per `struct file`.

First hardware test (Phase 2): allocate one cached and one uncached buffer through
libsys, write a pattern, flush, read it back through the other mapping, then DMA a
VPSS frame into it and read it from user space.

### 6.2 Media modules

Keep: `sys base mipi_rx(cif) snsr_i2c vi vpss vcodec jpeg vc_driver`. Decide with
Phase 0 `strace` data (section 7, Phase 0): `dwa vo rgn ive mon fb`.
Drop: `rtos_cmdqu` and `fast_image` (the cmdqu's only shipped-middleware user is
the ISP library, which is not shipped; `fast_image` and `rgn` reference it from
the kernel side, so check `rgn` for a hard dependency), `clock_cooling`, `wdt` (use mainline `dw_wdt`),
`rtc` (mainline `rtc-cv1800`), `pwm`, `wiegand`, `saradc`.

For each kept module: apply the compat header, fix the items in section 5, add its
DT node. Reuse the licheerv method for nodes: build the DTB and compare reg, IRQ,
clock and reset cells byte-for-byte against the vendor node. IRQ rule:
`SOC_PERIPHERAL_IRQ(n) = n + 16` (calibrated by licheerv against vendor
`saradc`). The vendor node values are in the Sipeed SDK
(`linux_5.10/arch/riscv/boot/dts/cvitek/`, `build/boards/sg200x/`).

DT nodes to write (compatibles from osdrv): `cvitek,sys`, `cvitek,base`,
`cvitek,cif`, `cvitek,vi`, `cvitek,vpss`, `cvitek,cvi_vc_drv`,
`cvitek,asic-vcodec`, `cvitek,asic-jpeg`, plus whichever of `cvitek,vo`,
`cvitek,dwa`, `cvitek,rgn`, `cvitek,ive`, `cvitek,mon`, `cvitek,fb` survive.

### 6.3 Second CPU, mailbox, RTOS

[V] The ISP library sends events (`INIT`, `PRE_SOF`..`POST_EOF`, `DEINIT`,
`SWITCH_TO_MASTER`) to the C906L over 8-byte mailbox messages (`ip_id`, `cmd_id`,
`block`, timeout, 32-bit physical `param_ptr`) with software cache flushes on both
sides. The only user of `/dev/cvi-rtos-cmdqu` in the shipped middleware is the ISP
library (`isp_mailbox.c`), which this project does not ship. `fast_image` waits for
`RTOS_INIT_DONE`; nothing on the capture path does.

Decisions: use the mainline mailbox driver (`CONFIG_CV1800_MBOX`, node `0023`);
keep a `cvirtos.bin` in the FIP and keep its region `no-map`; do not load
`soph_rtos_cmdqu`. The RTOS source (FreeRTOS + CVITEK drivers + `build_freertos.sh`)
is in the Sipeed SDK `freertos/` tree, so it can be built from source.
Future use (video-stream encryption on the C906L): messages must use
`ip_id < IP_LIMIT` and `cmd_id < SYS_CMD_INFO_LIMIT` if the vendor protocol is
kept, shared buffers must be below 4 GiB, and cache maintenance is manual on both
cores. Not in scope for this migration.

### 6.4 Userland-visible kernel interfaces (ABI inventory)

| Interface | Used by | 5.10 | 6.18 action |
| --- | --- | --- | --- |
| `/sys/class/gpio/gpioNNN` (503-507, 451, 502, 506) | `S15kvmhwd` (35 refs), `vm.rs` (11), `kvm_vision.cpp` (HDMI reset 451); `kvm_system` only has comments | fixed bases (port A 480, B 448, ... [I]) | bases are dynamic in 6.18 (start at 512, count down; `dwapb` passes base -1) and sysfs GPIO needs `EXPERT` + `GPIO_SYSFS`. Stopgap: enable it and check the numbers. Target: `gpio-line-names` in the DT, char-device access by name, `gpio-hog` for lines that must stay at a fixed level (OLED reset, HDMI reset, Wi-Fi enable). Test what a released output line does (keeps its level or not) [U]. Also drop the alpha entry in `vm.rs` |
| `/sys/class/cvi-base/base_uid` | `S03usbdev` MACs/serial | osdrv `soph_base` | unchanged (comes from the module) |
| `/proc/cvitek/*` (`vb`, `sys_mem`, `vi_dbg`) | diagnostics | osdrv | unchanged |
| `/dev/cvi-*` | middleware | osdrv | unchanged; confirm with strace |
| `/proc/cviusb/otg_role` | `S03usbdev`, `S03usbhid` | vendor dwc2 (also sets a TOP register to force the ID pin: bits `0xC0` device / `0x40` host) | not in mainline; set `dr_mode = "peripheral"` in the DT and remove the writes (mainline `sophgo,cv1800b-usb` compat exists in `params.c`) |
| `/sys/bus/platform/drivers/dwc2/{bind,unbind}` with `4340000.usb` | USB scripts | works | keep node name `usb@4340000` |
| `/sys/class/udc/4340000.usb/state` | hwmon, `kvm_system`, UI | works | same node name |
| configfs gadget: ECM/NCM/RNDIS/HID/mass storage | `S03usbdev` | built in | enable `USB_CONFIGFS_{ECM,NCM,RNDIS,HID,MASS_STORAGE}` and the `USB_F_*` functions |
| `/dev/input/event0` (user key A30) | `kvm_system` | first input device | look up by name; keep `gpio-keys` from the licheerv DTS |
| `/dev/watchdog` | `S02watchdog`, `watchdog.rs` | `soph_wdt` | `dw_wdt` (licheerv `0019`); must adopt the FSBL-armed watchdog |
| `/sys/class/thermal/thermal_zone0/temp` | monitor, update script | vendor | licheerv `0020` provides a zone; check the path |
| `/dev/i2c-1`, `-4`, `-5` | OLED, HDMI probe | numbered by probe order | DT `aliases` so bus numbers stay 1, 4, 5 (or probe by name) |
| `/dev/mem` + `devmem` | libsys, `S15kvmhwd`, boot-guard register `0x05026020` | on | keep `DEVMEM`, decide `STRICT_DEVMEM` (6.1) |
| exFAT `/data` | `S01fs` | vendor `exfat` | mainline `EXFAT_FS` |
| `wlan0/eth0` carrier | `kvm_system`, hwmon | fine | unchanged names |

Kernel configuration to carry over from the vendor defconfig
(`sg2002_licheervnano_sd_defconfig`): `WIREGUARD`, `NETFILTER`/`NF_TABLES`/
`NFT_*`/`NF_CONNTRACK`/`NF_NAT`, `TUN`, `VETH`, `EXFAT_FS`, `VFAT_FS`, `EXT4_FS`,
`SQUASHFS`, `USB_CONFIGFS` + functions above, `GPIO_SYSFS`, `I2C_CHARDEV`,
`I2C_GPIO` (module), `CFG80211`/`MAC80211` + AIC8800, `BT`, `RFKILL`, `IPV6`,
`SERIAL_8250_DW` (5 UARTs), `LEDS_GPIO`, `INPUT_EVDEV`, `MAGIC_SYSRQ`. Hardening:
`SECURITY_DMESG_RESTRICT=y`, `USER_NS=n`, `SLAB_FREELIST_RANDOM=y`,
`INIT_ON_ALLOC_DEFAULT_ON=y` (no ION line). Start from a lean config; licheerv's
Image is about 27 MiB with the arch default config.

### 6.5 Boot chain, image size and updates

Naming: a **FIP** (Firmware Image Package) is the BootROM/FSBL container with the
FSBL, DDR parameters, RTOS, OpenSBI and U-Boot (`fip.bin`, `fip.od.bin`,
`fip.std.bin`). A **FIT** (Flattened Image Tree) is U-Boot's container for kernel
and DTBs (`boot.sd` today). They are separate files; the overdrive/standard FIP
pair is unaffected by the FIT decision.

Decision: use a **FIT** for the kernel payload. Remaining work: `mkimage` and an
`.its` in the build (Buildroot host `uboot-tools` with FIT support), U-Boot FIT
and compression support, and a boot script or extlinux entry that boots it
[U: confirm licheerv's U-Boot config]. Keep the load and decompression addresses
apart (licheerv's overlap bug). Pick the compression by measuring boot time.

- **Size constraint** (a FIT with compression eases this). `/boot` is 32 MiB on current images (16 MiB on old cards;
  "a card keeps the boot size it was flashed with"). The 5.10 kernel package was
  11.7 MB. A 6.18 Image of about 27 MiB plus three FIPs (about 3.6 MB in the old
  budget) does not leave room. Trim the config first; if still large, use a
  compressed FIT (kernel + DTB) instead of a raw `Image` and boot it from
  extlinux or a boot script. Measure before choosing [U].
- **U-Boot.** Mainline 2025.10 uses extlinux; the vendor U-Boot 2021.10 provides
  things you will lose: boot logo (`/boot/logo.jpeg`), `cvi_update`, the vendor
  USB download magic. The Cube wiki documents a BOOT-button USB reflash mode that
  exposes the TF card as a USB drive; whether it lives in BootROM, FSBL or the
  vendor U-Boot is **unknown** [U]. If it is in U-Boot, rebuild it with the `ums`
  command plus a GPIO check in the boot script. Also keep the password-reset
  BOOT-button hold (handled in `kvm_system`).
- **FSBL.** Port `fsbl-boot-guard.patch` and `fsbl-overdrive-clocks.patch` to the
  licheerv FSBL commit. licheerv hard-codes `OD_CLK_SEL=y`; keep the standard and
  overdrive FIP pair and the existing `cpu.overdrive` flow. The boot guard uses
  `RTC_INFO1` (`0x05026020`) and arms a watchdog at `0x03010000`; check `dw_wdt`
  and `rtc-cv1800` coexist with that and with `devmem` writes.
- **FIP contents.** Prefer building `ddr_param.bin` and `cvirtos.bin` from the
  vendor SDK instead of licheerv's prebuilt copies, if the SDK build yields them
  from source [U]. The RTOS region in the DT must match the image used.
- **Kernel cmdline.** None is set in the vendor DTS (comes from the vendor U-Boot
  environment). Set `root=/dev/mmcblk0p2 rootwait` (+ the current options) in
  extlinux `append`.
- **Updates.** The raw updater writes whole partition images, so the bundle format
  can stay, but `/boot` contents change (extlinux, `Image`/FIT, DTB instead of
  `boot.sd`; verify nothing else reads `boot.sd`: `system_update.rs`,
  `create-*-system-update-bundle.sh`, `docs/reference/system-update-bundles.md`).
  There is no A/B slot; a 6.18 image that does not boot cannot roll itself back.
  Ship the first 6.18 images as **fresh-flash only** (preview), and move to OTA
  after soak testing, with documented SD recovery.

### 6.6 Toolchain and userland

Keep musl and the vendor xthead loader/libc for the native video binaries; none of
that depends on kernel headers. `BR2_KERNEL_HEADERS_5_10` becomes `_6_18` (or a
custom header version matching the kernel). Kernel and modules are built with the
Buildroot toolchain; the media modules must be built with the same compiler as the
kernel. `BR2_DOWNLOAD_FORCE_CHECK_HASHES=y` requires a hash file for the custom
kernel version (global patch dir `linux/linux.hash`).

## 7. Phased plan

Keep the 5.10 pipeline untouched until a 6.18 image captures video on the Lite.
Add a new workflow (`system-image-6x.yml`, `workflow_dispatch`) rather than editing
`system-image.yml`; per `AGENTS.md`, change CI only with a real run to prove it.
When the system version changes, update the three version places listed in
`AGENTS.md`.

### Phase 0: baselines from a working 5.10 Lite (no code changes)

On a running device, save to the repo or release notes:

1. `strace -f -e trace=openat,open -o ... ` of the server and `kvm_system` for 2
   minutes of capture + encode: the list of `/dev/cvi-*`, `/dev/mem`, `/dev/ion`
   opens. This decides section 6.2's keep/drop list.
2. Module dependency graph: `modinfo -F depends` for each `.ko`, and
   `cat /proc/cvitek/*`, `cat /proc/iomem`, `/proc/interrupts`,
   `cat /sys/kernel/debug/clk/clk_summary`.
3. `devmem` dump of the FMUX range `0x03001000-0x03001200` after boot, and the
   current `/etc/kvm/{hw,hdmi_version,oled_exist,wifi_exist}`.
4. HDMI bridge variant (the bus 4 probes in `kvm_hdmi_version_detect`).
5. Performance baseline: FPS, latency, CPU use for MJPEG and H.264 at 1080p, boot
   time, idle RAM, `sys_mem` peak.
6. Boot partition free space (`df /boot`) and the sizes of `fip.*`, `boot.sd`.
7. Dump the vendor DTB (`dtc -I dtb`) for the 14 or so media nodes.

Exit: a `docs/development/` note or release artifact holding these captures.

### Phase 1: 6.18 boots on the Lite, no video

1. Create the multi-external build: `BR2_EXTERNAL=<hardened>:<licheerv>`, a new
   defconfig (musl, `BR2_KERNEL_HEADERS_6_18`, custom kernel 6.18.29,
   `BR2_GLOBAL_PATCH_DIR` listing both patch dirs), hashes for the kernel tarball.
2. Add a NanoKVM Lite DTS based on `sg2002-licheerv-nano-e`: no audio, `usb` in
   `peripheral` mode, `gpio-keys`, `gpio-line-names` for the ATX/OLED/Wi-Fi/HDMI
   lines, I2C aliases, UART1/UART2 pinctrl, reserved-memory (media + RTOS),
   mailbox. Prepare beta-only first.
3. Kernel fragment (section 6.4); trim licheerv's audio/TPU patches from the Lite
   build if they bloat the Image.
4. FIP: licheerv packages, with the two Hardened FSBL patches; keep std/od pair.
5. Boot layout: extlinux (or FIT) in `/boot` alongside the FIPs and flag files.
6. Boot the Hardened rootfs on 6.18 without loading any `soph_*` modules.

Exit criteria on the Lite: boots to login on UART; Ethernet and DHCP; web UI
reachable; USB gadget enumerates on a host with HID, mass storage and RNDIS;
`S15kvmhwd` runs without errors (ignoring GPIO numbering for now); exFAT `/data`
mounts; WireGuard and nftables load; watchdog adopts the FSBL-armed timer; boot
guard counter resets; `dmesg` clean of unexpected warnings.

### Phase 2: media modules and the first frames

Order: `soph_sys` -> `soph_base` -> `soph_mipi_rx` + `soph_snsr_i2c` -> `soph_vi`
-> `soph_vpss` -> `soph_vcodec`/`soph_jpeg`/`soph_vc_driver` -> optional modules.

1. New Buildroot package `soph-media` modelled on `soph-tpu.mk` (`kernel-module`
   infra, osdrv fetched at the pinned SHA, patches from the Hardened patch dir,
   `M=` build per module directory, `depmod`). Re-base the 8 osdrv patches onto the
   compat header approach; add `compat618.h` (Appendix B) with `-include`.
2. Copy `pinctrl-mars.h` and `tee_cv_private.h`; stub `streamline_annotate.h`;
   fix the per-module items in section 5; replace the three unexported symbols.
3. `snsr_i2c`: replace `i2c_idx` and `I2C_M_WRSTOP` with an in-tree mechanism
   (the LT6911 bus is I2C4; the module probably only needs to bind the right
   adapter by name or DT phandle) [U: read `snsr_i2c.c` closely].
4. Write DT nodes; verify with a DTB diff against the vendor nodes.
5. Run the cache test (6.1), then module load order from `S00kmod` minus dropped
   modules.
6. Bring up the capture path with `libkvm_mmf` unchanged: `VI_IOCTL_SET_SNR_INFO`,
   LT6911 over I2C4, MIPI RX, `CAM_MCLK1` pad (RX0N, function 5) as the vendor
   U-Boot sets it ("for beta").

Exit: `soph_*` modules load with no unresolved symbols; `/dev/cvi-*` nodes appear;
`/proc/cvitek/sys_mem` reports the carveout; the cache test passes; a single HDMI
frame reaches user space.

### Phase 3: capture and encode end to end on the Lite

MJPEG and H.264 streams through the Rust server in a browser; HDMI hot-plug,
resolution changes, EDID flow, idle timeout, HID-only mode; 24 h soak; compare with
Phase 0 numbers (FPS, latency, CPU, RAM, sys_mem peak). Watch for stale or corrupt
frames (cache bug signature), IRQ storms, clock rate differences (check
`clk_summary` against Phase 0; the mainline clk driver and the modules' direct
register writes can disagree).

Exit: parity or better on the Phase 0 numbers; no crashes in the soak.

### Phase 4: platform integration

Port the GPIO handling (section 6.4), finalise the boot payload format, rebuild the
USB reflash and logo features (or document their removal), port the update bundle
and `system_update.rs`/scripts to the new `/boot` contents, add the new CI
workflow (kernel + module package + FIP in `build-image`; keep `vendor-sdk-source`
slim for the LT6911 sensor source, the RTOS source and the FSBL patch base; drop
the 95-minute `vendor-sdk-stock` build if the FIP no longer needs it), update docs
(`ci-image-build.md`, `device-files.md`, `init-scripts.md`, `security-model.md`
for `/dev/mem` and the 6.18 hardening settings).

Exit: a CI-built image flashes, boots and passes the Phase 1-3 checks unattended.

### Phase 5: Cube (Full) and PCIe by review

Cube/Full = beta hardware plus OLED and ATX: validate what the Lite cannot:
OLED on bus 5 (bit-bang `i2c-gpio`, A15/A27), ATX GPIOs, auxiliary power. PCIe adds:
OLED at `0x3c`, HDMI-chip reset (451), Wi-Fi (AIC8800 via the licheerv 6.18
package, SDIO pads at default), 9-pin ATX.

Without the hardware: keep the runtime detection and `hw` file semantics from
`S15kvmhwd` (minus alpha), express every difference as DT `gpio-line-names` / pinctrl
states selected at runtime or as overlays, write a short tester checklist (boot,
OLED text, power/reset buttons, Wi-Fi association, HDMI capture, USB gadget), and
publish a preview image for testers. Treat PCIe `wifi`, `poe` and the `reboot` after
first PCIe detection as the riskiest paths.

### Phase 6: hardening and cleanup

Confirm hardening parity in the final `.config`; remove the 5.10 kernel patches,
configs and scripts only after the 6.18 channel is stable; update `CHANGELOG.md`,
`docs/releases/`, and record the dropped hardware (alpha) in the install docs.

## 8. File-level work list

This repo (`Hardened_NanoKVM`):

- `buildroot-external/hardened-sg2002/configs/`: new 6.18 defconfig; kernel
  fragment; hashes.
- `buildroot-external/hardened-sg2002/board/sg2002/kernel/patches/`: re-base the 8
  osdrv patches; add 6.18 compat; new DT files.
- `buildroot-external/hardened-sg2002/package/`: new `hardened-soph-media`
  (modelled on licheerv's `soph-tpu`); update `hardened-nanokvm-kvmapp` boot file
  list if init scripts change.
- `buildroot-external/hardened-sg2002/board/sg2002/genimage.cfg`, `post-build.sh`:
  new `/boot` contents.
- `buildroot-external/hardened-sg2002/board/sg2002/vendor-sdk-patches/`: re-check
  the two FSBL patches against the licheerv FSBL commit.
- `kvmapp/system/init.d/`: `S00kmod` (module list), `S03usbdev`, `S03usbhid` (drop
  `otg_role`), `S15kvmhwd` (drop alpha; name-based GPIO), `S95nanokvm` (boot-guard
  write stays; module and path checks).
- `server-rust/src/api/vm.rs` and other GPIO users (`rg 'sys/class/gpio'`): GPIO
  lookup by name; `support/sg2002/kvm_system` for `/dev/input/event0` and any GPIO.
- `support/sg2002/kernel/`: new `6.18/` directory for configs and DT; leave 5.10
  until Phase 6.
- `.github/workflows/`: new `system-image-6x.yml`.
- `docs/`: this plan, `ci-image-build.md`, `device-files.md`, `init-scripts.md`,
  `security-model.md`, `guide/install.md` (flash only for the first 6.18 images).

licheerv tree (`buildroot-external-licheervnano`): consumed as a second external.
Prefer not to modify it; if a change is needed (for example making the FIP package
accept a locally built `cvirtos.bin`), keep it as a small separable patch and
consider upstreaming it.

## 9. Open questions and risks

| ID | Item | How to resolve |
| --- | --- | --- |
| Q1 | ~~Integration shape~~ | **Decided:** two externals (section 1.1). |
| Q2 | ~~Boot payload~~ | **Decided:** FIT (section 6.5). Still measure `/boot` headroom and boot time. |
| Q3 | ~~FIP blobs~~ | **Decided:** build from source. Verify in Phase 1 that the SDK/FSBL build produces `ddr_param.bin` and `cvirtos.bin` (the Hardened `vendor-sdk-stock` already builds a FIP). |
| Q4 | RTOS image and its address | Follows Q3: SDK-built FreeRTOS at `0x8fe00000`. Three things must agree: the FSBL `BLCP_2ND_RUNADDR` (`CVIMMAP_FSBL_C906L_START_ADDR`), the RTOS linker origin (`CVIMMAP_FREERTOS_ADDR` in `cv181x_lscript.ld`), and the DT. All derive from the board `memmap.py`, so build them together. Drop licheerv's `0x83f40000` region. |
| Q5 | Where the BOOT-button USB reflash mode lives | Read the wiki's open-source image tree and the FSBL; test on the Lite. |
| Q6 | Which optional media modules to keep (`vo dwa rgn ive mon fb`) | Phase 0 strace. |
| Q7 | GPIO strategy | Phase 1: sysfs stopgap (needs `EXPERT` + `GPIO_SYSFS`) and `gpio-line-names` in the DT from day one. Phase 4: char-device access by line name; `gpio-hog` for static lines. See section 6.4. |
| Q8 | `STRICT_DEVMEM` and the carveout region type | Phase 2 cache/`/dev/mem` test. |
| R1 | Cache coherency and memory attributes on the carveout (stale/corrupt frames) | Phase 2 cache test; Phase 3 soak. |
| R2 | `snsr_i2c` vendor I2C extensions (LT6911 path) | Read the module; may need a small I2C adapter shim. |
| R3 | Modules poke clock/reset/FMUX registers directly beside the mainline clk and pinctrl drivers | Compare `clk_summary` before and after; convert hot spots to the clk/reset API. |
| R4 | No A/B slots; a bad 6.18 image cannot roll back | Fresh-flash-only preview first; document SD recovery. |
| R5 | Cube/PCIe untested | Tester checklist; keep detection logic close to the 5.10 behaviour. |
| R6 | licheerv's repo is young (4 commits) and only partly hardware-verified | Treat its patches as inputs, not as proof. |
| R7 | Two clang-only errors in `cvi_soft_float.c` | Rebuild with GCC. |

## Appendix A: trial-build recipe

Prepare (any Linux host with clang/LLVM 18 or newer, `ld.lld`, `flex`, `bison`,
`libssl-dev`, `libelf-dev`):

```sh
# kernel tree at the target tag; osdrv at the pin
git clone --depth 1 --branch v6.18 https://github.com/torvalds/linux.git linux
git init osdrv && git -C osdrv remote add origin https://github.com/sophgo/osdrv.git
git -C osdrv fetch --depth 1 origin 1b3a49649d18488ecf54fb4fcb6c27599e433fdc
git -C osdrv checkout FETCH_HEAD

make -C linux O=$PWD/kbuild LLVM=1 ARCH=riscv defconfig
make -C linux O=$PWD/kbuild LLVM=1 ARCH=riscv -j"$(nproc)" modules_prepare vmlinux

# apply the patches in the order of rebuild-vendor-external-modules-5.10-baseline.sh
P=buildroot-external/hardened-sg2002/board/sg2002/kernel/patches
for p in soph-module-names linux-5.10.265-compat pwm-from-28215f2 lt-int \
         vi-log-level vi-dci-yuv-bypass sys-carveout-allocator venc-fixes; do
  patch -d osdrv -p1 --forward --fuzz=0 < $P/sophgo-osdrv-1b3a496-$p.patch
done
# DEFINE_SEMAPHORE(x) -> (x, 1)
grep -rlE 'DEFINE_SEMAPHORE\(' osdrv --include=*.c --include=*.h |
  xargs sed -i -E 's/DEFINE_SEMAPHORE\((\w+)\)/DEFINE_SEMAPHORE(\1, 1)/'
```

Build one module directory (repeat for `sys base rtos_cmdqu fast_image cif snsr_i2c
vi vpss dwa vo rgn mon vcodec jpeg cvi_vc_drv`):

```sh
export CVIARCH_L=cv181x CHIP_ARCH_L=cv181x
cd osdrv/interdrv/<dir>
make -k -C <linux> O=<kbuild> LLVM=1 ARCH=riscv M=$PWD \
  CVIARCH=CV181X CHIP_ARCH=CV181X SDK_VER=musl_riscv64 MW_VER=v2 \
  BUILD_PATH=/nonexistent KERNEL_DIR=<linux> CVIARCH_L=cv181x CHIP_ARCH_L=cv181x \
  KCFLAGS="-ferror-limit=0 -Wno-error -w -Wno-incompatible-function-pointer-types \
           -include <stubs>/compat618.h -I<stubs>" modules
```

`<stubs>` also holds a `linux/streamline_annotate.h` with no-op macros
(`ANNOTATE_GREEN`, `ANNOTATE_NAME_CHANNEL`, `ANNOTATE_CHANNEL_COLOR`,
`ANNOTATE_CHANNEL_END`) and a `generated/utsversion.h` defining `UTS_VERSION`
(only needed because `modules_prepare` does not generate it). Remove `-Werror`
from the module Makefiles if clang's warnings interfere. For missing-symbol
checks, compare `llvm-nm -u` of the objects against `llvm-nm --defined-only` of
the same objects and `vmlinux.symvers`.

## Appendix B: compat shim used in the trial

```c
/* compat618.h: force-included with -include. Trial only; port properly. */
#include <linux/version.h>
#include <linux/types.h>
#include <linux/platform_device.h>
#include <linux/of_device.h>
#include <linux/proc_fs.h>
#include <linux/timer.h>
#include <linux/hrtimer.h>
#include <linux/semaphore.h>
#include <linux/vmalloc.h>
#include <linux/sched/prio.h>
#include <linux/time64.h>
#include <linux/device/class.h>
#include "generated/utsversion.h"
#define PDE_DATA(i) pde_data(i)
#define MAX_USER_RT_PRIO MAX_RT_PRIO
#define del_timer_sync(t) timer_delete_sync(t)
#define from_timer(v, cb, f) timer_container_of(v, cb, f)
#define class_create(o, n) class_create(n)
#define I2C_M_WRSTOP 0   /* placeholder: snsr_i2c needs a real answer (R2) */
```

Not covered by the shim, to be done in the sources: `.remove` returning `void`
(one-line signature change per driver), `hrtimer_init` -> `hrtimer_setup`
(different signature), `set_fs/get_fs` in `vdi_osal.c` (use `kernel_read`),
the legacy GPIO calls in `vo_mipi_tx.c` (gpiod), `of_device_id` includes
(`<linux/mod_devicetable.h>`), `<stdbool.h>` -> `<linux/types.h>`,
`MODULE_IMPORT_NS("DMA_BUF")` where `dma_buf_*` is used.

## Appendix C: session start checklist

1. Read sections 1-3 and the phase you are starting.
2. Clone this repo and `buildroot-external-licheervnano`. For the evidence, also
   fetch (read-only) `sophgo/osdrv` and `sophgo/cvi_mpi` at the pins in 4.4, the
   Sipeed `LicheeRV-Nano-Build` SDK at `d88d58f` (sparse: `build/boards/sg200x`,
   `linux_5.10/arch/riscv/boot/dts`, `linux_5.10/drivers/{pinctrl/cvitek,usb/dwc2}`,
   `freertos`, `u-boot-2021.10/{board/cvitek,include/configs}`) and Linux v6.18.
3. The Sipeed wiki pages used: `wiki.sipeed.com/hardware/en/kvm/NanoKVM/`
   (`introduction`, `quick_start`, `system/introduction`, `system/flashing`,
   `development`, `faq`) and `.../NanoKVM_PCIe/` (`introduction`, `quick_start`).
   The sandbox needs `wiki.sipeed.com` allowed under the environment's network
   access.
4. Re-run the Appendix A trial against `v6.18.29` before porting, to refresh the
   error list.
