#!/bin/sh
# Prints how many kernel modules the image ships: the sum of the three module manifests.
set -eu

MANIFESTS="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)/support/sg2002/kernel/5.10.265/manifests"
cat "$MANIFESTS/external-modules.txt" "$MANIFESTS/in-tree-modules.txt" \
	"$MANIFESTS/media-modules.txt" | grep -c .
