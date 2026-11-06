#!/bin/sh
# Assembles the 6.18 boot partition (boot.vfat) in BINARIES_DIR.
set -eu

BINARIES_DIR=$1
BOARD_DIR="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
GENIMAGE_TMP="${BUILD_DIR:-$BINARIES_DIR/..}/genimage-boot.tmp"
INPUT="$BINARIES_DIR/boot-input"

rm -rf "$GENIMAGE_TMP" "$INPUT"
mkdir -p "$INPUT/extlinux"
cp "$BINARIES_DIR/fip.bin" "$BINARIES_DIR/fip.std.bin" "$BINARIES_DIR/fip.od.bin" \
	"$BINARIES_DIR/Image" "$BINARIES_DIR/sg2002-nanokvm-lite.dtb" "$INPUT/"
cp "$BOARD_DIR/extlinux.conf" "$INPUT/extlinux/extlinux.conf"
# flag files read by the init scripts, as on the 5.10 images
touch "$INPUT/usb.dev" "$INPUT/usb.disk0" "$INPUT/usb.rndis0"
printf 'hardened-sg2002-6x.img\n' > "$INPUT/ver"
if [ -n "${SOURCE_DATE_EPOCH:-}" ]; then
	find "$INPUT" -print0 | xargs -0 touch -hd "@$SOURCE_DATE_EPOCH"
fi

genimage \
	--rootpath "$INPUT" \
	--tmppath "$GENIMAGE_TMP" \
	--inputpath "$INPUT" \
	--outputpath "$BINARIES_DIR" \
	--config "$BOARD_DIR/genimage-boot.cfg"
