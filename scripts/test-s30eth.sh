#!/bin/sh
# Host checks for S30eth's static IPv4/IPv6 and resolv.conf parsing. The script
# is sourced with S30ETH_TEST_ONLY=1; no network or device state is touched.
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
S30ETH="$ROOT_DIR/kvmapp/system/init.d/S30eth"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

# Plain assignments: bash, unlike sh, drops assignments that prefix ".".
BOOT_RESOLV_FILE="$tmp/boot-resolv"
ETC_RESOLV_FILE="$tmp/etc-resolv"
IPV6_CONF_DIR="$tmp/ipv6-conf"
IPV6_SECRET_FILE="$tmp/kvm-network/ipv6.stable_secret"
S30ETH_TEST_ONLY=1
export BOOT_RESOLV_FILE ETC_RESOLV_FILE IPV6_CONF_DIR IPV6_SECRET_FILE S30ETH_TEST_ONLY
. "$S30ETH"

fail() {
    echo "test-s30eth: $*" >&2
    exit 1
}

is_ipv4_addr 192.168.1.10 || fail "rejected a valid IPv4 address"
is_ipv4_addr 0.0.0.0 || fail "rejected the all-zero IPv4 address"
if is_ipv4_addr 192.168.1.256; then fail "accepted IPv4 octet 256"; fi
if is_ipv4_addr 192.168.1.01; then fail "accepted a leading-zero octet"; fi
if is_ipv4_addr 192.168.1; then fail "accepted a three-octet address"; fi
if is_ipv4_addr 192.168.1.1.2; then fail "accepted five octets"; fi
if is_ipv4_addr '192.168.1.1/24'; then fail "accepted a CIDR as an address"; fi

is_ipv4_netid 1 || fail "rejected netmask /1"
is_ipv4_netid 32 || fail "rejected netmask /32"
if is_ipv4_netid 0; then fail "accepted netmask /0"; fi
if is_ipv4_netid 33; then fail "accepted netmask /33"; fi
if is_ipv4_netid 024; then fail "accepted a leading-zero netmask"; fi

[ "$(calc_gw 192.168.1.10 24)" = "192.168.1.1" ] || fail "wrong gateway for .10/24"
[ "$(calc_gw 192.168.1.1 24)" = "192.168.1.254" ] || fail "wrong gateway for the gateway address"
if calc_gw 192.168.1 24; then fail "computed a gateway from an invalid address"; fi
if calc_gw 192.168.1.10 33; then fail "computed a gateway from an invalid netmask"; fi

is_ipv6_addr 2001:db8::1 || fail "rejected a valid IPv6 address"
if is_ipv6_addr 2001:db8::zz; then fail "accepted an invalid IPv6 address"; fi
is_ipv6_cidr 2001:db8::/64 || fail "rejected a valid IPv6 CIDR"
if is_ipv6_cidr 2001:db8::/129; then fail "accepted IPv6 prefix /129"; fi
if is_ipv6_cidr 2001:db8::; then fail "accepted an IPv6 address without a prefix"; fi

printf '%s\n' \
    'nameserver 1.1.1.1' \
    'nameserver invalid' \
    'search example.com bad/../x' \
    'domain example.org' \
    'options ndots:5 rotate' \
    > "$BOOT_RESOLV_FILE"
render_static_dns 192.168.1.1 || fail "render_static_dns failed on a mixed file"
grep -qx 'nameserver 1.1.1.1' "$ETC_RESOLV_FILE" || fail "valid nameserver dropped"
grep -qx 'domain example.org' "$ETC_RESOLV_FILE" || fail "valid domain dropped"
grep -qx 'options ndots:5 rotate' "$ETC_RESOLV_FILE" || fail "valid options dropped"
if grep -Eq 'invalid|bad/' "$ETC_RESOLV_FILE"; then
    fail "invalid resolv.conf line survived"
fi

printf 'nameserver invalid\n' > "$BOOT_RESOLV_FILE"
render_static_dns 192.168.1.1 || fail "render_static_dns failed with no valid nameserver"
grep -qx 'nameserver 192.168.1.1' "$ETC_RESOLV_FILE" || fail "fallback nameserver missing"

printf 'nameserver 2001:db8::1\n' > "$BOOT_RESOLV_FILE"
render_static_dns 192.168.1.1 || fail "render_static_dns failed for IPv6"
grep -qx 'nameserver 2001:db8::1' "$ETC_RESOLV_FILE" || fail "IPv6 nameserver dropped"

printf '%s\n' \
    'nameserver 1.1.1.1' \
    'nameserver 1.1.1.1' \
    'nameserver 8.8.8.8' \
    > "$BOOT_RESOLV_FILE"
render_static_dns 192.168.1.1 || fail "render_static_dns failed on duplicate nameservers"
[ "$(grep -c '^nameserver ' "$ETC_RESOLV_FILE")" -eq 2 ] || fail "nameservers were not de-duplicated"
grep -qx 'nameserver 1.1.1.1' "$ETC_RESOLV_FILE" || fail "first nameserver lost"
grep -qx 'nameserver 8.8.8.8' "$ETC_RESOLV_FILE" || fail "second distinct nameserver lost"

# IPv6 stable privacy: one secret, kept across runs, written to default and eth0.
secret=$(ipv6_stable_secret) || fail "no stable secret"
is_stable_secret "$secret" || fail "malformed stable secret: $secret"
[ "$(ls -l "$IPV6_SECRET_FILE" | cut -c1-10)" = "-rw-------" ] || fail "stable secret is not 0600"
[ "$(ipv6_stable_secret)" = "$secret" ] || fail "stable secret changed between runs"
if is_stable_secret "$secret
$secret"; then fail "accepted two lines as a secret"; fi
echo garbage > "$IPV6_SECRET_FILE"
secret=$(ipv6_stable_secret) || fail "no stable secret after a bad file"
is_stable_secret "$secret" || fail "bad secret file not replaced"

mkdir -p "$IPV6_CONF_DIR/default" "$IPV6_CONF_DIR/eth0"
: > "$IPV6_CONF_DIR/default/stable_secret"
: > "$IPV6_CONF_DIR/eth0/stable_secret"
echo 1 > "$IPV6_CONF_DIR/eth0/disable_ipv6"
apply_ipv6_stable_privacy
[ "$(cat "$IPV6_CONF_DIR/default/stable_secret")" = "$secret" ] || fail "default stable_secret not set"
[ "$(cat "$IPV6_CONF_DIR/eth0/stable_secret")" = "$secret" ] || fail "eth0 stable_secret not set"
[ "$(cat "$IPV6_CONF_DIR/eth0/disable_ipv6")" = 1 ] || fail "IPv6 turned on while disabled"
echo untouched > "$IPV6_CONF_DIR/default/stable_secret"
apply_ipv6_stable_privacy
[ "$(cat "$IPV6_CONF_DIR/default/stable_secret")" = untouched ] || fail "secret rewritten on a restart"

echo "test-s30eth: PASS"
