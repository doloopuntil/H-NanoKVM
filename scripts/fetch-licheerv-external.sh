#!/usr/bin/env bash
# Fetches the pinned licheerv BR2_EXTERNAL tree the 6.x build layers under ours.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO="${LICHEERV_EXTERNAL_REPO:-https://github.com/lone0/buildroot-external-licheervnano.git}"
EXPECTED_SHA="${LICHEERV_EXTERNAL_SHA:-019ffc864bb9353f823afc98f7dd9fdacfa935cb}"
DIR="${LICHEERV_EXTERNAL_DIR:-$ROOT/build/buildroot-external-licheervnano}"

if [ ! -d "$DIR/.git" ]; then
  git init -q "$DIR"
  git -C "$DIR" remote add origin "$REPO"
fi

origin_url="$(git -C "$DIR" config --get remote.origin.url)"
if [ "$origin_url" != "$REPO" ]; then
  echo "unexpected origin for $DIR: $origin_url" >&2
  exit 1
fi

git -C "$DIR" fetch -q --depth=1 origin "$EXPECTED_SHA"
git -C "$DIR" checkout -q --detach --force FETCH_HEAD

actual_sha="$(git -C "$DIR" rev-parse HEAD)"
if [ "$actual_sha" != "$EXPECTED_SHA" ]; then
  echo "unexpected revision for $DIR: $actual_sha (expected $EXPECTED_SHA)" >&2
  exit 1
fi
if [ -n "$(git -C "$DIR" status --porcelain)" ]; then
  echo "refusing to use a modified checkout: $DIR" >&2
  exit 1
fi
[ -f "$DIR/external.desc" ] || {
  echo "not a BR2_EXTERNAL tree: $DIR" >&2
  exit 1
}
printf '%s\n' "$DIR"
