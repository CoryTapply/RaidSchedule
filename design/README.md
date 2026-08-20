# Handoff: WoW Raid Calendar

## Overview

A calendar view for tracking World of Warcraft raid signups across multiple characters. It shows a fixed rolling three-week window (Sunday → Saturday, 21 days), with raid events color-coded by the class of the character signed up. Two signup states are visually distinct: *signed up* (pending) and *roster confirmed*. The current raid lockout week (Tuesday → Monday) is highlighted, and hovering any day moves that highlight to the lockout week the hovered day belongs to.

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

## Interactions & Behavior

- **Prev / next** — shift the 21-day window by exactly 7 days (one week), not three. The window always starts on a Sunday.
- **Today** — reset the window start to the Sunday of the current week.
- **Hover a day cell** — set the active lockout week to that day's lockout week (`mouseenter`); on `mouseleave`, fall back to the lockout week containing today. All seven days of the active week highlight together, spanning the row boundary between Monday and Tuesday.
- **Click an event card** — open the detail dialog for that event.
- **Dialog dismissal** — click the backdrop or the `×`. Clicks inside the panel must not bubble to the backdrop handler.
- **Truncation, not reflow** — day columns are locked to equal widths; long raid names ellipsis-truncate. Never let content widen a column.
- No transitions or animations are specified. Hover feedback is an immediate background change.
- Keyboard focus: per the design system, `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` — never the browser default.

**Not yet designed** (raise before building if needed): overflow when a day has more events than fit its 260px row, event creation/editing, month or agenda views, mobile breakpoint, and the roster list inside the detail dialog (only the viewer's own character is shown today).

## State Management

Three pieces of state:

| State | Type | Purpose |
| --- | --- | --- |
| `anchor` | Date (a Sunday, midnight-normalized) | first day of the 21-day window |
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
| `Raid Calendar.dc.html` | standard desktop view (max 1600×1100) |
| `Raid Calendar 4K.dc.html` | 4K / 125%-scaling view (3072×1728 canvas) |
| `Class Colors.dc.html` | all 13 class colors × both event states |
| `_ds/nocturne-…/styles.css` | Nocturne token sheet + component layer — the source of every `var(--*)` above |
| `_ds/nocturne-…/_ds_bundle.js` | Nocturne component bundle |
| `support.js` | prototype template runtime — **do not port** |

Open any `.dc.html` directly in a browser to see it render.
