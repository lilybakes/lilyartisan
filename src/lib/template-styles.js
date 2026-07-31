/**
 * The 5 style variants a template can be rendered in.
 *
 * Each template supports all 5 via a `styleVariant` prop that becomes a
 * `variant-{key}` class on the template's root element. CSS in styles.css
 * carries the actual aesthetic (fonts, colors, rules, ornaments).
 *
 * The variant key is what gets persisted per template selection in the
 * Templates page state.
 */
export const STYLE_VARIANTS = [
  {
    key: 'clean-modern',
    name: 'Clean Modern',
    description: 'Hairline rules, humanist sans, mono numerals. Neutral and precise. Cheapest to print at scale.',
    isDefault: true,
    accent: '#8B4A2B',
  },
  {
    key: 'kraft',
    name: 'Rustic Kraft & Stamp',
    description: 'Warm kraft paper, slab serif, hand-stamped rubber-stamp feel. Warmest option — farmers-market, gift-box, craft.',
    accent: '#8B4A2B',
  },
  {
    key: 'letterpress',
    name: 'Vintage Letterpress',
    description: 'Centered didone, small caps, fleuron ornaments. Highest formality — patisserie, heritage, premium gifting.',
    accent: '#8B4A2B',
  },
  {
    key: 'editorial',
    name: 'Editorial Magazine',
    description: 'Display serif, asymmetric grid, filled accent spine/masthead. Reads designed rather than generated.',
    accent: '#8B4A2B',
  },
  {
    key: 'minimal',
    name: 'Quiet Minimal',
    description: 'Hairline 0.5px rules, light weight, a single accent dot. Most app-native. Cheapest to print, most tolerant of variable data volume.',
    accent: '#8B4A2B',
  },
]

export function getStyleVariant(key) {
  return STYLE_VARIANTS.find(v => v.key === key) || STYLE_VARIANTS[0]
}

/** Default variant key when none is selected for a template */
export const DEFAULT_STYLE_KEY = 'clean-modern'
