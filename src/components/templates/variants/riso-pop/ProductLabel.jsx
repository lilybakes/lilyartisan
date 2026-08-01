import {
  RpOffsetTitle, RpBrandLockup, RpEyebrow,
  parseAllergens,
} from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Small SOLID RUST circle bleeds off the top-right corner (~28mm) behind
 * the brand lockup. Compact offset-effect product title in medium sans.
 *
 * INGREDIENTS eyebrow + sentence-form list on cream. ALLERGEN NOTICE box
 * at the bottom: filled NAVY rectangle with RUST "ALLERGEN NOTICE" tracked
 * eyebrow + cream body text.
 */
export function RpProductLabel({ recipe = {}, brand = {} }) {
  const lines = recipe.lines || []

  const ingredientsSentence =
    (recipe.label_ingredients_text && recipe.label_ingredients_text.trim()) ||
    (lines.length > 0
      ? lines.map(l => l.ingredient_name).filter(Boolean).join(', ') + '.'
      : 'See recipe.')

  const allergensRaw =
    recipe.label_allergens_text ||
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    ''
  const allergenList = parseAllergens(allergensRaw)
  const allergenText = allergenList.length > 0
    ? `Contains ${allergenList.join(', ').toLowerCase()}.`
    : (allergensRaw || 'See packaging for allergens.')

  return (
    <div className="tpl rp-tpl rp-label printable">
      <div className="rp-label-corner-rust" aria-hidden="true"/>

      <header className="rp-label-header">
        <RpBrandLockup brand={brand}/>
      </header>

      <div className="rp-label-title-block">
        <RpOffsetTitle size="sm">{recipe.name || 'Product name'}</RpOffsetTitle>
      </div>

      <section className="rp-label-section">
        <RpEyebrow tone="rust">Ingredients</RpEyebrow>
        <p className="rp-label-body">{ingredientsSentence}</p>
      </section>

      <div className="rp-label-notice">
        <div className="rp-label-notice-eyebrow">Allergen Notice</div>
        <p className="rp-label-notice-body">{allergenText}</p>
      </div>
    </div>
  )
}
