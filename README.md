# Delta 1 — Auth Foundation

Multi-tenant conversion, step 1 of 4. This delta adds authentication and per-user data isolation. Nothing else changes yet.

## Files in this delta

```
supabase/
  delta-1-auth-foundation.sql    # Run once in SQL Editor
src/
  main.jsx                       # OVERWRITE — adds AuthProvider
  App.jsx                        # OVERWRITE — auth routes + AuthGuard
  lib/
    auth.jsx                     # NEW — session, profile, sign in/out
    settings.jsx                 # OVERWRITE — now per-user
  pages/
    Login.jsx                    # NEW
    ForgotPassword.jsx           # NEW
    ResetPassword.jsx            # NEW
  components/
    AuthGuard.jsx                # NEW — redirects to /login if no session
    Sidebar.jsx                  # OVERWRITE — adds sign-out at bottom
  styles-patch.css               # APPEND to end of src/styles.css
```

## Deployment sequence (IMPORTANT — do in this order)

### Step 1 — Create both users in Supabase Dashboard (2 min, do this FIRST)

Go to Supabase Dashboard → your `lilybakes BOM` project → **Authentication** → **Users** → **Add user** (top-right).

Create two users, both with **"Auto Confirm User" enabled** (checkbox):

| Email                    | Password    |
|--------------------------|-------------|
| lily2211@gmail.com       | 2211Qwer!   |
| anthony2211@gmail.com    | 2211Qwer!   |

Verify both appear in the user list before continuing.

### Step 2 — Push Delta 1 code to GitHub

Overwrite the files as listed above. Push to `main`. Netlify will start building.

**Wait for Netlify to say "Published"** before Step 3.

### Step 3 — Run the migration SQL

Go to Supabase → **SQL Editor** → paste the entire contents of `supabase/delta-1-auth-foundation.sql` → **Run**.

You should see:
```
NOTICE:  Found Lily:  <uuid>
NOTICE:  Found Admin: <uuid>
Success. No rows returned
```

If you see `ERROR: User ... not found`, you skipped Step 1 — go back and create the users.

### Step 4 — Hard-refresh your browser

You should now see the login page. Sign in as either user with `2211Qwer!`.

- **Lily** sees the app exactly as before with all her data intact.
- **Anthony** sees an empty app (no data yet — sysadmin panel comes in Delta 2).

## What this delta does NOT do (yet)

- No sysadmin panel — comes in Delta 2
- No signup / trial / paid subscription flow — comes in Delta 3
- No read-only mode enforcement — comes in Delta 4
- No custom email templates — Supabase default sender for now
- Storage bucket policies stay permissive — will tighten in Delta 2 or 3 when we have real users

## Rollback (if anything goes wrong)

The migration is transactional — if any step fails, the entire migration is rolled back automatically, and your database is exactly as it was before. **Nothing is lost partial-way.**

If the app breaks post-deploy but the migration succeeded:
1. Revert the GitHub commit → Netlify redeploys the old code
2. The old code uses the anon key with no session, but new RLS is per-user — you'll see empty app
3. To temporarily restore full anon access while you debug, run this in SQL Editor:
   ```sql
   CREATE POLICY "temp anon" ON ingredients   FOR ALL TO anon USING (true) WITH CHECK (true);
   CREATE POLICY "temp anon" ON recipes       FOR ALL TO anon USING (true) WITH CHECK (true);
   CREATE POLICY "temp anon" ON bom_lines     FOR ALL TO anon USING (true) WITH CHECK (true);
   CREATE POLICY "temp anon" ON inventory     FOR ALL TO anon USING (true) WITH CHECK (true);
   CREATE POLICY "temp anon" ON header_links  FOR ALL TO anon USING (true) WITH CHECK (true);
   CREATE POLICY "temp anon" ON settings      FOR ALL TO anon USING (true) WITH CHECK (true);
   GRANT SELECT, INSERT, UPDATE, DELETE ON ingredients, recipes, bom_lines, inventory, header_links, settings TO anon;
   ```
   Then remove them once auth is working again.

You've already exported CSV backups — if worst case, we import from those.

## After deploy — what changes for Lily

She'll need to log in once with `lily2211@gmail.com` / `2211Qwer!`. Session persists in her browser, so she won't be asked again unless she signs out or clears her browser storage.

Tell her to change her password from the "Forgot password?" link on the login page (or we'll add a proper "Change password" flow in a later delta).

## What's next (Delta 2)

Once Delta 1 is verified working, Delta 2 adds:
- `/admin` route, sysadmin-only
- User list with roles, subscription dates
- Invite user form (email + start/end dates)
- Reset password / generate temp password / impersonate buttons
- Business info config (invoice numbering, payment QR upload)
- Editable invite email template
