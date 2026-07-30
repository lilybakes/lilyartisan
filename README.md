# Delta 3a — User Management + Billing Config

The biggest sysadmin delta. This is what turns your platform into something you can actually run as a business.

## What's shipping

**Users page** (`/app/sysadmin/users`):
- Full user list with filter
- **Invite** — creates a user with sysadmin-set start/end dates, returns credentials + optional password-reset email
- **Extend / change dates** — modify subscription window and plan type
- **Send password reset email** — Supabase-native reset link
- **Generate temp password** — random password shown once, share out-of-band
- **Suspend / Reactivate** — soft freeze, reversible, data intact, login blocked
- **Detach / Reattach email** — clears email + password, data preserved. Reattach assigns new email + sends reset link
- **Delete permanently** — hard delete with typed-email confirmation, cascades all data
- **Impersonate** — signs you in AS the user for 15 minutes with a red sticky banner. Click "Stop Impersonating" to swap back to sysadmin session

**Billing page** (`/app/sysadmin/billing`):
- **Business info** — name, registration number, address, contact info
- **Invoice numbering** — prefix, year-reset toggle, next sequence, live preview (`2026-0001`)
- **Payment method** — Bank/account details, payment instructions, DuitNow QR image upload

**Audit log** — every sysadmin action writes to `audit_log` table (viewable UI comes in a later delta, but data is recorded now)

## Files

```
supabase/
  delta-3a-users-billing.sql           # Migration — run once
src/
  App.jsx                              # OVERWRITE — real Users + Billing routes, mounts ImpersonationBanner
  lib/
    sysadmin-api.js                    # NEW — RPC wrappers
    impersonation.js                   # NEW — sessionStorage helpers
  components/
    ImpersonationBanner.jsx            # NEW — sticky red banner
  pages/sysadmin/
    Users.jsx                          # NEW — main page + all 8 modals
    Billing.jsx                        # NEW — 3-tab config
  styles-patch.css                     # APPEND to end of src/styles.css
```

## Deploy steps

### Step 1 — Push code + wait for Netlify

Overwrite files. Push. Wait for Netlify "Published".

### Step 2 — Run migration

Supabase → SQL Editor → paste `supabase/delta-3a-users-billing.sql` → Run.

Should succeed silently. Verify with:
```sql
SELECT * FROM platform_settings;      -- should have 1 row
SELECT COUNT(*) FROM profiles;        -- your existing users
```

### Step 3 — Hard-refresh + test

Log in as Anthony (`anthony2211@gmail.com`). Navigate to:
- `/app/sysadmin/users` — should see list including Lily and yourself
- `/app/sysadmin/billing` — should see 3 tabs pre-filled with your Swim Revelation info

**Smoke test — invite a fake user:**
1. Users → "+ Invite user"
2. Fill: email `test@example.com`, dates default OK, plan yearly
3. Submit → see success screen with email + temp password
4. Skip the reset email (test doesn't exist)
5. Refresh list → see the new user

**Test impersonation on the fake user:**
1. Click Actions → Impersonate
2. Confirm → you're redirected to `/app` **as** test@example.com
3. Red banner at top: "Impersonating test@example.com"
4. Click "Stop Impersonating" → back to your sysadmin session

**Delete the fake user when done:**
1. Actions → Delete permanently
2. Type `test@example.com` to confirm → deleted

## About impersonation — how it works under the hood

Supabase doesn't expose direct impersonation, so we use a **password-swap** approach:

1. Sysadmin clicks Impersonate
2. Server-side RPC (SECURITY DEFINER) does:
   - Verify caller is sysadmin
   - Save the target's current password hash + a random session token
   - Overwrite the target's password with a random 15-min token
   - Log the impersonation event
3. Client saves the sysadmin's own session in `sessionStorage`
4. Client signs out sysadmin, signs in as target with the temp password
5. Redirect to `/app` — banner appears from `sessionStorage` flag
6. Click "Stop Impersonating" → server-side restores the original password hash from the session record. Client restores sysadmin session via `supabase.auth.setSession()`

**Fail-safes:**
- Session auto-expires after 15 minutes (record stored; user can always reset via Forgot password if you forget to stop)
- Every start and stop is in `audit_log`
- Detached and sysadmin accounts cannot be impersonated

**Limitations to know:**
- If sysadmin closes the tab without stopping, their session is lost (they'll need to log in again — the target's password will be restored automatically on next impersonation stop OR by manually running `sysadmin_stop_impersonation` in SQL)
- Best practice: always click "Stop Impersonating" before closing the tab

## About the Users page RPC

`sysadmin_list_users()` is a SECURITY DEFINER function that bypasses per-user RLS. Only sysadmins can call it — the function checks `is_sysadmin()` at the top.

Regular `SELECT * FROM profiles` still respects RLS, so users can't see each other's profiles even in the client.

## What's NOT in this delta (coming in 3b / 4)

- **Content editor** (landing page copy, Coming Soon widget) — Delta 3b
- **Auth email template editor** — Delta 3b
- **Audit log UI** — Delta 3c (data is being written already)
- **Platform settings** (feature flags, maintenance mode) — Delta 3c
- **Public checkout / payment queue** (proof upload, verify, invoice, receipt) — Delta 4
- **Read-only mode enforcement** for expired accounts — Delta 5

## Rollback

If something breaks:
1. Revert GitHub commit → Netlify redeploys previous code
2. Migration is **additive only** — no data lost, no columns dropped. Safe to leave the new tables/columns in place even if you rollback the frontend.
3. If you want to fully rollback the schema too:
   ```sql
   DROP FUNCTION IF EXISTS sysadmin_list_users, sysadmin_invite_user, sysadmin_extend_subscription, sysadmin_suspend_user, sysadmin_unsuspend_user, sysadmin_detach_email, sysadmin_reattach_email, sysadmin_generate_temp_password, sysadmin_get_user_email, sysadmin_delete_user, sysadmin_start_impersonation, sysadmin_stop_impersonation, log_audit CASCADE;
   DROP TABLE IF EXISTS impersonation_sessions, audit_log, platform_settings;
   ALTER TABLE profiles DROP COLUMN IF EXISTS email_status, DROP COLUMN IF EXISTS email_changed_at, DROP COLUMN IF EXISTS suspended_at, DROP COLUMN IF EXISTS suspended_reason;
   ```
