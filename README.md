# Delta 2 — Landing + Signup + URL Restructure + Remember Me + Sysadmin Nav

Multi-tenant conversion, step 2 of 4. This delta turns the app into something you can actually promote and sell.

## What's shipping

- **One-page landing site** at `/` — hero, features, pricing, FAQ, CTAs
- **Public signup** at `/signup` — instant 14-day trial creation
- **URL restructure** — app moves from `/*` to `/app/*`. Landing lives at `/`.
- **"Keep me signed in"** checkbox on login (defaults ON, 6-month persistence)
- **Sysadmin nav section** — visible only to Anthony's account, 6 placeholder pages (Users, Billing, Content, Auth & Login, Platform, Audit Log)
- **`SysadminGuard`** — blocks non-admins from admin routes

Anthony sees the full app *plus* the Sysadmin nav section. Lily sees the app exactly as before. Neither loses anything.

## Files in this delta

```
src/
  App.jsx                              # OVERWRITE — new route structure
  lib/
    supabase.js                        # OVERWRITE — plugs in remember-me storage
    rememberMe.js                      # NEW — storage adapter
  pages/
    Landing.jsx                        # NEW — the one-pager
    Signup.jsx                         # NEW — trial signup form
    Login.jsx                          # OVERWRITE — adds remember-me checkbox
    sysadmin/
      Placeholder.jsx                  # NEW — shared placeholder for all 6 admin routes
  components/
    AppLayout.jsx                      # NEW — extracted layout wrapper
    Sidebar.jsx                        # OVERWRITE — /app/* paths + Sysadmin section
    BottomNav.jsx                      # OVERWRITE — /app/* paths
    SysadminGuard.jsx                  # NEW — role check
  styles.css                           # OVERWRITE (full file with landing + sysadmin styles)
```

## Deploy steps

### Step 1 — Push code, wait for Netlify "Published"

Overwrite the files above. Push to `main`. Wait for Netlify to build (~3 min).

### Step 2 — Configure long session TTL in Supabase

Go to Supabase Dashboard → **Authentication** → **Sessions** (in the left sidebar).

Find **"Refresh Token Reuse Interval"** or **"Session Length"**.

- Free tier default may be short (7 days). Set to the maximum allowed.
- If you upgrade to Supabase Pro later, you can set it to 6+ months.

Even if the dashboard cap is short, the **localStorage persistence still works** — the session is refreshed each time Lily opens the app, so she stays logged in as long as she uses it periodically. Only if she doesn't open the app for weeks would she need to sign in again.

### Step 3 — Hard-refresh, test

**Anthony's flow:**
1. Visit `https://lilyartisan.netlify.app/` → see landing page
2. Click "Log in" (top-right) → `/login` → sign in with anthony2211@gmail.com
3. Land on `/app` → see full app with **SYSADMIN** nav section at bottom of sidebar
4. Click any sysadmin item → see "Coming in Delta 3" placeholder
5. Close browser, reopen, type `lilyartisan.netlify.app/app` → still logged in

**Lily's flow:**
1. Visit landing → click "Log in" → sign in
2. Land on `/app` → same app, no sysadmin section
3. Try typing `/app/sysadmin/users` manually → redirected to `/app` (SysadminGuard blocks her)

**Signup flow (test with a throwaway email):**
1. Visit landing → click "Start Free Trial"
2. Fill form → submit → instant account, redirects to `/app`
3. Check Supabase Dashboard → Auth → Users → see new user
4. Check `profiles` table → new user has `subscription_status='trial'`, `subscription_end = now + 14 days`

## About the landing page copy

Everything on the landing page is currently hard-coded in `src/pages/Landing.jsx`. In Delta 3, the sysadmin Content page will let you edit:
- Headlines and body text
- Feature card content
- Pricing details
- FAQ items
- Footer info

For now, if you want to tweak copy urgently, edit `Landing.jsx` and redeploy.

## To-do list I owe you

1. **Screenshots** — send me clean shots of Dashboard, Recipes, Yield & Cost pages once app is polished. I'll swap them in for the placeholder mockup on the hero.
2. **Full Coming Soon editor** — you asked for admin control over the Coming Soon widget. That lives in Delta 3 (sysadmin Content page).
3. **Landing page editor** — same, Delta 3.

## About "Remember Me"

Two states:
- **Checked (default)** → session stored in `localStorage`. Survives browser close. Users stay logged in until they explicitly click Sign Out.
- **Unchecked** → session stored in `sessionStorage`. Dies when browser closes. Users log in fresh each time.

Implemented via a custom Supabase storage adapter (`src/lib/rememberMe.js`) that routes token writes to the appropriate storage based on the user's choice at login time.

## What's NOT in this delta (comes later)

- Actual sysadmin UIs (user list, invite form, etc.) — Delta 3
- Payment queue, invoice/receipt generation — Delta 4
- Read-only mode enforcement + subscription page — Delta 5
- Custom SMTP for professional-looking invite emails
- Actual screenshot embeds on landing

## Rollback

If something breaks post-deploy:
1. Revert the GitHub commit → Netlify redeploys previous version
2. Since Delta 2 doesn't touch database schema, no SQL rollback needed
3. Lily and Anthony's data is untouched

## What's next (Delta 3)

- Full sysadmin **Users** module — user list, roles, invite, reset password, extend dates, impersonate
- Sysadmin **Content** module — landing page editor, Coming Soon editor
- Sysadmin **Billing** config — business info, payment method (QR upload), invoice numbering
- Sysadmin **Auth** config — email template editor for invites
