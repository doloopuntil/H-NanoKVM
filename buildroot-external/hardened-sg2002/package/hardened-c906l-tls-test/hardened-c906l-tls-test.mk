################################################################################
#
# hardened-c906l-tls-test
#
################################################################################

HARDENED_C906L_TLS_TEST_VERSION = 1
HARDENED_C906L_TLS_TEST_SITE = $(HARDENED_C906L_TLS_TEST_PKGDIR)/src
HARDENED_C906L_TLS_TEST_SITE_METHOD = local
HARDENED_C906L_TLS_TEST_LICENSE = GPL-2.0 (module), GPL-3.0+ (firmware), BSD-2-Clause or CC0-1.0 (Monocypher)
HARDENED_C906L_TLS_TEST_MONOCYPHER = monocypher-4.0.2.tar.gz
HARDENED_C906L_TLS_TEST_EXTRA_DOWNLOADS = \
	https://monocypher.org/download/$(HARDENED_C906L_TLS_TEST_MONOCYPHER)
HARDENED_C906L_TLS_TEST_MODULE_SUBDIRS = module
# The FIP package packs the same binary into the BLCP_2ND slot.
HARDENED_C906L_TLS_TEST_INSTALL_IMAGES = YES

define HARDENED_C906L_TLS_TEST_EXTRACT_MONOCYPHER
	mkdir -p $(@D)/firmware/monocypher
	$(call suitable-extractor,$(HARDENED_C906L_TLS_TEST_MONOCYPHER)) \
		$(HARDENED_C906L_TLS_TEST_DL_DIR)/$(HARDENED_C906L_TLS_TEST_MONOCYPHER) | \
		$(TAR) --strip-components=1 -C $(@D)/firmware/monocypher $(TAR_OPTIONS) -
endef
HARDENED_C906L_TLS_TEST_POST_RSYNC_HOOKS += HARDENED_C906L_TLS_TEST_EXTRACT_MONOCYPHER

define HARDENED_C906L_TLS_TEST_BUILD_CMDS
	$(TARGET_MAKE_ENV) $(MAKE) -C $(@D)/firmware \
		CC="$(TARGET_CC)" OBJCOPY="$(TARGET_OBJCOPY)"
endef

define HARDENED_C906L_TLS_TEST_INSTALL_TARGET_CMDS
	$(INSTALL) -D -m 0644 $(@D)/firmware/c906l-tls-test.bin \
		$(TARGET_DIR)/lib/firmware/c906l-tls-test.bin
endef

define HARDENED_C906L_TLS_TEST_INSTALL_IMAGES_CMDS
	$(INSTALL) -D -m 0644 $(@D)/firmware/c906l-tls-test.bin \
		$(BINARIES_DIR)/c906l-tls-test.bin
endef

$(eval $(kernel-module))
$(eval $(generic-package))
