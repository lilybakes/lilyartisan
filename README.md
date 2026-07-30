# All 10 Templates

Ships the remaining 6 templates so every slot in the picker is now live:
Menu Insert, Wholesale Price List, Delivery Tag, Social Media Card, Recipe Binder Page, Certificate of Craft.

## Files

```
src/
  components/
    templates/
      MenuInsert.jsx           # NEW — multi-recipe grouped by category
      WholesalePriceList.jsx   # NEW — multi-recipe B2B table with retail/wholesale/batch
      DeliveryTag.jsx          # NEW — A7 hang-tag for delivery orders
      SocialMediaCard.jsx      # NEW — 148mm square Instagram card
      RecipeBinderPage.jsx     # NEW — A4 detailed kitchen page with photo slot + costs + method + notes
      CertificateOfCraft.jsx   # NEW — A4 landscape decorative cert
      index.js                 # OVERWRITE — all 10 templates registered
  pages/
    Templates.jsx              # OVERWRITE — enriches ALL recipes, passes both `recipe` + `recipes` to templates, hides recipe picker for multi templates
  styles.css                   # OVERWRITE (full file)
```

Nothing else changes — no SQL, no sidebar edits, no App.jsx edits.

## The 10 templates now

| # | Template | Uses | Page size |
|---|---|---|---|
| 1 | Classic Recipe Card | one recipe | A5 |
| 2 | Cost Breakdown Sheet | one recipe | A4 |
| 3 | Care & Storage Card | one recipe | A6 |
| 4 | Product Label | one recipe | A7 |
| 5 | **Menu Insert** | all recipes, grouped by category | A5 |
| 6 | **Wholesale Price List** | all recipes, with retail / wholesale (30% off) / batch-of-10 | A4 |
| 7 | **Delivery Tag** | one recipe | A7 |
| 8 | **Social Media Card** | one recipe | 148×148mm square |
| 9 | **Recipe Binder Page** | one recipe | A4 |
| 10 | **Certificate of Craft** | one recipe | A4 landscape |

## Notable design decisions

**Multi-recipe templates.** Menu Insert and Wholesale Price List both need the full recipe list, not just one. `Templates.jsx` now enriches ALL recipes upfront (each with lines, costs, suggested prices), passes both `recipe` and `recipes` to every template, and hides the recipe dropdown when a `multi: true` template is selected — replacing it with a "ALL" badge.

**Wholesale pricing math.** Auto-derives wholesale as retail × 0.70 (30% off) and shows a batch-of-10 column so B2B customers see the full order value at a glance. Configurable via the discount constant in `WholesalePriceList.jsx` if you want a different B2B rate.

**Social Media Card.** Full-bleed gradient background derived from the brand color (`color-mix()` darkens it). Big centered product name. Perfect for screenshot → post to Instagram / Facebook / WhatsApp. Prints as a 148mm square on A4 if anyone wants a physical version.

**Certificate of Craft.** Landscape A4 with a double-bordered frame, decorative corners, an italic serif title, a signature line for the head baker, a date on the right, and a violet "Baked with ♡ Care" seal in the middle. Pulls tagline if set. Instant premium-order or gift packaging.

**Recipe Binder Page.** The most detailed template — photo slot at top-right (uses `recipe.image_url` if set, otherwise a placeholder), full ingredient table with quantities AND per-line costs, method, and 6 empty ruled lines for chef's notes. This is the "kitchen truth" version.

**Delivery Tag.** A7 vertical with a small punch hole at the top for string. Handmade-for-you kicker, product name, storage box (uses recipe or brand default), thank-you italic, contact at the bottom.

## Deploy

Overwrite the 8 files, push, hard-refresh, navigate to Templates. Every slot in the picker is now clickable. Multi-recipe templates show the ALL badge; the recipe dropdown disappears when they're selected.

Print button works for all 10 — the certificate handles its own landscape page config via `@page landscape`.

## Extending / tweaking

- Wholesale discount rate: `WholesalePriceList.jsx` line 12 — `const wholesaleDiscount = 0.7`
- Certificate seal text: `CertificateOfCraft.jsx` — the "Baked with Care" seal
- Social card gradient: `styles.css` — `.tpl-social-bg` uses `color-mix` to darken the brand color; adjust the 60% for a lighter or darker gradient endpoint

Each template is a pure `{recipe, recipes, brand}` → JSX component, so adding an 11th is copy-a-file + one line in `templates/index.js`.
