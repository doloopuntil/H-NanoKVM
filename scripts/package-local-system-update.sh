#!/bin/sh
# CI step: turns the assembled SD image into the unsigned raw system-update archive and puts it,
# with the signing helper, in one folder that the workflow uploads as an artifact.
set -eu

if [ "$#" -ne 2 ]; then
  echo "usage: $0 <sd-image> <output-dir>" >&2
  echo "environment: SYSTEM_VERSION KERNEL_VERSION SECURITY_PATCH_LEVEL BUILDROOT_VERSION" >&2
  echo "             REQUIRED_APP_VERSION [TARGET]" >&2
  exit 1
fi

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
SD_IMAGE="$1"
OUT_DIR="$2"
TARGET="${TARGET:-sg2002-hnanokvm-sd}"
: "${SYSTEM_VERSION:?}" "${KERNEL_VERSION:?}" "${SECURITY_PATCH_LEVEL:?}"
: "${BUILDROOT_VERSION:?}" "${REQUIRED_APP_VERSION:?}"

[ -f "$SD_IMAGE" ] || { echo "missing SD image: $SD_IMAGE" >&2; exit 1; }
[ ! -e "$OUT_DIR" ] || { echo "refusing to overwrite: $OUT_DIR" >&2; exit 1; }

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT INT TERM

"$ROOT/scripts/extract-sd-raw-images.sh" "$SD_IMAGE" "$WORK/images" >/dev/null

BASE_VERSION="Buildroot-$BUILDROOT_VERSION-port" \
ROOTFS_SYSTEM_BASE_VERSION="Buildroot $BUILDROOT_VERSION port" \
KERNEL_VERSION="$KERNEL_VERSION" \
SECURITY_PATCH_LEVEL="$SECURITY_PATCH_LEVEL" \
RAW_IMAGE_COMPRESSION=gzip \
SYSTEM_UPDATE_FORMAT=2 \
SYSTEM_UPDATE_REQUIRED_APP_VERSION="$REQUIRED_APP_VERSION" \
  "$ROOT/scripts/create-raw-system-update-bundle.sh" \
  "$SYSTEM_VERSION" "$TARGET" \
  "$WORK/images/boot.vfat" "$WORK/images/rootfs.sd" "$WORK/archive"

mkdir -p "$OUT_DIR"
cp "$WORK/archive/hardened-nanokvm-system-$SYSTEM_VERSION.tar.gz" "$OUT_DIR/"
cp "$ROOT/scripts/sign-local-system-update.sh" \
  "$ROOT/scripts/create-system-update-metadata.sh" \
  "$ROOT/scripts/create-system-update-bundle.sh" "$OUT_DIR/"

cat > "$OUT_DIR/update-info.env" <<EOF
VERSION=$SYSTEM_VERSION
TARGET=$TARGET
SECURITY_PATCH_LEVEL=$SECURITY_PATCH_LEVEL
REQUIRED_APP_VERSION=$REQUIRED_APP_VERSION
EOF

cat > "$OUT_DIR/README.txt" <<EOF
Unsigned Hardened NanoKVM system update $SYSTEM_VERSION (raw boot and rootfs images).

Sign it with the private key whose public half you set under Settings > System > Updates >
Local update key, then upload the result with "Upload system bundle":

  sh sign-local-system-update.sh /path/to/local.pem

This writes $SYSTEM_VERSION.bundle.tar next to the script. It needs only sh, openssl and tar.
A raw update has no automatic rollback; keep a way to reflash the SD card.
EOF

ls -l "$OUT_DIR"
