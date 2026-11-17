#!/usr/bin/env python3
"""Renders the OLED pictures in a kvm_system trace: replays the I2C command and data bytes
on a page-addressed controller RAM and prints the RAM after each tick that changed it.

Assumes SSD1306 page addressing: B0-B7, the low three bits, so the PCIe code's
"page + 8" lands on pages 0-3; its 64x32 panel shows columns 32-95. The picture is RAM
order (column 0 left, page 0 top); PCIe sends A0/C0, which turns its panel by 180 degrees.
Usage: render.py TRACE [full|pcie]
"""
import re
import sys

ARGS = {0x81: 1, 0xA8: 1, 0xD3: 1, 0xD5: 1, 0xD9: 1, 0xDA: 1, 0xDB: 1, 0x20: 1, 0x8D: 1,
        0x26: 6, 0x27: 6, 0x29: 5, 0x2A: 5, 0xA3: 2, 0x21: 2, 0x22: 2, 0xDC: 1, 0xAD: 1}
WINDOWS = {"full": (0, 8, 0, 128), "pcie": (0, 4, 32, 96)}
LINE = re.compile(r"^@(\d+) i2c (\d+):([0-9a-f]+) (NACK )?([CD])(.*)$")


def expand(text):
    out = []
    for tok in text.split():
        if "*" in tok:
            value, count = tok.split("*")
            out += [int(value, 16)] * int(count)
        else:
            out.append(int(tok, 16))
    return out


class Panel:
    def __init__(self):
        self.ram = [[0] * 256 for _ in range(8)]
        self.page = self.col = 0
        self.on = False
        self.pending = []

    def command(self, byte):
        if self.pending:
            self.pending[1] -= 1
            if self.pending[1] == 0:
                self.pending = []
            return
        if byte in ARGS:
            self.pending = [byte, ARGS[byte]]
        elif 0xB0 <= byte <= 0xBF:
            self.page = byte & 0x07
        elif byte <= 0x0F:
            self.col = (self.col & 0xF0) | byte
        elif byte <= 0x1F:
            self.col = ((byte & 0x0F) << 4) | (self.col & 0x0F)
        elif byte == 0xAE:
            self.on = False
        elif byte == 0xAF:
            self.on = True

    def data(self, byte):
        self.ram[self.page][self.col & 0xFF] = byte
        self.col = (self.col + 1) & 0xFF

    def picture(self, window):
        p0, p1, c0, c1 = window
        rows = []
        for y in range(p0 * 8, p1 * 8, 2):
            row = ""
            for x in range(c0, c1):
                top = self.ram[y // 8][x] >> (y % 8) & 1
                bottom = self.ram[(y + 1) // 8][x] >> ((y + 1) % 8) & 1
                row += " ▀▄█"[top | bottom << 1]
            rows.append("|" + row + "|")
        return "\n".join(rows)


def main():
    trace = sys.argv[1]
    board = sys.argv[2] if len(sys.argv) > 2 else "full"
    window = WINDOWS[board]
    panel = Panel()
    last = None
    tick = None
    inputs = []

    def show(t):
        nonlocal last
        pic = panel.picture(window)
        if pic != last:
            state = "" if panel.on else " (display off)"
            print(f"@{t}{state} {'; '.join(inputs)}")
            print(pic)
            last = pic

    for raw in open(trace, encoding="utf-8"):
        line = raw.rstrip("\n")
        t = int(line[1:line.index(" ")])
        if tick is not None and t != tick:
            show(tick)
            inputs.clear()
        tick = t
        m = LINE.match(line)
        if not m:
            if " > " in line or " run " in line:
                inputs.append(line.split(" ", 1)[1])
            continue
        if m.group(4):
            continue
        for byte in expand(m.group(6)):
            panel.command(byte) if m.group(5) == "C" else panel.data(byte)
    if tick is not None:
        show(tick)


if __name__ == "__main__":
    main()
