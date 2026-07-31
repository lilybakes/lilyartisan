import {
  QuietBrandLockup, QuietEyebrow, QuietDot, QuietShortRule, QuietRule, QuietFooter,
} from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Top: textonly brand left, tiny rust dot right. Product name light sans.
 * Short thin rust accent rule under. INGREDIENTS mono muted + inline list.
 * ALLERGENS mono RUST eyebrow (rust to draw eye) + body. Hairline + minimal
 * centered footer.
 */
export function QuietProductLabel({ recipe = {}, brand = {} }) {
  const lines = recipe.lines || []

  const ingredientsSentence =
    (recipe.label_ingredients_text && recipe.label_ingredients_text.trim()) ||
    (lines.length > 0
      ? lines.map(l => l.ingredient_name).filter(Boolean).join(', ') + '.'
      : 'See recipe.')

  const allergensText =
    recipe.label_allergens_text ||
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    'See label for allergens.'

  return (
    <div className="tpl q-tpl q-label printable">
      <header className="q-label-header">
        <QuietBrandLockup brand={brand} layout="textonly"/>
        <QuietDot/>
      </header>

      <div className="q-label-title-block">
        <h2 className="q-title q-label-product">{recipe.name || 'Product name'}</h2>
        <QuietShortRule/>
      </div>

      <section className="q-label-section">
        <QuietEyebrow>Ingredients</QuietEyebrow>
        <p className="q-label-body">{ingredientsSentence}</p>
      </section>

      <section className="q-label-section">
        <QuietEyebrow tone="rust">Allergens</QuietEyebrow>
        <p className="q-label-body">{allergensText}</p>
      </section>

      <div className="q-label-footer-wrap">
        <QuietRule marginBottom="4mm"/>
        <QuietFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
