---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-10
---

# Virtual media

The NanoKVM can present a disk image to the host as a USB CD-ROM or USB mass
storage device, for installing an operating system or booting a rescue image.
Images live in `/data` on the SD card.

## Mount an image

Open **Images** in the menu bar and choose a mount mode above the list. Click an
image to show **Mount** and **Delete**, then click **Mount**. The mount mode:

- **CD-ROM** for `.iso` installers. This is what BIOS and UEFI boot menus expect.
- **Mass storage** for `.img` disk images, and for hybrid ISOs that boot better
  as a disk.

Every image is served **read-only** in both modes, so the host can neither write
to nor format it. Switching between CD-ROM and mass storage reconnects the USB
device so the host's firmware sees the new device type.

If the host does not notice a change, use **USB reconnect**. If the host has
locked the optical drive (an installer often does), **Force eject** releases it;
both briefly disconnect the keyboard and mouse.

## The virtual disk and `/data`

**Settings > Device > Virtual disk** shares the `/data` partition itself with the
host as a USB drive. Only one side writes `/data` at a time:

- While the host has the virtual disk, `/data` is read-only on the NanoKVM, so
  image uploads and downloads are refused until you turn the virtual disk off.
- Mounting an image turns the virtual disk off; the image list asks first.
  Turning the virtual disk on cancels a mounted image.
- The virtual disk cannot be turned on while an image transfer is running.

## Add images

- **Upload** from the browser: **Add image** in **Images** opens a dialog where you
  drop a file or choose one. An optional SHA-256 checks the file once it has arrived.
- **Download from a link**, in the same dialog: turn on remote download in **Settings > User > Preferences**
  first; it is off by default, and turning it on asks for your password and, with
  two-factor, a code. The device accepts only `http`/`https` URLs to a host on the
  public internet (not an address on your own network, `localhost` or a `.local`
  name, also after a redirect), a plain image file name, a size that fits, and a file
  that really is an ISO 9660 image. Enter the optional SHA-256 to have the download checked. The progress shows
  in the dialog and above the image list, and a dot on the menu bar icon. You can close the dialog and the
  transfer goes on; **Cancel** stops it and removes the partial file.
- **Over the network**: `scp your-image root@<nanokvm>:/data` (needs SSH).
- **Through the virtual disk**: turn it on, copy the image to the drive that
  appears on the host, then turn it off.
- **On the SD card** directly, from a Linux machine: copy to the `/data`
  partition.

An image with the same name as a mounted one cannot be replaced while it is
mounted.

## HID-only mode

[HID-only mode](usb-and-input.md#hid-only-mode) removes the virtual disk and
network devices, so images cannot be mounted while it is on.
