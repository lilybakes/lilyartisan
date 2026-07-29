# Mobile UX overhaul

Single-file fix. Overwrite `src/styles.css`. Netlify redeploys. Desktop is untouched.

## What was wrong

Two compounding problems:

**1. Horizontal overflow → auto-zoom.** Wide content (tables with 5–8 columns, forms with inline `width:200`/`240`/etc. inputs) pushed the page wider than the phone's viewport. Mobile browsers respond to this by zooming out to fit — which is why Dashboard looked shrunk. Meanwhile, pages that fit naturally looked "zoomed in" by comparison. Not actually zoomed; the mismatch is visual.

**2. No mobile-first form/layout strategy.** The add-forms had fixed pixel widths on inputs from JSX inline styles. The BOM lines were rigid 5-column grids. Stat cards packed 4 abreast at desktop but had no graceful narrow-screen version.

## What's fixed

- **`html, body { overflow-x: hidden; max-width: 100vw }`** — safety net. Even if some future component overflows, the page won't push wider than the viewport.
- **Panels get `overflow-x: auto`** on mobile — wide tables scroll horizontally *inside the panel*, not on the page. Ingredient Master (8 cols) and other wide tables are usable now without shrinking the whole page.
- **Add-forms stack vertically** with full-width fields. The `!important` on `width` overrides the inline `width={200}` etc. from JSX so I don't have to touch every page.
- **BOM lines stack** into a card layout at ≤640px (name → qty → unit → status → cost → actions, each on its own row) instead of a squeezed 5-column grid.
- **Stat cards** are 2-across at ≤960px, then reshape into a horizontal row layout (icon + label + value) at ≤640px so they're a scannable list on phones.
- **Hero** loses the portrait art column on mobile (the halo composition doesn't work in a narrow strip) and the greeting scales down.
- **Topbar** condenses — hamburger, search input, bell, avatar. Extra header-link icons hide at very narrow to keep the essentials tappable.
- **Settings tabs** scroll horizontally if they don't fit rather than wrapping.
- **Header-link editor rows** stack vertically with full-width inputs.
- **Font size 16px on form inputs** at mobile — prevents iOS Safari's "auto-zoom on focus" behavior.

## Verify your viewport meta

If mobile *still* looks zoomed after the CSS deploys, the fix is in `index.html`. It needs this line inside `<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

The default Vite `index.html` has this already, but worth double-checking. If it's missing or has `user-scalable=no` or a fixed width, mobile browsers apply their own default (usually 980px, hence the zoom-out).

## Breakpoints (for future reference)

- **>960px** — desktop as-is
- **≤960px** — sidebar → drawer, stat cards 2-across, form stacking, tables scroll in panels
- **≤640px** — stat cards horizontal layout, BOM lines stack, tighter hero
- **≤420px** — extra tight (small phones)

Everything above 960px is untouched. Nothing in your desktop experience changes.

## Test after deploying

Load each page on your phone (or resize a desktop browser narrow):

1. **Dashboard** — hero readable, 4 stat cards become 2 columns then stack, recipe overview table scrolls horizontally inside its panel
2. **Ingredients** — 8-column table scrolls inside panel; add-form is a vertical stack with full-width inputs
3. **Recipes** — same pattern
4. **Recipe BOM** — line items become vertical cards, easy to scan
5. **Yield & Cost** — 3 metric cards stack; ingredient breakdown table scrolls
6. **Pricing / Inventory** — same table-in-panel-scroll pattern; Inventory row inputs are usable
7. **Settings** — tabs scroll if narrow; General/Header Links forms are stacked vertical
