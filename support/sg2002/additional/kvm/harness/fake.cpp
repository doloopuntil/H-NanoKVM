// Differential-test harness for libkvm's control half: in the unmodified kvm_vision.o and
// vi_state_shared.o every libc call that touches hardware, files, time or threads is renamed
// to fake_* (objcopy --redefine-sym). The camera and encoders are recording stubs.
// Virtual time; one simulated thread runs at a time (ties go to whoever slept first).
#include <errno.h>
#include <fcntl.h>
#include <linux/gpio.h>
#include <linux/i2c-dev.h>
#include <pthread.h>
#include <stdarg.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/ioctl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

#include <algorithm>
#include <condition_variable>
#include <deque>
#include <fstream>
#include <map>
#include <mutex>
#include <sstream>
#include <string>
#include <vector>

#include "internal/kvm_capture.hpp"
#include "kvm_mmf.hpp"
#include "kvm_vision.h"

namespace {

// ---- trace -------------------------------------------------------------------

FILE *g_trace;
std::string g_root;
uint64_t g_now;			   // virtual ms since start
uint64_t g_base = 5000000;	   // CLOCK_MONOTONIC ms at start
uint64_t g_rt_base = 1700000000000;  // CLOCK_REALTIME ms at start

// Identical consecutive lines collapse into "@A..@B line xN".
struct Pending {
	std::string text;
	uint64_t first = 0, last = 0;
	unsigned count = 0;
} g_pending;

void flush_pending()
{
	if (g_pending.count == 0) return;
	if (g_pending.count == 1)
		fprintf(g_trace, "@%llu %s\n", (unsigned long long)g_pending.first, g_pending.text.c_str());
	else
		fprintf(g_trace, "@%llu..@%llu %s x%u\n", (unsigned long long)g_pending.first,
			(unsigned long long)g_pending.last, g_pending.text.c_str(), g_pending.count);
	g_pending = Pending();
}

void trace(const char *fmt, ...)
{
	char buf[1024];
	va_list ap;
	va_start(ap, fmt);
	vsnprintf(buf, sizeof(buf), fmt, ap);
	va_end(ap);
	if (g_pending.count && g_pending.text == buf) {
		g_pending.count++;
		g_pending.last = g_now;
		return;
	}
	flush_pending();
	g_pending.text = buf;
	g_pending.first = g_pending.last = g_now;
	g_pending.count = 1;
}

std::string quote(const std::string &s)
{
	std::string out = "\"";
	for (unsigned char c : s) {
		if (c == '\n') out += "\\n";
		else if (c == '"' || c == '\\') { out += '\\'; out += (char)c; }
		else if (c < 0x20 || c > 0x7e) { char h[8]; snprintf(h, sizeof(h), "\\x%02x", c); out += h; }
		else out += (char)c;
	}
	return out + "\"";
}

std::string hex(const uint8_t *p, size_t n)
{
	std::string s;
	for (size_t i = 0; i < n; i++) { char h[4]; snprintf(h, sizeof(h), " %02x", p[i]); s += h; }
	return s;
}

// ---- files under the fake root --------------------------------------------------

std::string host_path(const char *path)
{
	if (path == nullptr || path[0] != '/') return path ? path : "";
	return g_root + path;
}

void make_parents(const std::string &host)
{
	for (size_t i = g_root.size() + 1; i < host.size(); i++)
		if (host[i] == '/') mkdir(host.substr(0, i).c_str(), 0755);
}

void put_file(const std::string &path, const std::string &content)
{
	std::string host = host_path(path.c_str());
	make_parents(host);
	FILE *fp = fopen(host.c_str(), "w");
	if (!fp) { perror(host.c_str()); exit(2); }
	fwrite(content.data(), 1, content.size(), fp);
	fclose(fp);
}

std::string read_host(const std::string &host)
{
	std::ifstream in(host, std::ios::binary);
	std::stringstream ss;
	ss << in.rdbuf();
	return ss.str();
}

std::string unescape(const std::string &s)
{
	std::string out;
	for (size_t i = 0; i < s.size(); i++) {
		if (s[i] == '\\' && i + 1 < s.size()) {
			char c = s[++i];
			if (c == 'x' && i + 2 < s.size()) {
				out += (char)strtol(s.substr(i + 1, 2).c_str(), nullptr, 16);
				i += 2;
			} else {
				out += c == 'n' ? '\n' : c == 't' ? '\t' : c;
			}
		} else {
			out += s[i];
		}
	}
	return out;
}

// ---- hardware model --------------------------------------------------------------

std::string g_chip = "ux";	    // c, ux, d, ue: what S15kvmhwd writes
bool g_gpio_line = false;	    // the DT names a "hdmi-reset" line (PCIe)
uint8_t g_regs[256][256];	    // LT6911 bank, register
uint8_t g_bank, g_ptr;
bool g_i2c_nack;
int g_lt_count;			    // /proc/lt_int
bool g_lt_exists = true;
uint64_t g_vidbg_ms = 1000;	    // the vi_dbg read blocks this long
std::string g_carveout;		    // "usage rate" for the watchdog, "" = no output

struct Media {
	bool signal = false;	    // the bridge sends a picture
	unsigned src_w = 0, src_h = 0;  // its size
	unsigned in_w = 0, in_h = 0;	// the VI's input size, read at camera start
	bool vidbg_auto = false;	// vi_dbg follows signal and sizes
	uint64_t frame_ms = 16;
	uint64_t restart_ms = 0;	// a camera restart takes this long
	uint8_t frame_id = 1;
	bool cam_fail = false;
	bool mmf_init = false;
	std::string venc_fail;	    // add, push, pop
	bool idr_pending = false;
	int cam_w = 0, cam_h = 0;
	bool cam_open = false;
	std::string last;	    // what the last read encoded, for the call line
	std::vector<uint8_t> fb;
} g_media;

void set_be16(int bank, int reg, unsigned v)
{
	g_regs[bank][reg] = (uint8_t)(v >> 8);
	g_regs[bank][(reg + 1) & 0xff] = (uint8_t)v;
}

// What each bridge reports for an HDMI input of w x h (0 x 0: none).
void set_source(unsigned w, unsigned h)
{
	if (g_chip == "c") {
		set_be16(0xd2, 0x96, h);
		set_be16(0xd2, 0x8b, w / 2);
		set_be16(0xc2, 0x06, h);
		set_be16(0xc2, 0x38, w);
	} else if (g_chip == "ux") {
		g_regs[0x86][0xa3] = w && h ? 0x55 : 0x88;
		set_be16(0x85, 0xf0, h);
		set_be16(0x85, 0xea, w);
	} else if (g_chip == "d") {
		set_be16(0xe0, 0x8c, w / 2);
		set_be16(0xe0, 0x8e, h);
	}
	g_media.signal = w && h;
	g_media.src_w = w;
	g_media.src_h = h;
}

// Frames pass the CSI checks only at the size the VI was started with.
bool frames_flow()
{
	return g_media.signal && g_media.in_w == g_media.src_w && g_media.in_h == g_media.src_h;
}

void write_vidbg(const std::vector<unsigned> &v);

void write_vidbg_auto()
{
	const Media &m = g_media;
	unsigned dev = m.signal ? 60 : 0;
	write_vidbg({dev, frames_flow() ? 60u : 0u, m.signal && m.src_w > m.in_w, m.signal && m.src_w < m.in_w,
		m.signal && m.src_h > m.in_h, m.signal && m.src_h < m.in_h});
}

// As kvm_read_dimension in sample_common_sensor.c.
unsigned read_dimension(const char *path, unsigned fallback)
{
	std::string s = read_host(host_path(path));
	char *end;
	unsigned long v = strtoul(s.c_str(), &end, 10);
	if (end == s.c_str() || v == 0 || v > 8192) return fallback;
	return (unsigned)v;
}

void vi_start()
{
	g_media.in_w = read_dimension("/kvmapp/kvm/width", 1920);
	g_media.in_h = read_dimension("/kvmapp/kvm/height", 1080);
}

void write_lt_file()
{
	if (g_lt_exists) put_file("/proc/lt_int", std::to_string(g_lt_count) + "\n");
	else unlink(host_path("/proc/lt_int").c_str());
}

void write_vidbg(const std::vector<unsigned> &v)
{
	static const char *names[] = {"VIDevFPS", "VIFPS", "VICsiCh0WidthGTCnt", "VICsiCh0WidthLSCnt",
		"VICsiCh0HeightGTCnt", "VICsiCh0HeightLSCnt"};
	std::string s = "-----VI DEV STATUS-----\n";
	for (size_t i = 0; i < v.size() && i < 6; i++) s += std::string(names[i]) + " : " + std::to_string(v[i]) + "\n";
	put_file("/proc/cvitek/vi_dbg", s);
}

// ---- scenario --------------------------------------------------------------------

struct Line {
	uint64_t t;
	std::string text;
};
std::deque<Line> g_actions;  // hardware, applied by the scheduler on time
std::deque<Line> g_calls;    // API calls, made by the main thread in order
uint64_t g_end;
bool g_have_end;

void apply(const std::string &line)
{
	std::istringstream in(line);
	std::string op;
	in >> op;
	trace("> %s", line.c_str());
	if (op == "file") {
		std::string path, rest;
		in >> path;
		std::getline(in, rest);
		if (!rest.empty() && rest[0] == ' ') rest.erase(0, 1);
		put_file(path, unescape(rest));
	} else if (op == "rm") {
		std::string path;
		in >> path;
		unlink(host_path(path.c_str()).c_str());
	} else if (op == "src") {
		std::string w;
		unsigned h = 0;
		in >> w >> h;
		if (w == "off") set_source(0, 0);
		else set_source((unsigned)strtoul(w.c_str(), nullptr, 10), h);
	} else if (op == "reg") {
		std::string b, r, v;
		in >> b >> r >> v;
		g_regs[strtoul(b.c_str(), nullptr, 16) & 0xff][strtoul(r.c_str(), nullptr, 16) & 0xff] =
			(uint8_t)strtoul(v.c_str(), nullptr, 16);
	} else if (op == "int") {
		std::string e;
		in >> e;
		g_lt_count += e == "rise" ? 1 : 10;
		write_lt_file();
	} else if (op == "vidbg") {
		std::string first;
		in >> first;
		g_media.vidbg_auto = first == "auto";
		if (first == "absent") {
			unlink(host_path("/proc/cvitek/vi_dbg").c_str());
		} else if (first == "auto") {
			write_vidbg_auto();
		} else {
			std::vector<unsigned> v = {(unsigned)strtoul(first.c_str(), nullptr, 10)};
			unsigned x;
			while (in >> x) v.push_back(x);
			write_vidbg(v);
		}
	} else if (op == "nack") {
		std::string v;
		in >> v;
		g_i2c_nack = v == "on";
	} else if (op == "carveout") {
		std::string v;
		in >> v;
		g_carveout = v == "none" ? "" : v + "\n";
	} else if (op == "frame") {
		unsigned id;
		in >> id;
		g_media.frame_id = (uint8_t)id;
	} else if (op == "signal") {
		std::string v;
		in >> v;
		g_media.signal = v == "on";
	} else if (op == "venc") {
		std::string what, v;
		in >> what >> v;
		g_media.venc_fail = v == "none" ? "" : v;
	} else {
		fprintf(stderr, "unknown scenario line: %s\n", line.c_str());
		exit(2);
	}
}

void load_scenario(const char *path)
{
	std::ifstream in(path);
	if (!in) { perror(path); exit(2); }
	std::string line;
	uint64_t t = 0;
	while (std::getline(in, line)) {
		size_t start = line.find_first_not_of(" \t");
		if (start == std::string::npos || line[start] == '#') continue;
		line = line.substr(start);
		std::istringstream ls(line);
		std::string op;
		ls >> op;
		if (op == "at") {
			ls >> t;
		} else if (op == "chip") {
			ls >> g_chip;
		} else if (op == "board") {
			std::string b;
			ls >> b;
			if (b != "none") put_file("/etc/kvm/hw", b + "\n");
			g_gpio_line = b == "pcie";
		} else if (op == "nogpio") {
			g_gpio_line = false;
		} else if (op == "nolt") {
			g_lt_exists = false;
		} else if (op == "vidbg_ms") {
			ls >> g_vidbg_ms;
		} else if (op == "frame_ms") {
			ls >> g_media.frame_ms;
		} else if (op == "restart_ms") {
			ls >> g_media.restart_ms;
		} else if (op == "cam") {
			std::string v;
			ls >> v;
			g_media.cam_fail = v == "fail";
		} else if (op == "call") {
			g_calls.push_back({t, line.substr(5)});
		} else if (op == "end") {
			g_end = t;
			g_have_end = true;
		} else {
			g_actions.push_back({t, line});
		}
	}
	std::stable_sort(g_actions.begin(), g_actions.end(), [](const Line &a, const Line &b) { return a.t < b.t; });
	if (!g_have_end) { fprintf(stderr, "scenario has no end\n"); exit(2); }
}

void apply_due(uint64_t until)
{
	while (!g_actions.empty() && g_actions.front().t <= until) {
		Line a = g_actions.front();
		g_actions.pop_front();
		if (a.t > g_now) g_now = a.t;
		apply(a.text);
	}
}

// ---- scheduler -----------------------------------------------------------------

enum State { RUNNABLE, SLEEPING, MUTEX_WAIT, DONE };

struct Sim {
	State st = RUNNABLE;
	uint64_t wake = 0;
	uint64_t seq = 0;
	bool go = false;
	pthread_mutex_t *waiting = nullptr;
	bool timed = false;	 // MUTEX_WAIT with a deadline in wake
	bool timed_out = false;
};

std::mutex g_m;
std::condition_variable g_cv;
std::vector<Sim *> g_sims;
uint64_t g_seq;
thread_local Sim *t_self;
std::map<pthread_mutex_t *, Sim *> g_owners;
std::map<pthread_t, Sim *> g_threads;

bool waits_on_time(const Sim *s) { return s->st == SLEEPING || (s->st == MUTEX_WAIT && s->timed); }

// Picks the next thread to run and advances virtual time; nullptr when none can run.
Sim *pick_next()
{
	for (;;) {
		Sim *best = nullptr;
		for (Sim *s : g_sims)
			if (s->st == RUNNABLE && (!best || s->seq < best->seq)) best = s;
		if (best) return best;
		for (Sim *s : g_sims)
			if (waits_on_time(s) && (!best || s->wake < best->wake || (s->wake == best->wake && s->seq < best->seq)))
				best = s;
		if (!best) {
			for (Sim *s : g_sims)
				if (s->st == MUTEX_WAIT) { fprintf(stderr, "harness: deadlock\n"); exit(3); }
			return nullptr;
		}
		if (!g_actions.empty() && g_actions.front().t <= best->wake) {
			apply_due(g_actions.front().t);
			continue;
		}
		if (best->wake > g_now) g_now = best->wake;
		if (best->st == MUTEX_WAIT) best->timed_out = true;
		best->st = RUNNABLE;
		return best;
	}
}

// Hands the baton on; with wait, blocks until it comes back.
void hand_off(std::unique_lock<std::mutex> &lk, Sim *self, bool wait)
{
	Sim *next = pick_next();
	if (next == self) return;
	if (next) {
		next->go = true;
		g_cv.notify_all();
	}
	if (!wait) return;
	g_cv.wait(lk, [self] { return self->go; });
	self->go = false;
}

void sim_sleep(uint64_t ms)
{
	std::unique_lock<std::mutex> lk(g_m);
	Sim *self = t_self;
	self->st = SLEEPING;
	self->wake = g_now + ms;
	self->seq = ++g_seq;
	hand_off(lk, self, true);
}

struct Start {
	void *(*fn)(void *);
	void *arg;
	Sim *sim;
};

void *trampoline(void *p)
{
	Start start = *(Start *)p;
	delete (Start *)p;
	t_self = start.sim;
	{
		std::unique_lock<std::mutex> lk(g_m);
		g_cv.wait(lk, [&] { return start.sim->go; });
		start.sim->go = false;
	}
	void *ret = start.fn(start.arg);
	std::unique_lock<std::mutex> lk(g_m);
	start.sim->st = DONE;
	hand_off(lk, start.sim, false);
	return ret;
}

uint64_t deadline_ms(const struct timespec *abs)
{
	uint64_t ms = (uint64_t)abs->tv_sec * 1000 + (uint64_t)abs->tv_nsec / 1000000;
	return ms > g_rt_base ? ms - g_rt_base : 0;
}

// ---- fds -----------------------------------------------------------------------

// Used by the static I2cBus constructor before main.
std::map<int, int> &i2c_fds() { static std::map<int, int> m; return m; }  // fd -> slave address
std::map<int, int> g_gpio_chip_fds;
std::map<int, std::string> g_gpio_line_fds;
std::map<FILE *, std::string> g_written_files;
FILE *g_lt_fp;
const unsigned kGpioOffset = 3;

}  // namespace

// ---- media stubs (libkvm_mmf and kvm_capture.cpp) --------------------------------

KvmCamera *KvmCamera::create(int width, int height)
{
	if (g_media.cam_fail) {
		trace("cam create %dx%d fail", width, height);
		g_media.mmf_init = true;
		return nullptr;
	}
	vi_start();
	trace("cam create %dx%d in=%ux%u", width, height, g_media.in_w, g_media.in_h);
	g_media.mmf_init = true;
	g_media.cam_open = true;
	g_media.cam_w = width;
	g_media.cam_h = height;
	return new KvmCamera();
}

KvmCamera::~KvmCamera() {}

void KvmCamera::restart(int width, int height)
{
	vi_start();
	trace("cam restart %dx%d in=%ux%u", width, height, g_media.in_w, g_media.in_h);
	g_media.cam_open = true;
	g_media.cam_w = width;
	g_media.cam_h = height;
	if (g_media.restart_ms) sim_sleep(g_media.restart_ms);
}

bool KvmCamera::set_resolution(int width, int height)
{
	trace("cam size %dx%d", width, height);
	g_media.cam_w = width;
	g_media.cam_h = height;
	return true;
}

void KvmCamera::mirror_and_flip() { trace("cam mirror_flip"); }

bool KvmCamera::read(KvmFrame *frame)
{
	*frame = KvmFrame();
	if (!g_media.cam_open || !frames_flow()) {
		sim_sleep(1000);  // CVI_VPSS_GetChnFrame timeout
		return false;
	}
	sim_sleep(g_media.frame_ms);
	size_t size = (size_t)g_media.cam_w * g_media.cam_h * 3 / 2;
	g_media.fb.assign(size, g_media.frame_id);
	frame->data = g_media.fb.data();
	frame->size = size;
	frame->width = g_media.cam_w;
	frame->height = g_media.cam_h;
	return true;
}

void KvmCamera::close()
{
	trace("cam close");
	g_media.cam_open = false;
}

void kvm_frame_release(KvmFrame *frame) { *frame = KvmFrame(); }

const uint8_t *kvm_frame_pixels(const KvmFrame &frame) { return frame.data; }

int kvm_nv21_format() { return 21; }

bool kvm_encode_jpeg(const KvmFrame &frame, int quality, uint8_t *(*alloc)(void *, uint32_t), void *ctx,
	uint8_t **out, size_t *out_size)
{
	uint32_t size = 1000 + (uint32_t)quality;
	*out = alloc ? alloc(ctx, size) : nullptr;
	*out_size = *out ? size : 0;
	if (*out) memset(*out, 0xd8, size);
	char b[64];
	snprintf(b, sizeof(b), "jpeg %dx%d q%d", frame.width, frame.height, quality);
	g_media.last = b;
	return *out != nullptr;
}

bool mmf_is_init(void) { return g_media.mmf_init; }

int mmf_try_deinit(bool force)
{
	trace("mmf deinit%s", force ? " force" : "");
	g_media.mmf_init = false;
	return 0;
}

int mmf_add_venc_channel(int ch, mmf_venc_cfg_t *cfg)
{
	trace("venc add %d %dx%d gop=%d fps=%d/%d bitrate=%d%s", ch, cfg->w, cfg->h, cfg->gop, cfg->intput_fps,
		cfg->output_fps, cfg->bitrate, g_media.venc_fail == "add" ? " fail" : "");
	if (g_media.venc_fail == "add") return -1;
	g_media.idr_pending = true;
	return 0;
}

int mmf_del_venc_channel(int ch)
{
	trace("venc del %d", ch);
	return 0;
}

int mmf_venc_push(int ch, uint8_t *, int w, int h, int)
{
	(void)ch;
	char b[64];
	snprintf(b, sizeof(b), "h264 %dx%d", w, h);
	g_media.last = b;
	return g_media.venc_fail == "push" ? -1 : 0;
}

int mmf_venc_pop(int, mmf_stream_t *stream)
{
	static uint8_t data[8000];
	memset(stream, 0, sizeof(*stream));
	if (g_media.venc_fail == "pop") return -1;
	if (g_media.idr_pending) {
		g_media.idr_pending = false;
		stream->count = 3;
		int sizes[3] = {12, 5, 6000};
		for (int i = 0; i < 3; i++) { stream->data[i] = data; stream->data_size[i] = sizes[i]; }
		g_media.last += " I";
	} else {
		stream->count = 1;
		stream->data[0] = data;
		stream->data_size[0] = 700;
		g_media.last += " P";
	}
	return 0;
}

int mmf_venc_free(int) { return 0; }

int mmf_venc_request_idr(int ch)
{
	trace("venc idr %d", ch);
	g_media.idr_pending = true;
	return 0;
}

// ---- wrapped libc --------------------------------------------------------------

extern "C" {

int fake_open(const char *path, int flags, ...)
{
	mode_t mode = 0;
	if (flags & O_CREAT) {
		va_list ap;
		va_start(ap, flags);
		mode = (mode_t)va_arg(ap, int);
		va_end(ap);
	}
	int n;
	if (sscanf(path, "/dev/i2c-%d", &n) == 1) {
		if (n != 4) { errno = ENOENT; return -1; }
		int fd = open("/dev/null", O_RDWR | O_CLOEXEC);
		i2c_fds()[fd] = -1;
		return fd;
	}
	if (sscanf(path, "/dev/gpiochip%d", &n) == 1) {
		if (n != 0) { errno = ENOENT; return -1; }
		int fd = open("/dev/null", O_RDWR | O_CLOEXEC);
		g_gpio_chip_fds[fd] = n;
		return fd;
	}
	std::string host = host_path(path);
	if (flags & O_CREAT) make_parents(host);
	return open(host.c_str(), flags, mode);
}

int fake_close(int fd)
{
	i2c_fds().erase(fd);
	g_gpio_chip_fds.erase(fd);
	g_gpio_line_fds.erase(fd);
	return close(fd);
}

ssize_t fake_write(int fd, const void *buf, size_t len)
{
	auto it = i2c_fds().find(fd);
	if (it == i2c_fds().end()) return write(fd, buf, len);
	const uint8_t *b = (const uint8_t *)buf;
	bool nack = g_i2c_nack || it->second != 0x2b;
	trace("i2c %02x w%s%s", it->second, nack ? " NACK" : "", hex(b, len).c_str());
	if (nack) { errno = EREMOTEIO; return -1; }
	if (len >= 2 && b[0] == 0xff) {
		g_bank = b[1];
	} else if (len == 1) {
		g_ptr = b[0];
	} else {
		for (size_t i = 1; i < len; i++) g_regs[g_bank][(b[0] + i - 1) & 0xff] = b[i];
	}
	return (ssize_t)len;
}

ssize_t fake_read(int fd, void *buf, size_t len)
{
	auto it = i2c_fds().find(fd);
	if (it == i2c_fds().end()) return read(fd, buf, len);
	bool nack = g_i2c_nack || it->second != 0x2b;
	if (nack) {
		trace("i2c %02x r NACK %zu", it->second, len);
		errno = EREMOTEIO;
		return -1;
	}
	uint8_t *b = (uint8_t *)buf;
	for (size_t i = 0; i < len; i++) b[i] = g_regs[g_bank][(g_ptr + i) & 0xff];
	g_ptr = (uint8_t)(g_ptr + len);
	trace("i2c %02x r%s", it->second, hex(b, len).c_str());
	return (ssize_t)len;
}

int fake_ioctl(int fd, unsigned long req, ...)
{
	va_list ap;
	va_start(ap, req);
	void *arg = va_arg(ap, void *);
	va_end(ap);
	if (i2c_fds().count(fd)) {
		if (req != I2C_SLAVE) { errno = EINVAL; return -1; }
		i2c_fds()[fd] = (int)(uintptr_t)arg;
		return 0;
	}
	if (g_gpio_chip_fds.count(fd)) {
		if (req == GPIO_GET_CHIPINFO_IOCTL) {
			struct gpiochip_info *info = (struct gpiochip_info *)arg;
			memset(info, 0, sizeof(*info));
			snprintf(info->name, sizeof(info->name), "gpiochip0");
			info->lines = 8;
			return 0;
		}
		if (req == GPIO_V2_GET_LINEINFO_IOCTL) {
			struct gpio_v2_line_info *line = (struct gpio_v2_line_info *)arg;
			if (line->offset >= 8) { errno = EINVAL; return -1; }
			memset(line->name, 0, sizeof(line->name));
			if (g_gpio_line && line->offset == kGpioOffset) snprintf(line->name, sizeof(line->name), "hdmi-reset");
			return 0;
		}
		if (req == GPIO_V2_GET_LINE_IOCTL) {
			struct gpio_v2_line_request *r = (struct gpio_v2_line_request *)arg;
			bool out = r->config.flags & GPIO_V2_LINE_FLAG_OUTPUT;
			unsigned value = r->config.num_attrs ? (unsigned)(r->config.attrs[0].attr.values & 1) : 0;
			trace("gpio claim offset=%u lines=%u out=%d value=%u consumer=%s", r->offsets[0], r->num_lines, out,
				value, r->consumer);
			r->fd = open("/dev/null", O_RDWR | O_CLOEXEC);
			g_gpio_line_fds[r->fd] = r->offsets[0] == kGpioOffset ? "hdmi-reset" : "?";
			return 0;
		}
		errno = EINVAL;
		return -1;
	}
	if (g_gpio_line_fds.count(fd)) {
		if (req != GPIO_V2_LINE_SET_VALUES_IOCTL) { errno = EINVAL; return -1; }
		struct gpio_v2_line_values *v = (struct gpio_v2_line_values *)arg;
		trace("gpio %s %u", g_gpio_line_fds[fd].c_str(), (unsigned)(v->bits & v->mask & 1));
		return 0;
	}
	return ioctl(fd, req, arg);
}

FILE *fake_fopen(const char *path, const char *mode)
{
	if (strcmp(path, "/proc/cvitek/vi_dbg") == 0 && access(host_path(path).c_str(), F_OK) == 0) {
		sim_sleep(g_vidbg_ms);
		if (g_media.vidbg_auto) write_vidbg_auto();  // as of the end of the blocking read
	}
	if (strcmp(path, "/proc/lt_int") == 0) write_lt_file();
	FILE *fp = fopen(host_path(path).c_str(), mode);
	if (!fp) return fp;
	if (strcmp(path, "/proc/lt_int") == 0) g_lt_fp = fp;
	else if (strchr(mode, 'w') || strchr(mode, 'a') || strchr(mode, '+')) g_written_files[fp] = path;
	return fp;
}

static void lt_written(const std::string &s)
{
	g_lt_count = atoi(s.c_str());
	trace("write /proc/lt_int %s", quote(s).c_str());
}

int fake_fputs(const char *s, FILE *fp)
{
	if (fp != g_lt_fp) return fputs(s, fp);
	lt_written(s);
	return 1;
}

// GCC turns fputs of short literals into fputc or fwrite.
int fake_fputc(int c, FILE *fp)
{
	if (fp != g_lt_fp) return fputc(c, fp);
	lt_written(std::string(1, (char)c));
	return c;
}

size_t fake_fwrite(const void *p, size_t size, size_t n, FILE *fp)
{
	if (fp != g_lt_fp) return fwrite(p, size, n, fp);
	lt_written(std::string((const char *)p, size * n));
	return n;
}

int fake_fclose(FILE *fp)
{
	if (fp == g_lt_fp) g_lt_fp = nullptr;
	auto it = g_written_files.find(fp);
	if (it == g_written_files.end()) return fclose(fp);
	std::string path = it->second;
	g_written_files.erase(it);
	int r = fclose(fp);
	trace("write %s %s", path.c_str(), quote(read_host(host_path(path.c_str()))).c_str());
	return r;
}

int fake_access(const char *path, int mode)
{
	if (strcmp(path, "/proc/lt_int") == 0) write_lt_file();
	return access(host_path(path).c_str(), mode);
}

int fake_mkstemp(char *tmpl)
{
	std::string host = host_path(tmpl);
	make_parents(host);
	std::vector<char> buf(host.begin(), host.end());
	buf.push_back('\0');
	int fd = mkstemp(buf.data());
	if (fd >= 0) memcpy(tmpl + strlen(tmpl) - 6, buf.data() + host.size() - 6, 6);
	return fd;
}

int fake_rename(const char *from, const char *to)
{
	int r = rename(host_path(from).c_str(), host_path(to).c_str());
	if (r == 0) trace("write %s %s", to, quote(read_host(host_path(to))).c_str());
	return r;
}

int fake_unlink(const char *path) { return unlink(host_path(path).c_str()); }

int fake_munmap(void *addr, size_t len)
{
	if (len == 40) {
		const uint32_t *w = (const uint32_t *)addr;
		trace("vi_state seq=%u dev_fps=%u fps=%u width_gt=%u width_ls=%u height_gt=%u height_ls=%u", w[0], w[4],
			w[5], w[6], w[7], w[8], w[9]);
	}
	return munmap(addr, len);
}

int fake_system(const char *cmd)
{
	char value[64], path[256];
	if (sscanf(cmd, "echo %63s > %255s", value, path) == 2) {
		std::string content = std::string(value) + "\n";
		if (strcmp(path, "/proc/lt_int") == 0) {
			g_lt_count = atoi(value);
			write_lt_file();
		} else {
			put_file(path, content);
		}
		trace("write %s %s", path, quote(content).c_str());
		return 0;
	}
	trace("run %s", cmd);
	if (strcmp(cmd, "/kvmapp/system/init.d/S15kvmhwd get_hdmi_version") == 0)
		put_file("/etc/kvm/hdmi_version", g_chip + "\n");
	return 0;
}

FILE *fake_popen(const char *cmd, const char *)
{
	if (!strstr(cmd, "/proc/cvitek/sys_mem")) { fprintf(stderr, "harness: unknown popen: %s\n", cmd); exit(3); }
	trace("run carveout usage%s", g_carveout.empty() ? "" : (" -> " + g_carveout.substr(0, g_carveout.size() - 1)).c_str());
	if (g_carveout.empty()) return fopen("/dev/null", "r");
	std::string *out = new std::string(g_carveout);  // fmemopen needs it until pclose
	return fmemopen((void *)out->data(), out->size(), "r");
}

int fake_pclose(FILE *fp) { return fclose(fp); }

int fake_clock_gettime(clockid_t clk, struct timespec *ts)
{
	uint64_t ms;
	if (clk == CLOCK_MONOTONIC) ms = g_base + g_now;
	else if (clk == CLOCK_REALTIME) ms = g_rt_base + g_now;
	else return clock_gettime(clk, ts);
	ts->tv_sec = (time_t)(ms / 1000);
	ts->tv_nsec = (long)(ms % 1000) * 1000000;
	return 0;
}

int fake_nanosleep(const struct timespec *req, struct timespec *)
{
	sim_sleep((uint64_t)req->tv_sec * 1000 + (uint64_t)req->tv_nsec / 1000000);
	return 0;
}

int fake_pthread_create(pthread_t *th, const pthread_attr_t *attr, void *(*fn)(void *), void *arg)
{
	Sim *sim = new Sim();
	std::lock_guard<std::mutex> lk(g_m);
	sim->seq = ++g_seq;
	g_sims.push_back(sim);
	int r = pthread_create(th, attr, trampoline, new Start{fn, arg, sim});
	if (r == 0) g_threads[*th] = sim;
	return r;
}

int fake_pthread_timedjoin_np(pthread_t th, void **ret, const struct timespec *abs)
{
	Sim *sim = g_threads[th];
	uint64_t deadline = deadline_ms(abs);
	while (sim->st != DONE && g_now < deadline) sim_sleep(1);
	if (sim->st != DONE) return ETIMEDOUT;
	return pthread_join(th, ret);
}

int fake_pthread_mutex_init(pthread_mutex_t *, const pthread_mutexattr_t *) { return 0; }

int fake_pthread_mutex_destroy(pthread_mutex_t *m)
{
	std::lock_guard<std::mutex> lk(g_m);
	return g_owners[m] ? EBUSY : 0;
}

static int lock_impl(pthread_mutex_t *m, const struct timespec *abs)
{
	std::unique_lock<std::mutex> lk(g_m);
	Sim *self = t_self;
	while (g_owners[m] != nullptr && g_owners[m] != self) {
		self->st = MUTEX_WAIT;
		self->waiting = m;
		self->timed = abs != nullptr;
		self->timed_out = false;
		if (abs) self->wake = deadline_ms(abs);
		self->seq = ++g_seq;
		hand_off(lk, self, true);
		self->timed = false;
		if (self->timed_out && g_owners[m] != nullptr && g_owners[m] != self) {
			self->waiting = nullptr;
			return ETIMEDOUT;
		}
	}
	self->waiting = nullptr;
	g_owners[m] = self;
	return 0;
}

int fake_pthread_mutex_lock(pthread_mutex_t *m) { return lock_impl(m, nullptr); }

int fake_pthread_mutex_timedlock(pthread_mutex_t *m, const struct timespec *abs) { return lock_impl(m, abs); }

int fake_pthread_mutex_unlock(pthread_mutex_t *m)
{
	std::lock_guard<std::mutex> lk(g_m);
	g_owners[m] = nullptr;
	for (Sim *s : g_sims)
		if (s->st == MUTEX_WAIT && s->waiting == m) s->st = RUNNABLE;
	return 0;
}

}  // extern "C"

// ---- API calls, as server-rust/src/ffi/kvm.rs makes them -------------------------

namespace {

struct Out {
	uint8_t *data = nullptr;
	uint32_t size = 0;
};

uint8_t *alloc_frame(void *ctx, uint32_t size)
{
	Out *o = (Out *)ctx;
	free(o->data);
	o->data = (uint8_t *)malloc(size);
	o->size = size;
	return o->data;
}

void call_read(const std::string &label, uint16_t w, uint16_t h, uint8_t type, uint16_t q)
{
	Out o;
	uint32_t len = 0;
	g_media.last.clear();
	int r = kvmv_read_img_alloc(w, h, type, q, alloc_frame, &o, &len);
	if (len) trace("call %s -> %d %s size=%u", label.c_str(), r, g_media.last.c_str(), len);
	else trace("call %s -> %d", label.c_str(), r);
	free(o.data);
}

void do_call(const std::string &text)
{
	std::istringstream in(text);
	std::string name;
	in >> name;
	if (name == "init") {
		trace("call init");
		kvmv_init(0);
		kvmv_hdmi_control(0);
		sim_sleep(10);
		if (access(host_path("/etc/kvm/hdmi_disable").c_str(), F_OK) != 0) kvmv_hdmi_control(1);
	} else if (name == "hdmi") {
		int en;
		in >> en;
		trace("call hdmi %d", en);
		uint8_t r = kvmv_hdmi_control((uint8_t)en);
		trace("call hdmi %d -> %u", en, r);
	} else if (name == "mjpeg") {
		unsigned w, h, q;
		in >> w >> h >> q;
		call_read(text, (uint16_t)w, (uint16_t)h, 0, (uint16_t)q);
	} else if (name == "h264") {
		unsigned w, h, fps, rate;
		in >> w >> h >> fps >> rate;
		kvmv_set_h264_fps((uint8_t)fps);
		call_read(text, (uint16_t)w, (uint16_t)h, 1, (uint16_t)rate);
	} else if (name == "detect") {
		unsigned n;
		in >> n;
		trace("call detect %u", n);
		set_frame_detact((uint8_t)n);
	} else if (name == "idr") {
		trace("call idr");
		kvmv_request_keyframe();
	} else if (name == "signal") {
		trace("call signal -> %u", kvmv_hdmi_signal_active());
	} else if (name == "deinit") {
		trace("call deinit");
		kvmv_deinit();
		trace("call deinit done");
	} else {
		fprintf(stderr, "unknown call: %s\n", text.c_str());
		exit(2);
	}
}

// "NAME ARGS [every MS until T]"
void run_call(const Line &c)
{
	std::string text = c.text;
	uint64_t every = 0, until = 0;
	size_t pos = text.find(" every ");
	if (pos != std::string::npos) {
		sscanf(text.c_str() + pos, " every %llu until %llu", (unsigned long long *)&every, (unsigned long long *)&until);
		text = text.substr(0, pos);
	}
	if (c.t > g_now) sim_sleep(c.t - g_now);
	if (!every) {
		do_call(text);
		return;
	}
	for (uint64_t next = c.t; next < until; next += every) {
		if (next > g_now) sim_sleep(next - g_now);
		if (g_now >= until) break;
		do_call(text);
	}
}

}  // namespace

int main(int argc, char **argv)
{
	if (argc != 3) {
		fprintf(stderr, "usage: %s SCENARIO TRACE\n", argv[0]);
		return 2;
	}
	char tmpl[] = "/tmp/libkvm_root.XXXXXX";
	if (!mkdtemp(tmpl)) { perror("mkdtemp"); return 2; }
	g_root = tmpl;
	g_trace = fopen(argv[2], "w");
	if (!g_trace) { perror(argv[2]); return 2; }
	setvbuf(stdout, nullptr, _IONBF, 0);

	Sim main_sim;
	t_self = &main_sim;
	g_sims.push_back(&main_sim);

	for (const char *dir : {"/tmp/", "/etc/kvm/", "/kvmapp/kvm/", "/dev/shm/", "/proc/cvitek/"})
		make_parents(host_path(dir));
	load_scenario(argv[1]);
	write_lt_file();
	apply_due(0);
	for (const Line &c : g_calls) run_call(c);
	if (g_end > g_now) sim_sleep(g_end - g_now);
	trace("end");
	flush_pending();
	fclose(g_trace);
	std::string cmd = "rm -rf " + g_root;
	// _exit: the library's threads may still be parked in the scheduler.
	_exit(system(cmd.c_str()) == 0 ? 0 : 2);
}
