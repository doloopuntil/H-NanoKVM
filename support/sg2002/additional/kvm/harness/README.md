# libkvm media harness

Records what libkvm's camera and encoder code (`src/kvm_capture.cpp`, `src/kvm_media.cpp`)
does at its lower edge, the `mmf_*` calls into libkvm_mmf, so a port can be checked call by
call. The unmodified sources are compiled for the host against `fake_mmf.cpp`, a recording
fake of libkvm_mmf; each scenario is a list of fake settings and `kvmc_*` calls.

```sh
docker run --rm -v "$PWD":/src -w /src rust:1-trixie sh support/sg2002/additional/kvm/harness/run.sh
```

writes `server-rust/tests/media/golden/*.trace` from `server-rust/tests/media/scenarios/*.scn`
(the format is in `server-rust/tests/media/README.md`). It builds with AddressSanitizer; each
trace ends with whether the run leaked.

Below libkvm_mmf nothing changes, so the same `mmf_*` sequence means the same `CVI_*` calls.
`mmf_invert_format_to_mmf` is a pure lookup and is not traced. Mutation check: 25 edits to
the two sources, each changes at least one trace or fails the run.
