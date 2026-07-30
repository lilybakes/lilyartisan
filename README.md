# Brand Coverage Audit + Fix

## What the audit found

Every field the user fills in Settings should surface on at least one relevant template. Two fields didn't:

1. **`facebook` was dead code.** BrandFooter only rendered instagram. Users filling the Facebook field saw nothing appear anywhere.
2. **`tagline` was dropped in compact headers.** CostBreakdown, CareCard, Recipe Binder, Product Label — none rendered the tagline.

Plus some smaller gaps: Delivery Tag ignored `default_storage_notes` fallback, Certificate of Craft had no contact info at all, Social Media Card ignored Facebook.

## Final coverage matrix (after this delta)

|  | Logo | Business Name | Brand Color | Tagline | Phone | Email | Website | Address | Instagram | Facebook | Storage default | Allergen default |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Classic Recipe Card** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| **Cost Breakdown Sheet** | ✓ | ✓ | ✓ | ✓ (small) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| **Care & Storage Card** | ✓ | ✓ | ✓ | ✓ (small) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **✓ fallback** | **✓ fallback** |
| **Product Label** | ✓ | ✓ | ✓ | ✓ (small) | ✓ | — | ✓ | — | ✓ | — | — | **✓ fallback** |
| **Menu Insert** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| **Wholesale Price List** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| **Delivery Tag** | ✓ | ✓ | ✓ | ✓ (small) | ✓ | — | ✓ | — | ✓ | ✓ | **✓ fallback** | — |
| **Social Media Card** | ✓ | ✓ | ✓ (gradient) | ✓ | — | — | ✓ | — | ✓ | ✓ | — | — |
| **Recipe Binder Page** | ✓ | ✓ | ✓ | ✓ (small) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| **Certificate of Craft** | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — | — |

Legend:
- **✓** — rendered
- **✓ (small)** — rendered in a compact/subtle style appropriate to the template size
- **✓ fallback** — recipe field takes precedence; falls back to the brand default when the recipe is blank
- **—** — intentionally omitted (usually because the template is too small, or the field isn't semantically relevant)

Every user-set field now appears on **at least one** template. Most appear on 6+ templates.

## Files

```
src/
  components/templates/
    parts.jsx                    # OVERWRITE — compact header shows tagline; footer adds facebook
    DeliveryTag.jsx              # OVERWRITE — tagline, brand storage fallback, +facebook +website +phone
    SocialMediaCard.jsx          # OVERWRITE — tagline, facebook handle
    CertificateOfCraft.jsx       # OVERWRITE — address + full contact line at bottom
    ProductLabel.jsx             # OVERWRITE — tagline, restructured header
  styles.css                     # OVERWRITE (full file — adds compact tagline + supporting classes)
```

6 files. No SQL, no App.jsx, no sidebar changes.

## Design notes

**"Small" tagline treatment.** On compact-header templates (CostBreakdown, CareCard, RecipeBinder, ProductLabel, DeliveryTag) the tagline renders in muted grey below the business name at a smaller size — visible but doesn't fight the recipe name for attention.

**Facebook rendering.** Followed the same convention as Instagram: prefix with `fb/` to keep the label short and unambiguous. So `fb/TheDailyCrumb` alongside `@thedailycrumb`. Users just enter the page slug; the template adds the prefix.

**Storage fallback on Delivery Tag.** Delivery tags almost always benefit from care info, so if the recipe doesn't have `storage_notes` set, we now fall back to `brand.default_storage_notes` — matching how CareCard already worked.

**Certificate address block.** Small dashed separator, then address (multi-line) and a violet contact row underneath — feels like the "official location" line on a real certificate without cluttering the decorative body.

## Deploy

Overwrite the 6 files, push, hard-refresh. Fill in Settings → Contact tab with a Facebook page slug and a tagline you didn't have before → visit Templates → cycle through them. Every field you filled will show up somewhere.
