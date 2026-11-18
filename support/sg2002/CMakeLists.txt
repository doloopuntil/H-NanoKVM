# libkvm_mmf.so and libkvm.so for the SG2002.
# cmake -S support/sg2002 -B build -DCMAKE_TOOLCHAIN_FILE=support/sg2002/cmake/buildroot-musl.cmake \
#   -DSG2002_CROSS_PREFIX=... -DSG2002_SDK_DIR=...   (scripts/stage-sg2002-sdk.sh makes the SDK dir)
cmake_minimum_required(VERSION 3.16)
project(hnanokvm_native C CXX)

set(SG2002_SDK_DIR "" CACHE PATH "Sophgo headers, sample code, LT6911 driver and middleware libraries")
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

# libkvm_mmf.so: the media pipeline over the Sophgo middleware, with the LT6911 sensor driver.
file(GLOB mw_sample_srcs "${SDK}/sample/common/*.c")
# No ISP: kvm_mmf_noisp.c stands in for lt6911_cmos.c; our sample_common_sensor.c replaces Sophgo's.
list(FILTER mw_sample_srcs EXCLUDE REGEX "/(sample_common_bin|sample_common_platform|sample_common_sensor)\\.c$")
set(mw_srcs
	${mw_sample_srcs}
	additional/sophgo-middleware/v2/sample/common/sample_common_sensor.c
	"${SDK}/component/isp/common/sensor_list.c"
	"${SDK}/component/isp/sensor/lontium_lt6911/lt6911_sensor_ctl.c")
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
		"${SDK}/component/isp/common"
		"${SDK}/component/isp/sensor/lontium_lt6911")
target_compile_definitions(kvm_mmf PRIVATE
	SENSOR_LONTIUM_LT6911 SENSOR2_TYPE=LONTIUM_LT6911_2M_60FPS_8BIT ARCH_CV181X __CV181X__)
# Video path: speed over size.
target_compile_options(kvm_mmf PRIVATE -O2)
target_link_options(kvm_mmf PRIVATE -Wl,--gc-sections)
target_link_directories(kvm_mmf PRIVATE "${SDK}/lib")
target_link_libraries(kvm_mmf PRIVATE sys vdec venc vi vpss vo gdc rgn ini pthread)

# libkvm.so: the C API the server links (kvm_vision.h); libkvm.map lists every export.
add_library(kvm SHARED
	additional/kvm/src/kvm_capture.cpp
	additional/kvm/src/kvm_vision.cpp
	additional/kvm/src/vi_state_shared.cpp)
target_include_directories(kvm PRIVATE additional/kvm/include common)
target_compile_options(kvm PRIVATE -O2)
target_link_options(kvm PRIVATE
	-Wl,--as-needed
	-Wl,--version-script=${CMAKE_CURRENT_SOURCE_DIR}/additional/kvm/libkvm.map)
set_target_properties(kvm PROPERTIES LINK_DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/additional/kvm/libkvm.map)
target_link_libraries(kvm PRIVATE kvm_mmf pthread)
