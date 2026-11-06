################################################################################
#
# hardened-sg2002-fip
#
################################################################################

HARDENED_SG2002_FIP_VERSION = d88d58feca49ef15f4cc7bd1f27dbf17dc25f85e
HARDENED_SG2002_BOOT_SOURCE_DIR ?= \
	$(abspath $(BR2_EXTERNAL_HARDENED_SG2002_PATH)/../../build/sg2002-boot-source)
HARDENED_SG2002_FIP_SITE = $(HARDENED_SG2002_BOOT_SOURCE_DIR)
HARDENED_SG2002_FIP_SITE_METHOD = local
HARDENED_SG2002_FIP_LICENSE = PROPRIETARY
HARDENED_SG2002_FIP_INSTALL_IMAGES = YES
HARDENED_SG2002_FIP_INSTALL_TARGET = NO
HARDENED_SG2002_FIP_DEPENDENCIES = host-python3 opensbi uboot

# Local sources are not patched by Buildroot; a rebuild re-syncs over an already patched tree.
HARDENED_SG2002_FIP_PATCH_FILES = \
	$(BR2_EXTERNAL_SIPEED_LICHEERV_NANO_PATH)/boot/fsbl-sg200x/0001-mainline-toolchain.patch \
	$(BR2_EXTERNAL_SIPEED_LICHEERV_NANO_PATH)/boot/fsbl-sg200x/0004-gcc-maybe-uninitialized.patch \
	$(BR2_EXTERNAL_SIPEED_LICHEERV_NANO_PATH)/boot/fsbl-sg200x/0005-ld-remove-gcc-optimization-option.patch \
	$(BR2_EXTERNAL_HARDENED_SG2002_PATH)/board/sg2002/vendor-sdk-patches/fsbl-boot-guard.patch

define HARDENED_SG2002_FIP_APPLY_PATCHES
	if [ ! -e $(@D)/.stamp_hardened_patched ]; then \
		$(foreach p,$(HARDENED_SG2002_FIP_PATCH_FILES),\
			patch -d $(@D) -p1 --forward --batch -F 0 -i $(p) &&) \
		touch $(@D)/.stamp_hardened_patched; \
	fi
endef
HARDENED_SG2002_FIP_POST_RSYNC_HOOKS += HARDENED_SG2002_FIP_APPLY_PATCHES

HARDENED_SG2002_FIP_C906L_IMAGE = $(call qstrip,$(BR2_PACKAGE_HARDENED_SG2002_FIP_C906L_IMAGE))

HARDENED_SG2002_FIP_MAKE_OPTS = \
	CHIP_ARCH=cv181x ARCH=riscv BOOT_CPU=riscv \
	CROSS_COMPILE_GLIBC_RISCV64=$(TARGET_CROSS) \
	DDR_CFG=ddr3_1866_x16 TPU_PERF_MODE=y \
	BUILD_STRING=hardened-$(HARDENED_SG2002_FIP_VERSION) \
	BUILD_MESSAGE_TIMESTAMP='"0000-00-00T00:00:00+00:00"' \
	CFLAGS="-fno-stack-protector" \
	MONITOR_PATH=$(BINARIES_DIR)/fw_dynamic.bin \
	LOADER_2ND_PATH=$(@D)/u-boot-bl33.bin \
	BLCP_2ND_PATH=$(HARDENED_SG2002_FIP_C906L_IMAGE)

# std: standard clocks; od: the FSBL's overdrive table (C906 1050 MHz, VDDC 1.00 V).
define HARDENED_SG2002_FIP_BUILD_CMDS
	mkdir -p $(@D)/fsbl/build
	$(HOST_DIR)/bin/python3 $(@D)/build/scripts/mmap_conv.py --type h \
		$(@D)/build/boards/sg200x/sg2002_licheervnano_sd/memmap.py \
		$(@D)/fsbl/build/cvi_board_memmap.h
	text_base=$$(sed -n 's/^CONFIG_TEXT_BASE=//p' $(UBOOT_DIR)/.config) && \
		test -n "$$text_base" && \
		$(HOST_DIR)/bin/python3 $(HARDENED_SG2002_FIP_PKGDIR)/pack-bl33.py \
			--input $(BINARIES_DIR)/u-boot.bin --output $(@D)/u-boot-bl33.bin \
			--text-base $$text_base
	$(TARGET_MAKE_ENV) $(MAKE) -C $(@D)/fsbl $(HARDENED_SG2002_FIP_MAKE_OPTS) \
		O=$(@D)/fsbl/build/std fip-all
	$(TARGET_MAKE_ENV) $(MAKE) -C $(@D)/fsbl $(HARDENED_SG2002_FIP_MAKE_OPTS) \
		O=$(@D)/fsbl/build/od OD_CLK_SEL=y fip-all
	if cmp -s $(@D)/fsbl/build/std/fip.bin $(@D)/fsbl/build/od/fip.bin; then \
		echo "standard and overdrive FIPs are identical" >&2; exit 1; fi
endef

define HARDENED_SG2002_FIP_INSTALL_IMAGES_CMDS
	$(INSTALL) -D -m 0644 $(@D)/fsbl/build/std/fip.bin $(BINARIES_DIR)/fip.std.bin
	$(INSTALL) -D -m 0644 $(@D)/fsbl/build/od/fip.bin $(BINARIES_DIR)/fip.od.bin
	$(INSTALL) -D -m 0644 $(@D)/fsbl/build/std/fip.bin $(BINARIES_DIR)/fip.bin
endef

$(eval $(generic-package))
