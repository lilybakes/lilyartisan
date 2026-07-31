# Style Variants — 5 aesthetics per template

Delivers the picker-per-template style system from the handoff. Every one of the 10 templates can be rendered in any of 5 distinct aesthetics: Clean Modern (default), Rustic Kraft, Vintage Letterpress, Editorial Magazine, Quiet Minimal.

## Files

```
src/
  lib/
    template-styles.js               # NEW — 5-variant registry with descriptions
  pages/
    Templates.jsx                    # OVERWRITE — style dropdown per template + per-template style memory
  components/templates/
    ClassicRecipeCard.jsx            # OVERWRITE — accepts styleVariant prop
    CostBreakdown.jsx                # OVERWRITE — same
    CareCard.jsx                     # OVERWRITE — same
    ProductLabel.jsx                 # OVERWRITE — same
    MenuInsert.jsx                   # OVERWRITE — same
    WholesalePriceList.jsx           # OVERWRITE — same
    DeliveryTag.jsx                  # OVERWRITE — same
    SocialMediaCard.jsx              # OVERWRITE — same
    RecipeBinderPage.jsx             # OVERWRITE — same
    CertificateOfCraft.jsx           # OVERWRITE — same
    index.js                         # OVERWRITE (unchanged, kept for completeness)
    parts.jsx                        # OVERWRITE (unchanged, kept for completeness)
  styles.css                         # OVERWRITE (full file) — adds Google Fonts + 5 variant CSS blocks + picker UI styles
```

14 files.

## How the system works

1. **Registry** (`template-styles.js`) — 5 variants with `key`, `name`, `description`. Add a 6th by editing this file.

2. **State** (`Templates.jsx`) — `templateStyles` object keeps the chosen variant per template (`{ classic: 'kraft', cost: 'editorial', ... }`). Each template remembers its own choice. Default is `clean-modern`.

3. **UI** — When a template is selected, a **style picker row** appears above the preview: dropdown showing all 5 variants + a description of the current one. Changing it re-renders the preview instantly.

4. **Templates** — Every template accepts `styleVariant` prop and adds `variant-{key}` to its root className. No structural changes to the JSX.

5. **CSS** — 5 variant class modifiers override fonts, colors, borders, rule weights. Higher specificity than the base styles so `.tpl.variant-kraft` beats `.tpl-classic`.

## The 5 variants

Per the handoff document — all use warm brown `#8B4A2B` as accent (except default, which respects the user's brand color).

| Key | Name | Signature |
|---|---|---|
| `clean-modern` | Clean Modern (default) | Plus Jakarta Sans + JetBrains Mono, hairline rules, humanist neutral |
| `kraft` | Rustic Kraft & Stamp | Bitter + Karla on kraft paper, dashed dividers, rubber-stamp seal on cards |
| `letterpress` | Vintage Letterpress | Playfair + Cormorant, everything centered, fleuron `❧` between sections |
| `editorial` | Editorial Magazine | DM Serif Display + Archivo, thick black rules, filled dark footer |
| `minimal` | Quiet Minimal | Manrope 300 + IBM Plex Mono, 0.5px hairlines, single accent dot marker |

## What the delta delivers vs what needs follow-up

**Delivered end-to-end:**
- Style picker UI + state per template ✓
- All 10 templates accept and apply the variant ✓
- All 5 variants have distinct fonts + colors + rule styles ✓
- All 5 variants visibly different when you switch between them ✓
- Google Fonts loaded (all 10 font families in one import) ✓
- Print behavior preserved (variant styles print correctly) ✓

**Realistic caveat — pixel-perfect matches to the handoff need follow-up:**
Each aesthetic in the handoff has signature ornaments that don't come out of a generic CSS override:
- Kraft's per-template rubber stamps (BAKED SMALL BATCH, TRADE PRICES, BAKED WITH CARE)
- Letterpress's fleuron section breaks and wax-seal disc
- Editorial's cost-bar chart on Cost Breakdown and 46mm accent sidebar on Recipe Binder
- Minimal's `01 02 03` mono step numbers

I've implemented the shared aesthetic (fonts, colors, rules, general treatment) plus a few signature ornaments (kraft rubber stamp on Classic + Care, letterpress fleuron under headers, editorial black-inverted footer, minimal accent dot). The rest need template-specific JSX changes — one delta per (template × variant) as you iterate.

## Deploy

Overwrite the 14 files, push, hard-refresh. First load fetches ~10 Google Font families (~1MB); cached after that. Every template in the picker now has a Style dropdown next to its preview.

## Extending

**Add a signature ornament to a specific variant × template:**

1. Open the template's JSX file
2. Add the ornament element gated on `styleVariant === 'kraft'` (or whichever variant):
   ```jsx
   {styleVariant === 'kraft' && <div className="tpl-kraft-stamp">TRADE PRICES</div>}
   ```
3. Style it in `styles.css` under the variant block

**Add a 6th style variant:**

1. Add an entry to `STYLE_VARIANTS` in `template-styles.js`
2. Add a `.tpl.variant-{yourkey}` CSS block in `styles.css`
3. Import any new Google Font in the same `@import` at the top

## Bug-safe

The style picker row is `no-print` — it disappears in the print dialog. `variant-*` classes are on the printable element, so they persist through print. Certificate landscape print still works.
