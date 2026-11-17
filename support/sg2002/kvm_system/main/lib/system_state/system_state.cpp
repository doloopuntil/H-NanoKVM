#include "config.h"
#include "system_state.h"
#include "vi_state_shared.hpp"
#include <sys/socket.h>
#include <net/if.h>
#include <sys/ioctl.h>
#include <ctype.h>
#include <time.h>
#include <string>
#include <arpa/inet.h>
#include <ifaddrs.h>
#include <netinet/in.h>
#include <net/route.h>


extern kvm_sys_state_t kvm_sys_state;
extern kvm_oled_state_t kvm_oled_state;

// The interface's IPv4 address (the last one listed), or "" if it has none.
static std::string interface_ipv4(const char *name)
{
	std::string addr;
	struct ifaddrs *list;
	if (getifaddrs(&list) != 0) return addr;
	for (struct ifaddrs *ifa = list; ifa != NULL; ifa = ifa->ifa_next) {
		if (ifa->ifa_addr == NULL || ifa->ifa_addr->sa_family != AF_INET) continue;
		if (strcmp(ifa->ifa_name, name) != 0) continue;
		char host[INET_ADDRSTRLEN];
		const struct sockaddr_in *sin = (const struct sockaddr_in *)ifa->ifa_addr;
		if (inet_ntop(AF_INET, &sin->sin_addr, host, sizeof(host)) != NULL) addr = host;
	}
	freeifaddrs(list);
	return addr;
}

static int read_text_file(const char *path, char *buf, size_t buf_len)
{
	FILE *fp;
	size_t size;

	if(buf_len == 0) return 0;
	fp = fopen(path, "r");
	if(fp == NULL) return 0;
	size = fread(buf, 1, buf_len - 1, fp);
	if(ferror(fp)){
		fclose(fp);
		return 0;
	}
	fclose(fp);
	buf[size] = 0;
	return size > 0;
}

static int stream_quality_bucket(unsigned long raw, int8_t stream_type)
{
	if(stream_type == KVM_TYPE_MJPG){
		if(raw < 60) return 1;
		if(raw < 75) return 2;
		if(raw < 90) return 3;
		return 4;
	}
	if(raw < 1500) return 1;
	if(raw < 2500) return 2;
	if(raw < 3500) return 3;
	return 4;
}

static void copy_state_string(uint8_t *dst, size_t dst_len, const char *src)
{
	if(dst_len == 0) return;
	memset(dst, 0, dst_len);
	if(src == NULL) return;
	strncpy((char*)dst, src, dst_len - 1);
}

static int copy_interface_ip(const char *interface_name, uint8_t *dst, size_t dst_len)
{
	std::string addr = interface_ipv4(interface_name);
	if(addr.empty()){
		copy_state_string(dst, dst_len, NULL);
		return 0;
	}
	if(strcmp(addr.c_str(), (char*)dst) != 0){
		copy_state_string(dst, dst_len, addr.c_str());
		printf("%s\r\n", (char*)dst);
	}
	return 1;
}

// The interface's default IPv4 gateway, from /proc/net/route.
static int read_default_gateway(const char *interface_name, uint8_t *dst, size_t dst_len)
{
	char line[256];
	int found = 0;

	copy_state_string(dst, dst_len, NULL);
	FILE *fp = fopen("/proc/net/route", "re");
	if(fp == NULL) return 0;
	if(fgets(line, sizeof(line), fp) == NULL){
		fclose(fp);
		return 0;
	}
	while(!found && fgets(line, sizeof(line), fp) != NULL){
		char name[IFNAMSIZ + 1];
		unsigned long destination, gateway, flags;
		if(sscanf(line, "%16s %lx %lx %lx", name, &destination, &gateway, &flags) != 4) continue;
		if(strcmp(name, interface_name) != 0 || destination != 0 || !(flags & RTF_GATEWAY)) continue;
		struct in_addr addr;
		addr.s_addr = (in_addr_t)gateway;
		char text[INET_ADDRSTRLEN];
		if(inet_ntop(AF_INET, &addr, text, sizeof(text)) != NULL){
			copy_state_string(dst, dst_len, text);
			found = dst[0] != 0;
		}
	}
	fclose(fp);
	return found;
}

int get_nic_state(const char* interface_name)
{
	int sock;
	struct ifreq ifr;
	int ret = NIC_STATE_NO_EXIST;
	if ((sock = socket(AF_INET, SOCK_STREAM | SOCK_CLOEXEC, 0)) < 0) {
		return ret;
	}
	snprintf(ifr.ifr_name, sizeof(ifr.ifr_name), "%s", interface_name);
	if (ioctl(sock, SIOCGIFFLAGS, &ifr) < 0) {
		close(sock);
		return ret;
	}
	if (ifr.ifr_flags & IFF_UP) {
		if (ifr.ifr_flags & IFF_RUNNING) {
			ret = NIC_STATE_RUNNING;
		} else {
			ret = NIC_STATE_UP;
		}
	} else {
		ret = NIC_STATE_DOWN;
	}
	close(sock);
	return ret;
}

// net_port
int get_ip_addr(ip_addr_t ip_type)
{
	switch (ip_type){
		case NULL_IP:
			return 0;
		case ETH_IP: // eth_addr
			return copy_interface_ip("eth0", kvm_sys_state.eth_addr, sizeof(kvm_sys_state.eth_addr));
		case WiFi_IP: // wifi_addr
			return copy_interface_ip("wlan0", kvm_sys_state.wifi_addr, sizeof(kvm_sys_state.wifi_addr));
		case Tailscale_IP: // tail_addr
			return copy_interface_ip("tailscale0", kvm_sys_state.tail_addr, sizeof(kvm_sys_state.tail_addr));
		case RNDIS_IP: // rndis_addr
			return copy_interface_ip("usb0", kvm_sys_state.rndis_addr, sizeof(kvm_sys_state.rndis_addr));
		case ETH_ROUTE: // eth_route
			return read_default_gateway("eth0", kvm_sys_state.eth_route, sizeof(kvm_sys_state.eth_route));
		case WiFi_ROUTE: // wifi_route
			return read_default_gateway("wlan0", kvm_sys_state.wifi_route, sizeof(kvm_sys_state.wifi_route));
	}
	return 0;
}

int kvm_wifi_exist()
{
	if (get_nic_state("wlan0") == NIC_STATE_NO_EXIST) return 0;
	else return 1;
}

void kvm_update_usb_state()
{
	// usb_state, hid_state, rndis_state, udisk_state
	char RW_Data[10] = {0};
	if(!read_text_file("/sys/class/udc/4340000.usb/state", RW_Data, sizeof(RW_Data))){
		kvm_sys_state.usb_state = -1;
		kvm_sys_state.hid_state = 0;
		kvm_sys_state.udisk_state = 0;
		return;
	}
	if(RW_Data[0] == 'n') kvm_sys_state.usb_state = 0;
	else if(RW_Data[0] == 'c') kvm_sys_state.usb_state = 1;
	else kvm_sys_state.usb_state = -1;
	// hid_state & udisk_state (rndis_state单独处理)
	if(kvm_sys_state.usb_state == 1){
		kvm_sys_state.hid_state =
			(access("/sys/kernel/config/usb_gadget/g0/configs/c.1/hid.GS0", F_OK) == 0 ||
			 access("/sys/kernel/config/usb_gadget/g0/configs/c.1/hid.GS1", F_OK) == 0 ||
			 access("/sys/kernel/config/usb_gadget/g0/configs/c.1/hid.GS2", F_OK) == 0) ? 1 : 0;
		kvm_sys_state.udisk_state =
			access("/sys/kernel/config/usb_gadget/g0/configs/c.1/mass_storage.disk0", F_OK) == 0 ? 1 : 0;
	} else {
		kvm_sys_state.hid_state = 0;
		kvm_sys_state.udisk_state = 0;
	}
}

void kvm_update_hdmi_state()
{
	const uint32_t shared_state_ttl_ms = 30000U;
	const uint32_t fallback_state_ttl_ms = 10000U;
	static uint8_t check_times = 4;
	static vi_state_shared::State fallback_state = {};
	static uint32_t fallback_updated_ms = 0;
	static uint32_t fallback_attempted_ms = 0;
	static bool fallback_valid = false;
	static bool fallback_attempted = false;
	static bool shared_failure_logged = false;
	static bool fallback_failure_logged = false;
	if(++check_times > 5){
		check_times = 0;
		vi_state_shared::State state = {};
		vi_state_shared::ReadStatus status = vi_state_shared::read_state(&state, shared_state_ttl_ms);
		if (status == vi_state_shared::READ_OK) {
			kvm_sys_state.hdmi_state = state.fps == 0 ? 0 : 1;
			if (shared_failure_logged) {
				fprintf(stderr, "[kvm_system] VI shared state recovered\n");
			}
			shared_failure_logged = false;
			fallback_failure_logged = false;
			return;
		}

		if (!shared_failure_logged) {
			fprintf(stderr, "[kvm_system] VI shared state %s; using direct fallback\n",
				vi_state_shared::read_status_name(status));
			shared_failure_logged = true;
		}

		uint32_t now = vi_state_shared::monotonic_ms();
		if (!fallback_attempted || now - fallback_attempted_ms >= fallback_state_ttl_ms) {
			fallback_attempted_ms = now;
			fallback_attempted = true;
			uint32_t fields = vi_state_shared::FIELD_NONE;
			vi_state_shared::State direct_state = {};
			vi_state_shared::ProcReadStatus direct_status =
				vi_state_shared::read_proc_state(&direct_state, &fields);
			if (direct_status == vi_state_shared::PROC_READ_OK &&
				(fields & vi_state_shared::FIELD_FPS) != 0U) {
				fallback_state = direct_state;
				fallback_updated_ms = now;
				fallback_valid = true;
				if (fallback_failure_logged) {
					fprintf(stderr, "[kvm_system] direct VI fallback recovered\n");
				}
				fallback_failure_logged = false;
			} else {
				fallback_valid = false;
				if (!fallback_failure_logged) {
					fprintf(stderr, "[kvm_system] direct VI fallback unavailable\n");
					fallback_failure_logged = true;
				}
			}
		}

		if (fallback_valid && now - fallback_updated_ms <= fallback_state_ttl_ms) {
			kvm_sys_state.hdmi_state = fallback_state.fps == 0 ? 0 : 1;
		} else {
			kvm_sys_state.hdmi_state = -1;
		}
	}
}

void kvm_update_stream_fps(void)
{
	char RW_Data[10] = {0};

	// FPS
	if(read_text_file("/kvmapp/kvm/now_fps", RW_Data, sizeof(RW_Data))){
		kvm_sys_state.now_fps = atoi(RW_Data);
	}
}

void kvm_update_stream_type(void)
{
	char RW_Data[10] = {0};

	// type
	if(!read_text_file("/kvmapp/kvm/type", RW_Data, sizeof(RW_Data))) return;
	if(RW_Data[0] == 'm') 		kvm_sys_state.type = KVM_TYPE_MJPG;
	else if(RW_Data[0] == 'h') 	kvm_sys_state.type = KVM_TYPE_H264;
	else 						kvm_sys_state.type = KVM_TYPE_none;
}

void kvm_update_stream_qlty(void)
{
	char RW_Data[10] = {0};

	if(!read_text_file("/kvmapp/kvm/qlty", RW_Data, sizeof(RW_Data))) return;
	kvm_sys_state.qlty = stream_quality_bucket(strtoul(RW_Data, NULL, 10), kvm_sys_state.type);
}

void kvm_update_hdmi_res(void)
{
	char RW_Data[10] = {0};
	// HDMI width
	if(read_text_file("/kvmapp/kvm/width", RW_Data, sizeof(RW_Data))){
		kvm_sys_state.hdmi_width = atoi(RW_Data);
	}
	// HDMI height
	if(read_text_file("/kvmapp/kvm/height", RW_Data, sizeof(RW_Data))){
		kvm_sys_state.hdmi_height = atoi(RW_Data);
	}
}

// 0: down, 1: link without an address, 2: address, 3: address and a default route.
void kvm_update_eth_state(void)
{
	if(get_nic_state("eth0") != NIC_STATE_RUNNING){
		kvm_sys_state.eth_state = 0;
		return;
	}
	if(!get_ip_addr(ETH_IP)){
		copy_state_string(kvm_sys_state.eth_route, sizeof(kvm_sys_state.eth_route), NULL);
		kvm_sys_state.eth_state = 1;
		return;
	}
	kvm_sys_state.eth_state = get_ip_addr(ETH_ROUTE) ? 3 : 2;
}

static void set_marker(const char *path, int present)
{
	if(!present){
		unlink(path);
		return;
	}
	int fd = open(path, O_WRONLY | O_CREAT | O_CLOEXEC, 0644);
	if(fd >= 0) close(fd);
}

static void persist_wifi_state_if_changed(int8_t state)
{
	static int8_t persisted_state = INT8_MIN;
	if (persisted_state == state) return;

	FILE *fp = fopen("/kvmapp/kvm/wifi_state", "w");
	if (!fp) return;
	bool written = fprintf(fp, "%d\n", state) > 0;
	if (fclose(fp) == 0 && written) persisted_state = state;
}

// -2: no Wi-Fi module, 0: not connected, 1: address and a default route.
void kvm_update_wifi_state(void)
{
	if(kvm_sys_state.wifi_state == -2) return;
	if(kvm_sys_state.wifi_state == -1){
		int exists = kvm_wifi_exist();
		set_marker("/etc/kvm/wifi_exist", exists);
		if(!exists){
			kvm_sys_state.wifi_state = -2;
			return;
		}
	}
	int connected = get_ip_addr(WiFi_IP) && get_ip_addr(WiFi_ROUTE);
	kvm_sys_state.wifi_state = connected ? 1 : 0;
	persist_wifi_state_if_changed(kvm_sys_state.wifi_state);
}

void kvm_update_rndis_state(void)
{
	if (get_nic_state("usb0") == NIC_STATE_RUNNING) {
		if(kvm_sys_state.rndis_state != 1) {
			if (get_ip_addr(RNDIS_IP)) {
				kvm_sys_state.rndis_state = 1;
			}
		}
	}
	else kvm_sys_state.rndis_state = 0;
}

void kvm_update_tailscale_state(void)
{
	if (get_nic_state("tailscale0") == NIC_STATE_RUNNING) {
		if(kvm_sys_state.tail_state != 1){
			if (get_ip_addr(Tailscale_IP)) {
				kvm_sys_state.tail_state = 1;
			}
		}
	}
	else kvm_sys_state.tail_state = 0;
}

//============================================================================

uint8_t ion_free_space(void)
{
	//cat /proc/cvitek/sys_mem | grep "usage rate:" | awk '{print $2}'

	return 0;
}
