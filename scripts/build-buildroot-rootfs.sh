#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILDROOT_VERSION="${BUILDROOT_VERSION:-2026.05.1}"
PROBE_ROOT="${HNANOKVM_BUILDROOT_ROOT:-$ROOT/build/buildroot}"
UPSTREAM_DIR="${HNANOKVM_BUILDROOT_SOURCE_DIR:-$PROBE_ROOT/buildroot-${BUILDROOT_VERSION}-raw11-security}"
OUTPUT_DIR="${HNANOKVM_BUILDROOT_OUTPUT_DIR:-$PROBE_ROOT/sg2002-config-${BUILDROOT_VERSION}-raw11}"
HOST_DEPS_ROOT="${BUILDROOT_PORT_HOST_DEPS:-$ROOT/build/host-deps}"
KVMAPP_DIR="${NANOKVM_KVMAPP_SOURCE_DIR:-$ROOT/build/kvmapp-rust/kvmapp}"
USER_HOME="$HOME"
HOST_DEPS_PATH="$HOST_DEPS_ROOT/usr/sbin:$HOST_DEPS_ROOT/usr/bin"
CLEAN_PATH="${BUILDROOT_PORT_CLEAN_PATH:-$HOST_DEPS_PATH:$USER_HOME/.local/bin:$USER_HOME/.cargo/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin}"
JOBS="${BUILDROOT_PORT_JOBS:-4}"
RUNTIME_KERNEL_VERSION="${HNANOKVM_RUNTIME_KERNEL_VERSION:-}"
RUNTIME_SECURITY_PATCH_LEVEL="${HNANOKVM_RUNTIME_SECURITY_PATCH_LEVEL:-}"
RUNTIME_SYSTEM_VERSION="${HNANOKVM_RUNTIME_SYSTEM_VERSION:-}"
# Extra make arguments, word-split (the 6.x CI passes BR2_ROOTFS_POST_IMAGE_SCRIPT= to run it later)
EXTRA_MAKE_ARGS="${BUILDROOT_PORT_MAKE_ARGS:-}"
# 1: build only the cross-compiler and musl (no application payload needed yet)
TOOLCHAIN_ONLY="${BUILDROOT_PORT_TOOLCHAIN_ONLY:-}"

[ -f "$UPSTREAM_DIR/Makefile" ] || {
  echo "missing Buildroot source: $UPSTREAM_DIR" >&2
  exit 1
}

[ -f "$OUTPUT_DIR/.config" ] || {
  echo "missing SG2002 port configuration: $OUTPUT_DIR/.config" >&2
  echo "run: make buildroot-configure" >&2
  exit 1
}

case "$JOBS" in
  ''|*[!0-9]*|0)
    echo "BUILDROOT_PORT_JOBS must be a positive integer" >&2
    exit 1
    ;;
esac

if ! PATH="$CLEAN_PATH" command -v cpio >/dev/null 2>&1; then
  echo "missing cpio in BUILDROOT_PORT_CLEAN_PATH" >&2
  echo "install host build dependencies or set BUILDROOT_PORT_HOST_DEPS" >&2
  exit 1
fi

if [ "$TOOLCHAIN_ONLY" = 1 ]; then
  EXTRA_MAKE_ARGS="$EXTRA_MAKE_ARGS toolchain"
elif grep -qx 'BR2_PACKAGE_HNANOKVM_KVMAPP=y' "$OUTPUT_DIR/.config"; then
  [ -x "$KVMAPP_DIR/server/hnanokvm-server" ] || {
    echo "missing built Hardened NanoKVM payload: $KVMAPP_DIR" >&2
    exit 1
  }
fi

exec env -i \
  HOME="$USER_HOME" \
  USER="${USER:-$(id -un)}" \
  LOGNAME="${LOGNAME:-${USER:-$(id -un)}}" \
  SHELL=/bin/bash \
  PATH="$CLEAN_PATH" \
  NANOKVM_KVMAPP_SOURCE_DIR="$KVMAPP_DIR" \
  HNANOKVM_RUNTIME_SYSTEM_VERSION="$RUNTIME_SYSTEM_VERSION" \
  HNANOKVM_RUNTIME_KERNEL_VERSION="$RUNTIME_KERNEL_VERSION" \
  HNANOKVM_RUNTIME_SECURITY_PATCH_LEVEL="$RUNTIME_SECURITY_PATCH_LEVEL" \
  make -C "$UPSTREAM_DIR" O="$OUTPUT_DIR" -j"$JOBS" $EXTRA_MAKE_ARGS
