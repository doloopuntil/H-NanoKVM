#ifndef __KVM_MMF_HPP__
#define __KVM_MMF_HPP__

#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

// Packs a returned frame may carry; H.264 frames carry 1 or 3.
#define MMF_STREAM_MAX_PACKS 8

typedef struct {
    uint8_t *data[MMF_STREAM_MAX_PACKS];
    int data_size[MMF_STREAM_MAX_PACKS];
    int count;
} mmf_stream_t;

typedef struct {
    uint8_t type;           // 0, jpg; 1, h265; 2, h264
    int w;
	int h;
	int fmt;
	uint8_t jpg_quality;	// jpeg
	int gop;				// h264
	int intput_fps;			// h264
	int output_fps;			// h264
	int bitrate;			// h264
} mmf_venc_cfg_t;

// init sys
int mmf_init(void);
int mmf_deinit(void);
int mmf_try_deinit(bool force);
bool mmf_is_init(void);

// manage vi channels(vi->vpssgroup->vpss->frame)
int mmf_get_vi_unused_channel(void);
int mmf_vi_init(void);
int mmf_vi_deinit(void);
int mmf_add_vi_channel(int ch, int width, int height, int format);
int mmf_del_vi_channel(int ch);
int mmf_del_vi_channel_all(void);
bool mmf_vi_chn_is_open(int ch);
int mmf_vi_aligned_width(int ch);
void mmf_set_vi_hmirror(int ch, bool en);
void mmf_set_vi_vflip(int ch, bool en);

// get vi frame
// Leases the next VI frame without mapping it; the encoders take it with data NULL.
int mmf_vi_frame_pop(int ch, int *len, int *width, int *height, int *format);
// Maps the leased frame for the CPU (cached, invalidated) on first use; NULL on failure.
void *mmf_vi_frame_map(int ch);
void mmf_vi_frame_free(int ch);
// Release the current VI frame immediately. mmf_vi_frame_free() defers
// release so the frame can be sent directly to VENC without a second copy.
void mmf_vi_frame_release(int ch);

// invert format; mmf_invert_format_to_mmf() takes these input codes
#define MMF_INPUT_FMT_NV21 8
int mmf_invert_format_to_mmf(int input_format);

// venc
int mmf_enc_jpg_init(int ch, int w, int h, int format, int quality);
int mmf_enc_jpg_deinit(int ch);
int mmf_enc_jpg_push_with_quality(int ch, uint8_t *data, int w, int h, int format, int quality);
int mmf_enc_jpg_pop(int ch, uint8_t **data, int *size);
int mmf_enc_jpg_free(int ch);
int mmf_add_venc_channel(int ch, mmf_venc_cfg_t *cfg);
int mmf_del_venc_channel(int ch);
int mmf_del_venc_channel_all(void);
int mmf_venc_push(int ch, uint8_t *data, int w, int h, int format);
int mmf_venc_pop(int ch, mmf_stream_t *stream);
int mmf_venc_free(int ch);
// Next frame is an IDR; the channel keeps running.
int mmf_venc_request_idr(int ch);

#ifdef __cplusplus
}
#endif

#endif // __KVM_MMF_HPP__
