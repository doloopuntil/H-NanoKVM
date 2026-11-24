# libkvm_mmf.so for the SG2002; the server (server-rust/src/capture) links it directly.
# cmake -S support/sg2002 -B build -DCMAKE_TOOLCHAIN_FILE=support/sg2002/cmake/buildroot-musl.cmake \
#   -DSG2002_CROSS_PREFIX=... -DSG2002_SDK_DIR=...   (scripts/stage-sg2002-sdk.sh makes the SDK dir)
cmake_minimum_required(VERSION 3.16)
project(hnanokvm_native C CXX)

set(SG2002_SDK_DIR "" CACHE PATH "Sophgo headers, sample code and middleware libraries")
if(NOT EXISTS "${SG2002_SDK_DIR}/include/cvi_sys.h")
	message(FATAL_ERROR "SG2002_SDK_DIR does not hold the staged Sophgo SDK: '${SG2002_SDK_DIR}'")
endif()
set(SDK "${SG2002_SDK_DIR}")

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_EXTENSIONS ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_POSITION_INDEPENDENT_CODE ON)
set(CMAKE_SKIP_RPATH ON)
add_compile_options(-Wall)

# libkvm_mmf.so: the media pipeline over the Sophgo middleware, LT6911 input only.
file(GLOB mw_sample_srcs "${SDK}/sample/common/*.c")
# No ISP: kvm_mmf_noisp.c stands in for lt6911_cmos.c.
list(FILTER mw_sample_srcs EXCLUDE REGEX "/(sample_common_bin|sample_common_platform)\\.c$")
set(mw_srcs
	${mw_sample_srcs}
	"${SDK}/component/isp/common/sensor_list.c")
set_source_files_properties(${mw_srcs} PROPERTIES COMPILE_OPTIONS
	"-ffunction-sections;-fdata-sections;-fvisibility=hidden")

add_library(kvm_mmf SHARED
	additional/kvm_mmf/src/kvm_mmf.cpp
	additional/kvm_mmf/src/kvm_mmf_noisp.c
	${mw_srcs})
target_include_directories(kvm_mmf
	PUBLIC additional/kvm_mmf/include
	PRIVATE
		"${SDK}/component/panel/cv181x"
		"${SDK}/include"
		"${SDK}/include/isp/cv181x"
		"${SDK}/sample/common"
		"${SDK}/uapi"
		"${SDK}/3rdparty/inih"
		"${SDK}/component/isp/common")
target_compile_definitions(kvm_mmf PRIVATE
	SENSOR_LONTIUM_LT6911 SENSOR2_TYPE=LONTIUM_LT6911_2M_60FPS_8BIT ARCH_CV181X __CV181X__)
# Video path: speed over size.
target_compile_options(kvm_mmf PRIVATE -O2)
target_link_options(kvm_mmf PRIVATE
	-Wl,--gc-sections
	-Wl,--version-script=${CMAKE_CURRENT_SOURCE_DIR}/additional/kvm_mmf/libkvm_mmf.map)
set_target_properties(kvm_mmf PROPERTIES
	LINK_DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/additional/kvm_mmf/libkvm_mmf.map)
target_link_directories(kvm_mmf PRIVATE "${SDK}/lib")
target_link_libraries(kvm_mmf PRIVATE sys vdec venc vi vpss vo gdc rgn ini pthread)
