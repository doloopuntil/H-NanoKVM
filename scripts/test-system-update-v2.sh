#!/usr/bin/env bash
# Format 2 system-update metadata, its signature and the upload bundle, around a stand-in
# archive. The raw archive builder needs a real rootfs; the image build exercises it.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/nanokvm-system-v2-test.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT INT TERM

VERSION=1.0.0
APP_VERSION=3.0.0
TAG="hardened-system-$VERSION"
ARCHIVE_NAME="hardened-nanokvm-system-$VERSION.tar.gz"
ARCHIVE="$WORK/out/$ARCHIVE_NAME"

fail() {
  echo "$*" >&2
  exit 1
}

mkdir -p "$WORK/stage/payload/images" "$WORK/out" "$WORK/meta"
cat > "$WORK/stage/manifest.json" <<EOF
{
  "format": "hardened-nanokvm-system-update-v2",
  "version": "$VERSION",
  "target": "sg2002-hnanokvm-sd",
  "required_app_version": "$APP_VERSION"
}
EOF
printf 'stand-in\n' | gzip -n > "$WORK/stage/payload/images/rootfs.sd.gz"
tar -C "$WORK/stage" -czf "$ARCHIVE" manifest.json payload

openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 \
  -out "$WORK/signing.pem" >/dev/null 2>&1
openssl pkey -in "$WORK/signing.pem" -pubout -out "$WORK/signing.pub.pem" >/dev/null 2>&1

SYSTEM_UPDATE_FORMAT=2 \
SYSTEM_UPDATE_REQUIRED_APP_VERSION="$APP_VERSION" \
CHANNEL=preview \
SYSTEM_UPDATE_SIGNING_KEY="$WORK/signing.pem" \
SYSTEM_UPDATE_SIGNATURE_KEY_ID=hardened-system-test-v2 \
  "$ROOT/scripts/create-system-update-metadata.sh" \
  "$VERSION" "$TAG" "$ARCHIVE" "$WORK/meta/system-latest.json" >/dev/null

grep -Fq '"format": 2' "$WORK/meta/system-latest.json" || fail "metadata is not format 2"
grep -Fq "\"required_app_version\": \"$APP_VERSION\"" "$WORK/meta/system-latest.json" ||
  fail "metadata lacks required_app_version"
"$ROOT/scripts/verify-system-update-metadata.sh" \
  "$WORK/meta/system-latest.json" "$WORK/meta/system-latest.json.sig" \
  "$WORK/signing.pub.pem" >/dev/null

# A changed byte must break the signature.
sed 's/"format": 2/"format": 3/' "$WORK/meta/system-latest.json" > "$WORK/meta/tampered.json"
if "$ROOT/scripts/verify-system-update-metadata.sh" \
  "$WORK/meta/tampered.json" "$WORK/meta/system-latest.json.sig" \
  "$WORK/signing.pub.pem" >/dev/null 2>&1; then
  fail "tampered metadata unexpectedly verified"
fi

if SYSTEM_UPDATE_FORMAT=1 \
  SYSTEM_UPDATE_REQUIRED_APP_VERSION="$APP_VERSION" \
  "$ROOT/scripts/create-system-update-metadata.sh" \
  "$VERSION" "$TAG" "$ARCHIVE" "$WORK/meta/rejected-v1.json" >/dev/null 2>&1; then
  fail "metadata v1 unexpectedly accepted required_app_version"
fi

if SYSTEM_UPDATE_FORMAT=2 \
  "$ROOT/scripts/create-system-update-metadata.sh" \
  "$VERSION" "$TAG" "$ARCHIVE" "$WORK/meta/rejected-v2.json" >/dev/null 2>&1; then
  fail "metadata v2 unexpectedly accepted a missing required_app_version"
fi

# The upload bundle holds exactly the metadata, the signature if any, and the archive.
bundle_entries() {
  tar -tf "$1" | sed 's|^\./||' | sort | tr '\n' ' '
}

"$ROOT/scripts/create-system-update-bundle.sh" "$ARCHIVE" \
  "$WORK/meta/system-latest.json" "$WORK/meta/system-latest.json.sig" \
  "$WORK/out/signed.bundle.tar" >/dev/null
[ "$(bundle_entries "$WORK/out/signed.bundle.tar")" = \
  "$ARCHIVE_NAME system-latest.json system-latest.json.sig " ] ||
  fail "signed bundle entries: $(bundle_entries "$WORK/out/signed.bundle.tar")"
tar -xOf "$WORK/out/signed.bundle.tar" "$ARCHIVE_NAME" | cmp -s - "$ARCHIVE" ||
  fail "bundled archive differs from the input"

"$ROOT/scripts/create-system-update-bundle.sh" "$ARCHIVE" \
  "$WORK/meta/system-latest.json" - "$WORK/out/unsigned.bundle.tar" >/dev/null
[ "$(bundle_entries "$WORK/out/unsigned.bundle.tar")" = \
  "$ARCHIVE_NAME system-latest.json " ] ||
  fail "unsigned bundle entries: $(bundle_entries "$WORK/out/unsigned.bundle.tar")"

printf 'system update v2 metadata, signature and bundle tests passed\n'
