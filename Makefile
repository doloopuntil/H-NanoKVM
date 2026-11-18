# Makefile for NanoKVM Project

# Configuration
RUST_TARGET ?=
RUST_BUILD_ARGS := --manifest-path server-rust/Cargo.toml --release --locked
ifneq ($(strip $(RUST_TARGET)),)
RUST_BUILD_ARGS += --target $(RUST_TARGET)
endif

SYSTEM_UPDATE_VERSION ?= 0.0.0-dev
SYSTEM_UPDATE_TARGET ?= sg2002-hnanokvm-sd
SYSTEM_UPDATE_PAYLOAD ?= build/system-update-payload
SYSTEM_UPDATE_OUT ?= build/system-updates
SYSTEM_UPDATE_TAG ?= hardened-system-$(SYSTEM_UPDATE_VERSION)

.PHONY: help rust-app web-app rust-kvmapp latest-buildroot-bootstrap latest-buildroot-security-source latest-buildroot-sg2002-configure latest-buildroot-sg2002-rootfs system-update-bundle system-update-metadata test-system-update-v2 test-latest-buildroot-security-policy all clean

# Default target
all: rust-kvmapp

# Help target
help:
	@echo "NanoKVM Build System"
	@echo ""
	@echo "Available targets:"
	@echo "  help          - Show this help message"
	@echo "  rust-app      - Build Rust application server"
	@echo "  web-app       - Build frontend into web/dist"
	@echo "  rust-kvmapp   - Package Rust backend into build/kvmapp-rust"
	@echo "  latest-buildroot-bootstrap - Fetch the isolated upstream Buildroot 2026.05.1 port probe"
	@echo "  latest-buildroot-security-source - Prepare the pinned Buildroot security-patched source"
	@echo "  latest-buildroot-sg2002-configure - Configure the tracked SG2002 BR2_EXTERNAL port skeleton"
	@echo "  latest-buildroot-sg2002-rootfs - Build the SG2002 Buildroot 2026.05.1 rootfs candidate"
	@echo "  system-update-bundle   - Package a staged system-update payload"
	@echo "  system-update-metadata - Generate GitHub latest JSON for the system bundle"
	@echo "  test-system-update-v2 - Test metadata/manifest v2 and minimum-app enforcement artifacts"
	@echo "  test-latest-buildroot-security-policy - Verify the tracked Buildroot security policy"
	@echo "  all           - Build Rust kvmapp (default)"
	@echo "  clean         - Clean build artifacts"
	@echo ""
	@echo "The SG2002 native code (libkvm, libkvm_mmf): docs/development/cross-build.md"

# Build Rust application locally
rust-app:
	@echo "Building Rust app..."
	@cargo build $(RUST_BUILD_ARGS)

# Build frontend assets
web-app:
	@echo "Building frontend..."
	@cd web && corepack pnpm install --frozen-lockfile && corepack pnpm build

# Package Rust backend into the kvmapp deployment layout
rust-kvmapp: rust-app
	@echo "Packaging Rust kvmapp..."
	@RUST_TARGET="$(RUST_TARGET)" scripts/package-rust-kvmapp.sh

# Fetch Buildroot 2026.05.1 and prepare it with the tracked security patches.
latest-buildroot-bootstrap:
	@scripts/bootstrap-latest-buildroot-probe.sh

latest-buildroot-security-source: latest-buildroot-bootstrap
	@scripts/prepare-buildroot-2026.05.1-security-source.sh

latest-buildroot-sg2002-configure: latest-buildroot-bootstrap
	@scripts/configure-latest-buildroot-sg2002.sh

latest-buildroot-sg2002-rootfs:
	@scripts/build-latest-buildroot-sg2002-rootfs.sh

# Package a staged system-update payload.
# Expected payload layout:
#   $(SYSTEM_UPDATE_PAYLOAD)/boot/<file>    -> /boot/<file>
#   $(SYSTEM_UPDATE_PAYLOAD)/rootfs/<path>  -> /<path>
system-update-bundle:
	@scripts/create-system-update-bundle.sh "$(SYSTEM_UPDATE_VERSION)" "$(SYSTEM_UPDATE_TARGET)" "$(SYSTEM_UPDATE_PAYLOAD)" "$(SYSTEM_UPDATE_OUT)"

system-update-metadata:
	@scripts/create-system-update-metadata.sh "$(SYSTEM_UPDATE_VERSION)" "$(SYSTEM_UPDATE_TAG)" "$(SYSTEM_UPDATE_OUT)/hardened-nanokvm-system-$(SYSTEM_UPDATE_VERSION).tar.gz" "$(SYSTEM_UPDATE_OUT)/system-latest.json"

test-system-update-v2:
	@scripts/test-system-update-v2.sh

test-latest-buildroot-security-policy:
	@scripts/test-latest-buildroot-security-policy.sh

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@if [ -d build/kvmapp-rust ]; then \
		rm -rf build/kvmapp-rust; \
		echo "Removed build/kvmapp-rust"; \
	fi
	@echo "Clean completed."
