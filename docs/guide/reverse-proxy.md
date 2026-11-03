---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-03
---

# Reverse proxy with Caddy and WireGuard

This setup puts the KVM on the internet under your own domain, without opening a
port on your router and without a certificate on the device. A VPS you run
terminates HTTPS with [Caddy](https://caddyserver.com/) and forwards to the KVM
over a [WireGuard](wireguard.md) tunnel. The device itself keeps serving plain
HTTP, but only to the tunnel.

```text
browser --HTTPS--> Caddy on the VPS --HTTP, inside WireGuard--> KVM (10.0.0.2:80)
```

If you have no proxy, leave this page alone: the device's own HTTPS
([HTTPS certificate](https-certificate.md)) is the way to get an encrypted
connection, and **Trusted proxies** stays empty.

## What the device needs to know

By default the device looks only at the address a connection comes from. Behind a
proxy that is always the proxy, so:

- every visitor would share one login lockout, and the system log would name the
  proxy as the source of every sign-in;
- the session cookie would not be marked `Secure`, because the connection to the
  device is plain HTTP.

Listing the proxy under **Trusted proxies** tells the device to believe two
headers, but only from that address:

- `X-Forwarded-For` gives the visitor's address. The device takes the rightmost
  hop that is not itself a trusted proxy, so addresses a visitor invents at the
  start of the header are ignored. The login lockout, the password re-checks and
  the system log use that address.
- `X-Forwarded-Proto` says whether the visitor came over HTTPS. The cookie is
  then `Secure`, and the WebSocket and CSRF origin checks require the `Origin`
  to be `https://` as well.

From any other address, the headers are ignored. A visitor, or anything else that
reaches the device directly, cannot choose its address or scheme by sending them.

## Set it up

You need a VPS with a domain pointing at it, and WireGuard on both ends.

### 1. The tunnel

Follow [WireGuard](wireguard.md). With the example values there, the VPS is
`10.0.0.1` and the KVM `10.0.0.2`. Check that the VPS can reach the KVM:

```sh
curl -I http://10.0.0.2/
```

The default firewall mode, Moderate, lets the tunnel's peer connect. Restricted and
Paranoid need HTTPS on the device, so they do not fit this setup
([Firewall modes](firewall.md)).

### 2. Trust the proxy

Open **Settings > Network > Services**, and in **Reverse proxy** choose **Edit**
on **Edit list**. Enter the VPS's address *inside the tunnel*
(`10.0.0.1`), the address the device sees the connection come from, then confirm
with your password (and a two-factor code if the account has one). A range such as
`10.0.0.0/24` works too, but list as little as you can: anything that can open a
connection from a listed address chooses the client address.

The change applies at once. Each change is written to the system log.

You can also set it in `/etc/kvm/server.yaml` ([Server configuration](../reference/config.md)):

```yaml
security:
  trusted_proxies:
    - 10.0.0.1
```

Restart the server afterwards. An entry that is not an address or a range is
skipped with a warning in the log. The list holds at most 16 entries, and a range
that covers every address (`0.0.0.0/0`) is refused.

### 3. Caddy

On the VPS, a `Caddyfile` for `kvm.example.com`:

```caddyfile
kvm.example.com {
	header Strict-Transport-Security "max-age=31536000; includeSubDomains"

	reverse_proxy 10.0.0.2:80 {
		# Replace anything the visitor sent, so the device sees only what Caddy saw.
		header_up X-Forwarded-For {remote_host}
		header_up X-Forwarded-Proto {scheme}
	}
}
```

Caddy gets and renews the certificate for the domain by itself, upgrades
WebSockets without further settings, and keeps the visitor's `Host` header, which
the device compares with the `Origin` of the page. Add the HSTS line only once
the site works over HTTPS: browsers then refuse plain HTTP for it for a year.

Do not add Caddy's `trusted_proxies` option unless Caddy itself sits behind another
proxy, such as a CDN. Without it Caddy drops forwarded headers a visitor sent.

If you use another proxy, it must send `X-Forwarded-For` and `X-Forwarded-Proto`,
replace any value the visitor sent, pass the original `Host` header and upgrade
WebSockets.

### 4. Check it

1. Open `https://kvm.example.com` and sign in.
2. In the browser's developer tools, the `nano-kvm-token` cookie should have the
   `Secure` and `HttpOnly` flags.
3. In **Settings > System > Logging**, or the system log, the sign-in line
   names your own address as `source=`, not `10.0.0.1`.

If the source is still the proxy's address, the proxy's address in the list is not
the one the device sees. If a WebSocket (the keyboard and mouse, or the video)
is refused with "invalid websocket origin", the proxy is not passing the original
`Host` header, or its `X-Forwarded-Proto` does not match the scheme of the page.

## Video through the proxy

Only the web page, the API and WebSockets pass through Caddy. WebRTC media does
not: it travels as UDP between the browser and the device, and a browser on the
internet cannot reach the device's tunnel address. So pick one of these:

- **H.264 (Direct)** in the screen menu. It runs over a WebSocket, so it
  passes through Caddy, and the page is HTTPS, which it needs. The browser must
  support WebCodecs. This is the one to start with.
- **MJPEG**. It also passes through the proxy, with more bandwidth and a lower frame
  rate.
- **H.264 (WebRTC)** only with a TURN server that the browser and the device can
  both reach, for example [coturn](https://github.com/coturn/coturn) on the same
  VPS. Both ends connect to the TURN server, which relays the media. The device has
  no screen for this: set it in `/etc/kvm/server.yaml` and restart the server.

  ```yaml
  turn:
    turn_addr: kvm.example.com:3478
    turn_user: kvm
    turn_cred: <a long random password>
  ```

  The same address and credentials go to the device and, when a viewer opens a
  WebRTC session, to the browser, so use a user that serves only this device.
  Open UDP and TCP `3478` and a relay port range on the VPS (coturn's
  `min-port` and `max-port`), and the device must be able to reach them: Moderate
  lets outbound connections through. The server does not use `turns:`, so the
  credentials cross the internet unencrypted between the browser and the TURN
  server. TURN has not been checked on a device with this setup yet.

## Notes

- Only the proxy needs to be in the list. Browsers on your own network that
  open `http://<device address>` still connect directly, with their own address
  and a cookie that is not `Secure`.
- If the proxy's address changes (a new tunnel address), update the list. Until
  then the proxy is not trusted: sign-ins show its address as their source and the
  cookie is not `Secure`.
