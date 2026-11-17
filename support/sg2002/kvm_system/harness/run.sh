#!/bin/sh
# Runs every scenario against the C++ kvm_system in a Linux container and compares the
# traces with golden/. --update rewrites golden/ instead.
# Usage: run.sh [--update] [SCENARIO...]
set -eu
here=$(cd "$(dirname "$0")" && pwd)
repo=$(cd "$here/../../../.." && pwd)
update=0
if [ "${1:-}" = "--update" ]; then
	update=1
	shift
fi
image=${KVM_SYSTEM_HARNESS_IMAGE:-rust:1-trixie}
rel=support/sg2002/kvm_system/harness
mkdir -p "$here/golden"

docker run --rm -v "$repo":/src:ro -v "$here/golden":/golden -e UPDATE=$update "$image" sh -eu -c '
	/src/'"$rel"'/build.sh /tmp/h >/dev/null
	cd /src/'"$rel"'/scenarios
	set -- "$@"
	[ $# -gt 0 ] || set -- *.scn
	fail=0
	for scn in "$@"; do
		name=${scn%.scn}
		/tmp/h/kvm_system_harness "$name.scn" "/tmp/$name.trace" >/dev/null 2>&1 || {
			echo "FAIL $name: harness exited $?"; fail=1; continue; }
		if [ "$UPDATE" = 1 ]; then
			cp "/tmp/$name.trace" "/golden/$name.trace"
			echo "wrote $name"
		elif cmp -s "/tmp/$name.trace" "/golden/$name.trace"; then
			echo "ok   $name"
		else
			echo "DIFF $name"; diff "/golden/$name.trace" "/tmp/$name.trace" | head -20; fail=1
		fi
	done
	exit $fail
' sh "$@"
