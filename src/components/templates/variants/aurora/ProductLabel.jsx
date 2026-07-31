import { AuEyebrow, AuChip, AuRule, parseAllergens } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Full-width gradient band at top (~25mm) carries the white brand name +
 * city eyebrow. Below on lavender paper: big Manrope extrabold product
 * title, INGREDIENTS eyebrow + sentence list. ALLERGEN NOTICE box uses
 * the glass-purple wash with gradient-filled pill chips. Tiny letter-
 * tracked contact footer.
 */
export function AuProductLabel({ recipe = {}, brand = {} }) {
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
    <div className="tpl au-tpl au-label printable">
      <header className="au-label-header">
        <div className="au-label-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <div className="au-label-brand-city">{cityLine.toUpperCase()}</div>
      </header>

      <div className="au-label-title-block">
        <h2 className="au-title au-label-product">{(recipe.name || 'Product name').toUpperCase()}</h2>
      </div>

      <section className="au-label-section">
        <AuEyebrow tone="purple">Ingredients</AuEyebrow>
        <p className="au-label-body">{ingredientsSentence}</p>
      </section>

      <section className="au-label-glass">
        <AuEyebrow tone="purple">Allergen Notice</AuEyebrow>
        {allergenList.length > 0 ? (
          <div className="au-label-allergen-chips">
            {allergenList.map((a, i) => <AuChip key={i}>{a}</AuChip>)}
          </div>
        ) : (
          <p className="au-label-body">{allergensRaw || 'See label for allergens.'}</p>
        )}
      </section>

      <div className="au-label-footer-wrap">
        <AuRule marginTop="auto" marginBottom="2mm"/>
        <div className="au-label-footer">
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
