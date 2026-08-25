# Zerpy design system

Zerpy is a dark glass interface system for a set of personal World of Warcraft Classic
tools: a shared raid calendar, an alt tracker, a few single-page helpers, and the portfolio
site that links them together. It came out of the calendar, which is why it is built for
density, identity and state — a lot of small blocks in a grid, each one belonging to a
character, each one at a different stage of commitment.

The look is a quieted space theme. A dim radial ground, a faint starfield, one saturated
accent, and everything else desaturated so the content is the only bright thing on screen.
It is deliberately sharp rather than soft: 4px corners, hairline borders, no large fills.

Dark is the primary theme. A light theme ships as a supported alternate, opt-in per
element with `data-theme="light"`.

## Sources

Everything here was ported from a mounted local folder, `Zerpy Design System/`, attached
read-only to this project. That folder was itself extracted from the Zerpy component
showcase pages and the raid calendar prototype in the project **"World of Warcraft
Calendar UI"** (`https://claude.ai/design/p/7ae234d8-97d2-4a99-92f9-04bb7a6a1cab`) — the
reader is not assumed to have access to either, so the values are recorded here in full.

There is no external brand, style guide, GitHub repository or production codebase behind
Zerpy. Nothing here is a recreation of a third party's design, with one flagged exception:
the WoW class and faction colors in `tokens/wow.css`, which are Blizzard's own values.

### What changed in this port

- **Tokenized every literal.** `components/controls.css` had hardcoded colors
  (`#ffdfe1`, `rgba(232,99,107,.55)`, `rgba(10,9,24,.6)`, the skeleton gradient). Those are
  now tokens — `--zp-danger-text`, `--zp-danger-line`, `--zp-surface-field`,
  `--zp-skeleton` — which is what makes a theme switch possible with no component edits.
- **Added a light theme** (`tokens/theme-light.css`) that re-declares every token under
  `[data-theme="light"]`. The accent ramp is deliberately *reversed* there: 100 becomes the
  deepest step, so a component writing `accent-100` on `accent-tint` stays legible in both
  themes without a conditional.
- **Added data-viz ramps** (`tokens/dataviz.css`): eight categorical series, a seven-step
  sequential ramp and a seven-step diverging ramp, in dark and light. The source had four
  semantic hues and nothing else, which is not enough for a chart.
- **Added control-height tokens** (`--zp-control-h-sm/-/-lg`) — 30 / 38 / 46px were
  repeated as literals across five files.
- **Components are `.tsx`** rather than `.jsx`, since the consuming sites are React and
  TypeScript. The sibling `.d.ts` files are the design system's props contract for tooling;
  when copying a component into a TS app, take the `.tsx` and drop the `.d.ts`.
- **UI kits load the compiled bundle** (`_ds_bundle.js`) instead of the source-fetching
  Babel shim the source folder used.

### Known substitution

Fonts are loaded from **Google Fonts**, not self-hosted binaries — the source folder had no
`.woff2` files, so there are none to copy. `tokens/fonts.css` is a single `@import`. If you
need offline or self-hosted webfonts, drop the binaries into `assets/fonts/` and replace
that import with `@font-face` rules. **If you have the original font files, send them and
I will self-host them properly.**

---

## Visual foundations

**Ground.** Every full-page view sits on `--zp-ground`: two dim purple radial washes at the
top corners over a vertical gradient from `#0d0e18` down to `#08080f`. A starfield overlay
(`--zp-starfield`) sits above it at 30% opacity, `pointer-events: none`. Both are tokens —
never hand-write the gradient. `PageShell` owns both. Reading surfaces (docs, long-form)
turn the starfield off; texture behind body copy is noise.

**Surfaces are translucent, not opaque.** `--zp-surface-1/2/3` are white at 2.8%, 4.5% and
7%. Panels use `--zp-surface-panel` (a top-lit 4.5%→1.2% gradient), overlays use
`--zp-surface-overlay` (a near-opaque violet-black), fields use `--zp-surface-field` (a
recessed dark well). A surface never has a solid hex fill; the ground shows through
everything.

**Depth is border + blur + soft ambient shadow.** Three steps and no more: flat rows inside
panels (`--zp-elev-flat`, no blur), panels on the page (`--zp-elev-panel`, 14px blur),
overlays above everything (`--zp-elev-overlay`, 22px blur). **Never nest a blur inside a
blur** — a panel inside a panel is flat. Inner shadow is one hairline highlight on the top
edge (`inset 0 1px 0 rgba(255,255,255,.05)`) and nothing else; there is no inset-shadow
system beyond that.

**Borders carry the structure.** Three weights: `--zp-line` for dividers,
`--zp-line-strong` for control edges, `--zp-line-accent` for anything active or selected.
Rules inside dense grids use `--zp-rule-fade`, which fades at both ends instead of stopping
hard — that detail is what keeps the calendar grid from looking like a spreadsheet. The one
dashed border in the system marks an empty state.

**Radius.** 4px is the default and covers controls, cards and panels. 2px for checkboxes and
inner segments, 8px for overlays, 12px for full-page glass shells, pill for counts and
progress tracks. The sharpness is intentional — round corners read as consumer-soft and
fight the density.

**Cards.** A card is a `Panel`: 1px `--zp-line` border, 4px radius, the panel gradient,
14px backdrop blur, and `--zp-elev-panel` — a wide soft shadow with a top highlight, not a
drop shadow. Cards never have a colored left border, never a filled header, and never more
than one radius.

**Color.** One accent, a desaturated blurple, as a nine-step ramp. In practice the accent
almost never appears as a solid fill: it appears as a 16% tint, an accent border, and a soft
glow. Primary buttons are an accent-tinted **outline with a glow**, never a filled button.
Four semantic hues (success, warning, danger, info), each with a matching 16% tint and a
40–55% border. Text is four steps of quiet, from `#f2f1fb` down to 45% opacity.

**Transparency and blur.** Blur appears in exactly three places: on panels (14px), on
overlays (22px), and behind fields (8px). Never on a row, never on text, never stacked. If
something already sits inside a blurred surface, it is flat.

**Gradient text** (`--zp-gradient-text`, white → periwinkle → mauve, background-clip) is for
display-size page titles only. Two per screen is one too many.

**Imagery.** There is none, and that is a real gap rather than a rule: the source material
contains the logo and nothing else. No photography, no illustration, no background
imagery, no texture beyond the starfield. If imagery gets added, the ground is cool and
desaturated, so warm or high-saturation photography will fight it.

**Motion.** One easing curve, `cubic-bezier(.2,.7,.3,1)`, on everything. 120ms for tooltips
and popovers, 180ms for hover, focus and dialogs, 280ms for the emphasis CTA. Overlays enter
with `zp-slide-in` — 6px up plus a fade, never a scale or a bounce. The one exception is
ambient glow: the CTA's orbiting ring takes 6s and its halo breathes over 4.5s, slow enough
to read as light rather than as a notification. All of it honors
`prefers-reduced-motion`.

**Hover.** A tint one step up plus a border brightening to `--zp-line-accent`. Text
brightens by one step. Nothing changes hue, nothing scales, and opacity is never used as a
hover state. Cards add the accent glow to their shadow and lift 2px; controls do not move.

**Press.** One step deeper — `--zp-accent-800` on primary, a stronger tint elsewhere. The
CTA returns to `translateY(0)`. Nothing shrinks.

**Focus.** One treatment everywhere: the control's own border brightens to
`--zp-focus-line` and picks up `--zp-focus-shadow` — a 1px accent edge plus the soft accent
glow. Nothing sits outside the control, so focus never adds a second silhouette and never
shifts layout. Borderless choices (checkbox, radio) put that edge on their 16px mark, which
is the only border they have.

**Disabled.** 45% opacity with the glow removed. Never a grey fill.

**Layout.** `PageShell` centers a single column — 1040px for reading, 1280–1440px for dense
app views — with `--zp-space-10` between sections. Fixed elements are limited to two: the
`ToastStack` (bottom right, z-index 40) and modal overlays (z-index 50–60). There is no
fixed header and no sticky footer; sidebars are `position: sticky` within the column, not
fixed. Sibling groups are laid out with flex or grid and `gap`, never inline flow.

**Protection.** No scrims or protection gradients over imagery, because there is no imagery.
Overlay legibility comes from the near-opaque `--zp-surface-overlay` plus a blurred scrim
(`rgba(6,6,14,.62)` at 6px) behind dialogs.

**Loading.** Skeletons hold the exact box of the thing arriving, so nothing shifts. Content
shimmers; controls pulse (a shimmering button reads as clickable). Frames are real from the
first paint — a border is not data, so only the value inside a field shimmers. Number
placeholders are sized to the widest plausible value, never the current one. Nothing is left
shimmering after a failure.

**Emptiness.** The dashed border marks an empty state, so emptiness is legible without a
color.

---

## Content fundamentals

The voice is a competent guild officer: plain, specific, and slightly dry. It assumes the
reader knows the domain.

- **Second person, present tense.** "Right-click any day to schedule a raid." Not "Users
  can right-click…", not "Let's schedule a raid!"
- **First person only for personal writing** — the portfolio site says "A shared calendar,
  an alt tracker, and a handful of helpers I use every week." Product UI never says "I".
- **Say the gesture.** Empty states and hints name the actual interaction, not the goal:
  "Right-click any day to schedule a raid, or copy last week across."
- **Toasts are past tense and specific.** "Event published", "20 members notified". Never
  "Success!" or "Done!"
- **Errors state the rule that was broken**, not the failure: "Mythic is capped at 20." Not
  "Invalid roster size."
- **Hints state effect, not restatement.** Under "Raid reminders": "Ping an hour before
  pull." Under "Event title": "Shown on the calendar block."
- **Deltas name their baseline.** "+4 vs last tier", "+5 vs average". A number with no
  comparison is noise.
- **Say what is unfinished.** "Not finished: the comparison view only handles one route at
  a time." Placeholder content is labelled as such rather than dressed up.
- **Casing.** Sentence case everywhere — buttons, titles, labels. The only uppercase is the
  mono micro-label, and that is tracking, not shouting.
- **No emoji.** Ever. Status is a colored dot; identity is a colored rail.
- **Length.** One line for a hint, two sentences for a dialog description. If it needs three,
  the UI is wrong.

---

## Iconography

There is **no icon set** in the source material, and none was invented. What the system
actually uses:

- **Unicode glyphs** as icons, set in the UI font: `⋯` for overflow menus, `✕` for dismiss,
  `‹ ›` for pagination and back links, `✓` for checkboxes, `—` and `0` for empty-state
  glyphs. They are set in `--zp-font-ui` or `--zp-font-data`, never scaled above 15px.
- **Colored rails and dots** instead of icons for identity and state. A 3px vertical rail is
  a class or a faction; a 5–6px glowing dot is a status; a 6px square dot is a data series.
  This is the system's substitute for an icon language, and it scales better in a dense grid
  than any glyph would.
- **No SVG icon library, no icon font, no PNG icons, no emoji.** `assets/` holds the logo
  and its variants, nothing else.
- If a project genuinely needs an icon set, use **Lucide at 1.5px stroke** — it is the
  closest match to the border weights here — from CDN, and flag it as an addition. Nothing
  in this system currently depends on it.

---

## Logo

The mark is a **Z with a full-bleed rail**: a 4px vertical bar at x=8 running the whole
height of a 100×100 square, and a hard-angled Z drawn as a polygon. No font dependency, no
curves, no gradient. It matches the system's 3px identity rails and hairline borders, which
is the point — the logo is the same vocabulary at a larger size.

**Placement.** The rail bleeds top and bottom, so the mark takes **zero vertical padding**
and is sized by height, never width. Horizontal padding is free. Minimum height 20px; below
that the rail and the Z's crossbar merge.

**Page header — the default web size.** On a web page the mark leads a heading and
subheading, and the **letter** spans them exactly: its top on the heading's cap line, its
bottom on the subheading's baseline, with the rail bleeding past both. The letter occupies
the middle 56% of the square, so:

```
mark height = 1.77 × (heading line-box + subheading line-box)
then shift down by 3% of that height    /* the letter sits 3 units above center */
gap to text = 20–22px
```

For a 32px/1.15 heading over a 19px/1.35 subheading that is a 111px mark, nudged down 3px.
With no subheading, size the letter to the heading's cap height alone. The heading takes
`--zp-gradient-text`, the subheading `--zp-text-3`.

**Wordmark lockup.** Where the name is needed instead of a page title: mark plus "Zerpy" in
Instrument Sans 500 at the mark's height, one rail-width between them. Sentence case, never
uppercase, never letterspaced open.

**Color.** The letter is `#f2f1fb` on dark and `#0b0c14` on light — never anything else,
never the accent. The **rail** is what varies:

| Rail | Value | Use |
| --- | --- | --- |
| accent | `#9184d9` | default, all Zerpy.dev sites |
| accent-400 | `#a99cf0` | when the default sits on a dark accent field |
| blurple | `#8788EE` | alternate |
| cyan | `#3FC7EB` | alternate |
| class / faction | `tokens/wow.css` | one per site or surface, fixed |

One rail per surface, chosen once. The rail is identity, never state.

**Files** — `assets/logo/`

```
zerpy-accent.svg        primary; accent rail, white Z. Dark backgrounds.
zerpy-accent-tile.svg   the same on the ground as a rounded tile. Favicon / app icon.
zerpy-mono-light.svg    single color #f2f1fb, rail included.
zerpy-mono-dark.svg     single color #0b0c14, rail included.
accent/                 the four accent rails × white and black letters.
class/                  thirteen class rails + both factions, white letter.
black/                  the same set with the black letter, for light backgrounds.
```

Rogue, priest and monk rails lose contrast on white; on light backgrounds use the accent or
a darker class rail.

`assets/` also holds the derived app icons: `favicon.svg`, `icon-mono.svg`, and PNG renders
at 192/512 plus an apple-touch icon. Regenerate them from `zerpy-accent-tile.svg` rather
than editing them.

---

## Identity colors (add-on)

`tokens/wow.css` carries Blizzard's thirteen class colors and the two faction colors. These
are third-party brand values included because the source product is a WoW tool. Rules:

- Used as a **3px rail or a small dot only**. Never as a surface, never as text, never as a
  button fill.
- Never remapped to mean status — a class color means "this is Thrashclaw's druid", nothing
  more. Status is the semantic palette.
- Drop this import entirely in projects with no WoW vocabulary.

---

## Index

```
styles.css                    the entry point — @import lines only
thumbnail.html                the homepage tile
tokens/
  fonts.css                   Instrument Sans + Roboto Mono (Google Fonts)
  colors.css                  ground, starfield, surfaces, lines, text, accent, status
  theme-light.css             every token re-declared under [data-theme="light"]
  typography.css              composite font shorthands + tracking
  spacing.css                 4px space scale, radius, control heights
  depth.css                   blur, elevation, motion, focus
  dataviz.css                 categorical, sequential and diverging ramps
  wow.css                     class + faction colors (add-on)
components/
  controls.css                the pseudo-state layer (:hover, :focus-visible, @keyframes)
  buttons/                    Button · IconButton · CtaButton
  forms/                      Field · Input · Textarea · Select · Switch · Checkbox · Radio · SegmentedControl
  data/                       Badge · Tag · CountBadge · StatCard · Progress · Skeleton
  feedback/                   Dialog · Toast · ToastStack · Tooltip · Popover · EmptyState
  surfaces/                   PageShell · Panel · SectionHeading
  marketing/                  Hero · CodeBlock
guidelines/                   26 foundation specimen cards (colors, type, spacing, depth, data viz, brand, themes)
ui_kits/
  ds-runtime.js               kit boot loader (prefers _ds_bundle.js, falls back to sources)
  raid_calendar/              the calendar screen — see its README
  portfolio/                  landing + project page, and the theme switch
  alt_tracker/                the per-character task and marks board
  docs/                       documentation page + changelog
assets/                       logo and rail variants, app mark, mono mark, PNG renders
SKILL.md                      Agent Skill wrapper, for use in Claude Code
```

### Components

**Buttons** — `Button`, `IconButton`, `CtaButton`
**Forms** — `Field`, `Input`, `Textarea`, `Select`, `Switch`, `Checkbox`, `Radio`, `SegmentedControl`
**Data** — `Badge`, `Tag`, `CountBadge`, `StatCard`, `Progress`, `Skeleton`
**Feedback** — `Dialog`, `Toast`, `ToastStack`, `Tooltip`, `Popover`, `EmptyState`
**Surfaces** — `PageShell`, `Panel`, `SectionHeading`
**Marketing** — `Hero`, `CodeBlock`

Each component directory holds `<Name>.tsx`, `<Name>.d.ts` (props contract, adherence rules
and starting-point tags) and `<Name>.prompt.md` (what it is, when to use it, a usage
example), plus one specimen card per directory.

### UI kits

| Kit | What it recreates |
| --- | --- |
| `ui_kits/raid_calendar/` | Three lockout weeks, event composer, detail dialog |
| `ui_kits/portfolio/` | Hero, project grid, project page, dark/light switch |
| `ui_kits/alt_tracker/` | Character rail, task board, battleground marks |
| `ui_kits/docs/` | Sidebar nav, prose, code samples, props table, changelog |

## Notes on the extraction

- Every component from the source folder is here, and its counterpart existed in the
  original showcase pages. Nothing was added to round out a "standard" component set —
  there is no Avatar, no Tabs, no Accordion, because the source never defined one.
  `SegmentedControl` is the tab bar.
- **Intentional additions:**
  - `Hero` — the portfolio site needs an opening section, and the source system had no
    marketing surface. Assembled entirely from existing tokens.
  - `CodeBlock` — the docs surface needs code samples. Its five highlight colors come from
    the data-viz categorical ramp rather than a new palette.
  - `PageShell`, `SectionHeading` and `ToastStack` were extractions in the source port,
    factored out of markup its showcase pages repeated on every section.
- Token names use the `--zp-` prefix. Older Zerpy work on `--nb-` is a global
  find-and-replace.
