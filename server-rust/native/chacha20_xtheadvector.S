/* ChaCha20 (RFC 8439) with XTheadVector (RVV 0.7.1) on the C906, VLEN 128.
 * Four blocks per pass: lane j of v<i> holds word i of block j.
 *
 * long hnk_chacha20_xor_xtheadvector(uint8_t *out, const uint8_t *in, size_t chunks,
 *     const uint32_t key[8], const uint32_t nonce[3], uint32_t counter, uint8_t *scratch);
 * XORs chunks * 256 bytes of keystream (blocks counter, counter + 1, ...) into in, writing out
 * (out == in is fine). scratch: 256 bytes, 4-byte aligned. Returns 0, or -1 if VLEN is not 128.
 */

	.option arch, +xtheadvector

.macro ROT x, t, n, m
	/* x * 2^n keeps x << n in its low 32 bits; the shifted-out bits come back from t. */
	th.vsrl.vi	\t, \x, 32 - \n
	th.vmadd.vx	\x, \m, \t
.endm

/* Four quarter-rounds side by side. */
.macro QR4 a0, b0, c0, d0, a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3
	th.vadd.vv	\a0, \a0, \b0
	th.vadd.vv	\a1, \a1, \b1
	th.vadd.vv	\a2, \a2, \b2
	th.vadd.vv	\a3, \a3, \b3
	th.vxor.vv	\d0, \d0, \a0
	th.vxor.vv	\d1, \d1, \a1
	th.vxor.vv	\d2, \d2, \a2
	th.vxor.vv	\d3, \d3, \a3
	ROT		\d0, v17, 16, a3
	ROT		\d1, v18, 16, a3
	ROT		\d2, v19, 16, a3
	ROT		\d3, v20, 16, a3
	th.vadd.vv	\c0, \c0, \d0
	th.vadd.vv	\c1, \c1, \d1
	th.vadd.vv	\c2, \c2, \d2
	th.vadd.vv	\c3, \c3, \d3
	th.vxor.vv	\b0, \b0, \c0
	th.vxor.vv	\b1, \b1, \c1
	th.vxor.vv	\b2, \b2, \c2
	th.vxor.vv	\b3, \b3, \c3
	ROT		\b0, v17, 12, a4
	ROT		\b1, v18, 12, a4
	ROT		\b2, v19, 12, a4
	ROT		\b3, v20, 12, a4
	th.vadd.vv	\a0, \a0, \b0
	th.vadd.vv	\a1, \a1, \b1
	th.vadd.vv	\a2, \a2, \b2
	th.vadd.vv	\a3, \a3, \b3
	th.vxor.vv	\d0, \d0, \a0
	th.vxor.vv	\d1, \d1, \a1
	th.vxor.vv	\d2, \d2, \a2
	th.vxor.vv	\d3, \d3, \a3
	ROT		\d0, v17, 8, a5
	ROT		\d1, v18, 8, a5
	ROT		\d2, v19, 8, a5
	ROT		\d3, v20, 8, a5
	th.vadd.vv	\c0, \c0, \d0
	th.vadd.vv	\c1, \c1, \d1
	th.vadd.vv	\c2, \c2, \d2
	th.vadd.vv	\c3, \c3, \d3
	th.vxor.vv	\b0, \b0, \c0
	th.vxor.vv	\b1, \b1, \c1
	th.vxor.vv	\b2, \b2, \c2
	th.vxor.vv	\b3, \b3, \c3
	ROT		\b0, v17, 7, t1
	ROT		\b1, v18, 7, t1
	ROT		\b2, v19, 7, t1
	ROT		\b3, v20, 7, t1
.endm

	.text
	.globl	hnk_chacha20_xor_xtheadvector
	.type	hnk_chacha20_xor_xtheadvector, @function
	.p2align 2
hnk_chacha20_xor_xtheadvector:
	th.vsetvli	t0, zero, e32, m1
	li		t1, 4
	bne		t0, t1, .Lbad_vlen
	beqz		a2, .Lreturn

	addi		sp, sp, -96
	sd		s0, 0(sp)
	sd		s1, 8(sp)
	sd		s2, 16(sp)
	sd		s3, 24(sp)
	sd		s4, 32(sp)
	sd		s5, 40(sp)
	sd		s6, 48(sp)
	sd		s7, 56(sp)
	sd		s8, 64(sp)
	sd		s9, 72(sp)
	sd		s10, 80(sp)
	sd		s11, 88(sp)

	lw		s0, 0(a3)
	lw		s1, 4(a3)
	lw		s2, 8(a3)
	lw		s3, 12(a3)
	lw		s4, 16(a3)
	lw		s5, 20(a3)
	lw		s6, 24(a3)
	lw		s7, 28(a3)
	lw		s8, 0(a4)
	lw		s9, 4(a4)
	lw		s10, 8(a4)
	li		s11, 64			/* one block: the stride between lanes */
	li		t3, 0x61707865		/* "expand 32-byte k" */
	li		t4, 0x3320646e
	li		t5, 0x79622d32
	li		t6, 0x6b206574
	th.vid.v	v16
	th.vadd.vx	v16, v16, a5		/* block counters */
	li		a3, 1 << 16		/* rotate multipliers */
	li		a4, 1 << 12
	li		a5, 1 << 8
	li		t1, 1 << 7

.Lchunk:
	th.vmv.v.x	v0, t3
	th.vmv.v.x	v1, t4
	th.vmv.v.x	v2, t5
	th.vmv.v.x	v3, t6
	th.vmv.v.x	v4, s0
	th.vmv.v.x	v5, s1
	th.vmv.v.x	v6, s2
	th.vmv.v.x	v7, s3
	th.vmv.v.x	v8, s4
	th.vmv.v.x	v9, s5
	th.vmv.v.x	v10, s6
	th.vmv.v.x	v11, s7
	th.vmv.v.v	v12, v16
	th.vmv.v.x	v13, s8
	th.vmv.v.x	v14, s9
	th.vmv.v.x	v15, s10

	li		t2, 10
.Lround:
	QR4 v0, v4, v8, v12,  v1, v5, v9, v13,  v2, v6, v10, v14,  v3, v7, v11, v15
	QR4 v0, v5, v10, v15, v1, v6, v11, v12, v2, v7, v8, v13,   v3, v4, v9, v14
	addi		t2, t2, -1
	bnez		t2, .Lround

	th.vadd.vx	v0, v0, t3
	th.vadd.vx	v1, v1, t4
	th.vadd.vx	v2, v2, t5
	th.vadd.vx	v3, v3, t6
	th.vadd.vx	v4, v4, s0
	th.vadd.vx	v5, v5, s1
	th.vadd.vx	v6, v6, s2
	th.vadd.vx	v7, v7, s3
	th.vadd.vx	v8, v8, s4
	th.vadd.vx	v9, v9, s5
	th.vadd.vx	v10, v10, s6
	th.vadd.vx	v11, v11, s7
	th.vadd.vv	v12, v12, v16
	th.vadd.vx	v13, v13, s8
	th.vadd.vx	v14, v14, s9
	th.vadd.vx	v15, v15, s10

	/* Words 0-7 and 8-15 of block j go to scratch + 64 * j. */
	th.vssseg8e.v	v0, (a6), s11
	addi		a7, a6, 32
	th.vssseg8e.v	v8, (a7), s11

	/* XOR 256 bytes, 128 at a time. */
	th.vsetvli	t0, zero, e8, m8
	th.vle.v	v0, (a1)
	th.vle.v	v8, (a6)
	th.vxor.vv	v0, v0, v8
	th.vse.v	v0, (a0)
	addi		a0, a0, 128
	addi		a1, a1, 128
	addi		a7, a6, 128
	th.vle.v	v0, (a1)
	th.vle.v	v8, (a7)
	th.vxor.vv	v0, v0, v8
	th.vse.v	v0, (a0)
	addi		a0, a0, 128
	addi		a1, a1, 128
	th.vsetvli	t0, zero, e32, m1

	th.vadd.vi	v16, v16, 4
	addi		a2, a2, -1
	bnez		a2, .Lchunk

	ld		s0, 0(sp)
	ld		s1, 8(sp)
	ld		s2, 16(sp)
	ld		s3, 24(sp)
	ld		s4, 32(sp)
	ld		s5, 40(sp)
	ld		s6, 48(sp)
	ld		s7, 56(sp)
	ld		s8, 64(sp)
	ld		s9, 72(sp)
	ld		s10, 80(sp)
	ld		s11, 88(sp)
	addi		sp, sp, 96
.Lreturn:
	li		a0, 0
	ret
.Lbad_vlen:
	li		a0, -1
	ret
	.size	hnk_chacha20_xor_xtheadvector, . - hnk_chacha20_xor_xtheadvector

	.section .note.GNU-stack, "", @progbits
