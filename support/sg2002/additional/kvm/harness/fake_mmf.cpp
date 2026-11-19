// Host harness: libkvm's media C API (kvm_media.cpp, kvm_capture.cpp) over a recording fake
// of libkvm_mmf. Runs a scenario file and prints every mmf_* call and API result.
#include "kvm_media.h"
#include "kvm_mmf.hpp"

#include <sanitizer/lsan_interface.h>

#include <deque>
#include <fstream>
#include <set>
#include <sstream>
#include <stdio.h>
#include <stdlib.h>
#include <string>
#include <vector>

namespace {

const int NV21 = 19;

std::string hash(const uint8_t *p, size_t n)
{
	uint32_t h = 2166136261u;
	for (size_t i = 0; i < n; i++)
		h = (h ^ p[i]) * 16777619u;
	char buf[16];
	snprintf(buf, sizeof buf, "%08x", h);
	return buf;
}

std::string data_str(const uint8_t *p, size_t n)
{
	return p == NULL ? "null" : hash(p, n);
}

void out(const std::string &line)
{
	printf("%s\n", line.c_str());
}

struct Pop {
	int rc, len, w, h, fmt;
};

struct Fake {
	std::set<std::string> fail; // next call of each name returns -1
	std::deque<Pop> pops;
	bool map_fail = false;
	int align = 64;
	int unused = 0;
	bool is_init = true;
	bool open[8] = {};
	int frames = 0;
	std::vector<uint8_t> frame; // the popped frame's buffer
	int jpg_size = 100;
	bool jpg_null = false;
	int jpg_seq = 0;
	std::vector<uint8_t> jpg;
	std::vector<int> packs = {40};
	int venc_seq = 0;
	std::vector<std::vector<uint8_t>> pack_data;
} fake;

int rc_for(const char *name)
{
	return fake.fail.erase(name) ? -1 : 0;
}

std::string fmt_ret(int rc)
{
	return " -> " + std::to_string(rc);
}

} // namespace

int mmf_init(void)
{
	int rc = rc_for("init");
	out("mmf init" + fmt_ret(rc));
	return rc;
}

int mmf_deinit(void)
{
	out("mmf deinit");
	return 0;
}

int mmf_try_deinit(bool force)
{
	out(std::string("mmf try_deinit ") + (force ? "1" : "0"));
	return 0;
}

bool mmf_is_init(void)
{
	out(std::string("mmf is_init -> ") + (fake.is_init ? "1" : "0"));
	return fake.is_init;
}

int mmf_get_vi_unused_channel(void)
{
	out("mmf get_vi_unused_channel -> " + std::to_string(fake.unused));
	return fake.unused;
}

int mmf_vi_init(void)
{
	int rc = rc_for("vi_init");
	out("mmf vi_init" + fmt_ret(rc));
	return rc;
}

int mmf_vi_deinit(void)
{
	int rc = rc_for("vi_deinit");
	out("mmf vi_deinit" + fmt_ret(rc));
	return rc;
}

int mmf_add_vi_channel(int ch, int width, int height, int format)
{
	int rc = rc_for("add_vi");
	if (rc == 0 && ch >= 0 && ch < 8)
		fake.open[ch] = true;
	out("mmf add_vi_channel " + std::to_string(ch) + " " + std::to_string(width) + "x" +
	    std::to_string(height) + " fmt=" + std::to_string(format) + fmt_ret(rc));
	return rc;
}

int mmf_del_vi_channel(int ch)
{
	int rc = rc_for("del_vi");
	if (rc == 0 && ch >= 0 && ch < 8)
		fake.open[ch] = false;
	out("mmf del_vi_channel " + std::to_string(ch) + fmt_ret(rc));
	return rc;
}

bool mmf_vi_chn_is_open(int ch)
{
	bool open = ch >= 0 && ch < 8 && fake.open[ch];
	out("mmf vi_chn_is_open " + std::to_string(ch) + " -> " + (open ? "1" : "0"));
	return open;
}

int mmf_vi_aligned_width(int ch)
{
	out("mmf vi_aligned_width " + std::to_string(ch) + " -> " + std::to_string(fake.align));
	return fake.align;
}

void mmf_set_vi_hmirror(int ch, bool en)
{
	out("mmf set_vi_hmirror " + std::to_string(ch) + " " + (en ? "1" : "0"));
}

void mmf_set_vi_vflip(int ch, bool en)
{
	out("mmf set_vi_vflip " + std::to_string(ch) + " " + (en ? "1" : "0"));
}

int mmf_vi_frame_pop(int ch, int *len, int *width, int *height, int *format)
{
	if (fake.pops.empty()) {
		out("mmf vi_frame_pop " + std::to_string(ch) + " -> -1");
		return -1;
	}
	Pop p = fake.pops.front();
	fake.pops.pop_front();
	if (p.rc != 0) {
		out("mmf vi_frame_pop " + std::to_string(ch) + " -> " + std::to_string(p.rc));
		return p.rc;
	}
	*len = p.len;
	*width = p.w;
	*height = p.h;
	*format = p.fmt;
	fake.frames++;
	// Big enough for any copy the reader makes; byte i depends on the frame number and i.
	size_t n = (size_t)p.len + (size_t)p.w * p.h * 4 + (1 << 20);
	fake.frame.assign(n, 0);
	for (size_t i = 0; i < n; i++)
		fake.frame[i] = (uint8_t)(fake.frames * 131 + i * 7 + (i >> 9));
	out("mmf vi_frame_pop " + std::to_string(ch) + " -> 0 len=" + std::to_string(p.len) + " " +
	    std::to_string(p.w) + "x" + std::to_string(p.h) + " fmt=" + std::to_string(p.fmt));
	return 0;
}

void *mmf_vi_frame_map(int ch)
{
	bool fail = fake.map_fail;
	fake.map_fail = false;
	out("mmf vi_frame_map " + std::to_string(ch) + " -> " +
	    (fail ? "null" : "frame#" + std::to_string(fake.frames)));
	return fail ? NULL : fake.frame.data();
}

void mmf_vi_frame_free(int ch)
{
	out("mmf vi_frame_free " + std::to_string(ch));
}

void mmf_vi_frame_release(int ch)
{
	out("mmf vi_frame_release " + std::to_string(ch));
}

int mmf_invert_format_to_mmf(int maix_format)
{
	// A pure lookup; not traced.
	return maix_format == MMF_INPUT_FMT_NV21 ? NV21 : -1;
}

int mmf_enc_jpg_push_with_quality(int ch, uint8_t *data, int w, int h, int format, int quality)
{
	int rc = rc_for("jpg_push");
	out("mmf enc_jpg_push " + std::to_string(ch) + " data=" +
	    data_str(data, (size_t)w * h * 3 / 2) + " " + std::to_string(w) + "x" + std::to_string(h) +
	    " fmt=" + std::to_string(format) + " q=" + std::to_string(quality) + fmt_ret(rc));
	return rc;
}

int mmf_enc_jpg_pop(int ch, uint8_t **data, int *size)
{
	int rc = rc_for("jpg_pop");
	if (rc != 0) {
		out("mmf enc_jpg_pop " + std::to_string(ch) + " -> -1");
		return rc;
	}
	fake.jpg_seq++;
	fake.jpg.assign((size_t)(fake.jpg_size > 0 ? fake.jpg_size : 1), 0);
	for (size_t i = 0; i < fake.jpg.size(); i++)
		fake.jpg[i] = (uint8_t)(fake.jpg_seq * 17 + i * 3);
	*data = fake.jpg_null ? NULL : fake.jpg.data();
	fake.jpg_null = false;
	*size = fake.jpg_size;
	out("mmf enc_jpg_pop " + std::to_string(ch) + " -> 0 size=" + std::to_string(fake.jpg_size) +
	    (*data ? "" : " data=null"));
	return 0;
}

int mmf_enc_jpg_free(int ch)
{
	out("mmf enc_jpg_free " + std::to_string(ch));
	return 0;
}

int mmf_add_venc_channel(int ch, mmf_venc_cfg_t *cfg)
{
	int rc = rc_for("venc_add");
	out("mmf add_venc_channel " + std::to_string(ch) + " type=" + std::to_string(cfg->type) + " " +
	    std::to_string(cfg->w) + "x" + std::to_string(cfg->h) + " fmt=" + std::to_string(cfg->fmt) +
	    " q=" + std::to_string(cfg->jpg_quality) + " gop=" + std::to_string(cfg->gop) +
	    " fps=" + std::to_string(cfg->intput_fps) + "/" + std::to_string(cfg->output_fps) +
	    " bitrate=" + std::to_string(cfg->bitrate) + fmt_ret(rc));
	return rc;
}

int mmf_del_venc_channel(int ch)
{
	int rc = rc_for("venc_del");
	out("mmf del_venc_channel " + std::to_string(ch) + fmt_ret(rc));
	return rc;
}

int mmf_venc_push(int ch, uint8_t *data, int w, int h, int format)
{
	int rc = rc_for("venc_push");
	out("mmf venc_push " + std::to_string(ch) + " data=" + data_str(data, (size_t)w * h * 3 / 2) +
	    " " + std::to_string(w) + "x" + std::to_string(h) + " fmt=" + std::to_string(format) +
	    fmt_ret(rc));
	return rc;
}

int mmf_venc_pop(int ch, mmf_stream_t *stream)
{
	int rc = rc_for("venc_pop");
	if (rc != 0) {
		out("mmf venc_pop " + std::to_string(ch) + " -> -1");
		return rc;
	}
	fake.venc_seq++;
	fake.pack_data.clear();
	std::string sizes;
	stream->count = (int)fake.packs.size();
	for (size_t k = 0; k < fake.packs.size() && k < MMF_STREAM_MAX_PACKS; k++) {
		std::vector<uint8_t> d((size_t)(fake.packs[k] > 0 ? fake.packs[k] : 1));
		for (size_t i = 0; i < d.size(); i++)
			d[i] = (uint8_t)(k * 29 + i * 5 + fake.venc_seq);
		fake.pack_data.push_back(d);
		sizes += (k ? "," : "") + std::to_string(fake.packs[k]);
	}
	for (size_t k = 0; k < fake.pack_data.size(); k++) {
		stream->data[k] = fake.packs[k] > 0 ? fake.pack_data[k].data() : NULL;
		stream->data_size[k] = fake.packs[k];
	}
	out("mmf venc_pop " + std::to_string(ch) + " -> 0 packs=" + sizes);
	return 0;
}

int mmf_venc_free(int ch)
{
	int rc = rc_for("venc_free");
	out("mmf venc_free " + std::to_string(ch) + fmt_ret(rc));
	return rc;
}

int mmf_venc_request_idr(int ch)
{
	int rc = rc_for("idr");
	out("mmf venc_request_idr " + std::to_string(ch) + fmt_ret(rc));
	return rc;
}

namespace {

struct Alloc {
	bool refuse;
	std::vector<uint8_t> buf;
};

uint8_t *alloc_fn(void *ctx, uint32_t size)
{
	Alloc *a = (Alloc *)ctx;
	if (a->refuse)
		return NULL;
	// One spare byte: never NULL, also for an empty frame.
	a->buf.assign((size_t)size + 1, 0);
	return a->buf.data();
}

int num(std::istringstream &in)
{
	std::string s;
	in >> s;
	return s == "nv21" ? NV21 : std::stoi(s);
}

void run(const std::string &line)
{
	std::istringstream in(line);
	std::string op;
	in >> op;
	if (op.empty() || op[0] == '#')
		return;
	out("> " + line);
	// Fake setup.
	if (op == "pop") {
		std::string w;
		in >> w;
		if (w == "fail") {
			fake.pops.push_back({-1, 0, 0, 0, 0});
			return;
		}
		Pop p = {0, 0, std::stoi(w), 0, 0};
		p.h = num(in);
		p.fmt = num(in);
		p.len = num(in);
		fake.pops.push_back(p);
	} else if (op == "map_fail") {
		fake.map_fail = true;
	} else if (op == "fail") {
		std::string name;
		in >> name;
		fake.fail.insert(name);
	} else if (op == "align") {
		fake.align = num(in);
	} else if (op == "unused") {
		fake.unused = num(in);
	} else if (op == "set_init") {
		fake.is_init = num(in) != 0;
	} else if (op == "jpg_null") {
		fake.jpg_null = true;
	} else if (op == "jpg_size") {
		fake.jpg_size = num(in);
	} else if (op == "packs") {
		fake.packs.clear();
		std::string s;
		while (in >> s)
			fake.packs.push_back(std::stoi(s));
	}
	// API calls.
	else if (op == "create") {
		int w = num(in), h = num(in);
		out("call create -> " + std::to_string(kvmc_cam_create(w, h)));
	} else if (op == "restart") {
		int w = num(in), h = num(in);
		kvmc_cam_restart(w, h);
	} else if (op == "size") {
		int w = num(in), h = num(in);
		out("call size -> " + std::to_string(kvmc_cam_set_size(w, h)));
	} else if (op == "mirror") {
		kvmc_cam_mirror_flip();
	} else if (op == "close") {
		kvmc_cam_close();
	} else if (op == "isinit") {
		out("call isinit -> " + std::to_string(kvmc_mmf_is_init()));
	} else if (op == "deinit") {
		kvmc_mmf_deinit(num(in));
	} else if (op == "read") {
		int w = 0, h = 0;
		size_t size = 0;
		int rc = kvmc_frame_read(&w, &h, &size);
		out("call read -> " + std::to_string(rc) +
		    (rc == 0 ? " " + std::to_string(w) + "x" + std::to_string(h) + " size=" +
				       std::to_string(size)
			     : ""));
	} else if (op == "pixels") {
		size_t n = (size_t)num(in);
		const uint8_t *p = kvmc_frame_pixels();
		out("call pixels -> " + data_str(p, n));
	} else if (op == "release") {
		kvmc_frame_release();
	} else if (op == "jpeg") {
		int q = num(in);
		std::string mode;
		in >> mode;
		Alloc a = {mode == "refuse", {}};
		uint32_t size = 0;
		int rc = kvmc_frame_jpeg(q, alloc_fn, &a, &size);
		out("call jpeg -> " + std::to_string(rc) + " size=" + std::to_string(size) +
		    (rc == 0 ? " " + hash(a.buf.data(), size) : ""));
	} else if (op == "vadd") {
		int ch = num(in), w = num(in), h = num(in), gop = num(in), fps = num(in), br = num(in);
		out("call vadd -> " + std::to_string(kvmc_venc_add(ch, w, h, gop, fps, br)));
	} else if (op == "vdel") {
		out("call vdel -> " + std::to_string(kvmc_venc_del(num(in))));
	} else if (op == "vpush") {
		out("call vpush -> " + std::to_string(kvmc_frame_venc_push(num(in))));
	} else if (op == "vpop") {
		int ch = num(in), max = num(in);
		const uint8_t *data[MMF_STREAM_MAX_PACKS] = {};
		int size[MMF_STREAM_MAX_PACKS] = {};
		int n = kvmc_venc_pop(ch, data, size, max);
		std::string packs;
		for (int i = max; i < MMF_STREAM_MAX_PACKS; i++)
			if (data[i] != NULL || size[i] != 0)
				packs += " spill";
		for (int i = 0; i < n && i < max; i++)
			packs += " " + std::to_string(size[i]) + ":" +
				 data_str(data[i], size[i] > 0 ? (size_t)size[i] : 0);
		out("call vpop -> " + std::to_string(n) + packs);
	} else if (op == "vfree") {
		out("call vfree -> " + std::to_string(kvmc_venc_free(num(in))));
	} else if (op == "vidr") {
		out("call vidr -> " + std::to_string(kvmc_venc_request_idr(num(in))));
	} else {
		fprintf(stderr, "unknown op: %s\n", line.c_str());
		exit(2);
	}
}

} // namespace

int main(int argc, char **argv)
{
	if (argc != 2) {
		fprintf(stderr, "usage: %s SCENARIO\n", argv[0]);
		return 2;
	}
	std::ifstream f(argv[1]);
	if (!f) {
		fprintf(stderr, "cannot read %s\n", argv[1]);
		return 2;
	}
	std::string line;
	while (std::getline(f, line))
		run(line);
	// What the API still holds is reachable from its statics; anything else leaked.
	out(std::string("end leaks=") + (__lsan_do_recoverable_leak_check() ? "1" : "0"));
	fflush(stdout);
	return 0;
}
