################################################################################
#
# hnanokvm-fit-tools
#
################################################################################

# No source: pulls in the host tools linux-6.18/post-image.sh runs.
HOST_HNANOKVM_FIT_TOOLS_SOURCE =
HOST_HNANOKVM_FIT_TOOLS_DEPENDENCIES = host-lz4 host-uboot-tools

$(eval $(host-generic-package))
