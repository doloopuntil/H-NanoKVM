---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-04
---

# riscv64 thread stack alignment

The server, `nanokvm-hwmon` and `kvm_system` run on Buildroot's musl 1.2.6 loader,
`/lib/ld-musl-riscv64.so.1`, not on the vendor T-Head loader
`/lib/ld-musl-riscv64xthead.so.1`. This page records why.

## The bug

musl's riscv64 `__clone`, which starts every new thread, did not round the child's
stack pointer down to 16 bytes. `pthread_create` only aligns the stack to 8 bytes,
so depending on the binary's TLS size a thread can start with `sp` at 8 mod 16.
Upstream fixed this in February 2025 (musl commit `5e03c03f`, "clone: align the
given stack pointer on or1k and riscv"), released in musl 1.2.6.

The RISC-V psABI guarantees a 16-byte-aligned stack, and LLVM relies on it: it may
compute `sp + 464 + 8` as `(sp + 464) | 8`. On a misaligned stack that address is
wrong, without any crash at the point where it goes wrong.

Unfixed copies:

| File | Version | `__clone` aligns |
|---|---|---|
| `/lib/ld-musl-riscv64xthead.so.1` (vendor) | vendor build | no |
| `/kvmapp/server/dl_lib/libc.so` (vendor) | vendor build | no |
| `/lib/libc.so` = `/lib/ld-musl-riscv64.so.1` (Buildroot) | 1.2.6 | yes |
| Rust 1.99 self-contained musl for `riscv64gc-unknown-linux-musl` | 1.2.5 | no |

To check a binary, find the bytes `88 e1 94 e5` (`c.sd a0,0(a1)`; `c.sd a3,8(a1)`):
`c1 99 c1 15` just before them (`c.andi a1,-16`; `c.addi a1,-16`) means the fix is in.

## How it showed

It surfaced with webrtc 0.21.1, whose driver code runs on a tokio worker thread.
Both failures were a final partial block of 8 bytes:

- ring's AES-GCM wrote zeros for the last 8 bytes of the 24-byte DTLS Finished while
  the tag covered the real ciphertext. Browsers dropped it silently ("invalid mac" in
  a webrtc-rs peer), so DTLS never completed.
- RustCrypto's AES-CTR (SRTP AES-CM) computed its tail loop's end as
  `(sp + 464) | 8`, which equalled its start, and ran into an unmapped page. libkvm
  installs a process-wide handler for fatal signals, so the log said
  "fatal signal in native vision backend" although the crash was in Rust code.

webrtc 0.17 never produced this pattern, but every thread of the server was already
misaligned. Code built against the vendor musl runs unchanged on musl 1.2.6: the only
vendor-only exports are the legacy `*64` aliases, and nothing loaded imports them.

## Evidence

Reproduced under `qemu-riscv64` with a generic rv64gc CPU, so it is not the C906: a
standalone webrtc-rs answerer with the server's settings failed against a native
offerer when statically linked (musl 1.2.5) and connected and streamed when linked
to `/lib/ld-musl-riscv64.so.1`. The same held on the device with Chrome. gdb showed
`sp` at 8 mod 16 in every frame of the worker thread down to `__clone`.
