/**
 * The 7 style variants a template can be rendered in.
 *
 * Every variant overrides `--brand` with `!important` and applies substantial
 * per-variant type + color + rule treatment. CSS in `styles.css` handles the
 * actual visual switch.
 */
export const STYLE_VARIANTS = [
  {
    key: 'bko',
    name: 'BakeOnomics Clean',
    description: 'The default BakeOnomics theme. Purple app-brand accent (#7367F0) on white paper, Plus Jakarta Sans body + JetBrains Mono numerals, thin gray rules with lavender allergen wash. Small square logo box, solid 2.5px accent rule under every header. Designed to look like a finished printed sheet in the app\'s own visual language.',
    isDefault: true,
    accent: '#7367F0',
  },
  {
    key: 'crisp',
    name: 'Crisp',
    description: 'Polished modern layout with warm brown accents on white. Plus Jakarta Sans body + JetBrains Mono numerals, thin gray rules with brown accent overlays, cream-background allergen notices, small square DC-style logo box. Designed to look like a finished printed sheet.',
    accent: '#8B4A2B',
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
    description: 'Playfair Display + Archivo, cream paper, rust accent (#8E4527). Signature italic-accent word within titles, full-height rust side bands, filled rust mastheads and category tags, thick 3px black rules, zebra table rows, WHERE THE MONEY GOES bar chart on the cost breakdown. Reads designed rather than generated.',
    accent: '#8E4527',
  },
  {
    key: 'minimal',
    name: 'Quiet Minimal',
    description: 'Warm off-white paper, Manrope Light titles, JetBrains Mono for every meta label / number / date. Tiny rust bullet dot before section titles, hairline dividers, generous whitespace. No logo bounding box — just DC as mono text. Wide-spaced qty units. Most restrained set.',
    accent: '#A5502D',
  },
  {
    key: 'verdant',
    name: 'Verdant',
    description: 'Deep forest green on cream. DM Serif Display titles + Manrope body. Rounded mint pill chips for meta, numbered method chips with the final step highlighted in dark green, soft decorative circles floating at page edges, dark-green filled headers on Recipe Card and Product Label. Nature-inspired, warm, confident.',
    accent: '#1E4A38',
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
export const DEFAULT_STYLE_KEY = 'bko'
