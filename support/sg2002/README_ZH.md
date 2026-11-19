# SG2002 原生代码

`libkvm_mmf.so` 使用普通 CMake（`CMakeLists.txt`，工具链文件
`cmake/buildroot-musl.cmake`）和构建根文件系统的 Buildroot musl GCC 构建，不再依赖 MaixCDK。
参考构建是 CI 的 `build-buildroot` 作业；本地构建步骤见 [README.md](README.md) 和
[Build and deploy the server](../../docs/development/cross-build.md)。
