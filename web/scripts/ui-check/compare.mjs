// Compares two screenshot folders from shots.mjs and lists the images that differ.
// Usage: node scripts/ui-check/compare.mjs <before> <after> [--out <dir>] [--threshold 0.1]
// Each 128px tile may move by a few pixels (a line 2px taller above it, a pane 1px
// narrower) without counting as a change; the percentage is what still differs. --out writes
// before | after | difference images (changes in red) for the images over the threshold.
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const args = process.argv.slice(2);
const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const [before, after] = args.filter(
  (a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--')
);
const outDir = opt('--out', null);
const threshold = Number(opt('--threshold', '0.1'));
if (!before || !after) {
  console.error('usage: compare.mjs <before> <after> [--out <dir>] [--threshold 0.1]');
  process.exit(2);
}
if (outDir) fs.mkdirSync(outDir, { recursive: true });

const TILE = 128;
const MAX_DY = 6;
const MAX_DX = 4;
const LEVEL = 24; // grey levels that count as a change, above anti-aliasing noise

const read = (file) => PNG.sync.read(fs.readFileSync(file));
const grey = (png) => {
  const g = new Uint8Array(png.width * png.height);
  for (let i = 0; i < g.length; i++) {
    g[i] = (png.data[i * 4] * 77 + png.data[i * 4 + 1] * 150 + png.data[i * 4 + 2] * 29) >> 8;
  }
  return g;
};

// changed pixels of one tile of `a` against `b` moved by (dx, dy). A pixel is unchanged if
// any pixel within 1px of its place in `b` matches it, which absorbs sub-pixel text shifts.
function tileChanges(a, b, w, h, x0, y0, x1, y1, dx, dy, mark) {
  let changed = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const v = a[y * w + x];
      let same = false;
      for (let j = -1; j <= 1 && !same; j++) {
        const yb = y + dy + j;
        if (yb < 0 || yb >= h) continue;
        for (let i = -1; i <= 1; i++) {
          const xb = x + dx + i;
          if (xb >= 0 && xb < w && Math.abs(v - b[yb * w + xb]) <= LEVEL) {
            same = true;
            break;
          }
        }
      }
      if (!same) {
        changed++;
        if (mark) mark[y * w + x] = 1;
      }
    }
  }
  return changed;
}

function compare(a, b, w, h, mark) {
  let changed = 0;
  for (let y0 = 0; y0 < h; y0 += TILE) {
    for (let x0 = 0; x0 < w; x0 += TILE) {
      const x1 = Math.min(w, x0 + TILE);
      const y1 = Math.min(h, y0 + TILE);
      let best = { n: tileChanges(a, b, w, h, x0, y0, x1, y1, 0, 0), dx: 0, dy: 0 };
      for (let dy = -MAX_DY; dy <= MAX_DY && best.n; dy++) {
        for (let dx = -MAX_DX; dx <= MAX_DX && best.n; dx++) {
          const n = tileChanges(a, b, w, h, x0, y0, x1, y1, dx, dy);
          if (n < best.n) best = { n, dx, dy };
        }
      }
      if (best.n && mark) tileChanges(a, b, w, h, x0, y0, x1, y1, best.dx, best.dy, mark);
      changed += best.n;
    }
  }
  return changed / (w * h);
}

function writeSideBySide(file, pa, pb, ga, mark) {
  const { width: w, height: h } = pa;
  const gap = 8;
  const img = new PNG({ width: w * 3 + gap * 2, height: h });
  img.data.fill(80);
  for (let y = 0; y < h; y++) {
    pa.data.copy(img.data, y * img.width * 4, y * w * 4, (y + 1) * w * 4);
    pb.data.copy(img.data, (y * img.width + w + gap) * 4, y * w * 4, (y + 1) * w * 4);
    for (let x = 0; x < w; x++) {
      const o = (y * img.width + (w + gap) * 2 + x) * 4;
      const v = ga[y * w + x] >> 2;
      const on = mark[y * w + x];
      img.data[o] = on ? 255 : v;
      img.data[o + 1] = on ? 40 : v;
      img.data[o + 2] = on ? 40 : v;
      img.data[o + 3] = 255;
    }
  }
  fs.writeFileSync(file, PNG.sync.write(img));
}

const names = [...new Set([...fs.readdirSync(before), ...fs.readdirSync(after)])]
  .filter((f) => f.endsWith('.png'))
  .sort();
let flagged = 0;
const changes = []; // [percent, name], printed largest first
for (const name of names) {
  const fa = path.join(before, name);
  const fb = path.join(after, name);
  if (!fs.existsSync(fa) || !fs.existsSync(fb)) {
    console.log(`${name}  only in ${fs.existsSync(fa) ? before : after}`);
    flagged++;
    continue;
  }
  const pa = read(fa);
  const pb = read(fb);
  if (pa.width !== pb.width || pa.height !== pb.height) {
    console.log(`${name}  size ${pa.width}x${pa.height} -> ${pb.width}x${pb.height}`);
    flagged++;
    continue;
  }
  const ga = grey(pa);
  const mark = outDir ? new Uint8Array(pa.width * pa.height) : null;
  const percent = compare(ga, grey(pb), pa.width, pa.height, mark) * 100;
  if (percent <= threshold) continue;
  flagged++;
  changes.push([percent, name]);
  if (outDir) writeSideBySide(path.join(outDir, name), pa, pb, ga, mark);
}
for (const [percent, name] of changes.sort((x, y) => y[0] - x[0])) {
  console.log(`${percent.toFixed(2).padStart(6)}%  ${name}`);
}
console.log(`${flagged} of ${names.length} images differ by more than ${threshold}%`);
