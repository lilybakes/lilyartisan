# Delta 3b — Content Editor + Email Templates

Sysadmin gets full control over what appears on the landing page and the emails your users will receive.

## What's shipping

**Content page** (`/app/sysadmin/content`) — six tabs, all live-editable:
- **Hero** — eyebrow, title (two lines), tagline, body, CTAs, fine print
- **Features** — section header + drag-orderable list of feature cards, each with icon (from 8 presets), color tone, title, body
- **Pricing** — plan name, currency, amount, period, feature list, CTA, fine print
- **FAQ** — reorderable question/answer pairs
- **Final CTA** — closing CTA section
- **Coming Soon** — items that show in every user's Settings page

Every tab has "Reset to default" so you can always get back to the original copy.

**Auth & Login page** (`/app/sysadmin/auth`) — email template editor:
- Four seeded templates: **Invite**, **Welcome (trial)**, **Trial expiring**, **Subscription expiring**
- Subject + body with `{{variable}}` substitution
- Click-to-insert variable chips (name, sender_name, action_link, subscription_link, end_date, days_left, business_name)
- Edit / Preview toggle — preview substitutes sample values so you see how it'll actually look
- SMTP notice at the top: templates are stored but not yet sent until you configure custom SMTP in Supabase

**Coming Soon widget component** — drop it into your Settings page and it renders whatever items you added in Content editor. Zero items = renders nothing.

## Files

```
supabase/
  delta-3b-content.sql              # Migration — creates content_blocks + email_templates
src/
  App.jsx                           # OVERWRITE — real Content + AuthSettings routes
  lib/
    content-defaults.js             # NEW — shared source of truth for hardcoded fallbacks
    sysadmin-api.js                 # OVERWRITE — includes content + email APIs
  pages/
    Landing.jsx                     # OVERWRITE — fetches from content_blocks with defaults fallback
    sysadmin/
      Content.jsx                   # NEW — 6-tab editor
      AuthSettings.jsx              # NEW — email template editor
  components/
    FeatureIcon.jsx                 # NEW — 8-icon set for feature cards
    ComingSoonWidget.jsx            # NEW — user-facing widget
  styles.css                        # OVERWRITE (full file — Delta 2 + 3a + 3b combined)
```

## Deploy steps

### Step 1 — Push code + wait for Netlify

Overwrite the files. Push. Wait for Netlify "Published".

### Step 2 — Run migration

Supabase SQL Editor → paste `supabase/delta-3b-content.sql` → Run.

Verify with:
```sql
SELECT key FROM content_blocks;      -- empty initially, filled as you save
SELECT key, label FROM email_templates;   -- 4 seeded rows
```

### Step 3 — Test as sysadmin

1. Log in as Anthony
2. Navigate to `/app/sysadmin/content` → 6 tabs, all pre-filled with the current landing copy
3. Change the hero title from "Guess less." to "Guess never." → Save
4. Open `/` in a new tab → confirm the change appears
5. Navigate to `/app/sysadmin/auth` → 4 email templates → open Invite template → click Preview → see substituted values

### Step 4 — Add the Coming Soon widget to your Settings page

Open `src/pages/Settings.jsx` and add:

```jsx
import ComingSoonWidget from '../components/ComingSoonWidget.jsx'
```

Then drop `<ComingSoonWidget/>` wherever you want it to appear (typically at the bottom of the page).

If you'd rather I generate a full Settings.jsx with the widget integrated in a "Coming Soon" tab, tell me and I'll ship it in the next delta.

## About the Landing page rendering

`Landing.jsx` now fetches all content from `content_blocks` on load. Between the initial render and the fetch completing, it shows the defaults from `content-defaults.js`. Users won't notice — the transition is instant on any decent connection.

If the DB fetch fails (network, RLS misconfig, whatever), defaults are used. **The landing page never breaks.**

## About Email Templates

The four templates are stored but not sent yet. Here's why:

**Currently:** When you invite a user or send a password reset, Supabase Auth uses its **own** built-in email templates. You can edit those directly in Supabase Dashboard → Auth → Emails → Templates. Sender is `noreply@mail.app.supabase.io`.

**Next step (whenever you're ready):** Configure custom SMTP in Supabase Dashboard → Auth → Emails → SMTP Settings. Point it at Resend, SendGrid, or Mailgun. Once done, **the templates from our editor become the ones that get sent**. Zero code change needed — I'll wire in the send flow in a later delta.

For **new invite templates** we design (like "Trial expiring in 3 days"), we need to send them ourselves via a scheduled Edge Function. That comes in a later delta (Delta 5+).

## What's NOT in this delta

- Actual email sending — awaits SMTP setup
- Scheduled email jobs (trial expiring notices) — Delta 5+
- Platform Settings + Audit Log UIs — Delta 3c or later
- Public checkout + payment queue — Delta 4

## Rollback

Additive only. Safe.

To fully rollback the schema:
```sql
DROP TABLE IF EXISTS content_blocks, email_templates;
```

Your saved content will be gone but the Landing page falls back to code defaults, so nothing breaks visually.
