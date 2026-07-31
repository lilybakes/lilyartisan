import { KraftBrandLockup, KraftFooter } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Matches Image 9 (Almond Biscotti label):
 *   • Compact header: monogram-sm + brand + tagline (left), "IPOH" tracked caps (right)
 *   • SOLID DARK BROWN BAND holding "SMALL BATCH" eyebrow + product name in cream
 *   • "INGREDIENTS" section: brown eyebrow + ingredients as one sentence
 *   • BROWN-OUTLINED RECTANGLE: "ALLERGEN NOTICE" eyebrow + allergens sentence
 *   • Dashed-divider footer with contact
 */
export function KraftProductLabel({ recipe = {}, brand = {} }) {
  const ings = recipe.ingredients || []
  const allergens = recipe.allergens || []
  const city = brand.city || 'Ipoh'
  const ingredientsSentence = ings.length
    ? ings.map(i => i.name).join(', ') + '.'
    : 'See recipe for full ingredients.'
  const allergensText = Array.isArray(allergens) && allergens.length
    ? `Contains: ${allergens.join(', ')}.`
    : 'See label for allergens.'
  const eyebrowText = recipe.category === 'Cookies' ? 'Small batch'
    : recipe.category === 'Bread' ? 'Baked fresh'
    : 'Small batch'

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
