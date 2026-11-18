# SG2002 native code

- `additional/kvm`: `libkvm.so`, the video C API the server links (`include/kvm_vision.h`;
  `libkvm.map` lists its exports).
- `additional/kvm_mmf`: `libkvm_mmf.so`, capture and encoding over the Sophgo middleware,
  with the LT6911 HDMI bridge started without the ISP.
- `additional/sophgo-middleware`: our copy of Sophgo's `sample_common_sensor.c`.
- `common/kvm_platform.hpp`: i2c-dev and time helpers for `libkvm`.
- `middleware-patches`: patches to `sophgo/cvi_mpi`.

Both libraries are plain CMake targets (`CMakeLists.txt`, toolchain file
`cmake/buildroot-musl.cmake`) built with Buildroot's musl GCC, the toolchain that builds the
rootfs. CI's `build-buildroot` job is the reference build; [Build and deploy the server](../../docs/development/cross-build.md)
shows how to run the same scripts locally.
