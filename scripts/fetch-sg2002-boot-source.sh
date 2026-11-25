#!/usr/bin/env bash
# Checkout of Sophgo's FSBL (sophgo/fsbl, branch sg200x-dev) that the 6.18 boot chain builds from.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

FSBL_REPO="${SOPHGO_FSBL_REPO:-https://github.com/sophgo/fsbl.git}"
FSBL_EXPECTED_SHA="${SOPHGO_FSBL_SHA:-5a80c127cf614dea7f534d5b5352886a1c720d37}"
DIR="${HNANOKVM_BOOT_SOURCE_DIR:-$ROOT/build/sg2002-boot-source}"

if [ ! -d "$DIR/.git" ]; then
  git init -q "$DIR"
  git -C "$DIR" remote add origin "$FSBL_REPO"
fi

origin_url="$(git -C "$DIR" config --get remote.origin.url)"
if [ "$origin_url" != "$FSBL_REPO" ]; then
  echo "unexpected origin for $DIR: $origin_url (remove it to fetch again)" >&2
  exit 1
fi

git -C "$DIR" fetch -q --depth=1 origin "$FSBL_EXPECTED_SHA"
git -C "$DIR" checkout -q --detach --force FETCH_HEAD

actual_sha="$(git -C "$DIR" rev-parse HEAD)"
if [ "$actual_sha" != "$FSBL_EXPECTED_SHA" ]; then
  echo "unexpected revision for $DIR: $actual_sha (expected $FSBL_EXPECTED_SHA)" >&2
  exit 1
fi
if [ -n "$(git -C "$DIR" status --porcelain)" ]; then
  echo "refusing to use a modified checkout: $DIR" >&2
  exit 1
fi

printf '%s %s\n' "$actual_sha" "$DIR"
