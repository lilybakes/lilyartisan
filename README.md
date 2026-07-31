# Exclusive Templates & Styles — Access Control System

Adds fine-grained sysadmin control over which users can see which templates and which style variants.

## Design

**Default:** every template + every style is available to every user.

**Sysadmin toggles Exclusivity:** on any of the 10 templates OR any of the 5 style variants (except the default one). Marking something exclusive hides it from every user.

**Sysadmin grants access per-user:** exclusive items appear only for the specific users named in the Grants table. Individual user grants — not groups, not roles — matching your exact spec.

Two independent scopes:
- **Template scope** — hide/grant whole templates (e.g. only VIP customers see "Certificate of Craft")
- **Style scope** — hide/grant whole style aesthetics (e.g. only premium subscribers see "Vintage Letterpress")

## Files

```
supabase/
  template-access.sql               # NEW — 2 tables, 7 RPCs, RLS policies

src/
  pages/
    Templates.jsx                   # OVERWRITE — filters by access, shows exclusive-granted badge
    sysadmin/
      TemplateAccess.jsx            # NEW — 2-tab sysadmin management page
  components/
    Sidebar.jsx                     # OVERWRITE — adds "Template Access" nav under Content & Design
    NavGlyph.jsx                    # OVERWRITE — adds padlock "vault" glyph
  App.jsx                           # OVERWRITE — adds /app/sysadmin/templates route
  styles.css                        # OVERWRITE (full file) — sysadmin page styles + exclusive badge
```

## Deploy — 2 steps

### 1. Run the SQL

Supabase SQL Editor → paste `supabase/template-access.sql` → Run. Creates:
- `template_visibility` table (which items are exclusive)
- `template_grants` table (who has access to what)
- RLS policies (users see own grants; sysadmins see everything)
- 7 RPCs (`my_template_access`, `has_template_access`, plus 5 sysadmin functions)

Uses the existing `is_sysadmin()` function from previous deltas. Safe to re-run.

### 2. Push the code

Overwrite the 6 files, push. Netlify redeploys.

## How to use it — walkthrough

1. Log in as sysadmin (`anthony2211@gmail.com`)
2. Sidebar → **Sysadmin → Content & Design → Template Access**
3. **Exclusivity tab**: flip toggles to mark items exclusive
   - Example: toggle **Certificate of Craft** and **Vintage Letterpress** to Exclusive
   - Immediately, those disappear from every regular user's Templates page
4. **Grants tab**: pick a specific user, pick a scope + item, add an optional note, click Grant
   - Example: grant `certificate` and `letterpress` to `lily@bakeonomics.com`
5. Log in as Lily → she sees the Certificate template + Letterpress style; other users don't
6. Anthony (sysadmin) sees everything regardless of grants

## How exclusivity displays for the granted user

Two subtle indicators — the templates work exactly the same, but with a hint of "this is yours":

- **Small gold star** ★ next to the template name in the sidebar list
- **Gold dot** in the top-right corner of the template's gradient icon
- **Title tooltip** appends "(Exclusive template — granted to you)"
- Exclusive style variants get a ★ suffix in the dropdown option label

Nothing louder than that — the point is quiet flex, not decoration.

## Security notes

- All sysadmin RPCs check `is_sysadmin()` at the top and raise if not.
- RLS policies enforce: users see their own grants only (via SELECT); only sysadmins can INSERT/UPDATE/DELETE.
- The `my_template_access` RPC is `SECURITY DEFINER` so it can peek into `template_visibility` and `template_grants` on behalf of the calling user without exposing them via direct table access.
- Default style variant (`clean-modern`) has its toggle disabled — the sysadmin cannot mark the fallback style exclusive, so users always have at least one style available.
- If a user's granted template gets revoked while their Templates page is open, the frontend detects the missing template on the next data refresh and auto-selects an available one.

## Edge cases handled

- Sysadmin marks something exclusive but doesn't grant it → nobody except sysadmins can use it
- Sysadmin unmarks exclusive → item becomes public again immediately (row stays in `template_visibility` with `is_exclusive=false` for auditability)
- User has no grants for anything → they see the standard set (everything not marked exclusive)
- Grant is set with a note like "VIP · 2026-Q4 promo" — visible in the sysadmin grants list for record-keeping

## Extending

**Group-based grants later.** The current schema is per-user. If you want to add "grant to a group" later, add a `template_grant_groups` table with the same shape, plus a link table, and update `has_template_access()` to check both.

**Time-limited grants.** Add an `expires_at timestamptz` column to `template_grants`. Update the SQL check in `my_template_access` to include `AND (g.expires_at IS NULL OR g.expires_at > now())`.

**Audit trail.** Every grant already records `granted_by` + `granted_at`. To also log revocations, add a `template_grant_history` table triggered on DELETE.
