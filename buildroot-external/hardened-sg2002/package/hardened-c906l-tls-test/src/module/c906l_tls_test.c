// SPDX-License-Identifier: GPL-2.0-only
/*
 * Measurement module for the C906L send-side TLS experiment: loads the test firmware into the
 * C906L's reserved region, releases the core and times records over the mailbox.
 * Control through sysfs: start, stop, run ("seal|copy|ping mbox|poll count len"), result, status.
 */
#include <crypto/chacha20poly1305.h>
#include <linux/completion.h>
#include <linux/delay.h>
#include <linux/device.h>
#include <linux/dma-mapping.h>
#include <linux/firmware.h>
#include <linux/io.h>
#include <linux/ktime.h>
#include <linux/mailbox_client.h>
#include <linux/module.h>
#include <linux/mutex.h>
#include <linux/of.h>
#include <linux/of_reserved_mem.h>
#include <linux/platform_device.h>
#include <linux/random.h>
#include <linux/reset.h>
#include <linux/slab.h>
#include <linux/unaligned.h>

#include "shared.h"

#define FW_NAME "c906l-tls-test.bin"
#define SEC_SYS_BASE 0x020b0000
#define SEC_BOOT_CTRL 0x04
#define SEC_BOOT_EN BIT(13)
#define SEC_BOOT_ADDR_LO 0x20
#define SEC_BOOT_ADDR_HI 0x24
#define RESULT_MAX 3072

struct c9 {
	struct device *dev;
	struct mbox_client cl_req, cl_res;
	struct mbox_chan *req, *res;
	struct reset_control *rst;
	phys_addr_t base;
	size_t size;
	void *va;
	dma_addr_t dma;
	struct completion done;
	u32 seq, got_seq, got_status;
	atomic_t stray, late;
	struct mutex lock;
	bool running;
	u8 key[CHACHA20POLY1305_KEY_SIZE];
	u8 *src, *dst, *ref;
	char start_info[256];
	char result[RESULT_MAX];
};

struct c9_stat {
	u64 sum, min, max;
};

static void stat_add(struct c9_stat *s, u64 v)
{
	s->sum += v;
	if (!s->min || v < s->min)
		s->min = v;
	if (v > s->max)
		s->max = v;
}

static void clean(struct c9 *c, size_t off, size_t len)
{
	dma_sync_single_for_device(c->dev, c->dma + off, len, DMA_TO_DEVICE);
}

static void inval(struct c9 *c, size_t off, size_t len)
{
	dma_sync_single_for_cpu(c->dev, c->dma + off, len, DMA_FROM_DEVICE);
}

static struct c9_status *status_of(struct c9 *c)
{
	return c->va + C9_STATUS_OFF;
}

static void *slot(struct c9 *c, size_t off)
{
	return c->va + C9_SLOT_OFF + off;
}

static void rx_res(struct mbox_client *cl, void *data)
{
	struct c9 *c = container_of(cl, struct c9, cl_res);
	u64 msg = *(u64 *)data;

	if ((msg & 0xff) != C9_MSG_RES || (u32)(msg >> 32) != READ_ONCE(c->seq)) {
		atomic_inc(&c->late);
		return;
	}
	c->got_status = (msg >> 16) & 0xff;
	WRITE_ONCE(c->got_seq, (u32)(msg >> 32));
	complete(&c->done);
}

/* The mainline driver may also hand us our own request; count it. */
static void rx_req(struct mbox_client *cl, void *data)
{
	struct c9 *c = container_of(cl, struct c9, cl_req);

	atomic_inc(&c->stray);
}

static int c9_start(struct c9 *c)
{
	const struct firmware *fw;
	struct c9_status *st = status_of(c);
	void __iomem *sec;
	u32 cookie, ctrl, lo, hi;
	int was_reset, i, ret;

	ret = request_firmware(&fw, FW_NAME, c->dev);
	if (ret)
		return ret;
	if (fw->size > C9_FW_MAX) {
		release_firmware(fw);
		return -EFBIG;
	}

	was_reset = reset_control_status(c->rst);
	reset_control_assert(c->rst);
	c->running = false;

	memset(c->va, 0, C9_SLOT_OFF + C9_SLOT_END);
	memcpy(c->va, fw->data, fw->size);
	release_firmware(fw);
	cookie = get_random_u32();
	*(u32 *)(c->va + C9_COOKIE_OFF) = cookie;
	clean(c, 0, C9_SLOT_OFF + C9_SLOT_END);

	sec = ioremap(SEC_SYS_BASE, 0x100);
	if (!sec)
		return -ENOMEM;
	ctrl = readl(sec + SEC_BOOT_CTRL);
	writel(ctrl | SEC_BOOT_EN, sec + SEC_BOOT_CTRL);
	writel(lower_32_bits(c->base), sec + SEC_BOOT_ADDR_LO);
	writel(upper_32_bits(c->base), sec + SEC_BOOT_ADDR_HI);
	lo = readl(sec + SEC_BOOT_ADDR_LO);
	hi = readl(sec + SEC_BOOT_ADDR_HI);
	iounmap(sec);

	reset_control_deassert(c->rst);

	for (i = 0; i < 100; i++) {
		msleep(10);
		inval(c, C9_STATUS_OFF, sizeof(*st));
		if (READ_ONCE(st->magic) == C9_STATUS_MAGIC && READ_ONCE(st->cookie) == cookie)
			break;
	}
	c->running = i < 100;
	scnprintf(c->start_info, sizeof(c->start_info),
		  "started by Linux; in reset before: %d\nboot ctrl before: 0x%08x\n"
		  "boot addr readback: 0x%08x%08x\n"
		  "answered: %s after %d ms\n",
		  was_reset, ctrl, hi, lo, c->running ? "yes" : "no", (i + 1) * 10);
	return c->running ? 0 : -ETIMEDOUT;
}

/* A core the FSBL started from the FIP has already written its status block. */
static void c9_attach(struct c9 *c)
{
	struct c9_status *st = status_of(c);
	int in_reset = reset_control_status(c->rst);

	inval(c, C9_STATUS_OFF, sizeof(*st));
	if (READ_ONCE(st->magic) != C9_STATUS_MAGIC) {
		scnprintf(c->start_info, sizeof(c->start_info),
			  "at probe: no firmware answer, in reset: %d\n", in_reset);
		return;
	}
	/* The doorbell and result lines hold whatever DRAM held at power-on. */
	memset(c->va + C9_BELL_OFF, 0, sizeof(struct c9_bell));
	clean(c, C9_BELL_OFF, sizeof(struct c9_bell));
	memset(slot(c, C9_RES_OFF), 0, sizeof(struct c9_res));
	clean(c, C9_SLOT_OFF + C9_RES_OFF, sizeof(struct c9_res));
	c->running = true;
	scnprintf(c->start_info, sizeof(c->start_info),
		  "at probe: firmware running (started by the FSBL), in reset: %d, cookie 0x%08x\n",
		  in_reset, st->cookie);
}

static int c9_call(struct c9 *c, u8 op, bool poll, u64 *wait_ns)
{
	struct c9_res *res = slot(c, C9_RES_OFF);
	u64 msg, t0;
	int ret;

	WRITE_ONCE(c->seq, c->seq + 1);
	msg = C9_MSG_REQ | (u64)op << 8 | (u64)(poll ? C9_FLAG_POLL : 0) << 24 |
	      (u64)c->seq << 32;
	reinit_completion(&c->done);

	t0 = ktime_get_ns();
	if (poll) {
		struct c9_bell *bell = c->va + C9_BELL_OFF;

		bell->msg = (u32)msg;
		WRITE_ONCE(bell->seq, c->seq);
		clean(c, C9_BELL_OFF, sizeof(*bell));
	} else {
		ret = mbox_send_message(c->req, &msg);
		if (ret < 0)
			return ret;
		mbox_client_txdone(c->req, 0);
	}

	if (poll) {
		for (;;) {
			inval(c, C9_SLOT_OFF + C9_RES_OFF, sizeof(*res));
			if (READ_ONCE(res->seq) == c->seq)
				break;
			if (ktime_get_ns() - t0 > 500 * NSEC_PER_MSEC)
				return -ETIMEDOUT;
			cpu_relax();
		}
	} else if (!wait_for_completion_timeout(&c->done, msecs_to_jiffies(500))) {
		return -ETIMEDOUT;
	}
	*wait_ns = ktime_get_ns() - t0;

	inval(c, C9_SLOT_OFF + C9_RES_OFF, sizeof(*res));
	if (res->seq != c->seq)
		return -EIO;
	return res->status ? -EBADMSG : 0;
}

static int c9_run(struct c9 *c, u8 op, bool poll, u32 count, u32 len)
{
	struct c9_req *req = slot(c, 0);
	struct c9_res *res = slot(c, C9_RES_OFF);
	u8 *in = slot(c, C9_IN_OFF), *out = slot(c, C9_OUT_OFF);
	u32 outlen = op == C9_OP_SEAL ? len + C9_TAG_LEN : len;
	struct c9_stat prep = {}, wait = {}, fin = {}, total = {}, cyc = {}, tick = {};
	u64 t0, t1, t2, t3, w, cpu_ns;
	u32 i, bad = 0;
	u8 aad[5];
	int ret = 0, n;

	if (!c->running)
		return -ENODEV;
	if (len > C9_MAX_LEN || !count)
		return -EINVAL;

	get_random_bytes(c->src, len);
	aad[0] = 0x17;
	aad[1] = 0x03;
	aad[2] = 0x03;
	aad[3] = (len + C9_TAG_LEN) >> 8;
	aad[4] = (len + C9_TAG_LEN) & 0xff;

	for (i = 0; i < count; i++) {
		t0 = ktime_get_ns();
		if (op != C9_OP_PING) {
			memcpy(req->key, c->key, sizeof(req->key));
			memset(req->nonce, 0, 4);
			put_unaligned_le64(i, req->nonce + 4);
			req->len = len;
			memcpy(req->aad, aad, sizeof(aad));
			req->aad_len = sizeof(aad);
			memcpy(in, c->src, len);
			clean(c, C9_SLOT_OFF, C9_REQ_SIZE);
			clean(c, C9_SLOT_OFF + C9_IN_OFF, len);
		}
		t1 = ktime_get_ns();
		ret = c9_call(c, op, poll, &w);
		if (ret)
			break;
		t2 = t1 + w;
		if (op != C9_OP_PING) {
			inval(c, C9_SLOT_OFF + C9_OUT_OFF, outlen);
			memcpy(c->dst, out, outlen);
		}
		t3 = ktime_get_ns();

		stat_add(&prep, t1 - t0);
		stat_add(&wait, t2 - t1);
		stat_add(&fin, t3 - t2);
		stat_add(&total, t3 - t0);
		stat_add(&cyc, res->cycles);
		stat_add(&tick, res->ticks);

		if (op == C9_OP_SEAL) {
			chacha20poly1305_encrypt(c->ref, c->src, len, aad, sizeof(aad), i, c->key);
			bad += !!memcmp(c->ref, c->dst, outlen);
		} else if (op == C9_OP_COPY) {
			bad += !!memcmp(c->src, c->dst, len);
		}
	}
	if (ret)
		return ret;

	/* The same records sealed on this core by the kernel's library, for reference. */
	cpu_ns = 0;
	if (op == C9_OP_SEAL) {
		t0 = ktime_get_ns();
		for (i = 0; i < count; i++)
			chacha20poly1305_encrypt(c->ref, c->src, len, aad, sizeof(aad), i, c->key);
		cpu_ns = ktime_get_ns() - t0;
	}

	n = scnprintf(c->result, RESULT_MAX,
		      "op %u mode %s count %u len %u mismatches %u stray %d late %d\n"
		      "ns per record, avg min max\n"
		      "  prepare (copy in, clean): %llu %llu %llu\n"
		      "  wait (send to answer):    %llu %llu %llu\n"
		      "  finish (inval, copy out): %llu %llu %llu\n"
		      "  total:                    %llu %llu %llu\n"
		      "c906l mcycle per record:    %llu %llu %llu\n"
		      "c906l rdtime per record:    %llu %llu %llu\n",
		      op, poll ? "poll" : "mbox", count, len, bad, atomic_read(&c->stray),
		      atomic_read(&c->late),
		      div_u64(prep.sum, count), prep.min, prep.max,
		      div_u64(wait.sum, count), wait.min, wait.max,
		      div_u64(fin.sum, count), fin.min, fin.max,
		      div_u64(total.sum, count), total.min, total.max,
		      div_u64(cyc.sum, count), cyc.min, cyc.max,
		      div_u64(tick.sum, count), tick.min, tick.max);
	if (op == C9_OP_SEAL && len)
		n += scnprintf(c->result + n, RESULT_MAX - n,
			       "kernel lib on this core:    %llu ns per record\n",
			       div_u64(cpu_ns, count));
	return 0;
}

static ssize_t start_store(struct device *dev, struct device_attribute *attr, const char *buf,
			   size_t count)
{
	struct c9 *c = dev_get_drvdata(dev);
	int ret;

	mutex_lock(&c->lock);
	ret = c9_start(c);
	mutex_unlock(&c->lock);
	return ret ? ret : count;
}
static DEVICE_ATTR_WO(start);

static ssize_t stop_store(struct device *dev, struct device_attribute *attr, const char *buf,
			  size_t count)
{
	struct c9 *c = dev_get_drvdata(dev);

	mutex_lock(&c->lock);
	reset_control_assert(c->rst);
	memset(status_of(c), 0, sizeof(struct c9_status));
	clean(c, C9_STATUS_OFF, sizeof(struct c9_status));
	c->running = false;
	mutex_unlock(&c->lock);
	return count;
}
static DEVICE_ATTR_WO(stop);

static ssize_t run_store(struct device *dev, struct device_attribute *attr, const char *buf,
			 size_t count)
{
	struct c9 *c = dev_get_drvdata(dev);
	char opname[8], mode[8];
	u32 n, len;
	u8 op;
	int ret;

	if (sscanf(buf, "%7s %7s %u %u", opname, mode, &n, &len) != 4)
		return -EINVAL;
	if (!strcmp(opname, "seal"))
		op = C9_OP_SEAL;
	else if (!strcmp(opname, "copy"))
		op = C9_OP_COPY;
	else if (!strcmp(opname, "ping"))
		op = C9_OP_PING;
	else
		return -EINVAL;
	if (strcmp(mode, "mbox") && strcmp(mode, "poll"))
		return -EINVAL;
	if (n > 100000)
		return -EINVAL;

	mutex_lock(&c->lock);
	c->result[0] = 0;
	ret = c9_run(c, op, !strcmp(mode, "poll"), n, op == C9_OP_PING ? 0 : len);
	if (ret)
		scnprintf(c->result, RESULT_MAX, "error %d\n", ret);
	mutex_unlock(&c->lock);
	return ret ? ret : count;
}
static DEVICE_ATTR_WO(run);

static ssize_t result_show(struct device *dev, struct device_attribute *attr, char *buf)
{
	struct c9 *c = dev_get_drvdata(dev);
	ssize_t n;

	mutex_lock(&c->lock);
	n = sysfs_emit(buf, "%s", c->result);
	mutex_unlock(&c->lock);
	return n;
}
static DEVICE_ATTR_RO(result);

static ssize_t status_show(struct device *dev, struct device_attribute *attr, char *buf)
{
	struct c9 *c = dev_get_drvdata(dev);
	struct c9_status *st = status_of(c);
	ssize_t n;

	mutex_lock(&c->lock);
	inval(c, C9_STATUS_OFF, sizeof(*st));
	n = sysfs_emit(buf,
		       "%srunning: %d\nmagic: 0x%08x version %u messages %u\n"
		       "mhcr 0x%lx mxstatus 0x%lx mhint 0x%lx last mcycle %lu\n",
		       c->start_info, c->running, st->magic, st->version, st->messages,
		       st->mhcr, st->mxstatus, st->mhint, st->loops);
	mutex_unlock(&c->lock);
	return n;
}
static DEVICE_ATTR_RO(status);

static struct attribute *c9_attrs[] = {
	&dev_attr_start.attr, &dev_attr_stop.attr, &dev_attr_run.attr,
	&dev_attr_result.attr, &dev_attr_status.attr, NULL,
};
ATTRIBUTE_GROUPS(c9);

static int c9_probe(struct platform_device *pdev)
{
	struct device *dev = &pdev->dev;
	struct device_node *np;
	struct reserved_mem *rmem;
	struct c9 *c;
	int ret;

	BUILD_BUG_ON(sizeof(struct c9_req) != C9_REQ_SIZE);
	BUILD_BUG_ON(sizeof(struct c9_res) != 64);
	BUILD_BUG_ON(sizeof(struct c9_status) != 64);
	BUILD_BUG_ON(sizeof(struct c9_bell) != 64);

	c = devm_kzalloc(dev, sizeof(*c), GFP_KERNEL);
	if (!c)
		return -ENOMEM;
	c->dev = dev;
	mutex_init(&c->lock);
	init_completion(&c->done);
	get_random_bytes(c->key, sizeof(c->key));

	np = of_parse_phandle(dev->of_node, "memory-region", 0);
	if (!np)
		return -ENODEV;
	rmem = of_reserved_mem_lookup(np);
	of_node_put(np);
	if (!rmem || rmem->base != C9_REGION_BASE || rmem->size < C9_REGION_SIZE)
		return dev_err_probe(dev, -EINVAL, "unexpected memory region\n");
	c->base = rmem->base;
	c->size = rmem->size;

	ret = dma_set_mask_and_coherent(dev, DMA_BIT_MASK(32));
	if (ret)
		return ret;
	c->va = devm_memremap(dev, c->base, c->size, MEMREMAP_WB);
	if (IS_ERR(c->va))
		return PTR_ERR(c->va);
	c->dma = dma_map_single(dev, c->va, c->size, DMA_BIDIRECTIONAL);
	if (dma_mapping_error(dev, c->dma))
		return -ENOMEM;

	c->src = devm_kmalloc(dev, C9_MAX_LEN, GFP_KERNEL);
	c->dst = devm_kmalloc(dev, C9_MAX_LEN + C9_TAG_LEN, GFP_KERNEL);
	c->ref = devm_kmalloc(dev, C9_MAX_LEN + C9_TAG_LEN, GFP_KERNEL);
	if (!c->src || !c->dst || !c->ref) {
		ret = -ENOMEM;
		goto unmap;
	}

	c->rst = devm_reset_control_get_exclusive(dev, NULL);
	if (IS_ERR(c->rst)) {
		ret = PTR_ERR(c->rst);
		goto unmap;
	}

	c->cl_req.dev = dev;
	c->cl_req.knows_txdone = true;
	c->cl_req.rx_callback = rx_req;
	c->cl_res.dev = dev;
	c->cl_res.rx_callback = rx_res;
	c->req = mbox_request_channel_byname(&c->cl_req, "req");
	if (IS_ERR(c->req)) {
		ret = PTR_ERR(c->req);
		goto unmap;
	}
	c->res = mbox_request_channel_byname(&c->cl_res, "res");
	if (IS_ERR(c->res)) {
		ret = PTR_ERR(c->res);
		mbox_free_channel(c->req);
		goto unmap;
	}

	c9_attach(c);
	platform_set_drvdata(pdev, c);
	return 0;

unmap:
	dma_unmap_single(dev, c->dma, c->size, DMA_BIDIRECTIONAL);
	return dev_err_probe(dev, ret, "probe failed\n");
}

static void c9_remove(struct platform_device *pdev)
{
	struct c9 *c = platform_get_drvdata(pdev);

	reset_control_assert(c->rst);
	/* so that the next probe does not take a stopped core for a running one */
	memset(status_of(c), 0, sizeof(struct c9_status));
	clean(c, C9_STATUS_OFF, sizeof(struct c9_status));
	mbox_free_channel(c->res);
	mbox_free_channel(c->req);
	dma_unmap_single(c->dev, c->dma, c->size, DMA_BIDIRECTIONAL);
}

static const struct of_device_id c9_of_match[] = {
	{ .compatible = "hnanokvm,c906l-tls-test" },
	{}
};
MODULE_DEVICE_TABLE(of, c9_of_match);

static struct platform_driver c9_driver = {
	.driver = {
		.name = "c906l-tls-test",
		.of_match_table = c9_of_match,
		.dev_groups = c9_groups,
	},
	.probe = c9_probe,
	.remove = c9_remove,
};
module_platform_driver(c9_driver);

MODULE_DESCRIPTION("C906L send-side TLS measurement");
MODULE_LICENSE("GPL");
MODULE_FIRMWARE(FW_NAME);
