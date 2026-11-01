---
status: current
applies-to: app 2.1.0
last-checked: 2026-11-01
---

# Web UI layout rules for the Settings pages

These rules grew page by page while the Settings pages were unified. They
describe what the pages do now; the shared pieces live in
`web/src/components/setting-rows.tsx` and `web/src/components/save-bar.tsx`,
and the dialog and toast helpers in `web/src/lib/feedback.ts`.

## Page structure

1. A page starts with `PageHeader` (`components/page-header.tsx`): its title in
   `text-base` and a hairline under it, which stay in view while the page
   scrolls, also on a page too short to scroll. The title and the hairline sit at
   the same height on every page, and the title lines up with the "Settings" title
   of the left pane. The touch layout shows no header: the
   navigation above the page names it. What sits beside the title is the
   header's children; pages that belong together are subpages in the left pane of
   the dialog (User, Network and System), never tabs in the header. The header is in
   the colour of the panel, and its shadow has a negative spread so it fades out
   before its sides: the scroll area clips what goes beyond the width of the
   content, and a wider shadow ends in a hard edge. The shadow box is the header's
   height minus 40px, so the header's own padding is what keeps the shadow
   visible. The loading and load-failure banner of the page comes right below the header (`LoadBanner`), where the
   header's cover does not hide it.
2. A page is a column of titled sections with the same faded hairline between
   them. A section is `SettingSection`: a grey sentence-case title
   (`text-neutral-400`), then its rows 24px apart.
3. No frames, cards or bordered boxes, and no result panels with icons. The
   exceptions are the viewers of text that comes from the system (the System
   log and the Current rules of the firewall, a dark box with monospace text)
   and the firewall mode tiles.
4. Read-only lines (`InfoRow`) are grouped in a `space-y-3` column. A row is at
   least 32px tall, so a line keeps its height whether it is read-only or
   editable.
5. A read-only line whose value is set somewhere else carries a help tooltip
   (`LabelTip`) that says where: "Change it in Settings > Network > IP & DNS",
   "Update it in Settings > System > Updates", "Turn it on or off in Settings >
   Network > Services". The path is built from the translated menu titles. A value
   nobody can change, such as Uptime, has no tooltip.
6. Names are shared between pages when they mean the same thing: Connection
   (Network, WireGuard, Tailscale), Encrypted tunnel, Latest version, Login.
   The computer being controlled is the host and NanoKVM is the device, so no
   label calls NanoKVM a host: Device name, not Hostname. A section title never
   repeats the label of its first row.

## Rows and fields

7. Use only the shared rows: `SettingRow` (label and caption left, control
   right; `isSwitch` and `inline` keep a narrow control on the label's row on a
   phone), `InfoRow` (value grey and right-aligned; it may carry a caption),
   `EditableInfoRow` (the same row with an input) and `SettingSection`. The one
   exception is the Monitor (`settings/system/monitor/`), whose meters and graphs
   are its own blocks. They sit in two columns only from `lg` (1024px) up: the
   narrowest desktop layout, 850px, leaves each column about 216px, too narrow
   for a value beside its label.
8. Values are right-aligned, including the text inside inputs and tag fields.
   Every field has a caption except the editable address fields of Network
   (IP address, subnet mask, router, prefix), whose meaning is well understood.
9. Inputs are sized to their content with standard Tailwind widths (`w-20`,
   `w-24`, `sm:w-36`, `sm:w-72`). The one accepted exception is the WireGuard
   public key. A unit is a fixed label beside the box (`Space.Compact` with
   `Space.Addon`), never part of the value.
10. A field that depends on a switch stays visible and is disabled while the
   switch is off. Nothing appears or disappears with a switch.
11. A value that comes from the system (IPv4 and IPv6 outside manual mode) is
    shown read-only in the same row where the editable field would be.
12. A setting for hardware that is not there is not shown: no row, no
    placeholder icon, no disabled copy. The page asks the device what it has and
    shows nothing until the answer arrives: the HDMI rows need a PCIe board, the
    Wi-Fi row a Wi-Fi chip, the OLED rows an OLED, the Power menu an ATX board
    (not a Lite). Hardware that is there but off or failing still shows, disabled
    or with its error. The same goes for a service that is switched off: About has
    no Local address row while mDNS is off.
13. A section with nothing to show is not shown, title included. `SettingSection`
    hides itself when its content renders no element, and the hairline next to it
    goes too, so the rows of a section must be components that return `null`
    when they have nothing to show (rule 12), never an empty wrapper or a placeholder.
    Network > IP & DNS has no Connection section on a board without Wi-Fi.
14. On a phone, switches, info rows, buttons and the fields (inputs, selects
    and tag boxes) stay on the label's row; the field is narrower than on the
    desktop (`w-20` to `w-44`) and the caption wraps beside it. The one field
    that goes under its title is the WireGuard peer public key, which is wide on
    purpose so the whole key shows. An error message wraps to the width of its
    field and never widens it.
    One general exception: a control may sit under its label, right-aligned, when
    a translation leaves no room beside the label (`flex-wrap` with `ml-auto` on
    the control). The layout is not tuned language by language, and a label that
    wraps or touches its control is a defect. Check every language at 375px
    after a change to a label or to the text of a control, as the Images dialog
    does for its two button rows.
15. Long values wrap at spaces and hyphens (`break-words`); `break-all` is only
    for a single token with no spaces, such as a key or a URL.

## Buttons and actions

16. Buttons sit on the right. A group that wraps stays right-aligned
    (`ml-auto` on the group).
17. An action that runs something is a row with a caption and a button
    (Restart, Stop). Destructive, irreversible or disruptive actions (Logout,
    Reboot, Uninstall) go in a bar at the end of the page, under a hairline, as
    red outline buttons (`danger`, not `type="primary"`).
18. A primary (blue) button is the one main positive action of a page or state.
    An action that needs a confirmation uses one of two forms, by what it costs:
    - `Popconfirm`, with a one-line question and Yes / No, for a quick action
      that is easy to undo (Restart Tailscale, Stop Tailscale, Account logout).
    - `confirm()` from `lib/feedback.ts`, a dialog, for anything destructive,
      irreversible or consequential (deleting, rebooting the KVM, leaving
      Tailscale, uninstalling, applying a change that reboots the device or
      drops the connection in use), and for any confirmation that needs more
      than one line (an explanation, a file name, an alert).
    A dialog names the action in its title and its OK button (Reboot, Delete,
    Uninstall; the common Confirm only when no single word fits), asks the
    question as its content, and has the common Cancel. `danger: true` is only
    for destructive or irreversible actions, so the OK button is red; a
    consequential action that can be undone stays plain. No confirmation is a
    hand-built `Modal`. Exception: the confirmations of the Power menu are
    Popconfirms with a red OK button, because a dialog is too heavy for a menu
    item and they act on the host.
19. A dialog with a form is a `Modal`, not a `confirm()`: it is not a
    confirmation. Its OK button names what it does: Save for a key or a setting
    (the common Save), Join for the Wi-Fi password. Its title names the task,
    and it has the common Cancel. The Wi-Fi connect dialog is the model.
20. Unsaved changes show in the sticky `SaveBar` at the bottom, never in the
    page header. The bar is as wide as the content, in the panel colour
    (`bg-settings-panel`) like the page header, with a hairline above it and a
    shadow that pushes up from there, with the same negative spread as the
    header's.
    The bar has a Discard button beside Save changes, and Escape in a text field
    of a page with unsaved changes discards them too (`discardOnEscape`,
    `lib/discard.ts`): an open select or a dialog keeps its own Escape, and with
    nothing to discard Escape closes the Settings dialog as usual. The System
    pages discard by remounting their content, which loads the settings again.

## Status and feedback
21. A state message is the caption of the field it describes: "downloaded and
    verified" under Staged version, "reboot required" under Pending version.
    A setting whose change only takes effect after a reboot (device name, clock
    overdrive) shows the gold "Reboot required" badge (`RebootTag`) next to its
    label until the device has booted with it. The bar at the end of the Device
    page lists what waits, left of the Reboot button.
    A bundle uploaded from this computer is staged, not installed: its version
    replaces the latest version with an amber "Local" badge, its signer shows as a
    row, and the section's buttons become Refresh, Discard and Install. Discarding
    checks the online channel again. The upload row sits just above those buttons
    and stays disabled, with a "Local key required" badge, until a local update key
    is set; the key has a section of its own at the bottom.
22. A badge (`Tag` with `className="m-0"`) names a state of the row it belongs
    to. It sits right after the row's label, in a `flex flex-wrap items-center gap-x-2 gap-y-1`
    span passed as the `label` (it wraps under the text when a translation is long), never in the value, which stays plain. Its text is
    one or two words; the colour carries the meaning: green is good, blue is
    available, gold is waiting, red is failed or stopped, grey is none or
    not set. A section that checks for updates (Application, System) shows
    Current version and then Latest version, always, with the badge of the check
    on Latest version: Checking, Up to date, Update available or Check
    failed. A failure also says why in the caption of the row, in red, and the
    version reads "-".
23. A busy state is a small spinner with text; while the information of a
    section loads, the spinner sits after its title (`busy` of `SettingSection`).
    An error is red
    (`text-red-400`). A headline above the buttons is only for a state that is
    a message in itself ("Boot confirmed").
24. An `Alert` is for a state that blocks something (Paranoid mode, raw
    installs disabled, the clock not synchronized) and goes above the
    sections.
25. Secondary explanation goes in a tooltip behind a help icon; a warning
    tooltip uses an orange alert icon, always through `LabelTip`
    (`components/label-tip.tsx`, tooltip above the icon). A caption says what a
    setting does; a tooltip says what it costs or how it is sized.
26. A control stays disabled until its own load has succeeded
    (`useSettingsLoad`), and every failed action is visible (`attempt()` and
    `toast`).

## Text

27. Sentence case everywhere: labels, buttons, section titles and tab names.
    Only real names keep capitals: Tailscale, WireGuard, the firewall modes
    (Baseline, Moderate, Restricted, Paranoid), the key names Num Lock, Caps
    Lock and Scroll Lock, and "HID-Only mode". Protocol and file names (HDMI, SSH,
    mDNS, HTTPS, IP, DNS) stay as they are in every language.
28. Every text starts with a capital letter, with no parentheses and no "!".
    Captions, tooltips, toasts and field errors are one sentence without a
    final full stop. Dialogs, banners and step lists stay multi-sentence with
    full stops.
29. Menu paths read "Settings > Device > Virtual disk".
30. Every new or changed English string needs all 25 languages. Every language
    is one file in `web/src/i18n/locales/`, with the keys in the order of
    `en.ts`; there are no overlay layers. Compare the effective strings of
    every language before and after a change to prove that nothing else moved;
    `translations.test.ts` checks that no language misses a key or has an
    extra one, and that the copy rules hold.

## Order

31. Menu: About and Device, then the groups User, Network and System, so
    the groups that open and close are together. The groups start collapsed and
    open on click. User holds Account and Preferences (the person and the
    browser they use); Network holds IP & DNS, Services, Firewall,
    WireGuard and Tailscale; System holds Time, Logging, Performance, Monitor and
    Updates. The first subpage of a group is the one a touch layout opens when
    the group is chosen. The touch layout shows the five main items on one row,
    so their names stay short.

## Technical rules

32. Tailwind 4 runs with its preflight. The layers are declared in
    `assets/styles/index.css` as `theme, base, antd, components, utilities`, and
    antd renders into the `antd` layer (`StyleProvider layer` in `main.tsx`), so
    preflight never restyles antd and a utility overrides antd without `!`.
    Preflight makes every box border-box, gives every border a solid style
    (`border-b border-white/[0.06]` draws a line on its own) and removes default
    margins, padding and list markers: a list needs `list-disc` or `list-decimal`
    and a left padding. CSS outside a layer in `index.css` beats every utility.
    In a flex or grid column use `gap-*`: `space-y-*` puts its space in the
    bottom margin of each child, and a child's own `mb-*` or `!mb-0` removes it.
33. A sticky element must not sit inside an `overflow-x-hidden` container; that
    makes the container its scroll parent and the element stops sticking.
34. Layout depends on the phone class `settings-modal-mobile` (see
    `assets/styles/index.css`); use
    `[.settings-modal-mobile_&]:` for rules that differ on the touch layout.
35. The app is dark-only. The colour of the settings panel is the one
    `--color-settings-panel` in the `@theme` block of `assets/styles/index.css`
    (`bg-settings-panel`: the modal colour under a 50% layer, as a solid colour),
    used by the panel itself and by whatever sticks over its content, so that it
    hides what scrolls under it. Do not write the value again.
36. The Settings window is at most 710px tall (`max-h-[710px]`), and 82.5vh on a
    shorter screen. Only the Monitor page sets this number: 710px puts as much
    space under its last line (45px) as above its title (44px). Taller pages, such
    as Device (788px to 1038px, by board), scroll inside the window. Measure again
    and change the number if the Monitor page gets taller or shorter.
37. Icons come from `lucide-react` (the GitHub, Apple and Windows logos from
    `@ant-design/icons`) and are 16px, to go with the 14px text. Exceptions: 10 or
    12 for a badge or a mark inside a chip or a line of text, and 24 for a loading,
    empty or feature state. The cursor drawn over the remote screen has its own size.
    A hit area can be larger than the icon (24px for a row action, 18px for the
    icon box of a menu row); the icon stays 16px inside it.
37. The app uses antd 6, which renamed parts of its DOM. A CSS override that reaches into
    antd's markup must use the new names: `.ant-select-content` (the flex row of a
    multiple select's tags), `.ant-select-content-value` (the value of a single select),
    `.ant-select-placeholder`, `.ant-select-input`, `.ant-alert-title` and
    `.ant-modal-container` (there is no `.ant-modal-content`). The classes are not
    type-checked, so a stale one only shows as a layout change: look at the page. Also:
    - A `Tooltip` or `Popover` `className` styles the popup, not the trigger; put the
      class on the child (see `LabelTip`).
    - A multiple select (tags) adds padding and an empty slot after the last tag; the three
      tag fields cancel both (`!pr-[7px]`, `-ml-1` on `.ant-select-content-item-suffix`) so
      their tags stay flush right (rule 8).
    - A dialog focuses its close button when it opens, so the button shows a focus ring.
      This is accepted.
    - Use the v6 prop names: `title` on `Alert` and notifications, `actions` for a
      notification button, `mask={{ closable }}` on `Modal`, `styles.root` and
      `styles.container` instead of `overlayStyle` and `overlayInnerStyle`, `orientation`
      on `Divider`, and `Space.Compact` with `Space.Addon` instead of `addonAfter`. A dev
      build (`NODE_ENV=development`) logs the deprecated ones in the console.

## Menu bar popovers

The popovers of the menu bar (`web/src/pages/desktop/menu/`) are a different
surface from the Settings pages and are built from `components/menu-rows.tsx`:

- Every popover starts with `MenuHeader`: the title of the entry and a hairline.
  What sits on the right of the title (the Upload button of Scripts, the
  Confirmation switch of Power) is its children.
- A row that does something or opens something is a `MenuRow`: a 16px icon in an
  18px box and a label, 30px tall. A row that opens a list of options is a `MenuSubmenu`, which
  has the same box. An entry that is switched on shows in blue (`active`).
- A list of options is `MenuOption` rows: a blue check in front of the chosen
  one, nothing else marks the choice. An option may carry a small icon.
- Rows pass their props on, so a row can sit inside a `Popconfirm` or a `Tooltip`.
- No popover writes its own row classes, header or divider margin.

The dialogs that the entries open follow the same idea (`components/dialog-parts.tsx`):

- The title is the dialog's own `title`, never a hand-made heading. What the dialog
  is about goes under it as a `DialogHint`, in small grey text.
- The width is antd's default. There are two exceptions: the output of a script is
  600px wide because it shows log text, and the Serial Port form is 420px because
  it is a short column of labels and small controls.
- A dialog has one main button, a `DialogAction`: `min-w-24`, centred under the
  content, and named after what it does (Paste, Save, Open terminal), not Submit
  or Ok. A close button is the same button.
- Dialogs are centred. The one exception is a dialog with a text box, which is
  not centred on a phone, so that the phone's keyboard does not cover the box.
- A form in a dialog uses the `SettingRow` rows of the Settings pages.
- A confirmation names its action in the title (rule 18), never "Attention".

The Images dialog (`menu/image/`) is the one dialog that departs from the rules above, on purpose:

- It has no `DialogAction` and no `DialogHint`. Its actions sit on the rows they act on: a
  mount or eject arrow and a delete button per image, and a 32px icon-only button (Download,
  Upload, Cancel) beside the field it belongs to, each with a tooltip and an `aria-label`.
  USB reconnect is a small button at the right end.
- Its add form puts the label of each field above the box, not in a `SettingRow`, because the
  dialog is narrow.
- The help icon in its title opens a modal with the upload steps, so it is not a `LabelTip`.
- A running transfer is a text line, the progress bar and the Cancel icon right of it, with no
  box around them (rule 3). A transfer that cannot start because the storage is read-only is
  an `Alert` (rule 24), and a failure is a `toast` (rule 26).
- The image list shows three rows (`max-h-[120px]`) and scrolls beyond that, with a thin scrollbar on a
  transparent track. Each row ends with a mount icon (`HardDriveDownloadIcon`, blue) or an eject
  icon (`HardDriveUploadIcon`, red) and a delete icon, 16px in 24px hit areas. The type chip has a 2px right margin,
  so the drawn distance from the chip to the mount icon equals the one from that icon to the delete icon. The delete icon is wrapped in a
  `flex` span: antd gives an `svg` inside a button a `vertical-align` of -0.125em, which
  pushed it 0.63px off centre and out of line with the mount icon.
- On a phone the dialog is not centred, so that the keyboard does not cover the URL box.

The PicoClaw sidebar is part of the menu bar and follows the same rules where it can:

- Its header buttons are the 30px squares of the menu bar with a tooltip. Stopping the
  assistant asks first (a Popconfirm, rule 18), because it ends a task that is running.
- The gear (Settings) menu is a popover of `MenuRow`s like the menu bar's, not an antd
  dropdown; a row that destroys something (Uninstall) is `danger`.
- A screen that does not show the chat (install, model) reports a failure with a toast, since
  the chat transcript is not visible there.
- Its accent is the blue of the rest of the app (`blue-400` / `blue-500`, `blue-600` for the
  user's bubbles), not sky-blue.
- A screen with nothing to show yet (start, install, no history, no messages) is an
  `EmptyState`: a centred icon tile, a title, a caption and one action.
- What the agent does while it works shows in the chat as Action boxes (one per tool call of
  PicoClaw: taking a screenshot, typing, pressing keys), and "Processing..." stays on for the
  whole run. PicoClaw does not say when a run is over: a text message ends it unless a tool call
  follows within 1.5 s (see `lib/picoclaw-gateway.ts`).
- The result of an action (started, stopped, saved, installed) is a toast; the chat shows only
  what happens in the session (connecting, connected, closed).
- The model form is the one place that is not `SettingRow`s: the input sits under its label,
  because the sidebar is too narrow to hold a model name or an URL beside it.

## Adding or changing a page

- Start from the title and hairline, then `SettingSection`s; reach for a
  shared row before writing flex markup.
- Give every field a caption, or leave it bare on purpose and say so here.
- Put the strings in all languages, sentence case, one sentence without a full
  stop for captions.
- Check the page at desktop width and at 375px: title and hairline position,
  rows wrapping, buttons wrapping to the right, long values.

## Open deviations

None at the moment. The audit of 2026-10-17 found fifteen; they were fixed or
turned into the exceptions named in the rules above. List here what a page
still does against the rules, and remove the entry when it is fixed or turned
into an exception.
