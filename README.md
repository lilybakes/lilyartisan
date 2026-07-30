# Hero Carousel v2 — Fix

Ditches the fragile external-screenshot approach for slides 2 and 4. Now they use **inline mock UIs** built from divs — a fake dashboard and a fake recipe cost breakdown, styled to look like real screenshots. Always renders, never breaks, no external files needed.

## What was wrong before

Slides 2 and 4 expected `hero-2.png` and `hero-4.png` in `public/hero/`. Those files didn't exist. My "graceful fallback" placeholder used `onError` handlers and inline styles — combined with the `data-bn-*` attribute selectors in `responsive.css`, the layout misbehaved on some browser widths.

## What's fixed

- **Slide 2** now shows a mock dashboard: greeting → 3 stat cards (Recipes / Avg Cost / Avg Margin) → cost breakdown panel with 4 ingredient bars
- **Slide 4** now shows a mock recipe: recipe name + suggested price → 4 ingredient rows (one highlighted with "↑ 8%" price change tag) → summary bar with cost per portion + margin
- All CSS moved into proper classes in `styles.css` — no more inline-style + attribute-selector fragility
- Photo slides (1, 3, 5) still use `/hero/hero-1.jpg`, `/hero/hero-3.jpg`, `/hero/hero-5.jpg` (already shipped as placeholders), with a graceful gradient fallback if the file is missing
- Responsive rules are cleaner and don't depend on data attributes

## Files

```
src/
  components/
    HeroCarousel.jsx        # OVERWRITE — v2 with inline mock UIs
  styles.css                # OVERWRITE (full file — new .hc-* classes at the end)
```

**Note:** you can also **delete `public/hero/hero-2.png` and `hero-4.png` from your git repo if they exist** — no longer needed. The 3 photo files (`hero-1.jpg`, `hero-3.jpg`, `hero-5.jpg`) are still used and should stay.

## Deploy

1. Push both files
2. Wait for Netlify Published
3. Hard-refresh `/`

Slide 4 will now show the recipe cost mock cleanly, no giant blurry image.

## Bonus: mock UIs help even after real screenshots exist

Later, if you want to swap in actual browser-window screenshots for slides 2 and 4, you can — just add `hero-2.png` / `hero-4.png` and update HeroCarousel to render `<img>` inside the `.hc-frame` instead of the mock components. But honestly, the mock UIs look sharper than photos (crisp text, retina-perfect at any zoom), so I'd keep them.
