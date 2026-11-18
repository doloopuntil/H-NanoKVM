# SG2002 native code

- `additional/kvm`: `libkvm.so`, the camera and encoder C API the server links
  (`include/kvm_media.h`; `libkvm.map` lists its exports). HDMI detection, the LT6911 and
  the frame reads are in the server (`server-rust/src/capture`).
- `additional/kvm_mmf`: `libkvm_mmf.so`, capture and encoding over the Sophgo middleware,
  with the LT6911 HDMI bridge started without the ISP.
- `additional/sophgo-middleware`: our copy of Sophgo's `sample_common_sensor.c`.
- `middleware-patches`: patches to `sophgo/cvi_mpi`.

Both libraries are plain CMake targets (`CMakeLists.txt`, toolchain file
`cmake/buildroot-musl.cmake`) built with Buildroot's musl GCC, the toolchain that builds the
rootfs. CI's `build-buildroot` job is the reference build; [Build and deploy the server](../../docs/development/cross-build.md)
shows how to run the same scripts locally.
