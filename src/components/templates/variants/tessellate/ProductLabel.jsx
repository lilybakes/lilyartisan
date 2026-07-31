import { TeLogo, TeEyebrow, TeRule, TeDotRule } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Top: navy×cream two-tone diagonal band (~14mm, sharp angles). Brand
 * small caps letter-tracked left, city mono below. Quadrant logo
 * top-right corner. Big bold Manrope title, small-squares DOT RULE
 * directly beneath as the divider.
 *
 * INGREDIENTS eyebrow + sentence-form list. ALLERGENS eyebrow +
 * BORDERED navy-outlined box on cream with the allergen sentence
 * inside. Thin hairline + tiny mono contact footer.
 */
export function TeProductLabel({ recipe = {}, brand = {} }) {
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

  return (
    <div className="tpl te-tpl te-label printable">
      <div className="te-stripe-band te-stripe-navy-cream te-label-stripe"/>

      <header className="te-label-header">
        <div className="te-label-brand-block">
          <div className="te-label-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
          <TeEyebrow tone="muted" className="te-label-brand-city">{cityLine.toUpperCase()}</TeEyebrow>
        </div>
        <TeLogo brand={brand} size="sm"/>
      </header>

      <div className="te-label-title-block">
        <h2 className="te-title te-label-product">{(recipe.name || 'Product name').toUpperCase()}</h2>
        <TeDotRule className="te-label-dots"/>
      </div>

      <section className="te-label-section">
        <TeEyebrow tone="rust">Ingredients</TeEyebrow>
        <p className="te-label-body">{ingredientsSentence}</p>
      </section>

      <section className="te-label-section">
        <TeEyebrow tone="rust">Allergens</TeEyebrow>
        <div className="te-label-allergen-box">
          {allergenList.length > 0
            ? `CONTAINS: ${allergenList.join(', ')}.`
            : (allergensRaw || 'See label for allergens.')}
        </div>
      </section>

      <div className="te-label-footer-wrap">
        <TeRule marginTop="auto" marginBottom="2mm"/>
        <div className="te-label-footer">
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
