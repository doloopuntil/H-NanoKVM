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
0003-riscv-mm-reserve-the-DTB-before-reserved-memory.patch"

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
	require_commands debugfs strings zstd
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

	# Kernel: release string and the three board patches
	strings "$IMAGES/Image" | grep -q "^Linux version $EXPECTED_KERNEL_RELEASE " || \
		die "Image is not Linux $EXPECTED_KERNEL_RELEASE"
	applied="$OUTPUT_DIR/build/linux-$EXPECTED_KERNEL_RELEASE/.applied_patches_list"
	[ -f "$applied" ] || die "missing $applied"
	printf '%s\n' "$KERNEL_PATCHES" | while IFS= read -r patch; do
		grep -q "/$patch\$" "$applied" || die "kernel patch not applied: $patch"
	done

	# Rootfs: the media modules, the sensor library and the update metadata
	ROOTFS="$IMAGES/rootfs.ext4"
	debugfs -R "ls -l /lib/modules/$EXPECTED_KERNEL_RELEASE/extra" "$ROOTFS" \
		> "$REPORT_DIR/media-modules.txt" 2>/dev/null
	for module in $MEDIA_MODULES; do
		grep -q " $module.ko\$" "$REPORT_DIR/media-modules.txt" || die "rootfs lacks $module.ko"
	done
	debugfs -R "stat /mnt/system/usr/lib/libsns_lt6911.so" "$ROOTFS" 2>/dev/null | \
		grep -q "Type: regular" || die "rootfs lacks libsns_lt6911.so"
	debugfs -R "dump /etc/kvm/system-version.json $REPORT_DIR/system-version.json" "$ROOTFS" \
		>/dev/null 2>&1
	grep -q "\"target\": \"$EXPECTED_TARGET\"" "$REPORT_DIR/system-version.json" || \
		die "system-version.json target is not $EXPECTED_TARGET"
	grep -q "\"kernel_version\": \"$EXPECTED_KERNEL_RELEASE\"" "$REPORT_DIR/system-version.json" || \
		die "system-version.json kernel_version is not $EXPECTED_KERNEL_RELEASE"
	EXPECTED_KVMAPP_VERSION="$EXPECTED_KVMAPP_VERSION" \
		"$ROOT/scripts/validate-nanokvm-rootfs.sh" "$ROOTFS"

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
- target **$EXPECTED_TARGET**, kernel **Linux $EXPECTED_KERNEL_RELEASE**, board patches 0001-0003 applied
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
