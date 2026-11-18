// Small Linux helpers for libkvm: i2c-dev access and millisecond time.
#ifndef KVM_PLATFORM_HPP_
#define KVM_PLATFORM_HPP_

#include <fcntl.h>
#include <linux/i2c-dev.h>
#include <stdint.h>
#include <stdio.h>
#include <sys/ioctl.h>
#include <time.h>
#include <unistd.h>

namespace kvm {

inline uint64_t time_ms()
{
	struct timespec ts;
	clock_gettime(CLOCK_MONOTONIC, &ts);
	return (uint64_t)ts.tv_sec * 1000 + (uint64_t)ts.tv_nsec / 1000000;
}

inline void sleep_ms(uint64_t ms)
{
	struct timespec ts;
	ts.tv_sec = (time_t)(ms / 1000);
	ts.tv_nsec = (long)(ms % 1000) * 1000000;
	nanosleep(&ts, NULL);
}

// One /dev/i2c-N bus as a master with 7-bit addresses; a missing bus fails every transfer.
class I2cBus {
public:
	explicit I2cBus(int bus)
	{
		char path[32];
		snprintf(path, sizeof(path), "/dev/i2c-%d", bus);
		fd_ = open(path, O_RDWR | O_CLOEXEC);
	}
	~I2cBus()
	{
		if (fd_ >= 0)
			close(fd_);
	}
	I2cBus(const I2cBus &) = delete;
	I2cBus &operator=(const I2cBus &) = delete;

	// Returns len, or -1 on failure.
	int write(int addr, const uint8_t *data, int len)
	{
		if (fd_ < 0 || ioctl(fd_, I2C_SLAVE, addr) != 0)
			return -1;
		return ::write(fd_, data, (size_t)len) == (ssize_t)len ? len : -1;
	}

	bool read(int addr, uint8_t *data, int len)
	{
		if (fd_ < 0 || len <= 0 || ioctl(fd_, I2C_SLAVE, addr) != 0)
			return false;
		return ::read(fd_, data, (size_t)len) == (ssize_t)len;
	}

private:
	int fd_ = -1;
};

} // namespace kvm

#endif // KVM_PLATFORM_HPP_
