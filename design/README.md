# Handoff: Raid Calendar — Nebula (timeline rows)

## Overview
A three-week raid calendar for a World of Warcraft guild. Each week is a row of seven day
columns, and the vertical space inside each column is an **hourly timeline**: events are
positioned and sized by their real start/end times instead of being listed as chips. The
"Nebula" visual pass restyles the earlier flat version with a space-themed ground,
translucent glass surfaces, gradients and blurs, while keeping WoW class colors intact as
the primary way to identify an event's owner.

Two things are new since the last handoff:
1. **Per-row hourly timeline** (the layout model described under *Timeline model*).
2. **The Nebula visual language** (gradients, transparency, blur, starfield ground).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show
intended look and behavior. They are not production code to copy directly. The task is to
**recreate these designs in the target codebase's existing environment** (React, Vue,
SwiftUI, native, etc.) using its established patterns, component library and state
management. If no environment exists yet, pick the framework that best suits the project
and implement the designs there.

The prototype uses a small internal template runtime (`support.js`) — ignore it. Read the
markup and the logic class inside `Raid Calendar Nebula.dc.html` for structure, styling
and behavior, and reimplement both idiomatically.

## Fidelity
**High fidelity.** Colors, gradients, type sizes, spacing and the timeline geometry are
final. Recreate the UI closely, substituting the codebase's own primitives where they
exist. The one deliberately loose area is the event **content density** inside very narrow
lanes — see *Known constraints*.

---

## Timeline model (the core of this design)

Geometry constants:

| Constant | Value | Meaning |
| --- | --- | --- |
| `PX_PER_HOUR` | `30` | vertical scale of the timeline |
| `PAD_TOP` | `16` | px reserved above the first hour line, so the day number has room |
| `DEFAULT_START_H` | `17` | default first hour shown in a row (5 PM) |
| `DEFAULT_END_H` | `24` | default last hour shown in a row (12 AM) |

Rules:

1. **Each week row computes its own visible hour window, independently of other rows.**
   Start from the default window (5 PM – 12 AM). Then, for every event in any of that row's
   seven days, widen the window: `startH = min(startH, floor(event.startMin / 60))` and
   `endH = max(endH, ceil(event.endMin / 60))`. A row with an 11 AM event therefore shows
   11 AM – 12 AM while the other two rows stay at 5 PM – 12 AM.
2. **Row height** = `(endH - startH) * PX_PER_HOUR + PAD_TOP + 10` px. All seven day cells
   and the left time gutter in a row share that height.
3. **Hour lines** are drawn at `PAD_TOP + ((h * 60) - startMin) / 60 * PX_PER_HOUR` px for
   every whole hour from `startH` through `endH`, inclusive. The same positions are used
   for the gutter labels (vertically centered on the line via `translateY(-50%)`).
4. **Event position**: `top = PAD_TOP + ((startMin - rowStartMin) / 60) * PX_PER_HOUR + 1`px;
   `height = max(22, ((min(endMin, rowEndMin) - startMin) / 60) * PX_PER_HOUR) - 3`px.
   The +1/-3 leave a hairline of breathing room between stacked events.
5. **Overlap lanes**: within one day, sort events by start then end, and greedily group them
   into clusters where each event starts before the running max end of the cluster. Every
   event in a cluster of size `n` gets `left: calc(3px + (i / n) * 100%)` and
   `width: calc(100% / n - 6px)`, i.e. equal side-by-side lanes. Non-overlapping events
   occupy the full column width.
6. Day cells clip their contents (`overflow: hidden`).

### Grid structure
`grid-template-columns: 58px repeat(7, minmax(0, 1fr))` — a 58px time gutter, then seven
equal day columns. One header grid (weekday names) plus one grid per week row, all inside a
single rounded glass panel. Weekday header labels are Sun–Sat, uppercase, 11px/500,
letter-spacing .08em, `rgba(214,208,255,.66)`.

### Left time gutter
Background `linear-gradient(180deg, rgba(12,9,32,.5), rgba(12,9,32,.18))`; labels 10.5px/400
`rgba(206,199,255,.45)`, right-aligned 8px from the edge, formatted "5 PM", "12 AM".

---

## Screens / Views

### 1. Calendar (the only screen)

**Header row** — space-between, wraps.
- Title "Raid Calendar", 24px/1.2, heading font, weight 500, filled with
  `linear-gradient(92deg,#ffffff 0%,#c9b8ff 45%,#f7a8e8 100%)` clipped to the text.
- Subtitle: the visible date range, e.g. "August 16 – September 5, 2026", 13px/400,
  `rgba(214,208,255,.6)`.
- Right side: two 36px square glass nav buttons (`‹` `›`, radius 10px, border
  `1px solid rgba(145,132,217,.3)`, background
  `linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.02))`,
  `backdrop-filter: blur(10px)`; on hover border `rgba(199,184,255,.7)` and background
  `linear-gradient(180deg,rgba(145,132,217,.28),rgba(145,132,217,.08))`), then a "Today"
  button, 36px tall, radius 10px, border `1px solid rgba(199,184,255,.55)`, background
  `linear-gradient(135deg,rgba(145,132,217,.3),rgba(247,168,232,.14))`,
  `box-shadow: 0 0 18px rgba(145,132,217,.22)` growing to `0 0 26px rgba(145,132,217,.4)`
  on hover. Transitions .18s.

**Page ground** (nebula) — layered, non-scrolling:
```
radial-gradient(120% 80% at 12% -10%, #2b1b6b 0%, rgba(43,27,107,0) 55%),
radial-gradient(90% 70% at 88% 8%, #4a2a7a 0%, rgba(74,42,122,0) 50%),
radial-gradient(140% 100% at 60% 110%, #6b2b6b 0%, rgba(107,43,107,0) 45%),
linear-gradient(180deg,#0a0720 0%,#07051a 60%,#050410 100%)
```
Over it, a non-interactive starfield layer at `opacity: .5` built from ten 1–1.5px
`radial-gradient` dots at fixed percentage positions (#fff, #cfc9ff, #bfe0ff). Body
background `#06040f`. Content column `max-width: 1600px`, centered, `padding: var(--space-6)`.

**Grid panel** — radius 16px, `border: 1px solid rgba(145,132,217,.22)`, background
`linear-gradient(180deg,rgba(20,15,48,.62),rgba(10,8,26,.5))`, `backdrop-filter: blur(18px)`,
`box-shadow: 0 24px 70px rgba(4,2,14,.6), inset 0 1px 0 rgba(255,255,255,.06)`. The header
strip inside it is `linear-gradient(180deg,rgba(145,132,217,.14),rgba(145,132,217,.03))`.
Cell borders: right/bottom `1px solid rgba(145,132,217,.12)` (.14/.18 in the header strip).
Hour rules inside day cells are 1px,
`linear-gradient(90deg,rgba(145,132,217,.03),rgba(145,132,217,.14),rgba(145,132,217,.03))`
— they fade at both ends rather than stopping hard.

**Day cell**
- Base background `linear-gradient(180deg, rgba(255,255,255,.028), rgba(255,255,255,.008))`.
- Day number: a small pill at top 3px / left 5px, padding 1px 5px, radius 6px, 11.5px/500,
  `rgba(206,199,255,.55)` on a transparent ground. On the 1st of a month the label reads
  "Sep 1" instead of "1".
- **Today** gets the pill filled: text `#ffe7fa`, background
  `linear-gradient(135deg,rgba(247,168,232,.34),rgba(201,184,255,.18))`, and
  `box-shadow: 0 0 12px rgba(247,168,232,.35), inset 0 0 0 1px rgba(247,168,232,.5)` —
  the one saturated accent in the grid.
- **Lockout-week highlight** (see *Interactions*): background
  `linear-gradient(180deg, rgba(145,132,217,.10), rgba(145,132,217,.025))` plus
  `box-shadow: inset 0 1px 0 0 rgba(199,184,255,.24), inset 0 0 34px rgba(145,132,217,.06)`.
  Deliberately subtle. `transition: background .2s`.

**Event block**
- Absolutely positioned per *Timeline model*. Radius 9px, padding 5px 7px,
  `backdrop-filter: blur(6px)`, `overflow: hidden`, `z-index: 2`,
  `transition: transform .16s, box-shadow .16s`; hover `translateY(-1px)`.
- **Left rail** = class color: absolutely positioned, full height, radius 9px 0 0 9px.
  3px wide for confirmed events, 1.5px for signed-up ones. Content is padded 5px from it.
- Line 1: raid name, 11px/500, `#f6f4ff` (confirmed) or `rgba(246,244,255,.9)`
  (signed up), single line with ellipsis.
- Line 2: `"8:00 PM – 11:00 PM · Thrashclaw"`, 10px/400, `rgba(226,222,255,.62)`, ellipsis.
- **Horde mark**: 30px square in the bottom-right corner (right 2px, bottom 2px), the
  uploaded `horde-icon.svg` used as a CSS `mask` over a `#ff5a5a` fill at
  `opacity: .28`, `pointer-events: none`. Shown on Horde events only; Alliance events get
  no faction decoration.

**Event status treatments** — `color` below is the class color:

| | Confirmed | Signed up (tentative) |
| --- | --- | --- |
| border | `1px solid color-mix(in srgb, color 62%, transparent)` | `1px solid color-mix(in srgb, color 30%, transparent)` |
| background | `linear-gradient(135deg, color-mix(in srgb, color 46%, transparent) 0%, color-mix(in srgb, color 16%, transparent) 58%, rgba(20,15,48,.55) 100%)` | `linear-gradient(135deg, color-mix(in srgb, color 20%, transparent) 0%, rgba(20,15,48,.42) 70%)` |
| rail | `linear-gradient(180deg, color, color-mix(in srgb, color 35%, transparent))`, 3px | `linear-gradient(180deg, color-mix(in srgb, color 55%, transparent), color-mix(in srgb, color 12%, transparent))`, 1.5px |
| shadow | `0 6px 18px rgba(4,2,14,.45), 0 0 16px color-mix(in srgb, color 24%, transparent)` | `0 4px 14px rgba(4,2,14,.35)` |

Signed-up events used to be dashed; they are intentionally **not** dashed now — the
distinction is weight and opacity only.

### 2. Event detail dialog
Opens on clicking an event. Backdrop `rgba(6,4,15,.62)` with `backdrop-filter: blur(6px)`,
centered card 352px wide, radius 18px, background
`linear-gradient(160deg,rgba(36,26,84,.9),rgba(14,10,34,.92))`, border
`1px solid rgba(167,152,240,.34)`, `backdrop-filter: blur(22px)`,
`box-shadow: 0 30px 80px rgba(3,2,10,.7), inset 0 1px 0 rgba(255,255,255,.07)`.
Contents: raid name (16px/500), date + time line (12px, `rgba(214,208,255,.62)`), a 28px
close button, a tinted row repeating the event's own border/background/shadow with a 28px
class-color badge and `"Character · Class"` plus a status line ("Roster confirmed" /
"Signed up"), then "Difficulty: …" and a faction line — a 16×3px faction bar
(Horde `linear-gradient(90deg,#ff4b4b,rgba(255,75,75,.25))`, Alliance
`linear-gradient(90deg,#5aa8ff,rgba(90,168,255,.25))`, with a matching `0 0 8px` glow)
followed by the faction name.

### 3. New-event composer (right-click a day)
A 312px popover anchored at the cursor (clamped to the viewport: x ≤ `innerWidth - 320`,
y ≤ `innerHeight - 500`, min 8px), same glass treatment as the dialog at radius 16px, over
a full-screen transparent click-catcher that dismisses it. Sections separated by
`1px solid rgba(145,132,217,.2)`:
- Header: "New event" + the long date label ("Mon, August 17, 2026"), close button.
- Fields, each labelled 10.5px/500 uppercase letter-spacing .06em `rgba(196,188,240,.62)`:
  **Title** (text, autofocus, placeholder "Nerub-ar Palace"), **Start** / **End** (native
  `time` inputs, two columns, defaults 20:00 / 23:00), **Faction** (two half-width toggle
  buttons, Horde and Alliance, each with a 3.5×12px color bar; the selected one takes a
  tinted background — Horde `linear-gradient(135deg,rgba(196,39,45,.4),rgba(139,20,32,.18))`
  with border `rgba(255,107,107,.75)`, Alliance
  `linear-gradient(135deg,rgba(26,95,208,.4),rgba(15,63,158,.18))` with border
  `rgba(120,180,255,.75)`; unselected is `rgba(255,255,255,.04)` with border
  `rgba(145,132,217,.28)`), **Character** (text) and **Class** (select over all 13 WoW
  classes), each preceded by an 8px swatch of the chosen class color with a matching
  `0 0 10px` glow. A muted "One-time event" note closes the body.
- Footer: "Cancel" (ghost) and "Add event" — disabled at 55% opacity until the title is
  non-empty, otherwise `linear-gradient(135deg,rgba(145,132,217,.42),rgba(247,168,232,.2))`.

Input styling: 32px tall, radius 8px, background `rgba(12,9,32,.72)`, border
`1px solid rgba(145,132,217,.28)`, `backdrop-filter: blur(8px)`, text `#eae8ff` at 12.5px,
placeholder `rgba(234,232,255,.35)`, `color-scheme: dark`, focus ring
`2px solid #9184d9` at `outline-offset: 1px`.

---

## Interactions & Behavior
- **Prev / Next** shift the anchor date by ±7 days (one week at a time, three rows stay
  visible). **Today** snaps the anchor to the Sunday of the current week.
- **Lockout-week highlight**: WoW's raid lockout resets Tuesday, so a "lockout week" runs
  Tuesday → Monday and therefore straddles two calendar rows. Compute a day's lockout key
  as the most recent Tuesday at or before it. By default the lockout week containing today
  is highlighted; hovering any day cell highlights that day's lockout week instead
  (`onMouseEnter` sets the key, `onMouseLeave` clears it back to today's).
- **Click an event** → detail dialog. **Right-click a day** → new-event composer (suppress
  the native context menu; right-clicking again inside the overlay closes it).
- **Escape** closes the composer if open, otherwise the dialog. Clicking the backdrop
  closes either; clicks inside the card stop propagation.
- Adding an event appends it to local state at the day it was created on, styled as
  "confirmed" with difficulty "Not set".
- Hover: nav/Today buttons brighten, event blocks lift 1px.

## State Management
- `anchor` — Date, the Sunday that starts the first visible row.
- `selectedEvent` — the event shown in the dialog, or null.
- `hoverLockoutKey` — date key of the hovered lockout week, or null (falls back to today's).
- `composer` — `{ dayKey, dateLabel, x, y, title, start, end, character, class, faction }`
  or null.
- `custom` — user-created events. In production these, and the seeded events, come from
  the guild's roster/signup API; the prototype hardcodes 13 seed events across three weeks.

## Design Tokens

Class colors (WoW canonical — do not alter):
Death Knight `#C41E3A`, Demon Hunter `#A330C9`, Druid `#FF7C0A`, Evoker `#33937F`,
Hunter `#AAD372`, Mage `#3FC7EB`, Monk `#00FF98`, Paladin `#F48CBA`, Priest `#E9E9ED`,
Rogue `#FFF468`, Shaman `#0070DD`, Warlock `#8788EE`, Warrior `#C69B6D`.

Faction: Horde `#ff4b4b` (mark fill `#ff5a5a`), Alliance `#5aa8ff`.

Nebula ground: `#06040f`, `#050410`, `#07051a`, `#0a0720`, `#2b1b6b`, `#4a2a7a`, `#6b2b6b`.
Text: `#f6f4ff` / `#eae8ff` primary, `rgba(226,222,255,.62)` secondary,
`rgba(214,208,255,.6)` muted, `rgba(206,199,255,.45)` faintest. Accent `#9184d9`,
highlights `#c9b8ff` and `#f7a8e8`.

Radii: 8px inputs/small buttons, 9px event blocks, 10px header buttons, 16px composer and
grid panel, 18px dialog. Blur: 6px (events, dialog backdrop), 8px (inputs), 10px (buttons),
18px (grid panel), 22px (dialog/composer). Type: 10px, 10.5px, 11px, 11.5px, 12px, 12.5px,
13px, 13.5px, 16px, 24px; weights 400 and 500 only. Spacing comes from the design system's
compact `--space-*` scale (`--space-2` … `--space-6`).

## Assets
- `horde-icon.svg` — supplied by the user; used as a CSS mask, so its own fills are
  irrelevant. There is no Alliance equivalent by design.
- No other imagery. Icons elsewhere are text glyphs (`‹`, `›`, `×`).

## Known constraints
- In a three-way overlap the lane width drops to roughly 35px, so the raid name and time
  line truncate hard. Acceptable in the prototype; a production build may want a tooltip,
  a "+2 more" affordance, or a wider minimum lane with horizontal scroll.
- Only three week rows render, and only forward/backward by whole weeks. There is no month
  or agenda view.
- `color-mix()` is used throughout for the class-color tints. If the target platform lacks
  it, precompute the mixes per class at build time.

## Files
- `Raid Calendar Nebula.dc.html` — **the design to build.** Markup at the top, layout and
  state logic in the class at the bottom.
- `Raid Calendar.dc.html` — the previous flat version, for reference on what changed.
- `horde-icon.svg` — the faction mark.
- `support.js` — prototype runtime only. Ignore.
- `_ds/` — the Nocturne design system the spacing/font variables come from.
