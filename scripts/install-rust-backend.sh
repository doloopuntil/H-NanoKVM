#!/bin/sh
set -eu

if [ "${1:-}" = "" ]; then
  echo "usage: $0 /path/to/hnanokvm-server" >&2
  exit 2
fi

SRC="$1"
DEST_DIR="/kvmapp/server"
DEST="$DEST_DIR/hnanokvm-server"
BACKUP_DIR="/kvmapp/backends"
RUST_BACKUP="$BACKUP_DIR/hnanokvm-server.rust"

if [ ! -x "$SRC" ]; then
  echo "source binary is missing or not executable: $SRC" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"

# The server runs from $DEST: replace it by renaming, as writing into it fails.
cp "$SRC" "$DEST.new"
chmod 0755 "$DEST.new"
mv "$DEST.new" "$DEST"
cp "$SRC" "$RUST_BACKUP"
chmod 0755 "$RUST_BACKUP"
/etc/init.d/S95nanokvm restart
