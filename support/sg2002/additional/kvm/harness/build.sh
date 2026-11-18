#!/bin/sh
# Builds the libkvm control harness on a Linux host: the unmodified kvm_vision.cpp and
# vi_state_shared.cpp, their hardware-facing libc calls renamed to fake_* (fake.cpp), the
# camera and encoder replaced by recording stubs. Flags as in support/sg2002/CMakeLists.txt.
# Usage: build.sh OUT_DIR
set -eu
here=$(cd "$(dirname "$0")" && pwd)
kvm=$(cd "$here/.." && pwd)
sg=$(cd "$kvm/../.." && pwd)
out=${1:?usage: build.sh OUT_DIR}
mkdir -p "$out/obj"

inc="-I$kvm/include -I$sg/common -I$sg/additional/kvm_mmf/include"
flags="-O2 -w -D_FORTIFY_SOURCE=0 -U_FORTIFY_SOURCE -fno-stack-protector"

syms="open close read write ioctl fopen fclose fputs fputc fwrite access mkstemp rename unlink munmap
	system popen pclose clock_gettime nanosleep pthread_create pthread_timedjoin_np
	pthread_mutex_init pthread_mutex_destroy pthread_mutex_lock pthread_mutex_unlock
	pthread_mutex_timedlock"
redefine=""
for s in $syms; do redefine="$redefine --redefine-sym $s=fake_$s"; done

objs=""
for src in src/kvm_vision.cpp src/vi_state_shared.cpp; do
	o="$out/obj/$(basename "$src").o"
	# shellcheck disable=SC2086
	g++ -std=c++17 $flags $inc -c "$kvm/$src" -o "$o"
	# shellcheck disable=SC2086
	objcopy $redefine "$o"
	objs="$objs $o"
done

# shellcheck disable=SC2086
g++ -std=c++17 -O1 -Wall $inc -c "$here/fake.cpp" -o "$out/obj/fake.o"
# shellcheck disable=SC2086
g++ -o "$out/libkvm_harness" "$out/obj/fake.o" $objs -lpthread

# Every libc call left in the code under test must be harmless (no I/O outside the fake root).
nm -u $objs | awk '{print $2}' | sort -u > "$out/undefined.txt"
