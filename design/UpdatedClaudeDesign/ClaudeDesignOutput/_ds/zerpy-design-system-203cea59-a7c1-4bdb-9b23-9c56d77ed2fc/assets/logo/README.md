# Zerpy — F02, rail full bleed

Square 100x100 viewBox. The rail bleeds top and bottom — keep zero vertical padding around
the mark; horizontal padding is free. All geometry is rects and polygons, no font dependency.

- F02-accent.svg — accent rail (#9184d9), text-white Z. Primary, dark backgrounds.
- F02-accent-on-dark.svg — same with the ground baked in as a rounded tile. Favicon / app icon.
- F02-mono-light.svg / F02-mono-dark.svg — single-color, for backgrounds where accent is unavailable.
- class/ — the same mark with each of the thirteen class rails plus both faction rails,
  Z always #f2f1fb. Rail color is identity only; it never carries state.

- black/ — the same set with #0b0c14 letters, for light backgrounds. Note that the
  brightest rails (rogue, priest, monk) lose contrast against white; the accent and the
  darker class rails hold.

- accent/ — the four accent rails (#9184d9, #a99cf0, #8788EE, #3FC7EB), each in white
  (#f2f1fb) and black (#0b0c14) letters.
