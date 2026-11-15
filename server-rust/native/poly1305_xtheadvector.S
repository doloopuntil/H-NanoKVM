/* Poly1305 blocks with XTheadVector (RVV 0.7.1, VLEN 128): a port of poly1305_blocks_vx and its
 * helpers from CRYPTOGAMS riscv/poly1305-riscv.pl (github.com/dot-asm/cryptogams 680f98c176),
 * written by Andy Polyakov. Copyright (c) 2006, CRYPTOGAMS by <appro@openssl.org>; licence in
 * LICENSE.cryptogams.
 *
 * Changes from upstream: four lanes at e32 m1 with e64 m2 products (0.7.1 has no mf2); the lazy
 * reduction runs in place in the product registers; misaligned input bounces through the stack
 * in e8 m8 (128-byte) chunks; slides go through a spare register; th.* mnemonics.
 *
 * void hnk_poly1305_blocks_vx(uint64_t ctx[24], const uint8_t *in, size_t len, uint32_t padbit);
 * ctx: the scalar context (h at 0, r at 24, s1 at 40), then the u32 top_power at 48 (zero before
 * the first call) and the key powers at 52. padbit must be 1. Below 192 bytes the scalar
 * hnk_poly1305_blocks does the work.
 */

	.option	arch, +xtheadvector

/* r^(2 vlen) and r^vlen limbs and their *5, as scalars */
#define R8_0	a4
#define R8_1	a5
#define R8_2	a6
#define R8_3	a7
#define R8_4	t2
#define R8_1X5	t3
#define R8_2X5	t4
#define R8_3X5	t5
#define R8_4X5	t6
#define R4_0	s0
#define R4_1	s1
#define R4_2	s2
#define R4_3	s3
#define R4_4	s4
#define R4_1X5	s5
#define R4_2X5	s6
#define R4_3X5	s7
#define R4_4X5	s8
#define MASK	s9
#define PWRS	s10
#define VLEN	s11

/* Vector registers: INlo v0-v3 + v9, INhi v4-v7 + v8, H v10-v14, T0 v15, T1 v26, T2 v27,
 * ACC0-4 v16/v18/v20/v22/v24 (e64 m2 pairs). In the reduction v4/v6 are e64 m2 temps. */

/* base 2^32 (four words in i0-i3) -> base 2^26 (i0-i4), plus the pad bit */
.macro CONV i0, i1, i2, i3, i4
	th.vsrl.vi	\i4, \i3, 8
	th.vsll.vi	\i3, \i3, 18
	th.vsrl.vi	v27, \i2, 14
	th.vsll.vi	\i2, \i2, 12
	th.vsrl.vi	v26, \i1, 20
	th.vsll.vi	\i1, \i1, 6
	th.vsrl.vi	v15, \i0, 26
	th.vand.vx	\i0, \i0, MASK
	th.vor.vv	\i3, \i3, v27
	th.vor.vv	\i2, \i2, v26
	th.vor.vv	\i1, \i1, v15
	th.vor.vx	\i4, \i4, a3
	th.vand.vx	\i3, \i3, MASK
	th.vand.vx	\i2, \i2, MASK
	th.vand.vx	\i1, \i1, MASK
.endm

/* ACC (=|+=) (i0..i4) * (r0..r4) mod 2^130-5, scalar limbs; x1-x4 are r1-r4 times 5 */
.macro MUL5 first, i0, i1, i2, i3, i4, r0, r1, r2, r3, r4, x1, x2, x3, x4
.ifc \first, set
	th.vwmulu.vx	v24, \i0, \r4
	th.vwmulu.vx	v22, \i0, \r3
	th.vwmulu.vx	v20, \i0, \r2
	th.vwmulu.vx	v18, \i0, \r1
	th.vwmulu.vx	v16, \i0, \r0
.else
	th.vwmaccu.vx	v24, \r4, \i0
	th.vwmaccu.vx	v22, \r3, \i0
	th.vwmaccu.vx	v20, \r2, \i0
	th.vwmaccu.vx	v18, \r1, \i0
	th.vwmaccu.vx	v16, \r0, \i0
.endif
	th.vwmaccu.vx	v24, \r3, \i1
	th.vwmaccu.vx	v22, \r2, \i1
	th.vwmaccu.vx	v20, \r1, \i1
	th.vwmaccu.vx	v18, \r0, \i1
	th.vwmaccu.vx	v16, \x4, \i1

	th.vwmaccu.vx	v24, \r2, \i2
	th.vwmaccu.vx	v22, \r1, \i2
	th.vwmaccu.vx	v20, \r0, \i2
	th.vwmaccu.vx	v18, \x4, \i2
	th.vwmaccu.vx	v16, \x3, \i2

	th.vwmaccu.vx	v24, \r1, \i3
	th.vwmaccu.vx	v22, \r0, \i3
	th.vwmaccu.vx	v20, \x4, \i3
	th.vwmaccu.vx	v18, \x3, \i3
	th.vwmaccu.vx	v16, \x2, \i3

	th.vwmaccu.vx	v24, \r0, \i4
	th.vwmaccu.vx	v22, \x4, \i4
	th.vwmaccu.vx	v20, \x3, \i4
	th.vwmaccu.vx	v18, \x2, \i4
	th.vwmaccu.vx	v16, \x1, \i4
.endm

/* in0..in4 += H */
.macro ADDH i0, i1, i2, i3, i4
	th.vadd.vv	\i0, \i0, v10
	th.vadd.vv	\i1, \i1, v11
	th.vadd.vv	\i2, \i2, v12
	th.vadd.vv	\i3, \i3, v13
	th.vadd.vv	\i4, \i4, v14
.endm

	.text

/* (r0, r1, r2) base 2^44 = its square mod 2^130-5 */
	.type	poly1305_sqr_2_44, @function
	.p2align 2
poly1305_sqr_2_44:
	li	t2, 20
	slli	t3, a5, 1
	mul	t2, a6, t2
	slli	t0, a4, 1

	mulhu	s5, a5, a5
	mul	s4, a5, a5
	mulhu	t5, t0, a6
	mul	t4, t0, a6

	mulhu	s1, a4, a4
	mul	s0, a4, a4
	mulhu	t1, t3, t2
	mul	t0, t3, t2

	add	s4, s4, t4
	add	s5, s5, t5
	sltu	t5, s4, t4
	add	s5, s5, t5

	mulhu	s3, a4, t3
	mul	s2, a4, t3
	mulhu	t3, a6, t2
	mul	t2, a6, t2

	add	s0, s0, t0
	add	s1, s1, t1
	sltu	t1, s0, t0
	add	s1, s1, t1

	add	s2, s2, t2
	add	s3, s3, t3
	sltu	t3, s2, t2
	add	s3, s3, t3

	srli	t0, s0, 44
	slli	t1, s1, 20
	and	a4, s0, MASK
	or	t0, t0, t1

	srli	t2, s2, 44
	slli	t3, s3, 20
	and	a5, s2, MASK
	or	t2, t2, t3
	add	a5, a5, t0

	srli	t3, MASK, 2
	srli	t0, s4, 42
	slli	t1, s5, 22
	and	a6, s4, t3
	or	t0, t0, t1
	add	a6, a6, t2

	srli	t1, a6, 42
	and	a6, a6, t3
	add	t0, t0, t1

	slli	t1, t0, 2
	add	a4, a4, t0
	add	a4, a4, t1

	srli	t1, a5, 44
	and	a5, a5, MASK
	add	a6, a6, t1
	srli	t0, a4, 44
	and	a4, a4, MASK
	add	a5, a5, t0
	ret
	.size	poly1305_sqr_2_44, . - poly1305_sqr_2_44

/* store (r0, r1, r2) base 2^44 as five base 2^26 words at s8, stride 28 */
	.type	poly1305_sw_2_26, @function
	.p2align 2
poly1305_sw_2_26:
	srli	t3, MASK, 18
	and	s0, a4, t3
	srli	s1, a4, 26
	slli	t0, a5, 18
	and	t0, t0, t3
	add	s1, s1, t0
	srli	s2, a5, 8
	srli	s3, a5, 34
	slli	t0, a6, 10
	and	s2, s2, t3
	sw	s0, 0*28(s8)
	and	t0, t0, t3
	sw	s1, 1*28(s8)
	add	s3, s3, t0
	sw	s2, 2*28(s8)
	srli	s4, a6, 16
	sw	s3, 3*28(s8)
	sw	s4, 4*28(s8)
	ret
	.size	poly1305_sw_2_26, . - poly1305_sw_2_26

/* load five base 2^26 words at s8 into (r0, r1, r2) base 2^44 */
	.type	poly1305_lw_2_26, @function
	.p2align 2
poly1305_lw_2_26:
	lw	s0, 0*28(s8)
	lw	s1, 1*28(s8)
	lw	s2, 2*28(s8)
	lw	s3, 3*28(s8)
	lw	s4, 4*28(s8)

	slli	s1, s1, 26
	slli	s2, s2, 8
	slli	s3, s3, 34
	add	a4, s0, s1
	add	s3, s3, s2
	srli	a5, a4, 44
	and	a4, a4, MASK
	add	a5, a5, s3
	slli	s4, s4, 16
	srli	a6, a5, 44
	and	a5, a5, MASK
	add	a6, a6, s4
	ret
	.size	poly1305_lw_2_26, . - poly1305_lw_2_26

	.globl	hnk_poly1305_blocks_vx
	.type	hnk_poly1305_blocks_vx, @function
	.p2align 2
hnk_poly1305_blocks_vx:
	andi	a2, a2, -16
	li	t2, 64*3
	bgeu	a2, t2, 1f
	tail	hnk_poly1305_blocks
1:
	addi	sp, sp, -128
	sd	ra, 120(sp)
	sd	s0, 112(sp)
	sd	s1, 104(sp)
	sd	s2, 96(sp)
	sd	s3, 88(sp)
	sd	s4, 80(sp)
	sd	s5, 72(sp)
	sd	s6, 64(sp)
	sd	s7, 56(sp)
	sd	s8, 48(sp)
	sd	s9, 40(sp)
	sd	s10, 32(sp)
	sd	s11, 24(sp)

	li	t0, 32
	th.vsetvli	t0, t0, e32, m1		/* lanes */
	slli	t0, t0, 4
	slli	t1, t0, 1
	add	t2, t1, t0

	sltu	t3, a2, t2			/* fewer lanes for short input */
	srl	t2, t2, t3
	srl	t0, t0, t3
	sltu	t3, a2, t2
	srl	t2, t2, t3
	srl	t0, t0, t3
	sltu	t3, a2, t2
	srl	t0, t0, t3

	srli	VLEN, t0, 4
	neg	t1, t0
	addi	t0, t0, -1
	and	s4, a2, t1			/* the scalar code takes len % (16 vlen) */
	and	a2, a2, t0
	add	s5, a1, a2
	call	hnk_poly1305_blocks
	mv	a1, s5
	mv	a2, s4

	lw	s8, 48(a0)			/* top_power */
	addi	PWRS, a0, 52+28

	li	MASK, -1
	srli	MASK, MASK, 20			/* 2^44-1 */

	beqz	s8, .Lno_pwrs

	li	t0, -7
	sltiu	t1, VLEN, 32
	sltiu	t2, VLEN, 16
	neg	t3, s8
	add	t0, t0, t1
	sltiu	t1, VLEN, 8
	srli	t3, t3, 2
	add	t0, t0, t2
	sltiu	t2, VLEN, 4
	addi	t3, t3, -1
	add	t0, t0, t1
	add	t0, t0, t2

	mv	t4, s8
	slli	s8, t0, 2
	bge	s8, t4, .Lpwrs_precomputed

	srl	s7, VLEN, t3
	add	s8, PWRS, t4
	jal	poly1305_lw_2_26
	j	.Loop_pwrs_sqr

.Lno_pwrs:
	ld	a4, 24(a0)			/* the key, to base 2^44 */
	ld	a5, 32(a0)
	srli	t0, a4, 44
	slli	t1, a5, 20
	and	a4, a4, MASK
	srli	a6, a5, 24
	or	a5, t0, t1
	and	a5, a5, MASK

	mv	s7, VLEN
	addi	s8, PWRS, -4
	jal	poly1305_sw_2_26		/* key^1 */
.Loop_pwrs_sqr:
	srli	s7, s7, 1
	addi	s8, s8, -4
	jal	poly1305_sqr_2_44
	jal	poly1305_sw_2_26		/* key^2, key^4, key^8 */
	bnez	s7, .Loop_pwrs_sqr

	sub	s8, s8, PWRS
	sw	s8, 48(a0)

.Lpwrs_precomputed:
	ld	a4, 0(a0)			/* the hash, to base 2^26 */
	ld	a5, 8(a0)
	ld	a6, 16(a0)

	add	PWRS, PWRS, s8
	srli	MASK, MASK, 18			/* 2^26-1 */

	andi	t2, a6, -4
	srli	t3, a6, 2
	andi	a6, a6, 3
	add	t2, t2, t3

	and	s0, a4, MASK
	srli	s1, a4, 26
	and	s1, s1, MASK
	srli	s2, a4, 52
	slli	t0, a5, 12
	or	s2, s2, t0
	and	s2, s2, MASK
	srli	s3, a5, 14
	and	s3, s3, MASK
	srli	s4, a5, 40
	slli	t1, a6, 24
	or	s4, s4, t1

	and	t0, t2, MASK
	srli	t2, t2, 26
	add	s0, s0, t0
	and	t1, t2, MASK
	srli	t2, t2, 26
	add	s1, s1, t1
	add	s2, s2, t2

	slli	a3, a3, 24			/* padbit is 1 here */

	th.vsetvli	zero, VLEN, e32, m1

	th.vxor.vv	v10, v10, v10
	th.vxor.vv	v11, v11, v11
	th.vxor.vv	v12, v12, v12
	th.vxor.vv	v13, v13, v13
	th.vxor.vv	v14, v14, v14
	th.vmv.s.x	v10, s0
	th.vmv.s.x	v11, s1
	th.vmv.s.x	v12, s2
	th.vmv.s.x	v13, s3
	th.vmv.s.x	v14, s4

	slli	t0, VLEN, 5			/* chunk size */
	ld	R8_0, 0*28(PWRS)		/* two top-most powers */
	ld	R8_1, 1*28(PWRS)
	neg	t1, t0
	ld	R8_2, 2*28(PWRS)
	ld	R8_3, 3*28(PWRS)
	ld	R8_4, 4*28(PWRS)
	addi	PWRS, PWRS, 4
	add	sp, sp, t1			/* alignment buffer */
	andi	t1, a1, 3
	slli	R8_1X5, R8_1, 2
	slli	R8_2X5, R8_2, 2
	slli	R8_3X5, R8_3, 2
	slli	R8_4X5, R8_4, 2
	add	R8_1X5, R8_1X5, R8_1
	add	R8_2X5, R8_2X5, R8_2
	add	R8_3X5, R8_3X5, R8_3
	add	R8_4X5, R8_4X5, R8_4
	srli	R4_0, R8_0, 32
	srli	R4_1, R8_1, 32
	srli	R4_2, R8_2, 32
	srli	R4_3, R8_3, 32
	srli	R4_4, R8_4, 32
	srli	R4_1X5, R8_1X5, 32
	srli	R4_2X5, R8_2X5, 32
	srli	R4_3X5, R8_3X5, 32
	srli	R4_4X5, R8_4X5, 32

	beqz	t1, .Laligned_vx

	th.vsetvli	zero, t0, e8, m8	/* e32 vector loads must be aligned */
	th.vle.v	v0, (a1)
	add	a1, a1, t0
	slli	t1, VLEN, 4
	th.vse.v	v0, (sp)

	th.vsetvli	zero, VLEN, e32, m1
	add	t1, sp, t1
	th.vlseg4e.v	v0, (sp)
	th.vlseg4e.v	v4, (t1)
	j	.Loop_vx_jump_in

.Loop_unaligned_vx:
	sltu	t1, a2, t0
	srl	t1, t0, t1
	th.vsetvli	zero, t1, e8, m8
	th.vle.v	v0, (a1)
	add	a1, a1, t1
	slli	t1, VLEN, 4
	th.vse.v	v0, (sp)

	th.vsetvli	zero, VLEN, e32, m1
	add	t1, sp, t1
	th.vlseg4e.v	v0, (sp)
	jal	poly1305_lazy_redc_vx
	bltu	a2, t0, .Lodd_vx
	th.vlseg4e.v	v4, (t1)
	bgtu	a2, t0, .Loop_vx_jump_in
	mv	a1, t1
	j	.Loop_vx_done

.Laligned_vx:
	slli	t1, VLEN, 4
	th.vlseg4e.v	v0, (a1)
	add	a1, a1, t1
.Loop_vx:
	th.vlseg4e.v	v4, (a1)
	add	a1, a1, t1

.Loop_vx_jump_in:
	sub	a2, a2, t0
	CONV	v0, v1, v2, v3, v9
	CONV	v4, v5, v6, v7, v8

	/* INhi * r^vlen, then (H + INlo) * r^(2 vlen) */
	MUL5	set, v4, v5, v6, v7, v8, R4_0, R4_1, R4_2, R4_3, R4_4, R4_1X5, R4_2X5, R4_3X5, R4_4X5
	ADDH	v0, v1, v2, v3, v9
	MUL5	acc, v0, v1, v2, v3, v9, R8_0, R8_1, R8_2, R8_3, R8_4, R8_1X5, R8_2X5, R8_3X5, R8_4X5

	andi	t1, a1, 3
	bnez	t1, .Loop_unaligned_vx

	slli	t1, VLEN, 4
	th.vlseg4e.v	v0, (a1)
	add	a1, a1, t1

	jal	poly1305_lazy_redc_vx

	bgtu	a2, t0, .Loop_vx
	bltu	a2, t0, .Lodd_vx

.Loop_vx_done:
	CONV	v0, v1, v2, v3, v9
	ADDH	v0, v1, v2, v3, v9
	MUL5	set, v0, v1, v2, v3, v9, R4_0, R4_1, R4_2, R4_3, R4_4, R4_1X5, R4_2X5, R4_3X5, R4_4X5

	th.vlseg4e.v	v0, (a1)

	jal	poly1305_lazy_redc_vx

.Lodd_vx:
	CONV	v0, v1, v2, v3, v9

	li	t1, 2
	bleu	VLEN, t1, .Last_reduce_vx

.Loop_reduce_vx:
	lw	R4_0, 4+0*28(PWRS)		/* key^(vlen/2) */
	lw	R4_1, 4+1*28(PWRS)
	lw	R4_2, 4+2*28(PWRS)
	lw	R4_3, 4+3*28(PWRS)
	lw	R4_4, 4+4*28(PWRS)
	addi	PWRS, PWRS, 4
	slli	R4_1X5, R4_1, 2
	slli	R4_2X5, R4_2, 2
	slli	R4_3X5, R4_3, 2
	slli	R4_4X5, R4_4, 2
	add	R4_1X5, R4_1X5, R4_1
	add	R4_2X5, R4_2X5, R4_2
	add	R4_3X5, R4_3X5, R4_3
	add	R4_4X5, R4_4X5, R4_4

	ADDH	v0, v1, v2, v3, v9
	MUL5	set, v0, v1, v2, v3, v9, R4_0, R4_1, R4_2, R4_3, R4_4, R4_1X5, R4_2X5, R4_3X5, R4_4X5

	jal	poly1305_lazy_redc_vx

	/* the upper half of the lanes, unmultiplied, to the bottom */
	srli	VLEN, VLEN, 1
	th.vslidedown.vx	v4, v0, VLEN
	th.vslidedown.vx	v5, v1, VLEN
	th.vslidedown.vx	v6, v2, VLEN
	th.vslidedown.vx	v7, v3, VLEN
	th.vslidedown.vx	v8, v9, VLEN
	th.vsetvli	zero, VLEN, e32, m1
	th.vmv.v.v	v0, v4
	th.vmv.v.v	v1, v5
	th.vmv.v.v	v2, v6
	th.vmv.v.v	v3, v7
	th.vmv.v.v	v9, v8

	bgtu	VLEN, t1, .Loop_reduce_vx

.Last_reduce_vx:
	addi	t1, PWRS, 1*28			/* key^2 and key^1 */
	th.vle.v	v4, (PWRS)
	addi	t2, PWRS, 2*28
	th.vle.v	v5, (t1)
	addi	t3, PWRS, 3*28
	th.vle.v	v6, (t2)
	addi	t4, PWRS, 4*28
	th.vle.v	v7, (t3)
	th.vle.v	v8, (t4)
	th.vsll.vi	v28, v5, 2
	th.vsll.vi	v29, v6, 2
	th.vsll.vi	v30, v7, 2
	th.vsll.vi	v31, v8, 2

	th.vadd.vv	v10, v10, v0
	th.vadd.vv	v11, v11, v1
	th.vadd.vv	v12, v12, v2
	th.vadd.vv	v13, v13, v3
	th.vadd.vv	v14, v14, v9

	th.vadd.vv	v28, v28, v5
	th.vadd.vv	v29, v29, v6
	th.vadd.vv	v30, v30, v7
	th.vadd.vv	v31, v31, v8

	th.vwmulu.vv	v24, v10, v8
	th.vwmulu.vv	v22, v10, v7
	th.vwmulu.vv	v20, v10, v6
	th.vwmulu.vv	v18, v10, v5
	th.vwmulu.vv	v16, v10, v4

	th.vwmaccu.vv	v24, v11, v7
	th.vwmaccu.vv	v22, v11, v6
	th.vwmaccu.vv	v20, v11, v5
	th.vwmaccu.vv	v18, v11, v4
	th.vwmaccu.vv	v16, v11, v31

	th.vwmaccu.vv	v24, v12, v6
	th.vwmaccu.vv	v22, v12, v5
	th.vwmaccu.vv	v20, v12, v4
	th.vwmaccu.vv	v18, v12, v31
	th.vwmaccu.vv	v16, v12, v30

	th.vwmaccu.vv	v24, v13, v5
	th.vwmaccu.vv	v22, v13, v4
	th.vwmaccu.vv	v20, v13, v31
	th.vwmaccu.vv	v18, v13, v30
	th.vwmaccu.vv	v16, v13, v29

	th.vwmaccu.vv	v24, v14, v4
	th.vwmaccu.vv	v22, v14, v31
	th.vwmaccu.vv	v20, v14, v30
	th.vwmaccu.vv	v18, v14, v29
	th.vwmaccu.vv	v16, v14, v28

	jal	poly1305_lazy_redc_vx

	th.vslidedown.vi	v16, v10, 1
	th.vslidedown.vi	v18, v11, 1
	th.vslidedown.vi	v20, v12, 1
	th.vslidedown.vi	v22, v13, 1
	th.vslidedown.vi	v24, v14, 1

	th.vadd.vv	v10, v10, v16
	th.vadd.vv	v11, v11, v18
	th.vadd.vv	v12, v12, v20
	th.vadd.vv	v13, v13, v22
	th.vadd.vv	v14, v14, v24

	th.vmv.x.s	s0, v10			/* the hash */
	th.vmv.x.s	s1, v11
	th.vmv.x.s	s2, v12
	th.vmv.x.s	s3, v13
	th.vmv.x.s	s4, v14

	add	sp, sp, t0			/* drop the alignment buffer */

	slli	s1, s1, 26			/* to base 2^64 */
	slli	t0, s2, 52
	srli	t1, s2, 12
	add	a4, s0, s1
	add	a4, a4, t0
	sltu	t0, a4, t0
	add	a5, t1, t0
	slli	s3, s3, 14
	add	a5, a5, s3
	slli	t0, s4, 40
	srli	t1, s4, 24
	add	a5, a5, t0
	sltu	t0, a5, t0
	add	a6, t1, t0

	sd	a4, 0(a0)
	sd	a5, 8(a0)
	sd	a6, 16(a0)

	ld	ra, 120(sp)
	ld	s0, 112(sp)
	ld	s1, 104(sp)
	ld	s2, 96(sp)
	ld	s3, 88(sp)
	ld	s4, 80(sp)
	ld	s5, 72(sp)
	ld	s6, 64(sp)
	ld	s7, 56(sp)
	ld	s8, 48(sp)
	ld	s9, 40(sp)
	ld	s10, 32(sp)
	ld	s11, 24(sp)
	addi	sp, sp, 128
	ret
	.size	hnk_poly1305_blocks_vx, . - hnk_poly1305_blocks_vx

/* Lazy reduction ("NEON crypto", Bernstein and Schwabe) of ACC0-4 into H0-H4:
 * H0>>+H1>>+H2>>+H3>>+H4, H3>>+H4>>*5+H0>>+H1, where >>+ is Hnext += Hn>>26, Hn &= 2^26-1. */
	.type	poly1305_lazy_redc_vx, @function
	.p2align 2
poly1305_lazy_redc_vx:
	th.vsetvli	zero, VLEN, e64, m2

	th.vsrl.vi	v4, v22, 26
	th.vand.vx	v22, v22, MASK
	th.vsrl.vi	v6, v16, 26
	th.vand.vx	v16, v16, MASK
	th.vadd.vv	v24, v24, v4
	th.vadd.vv	v18, v18, v6

	th.vsrl.vi	v4, v24, 26
	th.vand.vx	v24, v24, MASK
	th.vsll.vi	v6, v4, 2
	th.vadd.vv	v16, v16, v4
	th.vsrl.vi	v4, v18, 26
	th.vand.vx	v18, v18, MASK
	th.vadd.vv	v16, v16, v6
	th.vadd.vv	v20, v20, v4

	th.vsrl.vi	v4, v16, 26
	th.vand.vx	v16, v16, MASK
	th.vsrl.vi	v6, v20, 26
	th.vand.vx	v20, v20, MASK
	th.vadd.vv	v18, v18, v4
	th.vadd.vv	v22, v22, v6

	th.vsetvli	zero, VLEN, e32, m1

	th.vnsrl.vi	v10, v16, 0
	th.vnsrl.vi	v11, v18, 0
	th.vnsrl.vi	v12, v20, 0
	th.vnsrl.vi	v13, v22, 0
	th.vnsrl.vi	v14, v24, 0

	th.vsrl.vi	v15, v13, 26
	th.vand.vx	v13, v13, MASK
	th.vadd.vv	v14, v14, v15
	ret
	.size	poly1305_lazy_redc_vx, . - poly1305_lazy_redc_vx

	.section .note.GNU-stack, "", @progbits
