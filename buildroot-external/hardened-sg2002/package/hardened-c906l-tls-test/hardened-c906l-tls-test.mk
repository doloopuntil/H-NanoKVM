################################################################################
#
# hardened-c906l-tls-test
#
################################################################################

HARDENED_C906L_TLS_TEST_VERSION = 1
HARDENED_C906L_TLS_TEST_SITE = $(HARDENED_C906L_TLS_TEST_PKGDIR)/src
HARDENED_C906L_TLS_TEST_SITE_METHOD = local
HARDENED_C906L_TLS_TEST_LICENSE = GPL-2.0 (module), GPL-3.0+ (firmware), BSD-2-Clause or CC0-1.0 (Monocypher)
HARDENED_C906L_TLS_TEST_DEPENDENCIES = hardened-monocypher
HARDENED_C906L_TLS_TEST_MODULE_SUBDIRS = module
# The FIP package packs the same binary into the BLCP_2ND slot.
HARDENED_C906L_TLS_TEST_INSTALL_IMAGES = YES

define HARDENED_C906L_TLS_TEST_BUILD_CMDS
	$(TARGET_MAKE_ENV) $(MAKE) -C $(@D)/firmware \
		CC="$(TARGET_CC)" OBJCOPY="$(TARGET_OBJCOPY)" \
		MONOCYPHER=$(HARDENED_MONOCYPHER_DIR)/src
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
