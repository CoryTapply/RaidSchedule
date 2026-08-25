# Claude Code prompt — Raid Calendar restyle + event popup rebuild

Copy everything below the line into Claude Code, from the repo root of the raid calendar app.

---

## Step 0 — swap the design system first

The app currently ships a different design system. Do this migration as its own commit,
before any of the styling work below, and verify the app still renders unchanged in shape
before you start restyling.

1. **Vendor the Zerpy source** into the app — copy the design system folder to
   `src/design-system/zerpy/` (tokens, `components/`, `styles.css`, `assets/`). Import
   `styles.css` once at the app entry point; it `@import`s every token file in the right
   order. Do not import individual token files ad hoc.
2. **Inventory the old system.** `rg` for its token prefix, its class names, and its
   component imports, and write the results to `MIGRATION.md` as a checklist grouped by
   file. That list is the definition of done.
3. **Map the tokens.**
   - *If the old system is Nebula (`--nb-*`)*: it is the same system under an older prefix —
     the values are identical. A global `--nb-` → `--zp-` find-and-replace covers almost
     everything. Afterwards, `rg -- '--nb-'` must return nothing, and check the handful of
     tokens Zerpy added that Nebula lacks (`--zp-surface-field`, `--zp-skeleton`,
     `--zp-danger-text`, `--zp-danger-line`, `--zp-control-h-sm/-/-lg`, the `dataviz` ramps)
     — anywhere the old code hardcoded those values as literals, replace the literal with the
     token.
   - *If it is anything else*: build an explicit old-token → `--zp-*` table in `MIGRATION.md`
     first, then apply it. Where the old system has no equivalent, pick the nearest Zerpy
     token rather than inventing a value, and list that decision in the table. Delete the old
     token file at the end; do not leave both loaded.
4. **Replace components, don't restyle them.** Swap the old button/input/select/dialog/etc.
   for the Zerpy `Button`, `IconButton`, `CtaButton`, `Field`, `Input`, `Textarea`, `Select`,
   `Switch`, `Checkbox`, `Radio`, `SegmentedControl`, `Badge`, `Tag`, `CountBadge`,
   `StatCard`, `Progress`, `Skeleton`, `Dialog`, `Toast`, `ToastStack`, `Tooltip`, `Popover`,
   `EmptyState`, `PageShell`, `Panel`, `SectionHeading`. Each component directory has a
   `.d.ts` props contract and a `.prompt.md` describing when to use it — read those before
   wiring. Zerpy has no Avatar, Tabs or Accordion: `SegmentedControl` is the tab bar; for
   anything else genuinely missing, compose it from `Panel` plus tokens and flag it in
   `MIGRATION.md` rather than porting the old component's styles.
5. **Page shell.** Wrap the top-level route in `PageShell` and delete any hand-rolled page
   background, gradient or starfield markup — the shell owns `--zp-ground` and
   `--zp-starfield`.
6. **Then sweep for leftovers**: hardcoded hex/rgba values, `box-shadow` literals, nested
   `backdrop-filter` (never blur inside a blur), border radii other than 2/4/8/12/pill,
   easing curves other than `cubic-bezier(.2,.7,.3,1)`, and any emoji used as an icon.
   Zerpy has no icon set — Unicode glyphs (`⋯ ✕ ‹ › ✓ —`) in the UI font, colored rails and
   dots for identity and state.
7. Fonts load from Google Fonts via `tokens/fonts.css`. If the app self-hosts webfonts,
   keep the self-hosted files and replace that `@import` with the matching `@font-face`
   rules — Instrument Sans and Roboto Mono, same weights.

Commit as: design system swap → visual parity check → then the changes below.

## Task

Update the raid calendar's visual styling and rebuild the **New event** and **Edit event**
popups to match the current Zerpy design-system prototype. The prototype is a single-file
design component, `Raid Calendar Zerpy.dc.html`; read it first and treat it as the source of
truth for every value below. Do not restructure the app's data layer, routing, or the
Raid-Helper sync — this is a presentation change plus one new field (faction).

Follow the Zerpy design system. All colors, type, spacing, radii, blur and motion come from
`--zp-*` tokens. No new hex literals except where explicitly listed below.

## 1. Calendar grid

- Layout is a CSS grid, `62px repeat(7, minmax(0,1fr))`: a gutter column of hour labels plus
  seven day columns. One grid row per lockout week; render 3 weeks by default.
- Header row: `--zp-surface-2`, bottom `1px solid --zp-line`, each cell `10px 12px`,
  weekday label in `--zp-text-micro`, uppercase, `--zp-tracking-micro`, `--zp-text-3`.
- Gutter column: `--zp-surface-1`. Hour labels are absolutely positioned at their hour's
  offset, `translateY(-50%)`, right-aligned 10px in, `--zp-text-micro` / `--zp-text-4`.
- Day cells: `border-right` and `border-bottom` of `1px solid --zp-line`, `overflow:hidden`,
  transparent background by default. Hour lines inside the cell are 1px full-width
  `--zp-rule-fade` (fades at both ends — this is what keeps the grid from reading as a
  spreadsheet).
- **Lockout band.** The week row containing today — or the row being hovered — is
  highlighted: cell background `--zp-surface-1` plus `box-shadow: inset 0 1px 0 0
  var(--zp-line-accent)` on its top edge. Hovering any day sets the highlight for that whole
  week row.
- Day number: top-left, 5px/8px inset, `--zp-text-micro`, letter-spacing `.06em`,
  `--zp-text-4`; today is `--zp-accent-300`. The 1st of a month shows `Mon 1` instead of `1`.
- Vertical scale is driven by a `pxPerHour` value (default 30). Each row computes its own
  start/end hour: default 17:00–24:00, expanded to fit any event that falls outside it.
- Caption under the grid, `--zp-text-sm` / `--zp-text-3`: "Right-click any day to schedule a
  raid. The highlighted band is the current lockout."

## 2. Event cards

Cards are absolutely positioned inside the day cell, `top`/`height` from the time range
(minimum height 24px, minus 3px for the gap), `border-radius: var(--zp-radius)` (4px),
`overflow:hidden`, `z-index:2`, `container-type: inline-size`.

Overlap handling: events whose ranges touch form a cluster and split the column width evenly
(`left: calc(4px + i/n * 100%)`, `width: calc(100%/n - 8px)`). When a cluster has 2 or more
events, the second meta line is hidden and only the title shows.

**Class color drives the whole card; status drives its weight.** Given the class color and a
`mix(pct)` = `color-mix(in srgb, <class color> <pct>%, transparent)`:

| | Confirmed | Signed up (not confirmed) |
| --- | --- | --- |
| rail | `linear-gradient(180deg, color, mix(35))`, 3px wide | `linear-gradient(180deg, mix(55), mix(12))`, 1.5px wide |
| border | `1px solid mix(62)` | `1px solid mix(30)` |
| background | `linear-gradient(135deg, mix(46) 0%, mix(16) 58%, rgba(13,14,24,.55) 100%)` | `linear-gradient(135deg, mix(20) 0%, rgba(13,14,24,.42) 70%)` |
| shadow | `0 6px 18px rgba(4,4,10,.45), 0 0 16px mix(24)` | `0 4px 14px rgba(4,4,10,.35)` |
| overlay | none | `repeating-linear-gradient(135deg, rgba(255,255,255,.07) 0 1.5px, rgba(255,255,255,0) 1.5px 7px)` |
| title color | `--zp-text` | `--zp-text-2` |
| badge tone | `success` | `warning` |

Class colors come from `tokens/wow.css` (`--zp-class-*`) and are used as the rail and the
tint only — never as a text color or a flat fill.

Card contents, left to right: the rail (full height), then a `4px 6px` column holding the
raid name (`--zp-text-label` at 11px, single line, ellipsis) and, when the cluster is a
single event, `start time · character` in `--zp-text-micro` / `--zp-text-4`.

Hover: `translateY(-1px)` only, transitioned over `--zp-dur` / `--zp-ease`. Nothing scales.

**Horde mark.** Events whose faction is Horde get the horde silhouette in the bottom-right
corner of the card:

```css
position: absolute; right: 2px; bottom: 2px;
width:  clamp(30px, calc(14px + 1cqi), 36px);
height: clamp(30px, calc(14px + 1cqi), 36px);
opacity: .68;
background: var(--zp-faction-horde);
mask: url('<horde icon>.svg') no-repeat center / contain;
-webkit-mask: url('<horde icon>.svg') no-repeat center / contain;
pointer-events: none;
```

It is a masked shape tinted with the faction token, not a colored image — so it inherits the
faction color and stays legible on every class tint. The `cqi` unit needs
`container-type: inline-size` on the card. Alliance events get no mark.

## 3. Event detail dialog (click an event)

A Zerpy `Dialog`, 380px wide, title = raid name, description = `<date> · <start> – <end>`.
Body:

- One bordered row (`1px solid --zp-line`, `--zp-radius`, `--zp-surface-1`, `--zp-space-3`
  padding) with a 3px full-height class rail on the left, then character name
  (`--zp-text-label`) over class name (`--zp-text-micro`, uppercase, `--zp-tracking-micro`,
  `--zp-text-4`), and a status `Badge` (`success` / `warning`) pushed to the right.
- A footer line: `--zp-text-micro` / `--zp-text-4` reading "Times come from Raid-Helper and
  can't be changed here.", with a ghost `Button size="sm"` labelled "Edit" that hands off to
  the composer in edit mode.

## 4. New / edit event composer

One component covering all three modes — **new event**, **edit local event**, **edit
Raid-Helper event** — anchored as a popover, not a centered modal.

- A full-viewport transparent click-catcher (`position:fixed; inset:0; z-index:60`) closes it
  on click and swallows right-click. The panel itself stops propagation.
- Panel: positioned at the click point (clamped to the viewport), width 336px,
  `max-height: calc(100vh - 24px)`, `background: var(--zp-surface-overlay)`,
  `backdrop-filter: blur(var(--zp-blur-lg))`, `1px solid var(--zp-line-strong)`,
  `border-radius: var(--zp-radius-md)` (8px), `box-shadow: var(--zp-elev-overlay)`,
  entering with `animation: zp-slide-in var(--zp-dur) var(--zp-ease)` (6px up + fade, no
  scale).
- Three regions, header and footer separated by `1px solid --zp-line`, the middle scrolling.

**Header:** a 3px class-colored rail spanning the header height, then a mode label
(`--zp-text-micro`, uppercase, `--zp-tracking-micro`, `--zp-text-4`) reading "New event",
"Edit event" or "Edit Raid-Helper event", the long date under it in `--zp-text-label`, and a
small ghost `IconButton` `✕` on the right.

**Body** — Zerpy `Field` wrappers, `--zp-space-3` between them:

1. **Title** — `Input`, placeholder "Nerub-ar Palace", autofocused.
2. **Start / End** — two time `Input`s in a `1fr 1fr` grid. For Raid-Helper events this is
   replaced by a read-only **Time** field: the range rendered in a 38px
   `--zp-surface-field` well with hint "Set in Raid-Helper."
3. **Character** — `Input`, placeholder "Character name".
4. **Class** — `Select` of all thirteen classes, preceded by a 3px × 20px swatch of the
   selected class color.
5. **Faction** — `SegmentedControl` with `Alliance` / `Horde`, preceded by a 3px × 20px
   swatch of `--zp-faction-alliance` / `--zp-faction-horde`. This is the field that drives
   the Horde mark on the card.
6. **Status** — `SegmentedControl` with `Confirmed` / `Signed up`, preceded by a 3px × 20px
   swatch showing the live card treatment (class rail with the diagonal hairline overlay laid
   over it when "Signed up" is selected), so the swatch previews the card the user will get.

**Footer:** left side is one contextual note or action — ghost "Delete" when the event can be
deleted, "From Raid-Helper" (`--zp-text-micro` / `--zp-text-4`) for synced events, "Esc to
dismiss" for a new one. Right side is ghost "Cancel" plus primary "Add event" / "Save",
disabled while the title is empty. Both `size="sm"`.

Keyboard: Escape closes; Enter in the title field saves when valid.

## Copy rules

Sentence case everywhere. No emoji. Hints state an effect, not a restatement. Errors state
the rule that was broken ("Mythic is capped at 20."), toasts are past tense and specific
("Event published").

## Acceptance

- Grid, cards, dialog and composer read identically to `Raid Calendar Zerpy.dc.html` at the
  same width.
- Horde events show the mark bottom-right at 0.68 opacity, sized between 30 and 36px with the
  card width, and it is not clipped at the narrowest column (two overlapping events in one
  day).
- Faction round-trips: set it in the composer, save, reopen — it persists and the mark follows.
- Confirmed and signed-up cards are distinguishable without color vision (rail width, border
  weight and the hairline overlay all differ).
- No hardcoded colors outside the class/faction tokens and the four `rgba(13,14,24,…)` /
  `rgba(4,4,10,…)` ground values listed above.
- `prefers-reduced-motion` disables the slide-in and the hover lift.
