################################################################################
#
# hnanokvm-soph-media
#
################################################################################

# The osdrv release the middleware headers come from (SOPHGO_OSDRV_SHA in system-image-6x.yml);
# the middleware's ioctl ABI depends on it.
HNANOKVM_SOPH_MEDIA_VERSION = 1b3a49649d18488ecf54fb4fcb6c27599e433fdc
HNANOKVM_SOPH_MEDIA_SITE = https://github.com/sophgo/osdrv.git
HNANOKVM_SOPH_MEDIA_SITE_METHOD = git
HNANOKVM_SOPH_MEDIA_LICENSE = GPL-2.0

# The eight osdrv patches of the 5.10 image, in its order, then the 6.18 port, then
# media buffers mapped through /dev/cvi-sys instead of /dev/mem. sys-cache-ops-in-buffers
# limits the cache ioctls to the same buffers.
HNANOKVM_SOPH_MEDIA_PATCH_DIR = $(BR2_EXTERNAL_HNANOKVM_PATH)/board/sg2002/kernel/patches
HNANOKVM_SOPH_MEDIA_OSDRV_PATCHES = \
	soph-module-names linux-5.10.265-compat pwm-from-28215f2 lt-int \
	vi-log-level vi-dci-yuv-bypass sys-carveout-allocator venc-fixes linux-6.18 \
	sys-mmap vc-packets-in-carveout vc-timed-locks jpeg-wait-by-interrupt \
	vpu-block-lock-sleeps jpeg-huffman-tables-without-vmalloc \
	jpeg-load-tables-only-when-they-change vc-remove-only-what-was-registered \
	fix-bugs-clang-reports sys-cache-ops-in-buffers venc-source-formats \
	sys-buffer-bounds vi-drop-frames-that-fail-the-csi-checks base-eth-mac-record

# Build order follows KBUILD_EXTRA_SYMBOLS: each directory links against the ones before it.
HNANOKVM_SOPH_MEDIA_DIRS = sys base cif vcodec jpeg cvi_vc_drv vi vpss dwa rgn vo
HNANOKVM_SOPH_MEDIA_MODULE_SUBDIRS = $(addprefix interdrv/,$(HNANOKVM_SOPH_MEDIA_DIRS))
HNANOKVM_SOPH_MEDIA_MODULE_MAKE_OPTS = \
	CVIARCH=CV181X CVIARCH_L=cv181x CHIP_ARCH=CV181X CHIP_ARCH_L=cv181x \
	SDK_VER=musl_riscv64 INSTALL_MOD_DIR=extra

# include/ holds headers that only the vendor kernel had: the CV181X pinmux tables
# (GPL-2.0, LicheeRV-Nano-Build linux_5.10/drivers/pinctrl/cvitek) and a no-op
# streamline_annotate.h.
define HNANOKVM_SOPH_MEDIA_APPLY_OSDRV_PATCHES
	$(foreach p,$(HNANOKVM_SOPH_MEDIA_OSDRV_PATCHES), \
		patch -d $(@D) -p1 --forward --fuzz=0 \
			-i $(HNANOKVM_SOPH_MEDIA_PATCH_DIR)/sophgo-osdrv-1b3a496-$(p).patch$(sep))
	mkdir -p $(@D)/interdrv/include/compat
	cp -a $(HNANOKVM_SOPH_MEDIA_PKGDIR)/include/. $(@D)/interdrv/include/compat/
	touch $(@D)/interdrv/Module.symvers \
		$(addsuffix /Module.symvers,$(addprefix $(@D)/,$(HNANOKVM_SOPH_MEDIA_MODULE_SUBDIRS)))
endef
HNANOKVM_SOPH_MEDIA_POST_PATCH_HOOKS += HNANOKVM_SOPH_MEDIA_APPLY_OSDRV_PATCHES

$(eval $(kernel-module))
$(eval $(generic-package))
