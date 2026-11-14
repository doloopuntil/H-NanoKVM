---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-11
source: server-rust/src/config.rs
---

# Server configuration (`/etc/kvm/server.yaml`)

The server reads `/etc/kvm/server.yaml`, or the file named by `NANOKVM_CONFIG`.
Every field is optional; a missing field takes the default below. Most of them
are changed from the web UI, which rewrites the file. Edit it by hand only with
the server stopped, and restart it afterwards (`/etc/init.d/S95nanokvm restart`).

Upstream NanoKVM field names in camelCase (`secretKey`, `loginMaxFailures`, …)
are still accepted.

## Listening

| Field | Default | Meaning |
| --- | --- | --- |
| `proto` | `http` | `http` or `https`. With `https`, plain HTTP redirects to HTTPS and a loopback-only HTTP surface stays for PicoClaw's internal routes. |
| `host` | `0.0.0.0` | Address to bind. |
| `port.http` | `80` | |
| `port.https` | `443` | |
| `cert.crt`, `cert.key` | `server.crt`, `server.key` | TLS certificate and key, normally `/etc/kvm/server.crt` and `/etc/kvm/server.key`. A Tailscale or Let's Encrypt certificate sets both to `/etc/kvm/certs/managed.pem`, one file with chain and key; if it does not load at startup, the self-signed pair serves instead. |
| `logger.level` | `info` | |
| `logger.file` | `stdout` | |
| `stun` | `stun.l.google.com:19302` | STUN server for H.264 WebRTC. |
| `turn.turn_addr`, `turn.turn_user`, `turn.turn_cred` | empty | Optional TURN server for WebRTC. |
| `compatibility_mode` | `false` | |

## Authentication and sessions

| Field | Default | Meaning |
| --- | --- | --- |
| `authentication` | `enable` | `disable` turns sign-in off, but only together with `security.allow_auth_disable: true`. For local web UI development only. |
| `jwt.secret_key` | empty | Upstream field, unused: sessions are opaque random tokens kept in memory. |
| `jwt.refresh_token_duration` | `2678400` | Seconds. |
| `jwt.revoke_tokens_on_logout` | `true` | |
| `security.login_max_failures` | `5` | Failed sign-ins per address and user before a lockout; an address is also locked after four times as many failures across all users. |
| `security.login_lockout_duration` | `600` | Lockout in seconds. |
| `security.require_csrf` | `true` | CSRF token on state-changing requests. |
| `security.websocket_origin_check` | `true` | Reject WebSockets from another origin. |
| `security.allowed_origins` | empty | Extra origins to accept, for a reverse proxy. |
| `security.trusted_proxies` | empty | Addresses or ranges (`10.0.0.1`, `10.0.0.0/24`, IPv6 too) of reverse proxies whose `X-Forwarded-For` and `X-Forwarded-Proto` are believed. From any other address the headers are ignored. At most 16 entries; an entry that does not parse, or a range that covers every address, is skipped with a warning. Settings > Network > Services > Reverse proxy edits it; see [Reverse proxy](../guide/reverse-proxy.md). |
| `security.access_token_duration` | `900` | Seconds. |
| `security.logout_on_browser_close` | `true` | Session cookie without a lifetime. |
| `security.refresh_token_duration` | `604800` | Seconds. |
| `security.revoke_tokens_on_password_change` | `true` | |
| `security.require_totp` | `false` | Require a second factor; see [Sign-in and two-factor](../guide/sign-in.md). |
| `security.allow_default_admin` | `false` | Seed `admin/admin` when no account exists. For isolated test devices only. |
| `security.allow_auth_disable` | `false` | Permits `authentication: disable`. |

## Features off by default

| Field | Default | Switched from |
| --- | --- | --- |
| `security.allow_terminal` | `false` | The Terminal menu. |
| `security.allow_remote_image_download` | `false` | Settings > User > Preferences. |
| `security.allow_unsigned_updates` | `false` | Not in the UI. Accepts update metadata without a valid signature; never on a real device. |

## Paths

| Field | Default |
| --- | --- |
| `paths.account_file` | `/etc/kvm/pwd` |
| `paths.session_secret_file` | `/etc/kvm/session_secret` (unused, no longer created) |
| `paths.web_root` | `/kvmapp/server/web` |
| `paths.image_directory` | `/data` |
| `paths.update_cache_dir` | `/data/.hardened-kvmcache` |
| `paths.system_update_local_public_key` | `/etc/kvm/system-update-local.pub.pem` (set from the UI; trusted only for uploaded system bundles) |
| `paths.system_update_public_key` | `/etc/kvm/system-update-signing.pub.pem` (copied from `/kvmapp/system/keys/` by `S95nanokvm`) |

Other settings live in their own files; see [Device files](device-files.md).
