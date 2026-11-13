#!/usr/bin/env bash
# Builds the Linux 6.18 SD image (hardened_sg2002_nanokvm_6x_defconfig) and checks what it holds.
#   build     Buildroot make without the post-image step, kernel and rootfs checks, and
#             HNANOKVM_6X_HANDOFF (a tar.zst of what assemble needs)
#   assemble  post-image.sh (boot.vfat with the FIT, the SD image) and the boot checks
# With no argument it runs both. CI runs them as separate jobs, so a failure in assembly
# reruns in minutes.
set -euo pipefail

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
STAGE="${1:-all}"
BUILDROOT_SOURCE="${LATEST_BUILDROOT_SOURCE_DIR:-$ROOT/build/latestbuildroot/buildroot-2026.05.1-raw11-security}"
OUTPUT_DIR="${HARDENED_SG2002_6X_OUTPUT_DIR:-$ROOT/build/latestbuildroot/sg2002-6x}"
REPORT_DIR="${HARDENED_SG2002_6X_REPORT_DIR:-$ROOT/build/latestbuildroot/sg2002-6x-report}"
HANDOFF="${HNANOKVM_6X_HANDOFF:-$OUTPUT_DIR.handoff.tar.zst}"
KVMAPP_DIR="${NANOKVM_KVMAPP_SOURCE_DIR:-$ROOT/build/kvmapp-rust/kvmapp}"
LICHEERV_DIR="${LICHEERV_EXTERNAL_DIR:-$ROOT/build/buildroot-external-licheervnano}"
BOARD_DIR="$ROOT/buildroot-external/hardened-sg2002/board/sg2002/linux-6.18"
EXPECTED_KERNEL_RELEASE="${EXPECTED_KERNEL_RELEASE:-6.18.29}"
EXPECTED_TARGET="${EXPECTED_SYSTEM_TARGET:-sg2002-hnanokvm-sd}"
MEDIA_MODULES="soph_sys soph_base soph_mipi_rx soph_vi soph_vpss soph_dwa soph_vo soph_rgn soph_vcodec soph_jpeg soph_vc_driver"
KERNEL_PATCHES="0001-usb-dwc2-gadget-read-DTXFSTS-by-endpoint-index.patch
0002-usb-dwc2-use-DMA-on-Sophgo-CV18xx.patch
0003-riscv-mm-reserve-the-DTB-before-reserved-memory.patch
0004-pinctrl-sophgo-cv18xx-allow-plain-functions-on-dual-mux-pins.patch
0005-pinctrl-sophgo-cv18xx-support-bias-disable.patch
0006-rtc-cv1800-expose-info-and-reason-registers-as-nvmem.patch
0007-soc-sophgo-cv1800-rtcsys-restart-through-the-rtc-warm-reset.patch"

die() {
	echo "error: $*" >&2
	exit 1
}

require_commands() {
	for command in "$@"; do
		command -v "$command" >/dev/null 2>&1 || die "required command is missing: $command"
	done
}

build_stage() {
	: "${NANOKVM_VENDOR_RUNTIME_SOURCE_DIR:?set NANOKVM_VENDOR_RUNTIME_SOURCE_DIR}"
	: "${EXPECTED_SYSTEM_VERSION:?set EXPECTED_SYSTEM_VERSION}"
	: "${EXPECTED_KVMAPP_VERSION:?set EXPECTED_KVMAPP_VERSION}"
	: "${EXPECTED_SECURITY_PATCH_LEVEL:?set EXPECTED_SECURITY_PATCH_LEVEL}"
	require_commands debugfs readelf strings zstd
	[ -f "$LICHEERV_DIR/external.desc" ] || die "missing licheerv external: run scripts/fetch-licheerv-external.sh"
	[ -e "$OUTPUT_DIR" ] && die "refusing to reuse Buildroot output: $OUTPUT_DIR"
	[ -e "$REPORT_DIR" ] && die "refusing to reuse report directory: $REPORT_DIR"
	mkdir -p "$REPORT_DIR"

	LATEST_BUILDROOT_SOURCE_DIR="$BUILDROOT_SOURCE" \
	HARDENED_SG2002_BUILDROOT_OUTPUT_DIR="$OUTPUT_DIR" \
	HARDENED_SG2002_DEFCONFIG=hardened_sg2002_nanokvm_6x_defconfig \
	HARDENED_SG2002_EXTRA_EXTERNALS="$LICHEERV_DIR" \
		"$ROOT/scripts/configure-latest-buildroot-sg2002.sh"

	# post-image.sh runs in the assemble stage
	LATEST_BUILDROOT_SOURCE_DIR="$BUILDROOT_SOURCE" \
	HARDENED_SG2002_BUILDROOT_OUTPUT_DIR="$OUTPUT_DIR" \
	NANOKVM_VENDOR_RUNTIME_SOURCE_DIR="$NANOKVM_VENDOR_RUNTIME_SOURCE_DIR" \
	NANOKVM_KVMAPP_SOURCE_DIR="$KVMAPP_DIR" \
	HARDENED_SG2002_RUNTIME_SYSTEM_VERSION="$EXPECTED_SYSTEM_VERSION" \
	HARDENED_SG2002_RUNTIME_KERNEL_VERSION="$EXPECTED_KERNEL_RELEASE" \
	HARDENED_SG2002_RUNTIME_SECURITY_PATCH_LEVEL="$EXPECTED_SECURITY_PATCH_LEVEL" \
	BUILDROOT_PORT_MAKE_ARGS="BR2_ROOTFS_POST_IMAGE_SCRIPT=" \
		"$ROOT/scripts/build-latest-buildroot-sg2002-rootfs.sh"

	IMAGES="$OUTPUT_DIR/images"
	for file in rootfs.ext4 Image sg2002-nanokvm-lite.dtb fip.bin fip.std.bin fip.od.bin; do
		[ -f "$IMAGES/$file" ] || die "missing build output: $IMAGES/$file"
	done
	# post-image.sh runs these in the assemble stage
	for tool in lz4 mkimage genimage mkdosfs mcopy; do
		[ -x "$OUTPUT_DIR/host/bin/$tool" ] || [ -x "$OUTPUT_DIR/host/sbin/$tool" ] || \
			die "Buildroot built no host $tool"
	done
	[ -x "$OUTPUT_DIR/build/linux-$EXPECTED_KERNEL_RELEASE/usr/gen_init_cpio" ] || die "missing gen_init_cpio"

	# Kernel: release string and our kernel patches
	strings "$IMAGES/Image" | grep -q "^Linux version $EXPECTED_KERNEL_RELEASE " || \
		die "Image is not Linux $EXPECTED_KERNEL_RELEASE"
	applied="$OUTPUT_DIR/build/linux-$EXPECTED_KERNEL_RELEASE/.applied_patches_list"
	[ -f "$applied" ] || die "missing $applied"
	printf '%s\n' "$KERNEL_PATCHES" | while IFS= read -r patch; do
		grep -q "/$patch\$" "$applied" || die "kernel patch not applied: $patch"
	done

	# Kernel: no /dev/mem, signed modules only, lockdown (integrity), memory-safety hardening
	kconfig="$OUTPUT_DIR/build/linux-$EXPECTED_KERNEL_RELEASE/.config"
	[ -f "$kconfig" ] || die "missing $kconfig"
	for option in CONFIG_DEVMEM CONFIG_DEVPORT CONFIG_LEGACY_PTYS CONFIG_PROC_PAGE_MONITOR; do
		grep -qx "# $option is not set" "$kconfig" || die "kernel has $option"
	done
	for option in CONFIG_MODULE_SIG_FORCE CONFIG_MODULE_SIG_ALL CONFIG_SECURITY_LOCKDOWN_LSM_EARLY \
		CONFIG_LOCK_DOWN_KERNEL_FORCE_INTEGRITY CONFIG_HARDENED_USERCOPY CONFIG_FORTIFY_SOURCE \
		CONFIG_SLAB_FREELIST_HARDENED CONFIG_SLAB_BUCKETS CONFIG_INIT_ON_FREE_DEFAULT_ON \
		CONFIG_LIST_HARDENED CONFIG_BUG_ON_DATA_CORRUPTION CONFIG_RANDOMIZE_KSTACK_OFFSET_DEFAULT \
		CONFIG_SCHED_STACK_END_CHECK; do
		grep -qx "$option=y" "$kconfig" || die "kernel lacks $option"
	done
	unsigned=$(find "$OUTPUT_DIR/target/lib/modules" -name '*.ko' -type f | while IFS= read -r ko; do
		tail -c 28 "$ko" | grep -q '~Module signature appended~' || echo "$ko"
	done)
	[ -z "$unsigned" ] || die "unsigned modules: $unsigned"
	! grep -aq '/dev/mem' "$OUTPUT_DIR/target/usr/bin/busybox" || die "BusyBox still has devmem"

	# U-Boot: no autoboot delay
	uboot_config="$(find "$OUTPUT_DIR/build" -maxdepth 2 -path '*/uboot-*/.config' | head -n 1)"
	[ -n "$uboot_config" ] || die "missing U-Boot .config"
	grep -qx 'CONFIG_BOOTDELAY=0' "$uboot_config" || die "U-Boot BOOTDELAY is not 0"

	# Rootfs: the media and Wi-Fi modules, libkvm's GCC runtime and the update metadata
	ROOTFS="$IMAGES/rootfs.ext4"
	debugfs -R "ls -l /lib/modules/$EXPECTED_KERNEL_RELEASE/extra" "$ROOTFS" \
		> "$REPORT_DIR/media-modules.txt" 2>/dev/null
	for module in $MEDIA_MODULES; do
		grep -q " $module.ko\$" "$REPORT_DIR/media-modules.txt" || die "rootfs lacks $module.ko"
	done
	debugfs -R "ls -l /lib/modules/$EXPECTED_KERNEL_RELEASE/extra/aic8800" "$ROOTFS" \
		> "$REPORT_DIR/wifi-modules.txt" 2>/dev/null
	for module in aic8800_bsp aic8800_fdrv; do
		grep -q " $module.ko\$" "$REPORT_DIR/wifi-modules.txt" || die "rootfs lacks $module.ko"
	done
	grep -aq 'mmc-pwrseq-simple' "$IMAGES/sg2002-nanokvm-lite.dtb" || die "DTB lacks the Wi-Fi pwrseq"
	for file in /etc/modprobe.d/aic8800.conf /lib/firmware/regulatory.db /lib/firmware/regulatory.db.p7s; do
		debugfs -R "stat $file" "$ROOTFS" 2>/dev/null | grep -q "Type: regular" || die "rootfs lacks $file"
	done
	for lib in libstdc++.so.6.0.28 libgcc_s.so.1 libgomp.so.1.0.0 libatomic.so.1.2.0; do
		debugfs -R "stat /kvmapp/server/dl_lib/$lib" "$ROOTFS" 2>/dev/null | \
			grep -q "Type: regular" || die "rootfs lacks $lib"
	done
	# libsys maps media buffers through /dev/cvi-sys, never /dev/mem
	debugfs -R "dump /kvmapp/server/dl_lib/libsys.so $REPORT_DIR/libsys.so" "$ROOTFS" >/dev/null 2>&1
	grep -aq '/dev/cvi-sys' "$REPORT_DIR/libsys.so" || die "libsys.so does not map through /dev/cvi-sys"
	! grep -aq '/dev/mem' "$REPORT_DIR/libsys.so" || die "libsys.so still opens /dev/mem"
	debugfs -R "dump /etc/kvm/system-version.json $REPORT_DIR/system-version.json" "$ROOTFS" \
		>/dev/null 2>&1
	grep -q "\"target\": \"$EXPECTED_TARGET\"" "$REPORT_DIR/system-version.json" || \
		die "system-version.json target is not $EXPECTED_TARGET"
	grep -q "\"kernel_version\": \"$EXPECTED_KERNEL_RELEASE\"" "$REPORT_DIR/system-version.json" || \
		die "system-version.json kernel_version is not $EXPECTED_KERNEL_RELEASE"
	EXPECTED_KVMAPP_VERSION="$EXPECTED_KVMAPP_VERSION" \
		"$ROOT/scripts/validate-nanokvm-rootfs.sh" "$ROOTFS"
	"$ROOT/scripts/validate-6x-rootfs.sh" "$ROOTFS" || die "rootfs checks failed"

	# The date Buildroot stamps files with, so assembly matches a one-pass build
	make -s -C "$BUILDROOT_SOURCE" O="$OUTPUT_DIR" printvars VARS=SOURCE_DATE_EPOCH \
		| sed -n 's/^SOURCE_DATE_EPOCH=//p' > "$OUTPUT_DIR/source-date-epoch"
	[ -s "$OUTPUT_DIR/source-date-epoch" ] || die "could not read SOURCE_DATE_EPOCH"

	# What post-image.sh reads: the images, the host tools (without the cross toolchain),
	# gen_init_cpio, and the initramfs binaries from the target (merged /usr).
	(
		cd "$OUTPUT_DIR"
		{
			echo source-date-epoch
			echo images
			echo "build/linux-$EXPECTED_KERNEL_RELEASE/usr/gen_init_cpio"
			echo target/bin
			echo target/lib
			echo target/sbin
			echo target/usr/bin/busybox
			echo target/usr/sbin/e2fsck
			echo target/usr/lib/libc.so
			find target/usr/lib -maxdepth 1 \( -name 'libext2fs.so*' -o -name 'libcom_err.so*' \
				-o -name 'libblkid.so*' -o -name 'libuuid.so*' -o -name 'libe2p.so*' \)
			find host -mindepth 1 -maxdepth 1 ! -name 'riscv64-buildroot-linux-musl' \
				! -name libexec ! -name share ! -name include
		} > "$REPORT_DIR/handoff-files.txt"
		tar --exclude=host/lib/gcc --exclude=images/rootfs.tar -cf - -T "$REPORT_DIR/handoff-files.txt" | zstd -q -T0 -o "$HANDOFF"
	)
	ls -l "$HANDOFF"
}

assemble_stage() {
	require_commands mdir sha256sum
	IMAGES="$OUTPUT_DIR/images"
	[ -f "$OUTPUT_DIR/source-date-epoch" ] || die "missing $OUTPUT_DIR/source-date-epoch"
	mkdir -p "$REPORT_DIR"

	PATH="$OUTPUT_DIR/host/bin:$OUTPUT_DIR/host/sbin:$PATH" \
	HOST_DIR="$OUTPUT_DIR/host" \
	BUILD_DIR="$OUTPUT_DIR/build" \
	TARGET_DIR="$OUTPUT_DIR/target" \
	BINARIES_DIR="$IMAGES" \
	SOURCE_DATE_EPOCH="$(cat "$OUTPUT_DIR/source-date-epoch")" \
		sh "$BOARD_DIR/post-image.sh" "$IMAGES"

	for file in hardened-sg2002-6x.img boot.vfat; do
		[ -f "$IMAGES/$file" ] || die "missing post-image output: $IMAGES/$file"
	done

	# Boot partition: FIPs, boot script and a FIT with kernel, DTB and initramfs
	mdir -i "$IMAGES/boot.vfat" -b ::/ > "$REPORT_DIR/boot-files.txt"
	for file in fip.bin fip.std.bin fip.od.bin boot.scr boot.itb ver; do
		grep -qx "::/$file" "$REPORT_DIR/boot-files.txt" || die "boot.vfat lacks $file"
	done
	"$OUTPUT_DIR/host/bin/mkimage" -l "$IMAGES/boot-input/boot.itb" > "$REPORT_DIR/boot-itb.txt"
	grep -q "Compression:  lz4 compressed" "$REPORT_DIR/boot-itb.txt" || die "FIT kernel is not lz4"
	grep -q "Type:         RAMDisk Image" "$REPORT_DIR/boot-itb.txt" || die "FIT has no initramfs"
	grep -q "Type:         Flat Device Tree" "$REPORT_DIR/boot-itb.txt" || die "FIT has no DTB"

	sha256sum "$IMAGES/hardened-sg2002-6x.img" "$IMAGES/boot.vfat" "$IMAGES/rootfs.ext4" \
		"$IMAGES/boot-input/boot.itb" > "$REPORT_DIR/sha256.txt"
	cat > "$REPORT_DIR/summary.md" <<EOF
- target **$EXPECTED_TARGET**, kernel **Linux $EXPECTED_KERNEL_RELEASE**, kernel patches 0001-0007 applied
- boot partition: FIPs, boot.scr, boot.itb (lz4 kernel, DTB, recovery initramfs)
- media modules in /lib/modules/$EXPECTED_KERNEL_RELEASE/extra: **$(echo $MEDIA_MODULES | wc -w)**
- rootfs validation: **pass**
EOF
	cat "$REPORT_DIR/summary.md"
}

case "$STAGE" in
build) build_stage ;;
assemble) assemble_stage ;;
all)
	build_stage
	assemble_stage
	;;
*) die "usage: $0 [build|assemble]" ;;
esac
