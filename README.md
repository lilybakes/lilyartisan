# Brand Swap — The Margin b

New logo everywhere. Wordmark and badge hardcoded (no longer editable via Settings). Sub-label ("SYSADMIN" for admins, business name for users) stays dynamic.

## Files

```
public/                             ← ALL FLAT AT public/ ROOT
  favicon.ico
  favicon.svg
  favicon-16x16.png
  favicon-32x32.png
  favicon-48x48.png
  favicon-96x96.png
  apple-touch-icon.png
  android-chrome-192x192.png
  android-chrome-512x512.png
  maskable-icon-512x512.png
  safari-pinned-tab.svg
  og-mark-1200x630.png
  site.webmanifest
  logo-mark.svg
  logo-mark-mono-dark.svg
src/
  components/
    Logo.jsx                        ← NEW — the single source of the brand
    Sidebar.jsx                     ← OVERWRITE — uses <Logo/>, no more logo_data_url
  pages/
    Landing.jsx                     ← OVERWRITE — new header + footer wordmark
    Login.jsx                       ← OVERWRITE — new Logo above form
    Signup.jsx                      ← OVERWRITE — new Logo above form
  styles.css                        ← OVERWRITE — Plus Jakarta Sans, tweaked .brand padding
```

## Step 1 — Update index.html

Open `index.html` at the repo root. Inside the `<head>` tag, **replace any existing favicon/og/font links** with this block:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32">
<link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16">
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6C5CE7">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#6C5CE7">
<meta property="og:image" content="/og-mark-1200x630.png">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

The `preconnect` + Google Fonts link is the one thing that MUST get added — the app's font is now Plus Jakarta Sans. Without those links, the app falls back to Public Sans (still fine, but not the intended brand).

## Step 2 — Push all the files

Push `public/` and `src/` folders. Wait for Netlify "Published".

## Step 3 — Hard-refresh + tab cache-bust

- Cmd/Ctrl + Shift + R on the app
- Close and re-open the browser tab (favicons are aggressively cached)

## What you'll see

- **Sidebar top-left:** new gradient badge (violet→magenta, 73% ring), "BakerNomics" (Baker in near-black, Nomics in violet), "SYSADMIN" or your business name below in tiny grey uppercase
- **Landing page header** and **footer**: same wordmark, no badge on the login/signup cards is the ~56px version
- **Browser tab icon:** the new "b" mark
- **When you install as PWA / share to social:** proper icons and OG image

## What's locked down (per your ask)

- **Logo badge:** hardcoded in `Logo.jsx`. Cannot be replaced via Settings. `settings.logo_data_url` is now ignored.
- **"BakerNomics" wordmark:** hardcoded. Cannot be replaced via Settings. `settings.app_name` is now ignored.
- **Sub-label under wordmark:** stays dynamic — `SYSADMIN` for admins, `settings.business_name` uppercased for users. This is the only piece a user's Settings still affects.

## Notes

- The old `/assets/lily-mark-white.png` image is no longer referenced. You can leave it in the repo (harmless) or delete it.
- The `Settings` page may still show an "App Name" or "Logo" field. It doesn't break anything if the user edits them — the values are just no longer read anywhere in the UI. If you want to remove those fields from the Settings page too, that's a separate small pass.
