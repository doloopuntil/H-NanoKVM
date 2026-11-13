#!/bin/sh
# Checks a 6.x root filesystem image beyond validate-nanokvm-rootfs.sh; reports every failure.
set -eu

[ "$#" -eq 1 ] || { echo "usage: $0 <rootfs.ext4>" >&2; exit 2; }
ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
IMAGE="$1"
EXPECTED_ROOTFS_UUID="${EXPECTED_ROOTFS_UUID:-23df1b1c-cbf0-5e1c-b42b-de68dec5ad95}"
[ -f "$IMAGE" ] || { echo "error: no such image: $IMAGE" >&2; exit 2; }
for tool in debugfs readelf; do
	command -v "$tool" >/dev/null 2>&1 || { echo "error: $tool is required" >&2; exit 2; }
done

TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/validate-6x-rootfs.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT INT TERM
FAILED=0
fail() {
	echo "error: $*" >&2
	FAILED=1
}
exists() {
	LC_ALL=C debugfs -R "stat $1" "$IMAGE" 2>/dev/null | grep -q '^Inode:'
}
dump() {
	rm -f "$TMP_DIR/$2"
	debugfs -R "dump $1 $TMP_DIR/$2" "$IMAGE" >/dev/null 2>&1
	[ -s "$TMP_DIR/$2" ]
}

# post-fakeroot.sh: no setuid BusyBox, every account but root locked (CVE-2026-123158),
# and root itself locked until the first setup gives it a password
"$ROOT/scripts/check-busybox-mode.sh" "$IMAGE" || fail "the image carries a privileged BusyBox"
if dump /etc/shadow shadow; then
	unlocked=$(awk -F: '$1 != "root" && length($2) < 4 && substr($2, 1, 1) != "!" { print $1 }' "$TMP_DIR/shadow")
	[ -z "$unlocked" ] || fail "accounts not locked in /etc/shadow: $(echo $unlocked)"
	grep -q '^root:\*:' "$TMP_DIR/shadow" || fail "root is not locked in the clean image"
else
	fail "could not read /etc/shadow"
fi
dump /etc/ssh/sshd_config sshd_config && grep -qx 'PermitEmptyPasswords no' "$TMP_DIR/sshd_config" || \
	fail "sshd_config does not refuse empty passwords"

# Reproducible filesystem identity (BR2_TARGET_ROOTFS_EXT2_MKFS_OPTIONS)
stats="$(LC_ALL=C debugfs -R stats "$IMAGE" 2>/dev/null || true)"
printf '%s\n' "$stats" | grep -Eq "^Filesystem UUID:[[:space:]]+$EXPECTED_ROOTFS_UUID$" || fail "rootfs UUID is not pinned"
printf '%s\n' "$stats" | grep -Eq "^Directory Hash Seed:[[:space:]]+$EXPECTED_ROOTFS_UUID$" || fail "rootfs hash seed is not pinned"

for path in /etc/ssl/certs/ca-certificates.crt /usr/lib/libz.so.1 /usr/sbin/sshd /usr/sbin/avahi-daemon \
	/usr/sbin/hostapd /usr/sbin/wpa_supplicant /usr/sbin/wpa_passphrase /usr/bin/curl /usr/bin/openssl \
	/usr/bin/ntpdate /usr/sbin/parted /usr/sbin/mkfs.exfat /usr/sbin/resize2fs /usr/sbin/nft; do
	exists "$path" || fail "missing $path"
done
for path in /usr/bin/python /usr/bin/python3 /usr/bin/ffmpeg /usr/bin/ffprobe /usr/sbin/dnsmasq \
	/etc/init.d/S80dnsmasq /kvmapp/system/init.d/S80dnsmasq /kvmapp/server/dl_lib/libz.so \
	/kvmapp/.files-list.before /usr/lib/libstdc++.so.6.0.33-gdb.py /mnt/system/ko /dev/mem; do
	! exists "$path" || fail "forbidden $path"
done

if dump /etc/avahi/avahi-daemon.conf avahi.conf; then
	! grep -q '^clients-max=' "$TMP_DIR/avahi.conf" || fail "Avahi clients-max is set without D-Bus"
	grep -qx 'enable-wide-area=no' "$TMP_DIR/avahi.conf" || fail "Avahi wide-area mode is on"
	grep -qx 'rlimit-nofile=256' "$TMP_DIR/avahi.conf" || fail "Avahi file descriptors are not bounded"
else
	fail "could not read the Avahi configuration"
fi

# T-Head code generation: musl and kvm_system use the extensions, nothing uses the vector unit
if dump /usr/lib/libc.so libc.so; then
	readelf -A "$TMP_DIR/libc.so" 2>/dev/null | grep -Fq xtheadmempair || fail "libc.so is not built for the T-Head extensions"
else
	fail "could not read /usr/lib/libc.so"
fi
if dump /kvmapp/kvm_system/kvm_system kvm_system; then
	readelf -A "$TMP_DIR/kvm_system" 2>/dev/null | grep -Fq xtheadc || fail "kvm_system is not built for the T-Head extensions"
	! readelf -A "$TMP_DIR/kvm_system" 2>/dev/null | grep -Fq v0p7 || fail "kvm_system uses the vector extension"
	! readelf -d "$TMP_DIR/kvm_system" 2>/dev/null | grep -Eq '\((RPATH|RUNPATH)\)' || fail "kvm_system has an RPATH"
else
	fail "could not read kvm_system"
fi

# The init scripts installed in /etc/init.d are the ones the application package carries
for script in S01fs S02watchdog S30eth S95nanokvm; do
	if dump "/kvmapp/system/init.d/$script" "kvmapp-$script" && dump "/etc/init.d/$script" "etc-$script"; then
		cmp -s "$TMP_DIR/kvmapp-$script" "$TMP_DIR/etc-$script" || fail "packaged and installed $script differ"
	else
		fail "could not read $script"
	fi
done

[ "$FAILED" = 0 ] || exit 1
echo "validated 6.x rootfs: $IMAGE"
