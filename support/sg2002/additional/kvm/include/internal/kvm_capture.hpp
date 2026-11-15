// HDMI capture: one NV21 VI channel of libkvm_mmf, and the hardware JPEG encoder.
#ifndef KVM_CAPTURE_HPP_
#define KVM_CAPTURE_HPP_

#include <stddef.h>
#include <stdint.h>

struct KvmFrame {
	uint8_t *data = nullptr;
	size_t size = 0;
	int width = 0;
	int height = 0;
	// A copy (padded rows packed). Otherwise the VPSS frame itself, held until the next read.
	bool owned = false;
};

class KvmCamera {
public:
	// Takes an MMF reference and opens the channel; nullptr when MMF init fails.
	static KvmCamera *create(int width, int height);
	~KvmCamera();
	KvmCamera(const KvmCamera &) = delete;
	KvmCamera &operator=(const KvmCamera &) = delete;

	// Tears the whole media stack down and starts it again at this size.
	void restart(int width, int height);
	bool set_resolution(int width, int height);
	// The board's bridge delivers the picture mirrored and upside down.
	void mirror_and_flip();
	bool read(KvmFrame *frame);
	void close();

private:
	KvmCamera() = default;
	bool start(int width, int height);
	void stop();
	bool open_channel();
	bool is_open() const;

	int ch_ = -1;
	int width_ = 0;
	int height_ = 0;
	bool align_need_ = false;
};

void kvm_frame_release(KvmFrame *frame);

// Encodes an NV21 frame; on success *out is a copy of the JPEG in memory from alloc(ctx, size),
// or from malloc when alloc is NULL.
bool kvm_encode_jpeg(const KvmFrame &frame, int quality, uint8_t *(*alloc)(void *, uint32_t),
		     void *ctx, uint8_t **out, size_t *out_size);

// libkvm_mmf's pixel format code for NV21.
int kvm_nv21_format();

#endif // KVM_CAPTURE_HPP_
