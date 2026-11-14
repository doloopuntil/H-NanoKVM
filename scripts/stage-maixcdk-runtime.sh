#!/usr/bin/env bash
# Stage the GCC runtime libraries libkvm loads, and the libc.so and headers the
# server builds against, from MaixCDK's musl toolchain: the plain rv64gc lp64d
# build, stripped as the stock vendor image ships them.
# Usage: stage-maixcdk-runtime.sh TOOLCHAIN_BIN OUT_DIR
set -euo pipefail

[ "$#" -eq 2 ] || {
	echo "usage: $0 TOOLCHAIN_BIN OUT_DIR" >&2
	exit 2
}
BIN=$1
OUT=$2
CC="$BIN/riscv64-unknown-linux-musl-gcc"
STRIP="$BIN/riscv64-unknown-linux-musl-strip"
FLAGS=(-march=rv64imafdc -mabi=lp64d)

multilib="$("$CC" "${FLAGS[@]}" -print-multi-directory)"
[ "$multilib" = lib64/lp64d ] || {
	echo "unexpected multilib for rv64gc lp64d: $multilib" >&2
	exit 1
}

stage() {
	src="$(readlink -f "$("$CC" "${FLAGS[@]}" -print-file-name="$1")")"
	[ -f "$src" ] || {
		echo "not in the toolchain: $1" >&2
		exit 1
	}
	"$STRIP" --strip-all -R .comment -o "$2/$1" "$src"
}

mkdir -p "$OUT/runtime" "$OUT/sysroot"
for lib in libstdc++.so.6.0.28 libgcc_s.so.1 libgomp.so.1.0.0 libatomic.so.1.2.0; do
	stage "$lib" "$OUT/runtime"
done
stage libc.so "$OUT/sysroot"
cp "$OUT/runtime/libgcc_s.so.1" "$OUT/sysroot/"
include="$("$CC" "${FLAGS[@]}" -print-sysroot)/usr/include"
[ -f "$include/stdlib.h" ] || {
	echo "no C library headers in $include" >&2
	exit 1
}
mkdir -p "$OUT/sysroot/include"
cp -R "$include/." "$OUT/sysroot/include/"
chmod 0644 "$OUT"/runtime/*

# The runtime libraries are byte-identical to the stock image's (checked on a Lite).
(
	cd "$OUT"
	sha256sum -c - <<'EOF'
9ebc8352014fbb7499194fdca56eb496c51c119b50d08d7b70b96058d3c5be17  runtime/libstdc++.so.6.0.28
4b483b84f730b5e127ee8441cc143d5d90f1a31f0bfb999f94ef834eefa3da8c  runtime/libgcc_s.so.1
986f21b24574f0e58672c865b34d9eba102ba45c05f18a608bf612816b84c901  runtime/libgomp.so.1.0.0
2421e827d033c3a055b973e6fbcf5a78fe987b50dd21e82a422a3728f4d3da3d  runtime/libatomic.so.1.2.0
fbc494806cad67edbf4584221bdc481593fa04b317d9405cf3418aad9a9500c4  sysroot/libc.so
EOF
)
