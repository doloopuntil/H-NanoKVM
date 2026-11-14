/* SPDX-License-Identifier: GPL-3.0-or-later */
OUTPUT_ARCH(riscv)
ENTRY(_start)

MEMORY
{
	fw (rwx) : ORIGIN = 0x8fe00000, LENGTH = 0x40000
}

SECTIONS
{
	.text : {
		KEEP(*(.text.start))
		*(.text .text.*)
	} > fw
	.rodata : { *(.rodata .rodata.* .srodata .srodata.*) } > fw
	.data : { *(.data .data.* .sdata .sdata.*) } > fw
	.bss (NOLOAD) : ALIGN(8) {
		__bss_start = .;
		*(.bss .bss.* .sbss .sbss.* COMMON)
		. = ALIGN(8);
		__bss_end = .;
	} > fw
	__stack_top = ORIGIN(fw) + LENGTH(fw);
	ASSERT(__bss_end + 0x8000 <= __stack_top, "firmware leaves under 32 KiB of stack")
	/DISCARD/ : { *(.comment) *(.note*) *(.eh_frame*) *(.riscv.attributes) }
}
