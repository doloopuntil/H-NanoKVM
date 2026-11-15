#include "internal/kvm_capture.hpp"
#include "kvm_mmf.hpp"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int kvm_nv21_format()
{
	return mmf_invert_format_to_mmf(MMF_INPUT_FMT_NV21);
}

KvmCamera *KvmCamera::create(int width, int height)
{
	KvmCamera *cam = new KvmCamera();
	if (!cam->start(width, height)) {
		delete cam;
		return nullptr;
	}
	return cam;
}

KvmCamera::~KvmCamera()
{
	stop();
}

bool KvmCamera::start(int width, int height)
{
	if (mmf_init() != 0) {
		fprintf(stderr, "[kvmv] mmf init failed\n");
		return false;
	}
	if (mmf_vi_init() != 0)
		fprintf(stderr, "[kvmv] mmf vi init failed\n");
	width_ = width;
	height_ = height;
	if (!open_channel())
		fprintf(stderr, "[kvmv] camera open failed\n");
	return true;
}

void KvmCamera::stop()
{
	close();
	if (mmf_vi_deinit() != 0)
		fprintf(stderr, "[kvmv] mmf vi deinit failed\n");
	mmf_try_deinit(true);
}

void KvmCamera::restart(int width, int height)
{
	stop();
	start(width, height);
}

bool KvmCamera::is_open() const
{
	return ch_ >= 0 && mmf_vi_chn_is_open(ch_);
}

bool KvmCamera::open_channel()
{
	int ch = mmf_get_vi_unused_channel();
	if (ch < 0) {
		fprintf(stderr, "[kvmv] no free vi channel\n");
		return false;
	}
	if (mmf_add_vi_channel(ch, width_, height_, kvm_nv21_format()) != 0) {
		fprintf(stderr, "[kvmv] mmf add vi channel failed\n");
		return false;
	}
	ch_ = ch;
	align_need_ = width_ % mmf_vi_aligned_width(ch_) != 0;
	return true;
}

void KvmCamera::close()
{
	if (is_open() && mmf_del_vi_channel(ch_) != 0)
		fprintf(stderr, "[kvmv] mmf del vi channel failed\n");
}

bool KvmCamera::set_resolution(int width, int height)
{
	close();
	width_ = width;
	height_ = height;
	return open_channel();
}

void KvmCamera::mirror_and_flip()
{
	if (!is_open())
		return;
	close();
	mmf_set_vi_hmirror(ch_, true);
	mmf_set_vi_vflip(ch_, true);
	if (!open_channel())
		fprintf(stderr, "[kvmv] camera reopen failed\n");
}

bool KvmCamera::read(KvmFrame *frame)
{
	*frame = KvmFrame();
	if (!is_open())
		return false;

	void *buffer = NULL;
	int len = 0, width = 0, height = 0, format = 0;
	if (mmf_vi_frame_pop(ch_, &buffer, &len, &width, &height, &format) != 0)
		return false;
	if (buffer == NULL) {
		mmf_vi_frame_release(ch_);
		return false;
	}

	const size_t size = (size_t)width_ * (size_t)height_ * 3 / 2;
	if (!align_need_ && width == width_ && height == height_ && format == kvm_nv21_format() &&
	    (size_t)len >= size) {
		// Zero copy: the encoders take this frame straight from VPSS.
		frame->data = (uint8_t *)buffer;
		frame->size = size;
		frame->width = width_;
		frame->height = height_;
		mmf_vi_frame_free(ch_);
		return true;
	}

	uint8_t *copy = (uint8_t *)malloc(size);
	if (copy == NULL) {
		mmf_vi_frame_release(ch_);
		return false;
	}
	if (align_need_) {
		// VPSS rows are padded to the aligned width.
		const int align = mmf_vi_aligned_width(ch_);
		const size_t pitch = (size_t)((width + align - 1) / align * align);
		for (int row = 0; row < height_ * 3 / 2; row++)
			memcpy(copy + (size_t)row * width_, (uint8_t *)buffer + row * pitch, width_);
	} else {
		memcpy(copy, buffer, size);
	}
	mmf_vi_frame_release(ch_);
	frame->data = copy;
	frame->size = size;
	frame->width = width_;
	frame->height = height_;
	frame->owned = true;
	return true;
}

void kvm_frame_release(KvmFrame *frame)
{
	if (frame->owned)
		free(frame->data);
	*frame = KvmFrame();
}

bool kvm_encode_jpeg(const KvmFrame &frame, int quality, uint8_t *(*alloc)(void *, uint32_t),
		     void *ctx, uint8_t **out, size_t *out_size)
{
	*out = NULL;
	*out_size = 0;
	if (mmf_enc_jpg_push_with_quality(0, frame.data, frame.width, frame.height, kvm_nv21_format(),
					  quality) != 0)
		return false;
	uint8_t *data = NULL;
	int size = 0;
	if (mmf_enc_jpg_pop(0, &data, &size) != 0)
		return false;
	bool ok = false;
	if (data != NULL && size > 0) {
		*out = alloc ? alloc(ctx, (uint32_t)size) : (uint8_t *)malloc((size_t)size);
		if (*out != NULL) {
			memcpy(*out, data, (size_t)size);
			*out_size = (size_t)size;
			ok = true;
		}
	}
	mmf_enc_jpg_free(0);
	return ok;
}
