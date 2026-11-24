#!/usr/bin/env bash
# Stage what libkvm_mmf.so compiles and links against into one directory (SG2002_SDK_DIR of
# support/sg2002/CMakeLists.txt): cvi_mpi's headers and sample code, the osdrv uapi headers,
# Sophgo's sensor list, and the middleware libraries scripts/build-sdk-middleware.sh built
# from the same cvi_mpi.
# Usage: stage-sg2002-sdk.sh MPI_DIR OSDRV_DIR SENSOR_LIST_DIR MIDDLEWARE_DIR OUT_DIR
set -euo pipefail

[ "$#" -eq 5 ] || {
	echo "usage: $0 MPI_DIR OSDRV_DIR SENSOR_LIST_DIR MIDDLEWARE_DIR OUT_DIR" >&2
	exit 2
}
MPI=$1
UAPI=$2/interdrv/include
SENSOR_LIST=$3/common
MIDDLEWARE=$4
OUT=$5
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)

for path in "$MPI/include/cvi_sys.h" "$UAPI/chip/cv181x/uapi/linux" "$SENSOR_LIST/sensor_list.c" \
	"$MIDDLEWARE/libsys.so"; do
	[ -e "$path" ] || {
		echo "missing: $path" >&2
		exit 1
	}
done
if [ -e "$OUT" ]; then
	echo "refusing to reuse output: $OUT" >&2
	exit 1
fi

mkdir -p "$OUT/include/isp/cv181x" "$OUT/uapi/linux" "$OUT/sample" "$OUT/modules/ive" \
	"$OUT/component/panel" "$OUT/component/isp/common" "$OUT/3rdparty" "$OUT/lib"
cp -r "$MPI/include/." "$OUT/include/"
# cvi_mpi's own uapi copy (cv180x cvi_defines.h): <linux/...> must come from osdrv.
rm -rf "$OUT/include/linux"
cp "$MPI"/modules/isp/include/cv181x/*.h "$OUT/include/isp/cv181x/"
cp "$UAPI"/common/uapi/linux/*.h "$UAPI"/chip/cv181x/uapi/linux/*.h "$OUT/uapi/linux/"
grep -q "define MO_TBL_SIZE 2048" "$OUT/uapi/linux/vi_uapi.h"
cp -r "$MPI/sample/common" "$OUT/sample/common"
cp -r "$MPI/modules/ive/include" "$OUT/modules/ive/include"
cp -r "$MPI/component/panel/cv181x" "$OUT/component/panel/cv181x"
cp -r "$MPI/3rdparty/inih" "$OUT/3rdparty/inih"
cp "$SENSOR_LIST"/sensor_list.[ch] "$OUT/component/isp/common/"

cp "$MIDDLEWARE"/lib{sys,venc,vdec,vi,vpss,vo,gdc,rgn,ini}.so "$OUT/lib/"

# Sensor names come from sensor_list.c, indexed by its own enum: the override must not
# carry a table of its own.
! grep -q "snsr_type_name\[SAMPLE_SNS_TYPE_BUTT\] =" \
	"$ROOT/support/sg2002/additional/sophgo-middleware/v2/sample/common/sample_common_sensor.c"
# Sophgo's name table has drifted from its enum before: check LT6911's slot.
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
cat > "$WORK/lt6911.c" <<'EOF'
#include <string.h>
#include "sensor_list.h"
int main(void)
{
	const char *n = snsr_type_name[LONTIUM_LT6911_2M_60FPS_8BIT];

	return !n || strcmp(n, "LONTIUM_LT6911_2M_60FPS_8BIT") != 0;
}
EOF
"${HOSTCC:-cc}" -DARCH_CV181X -D__CV181X__ -I"$OUT/include" -I"$OUT/include/isp/cv181x" \
	-I"$OUT/uapi" -I"$OUT/component/isp/common" "$WORK/lt6911.c" \
	"$OUT/component/isp/common/sensor_list.c" -o "$WORK/lt6911"
"$WORK/lt6911"
