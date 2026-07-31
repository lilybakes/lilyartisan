# Kraft Pilot — New Per-Variant Template Architecture

You were right — variant CSS overrides on shared JSX can only ever produce cosmetic changes. Real distinct designs need dedicated JSX per template per variant. This delta lays down the new architecture and delivers the **Rustic Kraft & Stamp** set as the pilot, matching the 10 image mockups faithfully.

## What's new architecturally

Old approach (dropped for Kraft):
```
templates/
  ClassicRecipeCard.jsx       # shared JSX, styled by variant-* CSS class
```

New approach:
```
templates/
  ClassicRecipeCard.jsx       # shared component (fallback)
  variants/
    kraft/
      _parts.jsx              # monogram, brand lockup, seal, footer, rules
      styles.css              # kraft palette + per-template layouts
      RecipeCard.jsx          # 01 — dedicated Kraft JSX
      CostBreakdown.jsx       # 02
      CareCard.jsx            # 03
      ProductLabel.jsx        # 04
      MenuInsert.jsx          # 05
      WholesalePriceList.jsx  # 06
      DeliveryTag.jsx         # 07
      SocialMediaCard.jsx     # 08
      BinderPage.jsx          # 09
      Certificate.jsx         # 10
      index.js                # KRAFT_TEMPLATES map
```

`templates/index.js` now exposes `getTemplateComponent(key, styleVariant)` which resolves to the dedicated variant component if one exists, or falls back to the shared component + variant CSS overrides otherwise. So variants that don't yet have dedicated components (Crisp, Letterpress, Editorial, Minimal, Flour & Ink) keep working exactly as before.

`Templates.jsx` uses the resolver and skips the `styleVariant` prop when it's using a dedicated component (Kraft components don't need it — they style themselves entirely).

## Files

```
src/
  components/templates/
    index.js                                  # OVERWRITE — adds variant resolver
    variants/kraft/
      _parts.jsx                              # NEW — shared kraft primitives
      styles.css                              # NEW — kraft palette + all 10 layouts
      index.js                                # NEW — barrel export + KRAFT_TEMPLATES map
      RecipeCard.jsx                          # NEW — 01
      CostBreakdown.jsx                       # NEW — 02
      CareCard.jsx                            # NEW — 03
      ProductLabel.jsx                        # NEW — 04
      MenuInsert.jsx                          # NEW — 05
      WholesalePriceList.jsx                  # NEW — 06
      DeliveryTag.jsx                         # NEW — 07
      SocialMediaCard.jsx                     # NEW — 08
      BinderPage.jsx                          # NEW — 09
      Certificate.jsx                         # NEW — 10
  pages/Templates.jsx                         # OVERWRITE — uses getTemplateComponent
```

14 files: 12 new (10 templates + parts + styles + index) + 2 updates.

## Kraft design language (baked into every template)

**Palette:**
- Kraft paper `#EEDBBE` (main ground), `#E8D3AF` (warmer, care/social), `#F5EAD3` (lighter, stat boxes)
- Warm brown `#8B4A2B` (primary — brand, section titles, prices)
- Dark brown `#5C2E15` (product titles)
- Body ink `#3A2718`, muted `#7A6851`
- Cream on brown `#F5EAD3` (label band text)
- Muted green `#4A7A3E` (margin cell only)

**Fonts:**
- Bitter (slab-serif, 700–800) for titles, brand name, prices
- Karla (humanist sans, 400–700) for body, method, ingredient names
- Both already loaded from earlier Google Fonts import

**Signature primitives:**
- **Circular dashed monogram** — 1.5px dashed brown ring around 2-letter initials (or the user's uploaded logo)
- **Double horizontal brown rule** — 2px + 1px = signature divider under most headers
- **Dashed circular seals** — `BAKED / SMALL / BATCH`, `TRADE / PRICES / 2026`, `BAKED / WITH / CARE`, rotated -8° for a stamped feel
- **Dotted table separators** — no vertical borders, subtle 1.5px dotted brown between rows
- **Dashed rectangle borders** — around care card content and delivery-tag care text
- **Solid dark brown band** — carries product name in cream on the Product Label
- **Rounded brown outline pill** — social card CTA "From RM 10.00"
- **Kraft-tinted stat boxes** — cost sheet's 3 KPI panels

## Per-template layouts (each has its own dedicated CSS section)

Each template is sized in real mm units for accurate print output:

| # | Template | Size | Signature layout |
|---|---|---|---|
| 01 | Recipe Card | A5 148×210 | Header lockup + double rule + 2-col ingredient grid (qty ¦ name) + numbered method + seal bottom-right |
| 02 | Cost Breakdown | A4 210×297 | Title left / suggested-price box right, dotted table, 3 stat boxes, italic warning |
| 03 | Care Card | A6 105×148 | Dashed rectangle border, everything centered, storage + allergens sections |
| 04 | Product Label | A7 74×105 | Compact header + city eyebrow, dark brown band w/ product name, brown-outlined allergen box |
| 05 | Menu Insert | A5 148×210 | Big centered header, categorized items with dotted leaders + prices right |
| 06 | Wholesale | A4 210×297 | Title left / trade-terms box right, table w/ bold brown wholesale column, ordering-terms list, seal bottom-right |
| 07 | Delivery Tag | A7 74×105 | Punch-hole circle, centered stack, dashed care-text box, thanks line, brown social handles |
| 08 | Social Card | 148×148 (1080²) | Centered vertical stack: brand → eyebrow → huge product name → italic desc → outline pill → handles bar |
| 09 | Binder Page | A4 210×297 | Header + "KITCHEN BINDER · No 04" right, big title + rotated photo box, 4-cell meta, ingredient table + method w/ sub-group labels, chef's notes lines |
| 10 | Certificate | A4 landscape 297×210 | Double brown border, italic "Certificate of Craft" title (unique!), huge uppercase product name, seal center-bottom, signature/date lines flanking |

## Binder photo uses the user's recipe image

Per your instruction: `KraftBinderPage` renders `recipe.image_url` (or `recipe.imageUrl`) when present, otherwise the "RECIPE PHOTO (placeholder when empty)" text. The image is slightly rotated (1.5°) for a taped-in feel matching the mockup.

## What kept working

- Every other style variant (Clean Modern, Crisp, Letterpress, Editorial, Minimal, Flour & Ink) is untouched — they still use the shared components with CSS overrides.
- The style picker on the Templates page still shows all 7 variants and works the same way.
- Template Access (exclusive templates/styles) still works — variant resolution happens after access filtering.

## Deploy

Overwrite the 2 files, add the 12 new files under `src/components/templates/variants/kraft/`, push, hard-refresh. Pick a template, then pick "Rustic Kraft & Stamp" from the Style dropdown. Every one of the 10 templates should render as its dedicated Kraft component with pixel-appropriate layout, not the old CSS-overlaid version.

## Extending to another variant

When you're ready to promote another variant (say Crisp) to the same pattern:

1. Create `src/components/templates/variants/crisp/`
2. Add `_parts.jsx` for shared Crisp primitives
3. Add `styles.css` scoped under `.c-tpl` (or whatever prefix)
4. Write the 10 template JSX files
5. Export a `CRISP_TEMPLATES` map from `variants/crisp/index.js`
6. Add one line to the main `templates/index.js`:
   ```js
   import { CRISP_TEMPLATES } from './variants/crisp/index.js'
   const VARIANT_MAP = { kraft: KRAFT_TEMPLATES, crisp: CRISP_TEMPLATES }
   ```

The Templates page picks it up automatically.

## What I'd tighten in a follow-up pass

If you want the Kraft renderings to match the mockups pixel-perfect, these are worth another pass once you've seen them live:

- Some horizontal spacing/margin values are approximate — I sized off the mockup screenshots, not from a source of truth. Small nudges may be wanted.
- The certificate's italic "Certificate of Craft" title uses Bitter italic (which does exist in the Google font import). If it renders as roman-italic-faked in some browsers, we can add a `Playfair Display Italic` fallback.
- The seal rotations (-8° default) can be dialed down/up to taste.

Send screenshots of any specific template you want tightened and I'll rework that single file.
