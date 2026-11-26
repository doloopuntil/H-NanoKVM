#!/bin/sh
# Rebuilds an unsigned system-update archive with a smaller rootfs filesystem and a new version,
# so a change to how the image is built can be tried on a device without a CI run. Needs Linux
# with e2fsprogs; the output folder is signed like the CI artifact.
set -eu

die() {
  echo "error: $*" >&2
  exit 1
}

if [ "$#" -ne 4 ]; then
  echo "usage: $0 <archive.tar.gz> <new-version> <filesystem-size, such as 384M> <output-dir>" >&2
  exit 1
fi

IN="$1"
VERSION="$2"
SIZE="$3"
OUT_DIR="$4"
ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

[ -f "$IN" ] || die "archive does not exist: $IN"
[ ! -e "$OUT_DIR" ] || die "refusing to overwrite: $OUT_DIR"
case "$VERSION" in
  "" | *[!A-Za-z0-9._+-]* | .* | *..* | *.) die "invalid version: $VERSION" ;;
esac
case "$SIZE" in
  "" | *[!0-9M]* | *M*M* | [!0-9]*) die "the size must look like 384M" ;;
  *M) ;;
  *) die "the size must end in M, such as 384M" ;;
esac
for tool in tar gzip e2fsck resize2fs dumpe2fs debugfs truncate; do
  command -v "$tool" >/dev/null 2>&1 || die "$tool is required"
done

WORK=$(mktemp -d "${TMPDIR:-/tmp}/repack-system-update.XXXXXX")
trap 'rm -rf "$WORK"' EXIT INT TERM

tar -xzf "$IN" -C "$WORK" manifest.json payload/images
MANIFEST="$WORK/manifest.json"
IMAGES="$WORK/payload/images"
[ -f "$IMAGES/rootfs.sd.gz" ] && [ -f "$IMAGES/boot.vfat.gz" ] ||
  die "the archive has no gzip-compressed raw images"

field() {
  sed -n "s/^  \"$1\": \"\\([^\"]*\\)\".*\$/\\1/p" "$MANIFEST" | head -n 1
}

TARGET=$(field target)
BASE_VERSION=$(field base_version)
KERNEL_VERSION=$(field kernel_version)
REQUIRED_APP_VERSION=$(field required_app_version)
FORMAT=$(field format | sed 's/.*-v\([0-9][0-9]*\)$/\1/')
[ -n "$TARGET" ] && [ -n "$FORMAT" ] || die "unreadable manifest in $IN"

gzip -dc "$IMAGES/rootfs.sd.gz" > "$WORK/rootfs.sd"
gzip -dc "$IMAGES/boot.vfat.gz" > "$WORK/boot.vfat"

ROOTFS_BASE=$(debugfs -R 'cat /etc/kvm/system-version.json' "$WORK/rootfs.sd" 2>/dev/null |
  sed -n 's/.*"base_version": "\([^"]*\)".*/\1/p' | head -n 1)
[ -n "$ROOTFS_BASE" ] || ROOTFS_BASE="$BASE_VERSION"

echo "shrinking the filesystem to $SIZE"
# e2fsck exits 1 when it fixed something, which is fine; anything above is not
e2fsck -fy "$WORK/rootfs.sd" >/dev/null 2>&1 || [ "$?" -le 1 ] || die "the rootfs does not check clean"
resize2fs "$WORK/rootfs.sd" "$SIZE" >/dev/null 2>&1 || die "could not shrink the filesystem to $SIZE"
FS_BLOCKS=$(dumpe2fs -h "$WORK/rootfs.sd" 2>/dev/null | awk -F: '/^Block count:/ { gsub(/ /, "", $2); print $2 }')
FS_BLOCK_SIZE=$(dumpe2fs -h "$WORK/rootfs.sd" 2>/dev/null | awk -F: '/^Block size:/ { gsub(/ /, "", $2); print $2 }')
truncate -s "$((FS_BLOCKS * FS_BLOCK_SIZE))" "$WORK/rootfs.sd"
e2fsck -fn "$WORK/rootfs.sd" >/dev/null 2>&1 || die "the shrunk filesystem does not check clean"
echo "rootfs is now $((FS_BLOCKS * FS_BLOCK_SIZE / 1048576)) MB"

BASE_VERSION="$BASE_VERSION" \
ROOTFS_SYSTEM_BASE_VERSION="$ROOTFS_BASE" \
KERNEL_VERSION="$KERNEL_VERSION" \
RAW_IMAGE_COMPRESSION=gzip \
SYSTEM_UPDATE_FORMAT="$FORMAT" \
SYSTEM_UPDATE_REQUIRED_APP_VERSION="$REQUIRED_APP_VERSION" \
  "$ROOT_DIR/scripts/create-raw-system-update-bundle.sh" \
  "$VERSION" "$TARGET" "$WORK/boot.vfat" "$WORK/rootfs.sd" "$WORK/archive" >/dev/null

mkdir -p "$OUT_DIR"
cp "$WORK/archive/hardened-nanokvm-system-$VERSION.tar.gz" "$OUT_DIR/"
cp "$ROOT_DIR/scripts/sign-local-system-update.sh" \
  "$ROOT_DIR/scripts/create-system-update-metadata.sh" \
  "$ROOT_DIR/scripts/create-system-update-bundle.sh" "$OUT_DIR/"
cat > "$OUT_DIR/update-info.env" <<EOF
VERSION=$VERSION
TARGET=$TARGET
REQUIRED_APP_VERSION=$REQUIRED_APP_VERSION
EOF
ls -l "$OUT_DIR"
