import { EmberEyebrow, EmberRule } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Top ~35% gradient block with diagonal-cut bottom edge. Brand line small
 * caps cream + product title heavy condensed uppercase cream inside.
 *
 * Below on cream: INGREDIENTS eyebrow + sans list. Filled NEAR-BLACK
 * rounded rectangle callout for the ALLERGEN NOTICE — ember eyebrow +
 * cream body copy for contrast. Thin rule + tiny centered footer.
 */
export function EmberProductLabel({ recipe = {}, brand = {} }) {
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

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const brandLine = `${brand?.business_name || 'Your Bakery'} · ${cityLine}`

  const contactBits = [brand.phone, brand.website].filter(Boolean)

  return (
    <div className="tpl em-tpl em-label printable">
      <header className="em-label-header">
        <EmberEyebrow tone="cream" className="em-label-brand-line">{brandLine}</EmberEyebrow>
        <h2 className="em-title em-label-product">
          {(recipe.name || 'Product name').toUpperCase()}
        </h2>
      </header>

      <div className="em-label-body">
        <section className="em-label-section">
          <EmberEyebrow>Ingredients</EmberEyebrow>
          <p className="em-label-ingredients">{ingredientsSentence}</p>
        </section>

        <div className="em-label-allergen">
          <EmberEyebrow tone="ember">Allergen Notice</EmberEyebrow>
          <p className="em-label-allergen-body">{allergensText}</p>
        </div>
      </div>

      <div className="em-label-footer-wrap">
        <EmberRule marginTop="auto" weight="hair"/>
        <div className="em-label-footer">
          {contactBits.map((b, i) => (
            <span key={i}>{i > 0 && ' · '}{b}</span>
          ))}
          {brand.instagram && (
            <> · <span className="em-footer-social">@{brand.instagram}</span></>
          )}
        </div>
      </div>
    </div>
  )
}
