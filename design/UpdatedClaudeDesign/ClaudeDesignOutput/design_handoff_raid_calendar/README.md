# Handoff: WoW Raid Calendar

## Overview

A calendar view for tracking World of Warcraft raid signups across multiple characters. It shows a fixed rolling three-week window (Sunday → Saturday, 21 days), with raid events color-coded by the class of the character signed up. Two signup states are visually distinct: *signed up* (pending) and *roster confirmed*. The current raid lockout week (Tuesday → Monday) is highlighted, and hovering any day moves that highlight to the lockout week the hovered day belongs to. Right-clicking a day opens a create-event popup at the cursor (one-time events only for now).

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** (React, Vue, Svelte, etc.) using its established component patterns, styling approach, and state libraries. If the web app has no established environment yet, pick the framework that best fits the project and implement there.

The HTML files use a small custom template runtime (`support.js`) that is not part of the design and should not be ported. Read the markup for structure and the embedded `<script>` class for logic; reimplement both idiomatically.

## Fidelity

**High-fidelity.** Colors, typography, spacing, borders, and interaction states are final. Recreate the UI faithfully using the codebase's libraries. The one open area is data: all events are hardcoded seed data and must be replaced with a real source.

## Screens / Views

### 1. Raid Calendar — standard desktop (`Raid Calendar.dc.html`)

**Purpose:** the default view. See which raids are on which nights, which character is signed up, and whether the roster is locked in.

**Layout**
- Root: full-height flex column, `padding: var(--space-6)` (28px), `max-width: 1600px`, `max-height: 1100px`, `margin: 0 auto`, `gap: var(--space-4)` (18px). Background `--color-bg`.
- Header row: flex, `space-between`, wraps. Left = title block (`Raid Calendar`, 22px/500 heading font; date range beneath, 13px/400, `--color-neutral-300`). Right = control cluster, `gap: var(--space-3)`.
- Weekday header: `display: grid; grid-template-columns: repeat(7, minmax(0, 1fr))`, top + left 1px `--color-neutral-700` borders, top corners rounded `--radius-md`. Each cell: `box-sizing: border-box`, `padding: 10px 12px`, 11px/500, uppercase, `letter-spacing: 0.04em`, `--color-neutral-400`, background `--color-neutral-900`, right + bottom 1px `--color-neutral-700`.
- Day grid: same 7-column `minmax(0, 1fr)` template (this is what keeps columns identical in width and aligned to the headers), `grid-auto-rows: minmax(150px, 260px)`, `flex: none`, left border 1px, bottom corners rounded.
- Day cell: `box-sizing: border-box`, `padding: 10px`, `min-width: 0`, `overflow: hidden`, right + bottom 1px `--color-neutral-700`, flex column `gap: 8px`.

**Components**

*Nav buttons (`‹`, `›`)* — 36×36, `border-radius: var(--radius-md)`, 1px `--color-neutral-700`, background `--color-neutral-800`, 16px glyph, `cursor: pointer`. Hover: background `--color-neutral-700`.

*Today button* — height 36, `padding: 0 var(--space-4)`, `border-radius: var(--radius-md)`, 1px `--color-accent-600`, transparent background, 13px/500. Hover: background `--color-accent-800`.

*Day number* — 13px/500. Current day: `--color-accent-300`. Other days: `--color-neutral-300`. On the 1st of a month the label becomes `Aug 1` (abbreviated month + date) instead of a bare number.

*Event card* — `border-radius: var(--radius-sm)`, `padding: 6px 8px`, flex column `gap: 2px`, `min-width: 0`, `cursor: pointer`. Two variants, below. Contents:
- Row 1: class badge (16×16, `border-radius: 4px`, 9px/600, centered, first letter of class name) + raid name (11.5px/500, single line, `text-overflow: ellipsis`).
- Row 2: `8:00 PM · Windrunner` — 11px/400, `--color-neutral-300`, `padding-left: 22px` to align under the raid name, ellipsis-truncated.

*Create-event popup* — see the dedicated section below.

*Event detail dialog* — fixed full-screen backdrop `rgba(0,0,0,0.5)`, centered panel: width 340, background `--color-neutral-800`, 1px `--color-neutral-700`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-lg)`, `padding: var(--space-5)`, flex column `gap: var(--space-4)`. Contains raid name (16px/500 heading), `August 18, 2026 · 8:00 PM` (12px/400 muted), a card-styled character block matching the event's own border/background treatment (28×28 badge, character · class at 13px/500, status label at 12px muted), a `Difficulty: Heroic` line, and a 28×28 `×` close button.

### 2. Raid Calendar — 4K / large display (`Raid Calendar 4K.dc.html`)

**Purpose:** the same view at 4K with 125% OS scaling (≈3072×1728 CSS px). Not a separate feature — treat it as the upper end of the responsive range.

Differences from the standard view:
- Root is a 3072×1728 canvas; the calendar column is `max-width: 2200px`, `max-height: 1500px`, `margin: 0 auto`, `padding: 36px 44px 44px`, `gap: 28px`.
- Weekday headers spell full day names (`Sunday`…`Saturday`), 15px/500 uppercase, `padding: 16px 20px`.
- `grid-auto-rows: minmax(240px, 1fr)`, `min-height: 0`. Day cells `padding: 18px`, `gap: 14px`.
- Day number 22px/500, with a small note beside it (14px/400, `--color-neutral-500`): `reset` on Tuesdays, `today` on the current day.
- Event card: `border-radius: var(--radius-md)`, `padding: 14px 16px`, `gap: 8px`. Badge 30×30 (`border-radius: 7px`, 14px/600). Raid name 18px/500. A metadata row (time 15px `--color-neutral-200`, a 4px dot separator `--color-neutral-500`, character 15px `--color-neutral-300`), then a status row: difficulty (13px/500 uppercase, `letter-spacing: 0.04em`, `--color-neutral-400`) + status (same type, colored — the class color when confirmed, `--color-neutral-400` when pending).
- Dialog scales up: width 520, `padding: 32px`, title 24px, badge 44×44.

### 3. Class Colors reference (`Class Colors.dc.html`)

**Purpose:** internal reference sheet, not an app screen. All 13 class colors shown in both event states. Use it to verify the palette and the two card treatments during implementation.

Layout: `max-width: 1100px` centered, `display: grid; grid-template-columns: 120px minmax(0,1fr) minmax(0,1fr); gap: 12px 20px`. Column headers `Class / Signed up / Roster confirmed` (11px/500 uppercase, `--color-neutral-400`). Each row is a 10px color dot + class name, then the same event card rendered in each variant.

## Event card variants

This is the core visual rule of the design. `$color` is the class color of the character signed up.

**Signed up (pending roster)** — diagonal hatch, thin border:
```css
border: 1px solid color-mix(in srgb, $color 60%, transparent);
background:
  repeating-linear-gradient(45deg,
    color-mix(in srgb, $color 26%, transparent) 0 5px,
    transparent 5px 10px),
  var(--color-neutral-800);
color: var(--color-neutral-100);
/* badge */ background: color-mix(in srgb, $color 45%, var(--color-neutral-800)); color: $color;
```
(4K view uses a `0 7px / 7px 14px` stripe period instead of `0 5px / 5px 10px`.)

**Roster confirmed** — solid tinted fill, border bolder than the fill:
```css
border: 2px solid $color;            /* 3px in the 4K view */
background: color-mix(in srgb, $color 30%, var(--color-neutral-800));
color: var(--color-text);
/* badge */ background: $color; color: #161826;
```

⚠️ Mix in **sRGB**, not OKLCH. `color-mix(in oklch, …)` interpolates hue toward the neutral's own hue and turns every fill mauve — orange Druid cards came out purple. If the target codebase uses a color utility (chroma.js, culori, Tailwind's `color-mix`), pin it to sRGB or precompute the 13 fills as static hex values.

**Lockout-week highlight** — applied to every day cell in the active lockout week:
```css
background: color-mix(in oklch, var(--color-accent-500) 12%, var(--color-neutral-900));
border-top: 2px solid var(--color-accent-500);   /* vs 1px solid var(--color-neutral-700) */
```
Non-highlighted cells: `background: var(--color-neutral-900)`. (The accent mix here is intentionally OKLCH — it is a single fixed accent tint, not a per-class hue.)

## Create-event popup (`Raid Calendar.dc.html`)

**Trigger:** `contextmenu` on a day cell. Suppress the native browser menu (`preventDefault`) and stop propagation. The popup opens anchored to the cursor and closes any open detail dialog.

**Positioning:** `position: fixed` inside a full-screen `inset: 0` overlay at `z-index: 60` (transparent — it exists only to catch outside clicks). Panel `left = clamp(8, clientX, viewportWidth − 320)`, `top = clamp(8, clientY, viewportHeight − 500)`, so it never runs off-screen near the right or bottom edge.

**Panel:** width 312, background `--color-neutral-800`, 1px `--color-neutral-700`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-lg)`, flex column. Three bands separated by 1px `--color-neutral-700` rules:

1. *Header* — `padding: var(--space-3) var(--space-4)`. Title `New event` (13.5px/500 heading font) over the full date of the clicked day, `Tue, August 18, 2026` (11.5px/400, `--color-neutral-300`). Right: 24×24 `×` button, `border-radius: var(--radius-sm)`, 1px `--color-neutral-700`, transparent; hover background `--color-neutral-700`, color `--color-text`.
2. *Body* — `padding: var(--space-4)`, flex column `gap: var(--space-3)`. Fields in order: **Title** (full width, autofocused, placeholder `Nerub-ar Palace`), **Start** / **End** side by side (`grid-template-columns: 1fr 1fr`, `gap: var(--space-3)`, native `time` inputs), **Character** (8×8 class-color chip, `border-radius: 2px`, then the text input; placeholder `Character name`), **Class** (13 options in a 2-column grid, `gap: 4px`). Closing line: a 5px `--color-neutral-600` dot + `One-time event` (11px/400, `--color-neutral-400`).
3. *Footer* — `padding: var(--space-3) var(--space-4)`, right-aligned, `gap: var(--space-2)`. **Cancel**: height 30, `padding: 0 var(--space-3)`, `border-radius: var(--radius-sm)`, 1px `--color-neutral-700`, transparent, 12px/500 `--color-neutral-200`; hover background `--color-neutral-700`. **Add event**: height 30, `padding: 0 var(--space-4)`, 1px `--color-accent-600`; enabled = background `--color-accent-800`, `--color-text`; disabled = transparent, `--color-neutral-400`, `opacity: 0.5`, `cursor: not-allowed`. Hover (enabled) background `--color-accent-800`.

**Field style** (all inputs): `height: 32px`, `padding: 0 8px`, `border-radius: var(--radius-sm)`, 1px `--color-neutral-700`, background `--color-neutral-900`, 12.5px/400 `--color-text`, `color-scheme: dark` (so native time pickers render dark), placeholder `--color-neutral-500`, `box-sizing: border-box`. Focus: `outline: 2px solid var(--color-accent); outline-offset: 1px`. Labels above each field: 10.5px/500, uppercase, `letter-spacing: 0.05em`, `--color-neutral-400`, 5px gap.

**Class picker option:** `padding: 5px 7px`, `border-radius: var(--radius-sm)`, 11px/500, left-aligned, an 8×8 color chip + the class name (ellipsis-truncated). Unselected: 1px `--color-neutral-700`, background `--color-neutral-900`, text `--color-neutral-300`. Selected: `1px solid $color`, background `color-mix(in srgb, $color 22%, var(--color-neutral-900))`, text `--color-text`. Single-select; default `Druid` (in production, default to the user's main character's class).

**Behavior**
- Defaults on open: empty title, `20:00` start, `23:00` end, empty character, `Druid`.
- **Add event** is disabled until the title is non-empty (trimmed). Title is the only required field; an empty character name saves as `—`. No other validation — end-before-start is not currently blocked; add that check if the app needs it.
- Saving appends the event to the clicked day and closes the popup. New events render in the *roster confirmed* treatment and open in the detail dialog like seeded ones (difficulty `Not set`, status label `One-time event`, time shown as `8:00 PM – 11:00 PM`).
- Dismissal: **Cancel**, the `×`, `Escape`, a click on the overlay outside the panel, or a right-click anywhere outside (which also suppresses the native menu). Clicks inside the panel must not bubble to the overlay.
- `Escape` closes the popup if it is open, otherwise the detail dialog.
- Times are stored as 24-hour `HH:MM` and displayed 12-hour with `AM`/`PM`.

**Recurring events:** out of scope for now, but planned. The `One-time event` line in the body is the placeholder for that control — expect it to become a recurrence selector (e.g. *Does not repeat / Weekly on Tuesday / Custom*). Model the event record so a recurrence rule can be added without reshaping it (a nullable `recurrence` field on a single event row rather than exploding instances at create time).

The 4K view does not yet include this popup; scale the same panel proportionally if it is needed there.

## Interactions & Behavior

- **Prev / next** — shift the 21-day window by exactly 7 days (one week), not three. The window always starts on a Sunday.
- **Today** — reset the window start to the Sunday of the current week.
- **Hover a day cell** — set the active lockout week to that day's lockout week (`mouseenter`); on `mouseleave`, fall back to the lockout week containing today. All seven days of the active week highlight together, spanning the row boundary between Monday and Tuesday.
- **Click an event card** — open the detail dialog for that event.
- **Dialog dismissal** — click the backdrop or the `×`. Clicks inside the panel must not bubble to the backdrop handler.
- **Truncation, not reflow** — day columns are locked to equal widths; long raid names ellipsis-truncate. Never let content widen a column.
- No transitions or animations are specified. Hover feedback is an immediate background change.
- Keyboard focus: per the design system, `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` — never the browser default.

**Not yet designed** (raise before building if needed): overflow when a day has more events than fit its 260px row, editing or deleting an existing event, recurring events (see the popup section), month or agenda views, mobile breakpoint, and the roster list inside the detail dialog (only the viewer's own character is shown today).

## State Management

Three pieces of state:

| State | Type | Purpose |
| --- | --- | --- |
| `anchor` | Date (a Sunday, midnight-normalized) | first day of the 21-day window |
| `composer` | object \| null | the open create-event popup: `{ key, dateLabel, x, y, title, start, end, character, cls }`; `null` = closed |
| `custom` | array | events created in-session: `{ key, dateLabel, title, start, end, character, cls }` — replace with a real create mutation |
| `selectedEvent` | Event \| null | which event the dialog shows; `null` = closed |
| `hoverLockoutKey` | string \| null | date key of the hovered day's lockout-week start; `null` = fall back to the current week |

Derived per render:
- 21 day objects from `anchor` (`anchor + i` for `i` in `0…20`).
- Events grouped by date key, then sorted/stacked within each day.
- `activeLockoutKey = hoverLockoutKey ?? lockoutStart(today)`.

Two date helpers carry all the calendar logic:
```js
// first day of the display window: the Sunday on or before d
function startOfWeekSunday(d) {
  const x = new Date(d); x.setHours(0,0,0,0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
// first day of the raid lockout: the Tuesday on or before d
function lockoutStart(d) {
  const x = new Date(d); x.setHours(0,0,0,0);
  x.setDate(x.getDate() - ((x.getDay() - 2 + 7) % 7));
  return x;
}
```
Note the deliberate mismatch: the **grid** weeks run Sunday → Saturday, the **lockout** weeks run Tuesday → Monday. A highlighted lockout week therefore always spans two grid rows.

`lockoutStart` hardcodes Tuesday (US reset). If the app serves EU realms, make the reset day and the reset hour configurable and compute in realm time, not browser local time.

**Data fetching:** all events in these prototypes are hardcoded seed data (`EVENT_SEED`, offsets relative to the window start). Replace with a real fetch. Each event needs: date/time, character name, character class, raid name, difficulty, and roster status (`signed_up` | `confirmed`).

## Design Tokens

All tokens come from the **Nocturne** design system (`_ds/nocturne-.../styles.css`, bundled here). Consume the variables; don't re-derive values. The ones used:

Colors — `--color-bg` (#161826), `--color-text` (#e9e9ed), `--color-accent` (#9184d9), `--color-neutral-100/200/300/400/500/700/800/900`, `--color-accent-200/300/500/600/800`.

Spacing — `--space-3`, `--space-4` (18px), `--space-6` (28px). ⚠️ `--space-5` does **not** exist in this stylesheet; using it silently collapses the gap to 0.

Radius — `--radius-sm`, `--radius-md` (8px base), `--radius-lg`. Shadows — `--shadow-lg` on the dialog only.

Type — `--font-heading` and `--font-body` are both Inter. Weights used: 400, 500, 600 (600 only on the small class badges). Headings never go past 500 — hierarchy is size and space, per the design system.

**Class colors** — Blizzard's canonical values, not design-system tokens:

| Class | Hex | | Class | Hex |
| --- | --- | --- | --- | --- |
| Death Knight | `#C41E3A` | | Hunter | `#AAD372` |
| Demon Hunter | `#A330C9` | | Mage | `#3FC7EB` |
| Druid | `#FF7C0A` | | Monk | `#00FF98` |
| Evoker | `#33937F` | | Paladin | `#F48CBA` |
| Priest | `#FFFFFF` | | Shaman | `#0070DD` |
| Rogue | `#FFF468` | | Warlock | `#8788EE` |
| Warrior | `#C69B6D` | | | |

Priest white and Monk jade run hot against the dark ground; consider damping those two if they prove distracting in real use.

## Assets

No images or icons. Class identity is carried by color plus a single-letter badge. The design system specifies **Phosphor icons** (phosphoricons.com) if icons are added later — the `‹ › ×` glyphs in these mocks are placeholders and should become Phosphor icons in production.

## Files

| File | What it is |
| --- | --- |
| `Raid Calendar.dc.html` | standard desktop view (max 1600×1100), including the create-event popup |
| `Raid Calendar 4K.dc.html` | 4K / 125%-scaling view (3072×1728 canvas) |
| `Class Colors.dc.html` | all 13 class colors × both event states |
| `_ds/nocturne-…/styles.css` | Nocturne token sheet + component layer — the source of every `var(--*)` above |
| `_ds/nocturne-…/_ds_bundle.js` | Nocturne component bundle |
| `support.js` | prototype template runtime — **do not port** |

Open any `.dc.html` directly in a browser to see it render.
