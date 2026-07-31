/**
 * The 5 style variants a template can be rendered in.
 *
 * All 5 use warm brown #8B4A2B as their single accent color — overriding the
 * user's app brand color inside the template preview. This is intentional per
 * the design handoff: the printed sheets are premium designed artifacts, not
 * app-branded ones. The user's brand color remains everywhere else in the app.
 *
 * The variant key becomes `variant-{key}` on the template's root element; CSS
 * in `styles.css` handles the visual switch.
 */
export const STYLE_VARIANTS = [
  {
    key: 'clean-modern',
    name: 'Clean Modern',
    description: 'White paper, Plus Jakarta Sans, JetBrains Mono numerals, hairline rules. Neutral and precise. Cheapest to print at scale.',
    isDefault: true,
    accent: '#8B4A2B',
  },
  {
    key: 'kraft',
    name: 'Rustic Kraft & Stamp',
    description: 'Warm kraft paper, Bitter slab serif + Karla. Dashed dividers and dotted leaders. Warmest option — farmers-market, gift-box, craft positioning.',
    accent: '#8B4A2B',
  },
  {
    key: 'letterpress',
    name: 'Vintage Letterpress',
    description: 'Cream paper, Playfair + Cormorant italic. Everything centered, fleuron ornaments, rule-with-label headers. Highest formality — patisserie, heritage, premium gifting.',
    accent: '#8B4A2B',
  },
  {
    key: 'editorial',
    name: 'Editorial Magazine',
    description: 'DM Serif Display + Archivo. Filled black masthead, thick 3px rules, zebra table rows, dark footer. Reads designed rather than generated.',
    accent: '#8B4A2B',
  },
  {
    key: 'minimal',
    name: 'Quiet Minimal',
    description: 'Manrope 300 + IBM Plex Mono. 0.5px hairlines, single accent dot, generous whitespace. Most app-native. Cheapest to print, most tolerant of variable data volume.',
    accent: '#8B4A2B',
  },
]

export function getStyleVariant(key) {
  return STYLE_VARIANTS.find(v => v.key === key) || STYLE_VARIANTS[0]
}

/** Default variant when nothing is picked yet */
export const DEFAULT_STYLE_KEY = 'clean-modern'
