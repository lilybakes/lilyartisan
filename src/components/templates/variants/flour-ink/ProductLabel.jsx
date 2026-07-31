import { FiLogo, FiEyebrow, FiRule, FiShortRule } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Top: brand small caps letter-tracked left, city letter-tracked below.
 * DC circle top-right. Big letter-tracked light product title wrapping
 * naturally to 2 lines, then a short thin rule.
 *
 * INGREDIENTS eyebrow + sentence-form list. THICK HORIZONTAL BLACK RULE
 * as the strongest divider (matches the mockup exactly). ALLERGENS
 * eyebrow + letter-tracked list joined by center dots. Thin hairline +
 * tiny letter-tracked contact footer.
 */
export function FiProductLabel({ recipe = {}, brand = {} }) {
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
    <div className="tpl fi-tpl fi-label printable">
      <header className="fi-label-header">
        <div className="fi-label-brand-block">
          <div className="fi-label-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
          <FiEyebrow tone="muted" className="fi-label-brand-city">{cityLine.toUpperCase()}</FiEyebrow>
        </div>
        <FiLogo brand={brand} size="sm"/>
      </header>

      <div className="fi-label-title-block">
        <h2 className="fi-title fi-label-product">{(recipe.name || 'Product name').toUpperCase()}</h2>
        <FiShortRule/>
      </div>

      <section className="fi-label-section">
        <FiEyebrow tone="muted">Ingredients</FiEyebrow>
        <p className="fi-label-body">{ingredientsSentence}</p>
      </section>

      <FiRule tone="ink-thick" marginTop="4mm" marginBottom="4mm"/>

      <section className="fi-label-section">
        <FiEyebrow tone="muted">Allergens</FiEyebrow>
        {allergenList.length > 0 ? (
          <div className="fi-label-allergens">{allergenList.join(' · ')}</div>
        ) : (
          <p className="fi-label-body">{allergensRaw || 'See label for allergens.'}</p>
        )}
      </section>

      <div className="fi-label-footer-wrap">
        <FiRule marginTop="auto" marginBottom="2mm"/>
        <div className="fi-label-footer">
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
