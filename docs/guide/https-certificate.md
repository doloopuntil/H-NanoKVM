---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-17
---

# HTTPS certificate

With HTTPS on, the device serves a self-signed certificate, so the browser warns on
every first visit. **Settings > Network > Services > Secure web access** can use a
trusted certificate instead. The choice is under **Certificate**:

| Source | Needs | Good for |
| --- | --- | --- |
| Self-signed | Nothing. | Local use, with the browser warning. |
| Tailscale | Tailscale running and signed in, and HTTPS certificates enabled for the tailnet in the Tailscale admin console. | Reaching the KVM by its `*.ts.net` name. No setup on the device. |
| Let's Encrypt | A domain whose DNS points at the device, and port 443 reachable from the internet. | A domain of your own. |

## Change the source

1. Turn HTTPS on first. The certificate rows stay disabled while it is off.
2. Pick the source. For Let's Encrypt, enter the domain; the email is optional.
3. Press **Save changes** and enter your password, and a two-factor code if your
   account has one. This is a sensitive change, so it asks for both.
4. The device requests the certificate, which takes up to a minute. If it fails,
   the current certificate stays and the reason shows under **Last renewal**.
5. When it works, a dialog gives the new address. Open it and sign in there. The new
   certificate belongs to that address, so the browser signs in again. Press **Keep**
   within 3 minutes, or the previous certificate comes back without a restart.

## Let's Encrypt behind a router

Let's Encrypt connects to port 443 on your public address from the internet.
Forward external port 443 to the device's HTTPS port, and point the domain's A record
(and AAAA, if you use IPv6) at your public address. Behind carrier-grade NAT, with no
public address, use Tailscale instead.

The firewall modes (Moderate, Restricted, Paranoid) accept connections only from the
local network. While an order runs, the device opens its HTTPS port to the internet
and closes it again when the order ends. Paranoid blocks the outgoing connections the
request needs, so no certificate is requested in that mode. See
[Firewall modes](firewall.md).

## Renewal

The device checks every hour and renews in the last 30 days. After a failure it waits
an hour, then six hours, then a day, and shows the last error. The clock must be
synchronized and HTTPS on. If a certificate expires and cannot be renewed, the device
serves its self-signed certificate again, so the interface stays reachable by its IP
address; by its name only once the browser's HSTS entry has run out (see below). **Renew
now** requests a certificate without waiting.

## HSTS

With a Tailscale or Let's Encrypt certificate kept, the device tells browsers to use only
HTTPS for its name for 180 days (HSTS), so a typed `http://` address or bare name cannot
be answered by someone else on the network. Browsers ignore this for the self-signed
certificate and for IP addresses, so the device sends it only for the trusted ones.

The other side: for those 180 days, a browser that has seen it refuses the name over plain
HTTP and offers no way past a certificate warning. If you turn HTTPS off, go back to the
self-signed certificate, or the certificate expires, open the device by its IP address,
or remove the name in the browser's HSTS settings (Chrome: `chrome://net-internals/#hsts`).

## Testing

The file `/etc/kvm/certs/settings.json` has a `staging` flag that uses Let's Encrypt's
staging service, whose certificates no browser trusts and whose limits are generous.
Use it to test the setup before requesting a real certificate, which is limited to a
few per week for a domain.
