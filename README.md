# Fix: All 10 Templates Active + Default as a Style Variant

Two-file fix for two things:

1. **The 6 hidden templates are ready again.** The style-variants delta accidentally overwrote the all-ready registry with the old "4 ready + 6 soon" version. Restored — all 10 templates are `ready: true` with their own gradient colors.

2. **Default is now a proper style variant.** The picker previously had 5 options (Clean Modern was the "default"). Now it has 6, and Default (App Brand) — the current clean-purple app style — is the first option, separate from Clean Modern (which is the warm-brown Plus Jakarta Sans + JetBrains Mono treatment from the handoff).

## Files

```
src/
  components/templates/index.js       # OVERWRITE — all 10 ready with gradients
  lib/template-styles.js              # OVERWRITE — 6 variants, Default first
```

## The 6 variants

| Order | Key | Name | Look |
|---|---|---|---|
| 1 | `default` | Default (App Brand) | Current clean-purple, uses your brand color |
| 2 | `clean-modern` | Clean Modern | Warm brown, Plus Jakarta Sans + JetBrains Mono, hairlines |
| 3 | `kraft` | Rustic Kraft & Stamp | Kraft paper, Bitter serif, dashed dividers, rubber stamps |
| 4 | `letterpress` | Vintage Letterpress | Playfair + Cormorant, everything centered, fleurons |
| 5 | `editorial` | Editorial Magazine | DM Serif Display + Archivo, thick black rules |
| 6 | `minimal` | Quiet Minimal | Manrope 300 + IBM Plex Mono, 0.5px hairlines |

## Why no CSS changes needed

The `variant-default` class doesn't have any CSS rules targeting it — it intentionally falls through to the base `.tpl` styles, which are the current clean-purple app aesthetic. The 5 iteration variants (`.tpl.variant-kraft` etc.) have their own CSS overrides that were shipped in the `style-variants` delta.

## Deploy

Overwrite the 2 files, push, hard-refresh. All 10 templates in the picker are active. The Style dropdown next to the preview shows 6 options starting with "Default (App Brand)".
