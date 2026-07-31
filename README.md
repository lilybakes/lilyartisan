# Distinct Color Palettes per Variant + Font-Size Variety

One file: `src/styles.css`.

Every variant now owns its own accent palette instead of all sharing warm brown. Plus recipe-name font sizes now vary across variants for real hierarchy differentiation.

## The 5 palettes

| # | Variant | Primary accent | Rationale |
|---|---|---|---|
| 1 | **Clean Modern** | `#6C5CE7` app violet | On-brand with the app itself — this is the "default" variant, so it reads as the BakeOnomics-native aesthetic |
| 2 | **Rustic Kraft** | `#8B4A2B` warm brown | Native to kraft paper, feels hand-stamped and organic |
| 3 | **Vintage Letterpress** | `#7A2E3B` deep burgundy | Patisserie / heritage / premium gifting — classical formality |
| 4 | **Editorial Magazine** | `#1A1A18` near-black with `#C41E3A` cherry-red pop | Magazine masthead + one small pop color for social handles, per editorial convention |
| 5 | **Quiet Minimal** | `#5B6874` slate blue-grey | Quiet, sophisticated, restrained — Aesop/Byredo territory |

**Kraft is the only variant that keeps warm brown** — it's baked into the aesthetic.

## Recipe name font sizes now vary

| Variant | Recipe name size | Line height | Weight |
|---|---|---|---|
| Clean Modern | 26px (default) | 1.1 | 800 |
| Rustic Kraft | **29px** | 1.15 | 800 (Bitter serif) |
| Vintage Letterpress | **32px** | 1.1 | 700 (Playfair Display) |
| Editorial Magazine | **36px** | 1.0 | 400 (DM Serif Display, biggest) |
| Quiet Minimal | **22px** | 1.2 | **400 light** (smallest, most restrained) |

## What actually changed

**Block-aware color remap**: a Python pass walked the CSS, detected which variant block each line belonged to (by tracking `.tpl.variant-{key}` selector prefixes), and swapped `#8B4A2B` → variant-specific accent within each block only.

- Clean Modern: 8 replacements
- Kraft: 0 (intentional)
- Letterpress: 12
- Editorial: 2 (mostly used `#1A1A18` explicitly already; also swapped social `#C9A88A` → `#C41E3A`)
- Minimal: 3

RGBA brown-tinted values (like `rgba(139,74,43,0.4)` on kraft dashed borders) were also remapped per variant — so Letterpress dashed dividers use burgundy tints, Minimal uses slate tints, etc.

**Font-size overrides**: added at the end of the file, targeting `[class*="-recipe-name"]` and its siblings (`-care-product`, `-wholesale-title`, `-cert-product`, `-social-name`) so every template's main title scales per variant.

## What stayed uniform (within each style)

All 10 templates rendered in a given style share the same palette + font scale. So Classic Card in Letterpress, and Care Card in Letterpress, and Certificate in Letterpress — all use burgundy, all use the Playfair/Cormorant pairing, all have the 32px recipe name.

The variation is **between** styles, not within a style. Which is what you asked for.

## Deploy

Overwrite the file, push, hard-refresh. Cycle any template through all 5 variants and each should feel like a distinct piece of design — different accent color, different type scale, different rule treatment, different paper.
