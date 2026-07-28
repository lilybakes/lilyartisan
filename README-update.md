# Lily Artisan — Sidebar icon upgrade (5D duotone)

Delta drop-in matching the new sidebar spec: unified violet duotone icons on lavender chips, one family for the whole nav.

## What changes

- **All sidebar icons redrawn** in a single duotone family: 24×24 optical box, `#5A4FD1` stroke at 1.8, one identifying region flood-filled `#C9C3FA`.
- **Chip is bigger and lavender:** 30×30 (was 28×28), 9px radius, `#EEECFE` background. Every row's chip is now the same color — the seven per-row tints (info cyan, pink, warn orange, etc.) are gone. The whole nav reads as one family so the color budget stays with the brand tile and hero.
- **Active row:** unchanged behavior (violet gradient background, white text, boosted weight), but the glyph inverts cleanly — plain white stroke, all duotone fills drop to transparent. No muddy overlap of lavender on gradient.
- **Hover:** row background `#F5F5F9`, label darkens to `#2F3349`. 150ms ease.
- **Icons in the set:** Dashboard (four panes, active-only so no duotone needed), Ingredients (mixing bowl), Recipes (open book, left page filled), Recipe BOM (stacked cake with candle), Yield & Cost (yield dial with measured quadrant filled), Pricing (price tag with eyelet), Inventory (crate with right face filled). Settings uses the same recipe (gear hub filled).

## How the duotone works technically

The old icons had inline `stroke="currentColor"` and no fill. The new icons use CSS classes on each shape:

- `.s` → stroke shape (violet in rest, white in active)
- `.f` → filled key shape (lavender in rest, transparent in active)
- `.fe` → filled eyelet, only used on the price-tag icon (white with violet stroke in rest, transparent with white stroke in active)

All color and state rules live in `styles.css`. Adding new icons later is just: draw one filled shape as the "identifying region" and mark it `.f`, everything else `.s`, and you're done.

## Files

```
src/
  lib/
    nav-icons.jsx    (NEW — 8 duotone glyphs + <NavIcon/> component)
  components/
    Sidebar.jsx      (imports NavIcon, removes data-color attrs)
  styles.css         (updated chip + nav-item rules, adds duotone color CSS)
```

## Apply

1. **GitHub** — add the new `src/lib/nav-icons.jsx`, overwrite `src/components/Sidebar.jsx` and `src/styles.css`.
2. **Netlify auto-deploys.** Hard-refresh.

No Supabase changes. Nothing else touched. `src/lib/icons.jsx` stays as-is — the general icons (search, bell, edit, trash, camera, and the ~25 header-link picker icons) all still work.

## What you'll see

Sidebar looks calmer and more consistent — every nav item has the same lavender chip. The Recipe BOM, Yield & Cost, Pricing, and Inventory icons now have proper metaphors (stacked cake, dial, price tag, crate) instead of generic outline shapes. The active row still stands out with the violet gradient, and the icon inside inverts to pure white so it never fights the background.
