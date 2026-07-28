# Lily Artisan — BakerNomics facelift + Logo upload

This is a **delta drop-in** on top of the existing `lilyartisan` repo. It swaps the sidebar brand and hero portrait for the BakerNomics design, and makes the logo actually uploadable via Settings.

## What's in this zip

```
public/assets/
  lily-mark-white.png       (the L stamp, white on transparent)
  lily-portrait.png         (the Pixar-style portrait, transparent bg)

src/
  components/
    Sidebar.jsx             (updated — new lockup)
    Topbar.jsx              (updated — portrait avatar)
  pages/
    Dashboard.jsx           (updated — portrait hero panel)
    Settings.jsx            (updated — app name + working logo upload)
  lib/
    settings.jsx            (updated defaults)
  styles.css                (updated — .brand, .hero, .avatar)

supabase/
  schema-update.sql         (adds 2 columns to settings)
```

## Apply in this order

### 1. Run the schema patch in Supabase

SQL Editor → paste in `supabase/schema-update.sql` → **Run**.
It adds `app_name` (default `Baker|Nomics`) and `logo_data_url` (nullable) to the `settings` row.

### 2. Upload the files to GitHub

On the `lilyartisan` repo:

- **Add file → Upload files** → drag in the `public` folder (creates `public/assets/lily-mark-white.png` and `public/assets/lily-portrait.png`).
- Then upload each modified file to its correct path:
  - `src/components/Sidebar.jsx` (overwrites)
  - `src/components/Topbar.jsx` (overwrites)
  - `src/pages/Dashboard.jsx` (overwrites)
  - `src/pages/Settings.jsx` (overwrites)
  - `src/lib/settings.jsx` (overwrites)
  - `src/styles.css` (overwrites)

You can also delete `src/components/CakeSVG.jsx` — no longer referenced.

### 3. Netlify redeploys automatically

Hard-refresh once it finishes (Ctrl/Cmd+Shift+R).

## How it works

**Sidebar lockup** — navy 42×42 circle stamp holding the mark image, wordmark to the right split on the `|` character (default `Baker|Nomics` → "Baker" navy, "Nomics" violet), and the business name in uppercase kicker beneath.

**Hero portrait** — the greeting card loses its right padding; a 250px-wide gradient panel (indigo→pink, 160°) bleeds to the card's right edge with `overflow: hidden`. The portrait sits absolutely-positioned at 500px tall inside — the clipping is what produces the head-and-shoulders crop.

**Top-bar avatar** — same portrait tightly cropped inside a 38px circle with the online-status ring.

**Logo upload (Settings → Logo)** — user picks any image, it's resized to 256px on longest side via canvas, converted to a PNG data URL, and saved into `settings.logo_data_url`. The sidebar reads that first, falling back to `/assets/lily-mark-white.png`. "Remove" clears the field back to null and the default returns.

**App name and business name** are edited on the Brand & Identity card in Settings. The pipe in "App Name" is the color split — `Sweet|Bake` would render "Sweet" navy, "Bake" violet.

## Notes

- The hero portrait itself isn't uploadable (yet). It's a bundled asset. There's a placeholder tile in Settings under "Coming Soon" for when you want that added.
- The favicon set from the design zip is the same one already installed — no change needed there.
- Auto-resize keeps uploaded logos small; typical output is under 30KB even for large source images.
