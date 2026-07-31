# Crisp — 7th Style Variant

Adds "Crisp" as the 7th style variant per the image handoff. Registered as the 2nd option in the picker (right after the app-brand Clean Modern default) since it will likely be a heavily-used option.

## Files

```
src/
  lib/template-styles.js       # OVERWRITE — adds crisp to registry (7 variants now)
  styles.css                   # OVERWRITE (full file) — comprehensive variant block appended
```

Two files.

## Design language (read from the images)

**Color palette:**
| Role | Hex | Where it appears |
|---|---|---|
| Navy ink | `#1F2440` | Product/recipe names, ingredient names, main text |
| Body | `#4A5068` | Method steps, descriptions in body |
| Muted gray | `#8590A5` | Taglines, description italics, secondary values |
| Warm brown | `#8B4A2B` | Brand name, section labels, key prices, suggested price, wholesale prices, "internal use" warning, care storage title, allergen title, social handles, DC logo box border, brown accent bar overlay |
| Success green | `#28C76F` | Margin % on cost sheet only |
| Cream | `#FBEDD3` | Care storage block background, product-label allergen notice background |
| Hairline gray | `#E9E7EB` | Thin dividers and rules |

**Typography:**
- **Body/titles**: Plus Jakarta Sans (weight 400 for body, 700 for section labels, 800 for names/products)
- **Numbers/prices/tables**: JetBrains Mono (weight 400/500/700) — every quantity, unit price, cost, batch total, suggested price, wholesale price, date, and address number
- **Section titles**: uppercase Plus Jakarta Sans 700, letter-spacing 0.15em, brown, 10.5px, with a 1px gray underline
- **Product names**: Plus Jakarta Sans 800, navy `#1F2440`, letter-spacing -0.02em, size varies per template (22px on labels → 44px on social/certificate)
- **Certificate name**: uppercase Plus Jakarta Sans 900, near-black `#1A1A18`, 44px

## Signature elements

**Brand header** — small 42×42 white square with a 1.5px warm-brown border containing the logo (or DC monogram when I add JSX later). Brand name in warm brown to the right, muted-gray tagline underneath. Below sits a 1px hairline gray rule with a **2.5px warm-brown accent** overlaid on the left 45% — the visual signature you can see on every image with a header.

**Meta chips** — subtle gray outline pills, uppercase brown small caps text, 3px radius.

**Cost stats** — three bordered rectangles side by side (1.5px gray border, 4px radius, transparent fill). Small brown label uppercase; large mono value. Margin cell uses success green; suggested-price cell uses warm brown.

**Suggested/Portion headline** (cost sheet top-right) — no border, just a 2.5px warm-brown vertical bar on the left with a small uppercase brown label above the large mono brown number.

**Care card storage** — cream `#FBEDD3` block with brown uppercase label + navy body text. Italic muted-gray "Thank you for supporting a small kitchen" outro below.

**Product-label allergen** — cream `#FBEDD3` block with a 3px warm-brown left accent bar and brown uppercase title.

**Menu category header** — brown uppercase label with letter-spacing 0.18em followed by a flex-fill 1px gray rule extending to the right edge (the `── ` pattern from Image 9).

**Wholesale table** — solid warm-brown header row with white uppercase text; wholesale-price column emphasized in warm-brown bold mono, retail column in muted gray mono.

**Certificate** — 1.5px warm-brown inner frame, large uppercase near-black product name, 2px circular warm-brown seal ("BAKED WITH CARE"), signature and date lines with hairline gray dividers.

**Social card** — white background, 58×6px warm-brown accent bar in the top-right corner (per Image 2), all the same typography rules as the paper templates.

**Delivery tag** — white background, bordered brown price rectangle, matching header pattern.

## Where CSS-only stops short

Some structural touches in the images would need small JSX additions to be pixel-perfect. I've styled around them so the templates look coherent, but the deviations from the images are:

| Template | What's ideal but needs JSX | Current CSS approach |
|---|---|---|
| **Recipe Card** (Image 5) | 2-column grid of ingredients (`500g Bread flour` / `5g Instant yeast` side by side) | Renders as the existing single-column list |
| **Care Card** (Image 7) | Filled/outlined brown circle bullets before STORAGE and ALLERGENS | Section titles use the standard gray underline |
| **Recipe Binder** (Image 3) | Subgrouped methods (`CUPCAKES` / `BUTTERCREAM` labels between numbered steps), ingredients with mono cost column | Renders as single ingredient list + single method list |
| **Wholesale** (Image 10) | Bulleted `ORDERING TERMS` list with brown label | Wraps existing markup |
| **Certificate** (Image 4) | Circle with `BAKED WITH CARE` inside as an actual circle | Styled to be close but depends on current cert seal markup |
| **Cost Sheet** (Image 6) | Left brown vertical bar next to "SUGGESTED / PORTION" headline | Applied via border-left; may need JSX position adjustment |

If any of these visibly-off spots matter enough to fix, I can rework the specific template's JSX in a follow-up delta — one template at a time so you can review each.

## Deploy

Overwrite the 2 files, push, hard-refresh. Style picker on any template now shows 7 options — **Crisp** appears second (right below Clean Modern). Pick it and cycle through the templates.

The Crisp variant reuses fonts already loaded (Plus Jakarta Sans + JetBrains Mono), so first load isn't heavier than before.
