#!/usr/bin/env bash
# Sparse checkout of the vendor SDK parts the 6.18 boot chain builds from (FSBL, board memmap).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

SDK_REPO="${LICHEERV_NANO_SDK_REPO:-https://github.com/sipeed/LicheeRV-Nano-Build.git}"
SDK_EXPECTED_SHA="${LICHEERV_NANO_SDK_SHA:-d88d58feca49ef15f4cc7bd1f27dbf17dc25f85e}"
DIR="${HARDENED_SG2002_BOOT_SOURCE_DIR:-$ROOT/build/sg2002-boot-source}"

if [ ! -d "$DIR/.git" ]; then
  git init -q "$DIR"
  git -C "$DIR" remote add origin "$SDK_REPO"
  git -C "$DIR" config core.sparseCheckout true
fi

origin_url="$(git -C "$DIR" config --get remote.origin.url)"
if [ "$origin_url" != "$SDK_REPO" ]; then
  echo "unexpected origin for $DIR: $origin_url" >&2
  exit 1
fi

git -C "$DIR" sparse-checkout set --no-cone \
  '/fsbl/' \
  '/build/scripts/mmap_conv.py' \
  '/build/boards/sg200x/sg2002_licheervnano_sd/memmap.py'
git -C "$DIR" fetch -q --depth=1 --filter=blob:none origin "$SDK_EXPECTED_SHA"
git -C "$DIR" checkout -q --detach --force FETCH_HEAD

actual_sha="$(git -C "$DIR" rev-parse HEAD)"
if [ "$actual_sha" != "$SDK_EXPECTED_SHA" ]; then
  echo "unexpected revision for $DIR: $actual_sha (expected $SDK_EXPECTED_SHA)" >&2
  exit 1
fi
if [ -n "$(git -C "$DIR" status --porcelain)" ]; then
  echo "refusing to use a modified checkout: $DIR" >&2
  exit 1
fi

printf '%s %s\n' "$actual_sha" "$DIR"
