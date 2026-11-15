#!/usr/bin/env bash
# Build libkvm_mmf.so, libkvm.so and kvm_system (support/sg2002) and check what the image
# relies on: stack protector, no vector extension, no RPATH, musl's loader, libkvm's exports.
# Usage: build-sg2002-native.sh CROSS_PREFIX SDK_DIR OUT_DIR
# CROSS_PREFIX: Buildroot's host/bin/riscv64-buildroot-linux-musl-
set -euo pipefail

[ "$#" -eq 3 ] || {
	echo "usage: $0 CROSS_PREFIX SDK_DIR OUT_DIR" >&2
	exit 2
}
PREFIX=$1
SDK_DIR=$2
OUT=$3
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
BUILD=$(mktemp -d)
trap 'rm -rf "$BUILD"' EXIT

cmake -S "$ROOT/support/sg2002" -B "$BUILD" \
	-DCMAKE_TOOLCHAIN_FILE="$ROOT/support/sg2002/cmake/buildroot-musl.cmake" \
	-DSG2002_CROSS_PREFIX="$PREFIX" -DSG2002_SDK_DIR="$SDK_DIR"
cmake --build "$BUILD" --parallel "$(nproc 2>/dev/null || echo 2)"

# No MaixCDK or OpenCV header may reach any object (compiler dependency files).
deps=$(find "$BUILD/CMakeFiles" -name '*.o.d')
[ -n "$deps" ] || {
	echo "no compiler dependency files in $BUILD" >&2
	exit 1
}
if grep -il -e maix -e opencv $deps; then
	echo "MaixCDK or OpenCV headers in the build (files above)" >&2
	exit 1
fi

mkdir -p "$OUT"
for f in libkvm_mmf.so libkvm.so kvm_system; do
	"${PREFIX}strip" --strip-all -R .comment -o "$OUT/$f" "$BUILD/$f"
done
chmod 0755 "$OUT"/*

fail() {
	echo "$*" >&2
	exit 1
}
needed() {
	"${PREFIX}readelf" -d "$1" | sed -n 's/.*(NEEDED).*\[\(.*\)\]/\1/p'
}
# readelf output is kept in variables: grep -q in a pipe would kill it early (pipefail).
for f in libkvm_mmf.so libkvm.so kvm_system; do
	bin="$OUT/$f"
	syms=$("${PREFIX}readelf" --dyn-syms -W "$bin")
	dyn=$("${PREFIX}readelf" -d "$bin")
	attrs=$("${PREFIX}readelf" -A "$bin")
	grep -qw 'UND __stack_chk_fail' <<<"$syms" || fail "$f: no stack protector"
	! grep -Eq '\((RPATH|RUNPATH)\)' <<<"$dyn" || fail "$f: has an RPATH"
	grep -q xtheadmempair <<<"$attrs" || fail "$f: not built for the T-Head extensions"
	! grep -Eq 'v0p7|_v1p0|xtheadvector' <<<"$attrs" || fail "$f: built for the vector extension"
	grep -q 'BIND_NOW' <<<"$dyn" || fail "$f: no full RELRO"
	! grep -Eiq 'opencv|gomp' <<<"$(needed "$bin")" || fail "$f: needs OpenCV or libgomp"
done

grep -q "interpreter: /lib/ld-musl-riscv64.so.1" <<<"$("${PREFIX}readelf" -l "$OUT/kvm_system")" ||
	fail "kvm_system: wrong loader"
for lib in $(needed "$OUT/kvm_system"); do
	case "$lib" in
	libstdc++.so.6 | libgcc_s.so.1 | libc.so) ;;
	*) fail "unexpected NEEDED entry in kvm_system: $lib" ;;
	esac
done
for lib in $(needed "$OUT/libkvm.so"); do
	case "$lib" in
	libkvm_mmf.so | libstdc++.so.6 | libgcc_s.so.1 | libc.so) ;;
	*) fail "unexpected NEEDED entry in libkvm.so: $lib" ;;
	esac
done

# libkvm.so exports exactly the C API the server links (server-rust/src/ffi/kvm.rs).
exports=$("${PREFIX}readelf" --dyn-syms -W "$OUT/libkvm.so" |
	awk '$7 != "UND" && $5 == "GLOBAL" {print $8}' | sed 's/@.*//' | sort -u)
expected=$(sed -n 's/^\t\t\([a-z_0-9]*\);$/\1/p' "$ROOT/support/sg2002/additional/kvm/libkvm.map" | sort)
[ "$exports" = "$expected" ] || fail "libkvm.so exports differ from libkvm.map: $exports"
for sym in $(awk '/#\[link\(name = "kvm"\)\]/ {f = 1; next} f && /^}/ {exit} f' \
	"$ROOT/server-rust/src/ffi/kvm.rs" |
	sed -n 's/^ *#\[link_name = "\([a-z_0-9]*\)"\]/\1/p; s/^ *fn \([a-z_0-9]*\)(.*/\1/p' |
	grep -vx kvm_set_frame_detect); do
	grep -qx "$sym" <<<"$exports" || fail "libkvm.so does not export $sym"
done

ls -l "$OUT"
