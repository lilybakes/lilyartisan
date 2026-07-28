# Lily Artisan — Mobile hamburger drawer

Turns the sidebar into an off-canvas drawer at narrow widths.

## What changes

- **Desktop (>960px):** identical to today — sticky sidebar column on the left, no hamburger.
- **Mobile (≤960px):** sidebar is hidden by default and slides in from the left when the hamburger is tapped. Backdrop overlay to close. Auto-closes on route change and on Esc.
- **Very narrow (≤520px):** stat cards stack to one column, and configurable header-link icons hide from the topbar (bell + avatar stay).

## Files

```
src/
  App.jsx                        (adds navOpen state, passes it to Sidebar + Topbar)
  components/
    Sidebar.jsx                  (accepts open/onClose props, renders backdrop)
    Topbar.jsx                   (adds hamburger button)
  styles.css                     (drawer transform + backdrop + hamburger, plus responsive tuning)
```

## Apply

1. GitHub → overwrite the four files above at their paths.
2. Netlify auto-deploys. Hard-refresh.

No Supabase changes. No new dependencies. State is lifted to `App.jsx`; no context needed.

## Interaction details

- **Open drawer:** tap hamburger (top-left of topbar, visible only on mobile).
- **Close drawer:** tap backdrop, tap any nav item (auto-close on route change), press Esc, or swipe/tap outside.
- **Body scroll** is locked while the drawer is open, so tapping outside doesn't accidentally scroll the page.
- **Drawer width** is 280px (comfortable one-handed thumb reach). The brand tile and every nav row already fit within that.
- **Transition:** 0.28s ease — snappy enough to feel responsive, slow enough to signal what's happening.

## Small tuning bonuses I threw in

While reworking the responsive block:

- Hero card padding reduces to 24px on very narrow (was 32×36) so the greeting doesn't feel cramped.
- Topbar horizontal margins shrink from 28px to 14px on mobile.
- Panel padding reduces to 18×16 on mobile to give tables more room.
- Search icon hides on narrow (input stays) so the search box has room.
- Settings tabs wrap if they don't fit.

Nothing that changes desktop behavior.
