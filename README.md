# Lily Artisan — Cake Costing & BOM

React + Vite frontend, Supabase Postgres backend, Netlify hosting.

## What's inside

- **Dashboard** — greeting (uses your name from Settings), colored stat cards, ingredient cost bar chart, margin gauge, recipe overview table.
- **Ingredient Master** — bulk purchase in → unit cost auto-calculated (with waste %), optional density (g/ml) for mass ↔ volume bridging.
- **Recipe Master** — cakes/bakes with yield and target food-cost %.
- **Recipe BOM** — link ingredients to a recipe in any unit; conversion handled automatically.
- **Yield & Costing** — total batch cost, portions, cost per portion.
- **Selling Price** — suggested price = cost per portion ÷ target FC%. Editable per-recipe.
- **Inventory** — optional stock-on-hand tracking with low-stock flag.
- **Settings** — owner name, business name, currency, default target food-cost %.

## Unit conversion

- Same-dimension: g ↔ kg ↔ oz ↔ lb, and ml ↔ L ↔ tsp ↔ tbsp ↔ cup are exact.
- Mass ↔ volume (e.g. "1 cup butter" against a kg purchase) uses each ingredient's density in g/ml. Missing density is flagged in the UI, not silently guessed.

## Setup — all online

### 1. Supabase

Already provisioned at `https://zbciulldxdoegndvywgf.supabase.co` (project: `lilybakes BOM`).

Open **SQL Editor** → paste in `supabase/schema.sql` → **Run**. This creates:
- `settings` (singleton row: owner_name, business_name, currency, default_target_food_cost_pct)
- `ingredients`, `recipes`, `bom_lines`, `inventory`
- RLS enabled with anon-key permissive policies (single-user, no login yet)
- One seed recipe

Safe to re-run — everything uses `IF NOT EXISTS`.

### 2. GitHub

Repo: `github.com/lilybakes/lilyartisan`. Upload contents of this folder to the repo root.

### 3. Netlify

- Site should already be connected to the repo.
- Env vars under **Site settings → Environment variables**:
  - `VITE_SUPABASE_URL` = `https://zbciulldxdoegndvywgf.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = (from Supabase → Settings → API)
- Build settings auto-read from `netlify.toml`: `npm run build`, publish `dist`.

## Customization

Everything user-facing (name in greeting, currency symbol on prices, default food-cost %) lives in the **Settings** page — no code changes needed.

## Notes

- Placeholder branding "SweetCost" and "Anthony" from earlier drafts are gone; the app addresses whoever is set as Owner Name in Settings.
- Typical densities to fill in when adding ingredients: water 1.00, milk 1.03, butter 0.96, oil ~0.92, caster sugar ~0.85, cake flour ~0.53, cocoa powder ~0.5.
