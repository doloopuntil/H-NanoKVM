#!/bin/sh
# Signs a system-update archive with your own key and wraps it into the one file that
# Settings > System > Updates > Upload system bundle takes. Needs only sh, openssl and tar,
# so it runs on macOS and Linux. Run it from the folder the CI artifact was unpacked into.
set -eu

if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
  echo "usage: sh $0 <private-key.pem> [output-dir]" >&2
  exit 1
fi

KEY="$1"
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
OUT_DIR="${2:-$DIR}"
INFO="$DIR/update-info.env"

[ -f "$KEY" ] || { echo "error: key does not exist: $KEY" >&2; exit 1; }
[ -f "$INFO" ] || { echo "error: update-info.env is missing next to this script" >&2; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo "error: openssl is required" >&2; exit 1; }
openssl pkey -in "$KEY" -noout >/dev/null 2>&1 || {
  echo "error: $KEY is not a readable private key" >&2
  exit 1
}

info() {
  sed -n "s/^$1=//p" "$INFO" | head -n 1
}

VERSION=$(info VERSION)
TARGET=$(info TARGET)
REQUIRED_APP_VERSION=$(info REQUIRED_APP_VERSION)
[ -n "$VERSION" ] && [ -n "$TARGET" ] || { echo "error: update-info.env is incomplete" >&2; exit 1; }

ARCHIVE="$DIR/hardened-nanokvm-system-$VERSION.tar.gz"
[ -f "$ARCHIVE" ] || { echo "error: missing $ARCHIVE" >&2; exit 1; }

WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT INT TERM
mkdir -p "$OUT_DIR"

# the device accepts uploads signed with the local key only under this key id
SYSTEM_UPDATE_SIGNING_KEY="$KEY" \
SYSTEM_UPDATE_SIGNATURE_KEY_ID=local \
CHANNEL=dev \
TARGET="$TARGET" \
SYSTEM_UPDATE_FORMAT=2 \
SYSTEM_UPDATE_REQUIRED_APP_VERSION="$REQUIRED_APP_VERSION" \
  sh "$DIR/create-system-update-metadata.sh" \
  "$VERSION" "hardened-system-$VERSION" "$ARCHIVE" "$WORK/system-latest.json" >/dev/null

sh "$DIR/create-system-update-bundle.sh" \
  "$ARCHIVE" "$WORK/system-latest.json" "$WORK/system-latest.json.sig" \
  "$OUT_DIR/$VERSION.bundle.tar"
