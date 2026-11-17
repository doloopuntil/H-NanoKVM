// Differential-test harness for kvm_system: in the unmodified objects every libc call that
// touches hardware, files, time or threads is renamed to fake_* (objcopy --redefine-sym).
// Virtual time; one simulated thread runs at a time (ties go to whoever slept first).
#include <arpa/inet.h>
#include <errno.h>
#include <fcntl.h>
#include <ifaddrs.h>
#include <linux/i2c-dev.h>
#include <linux/input.h>
#include <net/if.h>
#include <poll.h>
#include <pthread.h>
#include <signal.h>
#include <stdarg.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/ioctl.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

#include <algorithm>
#include <condition_variable>
#include <deque>
#include <fstream>
#include <map>
#include <mutex>
#include <set>
#include <sstream>
#include <string>
#include <vector>

extern "C" int kvm_system_main(int, char **);

namespace {

// ---- trace -------------------------------------------------------------------

FILE *g_trace;
std::string g_root;
uint64_t g_now;	  // virtual ms since start
uint64_t g_base;  // CLOCK_MONOTONIC at start

struct I2cRun {
	bool open = false;
	uint64_t t = 0;
	int bus = 0, addr = 0;
	bool nack = false;
	uint8_t mode = 0;
	std::vector<uint8_t> bytes;
} g_run;

void flush_run()
{
	if (!g_run.open) return;
	fprintf(g_trace, "@%llu i2c %d:%02x %s%c", (unsigned long long)g_run.t, g_run.bus, g_run.addr,
		g_run.nack ? "NACK " : "", g_run.mode == 0x00 ? 'C' : g_run.mode == 0x40 ? 'D' : '?');
	const std::vector<uint8_t> &b = g_run.bytes;
	for (size_t i = 0; i < b.size();) {
		size_t j = i;
		while (j < b.size() && b[j] == b[i]) j++;
		if (j - i >= 4) {
			fprintf(g_trace, " %02x*%zu", b[i], j - i);
			i = j;
		} else {
			fprintf(g_trace, " %02x", b[i]);
			i++;
		}
	}
	fputc('\n', g_trace);
	g_run = I2cRun();
}

void trace(const char *fmt, ...)
{
	flush_run();
	va_list ap;
	va_start(ap, fmt);
	fprintf(g_trace, "@%llu ", (unsigned long long)g_now);
	vfprintf(g_trace, fmt, ap);
	fputc('\n', g_trace);
	va_end(ap);
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

void i2c_record(int bus, int addr, bool nack, const uint8_t *data, size_t len)
{
	if (len != 2) {
		flush_run();
		std::string hex;
		for (size_t i = 0; i < len; i++) { char h[4]; snprintf(h, sizeof(h), " %02x", data[i]); hex += h; }
		trace("i2c %d:%02x %sraw%s", bus, addr, nack ? "NACK " : "", hex.c_str());
		return;
	}
	if (!g_run.open || g_run.t != g_now || g_run.bus != bus || g_run.addr != addr || g_run.nack != nack ||
		g_run.mode != data[0]) {
		flush_run();
		g_run.open = true;
		g_run.t = g_now;
		g_run.bus = bus;
		g_run.addr = addr;
		g_run.nack = nack;
		g_run.mode = data[0];
	}
	g_run.bytes.push_back(data[1]);
}

// ---- scenario model ------------------------------------------------------------

struct Iface {
	bool up = false, running = false;
	std::string ip;
	std::string gateway;
};

std::map<std::string, Iface> g_ifaces;
std::set<std::pair<int, int>> g_i2c_ack;  // bus, addr
bool g_input = false;
bool g_sta = false;
std::string g_wpa_state = "SCANNING";
bool g_random_fail = false;
uint32_t g_rng = 0x2545F491;
bool g_vi_publish = false;
uint32_t g_vi_fps = 0;
void (*g_term_handler)(int) = nullptr;

struct Action {
	uint64_t t;
	std::string line;
};
std::deque<Action> g_actions;
std::deque<std::pair<uint64_t, int>> g_keys;  // time, value (1 down, 0 up)
uint64_t g_end = 0;

std::string host_path(const char *path)
{
	if (path == nullptr || path[0] != '/') return path ? path : "";
	return g_root + path;
}

void make_parents(const std::string &host)
{
	for (size_t i = g_root.size() + 1; i < host.size(); i++) {
		if (host[i] == '/') {
			std::string dir = host.substr(0, i);
			mkdir(dir.c_str(), 0755);
		}
	}
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

void write_route_file()
{
	std::string s = "Iface\tDestination\tGateway \tFlags\tRefCnt\tUse\tMetric\tMask\t\tMTU\tWindow\tIRTT\n";
	for (auto &it : g_ifaces) {
		if (it.second.gateway.empty()) continue;
		struct in_addr gw;
		inet_pton(AF_INET, it.second.gateway.c_str(), &gw);
		char line[160];
		snprintf(line, sizeof(line), "%s\t00000000\t%08X\t0003\t0\t0\t0\t00000000\t0\t0\t0\n",
			it.first.c_str(), gw.s_addr);
		s += line;
	}
	put_file("/proc/net/route", s);
}

struct ViShared {
	uint32_t sequence, magic, version, updated_ms;
	uint32_t dev_fps, fps, width_gt, width_ls, height_gt, height_ls;
};

void publish_vi()
{
	if (!g_vi_publish) return;
	ViShared s = {};
	s.sequence = 2;
	s.magic = 0x4e4b5649U;
	s.version = 1;
	s.updated_ms = (uint32_t)(g_base + g_now);
	s.dev_fps = g_vi_fps;
	s.fps = g_vi_fps;
	std::string host = host_path("/dev/shm/nanokvm_vi_state");
	make_parents(host);
	int fd = open(host.c_str(), O_WRONLY | O_CREAT, 0600);
	if (fd < 0) return;
	ssize_t n = write(fd, &s, sizeof(s));
	(void)n;
	close(fd);
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
	} else if (op == "iface") {
		std::string name, state, ip;
		in >> name >> state >> ip;
		if (state == "absent") {
			g_ifaces.erase(name);
		} else {
			Iface &f = g_ifaces[name];
			f.up = state == "up" || state == "running";
			f.running = state == "running";
			f.ip = ip == "-" ? "" : ip;
		}
		write_route_file();
	} else if (op == "route") {
		std::string name, gw;
		in >> name >> gw;
		g_ifaces[name].gateway = gw == "-" ? "" : gw;
		write_route_file();
	} else if (op == "vi") {
		std::string v;
		in >> v;
		if (v == "off") {
			g_vi_publish = false;
			unlink(host_path("/dev/shm/nanokvm_vi_state").c_str());
		} else if (v == "freeze") {
			g_vi_publish = false;
		} else {
			g_vi_publish = true;
			g_vi_fps = (uint32_t)strtoul(v.c_str(), nullptr, 10);
			publish_vi();
		}
	} else if (op == "sta") {
		std::string v;
		in >> v;
		g_sta = v == "on";
	} else if (op == "wpa") {
		in >> g_wpa_state;
	} else if (op == "random") {
		std::string v;
		in >> v;
		g_random_fail = v == "fail";
	} else if (op == "key") {
		// "key press MS" is expanded when the scenario is loaded.
	} else if (op == "end") {
		if (g_term_handler) g_term_handler(SIGTERM);
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
		} else if (op == "i2c") {
			std::string bus, addr;
			ls >> bus >> addr;
			g_i2c_ack.insert({(int)strtol(bus.c_str(), nullptr, 0), (int)strtol(addr.c_str(), nullptr, 0)});
		} else if (op == "input") {
			g_input = true;
		} else if (op == "clock") {
			ls >> g_base;
		} else if (op == "key") {
			std::string what;
			uint64_t ms = 0;
			ls >> what >> ms;
			g_actions.push_back({t, line});
			if (what == "press") {
				g_keys.push_back({t, 1});
				g_keys.push_back({t + ms, 0});
			} else {
				g_keys.push_back({t, what == "down" ? 1 : 0});
			}
		} else {
			if (op == "end") g_end = t;
			g_actions.push_back({t, line});
		}
	}
	std::stable_sort(g_actions.begin(), g_actions.end(),
		[](const Action &a, const Action &b) { return a.t < b.t; });
	std::stable_sort(g_keys.begin(), g_keys.end(),
		[](const std::pair<uint64_t, int> &a, const std::pair<uint64_t, int> &b) { return a.first < b.first; });
	if (g_end == 0) { fprintf(stderr, "scenario has no end\n"); exit(2); }
}

void apply_due(uint64_t until)
{
	while (!g_actions.empty() && g_actions.front().t <= until) {
		Action a = g_actions.front();
		g_actions.pop_front();
		if (a.t > g_now) g_now = a.t;
		publish_vi();
		apply(a.line);
	}
}

// ---- scheduler -----------------------------------------------------------------

enum State { RUNNABLE, SLEEPING, MUTEX_WAIT, DONE, OUTSIDE };

struct Sim {
	State st = RUNNABLE;
	uint64_t wake = 0;
	uint64_t seq = 0;
	bool go = false;
	pthread_mutex_t *waiting = nullptr;
};

std::mutex g_m;
std::condition_variable g_cv;
std::vector<Sim *> g_sims;
Sim *g_current;
uint64_t g_seq;
thread_local Sim *t_self;
std::map<pthread_mutex_t *, Sim *> g_owners;

// Picks the next thread to run and advances virtual time; nullptr when none can run.
Sim *pick_next()
{
	for (;;) {
		Sim *best = nullptr;
		for (Sim *s : g_sims)
			if (s->st == RUNNABLE && (!best || s->seq < best->seq)) best = s;
		if (best) return best;
		for (Sim *s : g_sims)
			if (s->st == SLEEPING && (!best || s->wake < best->wake || (s->wake == best->wake && s->seq < best->seq)))
				best = s;
		if (!best) {
			for (Sim *s : g_sims)
				if (s->st == MUTEX_WAIT) { fprintf(stderr, "harness: deadlock\n"); exit(3); }
			return nullptr;
		}
		if (!g_actions.empty() && g_actions.front().t <= best->wake) {
			apply_due(g_actions.front().t);
			continue;  // an action may wake nobody, but keeps time ordered
		}
		if (best->wake > g_now) g_now = best->wake;
		publish_vi();
		best->st = RUNNABLE;
		return best;
	}
}

// Hands the baton on; with wait, blocks until it comes back.
void hand_off(std::unique_lock<std::mutex> &lk, Sim *self, bool wait)
{
	Sim *next = pick_next();
	if (next == self) return;
	g_current = next;
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

// ---- fds -----------------------------------------------------------------------

// Used by static constructors (I2cBus) before main.
std::map<int, int> &i2c_bus_map() { static std::map<int, int> m; return m; }  // fd -> bus
std::map<int, int> &i2c_addr_map() { static std::map<int, int> m; return m; }  // fd -> addr
#define g_i2c_bus i2c_bus_map()
#define g_i2c_addr i2c_addr_map()
int g_event_fd = -1;
std::map<int, std::string> g_written_fds;  // fd -> path, created or written
std::map<int, bool> g_fd_has_writes;
std::map<FILE *, std::string> g_written_files;

bool due_key() { return !g_keys.empty() && g_keys.front().first <= g_now; }

const char *canonical_command(const char *cmd)
{
	if (strcmp(cmd, "hostapd_cli all sta | grep aid") == 0) return "hostapd_cli all sta";
	if (strcmp(cmd, "wpa_cli -i wlan0 status | grep \"wpa_state\"") == 0) return "wpa_cli -i wlan0 status";
	return nullptr;
}

std::string command_output(const std::string &argv)
{
	if (argv == "hostapd_cli all sta")
		return g_sta ? "02:11:22:33:44:55\nflags=[AUTH][ASSOC][AUTHORIZED]\naid=1\ncapability=0x431\n" : "";
	if (argv == "wpa_cli -i wlan0 status")
		return "bssid=00:00:00:00:00:00\nwpa_state=" + g_wpa_state + "\naddress=02:00:00:00:00:01\n";
	return "";
}

std::string grep_lines(const std::string &text, const std::string &needle)
{
	std::string out;
	std::istringstream in(text);
	std::string line;
	while (std::getline(in, line))
		if (line.find(needle) != std::string::npos) out += line + "\n";
	return out;
}

}  // namespace

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
	int bus;
	if (sscanf(path, "/dev/i2c-%d", &bus) == 1) {
		int fd = open("/dev/null", O_RDWR | O_CLOEXEC);
		g_i2c_bus[fd] = bus;
		return fd;
	}
	if (strcmp(path, "/dev/input/event0") == 0) {
		if (!g_input) { errno = ENOENT; return -1; }
		g_event_fd = open("/dev/null", O_RDONLY | O_CLOEXEC);
		return g_event_fd;
	}
	std::string host = host_path(path);
	bool existed = access(host.c_str(), F_OK) == 0;
	int fd = open(host.c_str(), flags, mode);
	if (fd >= 0 && (flags & (O_WRONLY | O_RDWR))) {
		g_written_fds[fd] = path;
		g_fd_has_writes[fd] = false;
		if ((flags & O_CREAT) && !existed) trace("create %s %04o", path, (unsigned)mode);
	}
	return fd;
}

FILE *fake_fopen(const char *path, const char *mode)
{
	std::string host = host_path(path);
	FILE *fp = fopen(host.c_str(), mode);
	if (fp && (strchr(mode, 'w') || strchr(mode, 'a') || strchr(mode, '+'))) g_written_files[fp] = path;
	return fp;
}

int fake_fclose(FILE *fp)
{
	auto it = g_written_files.find(fp);
	if (it == g_written_files.end()) return fclose(fp);
	std::string path = it->second;
	g_written_files.erase(it);
	int r = fclose(fp);
	trace("write %s %s", path.c_str(), quote(read_host(host_path(path.c_str()))).c_str());
	return r;
}

int fake_close(int fd)
{
	g_i2c_bus.erase(fd);
	g_i2c_addr.erase(fd);
	if (fd == g_event_fd) g_event_fd = -1;
	auto it = g_written_fds.find(fd);
	if (it == g_written_fds.end()) return close(fd);
	std::string path = it->second;
	bool wrote = g_fd_has_writes[fd];
	g_written_fds.erase(it);
	g_fd_has_writes.erase(fd);
	int r = close(fd);
	if (wrote) trace("write %s %s", path.c_str(), quote(read_host(host_path(path.c_str()))).c_str());
	return r;
}

int fake_access(const char *path, int mode) { return access(host_path(path).c_str(), mode); }

int fake_unlink(const char *path)
{
	int r = unlink(host_path(path).c_str());
	if (r == 0) trace("unlink %s", path);
	return r;
}

int fake_mkdir(const char *path, mode_t mode)
{
	int r = mkdir(host_path(path).c_str(), mode);
	if (r == 0) trace("mkdir %s %04o", path, (unsigned)mode);
	return r;
}

int fake_rename(const char *from, const char *to)
{
	int r = rename(host_path(from).c_str(), host_path(to).c_str());
	if (r == 0) trace("rename %s %s", from, to);
	return r;
}

int fake_fchmod(int fd, mode_t mode)
{
	auto it = g_written_fds.find(fd);
	if (it != g_written_fds.end()) trace("chmod %s %04o", it->second.c_str(), (unsigned)mode);
	return fchmod(fd, mode);
}

ssize_t fake_write(int fd, const void *buf, size_t len)
{
	auto it = g_i2c_bus.find(fd);
	if (it == g_i2c_bus.end()) {
		if (g_fd_has_writes.count(fd)) g_fd_has_writes[fd] = true;
		return write(fd, buf, len);
	}
	auto addr = g_i2c_addr.find(fd);
	if (addr == g_i2c_addr.end()) { errno = EINVAL; return -1; }
	bool bus_exists = false;
	for (auto &d : g_i2c_ack) bus_exists |= d.first == it->second;
	if (!bus_exists) { errno = ENXIO; return -1; }
	bool ack = g_i2c_ack.count({it->second, addr->second}) != 0;
	i2c_record(it->second, addr->second, !ack, (const uint8_t *)buf, len);
	if (!ack) { errno = EREMOTEIO; return -1; }
	return (ssize_t)len;
}

ssize_t fake_read(int fd, void *buf, size_t len)
{
	if (fd != g_event_fd || g_event_fd < 0) return read(fd, buf, len);
	if (!due_key() || len < sizeof(struct input_event)) { errno = EAGAIN; return -1; }
	struct input_event ev = {};
	ev.time.tv_sec = (time_t)(g_now / 1000);
	ev.time.tv_usec = (suseconds_t)((g_now % 1000) * 1000);
	ev.type = EV_KEY;
	ev.code = KEY_ENTER;
	ev.value = g_keys.front().second;
	g_keys.pop_front();
	memcpy(buf, &ev, sizeof(ev));
	return sizeof(ev);
}

int fake_poll(struct pollfd *fds, nfds_t n, int timeout)
{
	if (n != 1 || fds[0].fd != g_event_fd) { fprintf(stderr, "harness: unexpected poll\n"); exit(3); }
	fds[0].revents = 0;
	if (!due_key()) {
		uint64_t wait = (uint64_t)timeout;
		if (!g_keys.empty() && g_keys.front().first - g_now < wait) wait = g_keys.front().first - g_now;
		sim_sleep(wait);
	}
	if (!due_key()) return 0;
	fds[0].revents = POLLIN;
	return 1;
}

int fake_ioctl(int fd, unsigned long req, ...)
{
	va_list ap;
	va_start(ap, req);
	unsigned long arg = va_arg(ap, unsigned long);
	va_end(ap);
	if (g_i2c_bus.count(fd)) {
		if (req != I2C_SLAVE) { errno = EINVAL; return -1; }
		g_i2c_addr[fd] = (int)arg;
		return 0;
	}
	if (req == SIOCGIFFLAGS) {
		struct ifreq *ifr = (struct ifreq *)arg;
		auto it = g_ifaces.find(ifr->ifr_name);
		if (it == g_ifaces.end()) { errno = ENODEV; return -1; }
		ifr->ifr_flags = (short)((it->second.up ? IFF_UP : 0) | (it->second.running ? IFF_RUNNING : 0));
		return 0;
	}
	return ioctl(fd, req, arg);
}

int fake_getifaddrs(struct ifaddrs **out)
{
	struct Node {
		struct ifaddrs ifa;
		struct sockaddr_in addr;
		char name[IFNAMSIZ];
	};
	struct ifaddrs *head = nullptr, **tail = &head;
	for (auto &it : g_ifaces) {
		if (it.second.ip.empty()) continue;
		Node *n = (Node *)calloc(1, sizeof(Node));
		snprintf(n->name, sizeof(n->name), "%s", it.first.c_str());
		n->addr.sin_family = AF_INET;
		inet_pton(AF_INET, it.second.ip.c_str(), &n->addr.sin_addr);
		n->ifa.ifa_name = n->name;
		n->ifa.ifa_addr = (struct sockaddr *)&n->addr;
		*tail = &n->ifa;
		tail = &n->ifa.ifa_next;
	}
	*out = head;
	return 0;
}

void fake_freeifaddrs(struct ifaddrs *list)
{
	while (list) {
		struct ifaddrs *next = list->ifa_next;
		free(list);
		list = next;
	}
}

int fake_system(const char *cmd)
{
	trace("run %s", cmd);
	return 0;
}

FILE *fake_popen(const char *cmd, const char *)
{
	const char *argv = canonical_command(cmd);
	if (!argv) { fprintf(stderr, "harness: unknown popen: %s\n", cmd); exit(3); }
	trace("run %s", argv);
	std::string needle = strstr(argv, "hostapd_cli") ? "aid" : "wpa_state";
	std::string *out = new std::string(grep_lines(command_output(argv), needle));
	// Leaked on purpose: fmemopen needs the buffer until pclose.
	if (out->empty()) return fopen("/dev/null", "r");
	return fmemopen((void *)out->data(), out->size(), "r");
}

int fake_pclose(FILE *fp) { return fclose(fp); }

ssize_t fake_getrandom(void *buf, size_t len, unsigned)
{
	if (g_random_fail) { errno = ENOSYS; return -1; }
	uint8_t *p = (uint8_t *)buf;
	for (size_t i = 0; i < len; i++) {
		g_rng ^= g_rng << 13;
		g_rng ^= g_rng >> 17;
		g_rng ^= g_rng << 5;
		p[i] = (uint8_t)(g_rng >> 24);
	}
	return (ssize_t)len;
}

int fake_clock_gettime(clockid_t clk, struct timespec *ts)
{
	if (clk != CLOCK_MONOTONIC) return clock_gettime(clk, ts);
	uint64_t ms = g_base + g_now;
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
	{
		std::lock_guard<std::mutex> lk(g_m);
		sim->seq = ++g_seq;
		g_sims.push_back(sim);
	}
	return pthread_create(th, attr, trampoline, new Start{fn, arg, sim});
}

int fake_pthread_join(pthread_t th, void **ret)
{
	{
		std::unique_lock<std::mutex> lk(g_m);
		if (g_current == t_self) {
			t_self->st = OUTSIDE;
			hand_off(lk, t_self, false);
		}
	}
	return pthread_join(th, ret);
}

int fake_pthread_mutex_lock(pthread_mutex_t *m)
{
	std::unique_lock<std::mutex> lk(g_m);
	Sim *self = t_self;
	while (g_owners[m] != nullptr && g_owners[m] != self) {
		self->st = MUTEX_WAIT;
		self->waiting = m;
		self->seq = ++g_seq;
		hand_off(lk, self, true);
	}
	self->waiting = nullptr;
	g_owners[m] = self;
	return 0;
}

int fake_pthread_mutex_unlock(pthread_mutex_t *m)
{
	std::lock_guard<std::mutex> lk(g_m);
	g_owners[m] = nullptr;
	for (Sim *s : g_sims)
		if (s->st == MUTEX_WAIT && s->waiting == m) s->st = RUNNABLE;
	return 0;
}

sighandler_t fake_signal(int sig, sighandler_t handler)
{
	if (sig == SIGTERM) g_term_handler = handler;
	return SIG_DFL;
}

}  // extern "C"

int main(int argc, char **argv)
{
	if (argc != 3) {
		fprintf(stderr, "usage: %s SCENARIO TRACE\n", argv[0]);
		return 2;
	}
	char tmpl[] = "/tmp/kvm_system_root.XXXXXX";
	if (!mkdtemp(tmpl)) { perror("mkdtemp"); return 2; }
	g_root = tmpl;
	g_trace = fopen(argv[2], "w");
	if (!g_trace) { perror(argv[2]); return 2; }
	setvbuf(stdout, nullptr, _IONBF, 0);

	Sim main_sim;
	t_self = &main_sim;
	g_sims.push_back(&main_sim);
	g_current = &main_sim;

	load_scenario(argv[1]);
	write_route_file();
	apply_due(0);
	char name[] = "kvm_system";
	char *args[] = {name, nullptr};
	int r = kvm_system_main(1, args);
	flush_run();
	fprintf(g_trace, "@%llu exit %d\n", (unsigned long long)g_end, r);
	fclose(g_trace);
	std::string cmd = "rm -rf " + g_root;
	// _exit: the I2cBus destructors would run after the fake fd tables are gone.
	_exit(system(cmd.c_str()) == 0 ? 0 : 2);
}
