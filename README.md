# Templates Page — Two-Column Layout

Restructures the Templates page into a sidebar-left / main-right layout. Removes the "Set up your brand first" nudge.

## Files

```
src/
  pages/Templates.jsx    # OVERWRITE — restructured JSX, no nudge, sidebar + main
  styles.css             # OVERWRITE (full file) — new layout classes, single-column list
```

Two files.

## What the layout looks like now

```
┌─────────────────┬─────────────────────────────────────┐
│  Templates      │  Classic Recipe Card                │
│  ● 10           │  Generate personalized recipe...    │
│  ─────────────  │  ─────────────────────────────────  │
│  📄 Classic     │  ┌───────────────────────────────┐  │
│     A5          │  │ RECIPE   STYLE     [Print]    │  │
│  📊 Cost        │  │ [▼]      [▼]                  │  │
│     A4          │  └───────────────────────────────┘  │
│  📇 Care        │                                     │
│     A6          │  Style description text here...    │
│  🏷 Label       │                                     │
│     A7          │  ┌───────────────────────────────┐  │
│  📋 Menu        │  │                               │  │
│     A5          │  │      TEMPLATE PREVIEW         │  │
│  📑 Wholesale   │  │                               │  │
│     A4          │  │                               │  │
│  📦 Delivery    │  │                               │  │
│     A7          │  └───────────────────────────────┘  │
│  📱 Social      │                                     │
│     1:1         │                                     │
│  📖 Binder      │                                     │
│     A4          │                                     │
│  🎖 Certificate │                                     │
│     A4          │                                     │
└─────────────────┴─────────────────────────────────────┘
```

## Layout details

**Left sidebar** — 320px wide, sticky-positioned (stays visible on scroll), max-height = viewport height, internally scrolls if needed. Contains just the 10 template items in a single vertical list. Header row shows "TEMPLATES" label + a green "10" pill for the ready count.

**Right main** — flexes to fill remaining width. Contains:
- Header (shows the currently-selected template's name as the h3, so it's clear which template you're configuring)
- Combined controls panel (Recipe · Style · Print button in one horizontal strip on a soft grey background)
- Style description hint (small italic subtitle explaining what the currently-picked style looks like)
- Template preview canvas

**Removed:**
- "Set up your brand first" nudge banner
- The `tpl-controls-row` (recipe dropdown + status counter — status now shown as small pill next to "Templates" title in sidebar)
- The separate `tpl-actions-row` (print button + hint — print now integrated into controls panel)
- The separate `tpl-style-row` (style dropdown — now inline with recipe dropdown)
- `CheckBadge` component (was only used by the removed nudge)

## Responsive

- **≥900px** — two-column layout as above
- **<900px** — sidebar stacks on top of main, template list becomes a 2-column grid
- **<520px** — everything single-column

## Deploy

Overwrite the 2 files, push, hard-refresh. Templates page now uses the whole width efficiently — sidebar for browsing, main for configuring + previewing.
