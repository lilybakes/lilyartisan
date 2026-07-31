# Flour & Ink — 6th Style Variant

Adds the "Flour & Ink" single-ink minimalism direction as the 6th style variant. It applies to all 10 templates through the existing style-picker dropdown — nothing else changes.

## Files

```
src/
  lib/template-styles.js       # OVERWRITE — adds flour-ink to registry (6 variants now)
  styles.css                   # OVERWRITE (full file) — Jost added to fonts, comprehensive variant block appended
```

Two files.

## The design language, mapped to CSS

Per the handoff:

**One font — Jost** (weights 200 / 300 / 400 / 500) added to the Google Fonts import.

**Three colors, no accent, no gradients:**
| Role | Hex | Where used |
|---|---|---|
| Ink | `#1A1A18` | type, rules, dark grounds (Social Card, Cost Sheet suggested-price panel, Certificate seal) |
| Paper | `#FDFCFA` | default background for 8 of 10 sheets |
| Stone | `#CBBFAE` | Delivery Tag's full field |

Text greys are ink at reduced strength — body `#3A3733`, muted `#6A635B`, taglines. No new hues.

**Rules:** 1px hairlines at `rgba(26,26,24,0.3)` on paper, `rgba(253,252,250,0.4)` on ink, `rgba(26,26,24,0.35)` on stone. No thick rules anywhere.

**Radii:** only 0 or 50%. Every chip, pill, badge, card corner forced to `border-radius: 0`. Every logo, monogram, certificate seal forced to `border-radius: 50%`.

**Type ladder** — every tracked-caps block includes matching `padding-left` so centered text stays on optical centre:

| Weight | Tracking | Padding-left | Where |
|---|---|---|---|
| 200 | 0.24em | 0.24em | Recipe / product / cert titles (biggest) |
| 400 | 0.26em | 0.26em | Brand name |
| 400 | 0.30em | 0.30em | Facts, chips, table headers |
| 400 | 0.34em | 0.34em | Eyebrows, section titles |
| 300 | — | — | Sentences, descriptions, methods (line-height 1.7) |

Casing rule enforced: titles/names/facts uppercase; sentences remain sentence case.

## Per-sheet behavior

Since we apply this as CSS on shared JSX (not new components), some of the handoff's structural touches (numbered hairline circles for method steps, punch-hole on delivery tag, monogram initials as a fallback SVG) can't come from CSS alone. What DOES come through:

- **Recipe Card** — centred brand lockup, tracked-caps title, hairline rule between sections
- **Cost Sheet** — filled ink panel behind suggested price + margin (the one inversion), hairline outline on other stat panels
- **Care Card** — everything centre-aligned
- **Product Label** — tracked-caps ingredients, centred header
- **Menu Insert** — tracked-caps category eyebrows, sentence descriptions
- **Wholesale Price List** — hairline rules only, no fills, tracked-caps headers
- **Delivery Tag** — **full stone field** (`#CBBFAE`), ink text throughout, centered
- **Social Card** — **full ink field** (`#1A1A18`), paper text at 0.8 opacity, hairline-bordered price rectangle (no fill), monogram outline in paper
- **Recipe Binder** — hairline rules, stone-colored note fields where applicable
- **Certificate of Craft** — hairline frame, 6px circular ink seal, no ornaments

## What flour-ink DELIBERATELY doesn't do

Per the handoff's anti-patterns:

- No accent color (all other variants have one — this one has none)
- No gradients (Editorial, Kraft, Letterpress all have gradient headers/mastheads — this one is flat)
- No rounded corners between 0 and 50%
- No shadows anywhere (a global `box-shadow: none !important` override on this variant kills any inherited)
- No filled buttons or pills
- No emojis, no unicode dingbats

## Deploy

Overwrite the 2 files, push, hard-refresh. Style picker on any template now shows 6 options — "Flour & Ink" appears at the bottom. Selecting it should produce a visibly quieter, single-ink sheet that survives greyscale printing.

## Later touch-ups (not shipped, but noted)

- **Numbered hairline circles for method steps** — needs a small JSX addition to Classic Recipe Card and Binder to emit `<div className="tpl-method-circle">01</div>` per step; a couple lines of CSS renders them as circles with the final step reversed to filled ink
- **Circular monogram fallback when no logo** — 2-letter initials rendered in a hairline circle; the handoff's data contract expects `brand.monogram` — could compute in `BrandHeader.jsx` from `businessName.split(' ').map(w => w[0]).slice(0,2).join('')`
- **Delivery Tag punch-hole** — small `::before` circle at the top with the paper color, easy CSS-only add if desired
