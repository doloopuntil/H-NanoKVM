#!/usr/bin/env python3
"""Wrap U-Boot in the 32-byte BL33 header that the SDK fiptool.py expects."""

import argparse
import struct

HEADER_SIZE = 0x20


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--text-base", required=True, type=lambda s: int(s, 0))
    args = parser.parse_args()

    with open(args.input, "rb") as source:
        payload = source.read()

    # The FSBL copies this header to runaddr and the image after it, then
    # enters at runaddr + 0x20, so runaddr sits one header below TEXT_BASE.
    header = struct.pack(
        "<I4sIIQII",
        0,
        b"BL33",
        0,
        HEADER_SIZE + len(payload),
        args.text_base - HEADER_SIZE,
        0,
        0,
    )

    with open(args.output, "wb") as output:
        output.write(header)
        output.write(payload)


if __name__ == "__main__":
    main()
