/* libkvm: the camera and encoders for the server's capture module (server-rust/src/capture).
 * One camera and one leased frame at a time; the caller serialises every call. */
#ifndef KVM_MEDIA_H_
#define KVM_MEDIA_H_

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/* Returns memory for an encoded frame of `size` bytes, or NULL to drop it. */
typedef uint8_t *(*kvmc_alloc_fn)(void *ctx, uint32_t size);

/* Brings up MMF and opens the VI channel at w x h; -1 when MMF init fails. */
int kvmc_cam_create(int w, int h);
/* Tears the media stack down and starts it again; the VI rereads its input size. */
void kvmc_cam_restart(int w, int h);
int kvmc_cam_set_size(int w, int h);
/* The bridge delivers the picture mirrored and upside down. */
void kvmc_cam_mirror_flip(void);
void kvmc_cam_close(void);
int kvmc_mmf_is_init(void);
void kvmc_mmf_deinit(int force);

/* Leases the next frame (waits up to 1 s); 0 on success. */
int kvmc_frame_read(int *w, int *h, size_t *size);
/* The leased frame's pixels for the CPU, NULL on failure. */
const uint8_t *kvmc_frame_pixels(void);
void kvmc_frame_release(void);
/* JPEG of the leased frame into memory from alloc; 0 on success, *size its length. */
int kvmc_frame_jpeg(int quality, kvmc_alloc_fn alloc, void *ctx, uint32_t *size);

int kvmc_venc_add(int ch, int w, int h, int gop, int fps, int bitrate);
int kvmc_venc_del(int ch);
/* Sends the leased frame to the H.264 channel. */
int kvmc_frame_venc_push(int ch);
/* The encoded packs, valid until kvmc_venc_free; returns their count or -1. */
int kvmc_venc_pop(int ch, const uint8_t **data, int *size, int max);
int kvmc_venc_free(int ch);
int kvmc_venc_request_idr(int ch);

#ifdef __cplusplus
}
#endif

#endif /* KVM_MEDIA_H_ */
