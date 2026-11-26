#!/usr/bin/env bash
# Fetch and patch the Sophgo middleware source: cvi_mpi, the osdrv uapi headers and the sensor
# list, each at its pinned commit. Patches come from support/sg2002/middleware-patches.
# Usage: SOPHGO_CVI_MPI_SHA=... SOPHGO_OSDRV_SHA=... SOPHGO_SENSOR_LIST_SHA=... \
#          fetch-sophgo-middleware.sh DEST_DIR
# DEST_DIR gets cvi_mpi/, osdrv-uapi/ and sensor-list/.
set -euo pipefail

[ "$#" -eq 1 ] || {
	echo "usage: $0 DEST_DIR" >&2
	exit 2
}
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST=$1
PATCHES="$ROOT/support/sg2002/middleware-patches"

sparse_fetch() {
	dir="$1" url="$2" sha="$3"
	shift 3
	git init -q "$dir"
	git -C "$dir" remote add origin "$url"
	git -C "$dir" sparse-checkout set --no-cone "$@"
	git -C "$dir" fetch -q --depth 1 --filter=blob:none origin "$sha"
	git -C "$dir" checkout -q FETCH_HEAD
	[ "$(git -C "$dir" rev-parse HEAD)" = "$sha" ]
}

sparse_fetch "$DEST/cvi_mpi" https://github.com/sophgo/cvi_mpi.git \
	"$SOPHGO_CVI_MPI_SHA" \
	/Makefile.param /include/ /sample/common/ /component/panel/cv181x/ \
	/modules/sys/ /modules/venc/ /modules/vdec/ /modules/vi/ /modules/vpss/ /modules/vo/ \
	/modules/gdc/ /modules/rgn/ /modules/bin/include/ /modules/isp/include/cv181x/ \
	/modules/ive/include/ /3rdparty/inih/
sparse_fetch "$DEST/osdrv-uapi" https://github.com/sophgo/osdrv.git \
	"$SOPHGO_OSDRV_SHA" /interdrv/include/
sparse_fetch "$DEST/sensor-list" https://github.com/sophgo/SensorSupportList.git \
	"$SOPHGO_SENSOR_LIST_SHA" /common/

# Each patch is followed by a check that it changed what it should.
apply() {
	patch -d "$DEST/cvi_mpi" -p1 --forward --fuzz=0 <"$PATCHES/$1"
}
apply cvi-mpi-693a72a-no-vi-dbg-thread.patch
! grep -q vi_dbg_handler "$DEST/cvi_mpi/modules/vi/src/cvi_vi.c"
apply cvi-mpi-693a72a-map-through-cvi-sys.patch
! grep -q '"/dev/mem"' "$DEST/cvi_mpi/modules/sys/src/devmem.c"
apply cvi-mpi-693a72a-venc-persistent-pack-mappings.patch
grep -q VENC_MAP_WINDOWS "$DEST/cvi_mpi/modules/venc/src/cvi_venc.c"
apply cvi-mpi-693a72a-no-devmem-commands.patch
! grep -q 'system("devmem' "$DEST/cvi_mpi/modules/sys/src/cvi_sys.c"
apply cvi-mpi-693a72a-sensor-live-size-and-ini-bounds.patch
grep -q kvm_read_dimension "$DEST/cvi_mpi/sample/common/sample_common_sensor.c"
