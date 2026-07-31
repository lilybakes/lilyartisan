import {
  BhLogoMark, BhEyebrow, BhRule, BhShapeChip, BhFooter,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Top ~35mm: three solid shapes hugging the top edge —
 *   - RED quarter-circle bulging in from the top-left corner
 *   - solid BLUE rectangle sitting on the top edge, center
 *   - solid YELLOW rectangle at the right edge
 * Below on cream paper: BhLogoMark centered, wordmark under it.
 *
 * MASSIVE Archivo Black product title. CARE red eyebrow centered.
 *
 * Left-aligned body: STORAGE blue eyebrow + body copy. ALLERGENS red
 * eyebrow + row of solid rectangle chips (WHEAT/black · DAIRY/yellow ·
 * EGGS/red — rotating colors).
 */
export function BhCareCard({ recipe = {}, brand = {} }) {
  const careText =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best on the day of baking. Keep in an airtight container up to three days.'

  const allergensRaw =
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

  const chipColors = ['black', 'yellow', 'red']

  return (
    <div className="tpl bh-tpl bh-care printable">
      {/* --- Bauhaus shape composition top band --- */}
      <div className="bh-care-top">
        <div className="bh-care-top-red"/>
        <div className="bh-care-top-blue"/>
        <div className="bh-care-top-yellow"/>
      </div>

      <header className="bh-care-header">
        <BhLogoMark brand={brand} size="md"/>
        <div className="bh-care-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <div className="bh-care-brand-tag">
          {brand.tagline || 'Artisan bakery'} — {cityLine.toUpperCase()}
        </div>
      </header>

      <div className="bh-care-title-block">
        <h2 className="bh-title bh-care-product">{(recipe.name || 'Product name').toUpperCase()}</h2>
        <BhEyebrow tone="red" className="bh-care-eyebrow">Care</BhEyebrow>
      </div>

      <div className="bh-care-body">
        <section className="bh-care-section">
          <BhEyebrow tone="blue">Storage</BhEyebrow>
          <p className="bh-care-text">{careText}</p>
        </section>

        <section className="bh-care-section">
          <BhEyebrow tone="red">Allergens</BhEyebrow>
          {allergenList.length > 0 ? (
            <div className="bh-care-allergens">
              {allergenList.map((a, i) => (
                <BhShapeChip key={i} color={chipColors[i % chipColors.length]} size="sm">{a}</BhShapeChip>
              ))}
            </div>
          ) : (
            <p className="bh-care-text">{allergensRaw || 'See label for allergens.'}</p>
          )}
        </section>
      </div>

      <div className="bh-care-footer-wrap">
        <BhRule weight="thick" marginBottom="3mm"/>
        <BhFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
