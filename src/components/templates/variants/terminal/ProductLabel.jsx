import {
  TrLogo, TrEyebrow, TrRule,
  parseAllergens,
} from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Small dark solid navy — NO grid (too small to read).
 *
 * Top row: brand info left (Manrope 800 white + mono muted subtitle),
 * teal SQUARE DC logo right.
 *
 * Product title Manrope 800 white.
 *
 * INGREDIENTS mono teal eyebrow + off-white sentence body.
 *
 * ALLERGEN NOTICE block: DASHED amber outlined rounded rectangle (NOT
 * filled) with mono amber `ALLERGEN NOTICE` label inside + off-white
 * body text inside.
 *
 * Bottom: thin hair rule, then mono uppercase footer: phone · website ·
 * @THEDAILYCRUMB (handle in teal).
 */
export function TrProductLabel({ recipe = {}, brand = {} }) {
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

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const contactBits = [brand.phone, brand.website].filter(Boolean)

  return (
    <div className="tpl tr-tpl tr-label printable">
      <header className="tr-label-header">
        <div className="tr-label-brand">
          <div className="tr-label-brand-name">
            {brand.business_name || 'The Daily Crumb'}
          </div>
          <div className="tr-label-brand-sub">{cityLine.toUpperCase()}</div>
        </div>
        <TrLogo brand={brand} size="sm"/>
      </header>

      <div className="tr-label-title-block">
        <h2 className="tr-label-product">{recipe.name || 'Product Name'}</h2>
      </div>

      <section className="tr-label-section">
        <TrEyebrow tone="teal">INGREDIENTS</TrEyebrow>
        <p className="tr-label-body">{ingredientsSentence}</p>
      </section>

      <div className="tr-label-allergen-notice">
        <div className="tr-label-allergen-eyebrow">ALLERGEN NOTICE</div>
        {allergenList.length > 0 ? (
          <div className="tr-label-allergens">{allergenList.join(' · ')}</div>
        ) : (
          <p className="tr-label-body">{allergensRaw || 'See label for allergens.'}</p>
        )}
      </div>

      <div className="tr-label-footer-wrap">
        <TrRule tone="hair" marginTop="auto" marginBottom="2mm"/>
        <div className="tr-label-footer">
          {contactBits.length > 0 && (
            <div className="tr-label-footer-line">
              {contactBits.join(' · ').toUpperCase()}
            </div>
          )}
          {brand.instagram && (
            <div className="tr-label-footer-line tr-label-footer-line-teal">
              @{brand.instagram.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
