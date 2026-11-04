#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="riscv64gc-unknown-linux-musl"
SYSROOT_LIB="${NANOKVM_SYSROOT_LIB:-$ROOT/sysroot/lib}"

if [[ ! -f "$SYSROOT_LIB/libc.so" ]]; then
  echo "missing $SYSROOT_LIB/libc.so" >&2
  echo "copy NanoKVM runtime libs into server-rust/sysroot/lib or set NANOKVM_SYSROOT_LIB" >&2
  exit 1
fi

if [[ ! -e "$SYSROOT_LIB/libgcc_s.so" && -f "$SYSROOT_LIB/libgcc_s.so.1" ]]; then
  ln -sf libgcc_s.so.1 "$SYSROOT_LIB/libgcc_s.so"
fi

if [[ ! -e "$SYSROOT_LIB/libgcc_s.so" ]]; then
  echo "missing $SYSROOT_LIB/libgcc_s.so or libgcc_s.so.1" >&2
  exit 1
fi

RUST_SYSROOT="$(rustc --print sysroot)"
CRT="$RUST_SYSROOT/lib/rustlib/$TARGET/lib/self-contained"

for obj in Scrt1.o crti.o crtbeginS.o crtendS.o crtn.o; do
  if [[ ! -f "$CRT/$obj" ]]; then
    echo "missing Rust CRT object: $CRT/$obj" >&2
    exit 1
  fi
done

export NANOKVM_SYSROOT_LIB="$SYSROOT_LIB"
export RUSTC_BOOTSTRAP="${RUSTC_BOOTSTRAP:-1}"
export CC_riscv64gc_unknown_linux_musl="${CC_riscv64gc_unknown_linux_musl:-clang}"
export CFLAGS_riscv64gc_unknown_linux_musl="${CFLAGS_riscv64gc_unknown_linux_musl:---target=riscv64-unknown-linux-musl -march=rv64gc -mabi=lp64d}"
# The SG2002's C906 core has the T-Head extensions; LLVM has no C906 CPU model,
# so they are enabled one by one (rustc warns that they are unstable).
THEAD_FEATURES="+xtheadba,+xtheadbb,+xtheadbs,+xtheadcondmov,+xtheadmemidx,+xtheadmempair,+xtheadmac"
export RUSTFLAGS="-Z unstable-options \
-C target-feature=-crt-static,$THEAD_FEATURES \
-C link-self-contained=no \
-C link-arg=$CRT/Scrt1.o \
-C link-arg=$CRT/crti.o \
-C link-arg=$CRT/crtbeginS.o \
-C link-arg=$CRT/crtendS.o \
-C link-arg=$CRT/crtn.o \
-C link-arg=--dynamic-linker=/lib/ld-musl-riscv64.so.1 \
-C link-arg=--rpath=/kvmapp/server/dl_lib"

cargo build \
  --manifest-path "$ROOT/Cargo.toml" \
  --release \
  --target "$TARGET" \
  --features linked-libkvm \
  "$@"
