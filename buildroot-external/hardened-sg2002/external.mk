include $(sort $(wildcard $(BR2_EXTERNAL_HARDENED_SG2002_PATH)/package/*/*.mk))

# Build musl for the C906's T-Head scalar extensions, the set the Rust server uses.
# A package -march replaces the toolchain wrapper's; the rest of userspace stays rv64gc.
MUSL_EXTRA_CFLAGS += -march=$(GCC_TARGET_ARCH)_xtheadba_xtheadbb_xtheadbs_xtheadcondmov_xtheadmemidx_xtheadmempair_xtheadmac

# linux-6.18/post-image.sh compresses the kernel for the FIT with host lz4, which has no
# Buildroot option of its own.
ifeq ($(BR2_LINUX_KERNEL),y)
LINUX_DEPENDENCIES += host-lz4
endif

# Security-maintenance VEX for the exact raw.11 configuration. Keep these
# entries tied to source/config evidence; do not use them to suppress an
# unresolved vulnerable code path.

# Fixed by board/sg2002/patches/busybox/1.38.0/0012..0014.
BUSYBOX_IGNORE_CVES += \
	CVE-2026-38753 \
	CVE-2026-38754 \
	CVE-2026-38755

# The exact util-linux 2.41.5 tarball already contains upstream commit
# c0186f14fbdb02f64c8e0ba701ce727ea764ff4c.
UTIL_LINUX_IGNORE_CVES += CVE-2026-13595
UTIL_LINUX_LIBS_IGNORE_CVES += CVE-2026-13595

# CVE-2007-2768 requires OPIE/PAM (both absent); CVE-2008-3844 describes
# unofficial trojanized RHEL packages; CVE-2023-51767 is the disputed
# Rowhammer/co-location scenario, not an OpenSSH source defect reachable here.
OPENSSH_IGNORE_CVES += \
	CVE-2007-2768 \
	CVE-2008-3844 \
	CVE-2023-51767

# CVE-2023-4039 is specific to AArch64 stack-protector code. This target is
# RISC-V64.
GCC_FINAL_IGNORE_CVES += CVE-2023-4039
