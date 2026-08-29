# Design system migration: Nocturne → Zerpy

## Old system inventory (definition of done for step 0)

The old system (`packages/web/src/styles/tokens.css`, "Nocturne") is not
`--nb-`-prefixed, so there's no mechanical find-and-replace — every usage
below is being ported by hand as each surface is restyled.

Everywhere the old token custom properties or utility classes are referenced,
grouped by file (`rg -- '--color-|--space-|--radius-|--shadow-|--font-heading|--font-body' packages/web/src`,
`rg 'className="(card|field|input|btn|dialog)'`):

- [x] `packages/web/src/styles/tokens.css` — the vendored Nocturne sheet
      itself. Deleted; no longer imported from `main.tsx`.
- [x] `packages/web/src/auth/LoginPage.tsx` — raw `.card`, `.card-title`,
      `.field`, `.input`, `.btn btn-primary btn-block` classes, plus one
      inline `var(--color-bg)`. Rebuilt on `PageShell`/`Panel`/`Field`/
      `Input`/`Button`.
- [x] `packages/web/src/styles/calendar.module.css` — `var(--space-N)`,
      `var(--font-heading)`, `var(--font-body)` throughout (gaps/padding and
      font-family only; the Nebula pass never routed its literal
      rgba()/hex colors through Nocturne tokens).
      Rewritten wholesale against `--zp-space-*` / `--zp-font-ui` /
      `--zp-font-body` and the rest of the grid spec in the task prompt.
- [x] `packages/web/src/styles/composer.module.css` — same `--space-N`/
      `--font-*` usage. Replaced by the new popover-composer styling.
- [x] `packages/web/src/styles/dialog.module.css` — same. Replaced; the
      detail dialog is now the vendored `Dialog` component plus a thin
      styles module for its body content.
- [x] `packages/web/src/styles/eventCard.module.css` — `--space-N`/
      `--font-body` for type sizing only; the color-mix formulas were
      already static per-class-color math, ported as-is with radius/blur
      swapped to `--zp-*`.

No other files referenced Nocturne tokens or classes.

## Token mapping (Nocturne → Zerpy)

Nocturne isn't Nebula-prefixed, so this is a hand-built table rather than a
`--nb-` → `--zp-` replace. Nocturne's raw `--color-*`/`--space-*`/`--radius-*`
tokens were mostly *not* what drove the Nebula-era visual design (that used
literal rgba()/hex colors instead) — the table below is for the few
places that did reference them (LoginPage, and gap/font shorthand in the
calendar/composer/dialog/eventCard modules).

| Nocturne | Zerpy | Notes |
| --- | --- | --- |
| `--color-bg` | `--zp-bg` / `--zp-ground` | Flat page background → the layered ground gradient; `PageShell` owns it. |
| `--color-surface` | `--zp-surface-1` / `--zp-surface-2` / `--zp-surface-panel` / `--zp-surface-field` | Nocturne had one flat surface; Zerpy has translucent tints per role (panel vs. field vs. row) — picked per component. |
| `--color-text` | `--zp-text` | Direct. |
| `--color-accent` | `--zp-accent` | Direct (both are the same desaturated blurple family; Zerpy's is the newer, tokenized ramp). |
| `--color-divider` | `--zp-line` / `--zp-line-strong` | Nocturne had one divider weight; Zerpy has two (dividers vs. control edges) — picked per use. |
| `--space-1..8` (2.8/5.6/8.4/11.2/–/16.8/–/22.4px) | `--zp-space-1..8` (4/8/12/16/20/24/32/40px) | Not numerically equal — nearest matching step by role, not by px value (Zerpy's scale is coarser and starts wider). |
| `--radius-sm` / `-md` / `-lg` (4/8/14px) | `--zp-radius-xs` / `-radius` / `-radius-md` (2/4/8px) | Zerpy is sharper across the board — see readme's "sharpness is intentional" note. Nocturne's `-lg` (14px) has no equivalent; the composer/dialog now use `--zp-radius-md` (8px) per the task spec. |
| `--shadow-sm` / `-md` / `-lg` | `--zp-elev-flat` / `-panel` / `-overlay` | Nocturne's shadows were solid-ink hairline+drop-shadow pairs; Zerpy's are blur+ambient-glow pairs tied to the three depth steps (flat row / panel / overlay), not a literal 1:1 shadow swap. |
| `--font-heading` / `--font-body` (Inter) | `--zp-font-ui` / `--zp-font-body` (Instrument Sans) | Same role split, different typeface — both load from Google Fonts already, no self-hosting to migrate. |
| `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-ghost` | `Button` (`intent="primary\|secondary\|ghost\|danger"`) | Component, not a class — see below. |
| `.input` | `Input` / `Select` (`className="zp-in"`) | Component. |
| `.field` | `Field` | Component. |
| `.card` / `.card-title` | `Panel` (no title slot — callers render their own heading) | Component. |
| `.dialog` / `.dialog-backdrop` | `Dialog` | Component. |

## Component vendoring — what "vendor the Zerpy source" actually meant here

**Update:** as of the DesignSync-based refresh described below, this section's
original premise no longer holds — real component source is now vendored
verbatim. The original history is kept below because it explains *why* the
old hand-built components looked the way they did, which is still useful
context for anything not yet re-derived from the real source.

### Original state (superseded)

The exported design-system folder (a top-level `design/` folder, since removed
now that `packages/web/src/design-system/zerpy` is the single source of truth)
did **not** contain the individual component `.tsx` files the manifest and
readme describe (`components/buttons/Button.tsx`, `components/forms/Field.tsx`,
etc.) — only `components/controls.css` (the real pseudo-state layer) and a
compiled `_ds_bundle.js` meant for the design tool's own runtime (an
`x-import component-from-global-scope="ZerpyDesignSystem_203cea.Button"`
loader), not an importable ES module for this Vite app.

So `packages/web/src/design-system/zerpy/` vendored what was actually real
and copyable — `tokens/*.css`, `components/controls.css`, `styles.css`, the
accent logo SVG — verbatim, and `components/*.tsx` were hand-built from three
real sources: `controls.css`'s class contracts, `readme.md`'s stated
behavior/token usage, and the exact markup in the `Raid Calendar Zerpy.dc.html`
prototype file from that same now-removed `design/` export
(the actual finished prototype, not just the CSS). Two gaps controls.css
didn't cover were filled the same way: `SegmentedControl`'s container/
selected-state and `Badge`'s tones had no controls.css rule, so both were
built directly from the token set (accent-tint for selection, the four
semantic tint+line pairs for badge tones) rather than guessed at.

### Current state — real source vendored via DesignSync

The claude.ai/design project backing this folder (`Zerpy Design System`,
`projectId 203cea59-a7c1-4bdb-9b23-9c56d77ed2fc`) turned out to actually
contain real, hand-authored `.tsx`/`.d.ts` source for every component — the
original partial export above just never pulled it in. Using the `DesignSync`
tool's read access, the full project (`components/`, `guidelines/`,
`ui_kits/` demos, `uploads/`, a fuller `assets/`, and a `SKILL.md`) was
mirrored into `_ds/zerpy-design-system-203cea59-a7c1-4bdb-9b23-9c56d77ed2fc/`.
Only what the app actually consumes gets re-copied from there into
`packages/web/src/design-system/zerpy/` — `guidelines/`, `ui_kits/`,
`uploads/`, the extra logo rail variants, and `SKILL.md` stay in `_ds/` only.

The 9 components this app uses (`Badge`, `Button`, `Dialog`, `Field`,
`IconButton`, `Input`, `PageShell`, `Panel`, `SegmentedControl`, `Select`)
are now the real vendored `.tsx`, not hand-built. Per `readme.md`'s own
stated convention ("when copying a component into a TS app, take the `.tsx`
and drop the `.d.ts`"), only the `.tsx` was kept for each. All 9 turned out
to use **zero CSS Modules** — every one is self-contained via inline
`style={{...}}` plus the global `zp-*` classes in `controls.css`/`styles.css`
— so the `.module.css` siblings the hand-built versions needed
(`Badge.module.css`, `Dialog.module.css`, `Field.module.css`,
`IconButton.module.css`, `PageShell.module.css`, `Panel.module.css`,
`SegmentedControl.module.css`) were deleted as dead weight.

Refreshing `controls.css` from the real project was a **required** step, not
a no-op: the currently-vendored copy predated `.zp-in-err`,
`.zp-sel-wrap`/`.zp-sel`/`.zp-sel-arrow`, and `.zp-seg-thumb` — rules the
real `Input`, `Select`, and `SegmentedControl` components depend on.

Small adaptations were needed to drop the real source into this repo's flat
`components/` layout and strict TS config (the source project nests
components under `buttons/forms/data/feedback/surfaces/marketing/`
subfolders and doesn't use `verbatimModuleSyntax`):
- `Dialog.tsx`'s `import { IconButton } from '../buttons/IconButton'` became
  `from './IconButton.js'` (flat layout, plus this repo's NodeNext-style
  explicit `.js` extensions on relative imports).
- `IconButton.tsx`'s `import { Button, ButtonProps } from './Button'` became
  a type-only import for `ButtonProps` (`verbatimModuleSyntax`).
- `SegmentedControl`'s `options` prop widened from `Array<...>` to
  `ReadonlyArray<...>` so the existing call sites' `as const` tuples
  (`FACTION_OPTIONS`, `STATUS_OPTIONS`) still typecheck, and its `extends
  HTMLAttributes<HTMLDivElement>` narrowed to `Omit<..., 'onChange'>` since
  the real component's `onChange: (next: string) => void` collides with the
  DOM `onChange` event-handler signature otherwise.
- `EventComposer.tsx`'s two `<SegmentedControl ariaLabel="…">` call sites
  became `aria-label="…"` — the real component has no camelCase
  convenience prop, it just spreads native HTML attributes.
- The real `SegmentedControl` renders `role="tablist"`/`role="tab"` with
  `aria-selected` (plus an animated sliding-thumb indicator, driven by
  `.zp-seg-thumb`) instead of the hand-built version's plain
  `role="group"`/`aria-pressed"` buttons — `EventComposer.test.tsx`'s
  assertions were updated from `getByRole('button', ...)` /
  `aria-pressed` to `getByRole('tab', ...)` / `aria-selected` to match.
- The real `Select` wraps its `<select>` in `<span className="zp-sel-wrap">`
  with a `.zp-sel-arrow` indicator span rather than rendering a bare
  `<select>` — a DOM structure change, but the existing call site (passing
  `<option>` children) still renders correctly since the real component
  falls back to `children` when no `options` array is passed.
- One vendored-as-is line in `SegmentedControl.tsx` (`data-init={settled.current
  ? undefined : '1'}`, reading a ref during render to skip the initial-mount
  transition) trips this repo's `react-hooks/refs` lint rule; carries a
  scoped `eslint-disable-next-line` rather than being restructured, since
  the goal is vendoring the real source, not rewriting it.

Every other change was purely additive (new optional props with defaults
matching the old behavior — `Badge`'s `dot`, `Panel`'s `elevation`,
`PageShell`/`Panel`'s widened `maxWidth`/`padding` types, etc.) and needed no
call-site changes.

## Other fixes made in passing

- `packages/shared/src/classColors.ts` had `Priest: '#FFFFFF'` — every other
  copy of the canonical class colors (including the vendored `tokens/wow.css`)
  has Priest at `#E9E9ED`. Fixed to match; Blizzard's own value, not a design
  choice.
- The app's existing `assets/ZerpyLogo.svg` used the "blurple" alternate
  rail (`#8788EE`) rather than the default accent rail (`#9184d9`) the
  design system's own readme specifies for "all Zerpy.dev sites". Swapped to
  the vendored `zerpy-accent.svg`.
- Replaced `@phosphor-icons/react` (`X`, `CaretLeft`, `CaretRight`) with the
  system's own unicode glyphs (`✕`, `‹`, `›`) — Zerpy's readme is explicit
  that the system has no icon set and uses unicode glyphs in the UI font
  instead. Dependency removed from `packages/web/package.json`.
