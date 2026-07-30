# Brand Identity + Recipe Templates

Big delta. Adds proper per-user branding and a Templates page with 4 fully-working printable sheets + 6 stubbed for future.

## Files

```
supabase/
  brand-identity.sql                            # NEW — 10 columns added to settings

src/
  components/
    Sidebar.jsx                                 # OVERWRITE — adds Templates nav item under Recipes & Data
    NavGlyph.jsx                                # OVERWRITE — adds the templates icon
    templates/
      index.js                                  # NEW — registry of all 10 templates
      parts.jsx                                 # NEW — shared BrandHeader / BrandFooter
      ClassicRecipeCard.jsx                     # NEW — full recipe, A5
      CostBreakdown.jsx                         # NEW — internal cost sheet, A4
      CareCard.jsx                              # NEW — customer care card, A6
      ProductLabel.jsx                          # NEW — packaging label, A7
  pages/
    Settings.jsx                                # OVERWRITE — expanded Brand & Identity with 3 sub-tabs
    Templates.jsx                               # NEW — picker + preview + print
  styles.css                                    # OVERWRITE (full file)
```

## Deploy

### 1. Run the SQL

Supabase SQL Editor → paste `supabase/brand-identity.sql` → Run.

Adds 10 nullable columns to `settings`:
- `tagline`, `brand_color` (default `#6C5CE7`)
- `contact_phone`, `contact_email`, `website`, `address`
- `instagram`, `facebook`
- `default_storage_notes`, `default_allergen_notice`

(`logo_data_url` already exists — it becomes the per-user logo now.)

### 2. Push the code

All the files above. **One manual edit still needed in `App.jsx`** — add the templates route:

```jsx
import Templates from './pages/Templates.jsx'

// inside the /app/* routes, next to Personalize / Settings:
<Route path="templates" element={<Templates/>}/>
```

That's it — the sidebar already links to `/app/templates`.

### 3. Try it

1. Log in as Lily
2. `/app/settings` → **Identity** sub-tab → upload logo, pick a brand color, fill business name + tagline
3. **Contact & Address** sub-tab → phone, website, socials, address
4. **Recipe defaults** sub-tab → default storage instructions, allergen notice
5. Save
6. `/app/templates` → pick a recipe → pick a template → **🖨️ Print / Save as PDF**

The 4 ready templates render with her logo, brand color as the accent, and all her contact info.

## The 4 ready templates

| Template | Size | Use case |
|---|---|---|
| **Classic Recipe Card** | A5 portrait | Kitchen reference — full ingredients + method + brand |
| **Cost Breakdown Sheet** | A4 portrait | Internal cost analysis — ingredient costs, cost per portion, margin at suggested price |
| **Care & Storage Card** | A6 portrait | Customer-facing thank-you card with storage + allergen info |
| **Product Label** | A7 portrait | Compact packaging label — allergens, ingredients list, contact |

All 4 use the same brand accent color (from user's `brand_color`), logo, business name, tagline, and contact info.

## The 6 coming next

Stubbed in the picker with a "Coming next" badge. Wiring in future deltas:
- Menu Insert · Wholesale Price List · Delivery Tag · Social Media Card · Recipe Binder Page · Certificate of Craft

Each one just needs a new `.jsx` file exporting `{recipe, brand}` → `<div className="tpl printable">…</div>` plus registration in `templates/index.js` (change `ready: false, component: null` → `ready: true, component: YourNewTemplate`).

## Print behavior

Uses `window.print()` + `@media print` CSS. Browser's print dialog opens; user picks "Save as PDF" for a downloadable file, or a real printer for hard copies. Every element outside `.printable` is hidden during print — sidebar, topbar, picker controls all vanish so only the template sheet is on the printed page.

Page size hints per template (A4/A5/A6/A7) are shown as badges in the picker — but the actual paper size is controlled by the user's print dialog. If they pick A4 and the template is A5-sized, they'll get an A5 sheet centered on an A4 page (which lets them fit multiple care cards per sheet).

## Brand incompleteness nudge

If the user hasn't set both a logo AND a business name, the Templates page shows a soft nudge card at the top: "Set up your brand first" linking to Settings. Not blocking — templates still render with fallback text, but the nudge encourages them to personalize.

## What this unlocks for the SaaS story

Bakers can now:
- Print recipes for their kitchen with their own brand
- Include care cards in every order (customer sees your logo, not BakeOnomics's)
- Make product labels for retail/packaging
- Print internal cost analyses for pricing decisions

Every printed sheet is a piece of marketing that says "The Daily Crumb", not "BakeOnomics". You stay invisible while giving them tools to look professional.
