---
status: current, channels pending
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-10-28
---

# Updates

H-NanoKVM has two kinds of update, and they are kept apart on purpose:
replacing the application is safe to retry, while a system update rewrites SD-card
partitions and can leave a device that does not boot.

> [!IMPORTANT]
> **Update channels for 0.4.0 are not set up yet.** The server still reads the
> channels of `woffko/Hardened_NanoKVM`, which do not carry 0.4.0. Until this fork
> has channels of its own, install 0.4.0 by flashing an SD card
> ([Install](install.md)) or by uploading an application archive through
> **Offline updates**. This page will be updated when the channels exist.

## Application updates

An application update replaces only `/kvmapp`: the Rust server, the web UI, the
init scripts and helpers shipped with it, the update keys and the version file. It
does not touch the boot partition, the root filesystem or the kernel. Backend and
web UI fixes ship this way.

In **Settings > System > Updates**:

- **Application** checks the online channel. The device accepts an update only
  when its `latest.json` carries a valid signature and the downloaded archive
  matches the SHA-512 in it.
- **Upload application bundle** takes one signed bundle from this computer and
  shows the upload progress. It stays disabled until you set a local update key
  (under **Local updates**, at the bottom of the page). The device checks the
  signature with the same keys as the system bundle, including the local update
  key, then runs the package checks. A bundle signed by a release key must be
  newer than the installed application. Nothing is installed yet: the verified
  bundle appears as the latest version with an amber **Local** badge, next to
  **Discard** and **Install**, and stays staged across restarts. Discarding checks
  the online channel again. Build one with
  `scripts/create-application-update-bundle.sh`.

The server restarts after an application update; sign in again afterwards. The
previous application stays in `/root/old`. After the restart the device waits up to
about two and a half minutes for the new server to answer its health check. If it
does not, the previous application is put back, the failed one is kept in
`/root/failed-app`, and the server restarts again. This happens once per update;
it is logged in the system log as `nanokvm-runtime`. A new version that answers the
health check but misbehaves is not caught, and has to be rolled back by hand: stop
the server, swap `/kvmapp` and `/root/old`, and start it again.

## System updates

A system update writes new images to the boot and root partitions
(`/dev/mmcblk0p1` and `/dev/mmcblk0p2`). It is the only way to change the kernel,
the Buildroot userspace or the init scripts installed in the root filesystem.

- A system update writes the boot and root partitions as they are, so it never changes the
  partition layout. An image whose boot filesystem is larger than the card's boot partition,
  such as the 32 MiB `/boot` that replaced the old 16 MiB one, is refused with a size error;
  the card has to be flashed once with the new image.
- **Download and verify** fetches the system bundle into
  `/data/.hardened-kvmcache`, checks its signed metadata, the archive digest and
  every payload hash, and stages it.
- **Swap** is turned off for the write and made again afterwards: the chosen size is kept in
  `/boot/swap.size`, and the swap file is recreated at the first boot of the new system.
- **Install** re-checks the staged bundle, backs up the configuration it needs,
  streams the compressed images onto the partitions and reboots. The web UI
  shows a waiting screen with an elapsed timer and reloads itself when the device
  is back. Writing takes about three minutes and the restart about 20 seconds more;
  wait at least ten minutes before cutting power, because the web UI and SSH are
  unavailable while the partitions are written.
- A system update returns the device to the standard clocks. Turn on **Keep overdrive
  after updates** in Settings > System to carry the overdrive choice over.
- On the first boot of the new system, the saved configuration in `/etc/kvm` is
  restored before SSH and the server start. Once the server reports healthy, the
  boot watchdog confirms the update. If health checks fail after boot, it rolls
  back.
- An installed update that replaces files and does not reboot by itself shows a
  **Reboot required** badge next to **Pending version** until the device has booted
  into it. After that, **Boot health** shows the checks, and the boot watchdog
  confirms the update by itself within about two minutes of a healthy boot; if the
  checks keep failing it rolls the update back once.

### Updating from a CI build

Each image build also publishes an unsigned system-update archive, as the
`system-update-archive` artifact of the workflow run. Its version is the base
system version with the run number as the last part, such as `0.4.57`, so each
build is newer than the one before. To install it without an SD-card reflash:

1. Create a key pair and set the public half as the local update key, as in
   steps 1 and 2 below.
2. Download the `system-update-archive` artifact and unpack it.
3. In the unpacked folder, run `sh sign-local-system-update.sh /path/to/local.pem`.
   It needs only `sh`, `openssl` and `tar`, so it works on macOS without Docker,
   and writes `<version>.bundle.tar` next to the script.
4. Choose **Upload system bundle** and select that file. Install it as usual.

The archive holds raw boot and rootfs images, which have no automatic rollback.
Keep a way to reflash the SD card.

### Updating from a bundle you built

To update without the release channel or an SD-card reflash, sign the bundle
with a key of your own and upload it.

1. Create a key pair on your computer and keep the private half there:
   `openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:3072 -out local.pem`, then
   `openssl pkey -in local.pem -pubout -out local.pub.pem`.
2. In **Settings > System > Updates**, choose **Set key** under **Local update key**,
   paste `local.pub.pem` and enter your password. The device now trusts that key
   for uploaded bundles only; the online channels never use it. Wrong passwords
   count against the same lockout as the terminal unlock, and an account with
   two-factor also enters a fresh code (one that just signed you in cannot be
   used again, so wait for the next). Without a key, the
   device refuses every bundle upload and every install of an uploaded bundle,
   whoever signed it.
3. Build the metadata with
   `SYSTEM_UPDATE_SIGNING_KEY=local.pem SYSTEM_UPDATE_SIGNATURE_KEY_ID=local CHANNEL=dev scripts/create-system-update-metadata.sh <version> hardened-system-<version> <archive> system-latest.json`.
   This also writes `system-latest.json.sig`.
4. Wrap the three files into one bundle with
   `scripts/create-system-update-bundle.sh <archive> system-latest.json system-latest.json.sig <version>.bundle.tar`.
5. Choose **Upload system bundle** and select the `.bundle.tar`. The device
   verifies the signature, the archive digests and every payload hash, then
   stages the bundle. Install it as usual.

Bundles signed by the local key may repeat or lower the installed version, so a
development build can be reinstalled. Bundles signed by a release key must still
be newer. Choose **Remove** to withdraw the key. Registering and removing it
needs your password and is written to the system log.

Keep a recovery card ready and the power connected. A system update does not
recover by itself from a device that cannot boot at all; reflash the card then.

## Which one to use

Use an application update for anything inside `/kvmapp`. Use a system update, or
a fresh SD card, only when the base system changes. A system bundle can require a
minimum application version (RC12's required app 2.0.42), so install the
application update first when both are offered.

## For maintainers

The bundle layout, metadata format and signing are in
[System-update bundles](../reference/system-update-bundles.md).
