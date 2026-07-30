# BakerNomics favicon set

Drop the contents of this folder into your app's `public/` root (flat, not in a subfolder),
replacing the old files. Then put this in `<head>`:

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
```

## Files

| File | Use |
| --- | --- |
| favicon.ico | Legacy + bookmarks (16/32/48 bundled) |
| favicon.svg | Modern browsers, scales infinitely |
| favicon-16/32/48/96.png | Raster fallbacks |
| apple-touch-icon.png | iOS home screen, 180px, full-bleed gradient |
| android-chrome-192/512.png | Android / PWA |
| maskable-icon-512x512.png | Android adaptive icon (62% safe zone) |
| safari-pinned-tab.svg | Monochrome pinned tab |
| logo-mark.svg / logo-mark-mono-dark.svg | In-app badge (sidebar, 40px) |
| og-mark-1200x630.png | Social share card |
| site.webmanifest | PWA manifest — merge with yours if you already have one |

## Notes

- Brand gradient is `#C026D3 → #7C3AED` at 135°. Theme colour is `#6C5CE7`.
- The 16px and 32px rasters use a bolder stem and drop the dial track so the mark stays legible.
- The dial is always 73% of the circle, starting at 12 o'clock. Don't animate or data-bind it.
- Cache-bust after deploy: browsers hold favicons aggressively (hard refresh or append `?v=2`).
