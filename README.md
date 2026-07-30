# Sidebar Chip Fix

Bug in the previous `sidebar-nav` delta — one-file, one-line fix.

## What went wrong

In `Sidebar.jsx` I wrapped the glyph in `<span className="nav-chip">` but the CSS I shipped in the same delta was written against `.chip`. Classname mismatch → chip styling never applied:

- Background stayed unset (no lavender `#EEECFE`)
- `color: var(--nav-stroke)` never applied, so `currentColor` on the SVG strokes fell back to the row's `#6D6B77` text color
- `.chip .glyph-fill` selector never matched, so the duotone fills stayed at the SVG's default `fill="none"`

Result: plain black-and-white outline icons on a transparent chip.

## The fix

Change `className="nav-chip"` → `className="chip"` in `Sidebar.jsx`. One line. That's it.

## Deploy

Overwrite `src/components/Sidebar.jsx`, push, hard-refresh. The full duotone icon set from the spec (indigo strokes, `#C9C3FA` fills, white knock-outs) will now render.
