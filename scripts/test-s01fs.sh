#!/usr/bin/env bash
# protect_shared_directories, taken from S01fs and run under the host's sh and,
# when present, BusyBox sh. Links, hard links, files and FIFOs in shared
# directories such as /tmp are protected from the first start, also on an image
# older than the sysctl.d file.
set -euo pipefail

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
S01="$ROOT_DIR/kvmapp/system/init.d/S01fs"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT
fail() {
    echo "S01fs test: $*" >&2
    exit 1
}

awk '$0 == "protect_shared_directories() {" {p = 1} p {print} p && $0 == "}" {exit}' "$S01" > "$T/lib.sh"
grep -qx 'protect_shared_directories() {' "$T/lib.sh" || fail "no protect_shared_directories in S01fs"
grep -qx '        protect_shared_directories' "$S01" || fail "S01fs start does not protect shared directories"

shells=sh
command -v busybox > /dev/null && shells="sh busybox"
for shell in $shells; do
    rm -rf "$T/fs" && mkdir -p "$T/fs"
    for knob in protected_symlinks protected_hardlinks protected_regular protected_fifos; do
        echo 0 > "$T/fs/$knob"
    done
    # shellcheck disable=SC2046
    env SYSCTL_FS="$T/fs" $([ "$shell" = busybox ] && echo busybox) sh -c ". '$T/lib.sh'; protect_shared_directories" ||
        fail "$shell: protect_shared_directories failed"
    [ "$(cat "$T/fs/protected_symlinks" "$T/fs/protected_hardlinks" "$T/fs/protected_regular" \
        "$T/fs/protected_fifos" | tr '\n' ' ')" = "1 1 2 2 " ] || fail "$shell: shared directories are not protected"
    # a kernel without the knobs must not stop the boot
    env SYSCTL_FS="$T/missing" $([ "$shell" = busybox ] && echo busybox) sh -c ". '$T/lib.sh'; protect_shared_directories" ||
        fail "$shell: a missing knob failed the function"
    echo "ok $shell: links, files and FIFOs in shared directories are protected"
done
echo "S01fs: PASS"
