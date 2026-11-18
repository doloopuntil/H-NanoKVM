#!/bin/sh
# Builds the kvm_system harness on a Linux host: kvm_system's unmodified sources, their
# hardware-facing libc calls renamed to fake_* (fake.cpp), as in support/sg2002/CMakeLists.txt.
# Usage: build.sh OUT_DIR
set -eu
here=$(cd "$(dirname "$0")" && pwd)
sg=$(cd "$here/../.." && pwd)
ks="$sg/kvm_system/main"
out=${1:?usage: build.sh OUT_DIR}
mkdir -p "$out/obj"

inc="-I$ks/include -I$ks/lib/libqr -I$ks/lib/oled_ctrl -I$ks/lib/oled_ui -I$ks/lib/system_ctrl
	-I$ks/lib/system_state -I$sg/additional/kvm/include -I$sg/common"
flags="-Os -w -D_FORTIFY_SOURCE=0 -fno-stack-protector"

syms="open fopen fclose close access unlink mkdir rename fchmod write read poll ioctl
	getifaddrs freeifaddrs system popen pclose getrandom clock_gettime nanosleep
	pthread_create pthread_join pthread_mutex_lock pthread_mutex_unlock signal"
redefine="--redefine-sym main=kvm_system_main"
for s in $syms; do redefine="$redefine --redefine-sym $s=fake_$s"; done

objs=""
for src in src/main.cpp lib/oled_ctrl/oled_ctrl.cpp lib/oled_ui/oled_ui.cpp \
	lib/system_ctrl/system_ctrl.cpp lib/system_state/system_state.cpp \
	lib/libqr/qr.c lib/libqr/qrcnv.c lib/libqr/qrcnv_bmp.c; do
	o="$out/obj/$(basename "$src").o"
	case "$src" in
	*.c) gcc -std=gnu11 $flags $inc -c "$ks/$src" -o "$o" ;;
	*) g++ -std=c++17 $flags $inc -c "$ks/$src" -o "$o" ;;
	esac
	# shellcheck disable=SC2086
	objcopy $redefine "$o"
	objs="$objs $o"
done

g++ -std=c++17 -O1 -Wall -c "$here/fake.cpp" -o "$out/obj/fake.o"
# shellcheck disable=SC2086
g++ -o "$out/kvm_system_harness" "$out/obj/fake.o" $objs -lpthread

# Every libc call left in the code under test must be harmless (no I/O to the host).
nm -u $objs | awk '{print $2}' | sort -u > "$out/undefined.txt"

# libqr on its own, for the QR matrix comparison (qr-strings.txt).
gcc -std=gnu11 -O2 -w -I"$ks/lib/libqr" "$here/qr_dump.c" "$ks/lib/libqr/qr.c" "$ks/lib/libqr/qrcnv.c" "$ks/lib/libqr/qrcnv_bmp.c" -o "$out/qr_dump" -lm
