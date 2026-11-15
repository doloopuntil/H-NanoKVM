# Buildroot's musl GCC (the one that builds the rootfs) for the SG2002's C906:
# the T-Head scalar extensions musl is built with, no vector.
# SG2002_CROSS_PREFIX: e.g. <buildroot output>/host/bin/riscv64-buildroot-linux-musl-
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR riscv64)

if(NOT SG2002_CROSS_PREFIX)
	set(SG2002_CROSS_PREFIX "$ENV{SG2002_CROSS_PREFIX}")
endif()
if(NOT SG2002_CROSS_PREFIX)
	message(FATAL_ERROR "set SG2002_CROSS_PREFIX to Buildroot's host/bin/riscv64-buildroot-linux-musl-")
endif()
set(SG2002_CROSS_PREFIX "${SG2002_CROSS_PREFIX}" CACHE STRING "Buildroot cross-compiler prefix")
list(APPEND CMAKE_TRY_COMPILE_PLATFORM_VARIABLES SG2002_CROSS_PREFIX)

set(CMAKE_C_COMPILER "${SG2002_CROSS_PREFIX}gcc")
set(CMAKE_CXX_COMPILER "${SG2002_CROSS_PREFIX}g++")

# The same -march as MUSL_EXTRA_CFLAGS in external.mk; the wrapper adds none when one is given.
set(SG2002_ARCH_FLAGS "-march=rv64imafdc_zicsr_zifencei_xtheadba_xtheadbb_xtheadbs_xtheadcondmov_xtheadmemidx_xtheadmempair_xtheadmac -mabi=lp64d -mtune=thead-c906")
set(CMAKE_C_FLAGS_INIT "${SG2002_ARCH_FLAGS} -fstack-protector-strong")
set(CMAKE_CXX_FLAGS_INIT "${SG2002_ARCH_FLAGS} -fstack-protector-strong")
set(CMAKE_EXE_LINKER_FLAGS_INIT "-Wl,-z,relro,-z,now")
set(CMAKE_SHARED_LINKER_FLAGS_INIT "-Wl,-z,relro,-z,now -Wl,-z,defs")

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
