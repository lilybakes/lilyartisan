# Personalization — Consolidated Redo

Ships EVERYTHING you need for the hero + avatar customization in one clean bundle. Deploy this over whatever state you're in and it'll work.

## Step-by-step (do these in order)

### 1. Push the code

Push all these files. Wait for Netlify "Published":

```
public/
  gallery/
    baker-01.png, chef-01.png, chef-02.png   ← 3 seeded images
src/
  App.jsx                                     ← routes for Personalize + Gallery + PersonalizationProvider wrap
  lib/
    personalization.jsx                       ← state context
    initials.js                               ← initials + brand color util
  components/
    HeroImage.jsx                             ← used by Dashboard
    UserAvatar.jsx                            ← used by Topbar
    Sidebar.jsx                               ← collapsible nav with Personalize + Gallery
    Topbar.jsx                                ← uses UserAvatar, dedupes header_links
  pages/
    Dashboard.jsx                             ← renders HeroImage
    Personalize.jsx                           ← user page
    sysadmin/
      Gallery.jsx                             ← sysadmin page
  styles.css                                  ← full file
supabase/
  delta-personalization.sql                   ← migration (REQUIRED — run this next)
  diagnose.sql                                ← diagnostic queries
```

### 2. Run the migration

Supabase → SQL Editor → paste **`supabase/delta-personalization.sql`** → Run.

**This is the piece most likely to have been missed.** It adds the columns, creates the gallery table, seeds the 3 images, and creates the update RPC.

### 3. Verify with the diagnostic

Paste **`supabase/diagnose.sql`** into SQL Editor → Run.

You should see:
- Q1: 3 rows (hero_mode, hero_url, avatar_url)
- Q2: 3 rows (chef-01, baker-01, chef-02)
- Q3: 1 row
- Q4: 2 rows, both with `hero_mode='default'`

If Q1 or Q2 or Q3 come back empty, the migration didn't run — go back to step 2.

### 4. Hard-refresh and find the pages

Cmd/Ctrl + Shift + R.

Log in as **Anthony**.

Look at the sidebar. It's now collapsible — three sections: **Main**, **You**, **Sysadmin**.

**To find the USER-side customization page:**
- Sidebar → click **You** section header if it's collapsed
- Click **Personalize** (has a palette icon)
- URL: `/app/personalize`

**To find the SYSADMIN "image bank" module:**
- Sidebar → click **Sysadmin** section header if it's collapsed
- Under the "Content & Design" sub-header, click **Gallery** (has a gallery icon)
- URL: `/app/sysadmin/gallery`

### 5. Test

On **Personalize** (`/app/personalize`):
- Live preview of your hero at the top
- Buttons: **Upload your own**, **Use default**, **Show blank**
- Below: 3 gallery items (the chef images) — click any to select
- Second section: your avatar + upload/remove buttons

On **Gallery** (`/app/sysadmin/gallery`):
- Grid of 3 seeded items (labeled "Static default")
- Top-right: **+ Upload new** button
- Per-item: label editor, ↑↓ reorder, hide/show, remove

## Common mistakes I've seen

- **Forgot to push the `public/gallery/` folder** → Personalize page shows broken images. Netlify only ships what's in the git repo.
- **Ran nav-fix SQL but not personalization SQL** → sidebar has "Personalize" and "Gallery" links, but clicking them either 404s or the page loads with errors.
- **Pushed some files but not App.jsx** → routes not registered, clicking sidebar links falls through to the dashboard or 404s.

The diagnostic in Step 3 catches all three.

## If you STILL can't find the pages after step 3 passes

Send me the browser dev tools console output from:
1. Loading `/app/personalize` directly (paste the URL)
2. Loading `/app/sysadmin/gallery` directly

Any red errors tell us what's happening.
