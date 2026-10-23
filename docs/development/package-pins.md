---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-07
---

# Optional package pins

Tailscale and picoclaw are not part of the image. The web UI installs them on
request, and the backend then downloads exactly one release file for each. The
file's size and SHA-256 are constants in the backend source (`PACKAGE` in
`server-rust/src/api/tailscale.rs` and `server-rust/src/api/picoclaw.rs`), so
they ship inside the signed app. Nothing fetched at install time changes what
is accepted. A hash served next to a package comes from the same origin, so
none is fetched.

`system::package_download::fetch` runs curl with `--proto =https
--proto-redir =https` and with `--max-filesize` set to the pinned size. It then
hashes the file on a blocking thread and removes it unless the digest matches.
A failed transfer also leaves no file. There is no wget fallback (BusyBox wget
in RC12 has no HTTPS) and no other transport.

| Package | Release file | Size | SHA-256 |
| --- | --- | --- | --- |
| Tailscale 1.104.2 | `https://pkgs.tailscale.com/stable/tailscale_1.104.2_riscv64.tgz` | 37991456 | `1f8065e0d966a607ec013c31da09ced55943e4de17cd2e520c9cb8e22f6d3f62` |
| picoclaw v0.3.1 | `https://github.com/sipeed/picoclaw/releases/download/v0.3.1/picoclaw_Linux_riscv64.tar.gz` | 22914731 | `5124e553c8fb6f90cd57f7478a37409d2d98531cb028ca6ead6cc6867650d58a` |

How each pin was checked:

- Tailscale (woffko, 2026-10-23; not repeated here): with Tailscale's own signature
  chain (`clientupdate/distsign`). The root keys come from Tailscale's source at tag
  v1.104.2 (`clientupdate/distsign/roots/*.pem`). One of them, `crawshaw-root.pem`,
  signs the signing key bundle `https://pkgs.tailscale.com/distsign.pub`. Its signing
  key signs BLAKE2s-256 of the package followed by the package length (`.tgz.sig`).
  The SHA-256 equals the server's `.tgz.sha256`, which is not relied on.
- picoclaw: the digest is the one in the release's `picoclaw_0.3.1_checksums.txt`,
  which the server already pinned before this change. The size is the
  `content-length` of the release asset (2026-11-07), read from the response headers.

## Updating a pin

A new pin is a source change (`PACKAGE` in the two files). It reaches devices only in a signed app
release. A device installs the pinned release, never a newer one.

Tailscale:

1. Download `tailscale_<version>_riscv64.tgz` and its `.sig` from
   `https://pkgs.tailscale.com/stable/`. Download `distsign.pub` and
   `distsign.pub.sig` from `https://pkgs.tailscale.com/`.
2. Take the root keys from Tailscale's source at the same release tag:
   `clientupdate/distsign/roots/*.pem`.
3. Run `scripts/verify-tailscale-package-signature.py ROOTS distsign.pub
   distsign.pub.sig PACKAGE PACKAGE.sig`. It prints the size and SHA-256 to pin
   only when both signatures verify.

picoclaw: download the release asset from the GitHub release and pin it only when
its SHA-256 matches the one in the release's `picoclaw_<version>_checksums.txt`; the
size is the file's length.

The manual steps shown after a failed Tailscale install still link to
Tailscale's latest static package. Installing by hand is the owner's own
choice and does not go through this check.
