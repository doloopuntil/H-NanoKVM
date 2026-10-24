#!/usr/bin/env bash
# Build libsys, libvenc, libvdec, libvi, libvpss, libvo, libgdc, librgn and libini from
# sophgo/cvi_mpi, with the flags its Makefiles use for musl_riscv64 on CV181X.
# Usage: build-sdk-middleware.sh MPI_DIR OSDRV_DIR SDK_DIR OUTPUT_DIR TOOLCHAIN_BIN [REFERENCE_DIR]
# OSDRV_DIR: sophgo/osdrv of the same release (uapi headers). SDK_DIR: ION uapi of our kernel.
# REFERENCE_DIR: libraries whose exported symbols each new library must keep.
set -euo pipefail

[ "$#" -ge 5 ] || {
	echo "usage: $0 MPI_DIR OSDRV_DIR SDK_DIR OUTPUT_DIR TOOLCHAIN_BIN [REFERENCE_DIR]" >&2
	exit 2
}
MW=$1
OSDRV_DIR=$2
SDK_DIR=$3
OUTPUT_DIR=$4
TOOLCHAIN_BIN=$5
REFERENCE_DIR=${6:-}
OPT_FLAGS=${SDK_MIDDLEWARE_OPT_FLAGS:--Os}
PREFIX="$TOOLCHAIN_BIN/riscv64-unknown-linux-musl-"
UAPI="$OSDRV_DIR/interdrv/include"

for path in "$MW/Makefile.param" "$UAPI/common/uapi/linux" "$UAPI/chip/cv181x/uapi/linux" \
	"$SDK_DIR/linux_5.10/drivers/staging/android/uapi/ion_cvitek.h" "${PREFIX}gcc"; do
	[ -e "$path" ] || {
		echo "missing: $path" >&2
		exit 1
	}
done
if [ -e "$OUTPUT_DIR" ]; then
	echo "refusing to reuse output: $OUTPUT_DIR" >&2
	exit 1
fi
mkdir -p "$OUTPUT_DIR"
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

# What the SDK installs as kernel headers for the middleware.
KINC="$WORK/kinc"
mkdir -p "$KINC/linux"
cp "$UAPI"/common/uapi/linux/* "$KINC/linux/"
cp "$UAPI"/chip/cv181x/uapi/linux/* "$KINC/linux/"
cp "$SDK_DIR"/linux_5.10/drivers/staging/android/uapi/ion*.h "$KINC/linux/"

# No vector extension: nothing we ship needs XTheadVector.
CFLAGS="$OPT_FLAGS -mcpu=c906fd -march=rv64imafdcxthead -mcmodel=medany -mabi=lp64d"
CFLAGS="$CFLAGS -std=gnu11 -fPIC -ffunction-sections -fdata-sections -mno-ldd"
CFLAGS="$CFLAGS -DARCH_CV181X -D__CV181X__ -ffile-prefix-map=$MW=/usr/src/cvi_mpi"
# cvi_mpi's include/ carries its own copy of the uapi headers (a cv180x cvi_defines.h among
# them); leave it out so <linux/...> resolves to the osdrv headers above.
MW_INC="$WORK/mwinc"
cp -r "$MW/include" "$MW_INC"
rm -rf "$MW_INC/linux"
SYS_INC=$MW/modules/sys/include
BIN_INC=$MW/modules/bin/include
ISP_INC=$MW/modules/isp/include/cv181x
VI_INC=$MW/modules/vi/include
VPSS_INC=$MW/modules/vpss/include
VO_INC=$MW/modules/vo/include
GDC_INC=$MW/modules/gdc/include
RGN_INC=$MW/modules/rgn/include

# build NAME SRC_DIR "CFLAGS" cc|ld "LIBS" [EXCLUDED_SOURCE...]
build() {
	local name=$1 dir=$2 extra=$3 link=$4 libs=$5
	shift 5
	local objs=() src base obj opt
	for src in "$dir"/*.c; do
		base=$(basename "$src")
		case " $* " in *" $base "*) continue ;; esac
		obj="$WORK/$name-${base%.c}.o"
		opt=""
		[ "$base" = gdc_mesh.c ] && opt=-O3
		# shellcheck disable=SC2086
		(cd "$(dirname "$dir")" && "${PREFIX}gcc" $CFLAGS $extra $opt -c "$src" -o "$obj")
		objs+=("$obj")
	done
	if [ "$link" = cc ]; then
		"${PREFIX}gcc" -shared -fPIC -Wl,--gc-sections -o "$OUTPUT_DIR/lib$name.so" \
			-Wl,--start-group "${objs[@]}" -Wl,--end-group
	else
		# shellcheck disable=SC2086
		"${PREFIX}ld" -shared --gc-sections -export-dynamic -L"$OUTPUT_DIR" $libs \
			-o "$OUTPUT_DIR/lib$name.so" --start-group "${objs[@]}" --end-group
	fi
	"${PREFIX}strip" --strip-unneeded "$OUTPUT_DIR/lib$name.so"
}

build sys "$MW/modules/sys/src" "-I$MW_INC -I$KINC -I$SYS_INC -I$VI_INC -I$VPSS_INC \
-fpack-struct=8 -DMMF_VERSION=\"cvi_mpi\" -DSDK_VER=\"musl_riscv64\" -D_FILE_OFFSET_BITS=64" \
cc "" cvi_rpc.c
build venc "$MW/modules/venc/src" "-I$MW_INC -I$KINC -I$SYS_INC" ld -lsys
build vdec "$MW/modules/vdec/src" "-I$MW_INC -I$KINC -I$SYS_INC" ld ""
build vi "$MW/modules/vi/src" "-I$MW_INC -I$ISP_INC -I$SYS_INC -I$KINC -I$BIN_INC -I$VI_INC \
-I$GDC_INC" ld ""
build vpss "$MW/modules/vpss/src" "-I$MW_INC -I$ISP_INC -I$SYS_INC -I$BIN_INC -I$VPSS_INC \
-I$GDC_INC -I$KINC" ld ""
build vo "$MW/modules/vo/src" "-I$MW_INC -I$ISP_INC -I$KINC -I$SYS_INC -I$BIN_INC -I$VO_INC \
-I$GDC_INC" ld ""
build gdc "$MW/modules/gdc/src" "-I$MW_INC -I$ISP_INC -I$SYS_INC -I$BIN_INC -I$KINC -I$GDC_INC \
-I$VI_INC -I$VPSS_INC -I$RGN_INC" ld ""
# osd_cmpr.h includes "cvi_type.h" from the uapi directory itself.
build rgn "$MW/modules/rgn/src" "-I$MW_INC -I$KINC -I$KINC/linux -I$SYS_INC -I$BIN_INC -I$RGN_INC" ld ""
build ini "$MW/3rdparty/inih" "" ld ""

exports() {
	"${PREFIX}nm" -D --defined-only "$1" | awk '$2 ~ /^[TDBRV]$/ {print $3}' | sort -u
}
LIBS="libsys.so libvenc.so libvdec.so libvi.so libvpss.so libvo.so libgdc.so librgn.so libini.so"
for lib in $LIBS; do
	echo "$lib: $(exports "$OUTPUT_DIR/$lib" | wc -l) exports"
done
# Every export of the reference libraries must still exist; libvpu's moved to its split parts.
# Removed upstream and unused by anything we ship (GDC affine/warp/fisheye, region colour
# inversion, decoder fds, a libsys test hook). Any other loss fails the build.
ALLOWED_MISSING="vb_ioctl_unit_test
CVI_VDEC_GetFd
CVI_VDEC_CloseFd
CVI_GDC_AddAffineTask
CVI_GDC_AddCnvWarpTask
CVI_GDC_AddCorrectionTask
CVI_GDC_AddCorrectionTaskCNV
CVI_RGN_Invert_Color
CVI_VI_GetExtChnFisheye
CVI_VI_SetExtChnFisheye
mesh_gen_cnv
mesh_gen_fisheye
rgn_invert_color"
if [ -n "$REFERENCE_DIR" ]; then
	for ref in libsys.so libvenc.so libvdec.so libvpu.so libini.so; do
		# shellcheck disable=SC2086
		missing=$(comm -23 <(exports "$REFERENCE_DIR/$ref") \
			<(cd "$OUTPUT_DIR" && for lib in $LIBS; do exports "$lib"; done | sort -u) |
			grep -vxF "$ALLOWED_MISSING" || true)
		if [ -n "$missing" ]; then
			echo "$ref exports missing from the new libraries: $missing" >&2
			exit 1
		fi
	done
fi
(cd "$OUTPUT_DIR" && sha256sum ./*.so > SHA256SUMS)
