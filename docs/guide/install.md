---
status: current
applies-to: system 1.0.0 / app 3.0.0 (Linux 6.18)
last-checked: 2026-11-13
---

# Install: flash an SD card

This guide writes a complete Hardened NanoKVM image to a microSD card and takes
the device through its first boot. A fresh card is also the recovery path: there
is no password reset, so lost credentials mean reflashing.

Full SD-card images are `.img` or `.img.xz` files, for example
`hardened-sg2002-6x.img.xz` from the CI build or
`Hardened_NanoKVM_*_rust.img.xz` from older releases.

Application update archives such as `hardened-nanokvm-kvmapp-*.tar.gz` are not
SD-card images. Install those through the web GUI updater instead.

## Before You Start

- Use a known-good microSD card, ideally 16 GB or larger.
- Check your board. The image supports the NanoKVM Lite, the Full (Cube) and the PCIe
  version; only the Lite has been tested on hardware so far. The early-access Full
  ("alpha", OLED at I2C address `0x3d`) is not supported from system 1.0.0 on.
- Get an image. For system `1.0.0`, the image is the `sg2002-6x-sd-image`
  artifact of the **H-NanoKVM system image (Linux 6.18)** workflow (see
  [CI image build](../development/ci-image-build.md)): `sd-image/hardened-sg2002-6x.img.xz`,
  with its checksum in `sd-image/SHA256SUMS`. Published release downloads
  for 1.0.0 are not set up yet. Older images (up to RC12, system `0.3.0-raw.12`)
  are on the woffko release page: <https://github.com/woffko/Hardened_NanoKVM/releases>.
- Check the image against its SHA-256 before writing it.
- If both `.img` and `.img.xz` are available, prefer `.img.xz`; the tools below
  can write it directly or stream-decompress it.
- Writing an image destroys all data on the selected card.
- Pick the target disk carefully. A wrong disk name can overwrite your computer
  drive.

Keep the card you are replacing, or a separate known-good recovery card,
unchanged until the new card has booted and passed your checks.

## Windows: Balena Etcher

Balena Etcher is the safest default option on Windows because it handles `.xz`
images and reduces the chance of selecting the wrong disk.

1. Download and install Balena Etcher from <https://etcher.balena.io/>.
2. Download the Hardened NanoKVM `.img.xz` SD-card image.
3. Insert the microSD card into your card reader.
4. Open Balena Etcher.
5. Click **Flash from file** and select the downloaded `.img.xz`.
6. Click **Select target** and choose the microSD card.
7. Click **Flash**.
8. Wait for Etcher to finish validation.
9. Safely eject the card from Windows.
10. Insert the card into NanoKVM and power the device.

Then follow the [first boot checklist](#first-boot-checklist).

## Linux

The most reliable Linux path is to stream-decompress the image directly to the
whole block device with `xzcat` and `dd`.

Identify the card:

```sh
lsblk -o NAME,SIZE,MODEL,TRAN,MOUNTPOINTS
```

Unmount any mounted partitions on the card. Replace `/dev/sdX` with the real
device name, for example `/dev/sdb` or `/dev/mmcblk0`:

```sh
sudo umount /dev/sdX* 2>/dev/null || true
```

Write the image:

```sh
xzcat Hardened_NanoKVM_*.img.xz | sudo dd of=/dev/sdX bs=4M conv=fsync status=progress
sync
```

For an uncompressed `.img`:

```sh
sudo dd if=Hardened_NanoKVM_*.img of=/dev/sdX bs=4M conv=fsync status=progress
sync
```

Eject the card:

```sh
sudo eject /dev/sdX
```

Do not write to a partition such as `/dev/sdX1`; write to the whole card device
such as `/dev/sdX`.

## macOS

Find the SD card:

```sh
diskutil list
```

Unmount it. Replace `N` with the disk number, for example `disk4`:

```sh
diskutil unmountDisk /dev/diskN
```

Install `xz` if needed:

```sh
brew install xz
```

Write the compressed image. Use the raw device `rdiskN` for better speed:

```sh
xzcat Hardened_NanoKVM_*.img.xz | sudo dd of=/dev/rdiskN bs=4m status=progress
sync
```

For an uncompressed `.img`:

```sh
sudo dd if=Hardened_NanoKVM_*.img of=/dev/rdiskN bs=4m status=progress
sync
```

Eject it:

```sh
diskutil eject /dev/diskN
```

macOS may show a warning that the card is unreadable after flashing. That is
normal for Linux partitions; eject it instead of initializing it.

## FreeBSD

Find the card:

```sh
camcontrol devlist
gpart show
```

The card will usually appear as `/dev/da0`, `/dev/da1`, or `/dev/mmcsd0`.
Unmount any mounted partitions first:

```sh
mount | grep '/dev/da0'
sudo umount /dev/da0p1 2>/dev/null || true
sudo umount /dev/da0p2 2>/dev/null || true
sudo umount /dev/da0p3 2>/dev/null || true
```

Write a compressed image:

```sh
xzcat Hardened_NanoKVM_*.img.xz | sudo dd of=/dev/da0 bs=4m conv=sync
sync
```

For an uncompressed `.img`:

```sh
sudo dd if=Hardened_NanoKVM_*.img of=/dev/da0 bs=4m conv=sync
sync
```

If your card is `/dev/mmcsd0`, use that whole-disk device instead of `/dev/da0`.
Do not write to a partition such as `/dev/da0p1`.

After writing, remove the card only after `sync` returns.

## First Boot Checklist

1. Connect Ethernet and power. The first boot expands the data partition and
   takes longer than later boots.
2. Find the IP address from your router's DHCP leases, the NanoKVM OLED, or the
   mDNS name (the first label of the device name plus `.local`, `h-nanokvm.local`
   until you change it).
3. Open `http://<address>` in a browser.
4. Create the administrator account. There is no default `admin/admin`. The
   account's password also becomes the `root` password for SSH, which is on by
   default; turn it off in **Settings > Network > Services** if you don't need it.
5. Optional but recommended: turn on HTTPS (**Settings > Network > Services**), set up two-factor sign-in
   ([Sign-in and two-factor](sign-in.md)) and review the
   [firewall mode](firewall.md).
6. Keep a known-good recovery card nearby before trying raw system updates
   ([Updates](updates.md)).
