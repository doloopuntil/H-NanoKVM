---
status: experiment, stage 2 built and compile-checked, not yet run on a device
applies-to: system 1.0.0 (Linux 6.18) on the Lite
last-checked: 2026-11-14
---

# Send-side TLS encryption on the C906L

[Offloading work to the C906L](c906l-offload.md) parked the second core. Its argument against TLS
offload assumed kernel TLS with an asynchronous cipher driver. Kernel TLS is gone, the web server
encrypts with rustls on a saturated core, and the question is open again in a narrower form:
encrypt only the **outgoing** records of the MJPEG stream on the C906L. The small core would see our
own JPEG frames and a send key, never bytes a client chose; everything received stays in rustls.

This page is the paper study. It ends with a recommendation and the smallest experiment that would
replace the two estimates everything rests on.

## Summary

- It is feasible, and it needs **no hand-written record layer**. rustls lets a provider replace
  the cipher of one suite; the record framing, sequence numbers, key updates and all receiving stay
  in rustls. This is a different design from the "own TLS 1.3 record writer" first imagined, and
  much smaller.
- It still needs four new parts: firmware for the C906L, a small kernel driver, a firmware slot in
  the FIP (or loading from Linux) and about 150 lines in the server.
- Expected gain: 24.2 fps to about 30-32 fps (148 to about 110-115 ms of CPU per MB), if the small
  core reaches ~15 MB/s. Below ~12 MB/s the gain shrinks, and near 9 MB/s it is gone.
- The small core runs at **594 MHz** with the standard clocks, not 700 (read from the running Lite;
  the main core is at 850 MHz). The 15 MB/s estimate already matches that ratio.
- Security cost: the send key of the video connection is handed to a core with no memory
  protection that runs outside kernel lockdown. No network-facing parser is added.
- **Recommendation: go on to stage 2 as a measurement only**, on a spare SD card, and decide on the
  product after it. Before building anything for the product, compare against a vector
  ChaCha20-Poly1305 inside the server ([below](#the-alternative-to-weigh-it-against)), which
  reaches most of the same gain with no firmware, driver or shared key.

## How the firmware gets loaded

### Through the FIP

The FSBL in the pinned SDK (`fsbl/plat/cv181x/bl2/bl2_opt.c`, `load_blcp_2nd`) reads four fields
of the FIP's second parameter block: `BLCP_2ND_CKSUM`, `_LOADADDR`, `_SIZE` and `_RUNADDR`. With a
run address of 0 it logs `No C906L image.` and goes on; that is today's FIP. Otherwise it copies
the image to the run address, checks a CRC-16, flushes the cache and calls `reset_c906l`, which
writes the address to two registers of the security subsystem (`0x020B0020`, `0x020B0024`), sets a
boot-enable bit (`0x020B0004` bit 13) and pulses the core's reset (`0x03003024` bit 6). It does not
wait for the core. OpenSBI and U-Boot are loaded after it as before.

`fiptool.py` fills the fields when `--BLCP_2ND` names a non-empty file; the run address comes from
the board memmap (`FSBL_C906L_START_ADDR`, `0x8fe00000`, the top 2 MiB of DRAM).

The FIP package is already prepared for this:
`BR2_PACKAGE_HARDENED_SG2002_FIP_C906L_IMAGE` is passed as `BLCP_2ND_PATH`, and is empty. What a
build with firmware would change:

- a new package that builds the firmware (a flat binary linked at `0x8fe00000`, entry at offset 0,
  at most 2 MiB), and the FIP package depending on it;
- the config string set to that binary. Both `fip.std.bin` and `fip.od.bin` carry it; each grows by
  the firmware's size padded to 512 bytes (tens of KB);
- nothing in `scripts/`: `fetch-sg2002-boot-source.sh` already checks out all of `fsbl/`;
- the workflow's FIP checks, if any compare sizes or contents, and a real CI run to prove it.

Failure modes: a FIP whose `BLCP_2ND` fails to load or fails its CRC makes the FSBL retry and then
stop, so the board does not boot. Firmware that loads and then crashes only leaves the small core
hung; Linux boots normally.

**The FIP route does not work with our U-Boot as it is** (found in stage 2). U-Boot 2025.10's
`sipeed_licheerv_nano` configuration takes its RAM size from the upstream `sg2002.dtsi` memory node
(256 MiB) and relocates itself to the top of RAM, with an 8 MiB heap below it: right over
`0x8fe00000`. The vendor U-Boot avoided this by being told 254 MiB. Firmware started by the FSBL
would be overwritten while it runs, and a C906L executing garbage in machine mode can write anywhere
in DRAM. The FIP route needs U-Boot to stay below the region first (a smaller memory node in
U-Boot's device tree, or `CONFIG_SYS_MEM_TOP_HIDE`); that is a boot-chain change of its own.

### What Linux reserves today

`sg2002-nanokvm-lite.dts` keeps `0x8fe00000`-`0x8fffffff` as a `no-map` region (`c906l_rtos`), and
`/proc/iomem` on the Lite shows it reserved. The kernel has the mainline mailbox driver built in
(`CONFIG_CV1800_MBOX`), with the mailbox node from the licheerv patch `0023` bound to interrupt
101 (zero interrupts so far). Mainline marks the small core's clock (`clk_c906_1`) critical, so
Linux does not gate it; the Lite reports 594 MHz for it and 850 MHz for the main core. With the
overdrive FIP the FSBL sets 786 MHz and 1050 MHz.

### From Linux, without touching the FIP

Nothing in `reset_c906l` is specific to the FSBL: a kernel driver can copy the firmware into the
reserved region, write the two address registers and pulse the reset line (`RST_CPUSYS2`, line 294
in mainline's `cv18xx-reset.h`, active low). The vendor kernel does this in `cvitek_remoteproc`,
from supervisor mode, which suggests the security-subsystem registers accept the write; mainline
6.18 has no driver for it, and it is **not verified** on this board. If it works, the firmware can
live in the root filesystem and the FIP stays as it is, which removes the one step that can leave a
card unbootable and sidesteps the U-Boot problem above. It also allows stopping and restarting the
core. Stage 2 uses this route.

## How Linux and the firmware exchange work

### The mailbox

The mailbox at `0x01900000` has eight channels of 8 bytes each and per-CPU enable, set, clear and
status bytes. The mainline driver sends by writing the 8 bytes and setting the target CPU's bit,
and receives in a threaded interrupt handler that hands the 8 bytes to the channel's client. A
device tree client names a channel and a target CPU (`mboxes = <&mailbox N cpu>`; Linux is CPU 1,
the C906L 2). There is no user-space interface: a client is kernel code.

Eight bytes are enough: a slot number and a length. The firmware should never take a pointer from
a message.

Two properties of the mainline driver matter for the cost: transmit completion is found by polling
(`txdone_poll`), and reception goes through an interrupt thread, so one answer costs two wake-ups
before the waiting task runs.

### Where the shared buffers live

| | The C906L's own 2 MiB | The 75 MiB media carveout |
| --- | --- | --- |
| Reached from Linux by | the new driver (`mmap` of fixed slots) | `/dev/cvi-sys`: allocate, `mmap` by physical address, cache ioctls |
| Address the firmware uses | fixed at build time | sent by Linux at run time |
| New kernel code | the `mmap` and the cache calls | none for the buffers |
| Shares memory with | nothing | video frames and encoder buffers |

The small core's own region is the better place. The firmware and its stack need well under
100 KB, which leaves room for a few slots of 16 KB input and 16 KB output at fixed offsets, and the
firmware then reads and writes only addresses it was built with. With the carveout, Linux would
send physical addresses and the firmware would have to trust or check them.

### Cache maintenance

The cores share DRAM but not caches. Per record:

1. Linux writes the plaintext, key, nonce and length into a slot through a cached mapping, and the
   driver cleans those lines (`dma_sync_single_for_device`; on the C906 one `th.dcache.cpa` per
   64-byte line, 256 lines for 16 KB).
2. The firmware invalidates its view of the input, encrypts into the output slot, and cleans the
   output.
3. Linux invalidates its view of the output and copies the ciphertext out.

Input and output must be **separate buffers**. With encryption in place, a missed invalidate on
the Linux side would make the server read back its own cached plaintext and send it. With separate
buffers the worst a cache mistake returns is the previous record's ciphertext or zeroes, which the
client rejects.

Estimated cost on the main core per 16 KB record (all to be measured): 15-40 us for clean and
invalidate, 25-40 us for one extra copy (rustls already copies the plaintext once; here it is
copied into the slot and the ciphertext copied out of a cold buffer), and 40-120 us for the round
trip (system call, sleep, mailbox, interrupt thread, wake-up). Together 80-200 us per record, or
5-12 ms per MB (61 records).

## How the server hands records out

### What does not work

`dangerous_extract_secrets` consumes the whole connection and returns both directions' keys and
sequence numbers; after it, rustls is gone. A send-only split built on it would need our own TLS
1.3 record writer **and** a reader for everything the client sends afterwards: alerts, key updates,
close, and the request bytes of a kept-alive connection. That is a second TLS record layer in the
server, facing the network, to be kept correct by us. Not worth considering further.

### What works: replace the cipher of one suite

rustls builds each direction's cipher through `Tls13AeadAlgorithm::encrypter(key, iv)`, which
returns a `MessageEncrypter` with one method that matters: `encrypt(plain_record, seq)`. The
fields of `Tls13CipherSuite` are public, so the server's provider can carry
`TLS13_CHACHA20_POLY1305_SHA256` with ring's hash and key schedule, ring's decrypter, and our own
encrypter. `http/tls.rs` already builds its own provider to put ChaCha20 first.

Our encrypter keeps a ring key and does what ring's does (`crypto/ring/tls13.rs`, 25 lines): build
the nonce from the IV and the sequence number, the 5-byte header as additional data, append the
content type, seal. For a full-size record on a connection marked for offload it sends key, nonce,
header and plaintext to the small core and waits for ciphertext and tag instead; on a timeout or
any error it seals with ring and turns offload off. rustls still does the framing, counts the
sequence numbers, handles key updates (a new encrypter with a new key) and reads everything
incoming with ring.

Marking the connection: tokio-rustls encrypts inside `poll_write`, and the server already wraps
every connection in `Guarded`. The MJPEG handler sets a flag on its connection; `Guarded::poll_write`
raises a thread-local around the inner call when the flag is set; the encrypter looks at it. Other
connections, the handshake and small records never leave ring.

The call is synchronous: the server's one worker thread sleeps in the driver until the small core
answers, about 1.1 ms for a 16 KB record at 15 MB/s. Today the same thread computes for 0.75 ms in
the same place, so other tasks wait a little longer per record than now, not in a new way. While it
sleeps, the main core runs what it otherwise queues: network softirq (39% of the CPU today) and
the frame fetch on the blocking pool. That overlap is the whole gain.

Server code: the provider change, the encrypter (about 100 lines of safe Rust), a small module that
opens the device and maps the slots (the only `unsafe`), and the flag. No record layer.

TLS 1.2 ChaCha20 sessions and AES sessions are not offloaded.

### Security cost against the gain

What is added:

- **The send key leaves the process.** Key and nonce of the video connection are written to
  memory the small core reads, once per record. The small core has no MMU or PMP set up: its
  firmware can read and write all of DRAM, and kernel lockdown, module signing and the hardened
  kernel do not apply to it. A flaw in the firmware is a flaw below the kernel. Against that, what
  reaches the firmware is narrow: 8-byte messages from our driver, a length our server wrote and
  the firmware bounds, and plaintext that is only data to a cipher whose control flow does not
  depend on it. No client can address the firmware.
- **The firmware is trusted for confidentiality.** A wrong ciphertext is caught by the client. A
  cipher that reused a nonce or emitted plaintext would not be caught by anyone; the main core
  cannot check this without redoing the work. This is why the firmware should be small, stateless
  (key and nonce arrive with each record, no session table) and built from an audited
  implementation, for example the RustCrypto `chacha20poly1305` crate in a `no_std` Rust firmware.
- **A kernel driver** of a few hundred lines (mailbox client, slot `mmap`, cache calls, a blocking
  ioctl), reachable only by the server process through a device node, not by network bytes.
- **Unsigned firmware below lockdown.** The kernel runs in integrity lockdown with forced module
  signatures, so that root cannot put unsigned code below user space. Firmware that a driver loads
  from the root filesystem with `request_firmware` is not checked, and on the C906L it can write
  any DRAM, so it reopens exactly that hole: whoever can replace the file owns the kernel. A product
  driver would have to carry the firmware inside the signed module, or check it against a hash
  built into the module. The FIP route has the same gap one level down (the FIP is not signed).

What is not added: a parser for network input anywhere, a second record layer, any change to
receiving. This is the difference from kernel TLS, where any client's bytes were parsed in the
kernel.

The gain is 6-8 frames a second on HTTPS MJPEG at 1080p. Whether that pays for a key shared with
an unprotected core is the owner's call; the measurement decides whether there is a gain to weigh.

## Performance model

Baseline (2026-11-14, Lite, MJPEG over HTTPS, 1080p, quality 80, ~280 KB frames, CPU saturated):
24.2 fps, ~148 ms of CPU per MB, split usr 33%, sys 25%, softirq 39%. ChaCha20-Poly1305 in ring
runs at ~22 MB/s on the main core, so about 45 ms of the 148 are the cipher.

| Per MB on the main core | Today | With offload |
| --- | --- | --- |
| Cipher | ~45 ms | 0 |
| Everything else (TCP send, softirq, frame fetch, hyper) | ~103 ms | ~103 ms |
| Copy, cache maintenance, round trips | 0 | 5-12 ms (estimate) |
| Total | ~148 ms | ~108-115 ms |
| Frames per second at the same CPU load | 24.2 | 31-33 |

The small core adds a second limit. Encryption is in series with the worker thread: per MB the
worker waits for the small core and also does its own sending (roughly 35 ms, estimated from the
split; uncertain by 10 ms either way). The stream cannot run faster than that chain.

| Small core, ChaCha20-Poly1305 | Wait per MB | Limit from the chain | Expected result |
| --- | --- | --- | --- |
| 15 MB/s (22 MB/s scaled by 594/850) | 65 ms | ~36 fps | 31-33 fps, CPU-bound |
| 12 MB/s | 83 ms | ~30 fps | ~30 fps |
| 10 MB/s | 100 ms | ~26 fps | ~26 fps |
| 9 MB/s | 111 ms | ~24 fps | no gain |

If the per-record overhead is twice the upper estimate (400 us, 24 ms per MB), the CPU-bound
figure falls to ~28 fps, the same as the removed kernel-TLS build.

With the overdrive clocks both cores are faster (1050 and 786 MHz) and the ratio is slightly
better for the small core; the model was not worked through for that case.

Where the model could be wrong:

- **The small core's speed.** Same core design, but no vector unit (irrelevant for ring's scalar
  code) and possibly smaller caches; every record arrives cold, 16 KB in and 16 KB out, which costs
  a few percent. A different cipher implementation in the firmware can be faster or slower than
  ring's C code.
- **The round trip.** Two wake-ups and the mailbox framework's polling on a core where a context
  switch is not cheap. This is the least certain number.
- **The overlap.** The model assumes the main core always has softirq or frame-fetch work to do
  while the worker sleeps. Softirq work arrives with ACKs, not on demand; if it bunches up, the
  main core idles during waits and the gain is smaller.
- **The 45 ms.** Inferred from the cipher's speed and consistent with the vector A/B, not profiled
  (the kernel has no perf events).
- **Memory bandwidth.** Two cores streaming through DRAM share one bus.

Pipelining records to the small core (several in flight) would remove the chain limit, but rustls
asks for one record at a time, so that is the design with our own record writer. It only matters
if the small core turns out slow, and then the answer is to stop, not to write a record layer.

## The alternative to weigh it against

The removed kernel-TLS build got its gain from XTheadVector ChaCha20-Poly1305 on the main core
(~56 MB/s against ~22). The same cipher hook in rustls can carry a vector implementation in user
space: 6.18 gives user processes the vector unit when the device tree lists `xtheadvector`, which
ours does. Scaled from the kernel A/B (28 ms per MB saved), that is about 120 ms per MB and
29-30 fps: most of the offload's gain with no firmware, no driver, no FIP change, and the key
staying in the process.

Its costs are different: vector assembly in the server, written by us (the NanoKVM-OS code is
kernel code under GPL-2.0, not usable in this GPL-3.0 server), and correct handling of a
pre-ratification vector unit from Rust. It was not studied here beyond this estimate. It should be
studied before the offload is built for the product, because it is the simpler system.

The two do not add up: with a vector cipher on the main core the small core has nothing left to
win.

## The smallest experiment

Two numbers decide: the C906L's real ChaCha20-Poly1305 throughput on 16 KB records, and the cost
of one round trip per record on the main core.

**Step A, no firmware.** Build the candidate firmware cipher (the `no_std` Rust crate) as a normal
user-space benchmark and run it on the Lite next to ring. This gives its speed on the main core;
times 0.70 is a first figure for the small core. Needs one temporary file on the device.

**Step B, the real measurement.** One image built in CI from this branch, written to a **spare SD
card**, so the working card and its FIP are never touched:

- a bare-metal firmware (Rust `no_std`, target `riscv64gc-unknown-none-elf`, linked at
  `0x8fe00000`): poll the mailbox, on a message invalidate the input slot, run
  ChaCha20-Poly1305 into the output slot, clean it, answer. It also times itself with `rdtime`
  and leaves the figure in the slot;
- a test kernel module with a device tree node: load the firmware into the reserved region and
  release the core from Linux (the FIP slot is no fallback while U-Boot relocates over the
  region, see above), then, on request, run N records of a chosen size and report through debugfs: time per
  round trip for an empty message, time per 16 KB record, the main core's own time in clean,
  invalidate and copy, and the firmware's figure. It checks every answer against the kernel's own
  ChaCha20-Poly1305;
- no server change. The whole measurement runs in the kernel; the server part is only worth
  writing if the numbers hold.

A module has to come from the same build as the kernel (modules are signed with a per-build key,
`/dev/mem` is off, lockdown is on), so the experiment cannot be added to the running system; it
needs its own image. That is also what makes it safe: a card that does not boot is put aside.

What it needs from the owner: a spare SD card, leave to start one CI image build, and a card swap
on the Lite. Nothing is written to the current card.

Go or stop after step B: go on to the server part only if the small core does at least 12 MB/s
and the main core spends under ~200 us per record. Otherwise record the numbers in
[Offloading work to the C906L](c906l-offload.md) and stop.

## Stage 2: what was built

All of it is in `buildroot-external/hardened-sg2002/package/hardened-c906l-tls-test/`, enabled in
the 6.x defconfig of the experiment branch only.

- **Firmware** (`src/firmware/`, C, about 3.8 KB): machine mode, caches enabled through the T-Head
  CSRs, ChaCha20-Poly1305 from Monocypher 4.0.2 (BSD-2-Clause or CC0, fetched by the package),
  built with the target toolchain as a flat binary linked at `0x8fe00000`. It polls the mailbox
  (channel 2, CPU 2) and a doorbell cache line, invalidates the request and input, seals into a
  separate output buffer, cleans it, writes its own `mcycle` and `rdtime` counts and answers on
  channel 3 to CPU 1, or only in the result line in poll mode. It reads only fixed addresses; the
  message carries an operation and a sequence number, no pointer.
- **Kernel module** (`src/module/`): binds to a `hnanokvm,c906l-tls-test` node in the Lite device
  tree (mailbox channels, `RST_CPUSYS2`, the region). It loads `/lib/firmware/c906l-tls-test.bin`,
  writes the boot address and releases the core, and times N records: copy in and clean, the wait
  for the answer, invalidate and copy out. It checks every sealed record against the kernel's own
  ChaCha20-Poly1305 and also times that library on the main core. Control is through sysfs,
  because forced integrity lockdown blocks writable debugfs files.
- **Device tree**: the region loses `no-map` so the module can use the cached linear mapping and
  the DMA API's clean and invalidate; the region stays reserved.
- **Step A benchmark** (`bench/`): ring, RustCrypto and Monocypher on 16 KB records on the main
  core, checking that all three produce the same bytes.

Two modes separate the costs: `mbox` is the real path (mainline mailbox driver, threaded interrupt,
wake-up); `poll` uses neither the mailbox nor interrupts (doorbell line in, result line out, Linux
spinning), which gives the cipher and cache costs alone. Poll mode also covers the case where the
mainline driver's handling of the enable register (it re-enables every other channel when it
acknowledges one) turns out to swallow requests.

Commands on the test image:

```sh
modprobe c906l_tls_test
d=/sys/bus/platform/drivers/c906l-tls-test/c906l-tls-test
echo 1 > $d/start; cat $d/status
echo 'ping mbox 1000 0' > $d/run; cat $d/result
echo 'ping poll 1000 0' > $d/run; cat $d/result
echo 'copy poll 200 16401' > $d/run; cat $d/result
echo 'seal poll 200 16401' > $d/run; cat $d/result
echo 'seal mbox 200 16401' > $d/run; cat $d/result
echo 1 > $d/stop
```

The seal runs are repeated with a browser streaming MJPEG over HTTPS, to see the round trip under
load.

## Open questions

- Is a spare SD card available, or must the test image go on the working card?
- Can Linux release the C906L (security-subsystem registers writable from supervisor mode)? If
  not, the experiment needs the FIP slot.
- Which interrupt the mailbox raises on the C906L, for a firmware that sleeps instead of polling.
  A polling firmware keeps the core busy; its power draw and heat on the Lite are unmeasured.
- Should the vector cipher in user space be studied first, since it may make this unnecessary?
- Standard or overdrive clocks for the product comparison.
