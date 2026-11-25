################################################################################
#
# hnanokvm-aic8800-sdio-firmware
#
################################################################################

HNANOKVM_AIC8800_SDIO_FIRMWARE_VERSION = c56f910044cc854d6c553bcb9a644f3bca5a4c38
HNANOKVM_AIC8800_SDIO_FIRMWARE_SITE = $(call github,lxowalle,aic8800-sdio-firmware,$(HNANOKVM_AIC8800_SDIO_FIRMWARE_VERSION))
HNANOKVM_AIC8800_SDIO_FIRMWARE_SOURCE = aic8800-sdio-firmware-$(HNANOKVM_AIC8800_SDIO_FIRMWARE_VERSION).tar.gz
HNANOKVM_AIC8800_SDIO_FIRMWARE_LICENSE = PROPRIETARY
HNANOKVM_AIC8800_SDIO_FIRMWARE_REDISTRIBUTE = NO

define HNANOKVM_AIC8800_SDIO_FIRMWARE_INSTALL_TARGET_CMDS
	$(INSTALL) -d $(TARGET_DIR)/usr/lib/firmware/aic8800_sdio
	cp -a $(@D)/. $(TARGET_DIR)/usr/lib/firmware/aic8800_sdio/
	rm -f $(TARGET_DIR)/usr/lib/firmware/aic8800_sdio/.files-list* \
		$(TARGET_DIR)/usr/lib/firmware/aic8800_sdio/.stamp_* \
		$(TARGET_DIR)/usr/lib/firmware/aic8800_sdio/.applied_patches_list
endef

$(eval $(generic-package))
