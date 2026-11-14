# SPDX-License-Identifier: GPL-3.0-or-later
# Bare-metal build with the Linux target toolchain. MONOCYPHER points at Monocypher's src/.
CC ?= gcc
OBJCOPY ?= objcopy
MONOCYPHER ?= monocypher/src
MARCH ?= rv64gc_xtheadba_xtheadbb_xtheadbs_xtheadcondmov_xtheadmemidx_xtheadmempair_xtheadmac

FW_CFLAGS = -march=$(MARCH) -mabi=lp64d -mcmodel=medany -O2 -g0 \
	-ffreestanding -fno-builtin -fno-pie -fno-stack-protector -fno-common \
	-ffunction-sections -fdata-sections -U_FORTIFY_SOURCE \
	-Wall -Wextra -I. -I$(MONOCYPHER)
FW_LDFLAGS = -nostdlib -nostartfiles -static -no-pie -Wl,--gc-sections \
	-Wl,-z,norelro -Wl,--build-id=none -T link.ld

all: c906l-tls-test.bin

c906l-tls-test.elf: start.S main.c $(MONOCYPHER)/monocypher.c shared.h link.ld
	$(CC) $(FW_CFLAGS) $(FW_LDFLAGS) -o $@ start.S main.c $(MONOCYPHER)/monocypher.c

c906l-tls-test.bin: c906l-tls-test.elf
	$(OBJCOPY) -O binary $< $@

clean:
	rm -f c906l-tls-test.elf c906l-tls-test.bin

.PHONY: all clean
