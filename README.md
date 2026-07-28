# Cake Costing & BOM

React + Vite frontend, Supabase Postgres backend, Netlify hosting.

## What's inside

- `src/lib/units.js` — dimensional unit conversion (g/kg/oz/lb, ml/L/tsp/tbsp/cup, pcs) with density bridging for mass ↔ volume.
- `src/lib/costing.js` — pure costing functions: unit cost, line cost, cost per portion, suggested price.
- `src/lib/data.js` — Supabase CRUD hooks (`useTable`, `useBomLines`, `useInventory`).
- `src/pages/*` — one page per module (Ingredients, Recipes, BOM, Costing, Pricing, Inventory, Reports).
- `supabase/schema.sql` — tables, RLS, seed row.

## 1. Set up Supabase

1. Create a new project at supabase.com.
2. Open the SQL editor and paste in `supabase/schema.sql`. Run it.
3. In **Project Settings → API**, copy the **Project URL** and the **anon public** key.

RLS is on with a permissive policy since it's a single-user setup. When you add auth later, replace the `anon full access` policies with owner-scoped ones.

## 2. Local dev

```bash
cp .env.example .env.local
# paste your Supabase URL + anon key into .env.local
npm install
npm run dev
```

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial cake costing app"
git branch -M main
git remote add origin https://github.com/<you>/cake-costing.git
git push -u origin main
```

`.env.local` is gitignored — never commit it.

## 4. Deploy to Netlify

1. On Netlify: **Add new site → Import from GitHub**, pick this repo.
2. Build settings auto-detect from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. In **Site settings → Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Trigger a deploy. Every push to `main` redeploys.

The `netlify.toml` also has an SPA redirect so React Router deep links work.

## Notes on units

- Same-dimension conversions (g↔kg, ml↔L↔cup, oz↔lb) are exact.
- Mass ↔ volume (e.g. "1 cup butter" costed against a kg purchase) uses each ingredient's `density_g_ml`. Without a density, that line is flagged in the UI instead of silently miscosted.
- Typical densities: water 1.00, milk 1.03, butter 0.96, oil ~0.92, caster sugar ~0.85, cake flour ~0.53, cocoa powder ~0.5.
