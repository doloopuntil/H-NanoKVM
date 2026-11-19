# Media goldens

What libkvm's C++ camera and encoder code (`kvm_capture.cpp`, `kvm_media.cpp`) did at its
lower edge: every `mmf_*` call into libkvm_mmf, and what each `kvmc_*` call returned. The
recording harness compiled the unmodified C++ for a host against a recording fake of
libkvm_mmf (`git log --diff-filter=D -- support/sg2002/additional/kvm/harness` finds it).

- `scenarios/*.scn` are the inputs, `golden/*.trace` the outputs the C++ produced.
- `fixed/*.trace` are the Rust traces of scenarios where the port fixes a C++ bug on purpose
  (`EXPECTED_DIFFERENCES` in `../media_golden.rs` gives each reason); the test checks them
  against these and that they still differ from the golden.
- `MEDIA_TRACES_OUT=DIR` writes the Rust traces there.

## Scenario lines

| line | meaning |
|---|---|
| `pop W H FMT LEN`, `pop fail` | queue the next `mmf_vi_frame_pop` result (`nv21` for the NV21 code) |
| `map_fail` | the next `mmf_vi_frame_map` returns NULL |
| `fail NAME` | the next call of NAME returns -1: `init`, `vi_init`, `vi_deinit`, `add_vi`, `del_vi`, `jpg_push`, `jpg_pop`, `venc_add`, `venc_del`, `venc_push`, `venc_pop`, `venc_free`, `idr` |
| `align N`, `unused N`, `set_init 0\|1` | what `mmf_vi_aligned_width`, `mmf_get_vi_unused_channel`, `mmf_is_init` return |
| `jpg_size N`, `jpg_null` | the next JPEG's size; NULL data |
| `packs S...` | the packs each `mmf_venc_pop` returns |
| `create W H`, `restart W H`, `size W H`, `mirror`, `close`, `isinit`, `deinit F` | camera calls |
| `read`, `pixels N`, `release` | lease a frame; hash N bytes of its pixels; drop it |
| `jpeg Q [refuse]` | JPEG of the frame; `refuse` makes the buffer allocation fail |
| `vadd CH W H GOP FPS BR`, `vdel CH`, `vpush CH`, `vpop CH MAX`, `vfree CH`, `vidr CH` | H.264 calls |

## Trace lines

`> line` (the scenario line), `mmf NAME ARGS -> RESULT`, `call NAME -> RESULT`, and
`end leaks=0|1`. Buffers show as an FNV-1a hash of their bytes, or `null`. The fake fills
frame `n` with byte `i` = `n*131 + i*7 + (i >> 9)`, JPEG `n` with `n*17 + i*3`, and pack
`k` of H.264 frame `n` with `k*29 + i*5 + n` (all mod 256). `vpop` prints `spill` when a
pack was written past `MAX`.
