#!/usr/bin/env bash
# The post-fakeroot hook on the tree Buildroot leaves, and the image check on
# real ext4 images.
set -euo pipefail

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
PATH="/usr/sbin:/sbin:$PATH"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT
fail() {
	echo "busybox mode test: $*" >&2
	exit 1
}
tree="$T/target"
mkdir -p "$tree/usr/bin"
ln -s usr/bin "$tree/bin"
printf 'synthetic\n' > "$tree/usr/bin/busybox"
chmod 4755 "$tree/usr/bin/busybox"
mkdir -p "$tree/etc"
printf 'root:*:::::::\ndaemon:*:::::::\nsshd::::::::\nuser:$5$salt$hash:::::::\n' > "$tree/etc/shadow"
chmod 600 "$tree/etc/shadow"

image() {
	rm -f "$T/rootfs.ext4"
	mke2fs -q -t ext4 -d "$tree" "$T/rootfs.ext4" 8M
}
image
if "$ROOT/scripts/check-busybox-mode.sh" "$T/rootfs.ext4" 2>/dev/null; then
	fail "a setuid busybox passed"
fi
sh "$ROOT/buildroot-external/hardened-sg2002/board/sg2002/post-fakeroot.sh" "$tree"
[ "$(stat -c %a "$tree/usr/bin/busybox")" = 755 ] || fail "the hook left another mode"
[ "$(cut -d: -f1,2 "$tree/etc/shadow" | tr '\n' ' ')" = 'root:* daemon:!* sshd:! user:$5$salt$hash ' ] || \
	fail "the hook locked the wrong accounts: $(cut -d: -f1,2 "$tree/etc/shadow" | tr '\n' ' ')"
[ "$(stat -c %a "$tree/etc/shadow")" = 600 ] || fail "the hook changed the shadow mode"
image
"$ROOT/scripts/check-busybox-mode.sh" "$T/rootfs.ext4" || fail "a plain busybox was refused"
rm "$tree/usr/bin/busybox"
image
if "$ROOT/scripts/check-busybox-mode.sh" "$T/rootfs.ext4" 2>/dev/null; then
	fail "an image without busybox passed"
fi
echo "busybox mode test: PASS"
