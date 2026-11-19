#!/bin/sh
# Builds the media harness for the host and writes one trace per scenario.
# run.sh SCENARIO_DIR OUT_DIR   (Linux with g++; from the repository root)
set -eu
KVM=support/sg2002/additional/kvm
SCN=${1:-server-rust/tests/media/scenarios}
OUT=${2:-server-rust/tests/media/golden}
BIN=${TMPDIR:-/tmp}/kvm-media-harness
g++ -std=c++17 -O1 -g -fsanitize=address -fno-omit-frame-pointer -Wall -Werror -I "$KVM/include" -I support/sg2002/additional/kvm_mmf/include \
	"$KVM/src/kvm_capture.cpp" "$KVM/src/kvm_media.cpp" "$KVM/harness/fake_mmf.cpp" -o "$BIN"
mkdir -p "$OUT"
for s in "$SCN"/*.scn; do
	name=$(basename "$s" .scn)
	"$BIN" "$s" >"$OUT/$name.trace" 2>/dev/null
done
