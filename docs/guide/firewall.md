---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-06
---

# Firewall modes

The device runs a managed firewall (`S40firewall`). Pick the mode in
**Settings > Network > Firewall**; the page also shows the rules in force.

With the `nft` tool (system images from the Linux 6.18 line) the rules are one
nftables table, `inet kvm_firewall`, replaced in a single transaction on every
change. Older system images without `nft` get the same rules through
`iptables-nft`/`ip6tables-nft`, or plain `iptables`/`ip6tables` where those are
missing.

"Local" below means private IPv4 (`10/8`, `172.16/12`, `192.168/16`), IPv4
link-local and loopback, IPv6 unique-local (`fc00::/7`), link-local and loopback
addresses.

| Mode | Inbound | Outbound | Notes |
| --- | --- | --- | --- |
| **Baseline** | Not restricted by source | Open | Compatibility profile: the firewall runs but does not limit who connects. Use only on a network you trust. |
| **Moderate** (default) | Any new connection from local addresses | Open | Everything else inbound is dropped. |
| **Restricted** | HTTPS and SSH from local addresses | DNS, NTP, remote syslog, HTTPS (online updates), DHCP | Needs HTTPS. H.264 WebRTC is blocked. |
| **Paranoid** | HTTPS from local addresses | DHCP and essential IPv6 control only | Needs HTTPS. Blocks SSH, HTTP, mDNS, NTP, online updates and WebRTC. Offline updates and already staged installs still work. |

## Switching safely

- Restricted and Paranoid can only be chosen while HTTPS is on
  (**Settings > Network > IP & DNS**).
- After switching to Restricted or Paranoid, confirm the change from the page
  within 60 seconds. If you lose access and cannot confirm, the previous mode
  comes back on its own.
- Turning HTTPS off moves the firewall back to Moderate, so plain HTTP is not
  shut out. If the switch is not confirmed within three minutes, both the protocol and the
  firewall mode go back.
- If a mode fails to apply, the previous one is restored.

## Certificate requests

Requesting a Let's Encrypt certificate needs the internet to reach the HTTPS port,
which Moderate, Restricted and Paranoid refuse. While an order runs (up to two
minutes) the device adds one rule that accepts new connections to the HTTPS port
from any source, and removes it when the order ends or fails. Paranoid blocks the
outgoing connections the request needs, so no certificate is requested in that mode.
Your router must still forward external port 443 to the device.

## Video modes

Restricted and Paranoid block the UDP that H.264 WebRTC needs, and the server
refuses WebRTC in those modes. Use H.264 Direct (needs HTTPS) or MJPEG.

## Remote access through a tunnel

The modes above only admit local addresses. To reach the KVM from elsewhere,
use a tunnel instead of opening the firewall:

- [WireGuard](wireguard.md): with the tunnel on, its peer counts as local, but
  only on the tunnel interface and only from the peer's allowed ranges. Paranoid
  blocks WireGuard.
- [Tailscale](tailscale.md).
