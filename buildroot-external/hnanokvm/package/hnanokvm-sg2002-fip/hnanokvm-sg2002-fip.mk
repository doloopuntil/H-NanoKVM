################################################################################
#
# hnanokvm-sg2002-fip
#
################################################################################

HNANOKVM_SG2002_FIP_VERSION = 5a80c127cf614dea7f534d5b5352886a1c720d37
HNANOKVM_BOOT_SOURCE_DIR ?= \
	$(abspath $(BR2_EXTERNAL_HNANOKVM_PATH)/../../build/sg2002-boot-source)
HNANOKVM_SG2002_FIP_SITE = $(HNANOKVM_BOOT_SOURCE_DIR)
HNANOKVM_SG2002_FIP_SITE_METHOD = local
HNANOKVM_SG2002_FIP_LICENSE = GPL-2.0
HNANOKVM_SG2002_FIP_LICENSE_FILES = LICENSE
HNANOKVM_SG2002_FIP_INSTALL_IMAGES = YES
HNANOKVM_SG2002_FIP_INSTALL_TARGET = NO
HNANOKVM_SG2002_FIP_DEPENDENCIES = host-python3 opensbi uboot

# Local sources are not patched by Buildroot; a rebuild re-syncs over an already patched tree.
# licheerv's patches are against the SDK, with the FSBL under fsbl/.
HNANOKVM_SG2002_FIP_SDK_PATCH_FILES = \
	$(BR2_EXTERNAL_SIPEED_LICHEERV_NANO_PATH)/boot/fsbl-sg200x/0001-mainline-toolchain.patch \
	$(BR2_EXTERNAL_SIPEED_LICHEERV_NANO_PATH)/boot/fsbl-sg200x/0004-gcc-maybe-uninitialized.patch \
	$(BR2_EXTERNAL_SIPEED_LICHEERV_NANO_PATH)/boot/fsbl-sg200x/0005-ld-remove-gcc-optimization-option.patch
HNANOKVM_SG2002_FIP_PATCH_FILES = \
	$(BR2_EXTERNAL_HNANOKVM_PATH)/board/sg2002/fsbl-patches/fsbl-boot-guard.patch

define HNANOKVM_SG2002_FIP_APPLY_PATCHES
	if [ ! -e $(@D)/.stamp_hnanokvm_patched ]; then \
		$(foreach p,$(HNANOKVM_SG2002_FIP_SDK_PATCH_FILES),\
			patch -d $(@D) -p2 --forward --batch -F 0 -i $(p) &&) \
		$(foreach p,$(HNANOKVM_SG2002_FIP_PATCH_FILES),\
			patch -d $(@D) -p1 --forward --batch -F 0 -i $(p) &&) \
		touch $(@D)/.stamp_hnanokvm_patched; \
	fi
endef
HNANOKVM_SG2002_FIP_POST_RSYNC_HOOKS += HNANOKVM_SG2002_FIP_APPLY_PATCHES

HNANOKVM_SG2002_FIP_C906L_IMAGE = $(call qstrip,$(BR2_PACKAGE_HNANOKVM_SG2002_FIP_C906L_IMAGE))

# No SWITCH_32K_XTAL: on the Lite the RTC on XTAL32K never completes a warm reset (it powers off).
HNANOKVM_SG2002_FIP_MAKE_OPTS = \
	CHIP_ARCH=cv181x ARCH=riscv BOOT_CPU=riscv \
	CROSS_COMPILE_GLIBC_RISCV64=$(TARGET_CROSS) \
	DDR_CFG=ddr3_1866_x16 TPU_PERF_MODE=y \
	BUILD_STRING=hardened-$(HNANOKVM_SG2002_FIP_VERSION) \
	BUILD_MESSAGE_TIMESTAMP='"0000-00-00T00:00:00+00:00"' \
	CFLAGS="-fno-stack-protector" \
	MONITOR_PATH=$(BINARIES_DIR)/fw_dynamic.bin \
	LOADER_2ND_PATH=$(@D)/u-boot-bl33.bin \
	BLCP_2ND_PATH=$(HNANOKVM_SG2002_FIP_C906L_IMAGE)

# std: standard clocks; od: the FSBL's overdrive table (C906 1050 MHz, VDDC 1.00 V).
define HNANOKVM_SG2002_FIP_BUILD_CMDS
	$(INSTALL) -D -m 0644 $(HNANOKVM_SG2002_FIP_PKGDIR)/cvi_board_memmap.h \
		$(@D)/build/cvi_board_memmap.h
	text_base=$$(sed -n 's/^CONFIG_TEXT_BASE=//p' $(UBOOT_DIR)/.config) && \
		test -n "$$text_base" && \
		$(HOST_DIR)/bin/python3 $(HNANOKVM_SG2002_FIP_PKGDIR)/pack-bl33.py \
			--input $(BINARIES_DIR)/u-boot.bin --output $(@D)/u-boot-bl33.bin \
			--text-base $$text_base
	$(TARGET_MAKE_ENV) $(MAKE) -C $(@D) $(HNANOKVM_SG2002_FIP_MAKE_OPTS) \
		O=$(@D)/build/std fip-all
	$(TARGET_MAKE_ENV) $(MAKE) -C $(@D) $(HNANOKVM_SG2002_FIP_MAKE_OPTS) \
		O=$(@D)/build/od OD_CLK_SEL=y fip-all
	if cmp -s $(@D)/build/std/fip.bin $(@D)/build/od/fip.bin; then \
		echo "standard and overdrive FIPs are identical" >&2; exit 1; fi
endef

define HNANOKVM_SG2002_FIP_INSTALL_IMAGES_CMDS
	$(INSTALL) -D -m 0644 $(@D)/build/std/fip.bin $(BINARIES_DIR)/fip.std.bin
	$(INSTALL) -D -m 0644 $(@D)/build/od/fip.bin $(BINARIES_DIR)/fip.od.bin
	$(INSTALL) -D -m 0644 $(@D)/build/std/fip.bin $(BINARIES_DIR)/fip.bin
endef

$(eval $(generic-package))
