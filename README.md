# Mobile design pass — grounded in research

This delta applies established mobile UX principles to make the app feel native on phones while keeping the desktop experience exactly as it is.

## What the research says (and what I applied)

**1. Bottom tab bar > hamburger menu for primary nav**
NN/g, UXPin, and every major UX outlet in 2025-2026 now recommend bottom tab bars for dashboards/productivity apps with 3–5 primary destinations. Spotify's move away from the hamburger correlated with a documented engagement jump. Hidden nav has 2-3× lower feature discoverability.

**Applied:** New `BottomNav` component. Four primary tabs at the bottom of every screen on mobile — **Home, Recipes, Ingredients, BOM** — plus a "More" tab that opens the drawer with everything else (Yield & Cost, Pricing, Inventory, Settings). Hamburger stays in the topbar as a redundant path to the same drawer for users who look up first.

**2. Data tables → cards on mobile**
Horizontal scroll is a fallback; card view is the recommended default. Same semantic HTML, transformed with CSS.

**Applied:** Every data table now has `className="responsive-table"`. On ≤640px, CSS transforms them into stacked cards. Each `<td>` becomes a labeled row using `data-label` attributes. The first `<td>` (name + photo) is the card header; the last (actions) becomes a footer with buttons.

**3. Touch targets ≥ 44×44px, font-size 16px on inputs**
Apple HIG 44px, Material 48px. Sub-16px inputs trigger Safari's auto-zoom-on-focus, which is a UX killer.

**Applied:** All form inputs on mobile jump to `font-size: 16px` and `padding: 12px 14px`. Bottom nav items are 48px+ tall. Buttons are full-width on mobile.

**4. Safe area insets (`viewport-fit=cover` + `env(safe-area-inset-*)`)**
For iOS notches, Dynamic Island, home indicator, and rounded corners.

**Applied:** New `index.html` with `viewport-fit=cover` and PWA meta tags. All fixed-position elements (topbar, bottom nav, sidebar drawer, lightbox close button) use `env(safe-area-inset-*)` so nothing hides under the home indicator or notch.

**5. Content padding accounts for bottom nav**
Standard oversight in mobile web apps.

**Applied:** `.content` gets `padding-bottom: calc(76px + env(safe-area-inset-bottom))` so scrolling to the last row shows it fully above the nav.

**6. PWA meta tags for install-quality feel**
Even without a service worker, these tags give the app a polished mobile identity.

**Applied:** `theme-color`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-title`, `mobile-web-app-capable`, `format-detection`.

## Files

```
index.html                      (PWA meta tags, viewport-fit=cover)
src/
  App.jsx                       (adds <BottomNav/>)
  components/
    BottomNav.jsx               (NEW — 5-tab bottom nav)
  pages/
    Dashboard.jsx               (data-label on Recipe Overview table)
    Ingredients.jsx             (data-label on all cells, 'editing' class in edit mode)
    Recipes.jsx                 (same)
    Costing.jsx                 (data-label on breakdown table)
    Pricing.jsx                 (data-label)
    Inventory.jsx               (data-label)
    Bom.jsx                     (className='editing' in edit mode)
  styles.css                    (full mobile pass — see structure below)
```

## Apply

Overwrite all listed files. `index.html` sits at your repo root, not in `src/`.

Netlify auto-deploys. Hard-refresh on your phone.

**No Supabase changes. No new dependencies. `main.jsx` is untouched — `BrowserRouter` stays where it lives.**

## Layout on mobile — what it feels like now

```
┌─────────────────────────────────┐
│  ≡  🔍 Search…       🔔  👤     │  ← topbar (safe-area top)
├─────────────────────────────────┤
│                                 │
│         Page content            │
│         (cards, not tables)     │
│                                 │
│                                 │
├─────────────────────────────────┤
│  🏠  📖  🧊  🧾  ≡              │  ← bottom nav (safe-area bottom)
│ Home Recipes Ingr. BOM More     │
└─────────────────────────────────┘
```

- **Tap a tab** → navigates (route change)
- **Tap "More"** → opens sidebar drawer with all secondary pages (Yield & Cost, Pricing, Inventory, Settings)
- **Tap hamburger** in topbar → same drawer
- **Tap a card row** on Ingredients/Recipes → see all fields laid out; tap Edit to modify inline (the card expands into a form with labels above each input)

## Structure of styles.css (for your reference)

Reading top-to-bottom in the file:

1. Design tokens (`:root { --... }`)
2. Base reset + safety net (`html, body { overflow-x: hidden }`)
3. Desktop layout — sidebar, topbar, hero, panels, tables, forms, buttons, pills, everything
4. `@media (max-width: 960px)` — sidebar becomes drawer, bottom nav appears, hero and stat cards resize
5. `@media (max-width: 640px)` — **tables transform to cards** (the big change), BOM lines stack, hero compacts
6. `@media (max-width: 420px)` — small-phone tweaks

Desktop styles (everything before the first `@media(max-width:960px)` block) are byte-for-byte identical to what you have now.

## What's intentionally NOT in this delta

Things that would be nice but are scope-heavy for this pass:

- **Full bottom-sheet add form.** Current form still stacks vertically at the bottom of pages — it works cleanly, just not a modal sheet.
- **Swipe-to-delete gestures.** Would need a small library or custom touch handlers.
- **Pull-to-refresh.** Same reason.
- **Service worker + offline PWA.** The meta tags are there but no SW yet.

Any of those can be a follow-up.
