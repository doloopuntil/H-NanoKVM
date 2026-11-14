// SPDX-License-Identifier: GPL-3.0-or-later
/* C906L test firmware: ChaCha20-Poly1305 on a shared buffer, requests over the mailbox. */
#include <stddef.h>
#include <stdint.h>

#include "monocypher.h"
#include "shared.h"

#define LINE 64UL

#define MBOX_EN(cpu) (C9_MBOX_BASE + (cpu) * 4)
#define MBOX_SET_CLR(cpu) (C9_MBOX_BASE + 0x10 + (cpu) * 16)
#define MBOX_SET_INT(cpu) (C9_MBOX_BASE + 0x18 + (cpu) * 16)
#define MBOX_SET (C9_MBOX_BASE + 0x60)
#define MBOX_CTX(ch) (C9_MBOX_BASE + 0x400 + (ch) * 8)
#define CPU_LINUX 1
#define CPU_SELF 2

static inline uint8_t rd8(uintptr_t a) { return *(volatile uint8_t *)a; }
static inline void wr8(uintptr_t a, uint8_t v) { *(volatile uint8_t *)a = v; }
static inline uint32_t rd32(uintptr_t a) { return *(volatile uint32_t *)a; }
static inline void wr32(uintptr_t a, uint32_t v) { *(volatile uint32_t *)a = v; }

static inline uint64_t mcycle(void)
{
	uint64_t v;
	__asm__ volatile("csrr %0, mcycle" : "=r"(v));
	return v;
}

static inline uint64_t rdtime(void)
{
	uint64_t v;
	__asm__ volatile("rdtime %0" : "=r"(v));
	return v;
}

static inline uint64_t csr_mhcr(void)
{
	uint64_t v;
	__asm__ volatile("csrr %0, 0x7c1" : "=r"(v));
	return v;
}

static inline uint64_t csr_mxstatus(void)
{
	uint64_t v;
	__asm__ volatile("csrr %0, 0x7c0" : "=r"(v));
	return v;
}

static inline uint64_t csr_mhint(void)
{
	uint64_t v;
	__asm__ volatile("csrr %0, 0x7c5" : "=r"(v));
	return v;
}

/* th.dcache.ipa / th.dcache.cpa a0, then th.sync.s */
static void dcache_op(uintptr_t start, size_t len, int clean)
{
	uintptr_t p, end = start + len;

	for (p = start & ~(LINE - 1); p < end; p += LINE) {
		if (clean)
			__asm__ volatile("mv a0, %0\n\t.long 0x0295000b" : : "r"(p) : "a0", "memory");
		else
			__asm__ volatile("mv a0, %0\n\t.long 0x02a5000b" : : "r"(p) : "a0", "memory");
	}
	__asm__ volatile(".long 0x0190000b" : : : "memory");
}

#define inval(a, l) dcache_op((uintptr_t)(a), (l), 0)
#define clean(a, l) dcache_op((uintptr_t)(a), (l), 1)

/* gcc may emit calls to these even with -ffreestanding */
void *memcpy(void *d, const void *s, size_t n)
{
	uint8_t *dp = d;
	const uint8_t *sp = s;

	while (n--)
		*dp++ = *sp++;
	return d;
}

void *memset(void *d, int c, size_t n)
{
	uint8_t *dp = d;

	while (n--)
		*dp++ = (uint8_t)c;
	return d;
}

#define REGION(off) ((uintptr_t)(C9_REGION_BASE + (off)))

static volatile struct c9_status *const status = (void *)REGION(C9_STATUS_OFF);

static void reply(uint8_t op, uint8_t st, uint8_t flags, uint32_t seq)
{
	if (flags & C9_FLAG_POLL)
		return;
	wr32(MBOX_CTX(C9_CH_RES), C9_MSG_RES | (uint32_t)op << 8 | (uint32_t)st << 16);
	wr32(MBOX_CTX(C9_CH_RES) + 4, seq);
	__asm__ volatile("fence ow, ow" : : : "memory");
	wr8(MBOX_SET_CLR(CPU_LINUX), 1U << C9_CH_RES);
	wr8(MBOX_EN(CPU_LINUX), rd8(MBOX_EN(CPU_LINUX)) | 1U << C9_CH_RES);
	wr8(MBOX_SET, 1U << C9_CH_RES);
}

static void handle(uint8_t op, uint8_t slot, uint8_t flags, uint32_t seq)
{
	uintptr_t base = REGION(C9_SLOT_OFF + (uintptr_t)slot * C9_SLOT_END);
	struct c9_req *req = (void *)base;
	volatile struct c9_res *res = (void *)(base + C9_RES_OFF);
	uint8_t *in = (uint8_t *)(base + C9_IN_OFF);
	uint8_t *out = (uint8_t *)(base + C9_OUT_OFF);
	uint32_t st = C9_ST_OK, len = 0;
	uint64_t c0, t0;

	c0 = mcycle();
	t0 = rdtime();
	if (op == C9_OP_COPY || op == C9_OP_SEAL) {
		inval(req, C9_REQ_SIZE);
		len = req->len;
		if (len > C9_MAX_LEN || req->aad_len > sizeof(req->aad) || slot != 0) {
			st = C9_ST_BAD_LEN;
		} else {
			inval(in, len);
			if (op == C9_OP_COPY) {
				memcpy(out, in, len);
			} else {
				crypto_aead_ctx ctx;

				crypto_aead_init_ietf(&ctx, req->key, req->nonce);
				crypto_aead_write(&ctx, out, out + len, req->aad, req->aad_len, in, len);
				crypto_wipe(&ctx, sizeof(ctx));
				len += C9_TAG_LEN;
			}
			clean(out, len);
		}
	} else if (op != C9_OP_PING) {
		st = C9_ST_BAD_OP;
	}
	res->cycles = mcycle() - c0;
	res->ticks = rdtime() - t0;
	res->status = st;
	__asm__ volatile("fence w, w" : : : "memory");
	res->seq = seq;
	clean(res, LINE);
	reply(op, (uint8_t)st, flags, seq);
}

int main(void)
{
	uint32_t cookie = rd32(REGION(C9_COOKIE_OFF));
	uint32_t last_bell = 0;

	status->version = C9_VERSION;
	status->cookie = cookie;
	status->mhcr = csr_mhcr();
	status->mxstatus = csr_mxstatus();
	status->mhint = csr_mhint();
	status->messages = 0;
	status->loops = 0;
	__asm__ volatile("fence w, w" : : : "memory");
	status->magic = C9_STATUS_MAGIC;
	clean(status, LINE);

	wr8(MBOX_EN(CPU_SELF), rd8(MBOX_EN(CPU_SELF)) | 1U << C9_CH_REQ);

	for (;;) {
		volatile struct c9_bell *bell = (void *)REGION(C9_BELL_OFF);
		uint32_t lo, seq;

		if (rd8(MBOX_SET_INT(CPU_SELF)) & 1U << C9_CH_REQ) {
			lo = rd32(MBOX_CTX(C9_CH_REQ));
			seq = rd32(MBOX_CTX(C9_CH_REQ) + 4);
			wr8(MBOX_SET_CLR(CPU_SELF), 1U << C9_CH_REQ);
			wr8(MBOX_EN(CPU_SELF), rd8(MBOX_EN(CPU_SELF)) & ~(1U << C9_CH_REQ));
		} else {
			inval(bell, LINE);
			seq = bell->seq;
			if (seq == last_bell)
				continue;
			last_bell = seq;
			lo = bell->msg;
		}

		if ((lo & 0xff) == C9_MSG_REQ)
			handle((lo >> 8) & 0xff, (lo >> 16) & 0xff, (lo >> 24) & 0xff, seq);

		status->messages++;
		status->loops = mcycle();
		clean(status, LINE);
	}
}
