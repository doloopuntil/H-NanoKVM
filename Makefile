# Makefile for NanoKVM Project

# Configuration
IMAGE_NAME := nanokvm-builder
UID := $(shell id -u)
GID := $(shell id -g)
PWD := $(shell pwd)

# Docker run common parameters
DOCKER_RUN_BASE := docker run -e UID=$(UID) -e GID=$(GID) -v $(PWD):/home/build/NanoKVM --rm
RUST_TARGET ?=
RUST_BUILD_ARGS := --manifest-path server-rust/Cargo.toml --release --locked
ifneq ($(strip $(RUST_TARGET)),)
RUST_BUILD_ARGS += --target $(RUST_TARGET)
endif

SUPPORT_BUILD_CMD := . ./home/build/MaixCDK/bin/activate && cd /home/build/NanoKVM/support/sg2002 && ./build kvm_system && ./build kvm_system add_to_kvmapp

SYSTEM_UPDATE_VERSION ?= 0.0.0-dev
SYSTEM_UPDATE_TARGET ?= sg2002-hnanokvm-sd
SYSTEM_UPDATE_PAYLOAD ?= build/system-update-payload
SYSTEM_UPDATE_OUT ?= build/system-updates
SYSTEM_UPDATE_TAG ?= hardened-system-$(SYSTEM_UPDATE_VERSION)

.PHONY: help check-root builder-image rebuild-image check-image shell rust-app web-app rust-kvmapp latest-buildroot-bootstrap latest-buildroot-security-source latest-buildroot-sg2002-configure latest-buildroot-sg2002-rootfs system-update-bundle system-update-metadata test-system-update-v2 test-latest-buildroot-security-policy support all clean

# Default target
all: rust-kvmapp support

# Help target
help:
	@echo "NanoKVM Build System"
	@echo ""
	@echo "Available targets:"
	@echo "  help          - Show this help message"
	@echo "  check-image   - Check builder Docker image and show versions"
	@echo "  builder-image - Build Docker image if not exists"
	@echo "  rebuild-image - Force rebuild Docker image"
	@echo "  shell         - Enter interactive builder environment"
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
	@echo "  support       - Build hardware support libraries"
	@echo "  all           - Build Rust kvmapp and support (default)"
	@echo "  clean         - Clean build artifacts"
	@echo ""
	@echo "Prerequisites:"
	@echo "  - Docker must be installed and running"
	@echo "  - Must not run as root user"

# Security check - prevent running as root
check-root:
	@if [ "$$(id -u)" -eq 0 ]; then \
		echo "Can't run as root"; \
		exit 1; \
	fi

# Check if builder image exists and show versions
check-image: check-root
	@echo "Checking builder image..."
	@echo "Host-tools version:" && \
		docker run --rm -i $(IMAGE_NAME) riscv64-unknown-linux-musl-gcc -v && \
		echo ""

# Build Docker image if it doesn't exist
builder-image: check-root
	@if ! docker image inspect $(IMAGE_NAME) >/dev/null 2>&1; then \
		echo "Building Docker image..."; \
		docker build -t $(IMAGE_NAME) -f docker/Dockerfile ./; \
	else \
		echo "Docker image $(IMAGE_NAME) already exists."; \
	fi

# Force rebuild Docker image
rebuild-image: check-root
	@echo "Force rebuilding Docker image..."
	@docker build --no-cache -t $(IMAGE_NAME) -f docker/Dockerfile ./

# Enter interactive shell (equivalent to build.sh with no arguments)
shell: check-root builder-image
	@echo "Switching into builder..."
	@$(DOCKER_RUN_BASE) -it $(IMAGE_NAME) /bin/bash -c ". ./home/build/MaixCDK/bin/activate && cd /home/build/NanoKVM ; exec bash"

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

# Build hardware support libraries
support: check-root builder-image
	@echo "Building support..."
	@$(DOCKER_RUN_BASE) -it $(IMAGE_NAME) /bin/bash -c '$(SUPPORT_BUILD_CMD)'

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@if [ -d support/sg2002/build ]; then \
		rm -rf support/sg2002/build; \
		echo "Removed support/sg2002/build"; \
	fi
	@if [ -d build/kvmapp-rust ]; then \
		rm -rf build/kvmapp-rust; \
		echo "Removed build/kvmapp-rust"; \
	fi
	@echo "Clean completed."
