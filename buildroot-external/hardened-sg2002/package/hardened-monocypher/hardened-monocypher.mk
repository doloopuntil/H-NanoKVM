################################################################################
#
# hardened-monocypher
#
################################################################################

# Source only: hardened-c906l-tls-test compiles it into the C906L firmware.
HARDENED_MONOCYPHER_VERSION = 4.0.2
HARDENED_MONOCYPHER_SOURCE = monocypher-$(HARDENED_MONOCYPHER_VERSION).tar.gz
HARDENED_MONOCYPHER_SITE = https://monocypher.org/download
HARDENED_MONOCYPHER_LICENSE = BSD-2-Clause or CC0-1.0
HARDENED_MONOCYPHER_LICENSE_FILES = LICENCE.md
HARDENED_MONOCYPHER_INSTALL_TARGET = NO

$(eval $(generic-package))
