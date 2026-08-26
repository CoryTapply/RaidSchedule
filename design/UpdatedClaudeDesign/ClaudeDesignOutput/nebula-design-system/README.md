# Nebula design system

Dark glass system. Quieted space theme: dim radial ground, faint starfield, one saturated
accent, everything else desaturated.

- Type: Instrument Sans (UI + copy), Roboto Mono (numbers, table figures, micro-labels)
- Baseline radius 4px; 4px space scale, roomier step
- Depth: border + blur + one soft ambient shadow, three levels only
- Transparency allowed anywhere it reads well; never nest blur inside blur

## Files
- `nebula-tokens.css` — the token sheet. Link this from every page.
- `Nebula Foundations.dc.html` — color, type, space, shape, depth, do/don't rules,
  and the optional WoW add-on layer (class colors, faction).
- `Nebula Components Controls.dc.html` — buttons, inputs, choices, badges, emphasis CTAs.
- `Nebula Components Surfaces.dc.html` — cards, dialog, popover, tooltip, toasts,
  progress, empty states.
- `support.js` — runtime for the .dc.html files.

Fonts load from Google Fonts: Instrument Sans 400/500/600, Roboto Mono 400/500.
