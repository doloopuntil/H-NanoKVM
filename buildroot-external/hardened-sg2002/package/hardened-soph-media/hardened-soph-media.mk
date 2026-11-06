################################################################################
#
# hardened-soph-media
#
################################################################################

# The same osdrv release as the 5.10 image (SOPHGO_OSDRV_SHA in system-image.yml); the
# middleware's ioctl ABI depends on it.
HARDENED_SOPH_MEDIA_VERSION = 1b3a49649d18488ecf54fb4fcb6c27599e433fdc
HARDENED_SOPH_MEDIA_SITE = https://github.com/sophgo/osdrv.git
HARDENED_SOPH_MEDIA_SITE_METHOD = git
HARDENED_SOPH_MEDIA_LICENSE = GPL-2.0

# The eight osdrv patches of the 5.10 image, in its order, then the 6.18 port.
HARDENED_SOPH_MEDIA_PATCH_DIR = $(BR2_EXTERNAL_HARDENED_SG2002_PATH)/board/sg2002/kernel/patches
HARDENED_SOPH_MEDIA_OSDRV_PATCHES = \
	soph-module-names linux-5.10.265-compat pwm-from-28215f2 lt-int \
	vi-log-level vi-dci-yuv-bypass sys-carveout-allocator venc-fixes linux-6.18

# Build order follows KBUILD_EXTRA_SYMBOLS: each directory links against the ones before it.
HARDENED_SOPH_MEDIA_DIRS = sys base cif vcodec jpeg cvi_vc_drv vi vpss dwa rgn vo
HARDENED_SOPH_MEDIA_MODULE_SUBDIRS = $(addprefix interdrv/,$(HARDENED_SOPH_MEDIA_DIRS))
HARDENED_SOPH_MEDIA_MODULE_MAKE_OPTS = \
	CVIARCH=CV181X CVIARCH_L=cv181x CHIP_ARCH=CV181X CHIP_ARCH_L=cv181x \
	SDK_VER=musl_riscv64 INSTALL_MOD_DIR=extra

# include/ holds headers that only the vendor kernel had: the CV181X pinmux tables
# (GPL-2.0, LicheeRV-Nano-Build linux_5.10/drivers/pinctrl/cvitek) and a no-op
# streamline_annotate.h.
define HARDENED_SOPH_MEDIA_APPLY_OSDRV_PATCHES
	$(foreach p,$(HARDENED_SOPH_MEDIA_OSDRV_PATCHES), \
		patch -d $(@D) -p1 --forward --fuzz=0 \
			-i $(HARDENED_SOPH_MEDIA_PATCH_DIR)/sophgo-osdrv-1b3a496-$(p).patch$(sep))
	mkdir -p $(@D)/interdrv/include/compat
	cp -a $(HARDENED_SOPH_MEDIA_PKGDIR)/include/. $(@D)/interdrv/include/compat/
	touch $(@D)/interdrv/Module.symvers \
		$(addsuffix /Module.symvers,$(addprefix $(@D)/,$(HARDENED_SOPH_MEDIA_MODULE_SUBDIRS)))
endef
HARDENED_SOPH_MEDIA_POST_PATCH_HOOKS += HARDENED_SOPH_MEDIA_APPLY_OSDRV_PATCHES

$(eval $(kernel-module))
$(eval $(generic-package))
