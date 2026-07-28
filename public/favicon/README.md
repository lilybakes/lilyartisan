# BakerNomics — favicon set (option 2A)

Primary indigo #7367F0 circle, white brush "L" from the Lily Ong Artisan logo.
Matches the app's primary colour, so tab and UI read as one product.

## Files
| File | Use |
| --- | --- |
| favicon.ico | legacy browsers / bookmarks (16, 32, 48 frames) |
| favicon-16x16.png, favicon-32x32.png, favicon-48x48.png | browser tabs |
| favicon-96x96.png | Windows / high-DPI tabs |
| favicon-192x192.png, favicon-512x512.png | PWA / Android |
| maskable-512x512.png | Android adaptive (full-bleed, safe-zone padded) |
| apple-touch-icon.png | iOS home screen (180px, square — iOS applies its own mask) |
| favicon-16x16-light.png, favicon-32x32-light.png | inverted (white circle, indigo L) — optional, for dark browser UI |
| site.webmanifest | PWA manifest, theme colour #7367F0 |

The indigo circle holds up on both light and dark tab bars, so the light variants are optional.

## Install
Copy this folder to your web root as `/favicon`, then in `<head>`:

```html
<link rel="icon" href="/favicon/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png">
<link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png">
<link rel="manifest" href="/favicon/site.webmanifest">
<meta name="theme-color" content="#7367F0">
```

Optional dark-mode swap:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" media="(prefers-color-scheme: light)">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32-light.png" media="(prefers-color-scheme: dark)">
```

## Source
Mark: `assets/mark-L-bold-white.png` — the "L" from the supplied logo, stroke thickened ~7%, recoloured white, transparent background. The L occupies 59.4% of the circle diameter; keep that ratio if you regenerate at other sizes.
