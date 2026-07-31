# Templates Picker — Compact Icon List

Replaces the big preview-card grid with a compact 2-column icon list. Cuts the picker's vertical footprint by roughly 75%.

## Files

```
src/
  pages/Templates.jsx     # OVERWRITE — big PreviewIllustration → small TemplateIcon, tpl-grid → tpl-list
  styles.css              # OVERWRITE (full file) — tpl-card CSS replaced with tpl-item compact CSS
```

Two files.

## What changed

**Before** — 5-column grid of large cards. Each card had a 3:2 aspect-ratio gradient preview thumbnail (~120px tall) containing an abstract UI illustration, then the name and description underneath. On desktop, the picker took ~280px of vertical space just to show 10 templates.

**After** — 2-column list. Each row is one horizontal item: 38×38 gradient icon chip on the left (with a small monochrome line-icon inside), template name + size badge inline, description one line below. Total picker height ≈ 260px for all 10, but crucially only ~40px per row instead of ~180px per card.

## Layout details

- **Icon chip:** 38×38 rounded square with the template's gradient background and a white line icon (18px SVG) inside. Icons per template:
  - Classic Card: document with lines
  - Cost Breakdown: bar chart
  - Care & Storage: bulleted list
  - Product Label: tag shape
  - Menu Insert: 2×2 grid
  - Wholesale: table rows
  - Delivery Tag: tag with punch dot
  - Social Media: framed square with lens
  - Recipe Binder: (uses card-lines icon)
  - Certificate: seal with ribbon
- **Right side:** name (bold) + size badge (inline pill: A5, A4, A6, A7, 1:1), then description clipped to 1 line
- **Active state:** purple border + soft violet background + subtle shadow
- **Responsive:** 2 columns on desktop/tablet, 1 column below 720px

## Interactions preserved

- Click a row to select
- All 10 templates still ready and functional
- Style picker dropdown still appears below when a template is selected
- Print button unchanged
- Description shows on hover as tooltip via `title` attribute (in case the 1-line clip cuts something)

Deploy: overwrite the 2 files, push, hard-refresh.
