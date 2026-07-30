# Hero Carousel

Replaces the current single hero on the Landing page with a 5-slide autoplay carousel per the CAROUSEL-CONTEXT spec you sent.

## Files

```
public/
  hero/
    hero-1.jpg                # placeholder (baker with bread) — swap for real
    hero-3.jpg                # placeholder (chef in hat)      — swap for real
    hero-5.jpg                # placeholder (chef blue shirt)  — swap for real
    hero-2.png                # (missing — will show placeholder frame until you drop this in)
    hero-4.png                # (missing — will show placeholder frame until you drop this in)
src/
  components/
    HeroCarousel.jsx          # NEW
  pages/
    Landing.jsx               # OVERWRITE — hero section replaced with <HeroCarousel/>
  styles.css                  # OVERWRITE (full file, responsive.css appended)
```

## Deploy

1. Push all files. `public/hero/` folder MUST be pushed to git.
2. Wait for Netlify Published.
3. Hard-refresh `/`.

You'll see the 5-slide carousel with:
- Slides 1, 3, 5 already showing your baker/chef photos
- Slides 2, 4 showing a "Screenshot — drop the file in public/hero/" placeholder frame
- Full autoplay, keyboard navigation, dots + counter + progress bar, hover-to-pause

## Adding the real images

The placeholders for 1, 3, 5 are your existing gallery images. For the real spec-compliant hero, you want:

| File | Type | What it should show |
| --- | --- | --- |
| `hero-1.jpg` | Photo, ≥2400px wide | Hands shaping dough, overhead. Right two-thirds calm. |
| `hero-2.png` | Screenshot, 1440×900 @2x | Your BakerNomics dashboard — sidebar visible, no browser chrome, real numbers (no RM 0.00 rows) |
| `hero-3.jpg` | Photo | Box handover at the counter. Subject right of centre. |
| `hero-4.png` | Screenshot | One recipe's cost breakdown, same capture settings |
| `hero-5.jpg` | Photo | Baker portrait at the counter, centred, shop soft behind |

Just drop them in `public/hero/` and push. The Frame component detects when a screenshot is missing and shows the placeholder — no code changes needed once you add real files.

## Features live in the component

- **Autoplay** — 6s per slide, loops
- **Pause on hover** — mouse into the carousel, autoplay stops
- **Keyboard** — ← / → step slides
- **Progress bar** — 3px violet along the bottom, fills over 6s
- **Dots + counter** — click any dot to jump, right side shows "n / 5"
- **Arrows** — round buttons at 22px inset, both sides (hidden below 1024px)
- **Ken Burns** — photo slides slowly zoom 1.04 → 1.12 over 14–18s
- **Reduced motion** — `prefers-reduced-motion: reduce` disables autoplay + zoom
- **Responsive** — stacks under 1024px, hides arrows, shrinks type

## Copy is hardcoded

Per the spec, the 5 slides use exact marketing copy. That's baked into `HeroCarousel.jsx`. Editing via the sysadmin Content editor won't affect the carousel — the Content editor still works for Features, Pricing, FAQ, Final CTA, and Coming Soon (those sections are unchanged below the carousel).

If you want editable carousel slides in a future delta, we can wire them to `content_blocks`. Not in this delta.

## What got removed from Landing

The old hero section is gone — the "Welcome" gradient with the fake dashboard preview window. Everything else on the page stays: header, Features grid, Pricing card, FAQ, Final CTA, Footer.

## Note about routes

CTA buttons on the slides:
- **Start 14-day Free Trial** → `/signup` (trial)
- **Sign in** → `/login`
- **Price my recipes free** → `/signup`
- **See a 90-sec tour** → `#features` anchor (until you have a tour page)

If you'd rather all "Start Free Trial" buttons point at `/checkout` (paid) instead of `/signup` (trial), just edit `HeroCarousel.jsx` — search for `to="/signup"` and change to `to="/checkout"`.
