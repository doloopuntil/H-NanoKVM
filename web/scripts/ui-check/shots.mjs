// Screenshots of the built UI against a mocked API: sign-in pages, menu bar popovers and
// dialogs, and every Settings page (scrolled), at desktop and phone widths.
// Usage: node scripts/ui-check/shots.mjs <dist> <out> [--layout desktop|phone]
// Writes <out>/*.png and <out>/report.txt; exits 1 if a page crashes, throws or calls an
// endpoint the mock does not answer.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

import { answer, ignoredPaths } from './mock-api.mjs';

const args = process.argv.slice(2);
const layoutArg = args.indexOf('--layout') >= 0 ? args[args.indexOf('--layout') + 1] : null;
const [dist, out] = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--layout');
if (!dist || !out || !fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('usage: shots.mjs <dist> <out> [--layout desktop|phone]');
  process.exit(2);
}
fs.mkdirSync(out, { recursive: true });

const LAYOUTS = {
  desktop: { viewport: { width: 1280, height: 800 } },
  phone: {
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2
  }
};
// [group in the left pane or top row, page]; labels are the English titles
const SETTINGS_PAGES = [
  [null, 'About'],
  [null, 'Device'],
  ['User', 'Account'],
  ['User', 'Preferences'],
  ['Network', 'IP & DNS'],
  ['Network', 'Services'],
  ['Network', 'Firewall'],
  ['Network', 'WireGuard'],
  ['Network', 'Tailscale'],
  ['System', 'Time'],
  ['System', 'Logging'],
  ['System', 'Performance'],
  ['System', 'Monitor'],
  ['System', 'Updates']
];
const CRASH_TEXT = /Unexpected Application Error|We've ran into an issue/;
const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2'
};

const root = path.resolve(dist);
const server = http.createServer((req, res) => {
  let file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (
    !file.startsWith(root + path.sep) ||
    !fs.existsSync(file) ||
    fs.statSync(file).isDirectory()
  ) {
    file = path.join(root, 'index.html');
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;

const report = new Map(); // step -> { calls, unmocked, errors }
let step = 'boot';
const entry = () => {
  if (!report.has(step)) report.set(step, { calls: new Set(), unmocked: new Set(), errors: [] });
  return report.get(step);
};
const fail = (e) => entry().errors.push(String(e).split('\n')[0].slice(0, 200));

const browser = await chromium.launch();

async function open(layout, { signedIn = true, overrides = {}, url = '/#/' } = {}) {
  const ctx = await browser.newContext({
    ...LAYOUTS[layout],
    colorScheme: 'dark',
    reducedMotion: 'reduce',
    locale: 'en-US'
  });
  if (signedIn) await ctx.addCookies([{ name: 'nano-kvm-csrf', value: 'x', url: base }]);
  await ctx.route('**/api/**', (route) => {
    const { pathname } = new URL(route.request().url());
    const a = pathname in overrides ? { hit: true, data: overrides[pathname] } : answer(pathname);
    entry().calls.add(`${route.request().method()} ${pathname}`);
    if (!a.hit && !ignoredPaths.has(pathname)) entry().unmocked.add(pathname);
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ code: 0, msg: 'success', data: a.data })
    });
  });
  const page = await ctx.newPage();
  page.on('pageerror', fail);
  await page.goto(base + url);
  await page.waitForTimeout(1500);
  return page;
}

async function shot(page, name) {
  await page.waitForTimeout(400);
  if (CRASH_TEXT.test(await page.evaluate(() => document.body.innerText)))
    fail('crash: error page shown');
  await page.screenshot({ path: path.join(out, `${name}.png`) });
}

async function signIn(layout) {
  const pages = [
    ['login', { signedIn: false, url: '/#/auth/login' }],
    [
      'setup',
      {
        signedIn: false,
        url: '/#/auth/login',
        overrides: { '/api/auth/setup': { required: true } }
      }
    ],
    ['password', { url: '/#/auth/password' }],
    ['totp', { url: '/#/auth/totp' }]
  ];
  for (const [name, options] of pages) {
    step = `${layout} sign-in ${name}`;
    const page = await open(layout, options);
    await shot(page, `${layout}-signin-${name}`);
    await page.context().close();
  }
}

async function menuBar(layout) {
  step = `${layout} menu bar`;
  let page = await open(layout);
  await shot(page, `${layout}-menu-bar`);
  const icons = await page.evaluate(() => [
    ...new Set(
      [...document.querySelectorAll('svg.lucide')]
        .filter((e) => e.getBoundingClientRect().top < 60)
        .map((e) => [...e.classList].find((c) => c.startsWith('lucide-') && c !== 'lucide'))
    )
  ]);
  // the settings dialog has its own pass; mouse-pointer-2 is the phone's touch cursor
  const skip = /settings|maximize|minimize|^lucide-x$|grip|chevron|mouse-pointer-?2/;
  const openPopover = async (icon) => {
    const el = page.locator(`.${icon}`).first();
    if (layout === 'desktop') await el.hover({ timeout: 3000 });
    await page.waitForTimeout(500);
    await el.click({ timeout: 3000 });
    await page.waitForTimeout(600);
  };
  const close = async () => {
    await page.keyboard.press('Escape');
    await page.mouse.click(
      640 > page.viewportSize().width ? 5 : 640,
      page.viewportSize().height - 20
    );
    await page.waitForTimeout(500);
  };
  for (const icon of icons.filter((i) => i && !skip.test(i))) {
    step = `${layout} menu ${icon.replace('lucide-', '')}`;
    try {
      await openPopover(icon);
      await shot(page, `${layout}-menu-${icon.replace('lucide-', '')}`);
    } catch (e) {
      fail(e);
    }
    await close();
  }
  if (layout === 'desktop') {
    // a fresh page: the PicoClaw sidebar opened above stays open
    await page.context().close();
    page = await open(layout);
    const dialogs = [
      [
        'shortcuts',
        async () => {
          await openPopover('lucide-keyboard');
          await page.getByText('Shortcuts', { exact: true }).first().hover({ timeout: 3000 });
        }
      ],
      [
        'leader-key',
        async () => {
          await openPopover('lucide-keyboard');
          await page.getByText('Leader key', { exact: true }).first().click({ timeout: 3000 });
          await page.waitForTimeout(600);
          await page.getByText('How to use').first().click({ timeout: 3000 });
        }
      ],
      [
        'image-tips',
        async () => {
          await openPopover('lucide-disc');
          await page.locator('.lucide-circle-question-mark').first().click({ timeout: 3000 });
          await page.waitForTimeout(600);
          const headers = page.locator('.ant-modal .ant-collapse-header');
          await headers.last().click({ timeout: 3000 });
        }
      ]
    ];
    for (const [name, run] of dialogs) {
      step = `${layout} dialog ${name}`;
      try {
        await run();
        await shot(page, `${layout}-dialog-${name}`);
      } catch (e) {
        fail(e);
      }
      await close();
      await close();
    }
  }
  await page.context().close();
}

async function settings(layout) {
  step = `${layout} settings`;
  let page = await open(layout);
  const openSettings = async () => {
    await page.locator('.lucide-settings').first().click({ timeout: 5000 }).catch(fail);
    await page.waitForTimeout(800);
  };
  await openSettings();
  const item = (label) =>
    page
      .locator('.ant-modal [class*="cursor-pointer"]')
      .filter({ hasText: new RegExp(`^\\s*${label.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&')}\\s*$`) })
      .first();
  for (const [group, label] of SETTINGS_PAGES) {
    step = `${layout} settings ${label}`;
    const name = `${layout}-settings-${label.toLowerCase().replace(/\W+/g, '-')}`;
    try {
      if (
        group &&
        !(await item(label)
          .isVisible()
          .catch(() => false))
      ) {
        await item(group).click({ timeout: 3000 });
        await page.waitForTimeout(500);
      }
      await item(label).click({ timeout: 3000 });
      await page.waitForTimeout(1500);
    } catch (e) {
      fail(e);
    }
    // the page scrolls inside the dialog: one shot per screenful
    const viewport = page.locator('.ant-modal [data-slot="scroll-area-viewport"]').last();
    const [scrollHeight, clientHeight] = await viewport
      .evaluate((e) => [e.scrollHeight, e.clientHeight], null, { timeout: 2000 })
      .catch(() => [0, 0]);
    for (let i = 0, y = 0; i < 8; i++, y += Math.max(200, clientHeight - 80)) {
      await viewport
        .evaluate((e, top) => (e.scrollTop = top), y, { timeout: 2000 })
        .catch(() => {});
      await shot(page, `${name}-${i}`);
      if (y + clientHeight >= scrollHeight) break;
    }
    await viewport.evaluate((e) => (e.scrollTop = 0), null, { timeout: 2000 }).catch(() => {});
    if (entry().errors.length) {
      await page.context().close();
      page = await open(layout);
      await openSettings();
    }
  }
  await page.context().close();
}

for (const layout of Object.keys(LAYOUTS)) {
  if (layoutArg && layoutArg !== layout) continue;
  await signIn(layout);
  await menuBar(layout);
  await settings(layout);
}
await browser.close();
server.close();

const lines = [];
let problems = 0;
for (const [name, r] of report) {
  const bad = r.errors.length + r.unmocked.size;
  problems += bad;
  lines.push(`${bad ? 'FAIL' : 'ok  '} ${name}`);
  if (r.unmocked.size) lines.push(`     unmocked: ${[...r.unmocked].join(', ')}`);
  for (const e of new Set(r.errors)) lines.push(`     error: ${e}`);
}
fs.writeFileSync(path.join(out, 'report.txt'), lines.join('\n') + '\n');
console.log(lines.filter((l) => !l.startsWith('ok')).join('\n') || 'all pages rendered');
console.log(
  `${fs.readdirSync(out).filter((f) => f.endsWith('.png')).length} screenshots in ${out}`
);
process.exit(problems ? 1 : 0);
