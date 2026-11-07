#!/bin/sh
# Assembles the 6.18 SD image in BINARIES_DIR: boot.vfat (the FIPs, boot.scr and a FIT,
# boot.itb, with kernel, DTB and the recovery initramfs) and rootfs.ext4.
set -eu

BINARIES_DIR=$1
BOARD_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
GENIMAGE_TMP="${BUILD_DIR:-$BINARIES_DIR/..}/genimage-boot.tmp"
INPUT="$BINARIES_DIR/boot-input"
FIT_DIR="$BINARIES_DIR/fit"
# lz4 boots fastest on the Lite (5.9 s to the kernel, against 6.7 s lzma, 6.9 s none)
KERNEL_COMPRESSION="${NANOKVM_KERNEL_COMPRESSION:-lz4}"

rm -rf "$GENIMAGE_TMP" "$INPUT" "$FIT_DIR"
mkdir -p "$INPUT" "$FIT_DIR"

# Initramfs: busybox and e2fsck with their libraries from the target, plus /init.
cpio_list="$FIT_DIR/initramfs.list"
{
	for d in /dev /proc /sys /boot /root /bin /sbin /lib /usr /usr/lib; do
		echo "dir $d 0755 0 0"
	done
	echo "nod /dev/console 0600 0 0 c 5 1"
	echo "file /init $BOARD_DIR/initramfs-init 0755 0 0"
	echo "file /bin/busybox $TARGET_DIR/bin/busybox 0755 0 0"
	# /init runs under /bin/sh before it installs the other applets
	echo "slink /bin/sh busybox 0777 0 0"
	echo "file /sbin/e2fsck $TARGET_DIR/usr/sbin/e2fsck 0755 0 0"
	echo "file /lib/libc.so $TARGET_DIR/lib/libc.so 0755 0 0"
	echo "slink /lib/ld-musl-riscv64.so.1 libc.so 0777 0 0"
	for lib in libext2fs.so.2 libcom_err.so.2 libblkid.so.1 libuuid.so.1 libe2p.so.2; do
		echo "file /usr/lib/$lib $(readlink -f "$TARGET_DIR/usr/lib/$lib") 0755 0 0"
	done
} > "$cpio_list"
GEN_INIT_CPIO="$(ls "$BUILD_DIR"/linux-[0-9]*/usr/gen_init_cpio | head -n 1)"
"$GEN_INIT_CPIO" ${SOURCE_DATE_EPOCH:+-t "$SOURCE_DATE_EPOCH"} "$cpio_list" > "$FIT_DIR/initramfs.cpio"

case "$KERNEL_COMPRESSION" in
none) cp "$BINARIES_DIR/Image" "$FIT_DIR/Image.fit" ;;
lz4) "$HOST_DIR/bin/lz4" -9 -c "$BINARIES_DIR/Image" > "$FIT_DIR/Image.fit" ;;
lzma) "$HOST_DIR/bin/xz" --format=lzma -9 -c "$BINARIES_DIR/Image" > "$FIT_DIR/Image.fit" ;;
*) echo "unknown kernel compression: $KERNEL_COMPRESSION" >&2; exit 1 ;;
esac
cp "$BINARIES_DIR/sg2002-nanokvm-lite.dtb" "$FIT_DIR/"
sed "s/@KERNEL_COMPRESSION@/$KERNEL_COMPRESSION/" "$BOARD_DIR/boot.its" > "$FIT_DIR/boot.its"
(cd "$FIT_DIR" && "$HOST_DIR/bin/mkimage" -f boot.its "$INPUT/boot.itb")
"$HOST_DIR/bin/mkimage" -A riscv -O linux -T script -C none -d "$BOARD_DIR/boot.cmd" "$INPUT/boot.scr"

cp "$BINARIES_DIR/fip.bin" "$BINARIES_DIR/fip.std.bin" "$BINARIES_DIR/fip.od.bin" "$INPUT/"
# flag files read by the init scripts, as on the 5.10 images
touch "$INPUT/usb.dev" "$INPUT/usb.disk0" "$INPUT/usb.rndis0"
printf 'hardened-sg2002-6x.img\n' > "$INPUT/ver"
if [ -n "${SOURCE_DATE_EPOCH:-}" ]; then
	find "$INPUT" -print0 | xargs -0 touch -hd "@$SOURCE_DATE_EPOCH"
fi

genimage \
	--rootpath "$INPUT" \
	--tmppath "$GENIMAGE_TMP" \
	--inputpath "$BINARIES_DIR" \
	--outputpath "$BINARIES_DIR" \
	--config "$BOARD_DIR/genimage.cfg"
