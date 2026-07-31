import { BhLogoMark, BhEyebrow, BhRule, BhShapeChip } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Top ~22mm: solid BLUE rectangle across the top with a solid YELLOW
 * quarter-circle bulging out from the top-right, and a small RED corner
 * peek. Cream-tone wordmark + BhLogoMark sit on top of the blue band.
 *
 * Below on cream paper: massive Archivo Black product title.
 *
 * INGREDIENTS red eyebrow + sentence-form list. Thick 2px BLACK RULE as
 * the strongest divider. ALLERGENS red eyebrow + row of solid rectangle
 * chips (WHEAT/DAIRY/EGGS with rotating colors). Thin contact footer.
 */
export function BhProductLabel({ recipe = {}, brand = {} }) {
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
  const allergenList = allergensRaw
    .replace(/^\s*contains?\s*:?\s*/i, '')
    .replace(/\.\s*$/, '')
    .split(/\s*,\s*|\s+and\s+/i)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.toUpperCase())

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const contactBits = [brand.phone, brand.website].filter(Boolean)
  const chipColors = ['black', 'yellow', 'red']

  return (
    <div className="tpl bh-tpl bh-label printable">
      {/* --- Blue top band with yellow quarter-circle + red peek --- */}
      <div className="bh-label-top">
        <div className="bh-label-top-blue"/>
        <div className="bh-label-top-yellow"/>
        <div className="bh-label-top-red"/>

        <div className="bh-label-top-content">
          <div className="bh-label-top-brand">
            <div className="bh-label-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
            <div className="bh-label-brand-city">{cityLine.toUpperCase()}</div>
          </div>
          <BhLogoMark brand={brand} size="sm" tone="cream"/>
        </div>
      </div>

      <div className="bh-label-title-block">
        <h2 className="bh-title bh-label-product">{(recipe.name || 'Product name').toUpperCase()}</h2>
      </div>

      <section className="bh-label-section">
        <BhEyebrow tone="red">Ingredients</BhEyebrow>
        <p className="bh-label-body">{ingredientsSentence}</p>
      </section>

      <BhRule weight="thick" marginTop="3mm" marginBottom="3mm"/>

      <section className="bh-label-section">
        <BhEyebrow tone="red">Allergens</BhEyebrow>
        {allergenList.length > 0 ? (
          <div className="bh-label-allergens">
            {allergenList.map((a, i) => (
              <BhShapeChip key={i} color={chipColors[i % chipColors.length]} size="sm">{a}</BhShapeChip>
            ))}
          </div>
        ) : (
          <p className="bh-label-body">{allergensRaw || 'See label for allergens.'}</p>
        )}
      </section>

      <div className="bh-label-footer-wrap">
        <BhRule weight="thick" marginTop="auto" marginBottom="2mm"/>
        <div className="bh-label-footer">
          {contactBits.map((b, i) => (
            <span key={i}>{i > 0 && ' · '}{b}</span>
          ))}
          {brand.instagram && (
            <div>@{brand.instagram}</div>
          )}
        </div>
      </div>
    </div>
  )
}
