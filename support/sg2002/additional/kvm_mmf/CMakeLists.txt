
list(APPEND ADD_REQUIREMENTS basic ini)
list(APPEND ADD_INCLUDE "include")

# sophgo-middleware
set(middleware_src_path "${CMAKE_CURRENT_SOURCE_DIR}/../3rd_party/sophgo-middleware/sophgo-middleware")


set(source_dir "src")
append_srcs_dir(ADD_SRCS "${source_dir}")

# middleware
set(middleware_include_dir .
    ${middleware_src_path}/v2/component/panel/${CONFIG_SOPHGO_MIDDLEWARE_CHIP}
    ${middleware_src_path}/v2/include
    ${middleware_src_path}/v2/include/isp/${CONFIG_SOPHGO_MIDDLEWARE_CHIP}
    ${middleware_src_path}/v2/sample/common
    ${middleware_src_path}/v2/uapi
    ${middleware_src_path}/v2/3rdparty/inih
    ${middleware_src_path}/v2/modules/ive/include/
    ${middleware_src_path}/v2/component/isp/common
)
list(APPEND ADD_INCLUDE ${middleware_include_dir})
set_property(SOURCE ${middleware_include_dir} PROPERTY GENERATED 1)

append_srcs_dir(middleware_src_dir  ${middleware_src_path}/v2/sample/common
                                    ${middleware_src_path}/v2/component/isp/common
                                    ${middleware_src_path}/v2/component/isp/sensor/sg200x/lontium_lt6911
                                    )
# No ISP: src/kvm_mmf_noisp.c replaces lt6911_cmos.c; the ISP parts of the
# sample code are dropped by --gc-sections.
list(FILTER middleware_src_dir EXCLUDE REGEX "/(sample_common_bin|sample_common_platform|lt6911_cmos)\\.c$")
list(APPEND ADD_PRIVATE_INCLUDE ${middleware_src_path}/v2/component/isp/sensor/sg200x/lontium_lt6911)
set_property(SOURCE ${middleware_src_dir} APPEND PROPERTY COMPILE_OPTIONS
             -ffunction-sections -fdata-sections -fvisibility=hidden)
list(APPEND ADD_LINK_DEFINITIONS_PRIVATE -Wl,--gc-sections)

list(APPEND ADD_SRCS        ${middleware_src_dir}
                            "${source_dir}/kvm_mmf.cpp")
set_property(SOURCE ${middleware_src_dir} PROPERTY GENERATED 1)

set(middleware_static_lib_file  "")
    list(APPEND ADD_STATIC_LIB ${middleware_static_lib_file})
set_property(SOURCE ${middleware_static_lib_file} PROPERTY GENERATED 1)

set(mmf_lib_dir ${middleware_src_path}/v2/lib)

if(CONFIG_SOPHGO_MIDDLEWARE_C_LIBRARY STREQUAL "musl")
    set(middleware_dynamic_lib_file     ${mmf_lib_dir}/libsys.so
                                        ${mmf_lib_dir}/libvdec.so
                                        ${mmf_lib_dir}/libvenc.so
                                        ${mmf_lib_dir}/libvi.so
                                        ${mmf_lib_dir}/libvpss.so
                                        ${mmf_lib_dir}/libvo.so
                                        ${mmf_lib_dir}/libgdc.so
                                        ${mmf_lib_dir}/librgn.so
                                        ${mmf_lib_dir}/3rd/libini.so)
elseif(CONFIG_SOPHGO_MIDDLEWARE_C_LIBRARY STREQUAL "glibc")
    set(middleware_dynamic_lib_file     ${mmf_lib_dir}/libcvi_vb.so
                                        ${mmf_lib_dir}/libcvi_sys.so
                                        ${mmf_lib_dir}/libcvi_debug.so
    )
else()
    message(FATAL_ERROR "No sophgo middleware c library support, please check menuoconfig to select c library")
endif()
list(APPEND ADD_DYNAMIC_LIB ${middleware_dynamic_lib_file})
set_property(SOURCE ${middleware_dynamic_lib_file} PROPERTY GENERATED 1)

list(APPEND ADD_DEFINITIONS_PRIVATE -DSENSOR_LONTIUM_LT6911
                                -DSENSOR2_TYPE=LONTIUM_LT6911_2M_60FPS_8BIT
                                -DARCH_CV181X -D__CV181X__)
# Video path: speed over the MinSizeRel default (-Os).
list(APPEND ADD_DEFINITIONS_PRIVATE -O2)


register_component(DYNAMIC)
