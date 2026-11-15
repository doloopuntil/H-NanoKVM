# T-Head musl GCC for the SG2002's C906: the xthead extensions, no vector.
# SG2002_TOOLCHAIN_BIN: the toolchain's bin directory (scripts/fetch-thead-toolchain.sh prints it).
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR riscv64)

if(NOT SG2002_TOOLCHAIN_BIN)
	set(SG2002_TOOLCHAIN_BIN "$ENV{SG2002_TOOLCHAIN_BIN}")
endif()
if(NOT SG2002_TOOLCHAIN_BIN)
	message(FATAL_ERROR "set SG2002_TOOLCHAIN_BIN to the T-Head musl toolchain's bin directory")
endif()
set(SG2002_TOOLCHAIN_BIN "${SG2002_TOOLCHAIN_BIN}" CACHE PATH "T-Head musl toolchain bin directory")
list(APPEND CMAKE_TRY_COMPILE_PLATFORM_VARIABLES SG2002_TOOLCHAIN_BIN)

set(CMAKE_C_COMPILER "${SG2002_TOOLCHAIN_BIN}/riscv64-unknown-linux-musl-gcc")
set(CMAKE_CXX_COMPILER "${SG2002_TOOLCHAIN_BIN}/riscv64-unknown-linux-musl-g++")

set(SG2002_ARCH_FLAGS "-mcpu=c906fd -march=rv64imafdcxthead -mcmodel=medany -mabi=lp64d")
set(CMAKE_C_FLAGS_INIT "${SG2002_ARCH_FLAGS} -fstack-protector-strong")
set(CMAKE_CXX_FLAGS_INIT "${SG2002_ARCH_FLAGS} -fstack-protector-strong")
set(CMAKE_EXE_LINKER_FLAGS_INIT "-Wl,-z,relro,-z,now -Wl,--dynamic-linker=/lib/ld-musl-riscv64.so.1")
set(CMAKE_SHARED_LINKER_FLAGS_INIT "-Wl,-z,relro,-z,now -Wl,-z,defs")

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
