/**
 * The 6 style variants a template can be rendered in.
 *
 * The first is `default` — the current app-brand clean-purple aesthetic that
 * every template ships with. It's what you see when no override is applied.
 *
 * The other 5 are the iterations from the design handoff, each with a distinct
 * font pairing, palette, and rule treatment. All 5 use warm brown `#8B4A2B`
 * as their accent instead of the user's brand color.
 *
 * The variant key becomes `variant-{key}` on the template's root element; CSS
 * in `styles.css` handles the visual switch.
 */
export const STYLE_VARIANTS = [
  {
    key: 'default',
    name: 'Default (App Brand)',
    description: 'Clean minimalist look using your app brand color. The version you have been using.',
    isDefault: true,
  },
  {
    key: 'clean-modern',
    name: 'Clean Modern',
    description: 'Plus Jakarta Sans + JetBrains Mono numerals. Warm brown accent, hairline rules, humanist and neutral. Cheapest to print at scale.',
    accent: '#8B4A2B',
  },
  {
    key: 'kraft',
    name: 'Rustic Kraft & Stamp',
    description: 'Warm kraft paper, Bitter slab serif + Karla. Dashed dividers, rubber-stamp seals. Farmers-market, gift-box, craft positioning.',
    accent: '#8B4A2B',
  },
  {
    key: 'letterpress',
    name: 'Vintage Letterpress',
    description: 'Playfair + Cormorant on cream paper. Everything centered, fleuron ornaments, small-caps meta. Highest formality — patisserie, heritage, premium gifting.',
    accent: '#8B4A2B',
  },
  {
    key: 'editorial',
    name: 'Editorial Magazine',
    description: 'DM Serif Display + Archivo. Heavy black rules, filled accent masthead, mixed roman + italic. Reads designed rather than generated.',
    accent: '#8B4A2B',
  },
  {
    key: 'minimal',
    name: 'Quiet Minimal',
    description: 'Manrope 300 + IBM Plex Mono. 0.5px hairlines, a single accent dot. Most app-native. Cheapest to print, most tolerant of variable data volume.',
    accent: '#8B4A2B',
  },
]

export function getStyleVariant(key) {
  return STYLE_VARIANTS.find(v => v.key === key) || STYLE_VARIANTS[0]
}

/** Default variant key when a template hasn't had a style picked yet */
export const DEFAULT_STYLE_KEY = 'default'
