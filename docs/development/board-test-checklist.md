---
status: current
applies-to: system 1.0.0 / app 3.0.0 (Linux 6.18)
last-checked: 2026-11-11
---

# Board test checklist (Linux 6.18)

The 6.18 image is tested on a Lite only. The Full (Cube) and PCIe boards use paths the
Lite never runs and nobody here can test them; this list is for anyone who has one. Work down the list on a
freshly flashed card and report each item as passed, failed (with what you saw), or not
applicable. Collect logs over SSH with `dmesg` and `logread` (or the console) when
something fails.

Note the board and its options before you start: Full or PCIe, with or without Wi-Fi,
with or without PoE, and the HDMI bridge (`cat /etc/kvm/hdmi_version`).

## Every board

1. **First boot.** The device boots and the web UI comes up. A PCIe board reboots once
   by itself on the very first boot, after it detects its hardware; that is expected.
2. **Board detection.** `cat /etc/kvm/hw` shows `beta` on a Full and `pcie` on a PCIe
   board, and the web UI's device information names the same board.
3. **HDMI capture.** Connect a host. The picture appears, and follows the host when you
   change its resolution (within a few seconds). Unplug and replug HDMI: "no signal",
   then the picture again.
4. **Keyboard and mouse.** Both work in the host. Mass storage: mount an image and see
   it in the host.
5. **Reboot** from the web UI works, and the device comes back.

## Full (Cube)

6. **OLED.** The 128x64 screen shows the IP address and status after boot.
   `ls /etc/kvm/oled_exist` exists.
7. **ATX power.** With the ATX board wired to a PC: the web UI's Power button turns the
   PC on, a long press forces it off, and Reset restarts it.
8. **Power LED.** The web UI shows the PC's power state, and it changes when the PC
   turns on or off.
9. **User key.** A long press (over 1.5 s) opens the Wi-Fi setup page on boards with
   Wi-Fi.

## PCIe

10. **OLED.** The 64x32 screen shows the IP address and status after boot.
11. **ATX header.** With the 9-pin cable to the motherboard: power on, forced off and
    reset work from the web UI, and the power state shows. There is no HDD LED.
12. **HDMI idle timeout.** Set the idle timeout in Settings, close every viewer and wait
    for it: the HDMI bridge stops. Open the stream again: the picture returns within a
    few seconds. Then switch HDMI off and on from the UI.
13. **Wi-Fi (if fitted).** `ip link show wlan0` lists the interface, the Wi-Fi settings
    page appears, and the board joins a network and is reachable over it. Access-point
    setup mode (user key long press) brings up the setup network.
14. **PoE (if fitted).** The board runs powered over Ethernet alone.
15. **Powered from the slot.** The board boots in the PC's PCIe slot, and stays up while
    the PC reboots, if the slot keeps standby power.

## What to report

For a failure: the item number, what you expected and what you saw, `/etc/kvm/hw`,
`/etc/kvm/hdmi_version`, `uname -r`, and `dmesg` from the boot.
