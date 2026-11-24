# SG2002 native code

- `additional/kvm_mmf`: `libkvm_mmf.so`, capture and encoding over the Sophgo middleware,
  with the LT6911 HDMI bridge started without the ISP. The server links its C API
  (`include/kvm_mmf.hpp`; `libkvm_mmf.map` lists the exports); HDMI detection, the LT6911,
  the camera and the encoder calls are in the server (`server-rust/src/capture`).
- `middleware-patches`: patches to `sophgo/cvi_mpi`, applied in the workflow's order; one
  gives `sample_common_sensor.c` the live LT6911 capture size and bounded INI parsing.

`libkvm_mmf.so` is a plain CMake target (`CMakeLists.txt`, toolchain file
`cmake/buildroot-musl.cmake`) built with Buildroot's musl GCC, the toolchain that builds the
rootfs. CI's `build-buildroot` job is the reference build; [Build and deploy the server](../../docs/development/cross-build.md)
shows how to run the same scripts locally.
