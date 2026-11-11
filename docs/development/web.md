---
status: current
applies-to: system 0.4.0 / app 2.1.0
last-checked: 2026-11-02
---

# Web UI

The React frontend lives in `web/` (Vite, TypeScript, antd, Tailwind, jotai).

## Layout

```text
web/src
├── api        calls to the backend
├── components shared pieces: setting rows, save bar, page header, dialog parts, menu rows
├── hooks
├── i18n       locales/*.ts (one complete file per language), translations.test.ts
├── jotai      global state
├── lib        helpers; feedback.ts holds the confirm/toast helpers
├── pages      auth (login, setup, TOTP), desktop (menu bar, settings, PicoClaw), terminal
└── router.tsx
```

## Commands

Run them from the repository root, as CI does:

```sh
corepack pnpm --dir web install --frozen-lockfile
corepack pnpm --dir web build      # tsc + vite build into web/dist
corepack pnpm --dir web test       # vitest: translations, PicoClaw protocol, tool-call summaries
corepack pnpm --dir web lint
corepack pnpm --dir web format     # prettier
```

`tsc` is TypeScript 7 (the native compiler, about 4x faster). typescript-eslint 8 still
needs the JavaScript compiler API, so `web/.pnpmfile.cjs` gives it TypeScript 6 as its own
dependency; remove the hook once typescript-eslint supports TypeScript 7. Do not set
`baseUrl` in `tsconfig.json`: TypeScript 7 rejects it, and Vite reads the `@/*` alias from
`paths` (`resolve.tsconfigPaths`).

ESLint reports about 67 warnings and no errors. 45 of them come from the React Compiler
rules of eslint-plugin-react-hooks 7 (`set-state-in-effect`, `refs`, `immutability`,
`purity`), which `eslint.config.js` sets to `warn`; fix them when you touch the code.

If ESLint crashes with `expand is not a function`, the local `node_modules` is
out of step with the lockfile; reinstall with `--frozen-lockfile` (in a scratch
copy if you want to keep yours).

## Develop against a device

1. Point `VITE_SERVER_IP` in `web/.env.development` at the device.
2. Sign-in does not work across origins, so turn authentication off on a test
   device only. Over SSH (user `root`, the web account's password), add both
   lines to `/etc/kvm/server.yaml`:

   ```yaml
   authentication: disable
   security:
     allow_auth_disable: true
   ```

   and run `/etc/init.d/S95nanokvm restart`. Never leave this on a device you
   use.
3. `corepack pnpm --dir web dev` and open <http://localhost:3001/>. Turn off the
   browser cache in the developer tools while you work.

To work on sign-in or TOTP, build and run the UI on the device instead.

## Deploy a build by hand

Copy `web/dist` to the device as `/kvmapp/server/web` and run
`/etc/init.d/S95nanokvm restart`. An application update does the same with
signature checks ([Build and deploy the server](cross-build.md)).

## Rules

- Settings pages, menu bar popovers, dialogs and toasts follow
  [Web UI layout rules](web-ui-layout-rules.md). Use the shared components and
  `lib/feedback.ts` rather than new one-off markup.
- Copy rules are in the **Text** section of those rules: sentence case, one
  sentence without a final full stop for captions and toasts, menu paths as
  "Settings > Device > Virtual disk".
- Every new or changed English string goes into `en.ts` and all other language
  files in `web/src/i18n/locales/`, keys in the order of `en.ts`.
  `translations.test.ts` fails on missing or extra keys, broken placeholders and
  copy-rule violations.
- Tailwind 4 runs with its preflight, and antd sits in a cascade layer below the
  utilities: see rule 32 of the layout rules.
- A file upload to the device goes through `lib/upload.ts` (`startUpload`: CSRF token, progress,
  abort, a stall watchdog instead of a fixed timeout) and asks first with `checkUpload` in
  `api/upload.ts`, because a refusal after the body has started reaches the browser as a
  connection reset. Do not post a large file with axios.
