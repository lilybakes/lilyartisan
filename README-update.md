# Lily Artisan — Create-time upload + click-to-enlarge

Two UX improvements to the image feature:

1. **Upload during create.** The Add Ingredient / Add Recipe forms now have their own photo chip. Pick a photo before hitting "+ Add" and it saves with the row — no more "add then click chip".
2. **Click to view full size.** Clicking any image chip anywhere in the app now opens a lightbox at the image's natural aspect ratio. For uploadable chips (Recipe Master, Ingredient Master rows and add forms), the lightbox also has Replace and Remove buttons.

## Files

```
src/
  components/
    Chip.jsx              (updated — branches: image→lightbox, empty→picker)
    ImageLightbox.jsx     (NEW — modal viewer)
  pages/
    Ingredients.jsx       (add form has chip, wires onRemove for lightbox)
    Recipes.jsx           (same)
  styles-patch.css        (paste at the end of your existing styles.css)
```

## Apply

1. **GitHub**
   - Add new file `src/components/ImageLightbox.jsx`.
   - Overwrite `src/components/Chip.jsx`, `src/pages/Ingredients.jsx`, `src/pages/Recipes.jsx`.
   - Open the styles patch file and append its contents to your existing `src/styles.css`. It's mostly additions; there's a small note at the top about which two old rules to delete (the previous `.row-chip.uploadable` hover rules — the new `.clickable` versions replace them).
2. **Netlify** auto-deploys. Hard-refresh.

No Supabase changes. The `image_url` columns and storage bucket from schema-update-v4 already handle everything.

## Behavior notes

- **Chip states**:
  - No image, not uploadable (e.g. BOM ingredient list) → static, colored initials, no click.
  - No image, uploadable (add form, editable row) → hover shows a dark overlay with a camera icon, click opens picker.
  - Has image, any → hover lifts the chip slightly, click opens the lightbox.
- **Lightbox**:
  - Esc closes. Backdrop click closes. Close button (top-right) closes.
  - "Replace photo" (only if the chip is uploadable) closes the lightbox and opens the file picker.
  - "Remove photo" (only if the chip is uploadable AND has an image) prompts for confirmation, deletes from storage, and clears `image_url` in the row.
  - Non-uploadable chips (Dashboard, BOM, Costing, Pricing, Inventory) get a bare viewer with just Close — no way to modify from those pages.
- **Add-form uploads**: if you upload a photo, then close the browser tab without hitting "+ Add", the file becomes an orphan in Storage (acceptable — Supabase free tier is 1 GB and each ingredient photo is ~30–80 KB). If you replace the pending photo with a different one before saving, the previous upload is cleaned up.
- **Image sizes** bumped for better lightbox viewing:
  - Ingredients: 256 → **512 px** longest side
  - Recipes: 640 → **1024 px** longest side
  Storage impact is minor (Recipes photos still <150 KB each at JPEG 0.85).
