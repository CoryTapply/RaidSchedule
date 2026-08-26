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
      rgba()/hex colors through Nocturne tokens — see design/README.md).
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
literal rgba()/hex per design/README.md) — the table below is for the few
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

The exported design-system folder (`design/UpdatedClaudeDesign/ClaudeDesignOutput/_ds/zerpy-design-system-.../`)
does **not** contain the individual component `.tsx` files the manifest and
readme describe (`components/buttons/Button.tsx`, `components/forms/Field.tsx`,
etc.) — only `components/controls.css` (the real pseudo-state layer) and a
compiled `_ds_bundle.js` meant for the design tool's own runtime (an
`x-import component-from-global-scope="ZerpyDesignSystem_203cea.Button"`
loader), not an importable ES module for this Vite app.

So `packages/web/src/design-system/zerpy/` vendors what's actually real and
copyable — `tokens/*.css`, `components/controls.css`, `styles.css`, the
accent logo SVG — verbatim, and `components/*.tsx` are hand-built from three
real sources: `controls.css`'s class contracts, `readme.md`'s stated
behavior/token usage, and the exact markup in
`design/UpdatedClaudeDesign/ClaudeDesignOutput/Raid Calendar Zerpy.dc.html`
(the actual finished prototype, not just the CSS). Two gaps controls.css
doesn't cover were filled the same way: `SegmentedControl`'s container/
selected-state and `Badge`'s tones have no controls.css rule, so both are
built directly from the token set (accent-tint for selection, the four
semantic tint+line pairs for badge tones) rather than guessed at.

## Other fixes made in passing

- `packages/shared/src/classColors.ts` had `Priest: '#FFFFFF'` — every other
  copy of the canonical class colors (this repo's own `design/README.md`,
  and the vendored `tokens/wow.css`) has Priest at `#E9E9ED`. Fixed to match;
  Blizzard's own value, not a design choice.
- The app's existing `assets/ZerpyLogo.svg` used the "blurple" alternate
  rail (`#8788EE`) rather than the default accent rail (`#9184d9`) the
  design system's own readme specifies for "all Zerpy.dev sites". Swapped to
  the vendored `zerpy-accent.svg`.
- Replaced `@phosphor-icons/react` (`X`, `CaretLeft`, `CaretRight`) with the
  system's own unicode glyphs (`✕`, `‹`, `›`) — Zerpy's readme is explicit
  that the system has no icon set and uses unicode glyphs in the UI font
  instead. Dependency removed from `packages/web/package.json`.
