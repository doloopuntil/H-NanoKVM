#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
BUILD_DIR="${BUILD_DIR:-$ROOT_DIR/build}"
STAGE_DIR="${STAGE_DIR:-$BUILD_DIR/kvmapp-rust}"
KVMAPP_STAGE="$STAGE_DIR/kvmapp"
OUT_DIR="${OUT_DIR:-$BUILD_DIR/artifacts}"
RUST_TARGET="${RUST_TARGET:-}"
RUST_BINARY="${RUST_BINARY:-}"
WEB_DIST="${WEB_DIST:-$ROOT_DIR/web/dist}"
APP_VERSION="${APP_VERSION:-}"
ARTIFACT_NAME="${ARTIFACT_NAME:-nanokvm-kvmapp-rust.tar.gz}"
NATIVE_LIB_DIR="${NATIVE_LIB_DIR:-$ROOT_DIR/server-rust/native/dl_lib}"
SOURCE_DATE_EPOCH="${SOURCE_DATE_EPOCH:-1782723554}"

case "$SOURCE_DATE_EPOCH" in
  '' | *[!0-9]*)
    echo "SOURCE_DATE_EPOCH must be a non-negative integer" >&2
    exit 1
    ;;
esac

if [ -z "$RUST_BINARY" ]; then
  if [ -n "$RUST_TARGET" ]; then
    RUST_BINARY="$ROOT_DIR/server-rust/target/$RUST_TARGET/release/nanokvm-rust-server"
  else
    RUST_BINARY="$ROOT_DIR/server-rust/target/release/nanokvm-rust-server"
  fi
fi

if [ ! -x "$RUST_BINARY" ]; then
  echo "missing executable Rust backend: $RUST_BINARY" >&2
  echo "run: make rust-app RUST_TARGET=<target>" >&2
  exit 1
fi

if [ ! -f "$NATIVE_LIB_DIR/libkvm_mmf.so" ]; then
  echo "missing NanoKVM native runtime libraries: $NATIVE_LIB_DIR/libkvm_mmf.so" >&2
  exit 1
fi

rm -rf "$STAGE_DIR"
mkdir -p "$KVMAPP_STAGE/server" "$KVMAPP_STAGE/backends" "$OUT_DIR"
cp -R "$ROOT_DIR/kvmapp/." "$KVMAPP_STAGE/"

if [ -n "$APP_VERSION" ]; then
  printf '%s\n' "$APP_VERSION" > "$KVMAPP_STAGE/version"
elif [ ! -f "$KVMAPP_STAGE/version" ]; then
  printf '0.1.0\n' > "$KVMAPP_STAGE/version"
fi

cp "$RUST_BINARY" "$KVMAPP_STAGE/server/hnanokvm-server"
chmod 0755 "$KVMAPP_STAGE/server/hnanokvm-server"
cp "$RUST_BINARY" "$KVMAPP_STAGE/backends/hnanokvm-server.rust"
chmod 0755 "$KVMAPP_STAGE/backends/hnanokvm-server.rust"

mkdir -p "$KVMAPP_STAGE/server/dl_lib"
cp -R "$NATIVE_LIB_DIR/." "$KVMAPP_STAGE/server/dl_lib/"

# zlib is provided and maintained by Buildroot. Never shadow it with the
# older vendor copy in the application's private RPATH directory.
rm -f "$KVMAPP_STAGE/server/dl_lib/libz.so" \
  "$KVMAPP_STAGE/server/dl_lib/libz.so.1" \
  "$KVMAPP_STAGE/server/dl_lib/libz.so.1.3"

for library in libkvm_mmf.so; do
  if readelf -d "$KVMAPP_STAGE/server/dl_lib/$library" 2>/dev/null | grep -Eq '\((RPATH|RUNPATH)\)'; then
    echo "$library must not contain a build-host RPATH/RUNPATH" >&2
    exit 1
  fi
done

if [ -d "$WEB_DIST" ]; then
  mkdir -p "$KVMAPP_STAGE/server/web"
  cp -R "$WEB_DIST/." "$KVMAPP_STAGE/server/web/"
  # MSW's worker is for `pnpm mocked` only.
  rm -f "$KVMAPP_STAGE/server/web/mockServiceWorker.js"
  # The server sends the .gz copy to a browser that accepts gzip.
  find "$KVMAPP_STAGE/server/web" -type f \
    \( -name '*.js' -o -name '*.css' -o -name '*.html' -o -name '*.svg' \) \
    -exec gzip -9 -n -k {} +
else
  echo "warning: frontend dist not found at $WEB_DIST; package has no server/web assets" >&2
fi

{
  printf 'artifact: kvmapp-rust\n'
  printf 'source: %s\n' "$(git -C "$ROOT_DIR" rev-parse --short HEAD 2>/dev/null || printf unknown)"
  printf 'rust_binary: kvmapp/server/hnanokvm-server\n'
  printf 'rust_binary_sha256: %s\n' "$(sha256sum "$KVMAPP_STAGE/server/hnanokvm-server" | awk '{print $1}')"
  printf 'rust_target: %s\n' "${RUST_TARGET:-host}"
  printf 'web_dist: kvmapp/server/web\n'
  printf 'app_version: %s\n' "$(cat "$KVMAPP_STAGE/version")"
  printf 'native_lib_dir: kvmapp/server/dl_lib\n'
  printf 'source_date_epoch: %s\n' "$SOURCE_DATE_EPOCH"
} > "$STAGE_DIR/MANIFEST.txt"

if grep -Fq "$ROOT_DIR" "$STAGE_DIR/MANIFEST.txt"; then
  echo "application manifest leaks the build-host project path" >&2
  exit 1
fi

if find "$KVMAPP_STAGE" \( -name 'jpg_stream' -o -name 'kvm_stream' -o -name 'kvm_new_app' -o -name 'kvm_new_img' \) | grep -q .; then
  echo "legacy app migration artifact found in staged kvmapp" >&2
  exit 1
fi

ARCHIVE="$OUT_DIR/$ARTIFACT_NAME"
tar -C "$STAGE_DIR" \
  --sort=name \
  --format=gnu \
  --mtime="@$SOURCE_DATE_EPOCH" \
  --owner=0 \
  --group=0 \
  --numeric-owner \
  --mode='u+rwX,go+rX,go-w' \
  --dereference \
  --hard-dereference \
  -cf - kvmapp MANIFEST.txt | gzip -n -9 > "$ARCHIVE"
if tar -tzvf "$ARCHIVE" | awk '
  substr($1, 1, 1) != "-" && substr($1, 1, 1) != "d" { bad = 1 }
  END { exit bad ? 0 : 1 }
'; then
  echo "application archive contains an entry type rejected by the hardened updater" >&2
  exit 1
fi
sha256sum "$ARCHIVE" > "$ARCHIVE.sha256"

echo "$ARCHIVE"
