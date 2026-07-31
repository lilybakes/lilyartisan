# Multi-tenancy leak fix

## What actually happened

Nothing was shared or duplicated. The RLS policy on user data tables was:

```sql
USING (user_id = auth.uid() OR is_sysadmin())
```

That `OR is_sysadmin()` means when you're signed in as `anthony2211@gmail.com` (sysadmin), the Recipe Master page pulls every user's recipes into a single view with no visual difference between yours and theirs. "Blueberry bagel" was Lily's recipe from the start — never yours. When you added a photo, you edited *her* row through your sysadmin privilege. She sees it because it was always her recipe.

This was a design flaw in Delta 1: sysadmin was given automatic cross-user visibility on normal data tables, but the UI has no indication of whose data is being displayed. Impossible for a sysadmin to tell what's theirs.

## The fix

Tighten the policies to `own only`. Sysadmin gets no automatic access to other users' data through the normal UI. What still works:

- **The sysadmin panel** (`/app/sysadmin/*` — Users, Orders, Template Access, Audit Log, Content, etc.) all use SECURITY DEFINER RPCs (`sysadmin_list_users`, `sysadmin_list_orders`, etc.) which run with elevated privilege independently of RLS. Unaffected.
- **Impersonation** — when you need to actually browse a specific user's data, go to the Users page and use the existing Impersonate button. That swaps your session to be that user; RLS then naturally shows their data, and the topbar shows an "IMPERSONATING" indicator so you can't confuse it with your own.

## Files

```
supabase/
  rls-tenancy-fix.sql        # NEW — drops OR is_sysadmin() from all user data tables
```

One file. Safe to re-run.

## What the SQL does

1. Drops the `own or sysadmin` policy on `ingredients`, `recipes`, `bom_lines`, `inventory`, `header_links`, `settings`.
2. Recreates each as strict `USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())`.
3. Verifies no policy still references `is_sysadmin()` on any of those six tables — raises an exception if it finds one, so you'll know immediately if the migration didn't take.
4. Runs `seed_starter_recipes()` for `anthony2211@gmail.com` if that function exists and Anthony has no recipes of his own. Idempotent — no-op if he already has any.

## Existing data

Left alone. Rows you edited under the old policy remain with whichever user owns them:

- The photo you added to Lily's Blueberry bagel stays on Lily's row. She keeps it.
- Any recipe you saw and edited in the last few days was almost certainly Lily's. After this migration you'll no longer see them from your sysadmin account.
- After the migration, Anthony's Recipe Master will show ONLY his own starter recipes (freshly seeded by step 4 above).

If you want to clean up any specific rows (say, remove the Blueberry bagel photo you accidentally added), impersonate Lily on the Users page and edit it from her account.

## Deploy

Supabase SQL editor → paste `supabase/rls-tenancy-fix.sql` → Run. Sign out and back in on both accounts. Anthony sees only his own data; Lily sees only hers.

## Sanity check

Run this in the SQL editor after:

```sql
SELECT tablename, policyname, qual
  FROM pg_policies
  WHERE tablename IN ('ingredients','recipes','bom_lines','inventory','header_links','settings')
  ORDER BY tablename;
```

Every `qual` should be `(user_id = auth.uid())`. No `OR is_sysadmin()` anywhere.

## What still uses `is_sysadmin()` legitimately

For reference — these keep it because they're the sysadmin's *actual* domain, not user data:

- `profiles` — sysadmin needs to see all profiles to manage users
- `platform_settings`, `audit_log`, `impersonation_sessions`, `orders`, `email_templates`, `content_blocks`, `hero_gallery`, `template_visibility`, `template_grants` — sysadmin-only tables

Those all remain as they were. Only the six user-data tables above changed.
