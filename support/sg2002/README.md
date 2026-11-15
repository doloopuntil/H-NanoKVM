# SG2002 native code

- `additional/kvm`: `libkvm.so`, the video C API the server links (`include/kvm_vision.h`;
  `libkvm.map` lists its exports).
- `additional/kvm_mmf`: `libkvm_mmf.so`, capture and encoding over the Sophgo middleware,
  with the LT6911 HDMI bridge started without the ISP.
- `additional/sophgo-middleware`: our copy of Sophgo's `sample_common_sensor.c`.
- `kvm_system`: the status, key and OLED daemon (OLED on the Full and PCIe boards only).
- `common/kvm_platform.hpp`: i2c-dev and time helpers shared by `libkvm` and `kvm_system`.
- `middleware-patches`: patches to `sophgo/cvi_mpi`.

All three are plain CMake targets (`CMakeLists.txt`, toolchain file
`cmake/thead-musl.cmake`) built with the T-Head musl GCC. CI's `build-native-libkvm` job is
the reference build; [Build and deploy the server](../../docs/development/cross-build.md)
shows how to run the same scripts locally.
