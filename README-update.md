# Lily Artisan — Image uploads for recipes & ingredients

Delta drop-in on the existing `lilyartisan` repo. Adds photos to recipes and ingredients.

## What changes

- **Recipe rows** get a 48px tile on the left — click to upload a photo of the finished cake.
- **Ingredient rows** get a 32px tile on the left — click to upload a photo of the ingredient.
- **Everywhere else** recipes & ingredients appear (Dashboard, Recipe BOM, Yield & Cost, Pricing, Inventory), the photo shows automatically once uploaded. Rows without a photo keep the colored initials as before.
- On the Yield & Cost page, the selected recipe now shows a larger 56px thumbnail next to its name.

Images auto-resize on upload — a 5MB phone photo becomes ~30–80KB in storage.

## Storage approach

Uses **Supabase Storage** (not base64 in rows) because:
- Photos can be higher quality (recipes 640px, ingredients 256px longest side)
- Doesn't bloat the `recipes` and `ingredients` tables
- Uploads served via CDN
- Fits the "grows into production" trajectory better

Bucket: `lilyartisan-images` (public, 5MB per file, images only). Structure:
```
lilyartisan-images/
  ingredients/
    <timestamp>-<random>.jpg
  recipes/
    <timestamp>-<random>.jpg
```

When you delete a recipe/ingredient, its image is also removed from storage. Same when you replace a photo — the old file is deleted first.

## Files in this zip

```
src/
  lib/
    upload.js              (NEW — resize + upload + delete helpers)
  components/
    Chip.jsx               (NEW — reusable image/initials chip, uploadable variant)
  pages/
    Ingredients.jsx        (chip is uploadable)
    Recipes.jsx            (chip is uploadable, enlarged to 48px)
    Dashboard.jsx          (uses Chip in Recipe Overview)
    Bom.jsx                (uses Chip for ingredient rows)
    Costing.jsx            (uses Chip; larger recipe header)
    Pricing.jsx            (uses Chip)
    Inventory.jsx          (uses Chip)
  styles.css               (adds uploadable/hover styles for row-chip)

supabase/
  schema-update-v4.sql     (adds image_url cols + creates storage bucket + policies)
```

## Apply in this order

### 1. Supabase
SQL Editor → paste `supabase/schema-update-v4.sql` → **Run**. Safe to re-run.

This adds the `image_url` columns to `recipes` and `ingredients`, creates the `lilyartisan-images` bucket, and sets storage policies (public read, anon write — matching the app's single-user setup).

You can verify in Supabase → Storage → the `lilyartisan-images` bucket appears.

### 2. GitHub
Add new files:
- `src/lib/upload.js`
- `src/components/Chip.jsx`

Overwrite existing files:
- `src/pages/Ingredients.jsx`
- `src/pages/Recipes.jsx`
- `src/pages/Dashboard.jsx`
- `src/pages/Bom.jsx`
- `src/pages/Costing.jsx`
- `src/pages/Pricing.jsx`
- `src/pages/Inventory.jsx`
- `src/styles.css`

### 3. Netlify auto-deploys
Hard-refresh after the build finishes.

## Behavior notes

- **Hover state:** the chip scales up slightly and shows a dark overlay with a camera icon, signaling it's clickable.
- **File picker:** click the chip → native file picker → pick image → auto-resize + upload → row updates in place.
- **No image yet:** the chip shows colored initials, exactly as before.
- **Replacing a photo:** upload again on the same chip. The old image is deleted from Storage automatically.
- **Deleting a row:** any attached image is deleted from Storage before the row is removed.

## Extras worth noting

- The `Chip` component now powers every avatar-style tile in the app. If you later want to change the shape (e.g. circles instead of rounded squares), or add a badge overlay, it's a one-file change.
- Storage bucket is public-read, so image URLs work directly in `<img src>` without signed URLs. If you want private images later (e.g. sensitive recipe cards), we'd flip the bucket to private and use `createSignedUrl()` — one function change in `upload.js`.
