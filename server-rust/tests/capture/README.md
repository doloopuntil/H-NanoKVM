# Capture goldens

What libkvm's C++ `kvm_vision` did at its edges (LT6911 I2C, `/proc/lt_int`, state files,
commands, GPIO, camera and encoder calls, return codes), recorded so the Rust capture module
(`src/capture`) can be checked byte for byte without a Full or PCIe board or each bridge chip.

- `scenarios/*.scn` are the inputs, `golden/*.trace` the outputs the C++ produced.
- `../capture_golden.rs` replays every scenario against the Rust engine through a simulated
  `Platform` and compares the traces. `CAPTURE_TRACES_OUT=DIR` writes the Rust traces there.
  A deliberate difference goes into its `EXPECTED_DIFFERENCES` with the reason, and its
  reviewed Rust trace into `fixed/`; the test checks it against that and that it still
  differs from the C++.

The goldens were recorded by a harness that compiled the unmodified C++ for a Linux host and
replaced every libc call that touches the outside with a fake, the camera and encoders with
recording stubs, with virtual time and one thread running at a time. It went with the C++
(`git log --diff-filter=D -- support/sg2002/additional/kvm/harness` finds it). A new scenario
needs a golden from that harness, or a deliberate decision that the Rust output is the
reference.

Model: the LT6911 at 0x2b on bus 4 is a register model (bank select by `[0xff, bank]`,
register pointer by a one-byte write) that each chip fills from `src`. `/proc/lt_int` counts
+1 per rising and +10 per falling edge. A `vi_dbg` read blocks 1 s, a frame takes 16 ms, a
read without frames times out after 1 s, a camera restart takes `restart_ms` (0). At camera
start the VI takes its input size from `/kvmapp/kvm/width` and `height`, as
`sample_common_sensor.c` does; frames flow only while it matches the source.

## Scenario lines

| line | meaning |
|---|---|
| `chip c\|ux\|d\|ue` | the bridge; what `S15kvmhwd get_hdmi_version` writes |
| `board alpha\|beta\|pcie\|none` | `/etc/kvm/hw`; `pcie` also names the `hdmi-reset` GPIO line (`nogpio` removes it) |
| `cam fail`, `nolt`, `vidbg_ms MS`, `frame_ms MS`, `restart_ms MS` | media init fails, no `/proc/lt_int`, timings |
| `at MS` | the following lines happen at that virtual time |
| `file PATH TEXT`, `rm PATH` | write (`\n`, `\t`, `\xHH`) or remove a file |
| `src W H`, `src off` | the HDMI input as each bridge reports it; frames follow |
| `reg BANK REG VAL` | set one LT6911 register (hex) |
| `int rise\|fall` | an LT6911 interrupt edge |
| `vidbg auto\|absent\|DEV FPS [WGT WLS HGT HLS]` | `/proc/cvitek/vi_dbg`; `auto` follows the camera model |
| `nack on\|off` | every I2C transfer fails |
| `carveout N\|x\|none` | the `usage rate` field of `/proc/cvitek/sys_mem` |
| `frame N`, `signal on\|off` | frame content (frame detect), frames without a size change |
| `venc fail add\|push\|pop\|none` | encoder failures |
| `call init` | `init`, `hdmi 0`, 10 ms, `hdmi 1` unless `/etc/kvm/hdmi_disable` |
| `call mjpeg W H Q`, `call h264 W H FPS RATE` | one read (`h264` sets the fps first) |
| `call hdmi 0\|1`, `detect N`, `idr`, `signal`, `deinit` | the other calls |
| `call ... every MS until T` | repeat a call on that period (late calls run at once) |
| `end` | stop |

## Trace lines

`@MS`, then: `> line` (scenario input), `i2c 2b w|r [NACK] bytes`, `write PATH "content"`
(direct writes, the C++'s `echo N > PATH` and temp + rename all map to this), `run CMD`,
`gpio claim ...`, `gpio hdmi-reset V`, `vi_state ...` (the `/dev/shm` publication),
`cam ...`, `venc ...`, `mmf deinit`, `call NAME ARGS -> RESULT`. Identical consecutive lines
collapse into `@A..@B line xN`.

Not covered: real I2C timing, the LT6911's behaviour beyond the bytes read, the real
`vi_dbg` format and timing on 6.18, the media path itself, thread interleavings other than
the scheduler's.
