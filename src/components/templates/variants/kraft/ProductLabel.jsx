import { KraftBrandLockup, KraftFooter } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * FIELD MAPPING:
 *   Ingredients sentence = recipe.label_ingredients_text
 *                        ↓ ingredient names from recipe.lines (joined)
 *                        ↓ hard fallback
 *   Allergen sentence    = recipe.label_allergens_text
 *                        ↓ recipe.allergens_text
 *                        ↓ brand.default_allergen_notice
 *                        ↓ hard fallback
 */
export function KraftProductLabel({ recipe = {}, brand = {} }) {
  const lines = recipe.lines || []
  const city  = brand.city || extractCityFromAddress(brand.address) || 'Ipoh'

  const ingredientsSentence =
    (recipe.label_ingredients_text && recipe.label_ingredients_text.trim()) ||
    (lines.length > 0 ? lines.map(l => l.ingredient_name).filter(Boolean).join(', ') + '.' : 'See recipe.')

  const allergensText =
    recipe.label_allergens_text ||
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    'See label for allergens.'

  const eyebrowText = pickEyebrow(recipe.category)

  return (
    <div className="tpl k-tpl k-label printable">
      <div className="k-label-top">
        <KraftBrandLockup brand={brand} size="sm" layout="row"/>
        <div className="k-label-city">{city}</div>
      </div>

      <div className="k-label-band">
        <div className="k-label-band-eyebrow">{eyebrowText}</div>
        <h2 className="k-label-band-name">{recipe.name || 'Product name'}</h2>
      </div>

      <div className="k-label-section-title">Ingredients</div>
      <div className="k-label-ingredients">{ingredientsSentence}</div>

      <div className="k-label-allergen">
        <div className="k-label-section-title" style={{ marginBottom: '2mm' }}>Allergen notice</div>
        <div className="k-label-allergen-body">{allergensText}</div>
      </div>

      <KraftFooter brand={brand} layout="split" showSocials={false}/>
    </div>
  )
}

/** Pull last comma-separated token from an address as a rough city guess. */
function extractCityFromAddress(addr) {
  if (!addr) return null
  const tokens = addr.split(',').map(s => s.trim()).filter(Boolean)
  return tokens[tokens.length - 1] || null
}

function pickEyebrow(category) {
  switch ((category || '').toLowerCase()) {
    case 'bread':   return 'Baked fresh'
    case 'cookies': return 'Small batch'
    case 'cakes':   return 'Handmade'
    default:        return 'Small batch'
  }
}
