#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
VENDOR_SDK_DIR="${HARDENED_SG2002_VENDOR_SDK_DIR:-$ROOT_DIR/build/vendor/LicheeRV-Nano-Build}"
KERNEL_BASELINE_DIR="${KERNEL_BASELINE_OUTPUT_DIR:-$ROOT_DIR/build/latestbuildroot/kernel-baseline-5.10.4-v2}"
MODULE_PROVENANCE_DIR="${MODULE_PROVENANCE_DIR:-$ROOT_DIR/build/latestbuildroot/module-provenance-raw10-v5}"
RUNTIME_MODULE_DIR="${VENDOR_MODULE_SOURCE_DIR:-$ROOT_DIR/build/latestbuildroot/vendor-runtime-source-media-v1/system/ko}"
OUTPUT_DIR="${EXTERNAL_MODULE_BASELINE_OUTPUT_DIR:-$ROOT_DIR/build/latestbuildroot/external-modules-5.10.4-v3}"
SOURCE_DIR="$OUTPUT_DIR/osdrv"
BUILD_CONFIG_DIR="$OUTPUT_DIR/build-config"
BUILD_CONFIG_REFERENCE="${HARDENED_SG2002_BUILD_CONFIG:-$ROOT_DIR/support/sg2002/kernel/5.10.265/reference/vendor-sdk-build.config}"
INSTALL_DIR="$OUTPUT_DIR/install"
ARTIFACT_DIR="$OUTPUT_DIR/artifacts"
REPORT_DIR="$OUTPUT_DIR/report"
TOOLCHAIN_BIN="$VENDOR_SDK_DIR/host-tools/gcc/riscv64-linux-musl-x86_64/bin"
TOOLCHAIN_PREFIX="$TOOLCHAIN_BIN/riscv64-unknown-linux-musl-"
STRIP="${TOOLCHAIN_PREFIX}strip"
PROVENANCE_MANIFEST="$MODULE_PROVENANCE_DIR/report/module-provenance.tsv"
REFERENCE_OSDRV_PATH="$VENDOR_SDK_DIR/osdrv"
REFERENCE_SOURCE_DATE_EPOCH="1782670640"
EXPECTED_KERNEL_RELEASE="${EXPECTED_KERNEL_RELEASE:-}"
# Candidate mode: interdrv/ and the top Makefile come from this sophgo/osdrv checkout.
SOPHGO_OSDRV_DIR="${SOPHGO_OSDRV_DIR:-}"
PATCH_DIR="$ROOT_DIR/buildroot-external/hardened-sg2002/board/sg2002/kernel/patches"
CANDIDATE_PATCHES=(
	"$PATCH_DIR/sophgo-osdrv-1b3a496-soph-module-names.patch"
	"$PATCH_DIR/sophgo-osdrv-1b3a496-linux-5.10.265-compat.patch"
	"$PATCH_DIR/sophgo-osdrv-1b3a496-pwm-from-28215f2.patch"
	"$PATCH_DIR/sophgo-osdrv-1b3a496-lt-int.patch"
	"$PATCH_DIR/sophgo-osdrv-1b3a496-vi-log-level.patch"
	"$PATCH_DIR/sophgo-osdrv-1b3a496-vi-dci-yuv-bypass.patch"
	"$PATCH_DIR/sophgo-osdrv-1b3a496-sys-carveout-allocator.patch"
	"$PATCH_DIR/sophgo-osdrv-1b3a496-venc-fixes.patch"
)
# Built with interdrv in candidate mode; packaged separately from the 29-module inventory.
MEDIA_MODULES=(soph_vcodec.ko soph_jpeg.ko soph_vc_driver.ko)
MEDIA_ARTIFACT_DIR="$OUTPUT_DIR/media-artifacts"

require_command() {
	command -v "$1" >/dev/null 2>&1 || {
		echo "required command is missing: $1" >&2
		exit 1
	}
}

for command in make modinfo patch rsync sha256sum sort
do
	require_command "$command"
done

for path in \
	"$VENDOR_SDK_DIR/osdrv" \
	"$BUILD_CONFIG_REFERENCE" \
	"$KERNEL_BASELINE_DIR/.config" \
	"$KERNEL_BASELINE_DIR/Module.symvers" \
	"$KERNEL_BASELINE_DIR/include/generated/utsrelease.h" \
	"$KERNEL_BASELINE_DIR/arch/riscv/boot/Image" \
	"$KERNEL_BASELINE_DIR/vmlinux" \
	"$RUNTIME_MODULE_DIR" \
	"$PROVENANCE_MANIFEST" \
	"${TOOLCHAIN_PREFIX}gcc" \
	"$STRIP"
do
	[ -e "$path" ] || {
		echo "required external-module rebuild input is missing: $path" >&2
		exit 1
	}
done

kernel_release="$(sed -n 's/^#define UTS_RELEASE "\(.*\)"$/\1/p' \
	"$KERNEL_BASELINE_DIR/include/generated/utsrelease.h")"
[ -n "$kernel_release" ] || {
	echo "cannot read kernel release from candidate output" >&2
	exit 1
}
if [ -n "$EXPECTED_KERNEL_RELEASE" ] && \
	[ "$kernel_release" != "$EXPECTED_KERNEL_RELEASE" ]; then
	echo "unexpected external-module kernel release: $kernel_release" >&2
	exit 1
fi
if [ -n "$EXPECTED_KERNEL_RELEASE" ]; then
	build_mode=candidate
	for path in "$SOPHGO_OSDRV_DIR/interdrv/include" "$SOPHGO_OSDRV_DIR/Makefile" "${CANDIDATE_PATCHES[@]}"
	do
		[ -e "$path" ] || {
			echo "missing external-module candidate input: $path" >&2
			exit 1
		}
	done
else
	build_mode=byte-exact-baseline
fi

if [ -e "$OUTPUT_DIR" ]; then
	echo "refusing to overwrite external-module baseline output: $OUTPUT_DIR" >&2
	exit 1
fi

mkdir -p "$SOURCE_DIR" "$BUILD_CONFIG_DIR" "$INSTALL_DIR/3rd" "$ARTIFACT_DIR" "$REPORT_DIR"
cp "$BUILD_CONFIG_REFERENCE" "$BUILD_CONFIG_DIR/.config"
sha256sum "$BUILD_CONFIG_REFERENCE" > "$REPORT_DIR/build-config-sha256.txt"

rsync -a \
	--exclude='*.o' \
	--exclude='*.ko' \
	--exclude='*.mod' \
	--exclude='*.mod.c' \
	--exclude='*.cmd' \
	--exclude='Module.symvers' \
	--exclude='modules.order' \
	"$VENDOR_SDK_DIR/osdrv/" "$SOURCE_DIR/"

TARGETS=(
	sys base pwm rtc wdt mon clock_cooling saradc wiegand
	vi snsr_i2c cif vpss dwa rgn vo rtos_cmdqu fast_image ive fb
	wireless tp wiegand-gpio
)
CHIP_ENV=(CHIP_ARCH=SG200X CHIP_CODE=MARS)

if [ "$build_mode" = candidate ]; then
	# The SDK keeps extdrv/; all video and codec modules come from one sophgo/osdrv commit.
	rsync -a --delete --exclude='.git' "$SOPHGO_OSDRV_DIR/interdrv/" "$SOURCE_DIR/interdrv/"
	cp "$SOPHGO_OSDRV_DIR/Makefile" "$SOURCE_DIR/Makefile"
	git -C "$SOPHGO_OSDRV_DIR" rev-parse HEAD > "$REPORT_DIR/sophgo-osdrv-commit.txt"
	for patch_file in "${CANDIDATE_PATCHES[@]}"
	do
		patch --directory="$SOURCE_DIR" --strip=1 --forward --fuzz=0 --dry-run \
			--input="$patch_file"
		patch --directory="$SOURCE_DIR" --strip=1 --forward --fuzz=0 \
			--input="$patch_file"
	done
	sha256sum "${CANDIDATE_PATCHES[@]}" > "$REPORT_DIR/candidate-patch-sha256.txt"
	TARGETS+=(vcodec jpeg cvi_vc_drv)
	CHIP_ENV=(CVIARCH=CV181X CHIP_ARCH=CV181X SDK_VER=musl_riscv64)
fi

sha256sum \
	"$KERNEL_BASELINE_DIR/.config" \
	"$KERNEL_BASELINE_DIR/Module.symvers" \
	"$KERNEL_BASELINE_DIR/arch/riscv/boot/Image" \
	"$KERNEL_BASELINE_DIR/vmlinux" > "$REPORT_DIR/kernel-input-before.sha256"

(
	cd "$SOURCE_DIR"
	for target in "${TARGETS[@]}"
	do
		env -i \
			HOME="${HOME:-/home/w0w}" \
			USER="${USER:-w0w}" \
			LOGNAME="${LOGNAME:-${USER:-w0w}}" \
			SHELL=/bin/bash \
			PATH="$TOOLCHAIN_BIN:/usr/bin:/bin" \
			PWD="$SOURCE_DIR" \
			TZ=UTC \
			SOURCE_DATE_EPOCH="$REFERENCE_SOURCE_DATE_EPOCH" \
			BUILD_PATH="$BUILD_CONFIG_DIR" \
			"${CHIP_ENV[@]}" \
			MW_VER=v2 \
			ARCH=riscv \
			CROSS_COMPILE="${TOOLCHAIN_PREFIX}" \
			KCFLAGS="-fmacro-prefix-map=$SOURCE_DIR=$REFERENCE_OSDRV_PATH" \
			make KERNEL_DIR="$KERNEL_BASELINE_DIR" \
				INSTALL_DIR="$INSTALL_DIR" "$target"
	done
)

sha256sum \
	"$KERNEL_BASELINE_DIR/.config" \
	"$KERNEL_BASELINE_DIR/Module.symvers" \
	"$KERNEL_BASELINE_DIR/arch/riscv/boot/Image" \
	"$KERNEL_BASELINE_DIR/vmlinux" > "$REPORT_DIR/kernel-input-after.sha256"
cmp -s "$REPORT_DIR/kernel-input-before.sha256" "$REPORT_DIR/kernel-input-after.sha256" || {
	echo "external-module build modified clean kernel baseline inputs" >&2
	exit 1
}

if [ "$build_mode" = candidate ]; then
	mkdir -p "$MEDIA_ARTIFACT_DIR"
	for module in "${MEDIA_MODULES[@]}"
	do
		[ -f "$INSTALL_DIR/$module" ] || {
			echo "media module was not built: $module" >&2
			exit 1
		}
		mv "$INSTALL_DIR/$module" "$MEDIA_ARTIFACT_DIR/$module"
		"$STRIP" --strip-unneeded "$MEDIA_ARTIFACT_DIR/$module"
	done
	find "$MEDIA_ARTIFACT_DIR" -type f -exec touch -d '@0' {} +
fi

EXPECTED_LIST="$REPORT_DIR/expected-modules.txt"
BUILT_LIST="$REPORT_DIR/built-modules.txt"
awk -F '\t' 'NR > 1 && $2 == "rebuilt-vendor-module" {print $1}' \
	"$PROVENANCE_MANIFEST" | LC_ALL=C sort > "$EXPECTED_LIST"
find "$INSTALL_DIR" -type f -name '*.ko' -printf '%P\n' | LC_ALL=C sort > "$BUILT_LIST"
cmp -s "$EXPECTED_LIST" "$BUILT_LIST" || {
	echo "rebuilt external-module inventory differs from expected inventory" >&2
	diff -u "$EXPECTED_LIST" "$BUILT_LIST" >&2 || true
	exit 1
}

MANIFEST="$REPORT_DIR/rebuild-comparison.tsv"
printf 'module\taccepted_sha256\tbuilt_sha256\tpackaged_sha256\tvermagic\tsrcversion\tstatus\n' > "$MANIFEST"

total=0
matches=0
mismatches=0
vermagic_failures=0
while IFS= read -r relative
do
	total=$((total + 1))
	built="$INSTALL_DIR/$relative"
	accepted="$RUNTIME_MODULE_DIR/$relative"
	[ -f "$built" ]
	[ -f "$accepted" ]

	artifact="$ARTIFACT_DIR/$relative"
	mkdir -p "$(dirname "$artifact")"
	cp "$built" "$artifact"
	built_sha256="$(sha256sum "$artifact" | awk '{print $1}')"
	"$STRIP" --strip-unneeded "$artifact"
	packaged_sha256="$(sha256sum "$artifact" | awk '{print $1}')"
	accepted_sha256="$(sha256sum "$accepted" | awk '{print $1}')"
	vermagic="$(modinfo -F vermagic "$artifact" 2>/dev/null | tr '\r\n' ' ')"
	srcversion="$(modinfo -F srcversion "$artifact" 2>/dev/null | tr '\r\n' ' ')"

	if [ "$packaged_sha256" = "$accepted_sha256" ]; then
		status=match
		matches=$((matches + 1))
	else
		if [ "$build_mode" = candidate ]; then
			status=candidate-changed
		else
			status=mismatch
		fi
		mismatches=$((mismatches + 1))
	fi
	case "$vermagic" in
		"$kernel_release "*) ;;
		*)
			status=vermagic-mismatch
			vermagic_failures=$((vermagic_failures + 1))
			;;
	esac
	printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
		"$relative" "$accepted_sha256" "$built_sha256" "$packaged_sha256" \
		"$vermagic" "$srcversion" "$status" >> "$MANIFEST"
done < "$EXPECTED_LIST"

find "$ARTIFACT_DIR" -type f -exec touch -d '@0' {} +
sha256sum "$MANIFEST" > "$REPORT_DIR/SHA256SUMS"

cat > "$REPORT_DIR/summary.md" <<EOF
# Vendor external-module $build_mode rebuild

- pinned kernel baseline: \`$KERNEL_BASELINE_DIR\`
- isolated osdrv source: \`$SOURCE_DIR\`
- expected/rebuilt modules: **$total/$total**
- target kernel release: **$kernel_release**
- build mode: **$build_mode**
- packaged byte matches: **$matches**
- packaged mismatches: **$mismatches**
- vermagic failures: **$vermagic_failures**
- kernel baseline input mutation: **none**

The build uses the pinned board config, Xuantie GCC/binutils, the source tree's chip
middleware settings, and the selected clean kernel output. Every module is
normalized with the same pinned \`strip --strip-unneeded\` packaging transform
before comparison with the accepted raw.10 module. The original osdrv source
prefix and compile-time macros are reproduced with \`-fmacro-prefix-map\` and
the recorded source-date epoch; this changes only build metadata embedded by
\`__FILE__\`, \`__DATE__\`, and \`__TIME__\`.
EOF

cat "$REPORT_DIR/summary.md"
if [ "$vermagic_failures" -ne 0 ]; then
	echo "external-module rebuild produced $vermagic_failures vermagic failures" >&2
	exit 2
fi
if [ "$build_mode" = byte-exact-baseline ] && [ "$mismatches" -ne 0 ]; then
	echo "external-module rebuild produced $mismatches mismatches" >&2
	exit 2
fi
printf 'external-module report: %s\n' "$REPORT_DIR/summary.md"
