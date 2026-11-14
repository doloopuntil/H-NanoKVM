/* SPDX-License-Identifier: GPL-3.0-or-later */
/* C906L entry, machine mode, no MMU. Linux releases the core at the region base. */

	.section .text.start, "ax"
	.globl _start
_start:
	csrw	mie, zero
	csrw	mip, zero
	la	t0, trap
	csrw	mtvec, t0

	/* machine mode, T-Head instructions (cache ops), misaligned access */
	li	t0, 0xc0638000
	csrw	0x7c0, t0		/* mxstatus */

	/* invalidate, then enable the caches (mcor, mhcr) */
	li	t0, 0x33
	csrc	0x7c2, t0
	li	t0, 0x11
	csrs	0x7c2, t0
	li	t0, 0x33
	csrc	0x7c2, t0
	li	t0, 0x12
	csrs	0x7c2, t0
	/* I and D cache, write-allocate, write-back, return stack, branch prediction, BTB */
	li	t0, 0x103f
	csrs	0x7c1, t0
	fence.i

	/* FPU on: the compiler may spill to FP registers */
	li	t0, 0x2000
	csrs	mstatus, t0

	la	sp, __stack_top
	la	t0, __bss_start
	la	t1, __bss_end
1:	bgeu	t0, t1, 2f
	sd	zero, 0(t0)
	addi	t0, t0, 8
	j	1b
2:	call	main
3:	wfi
	j	3b

	.align	2
trap:
	j	trap
