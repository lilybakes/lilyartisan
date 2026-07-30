# Delta 3c — Platform Settings + Audit Log

The last two placeholder sysadmin pages become real. Both were being written to since Delta 3a; now they have UIs.

## What's shipping

**Platform page** (`/app/sysadmin/platform`) — four sections:
1. **Signup Rules** — toggle whether new people can sign up; trial toggle reserved for Delta 4
2. **Maintenance Mode** — toggle + custom message. When ON, regular users see a maintenance page; sysadmins bypass with a red strip at the top
3. **Platform Announcement** — banner shown at the top of every authenticated page. Toggle + message + severity picker (info / warning / critical). Users can dismiss for the session
4. **Backups** — informational card with a link to Supabase Dashboard → Database → Backups

**Audit Log page** (`/app/sysadmin/audit`) — searchable table:
- Every sysadmin action since Delta 3a is already recorded — invite, extend, suspend, detach, delete, temp password, password reset, impersonate start/stop
- Columns: When (relative time, full timestamp on hover), Actor, Action (color-coded pill), Target, Details (expandable JSON)
- Filters: action dropdown (with counts), search actor or target email, row limit (50/100/250/500)
- Expandable per-row details for the raw `details` JSON

**Announcement banner** — shown at the top of every authenticated page when active, with three severity styles. Info = soft purple, Warning = amber, Critical = red

**Maintenance gate** — non-sysadmins get a friendly "Down for maintenance" page. Sysadmins see the app plus a red strip reminding them maintenance is on

**Signup gate** — when signups are disabled, `/signup` shows a "Signups temporarily paused" card with a link to sign in

## Files

```
supabase/
  delta-3c-platform-audit.sql       # Migration
src/
  App.jsx                           # OVERWRITE — wires everything
  lib/
    platform.js                     # NEW — usePlatformStatus hook
  components/
    AnnouncementBanner.jsx          # NEW
    MaintenanceGate.jsx             # NEW
  pages/
    Maintenance.jsx                 # NEW
    Signup.jsx                      # OVERWRITE — checks signups_enabled
    sysadmin/
      Platform.jsx                  # NEW (replaces placeholder)
      AuditLog.jsx                  # NEW (replaces placeholder)
  styles.css                        # OVERWRITE (full file)
```

## Deploy steps

### Step 1 — Push code + wait for Netlify

### Step 2 — Run migration

Supabase SQL Editor → paste `supabase/delta-3c-platform-audit.sql` → Run.

Verify:
```sql
SELECT signups_enabled, maintenance_mode, announcement_enabled, announcement_severity
FROM platform_settings WHERE id = 1;
```
Should return 1 row with `signups_enabled=true`, `maintenance_mode=false`, `announcement_enabled=false`, `announcement_severity='info'`.

### Step 3 — Test as Anthony (sysadmin)

**Announcement:**
1. `/app/sysadmin/platform` → scroll to "Platform Announcement"
2. Toggle "Announcement active" ON
3. Type a message → click Save
4. Pick severity Warning
5. Navigate to `/app` (Dashboard) → see the amber banner at top
6. Click ✕ on the banner → it dismisses for this session
7. Go back to Platform → toggle announcement OFF

**Maintenance mode:**
1. `/app/sysadmin/platform` → "Maintenance Mode" section
2. Change the message ("We're upgrading the servers — back at 3pm")
3. Toggle "Maintenance mode active" ON
4. **In an incognito window**, log in as Lily → she sees the maintenance page instead of the app
5. Back in your normal window, you (Anthony) see a red strip at top but the app still works
6. Toggle maintenance OFF → Lily can refresh and get back in

**Audit Log:**
1. `/app/sysadmin/audit` → see rows from all sysadmin actions you've done since Delta 3a
2. Filter by action (e.g. only "Started impersonation")
3. Click "Details" on a row → see the raw JSON

**Signups closed:**
1. Platform → toggle "Signups open" OFF
2. Open incognito → visit `/signup` → see "Signups are closed" card
3. Toggle back ON

### Step 4 — Nothing to test for regular users

Lily has no visibility into any of these controls — she just experiences them (banner appears, maintenance page appears, etc).

## About how state propagates

The Platform toggles take effect on the **next page load** for existing users. No realtime — I kept it simple. If you flip maintenance mode ON, users who are already inside the app stay inside until their next navigation. This is intentional and safe for MVP.

## What's NOT in this delta

- Real-time updates (Supabase Realtime subscription) — planned if we ever need instant enforcement
- Feature-flag enforcement beyond signups (e.g. hide specific pages by flag) — add per-flag when needed
- Trial toggle enforcement — comes in Delta 4 with public checkout

## Rollback

Additive. Safe.

```sql
ALTER TABLE platform_settings
  DROP COLUMN IF EXISTS signups_enabled,
  DROP COLUMN IF EXISTS trial_enabled,
  DROP COLUMN IF EXISTS maintenance_mode,
  DROP COLUMN IF EXISTS maintenance_message,
  DROP COLUMN IF EXISTS announcement_enabled,
  DROP COLUMN IF EXISTS announcement_message,
  DROP COLUMN IF EXISTS announcement_severity;
DROP FUNCTION IF EXISTS sysadmin_list_audit_log(text, text, integer);
DROP FUNCTION IF EXISTS sysadmin_list_audit_actions();
```

Next up: **Delta 4** — the paid checkout flow you asked about at the beginning (proof upload, verify queue, invoice generation, invite trigger).
