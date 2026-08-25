# Favicon — variant 12 (cell grid, three events)

Three-week grid (5 columns x 3 rows of day cells) with three raid nights lit in the accent. No calendar frame or header.

## Files

| File | Use |
| --- | --- |
| `favicon.svg` | primary icon — scalable, what modern browsers use |
| `favicon-16.png`, `favicon-32.png`, `favicon-48.png` | raster fallbacks for older browsers |
| `apple-touch-icon.png` | 180x180, iOS home screen (full-bleed, no transparency) |
| `icon-192.png`, `icon-512.png` | PWA / Android install icons |
| `icon-maskable-512.png` | Android adaptive icon — art inset to the 80% safe zone |
| `icon-maskable.svg` | vector source for the maskable variant |
| `icon-mono.svg` | monochrome, for Safari pinned tabs (`mask-icon`) |
| `site.webmanifest` | manifest referencing the PWA icons |

## Install

Copy the files to your web root, then in `<head>`:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="mask-icon" href="/icon-mono.svg" color="#9184d9">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#161826">
```

Adjust `src` paths in `site.webmanifest` if the icons do not sit at the root.

If your build pipeline wants a legacy `favicon.ico`, generate it from `favicon.svg` (`npx sharp-cli` / ImageMagick `convert`) bundling the 16/32/48 sizes. It is optional — every browser released in the last several years reads the SVG.

## Design values

- Ground `#161826` (`--color-bg`), 7/32 corner radius on the tile.
- Lit cells `#9184d9` (`--color-accent`), unlit cells `#3f4159`.
- Cell grid: 3.4 units square, radius 1.1, column pitch 4.8, row pitch 6.2, origin (4.5, 7.5) in a 32-unit viewBox.
- Lit positions (column, row), zero-indexed: (1,0), (3,1), (2,2).

To restyle, edit `favicon.svg` and re-export the rasters — nothing else derives from the PNGs.
