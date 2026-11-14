---
status: current, decided (C906L parked; kTLS and vector ciphers instead)
applies-to: system 1.0.0 (Linux 6.18) on the Lite
last-checked: 2026-11-14
---

# Offloading work to the C906L

The SG2002 has a second RISC-V core, a C906 at 700 MHz (the C906L), next to the 1 GHz C906 that
runs Linux. It sits idle: the FIP carries no image for it
([migration plan, section 6.3](kernel-6x-migration-plan.md)). This page records what it could take
off the main core, measured against where the main core's time goes, and why we parked it: kernel
TLS with vector ciphers on the main core, and the SoC's fixed-function blocks, cover the same work
for less.

## Where the main core's time goes

Measured on the Lite (6.18.29, hardening on, default clocks) with `/proc/stat` and per-thread
`stat` deltas over 10 s. Details: `notes/cpu-video-upload-measurements-2026-11-13.md` in the main
checkout.

MJPEG, 1080p, 60 fps selected, moving picture, before any of the changes below:

| | HTTPS | plain HTTP |
| --- | --- | --- |
| Frames per second | 24 | 39 |
| CPU busy | 97.5% | 94.3% |
| CPU per frame | ~41 ms | ~24 ms |
| Encryption (the difference) | ~16 ms | none |
| Frame fetch and JPEG encode calls (blocking pool) | ~13 ms | ~13 ms |
| Sending and network interrupts | ~12 ms | ~11 ms |

Encryption is ChaCha20-Poly1305 at ~22 MB/s on this core, which matches the 16 ms for a ~350 KB
frame. The JPEG itself is encoded by the VENC hardware; no step reads pixels on the CPU.

ISO upload over a wired link at 8-9 MB/s: the CPU is 100% busy. The server's one Tokio worker takes
32% user time (mostly TLS decryption) and 33% system time (socket copies, file writes); network
interrupts take 32%. The video's frame timer was starved until the runtime checked timers more often
(`event_interval`); with that change the source pulls 17 fps during the upload, but frames are still
dropped on the way to the browser. An optional SHA-256 of the upload (when the user enters a
checksum) adds about 35% of a core: SHA-256 runs at 22-26 MB/s here.

## What the C906L could take

The two cores share DRAM and the mailbox at `0x01900000` (mainline `cv1800` mailbox driver). They do
not share caches: every buffer handed across needs a cache clean on the sender and an invalidate on
the receiver. The C906L cannot run Linux code, so the network stack, socket copies, interrupt
handling, filesystem and the Sophgo video drivers stay on the main core. What fits is
self-contained arithmetic on a buffer.

| Work | Share | C906L | What we do instead |
| --- | --- | --- | --- |
| TLS encryption of the video | ~40% of an HTTPS MJPEG frame | yes, ~15 MB/s (estimate) | kTLS plus XTheadVector ChaCha20-Poly1305 on the main core |
| TLS decryption of uploads | ~40% of the CPU at 9 MB/s | yes | the same |
| SHA-256 of an upload (optional) | ~35% of the CPU at 9 MB/s | yes, keeps up at 700 MHz | the CryptoDMA engine (below) |
| MJPEG frame fetch, encoder calls, JPEG copies | ~13 ms a frame, ~7.5 ms after zero-copy | no: Linux driver calls on Linux buffers | zero-copy done; VENC driver patches (below) |
| MJPEG change detection (tiles) | not done today | too slow for 3.1 MB frames at 60 fps | the IVE block (below) |
| TCP, network interrupts, socket copies, file writes | about two thirds of the CPU in both pipelines | no | stays on Linux |
| WebRTC (SRTP in `webrtc-rs`, userspace) | | not covered | |

The C906L design (kTLS with an asynchronous AEAD driver over the mailbox, bare-metal firmware loaded
from the FIP into the reserved `0x8fe00000` region) would have needed a kernel driver, firmware and a
mailbox protocol of our own. Linux 6.18's `tls_sw.c` also uses an asynchronous AEAD for receiving only
with TLS 1.2, so TLS 1.3 uploads would have waited for the C906L in `recvmsg`. The C906L cipher speed
(~15 MB/s, scaled) is below the vector ciphers on the main core, so it would have capped HTTPS MJPEG
near 43 fps where the vector path does not.

## What was done

0. **MJPEG zero-copy** (commit 335e9081): the JPEG push leases the VPSS frame straight to the encoder,
   as H.264 already did. Plain HTTP went from 39 to 49.6 fps (CPU ~20 ms a frame instead of ~24).
   HTTPS stayed at 27.5 fps against a same-day 27.9: it is bound by encryption.
1. **Kernel TLS** (`server-rust/src/http/ktls.rs`, `CONFIG_TLS`): rustls does the handshake, then
   ChaCha20 sessions move to the kernel; AES suites and kernels without TLS stay on rustls. On its
   own it moves the cipher cost into the kernel without making it cheaper: 26 fps over Wi-Fi at
   ~37 ms a frame, against ~36 ms with rustls.
2. **XTheadVector ChaCha20 and Poly1305 in the kernel**, from NanoKVM-OS (kernel patches 0008-0016,
   with the vector context-switch fixes they need). NanoKVM-OS measures about 56 MB/s for
   ChaCha20-Poly1305, against ~22 MB/s generic. The 6.18 GhostWrite mitigation turned XTheadVector
   off on every C9xx core; patch 0016 marks all-C906 systems not affected (GhostWrite is a C910/C920
   bug). The device tree lists `xtheadvector` and needs `thead,vlenb = <16>`: without it 6.18 reads
   the `vlenb` CSR at boot and the Lite hangs (mainline's D1 sets it too).

   A/B on the Lite, same kernel and modules with and without `xtheadvector`, MJPEG over HTTPS on
   Ethernet, same picture (~294 KB frames):

   | | Vector off | Vector on |
   | --- | --- | --- |
   | Frames per second | 20.6 | 25.5 |
   | CPU per frame | ~47 ms | ~38.5 ms |
   | CPU per MB sent | ~159 ms | ~131 ms |

   The 28 ms per MB saved matches the cipher speeds (45 against 18 ms per MB). Encryption is now
   about 18 ms of the ~131; the rest is the kernel's TCP send path, network softirq (27-29% of the
   CPU) and the frame fetch.
3. **Kernel copy routines** for the C906's fast misaligned access (kernel patches 0017-0021: the
   upstream user-copy changes and NanoKVM-OS's `memcpy` and `memmove`). No measurable change: ~130 ms
   per MB on Wi-Fi with larger frames, not a like-for-like A/B. Kept; if they help, it is by a few
   percent at most.
4. **mimalloc in the server** instead of musl's allocator. Same Lite, same picture, HTTPS on
   Ethernet: 25.8 to 28.6 fps, ~133 to ~117 ms per MB, with the saving in kernel time (musl
   returns memory to the kernel and maps it again, and the kernel zeroes each fresh page).
   Booting with `init_on_free=0` in the same setup changed nothing measurable (under 1%), so
   the kernel hardening stays as it is.

## Candidates next

All on the main core or in fixed-function blocks; none needs the C906L.

- **VENC driver fixes** from NanoKVM-OS's osdrv patches (`venc-no-full-bitstream-invalidate`,
  `venc-getstream-packs-from-slab`): aimed at the frame-fetch cost, for plain HTTP and HTTPS alike.
- **Hardware SHA-256** through the CryptoDMA engine (350-370 MB/s, measured by NanoKVM-OS), with
  their GPL-2.0-only kernel driver and `AF_ALG` in the server. Worth it if a checksummed upload is
  still CPU-bound with the vector ciphers. The same engine does AES-CBC/CTR (AES-GCM needs GHASH on
  the CPU), which helps clients that negotiate AES.
- **MJPEG tiles**: the IVE finds changed 128x128 tiles and only those are sent over a WebSocket.
  NanoKVM-OS measured 40 to 2.9 Mbit/s and 88% to 42% CPU with a stopwatch on screen. Our osdrv tree
  already builds `interdrv/ive`. A feature of its own: the browser has to assemble the picture.
- **Upload scheduling**: the upload on a lower-priority thread so the video keeps its turns. A second
  core does not fix starvation on the first.
- **Splice uploads to the file** with kTLS receive, to skip the copy through the server. Only if the
  upload is still CPU-bound after the cipher work.

## When to reopen

Reopen the C906L if a self-contained job appears that neither the vector unit nor a fixed-function
block covers, and that is worth a firmware image, a mailbox protocol and a kernel driver. The
xrobot-org C906L BSP shows the boot and memory map but depends on the vendor FreeRTOS SDK,
`cvitek_remoteproc` and `cvitek_mailbox`, which mainline lacks, and has no license file; it is a
reference, not a dependency.
