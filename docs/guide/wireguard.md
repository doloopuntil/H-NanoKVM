---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-03
---

# WireGuard

WireGuard lets you reach the KVM from outside your network through an encrypted
tunnel to one peer, typically a VPS you already run, without opening a port on
your router. The KVM connects out to the peer and keeps the tunnel up; the KVM is
not a router and does not forward traffic for other machines.

Limits of this setup: one peer, IPv4 addresses inside the tunnel, and no
`0.0.0.0/0` range (the KVM never sends all of its traffic through the tunnel).

## Set it up

You need the peer's public key, its address (host name or IP) and its UDP port.

1. Open **Settings > Network > WireGuard**.
2. **Private key**: press **Generate**, or **Set** to paste one. The key stays on
   the device (`/etc/kvm/wireguard/private.key`, mode 0600) and is never shown
   again. The **Public key** derived from it is shown so you can copy it to the
   peer.
3. **Address**: the KVM's address in the tunnel with its mask, for example
   `10.0.0.2/24`.
4. **Peer**:
   - **Public key**: the peer's public key.
   - **Server** and **Port**: where the peer listens, usually UDP `51820`.
   - **Allowed IPs**: the tunnel addresses you will connect from, for example
     `10.0.0.0/24` or the peer's own `10.0.0.1/32`. The KVM adds a route for each.
   - **Keepalive**: seconds between keepalives, `25` by default, so the tunnel
     stays up behind NAT.
5. Turn WireGuard on and **Save changes**. The page shows the last handshake
   and the bytes sent and received.

Then browse to the KVM's tunnel address from a machine that can reach the peer's
side of the tunnel.

### Peer side

A minimal peer configuration for the example above:

```ini
[Interface]
Address = 10.0.0.1/24
ListenPort = 51820
PrivateKey = <peer private key>

[Peer]
# the NanoKVM
PublicKey = <public key shown on the WireGuard page>
AllowedIPs = 10.0.0.2/32
```

The peer needs no `Endpoint` for the KVM: the KVM connects to it, and the peer
learns the address from the first handshake.

## Firewall

- In Moderate mode, the peer's allowed ranges count as local on the tunnel
  interface, so every service the KVM offers locally is reachable through it.
- In Restricted mode, the tunnel admits HTTPS and SSH from the peer's allowed
  ranges, and outbound UDP is allowed from the KVM's WireGuard port (`51820`) to
  the peer's port, and only to the peer's address when **Server** is an IP
  address.
- Connections the KVM opens to the peer follow the mode's usual outbound rules:
  in Restricted mode only HTTPS, DNS, NTP and remote syslog go out, so for
  example SSH from the KVM to the peer is blocked.
- Paranoid mode blocks WireGuard; the page refuses to turn it on.

See [Firewall modes](firewall.md).

## Notes

- Whenever the peer has been silent for three minutes, the KVM sets the endpoint
  again from **Server**, resolving a host name afresh, so a peer behind dynamic
  DNS keeps working.
- **Generate** replaces the key: add the new public key to the peer. **Remove**
  deletes the key and turns WireGuard off.
- Changes to the settings and the key are written to the system log.
- To publish the KVM under your own domain through the peer, see
  [Reverse proxy with Caddy and WireGuard](reverse-proxy.md).
