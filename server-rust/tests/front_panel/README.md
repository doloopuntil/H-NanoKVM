# Front panel goldens

What the C++ `kvm_system` did at its hardware edges, recorded so the Rust front panel
(`src/front_panel`) can be checked byte for byte without a Full or PCIe board.

- `scenarios/*.scn` are the inputs, `golden/*.trace` the outputs the C++ program produced.
- `../front_panel_golden.rs` replays every scenario against the Rust code through a simulated
  `Platform` and compares the traces. `full-wifi-ap-press-connecting` differs on purpose: the
  C++ counted a short press during "Connecting..." as long (it timed the press after waiting
  for its status thread). `FRONT_PANEL_TRACE_DIR=DIR` writes the Rust traces there.
- `golden/qr-matrices.txt` is libqr's 29x29 matrix (`qrInit(3, QR_EM_8BIT, 1, 4)`: version 3,
  byte mode, level M, mask 4) for each line of `qr-strings.txt`; `ERROR` means over 42 bytes.
  The unit test `qr_matches_libqr` compares the `qrcodegen` crate against it.
- `render.py golden/X.trace [full|pcie]` prints the OLED pictures of a trace.

The goldens were recorded by a harness that compiled the unmodified C++ for a Linux host
and replaced every libc call that touches the outside with a fake, with virtual time and
one thread running at a time. It went with the C++; see
`git show c893c655:support/sg2002/kvm_system/harness`. A new scenario needs a golden from
that harness, or a deliberate decision that the Rust output is the reference.

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
| `end` | stop |

## Trace lines

`@MS` virtual time, then: `> line` (scenario input), `i2c BUS:ADDR [NACK ]C|D bytes`
(consecutive two-byte writes `[0x00|0x40, byte]` joined; `xx*N` repeats), `create PATH
MODE`, `chmod PATH MODE`, `write PATH "content"` (on close), `rename A B`, `unlink PATH`
(only when it removed something), `run ARGV`, `exit N`. The C++ ran `hostapd_cli` and
`wpa_cli` through `| grep`; the trace records the command before the pipe.

Not covered: real I2C timing and errors in the middle of a frame, the mounting of the
panels (`render.py` shows controller RAM), the device side (`src/front_panel/device.rs`).
