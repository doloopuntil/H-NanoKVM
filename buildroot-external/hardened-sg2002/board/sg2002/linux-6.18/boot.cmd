# U-Boot script (boot.scr): verify the FIT's hashes and boot kernel, DTB and initramfs.
setenv bootargs "root=/dev/mmcblk0p2 rootwait rw console=ttyS0,115200 earlycon"
load ${devtype} ${devnum}:${distro_bootpart} 0x84000000 ${prefix}boot.itb && bootm 0x84000000
