# Social Card Contrast + White Background Fixes

Two issues addressed in one CSS append. No JSX changes — every fix lives in `src/styles.css` as a targeted variant override.

## The two problems

### 1. Eyebrow invisible on gradient backgrounds

`"FRESH FROM OUR KITCHEN"` was rendering as low-contrast text because my earlier variant CSS forced eyebrow color to the variant's accent color (`#7A2E3B` burgundy on the letterpress gradient, `#8B4A2B` brown on kraft's brown gradient, etc.) — same color family as the gradient behind it.

### 2. Editorial + Minimal should be white paper, not brand gradient

The gradient background suits Clean Modern / Kraft / Letterpress (all bold, colored aesthetics). Editorial and Minimal are designed around white space and restraint — a brand-color gradient fights their identity.

## The fix

Per-variant selectors that beat the earlier `[class*="-eyebrow"]` and `[class*="-desc"]` rules by matching specificity + coming later in the cascade.

**Variants 1-3 (Clean Modern / Kraft / Letterpress)**: keep the brand-color gradient background but force every text element to white/off-white so the whole card reads on the gradient.

- Eyebrow: `rgba(255,255,255,0.95)`
- Brand, recipe name, footer, handles, web: `rgba(255,255,255,0.95)`
- Tagline: `rgba(255,255,255,0.75)`
- Description: `rgba(255,255,255,0.85)`

**Variant 4 (Editorial Magazine)**: white paper `#FCFBF9` background with black type + cherry-red pops.

- Background: `#FCFBF9`
- Brand, recipe name, footer, handles: `#1A1A18`
- Description: `#3A382F` (dark) with italic style
- Eyebrow: `#C41E3A` (cherry-red pop) — magazine-editorial signature
- Website: `#C41E3A` (cherry-red pop)
- Price pill: solid `#1A1A18` black with white text
- Logo: `#FCFBF9` background with `#1A1A18` black frame

**Variant 5 (Quiet Minimal)**: white paper `#FDFDFC` background with slate accents.

- Background: `#FDFDFC`
- Brand, recipe name, footer, handles: `#2B2B29`
- Description: `#44443F`
- Eyebrow: `#77776F` (soft muted slate)
- Website: `#5B6874` (slate accent)
- Price pill: transparent with 0.5px `#2B2B29` hairline outline
- Logo: transparent, 90% opacity

## Design consistency preserved

- Editorial still uses black masthead rules and cherry-red pop elsewhere (matches other Editorial templates)
- Minimal still uses slate accents and hairlines elsewhere (matches other Minimal templates)
- The three gradient variants (Clean / Kraft / Letterpress) still show the brand-color-derived gradient — just with correctly white text on top

## Deploy

Overwrite `src/styles.css`, push, hard-refresh. Cycle the Social Media Card through all 5 variants:

1. Clean Modern → violet gradient, white text
2. Kraft → warm brown gradient, white text
3. Letterpress → burgundy gradient, white text (eyebrow now readable ✓)
4. Editorial → **white paper**, black type, cherry-red eyebrow + web accent
5. Minimal → **white paper**, slate accents, hairline outline price pill
