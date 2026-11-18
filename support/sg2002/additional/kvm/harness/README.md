# libkvm control harness

Records what today's C++ libkvm does at its edges (LT6911 I2C, `/proc/lt_int`, state files,
commands, GPIO, camera and encoder calls, return codes), so a Rust port of the control half
can be checked against it without a Full or PCIe board.

- `build.sh` compiles the unmodified `kvm_vision.cpp` and `vi_state_shared.cpp` for the Linux
  host. In their objects, `objcopy --redefine-sym` renames every libc call that touches the
  outside (files, I2C, GPIO, commands, time, threads, mutexes) to a `fake_*` function in
  `fake.cpp`. The camera (`KvmCamera`, `kvm_*`) and the `mmf_*` encoder calls are recording
  stubs.
- `fake.cpp` runs one scenario. Files live under a temporary root. The LT6911 at 0x2b on bus
  4 is a register model (bank select by `[0xff, bank]`, pointer by a one-byte write) that each
  chip variant fills from `src`. `/proc/lt_int` counts edges as the kernel patch does (+1
  rising, +10 falling). Time is virtual and threads run one at a time; at equal wake times the
  thread that went to sleep first runs first. Syscalls take no virtual time; a `vi_dbg` read
  blocks 1 s (`vidbg_ms`), a frame takes 16 ms, a VPSS read without frames times out after 1 s.
- Camera model: at create/restart the VI takes its input size from `/kvmapp/kvm/width` and
  `height`, as `sample_common_sensor.c` does. Frames flow only while that size matches the
  source, as after the osdrv patch that drops frames failing the CSI checks.
- `scenarios/*.scn` are the inputs, `golden/*.trace` the recorded outputs.
- `run.sh` builds and runs everything in `rust:1-trixie` and compares with the goldens;
  `run.sh --update` rewrites them.

## Scenario lines

| line | meaning |
|---|---|
| `chip c\|ux\|d\|ue` | the bridge; what `S15kvmhwd get_hdmi_version` writes |
| `board alpha\|beta\|pcie\|none` | `/etc/kvm/hw`; `pcie` also names the `hdmi-reset` GPIO line (`nogpio` removes it) |
| `cam fail`, `nolt`, `vidbg_ms MS`, `frame_ms MS`, `restart_ms MS` | media init fails, no `/proc/lt_int`, timings (a camera restart takes 0 ms by default) |
| `at MS` | the following lines happen at that virtual time |
| `file PATH TEXT`, `rm PATH` | write (`\n`, `\t`, `\xHH`) or remove a file |
| `src W H`, `src off` | the HDMI input as each bridge reports it; frames follow |
| `reg BANK REG VAL` | set one LT6911 register (hex) |
| `int rise\|fall` | an LT6911 interrupt edge |
| `vidbg auto\|absent\|DEV FPS [WGT WLS HGT HLS]` | `/proc/cvitek/vi_dbg`; `auto` follows the camera model |
| `nack on\|off` | every I2C transfer fails |
| `carveout N\|x\|none` | what the watchdog's `sys_mem` pipeline prints |
| `frame N`, `signal on\|off` | frame content (frame detect), frames without a size change |
| `venc fail add\|push\|pop\|none` | encoder failures |
| `call init` | as `KvmVision::load`: `kvmv_init(0)`, `hdmi 0`, 10 ms, `hdmi 1` unless `/etc/kvm/hdmi_disable` |
| `call mjpeg W H Q`, `call h264 W H FPS RATE` | one read (`h264` sets the fps first) |
| `call hdmi 0\|1`, `detect N`, `idr`, `signal`, `deinit` | the other exports |
| `call ... every MS until T` | repeat a call on that period (late calls run at once) |
| `end` | stop |

## Trace lines

`@MS`, then: `> line` (scenario input), `i2c 2b w|r [NACK] bytes`, `write PATH "content"`
(direct writes, `echo N > PATH` and temp + rename all map to this), `run CMD`,
`gpio claim ...`, `gpio hdmi-reset V`, `vi_state ...` (the `/dev/shm` publication),
`cam ...`, `venc ...`, `mmf deinit`, `call NAME ARGS -> RESULT`. Identical consecutive lines
collapse into `@A..@B line xN`.

Not covered: real I2C timing, the LT6911's real register behaviour beyond the bytes libkvm
reads, the real `vi_dbg` format and timing on 6.18, the media path itself (stubs), thread
interleavings other than the one above.
