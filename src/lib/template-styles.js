/**
 * The 6 style variants a template can be rendered in.
 *
 * Every variant overrides `--brand` with `!important` and applies substantial
 * per-variant type + color + rule treatment. CSS in `styles.css` handles the
 * actual visual switch.
 */
export const STYLE_VARIANTS = [
  {
    key: 'clean-modern',
    name: 'Clean Modern',
    description: 'White paper, Plus Jakarta Sans + JetBrains Mono numerals, hairline rules, violet app-brand accent. Neutral and precise.',
    isDefault: true,
    accent: '#6C5CE7',
  },
  {
    key: 'kraft',
    name: 'Rustic Kraft & Stamp',
    description: 'Warm kraft paper, Bitter slab serif + Karla. Dashed dividers, dotted leaders, warm brown accent. Farmers-market / gift-box positioning.',
    accent: '#8B4A2B',
  },
  {
    key: 'letterpress',
    name: 'Vintage Letterpress',
    description: 'Cream paper, Playfair + Cormorant italic, deep burgundy accent. Everything centered, fleuron ornaments, rule-with-label headers. Highest formality.',
    accent: '#7A2E3B',
  },
  {
    key: 'editorial',
    name: 'Editorial Magazine',
    description: 'DM Serif Display + Archivo. Filled black masthead, thick 3px rules, zebra rows, dark footer. Cherry-red social pop. Reads designed rather than generated.',
    accent: '#1A1A18',
  },
  {
    key: 'minimal',
    name: 'Quiet Minimal',
    description: 'Manrope 300 + IBM Plex Mono. 0.5px hairlines, slate accent dot, generous whitespace. Most app-native. Cheapest to print.',
    accent: '#5B6874',
  },
  {
    key: 'flour-ink',
    name: 'Flour & Ink',
    description: 'Single-ink minimalism. Jost only (weights 200–500), three colors (ink · paper · stone), tracked capitals, 1px hairlines, no accent, no gradients. Delivery tag on stone; social card on ink. Reads as a print artifact.',
    accent: '#1A1A18',
  },
]

export function getStyleVariant(key) {
  return STYLE_VARIANTS.find(v => v.key === key) || STYLE_VARIANTS[0]
}

/** Default variant when nothing is picked yet */
export const DEFAULT_STYLE_KEY = 'clean-modern'
