# Rename: BakerNomics → BakeOnomics

Complete brand rename across code + database. Preserves all your sysadmin content edits.

## What's included

```
supabase/
  rename-to-bakeonomics.sql            # DB rename (content_blocks, email_templates, platform_settings, settings)

src/
  components/
    Logo.jsx                            # OVERWRITE — Bake (navy) + Onomics (violet) wordmark
    HeroCarousel.jsx                    # OVERWRITE — updated URLs (app.bakeonomics.com) + body copy
  lib/
    content-defaults.js                 # OVERWRITE — default landing copy, in case defaults are ever reset
  pages/
    Checkout.jsx                        # OVERWRITE — "Subscribe to BakeOnomics"
    CheckoutPending.jsx                 # OVERWRITE — success message + login copy
    Maintenance.jsx                     # OVERWRITE (already had no mentions, safe to skip if unchanged)
    Signup.jsx                          # OVERWRITE (same — safe to skip if unchanged)
```

## Deploy — 3 steps

### Step 1 — Run the SQL

Supabase SQL Editor → paste `supabase/rename-to-bakeonomics.sql` → Run.

The last SELECT shows how many BakerNomics mentions remain in each table. Should return all zeros. If not, re-run and something is caching.

### Step 2 — Push the code files

Overwrite the 7 files, commit, push. Netlify redeploys.

### Step 3 — Find anything I missed

I don't have your `index.html`, `public/site.webmanifest`, `Login.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`, or `package.json`. **In Cursor/VS Code**, do a project-wide find-and-replace (case-sensitive) with these two passes:

- Find: `BakerNomics`  →  Replace: `BakeOnomics`
- Find: `bakernomics`  →  Replace: `bakeonomics`

**Also check specifically:**
- `index.html` — the `<title>` tag, `<meta name="description">`, and any Open Graph tags
- `public/site.webmanifest` — the `name` and `short_name` fields
- `package.json` — the `name` field (optional — cosmetic only)

If you use the GitHub web UI: use the repo-level search bar at the top, search `BakerNomics`, click each result, click the pencil to edit, save.

## Known edge case — the wordmark split

The Logo component previously rendered `Baker` + `Nomics` as two separate `<span>`s so each half could get a different color. A blind find-and-replace of `BakerNomics` won't touch this because it's split across JSX. I've handled this in `Logo.jsx` already — the new split is `Bake` (navy) + `Onomics` (violet). If your Logo lives anywhere else besides `src/components/Logo.jsx`, check for that split there too.

## Not renamed

- **Supabase storage bucket** is still `lilyartisan-images`. Users never see this in the UI, only in payment-proof image URLs. Renaming it means migrating all uploads. Not worth it right now.
- **GitHub repo name** (`lilyartisan`) — unrelated to what users see. Rename it in GitHub Settings if you want, but Netlify auto-follows repo renames.
- **Favicon set** — you said this is done outside this chat.

## What users will see immediately after deploy

- Sidebar wordmark: "BakeOnomics"
- Landing page hero carousel + all copy: "BakeOnomics"
- Checkout flow: "Subscribe to BakeOnomics"
- Approval emails Anthony sends: "Welcome to BakeOnomics" / "Invited to BakeOnomics"
- Sysadmin Content editor already shows the new brand (your existing edits with the old brand are updated in-place)

## Rollback

Every rename is a REPLACE — to roll back, run the same SQL with the strings swapped:

```sql
UPDATE content_blocks SET content = REPLACE(content::text, 'BakeOnomics', 'BakerNomics')::jsonb;
-- ...and similar for each table
```

But you'll want to keep BakeOnomics — bakernomics.com is taken.
