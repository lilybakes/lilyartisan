import { PaEyebrow, PaRule, PaShortRule, PaSubtitle } from './_parts.jsx'

/**
 * 04 — PRODUCT LABEL  (A7 portrait, 74×105mm) — packaging
 *
 * Gold-framed A7. Brand centered burgundy Cormorant, italic muted
 * subtitle, short gold rule. Product name burgundy Cormorant. INGREDIENTS
 * mauve eyebrow + dark sentence body. ALLERGEN NOTICE mauve eyebrow
 * inside a FULL PINK filled rounded box with allergen text in dark
 * burgundy — the label's single pink accent.
 */
export function PaProductLabel({ recipe = {}, brand = {} }) {
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
  const allergenSentence = allergenList.length > 0
    ? `Contains ${joinWithAnd(allergenList.map(a => a.toLowerCase()))}.`
    : (allergensRaw || 'See label for allergens.')

  const tagline = brand.tagline || 'Artisan bakery'
  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const brandSubtitle = `${tagline} — ${cityLine}`

  const contactBits = [brand.phone, brand.website].filter(Boolean)

  return (
    <div className="tpl pa-tpl pa-label printable">
      <div className="pa-frame">
        <header className="pa-label-header">
          <div className="pa-label-brand-name">{brand.business_name || 'Your Bakery'}</div>
          <PaSubtitle className="pa-label-brand-tag">{brandSubtitle}</PaSubtitle>
          <PaShortRule/>
        </header>

        <div className="pa-label-title-block">
          <h2 className="pa-title pa-label-product">{recipe.name || 'Product name'}</h2>
        </div>

        <section className="pa-label-section">
          <PaEyebrow>Ingredients</PaEyebrow>
          <p className="pa-label-body">{ingredientsSentence}</p>
        </section>

        <div className="pa-label-allergen-box">
          <PaEyebrow tone="burgundy">Allergen Notice</PaEyebrow>
          <p className="pa-label-allergens">{allergenSentence}</p>
        </div>

        <div className="pa-label-footer-wrap">
          <PaRule marginTop="auto" marginBottom="2mm"/>
          <div className="pa-label-footer">
            {contactBits.map((b, i) => (
              <span key={i}>{i > 0 && ' · '}{b}</span>
            ))}
            {brand.instagram && (
              <div>@{brand.instagram}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function joinWithAnd(list) {
  if (list.length === 0) return ''
  if (list.length === 1) return list[0]
  if (list.length === 2) return `${list[0]} and ${list[1]}`
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`
}
