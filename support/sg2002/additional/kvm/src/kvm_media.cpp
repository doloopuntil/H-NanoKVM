// The C API in kvm_media.h over KvmCamera and libkvm_mmf.
#include "kvm_media.h"
#include "kvm_mmf.hpp"
#include "internal/kvm_capture.hpp"

static KvmCamera *cam = nullptr;
static KvmFrame frame;

int kvmc_cam_create(int w, int h)
{
	if (cam == nullptr)
		cam = KvmCamera::create(w, h);
	return cam != nullptr ? 0 : -1;
}

void kvmc_cam_restart(int w, int h)
{
	if (cam != nullptr)
		cam->restart(w, h);
}

int kvmc_cam_set_size(int w, int h)
{
	return cam != nullptr && cam->set_resolution(w, h) ? 0 : -1;
}

void kvmc_cam_mirror_flip(void)
{
	if (cam != nullptr)
		cam->mirror_and_flip();
}

void kvmc_cam_close(void)
{
	if (cam != nullptr)
		cam->close();
}

int kvmc_mmf_is_init(void)
{
	return mmf_is_init() ? 1 : 0;
}

void kvmc_mmf_deinit(int force)
{
	mmf_try_deinit(force != 0);
}

int kvmc_frame_read(int *w, int *h, size_t *size)
{
	kvm_frame_release(&frame);
	if (cam == nullptr || !cam->read(&frame))
		return -1;
	*w = frame.width;
	*h = frame.height;
	*size = frame.size;
	return 0;
}

const uint8_t *kvmc_frame_pixels(void)
{
	return kvm_frame_pixels(frame);
}

void kvmc_frame_release(void)
{
	kvm_frame_release(&frame);
}

int kvmc_frame_jpeg(int quality, kvmc_alloc_fn alloc, void *ctx, uint32_t *size)
{
	uint8_t *out = nullptr;
	size_t out_size = 0;
	*size = 0;
	if (alloc == nullptr || !kvm_encode_jpeg(frame, quality, alloc, ctx, &out, &out_size))
		return -1;
	*size = (uint32_t)out_size;
	return 0;
}

int kvmc_venc_add(int ch, int w, int h, int gop, int fps, int bitrate)
{
	mmf_venc_cfg_t cfg = {};
	cfg.type = 2;  // h264
	cfg.w = w;
	cfg.h = h;
	cfg.fmt = kvm_nv21_format();
	cfg.gop = gop;
	cfg.intput_fps = fps;
	cfg.output_fps = fps;
	cfg.bitrate = bitrate;
	return mmf_add_venc_channel(ch, &cfg);
}

int kvmc_venc_del(int ch)
{
	return mmf_del_venc_channel(ch);
}

int kvmc_frame_venc_push(int ch)
{
	return mmf_venc_push(ch, frame.data, frame.width, frame.height, kvm_nv21_format());
}

int kvmc_venc_pop(int ch, const uint8_t **data, int *size, int max)
{
	mmf_stream_t stream = {};
	if (mmf_venc_pop(ch, &stream) != 0)
		return -1;
	int n = stream.count < max ? stream.count : max;
	for (int i = 0; i < n; i++) {
		data[i] = stream.data[i];
		size[i] = stream.data_size[i];
	}
	return stream.count;
}

int kvmc_venc_free(int ch)
{
	return mmf_venc_free(ch);
}

int kvmc_venc_request_idr(int ch)
{
	return mmf_venc_request_idr(ch);
}
