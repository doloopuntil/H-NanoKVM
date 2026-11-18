# kvm_system differential harness

Records what today's C++ `kvm_system` does at its hardware edges, so a replacement can be
checked byte for byte without a Full or PCIe board.

- `build.sh` compiles the unmodified sources for the Linux host. In their objects,
  `objcopy --redefine-sym` renames every libc call that touches the outside (files, I2C,
  `/dev/input/event0`, network interfaces, commands, random bytes, time, threads) to a
  `fake_*` function in `fake.cpp`.
- `fake.cpp` runs one scenario: files live under a temporary root, the I2C bus records
  every write per bus and address, the key device replays scripted presses, commands are
  recorded and answered from the scenario. Time is virtual and the three threads run one
  at a time; at equal wake times the thread that went to sleep first runs first. Syscalls
  take no virtual time.
- `scenarios/*.scn` are the inputs, `golden/*.trace` the recorded outputs.
- `run.sh` builds and runs everything in `rust:1-trixie` and compares with the goldens;
  `run.sh --update` rewrites them.
- `render.py golden/X.trace [full|pcie]` prints the OLED pictures from a trace.

## Scenario lines

| line | meaning |
|---|---|
| `i2c BUS ADDR` | a device answers there; listed buses exist |
| `input` | `/dev/input/event0` exists |
| `at MS` | the following lines happen at that virtual time |
| `file PATH TEXT` | write a file (`\n`, `\t`, `\xHH`); `rm PATH` removes it |
| `iface NAME down\|up\|running IP\|-`, `iface NAME absent` | interface flags and IPv4 address |
| `route NAME GW\|-` | default route in `/proc/net/route` |
| `vi FPS`, `vi freeze`, `vi off` | libkvm's shared VI state: published every tick, no longer refreshed, removed |
| `sta on\|off`, `wpa STATE` | `hostapd_cli all sta` and `wpa_cli -i wlan0 status` output |
| `random fail` | `getrandom` fails |
| `key press MS`, `key down`, `key up` | button events |
| `end` | SIGTERM |

## Trace lines

`@MS` virtual time, then: `> line` (scenario input), `i2c BUS:ADDR [NACK ]C|D bytes`
(consecutive two-byte writes `[0x00|0x40, byte]` joined; `xx*N` repeats), `create PATH
MODE`, `chmod PATH MODE`, `write PATH "content"` (on close), `rename A B`, `unlink PATH`
(only when it removed something), `run ARGV`, `exit N`. Pipelines are recorded as the
command before `| grep`; the harness applies the grep itself.

Not covered: real I2C timing and errors in the middle of a frame, the mounting of the
panels (`render.py` shows controller RAM), thread interleavings other than the one above.

`../rust/tests/golden.rs` replays the same scenarios against the Rust port
(`cargo test` in `../rust`, also on macOS) and compares with these goldens.

QR codes: `qr_dump.c` prints libqr's 29x29 matrix (`qrInit(3, QR_EM_8BIT, 1, 4)`: version 3,
byte mode, level M, mask 4 as in the spec) for every line of `qr-strings.txt` into
`golden/qr-matrices.txt`; over 42 bytes it prints `ERROR`. The Rust test `qr_matches_libqr`
compares the `qrcodegen` crate (1.8.0, MIT, Project Nayuki) against it.
