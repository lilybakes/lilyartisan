# Lily Artisan — Header Links + Inline Edit

Delta drop-in on top of the existing `lilyartisan` repo. Three additions:

1. **Explains the top icons** — the globe and grid slots become **configurable header links** set up in Settings.
2. **Adds inline edit** to Ingredients, Recipes, and Recipe BOM lines.
3. **Adds a Settings sub-navigation** (General / Header Links / Coming Soon) — foundation for a full nav module later.

## What's in this zip

```
src/
  lib/
    icons.jsx           (extended: ~30 icons + exports ICON_NAMES for picker)
    data.js             (added updateLine to useBomLines)
  components/
    IconPicker.jsx      (NEW — visual grid picker with popover)
    Topbar.jsx          (updated — reads header_links from DB)
  pages/
    Settings.jsx        (tabbed: General / Header Links / Coming Soon)
    Ingredients.jsx     (inline edit)
    Recipes.jsx         (inline edit)
    Bom.jsx             (inline edit)
  styles.css            (new styles: tabs, icon picker, edit buttons, header-link row)

supabase/
  schema-update-v3.sql  (new `header_links` table + 2 seed rows)
```

## Apply in this order

### 1. Supabase
SQL Editor → paste `supabase/schema-update-v3.sql` → **Run**. Safe to re-run.

Creates the `header_links` table with RLS + two seed rows (Language and Apps) so the header still shows two icons on first load.

### 2. GitHub
Overwrite these files at the same paths:
- `src/lib/icons.jsx`
- `src/lib/data.js`
- `src/components/Topbar.jsx`
- `src/pages/Settings.jsx`
- `src/pages/Ingredients.jsx`
- `src/pages/Recipes.jsx`
- `src/pages/Bom.jsx`
- `src/styles.css`

Add new file:
- `src/components/IconPicker.jsx`

### 3. Netlify auto-deploys
Hard-refresh once the build finishes.

## What Lily sees after this

**Top-right icons** — same globe + grid + bell as before, but clicking globe or grid now takes her to Settings → Header Links (until she configures a URL). Once she puts a URL in, clicking opens it (external URLs in a new tab by default).

**Settings page** — three tabs at the top:
- **General**: brand & identity, logo upload (all same as before)
- **Header Links**: list of the icon slots. For each: pick an icon from a visual grid (~30 to choose from), label (for tooltip), URL, and a "new tab" toggle. Add more slots with `+ Add Link`. Delete slots with the trash icon.
- **Coming Soon**: placeholders

**Editing data** — every row in Ingredients, Recipes, and Recipe BOM now has a pencil button next to the trash. Click pencil → the row's cells become inputs → Save or Cancel.

Inventory and Pricing already had inline editing (stock qty and target FC%), so no change there.

Yield & Cost and Reports are read-only aggregations — nothing to edit on those pages.

## Suggested first header links

For a bakery:
- WhatsApp Business (icon: `phone` or `message`) → `https://wa.me/60xxxxxxxx`
- Instagram (icon: `camera` or `image`) → `https://instagram.com/lilyartisan`
- Storefront / order form (icon: `external` or `shield`) → your public URL

Or use them as internal shortcuts (`link` icon → `/costing`, etc.). It's just data.
