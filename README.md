# Templates v2 — Full Design Refresh

Ten templates redesigned per the design handoff you sent. Each has its own distinct aesthetic instead of the previous unified style.

## Files

```
src/
  components/templates/
    ornaments.jsx                # NEW — reusable SVG components (wax seal, wheat sprig, botanical branches, twine, grommet, sparkle, heart)
    parts.jsx                    # OVERWRITE — BrandHeader/Footer kept for compatibility
    ClassicRecipeCard.jsx        # OVERWRITE — Kraft Deli, Modern-Warm
    CostBreakdown.jsx            # OVERWRITE — Startup Dashboard
    CareCard.jsx                 # OVERWRITE — Warm Handwritten
    ProductLabel.jsx             # OVERWRITE — Apothecary Jar
    MenuInsert.jsx               # OVERWRITE — Café Chalkboard
    WholesalePriceList.jsx       # OVERWRITE — Corporate B2B
    DeliveryTag.jsx              # OVERWRITE — Kraft Paper Stamp
    SocialMediaCard.jsx          # OVERWRITE — Editorial Magazine
    RecipeBinderPage.jsx         # OVERWRITE — Chef's Professional
    CertificateOfCraft.jsx       # OVERWRITE — Traditional Botanical
    index.js                     # OVERWRITE (unchanged registry, kept for completeness)
  pages/
    Templates.jsx                # OVERWRITE (null-safe useSettings + multi-recipe support)
  styles.css                     # OVERWRITE (full file — adds Google Fonts import + entire v2 stylesheet)
```

15 files total.

## The 10 aesthetics

| # | Template | Aesthetic | Font pairing |
|---|---|---|---|
| 1 | Classic Recipe Card | Kraft Deli, Modern-Warm | Playfair Display + Inter + Caveat (note) |
| 2 | Cost Breakdown Sheet | Startup Dashboard | Space Grotesk + Inter |
| 3 | Care & Storage Card | Warm Handwritten | Caveat + Playfair Display + Inter |
| 4 | Product Label | Apothecary Jar | Cormorant Garamond + Inter |
| 5 | Menu Insert | Café Chalkboard | Caveat + Playfair italic + Inter |
| 6 | Wholesale Price List | Corporate B2B | Inter + IBM Plex Mono |
| 7 | Delivery Tag | Kraft Paper Stamp | Playfair Display + Caveat + Inter |
| 8 | Social Media Card | Editorial Magazine | Instrument Serif italic + Inter |
| 9 | Recipe Binder Page | Chef's Professional | Inter + IBM Plex Mono |
| 10 | Certificate of Craft | Traditional Botanical | Marcellus + Playfair Display + EB Garamond |

## Notable design elements

**Ornaments** (all SVG, brand-color aware):
- **Wax Seal** — used on Classic Card (top-left), Product Label (top), Certificate (centre). Auto-derives initials from business name.
- **Wheat Sprig** — Classic Card footer center
- **Sparkle** — Classic Card top-right, Care Card top-right
- **Twine Arc** — Care Card top, Delivery Tag top
- **Heart Doodle** — Care Card divider + sign-off
- **Chalk Flourish** — Menu Insert dividers and footer
- **Tag Grommet** — Delivery Tag punch-hole with peeking twine
- **Botanical Branch** — Certificate four corners (mirrored appropriately)

**Font loading:** Google Fonts imported via CSS at the top of `styles.css`. Users get the fonts on first visit; cached thereafter. No `index.html` edit needed.

**Brand color flows everywhere via `--brand` CSS variable.** Every template respects it — Classic Card seal, Cost Breakdown price highlight, Menu chalk elements, Certificate frame, Recipe Binder full sidebar.

**Page sizes match handoff spec:**
- Classic Card: 148×210mm (A5)
- Cost Breakdown: 210×297mm (A4)
- Care Card: 105×148mm (A6)
- Product Label: 60×90mm (custom small)
- Menu Insert: 148×210mm (A5)
- Wholesale: 210×297mm (A4)
- Delivery Tag: 74×105mm (A7)
- Social: 148×148mm (1:1 square)
- Recipe Binder: 210×297mm (A4) — grid layout with sidebar
- Certificate: 297×210mm (A4 landscape)

## Deploy

Overwrite the 15 files, push, hard-refresh. First load will fetch the Google Fonts (~10s over slow connections); subsequent loads are instant.

Try each template — every recipe from your starter seed produces a nicely-composed sheet with your brand color and identity.

## Missing image_url gracefully

Every template handles `recipe.image_url = null` — none rely on a recipe photo being present. Only Recipe Binder Page has a photo slot, which renders a "Photo slot" placeholder if empty.

## Print behavior

Same as before — `window.print()`, `@media print` hides everything but the `.printable` element. Certificate of Craft correctly triggers landscape orientation via a named `@page`.

## Adjust the aesthetic

If you want to tweak a specific template's colors, ornaments, or fonts, each template is a self-contained file. Change the CSS classes in `styles.css` under the `/* N. Template Name */` header for that specific template — nothing else is affected.
