#!/usr/bin/env bash
# Fetch the T-Head musl GCC that builds the SG2002 native code (the middleware, libkvm and
# kvm_system) and supplies their GCC runtime libraries. Prints the compiler bin directory.
# Usage: fetch-thead-toolchain.sh DIR
set -euo pipefail

[ "$#" -eq 1 ] || {
	echo "usage: $0 DIR" >&2
	exit 2
}
DIR=$1
# Sipeed's host-tools 2025.7.28 (Xuantie GCC 10.2, musl), as MaixCDK 5b0aa5b pins it.
URL=https://github.com/sipeed/MaixCDK/releases/download/v0.0.0/host-tools-2025.7.28.tar.xz
SHA256=968b179a7faebfe8914e5163b2d85038b71824780fccde0b4b3ee9f67472d007

pkg="$DIR/host-tools-2025.7.28.tar.xz"
bin="$DIR/host-tools/gcc/riscv64-linux-musl-x86_64/bin"
mkdir -p "$DIR"
if [ ! -f "$pkg" ]; then
	curl --fail --location --retry 2 --output "$pkg.part" "$URL"
	mv "$pkg.part" "$pkg"
fi
echo "$SHA256  $pkg" | sha256sum -c - >&2
if [ ! -x "$bin/riscv64-unknown-linux-musl-gcc" ]; then
	tar -C "$DIR" -xf "$pkg"
fi
"$bin/riscv64-unknown-linux-musl-gcc" --version | head -1 >&2
echo "$bin"
