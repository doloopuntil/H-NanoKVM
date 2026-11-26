#!/usr/bin/env bash
# Build everything the server links or ships natively, with Buildroot's cross-compiler: the
# Sophgo middleware, libkvm_mmf.so, the server's link-time sysroot and its dl_lib directory.
# Usage: build-native-6x.sh CROSS_PREFIX SOURCE_DIR
# SOURCE_DIR holds cvi_mpi/, osdrv-uapi/ and sensor-list/ (scripts/fetch-sophgo-middleware.sh);
# sg2002-sdk/ is staged there too. Outputs: build/native-libkvm, server-rust/sysroot and
# server-rust/native/dl_lib.
set -euo pipefail

[ "$#" -eq 2 ] || {
	echo "usage: $0 CROSS_PREFIX SOURCE_DIR" >&2
	exit 2
}
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PREFIX=$1
SRC=$2
OUT="$ROOT/build/native-libkvm"

cd "$ROOT"

# libsys/libvenc/libvdec/libvi/libvpss/libvo/libgdc/librgn/libini: libkvm_mmf.so links against
# these and the image ships them.
SDK_MIDDLEWARE_OPT_FLAGS=-O2 scripts/build-sdk-middleware.sh "$SRC/cvi_mpi" \
	"$SRC/osdrv-uapi" "$OUT/middleware" "$PREFIX"

# kvm_mmf compiles against these headers and sample code, so they match the libraries above.
scripts/stage-sg2002-sdk.sh "$SRC/cvi_mpi" "$SRC/osdrv-uapi" "$SRC/sensor-list" \
	"$OUT/middleware" "$SRC/sg2002-sdk"

# Plain CMake (support/sg2002/CMakeLists.txt) with Buildroot's GCC: scalar xthead, stack
# protector, full RELRO. The script also checks SSP, RPATH, the loader and libkvm_mmf's exports.
# The sources must carry the native changes this image relies on.
grep -q "no stale sys state to release" support/sg2002/additional/kvm_mmf/src/kvm_mmf.cpp
grep -q "mmf_vi_frame_release" support/sg2002/additional/kvm_mmf/src/kvm_mmf.cpp
grep -q 'extern "C"' support/sg2002/additional/kvm_mmf/include/kvm_mmf.hpp
scripts/build-sg2002-native.sh "$PREFIX" "$SRC/sg2002-sdk" "$OUT"
file "$OUT/libkvm_mmf.so"

# The server links against the same musl it runs on.
SYSROOT=$("${PREFIX}gcc" -print-sysroot)
mkdir -p server-rust/sysroot/lib
cp "$SYSROOT/lib/libc.so" "$SYSROOT/lib/libgcc_s.so.1" server-rust/sysroot/lib/
cp -R "$SYSROOT/usr/include" server-rust/sysroot/include

# dl_lib is not in git: the server links against and packages this run's builds only.
mkdir -p server-rust/native/dl_lib
cp "$OUT/libkvm_mmf.so" server-rust/native/dl_lib/libkvm_mmf.so
for lib in libsys.so libvenc.so libvdec.so libvi.so libvpss.so libvo.so libgdc.so librgn.so \
	libini.so; do
	cp "$OUT/middleware/$lib" "server-rust/native/dl_lib/$lib"
done
