#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
S30ETH="$ROOT_DIR/kvmapp/system/init.d/S30eth"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf "$TEST_ROOT"' EXIT

export S30ETH_TEST_ONLY=1
export RX_BATCHING_FLAG="$TEST_ROOT/eth.rx-batching"
export NET_CLASS_DIR="$TEST_ROOT/net"
NET="$NET_CLASS_DIR/eth0"
mkdir -p "$NET"

# shellcheck source=/dev/null
. "$S30ETH"

reset() {
    echo "$1" > "$NET/gro_flush_timeout"
    echo "$2" > "$NET/napi_defer_hard_irqs"
}

expect() {
    if [ "$(cat "$NET/gro_flush_timeout")" != "$1" ] ||
        [ "$(cat "$NET/napi_defer_hard_irqs")" != "$2" ]; then
        echo "$3: got $(cat "$NET/gro_flush_timeout")/$(cat "$NET/napi_defer_hard_irqs")" >&2
        exit 1
    fi
}

reset 0 0
apply_rx_batching
expect 0 0 "applied without the flag"

touch "$RX_BATCHING_FLAG"
apply_rx_batching
expect 200000 2 "not applied with the flag"

apply_rx_batching
expect 200000 2 "a second start changed the profile"

reset 50000 0
apply_rx_batching
expect 50000 0 "overwrote a value set elsewhere"

rm -f "$NET/napi_defer_hard_irqs"
reset_flush_only() { echo 0 > "$NET/gro_flush_timeout"; }
reset_flush_only
apply_rx_batching
[ "$(cat "$NET/gro_flush_timeout")" = 0 ] || {
    echo "applied half a profile without napi_defer_hard_irqs" >&2
    exit 1
}

echo "S30eth RX batching: PASS"
