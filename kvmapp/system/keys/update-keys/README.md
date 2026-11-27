# System update public-key ring

Only reviewed public keys named `<key-id>.pub.pem` belong in this directory.
Private keys must never be copied into the repository or application archive.

Rotation sequence:

1. ship the new public key in an authenticated manual offline bridge
   application update because the legacy private key is unavailable;
2. sign the following system metadata with the new key ID;
3. keep the legacy IDs and the new production ID in
   `system/keys/update-key-policy` throughout the migration window;
4. after the new metadata verifies and the migration window closes, ship a
   later policy containing only the production key ID;
5. verify app and system update checks after reboot and after rollback.

The RC12 bridge policy deliberately permits both historical key IDs and
`hardened-system-prod-2026q3`. It must not retire legacy IDs during RC12.

The application installs the policy at every start, before it serves a
request. Verification refuses every key ID while the installed policy file is
missing, so a lost policy never widens the trust set.
