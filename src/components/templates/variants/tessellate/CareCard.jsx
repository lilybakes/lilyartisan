import {
  TeLogo, TeEyebrow, TeRule, TeFooter,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * TOP: full-width rust×cream CHECKERBOARD BAND (~50mm tall) — the
 * signature tessellating pattern that names the variant. Rust squares
 * alternating with cream squares. The quadrant logo sits centered
 * inside the band on a cream tile.
 *
 * Below the band: bold Manrope product title, "CARE" rust mono eyebrow.
 * STORAGE + ALLERGENS sections — allergens rendered as small bordered
 * outline squares (navy border on cream), one per allergen parsed from
 * the string. Centered mono footer at bottom.
 */
export function TeCareCard({ recipe = {}, brand = {} }) {
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

  return (
    <div className="tpl te-tpl te-care printable">
      <div className="te-care-band te-check-rust-cream">
        <div className="te-care-band-logo-tile">
          <TeLogo brand={brand} size="md"/>
        </div>
      </div>

      <header className="te-care-header">
        <div className="te-care-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <TeEyebrow tone="muted" className="te-care-brand-tag">
          {brand.tagline || 'Artisan bakery'} · {cityLine.toUpperCase()}
        </TeEyebrow>
      </header>

      <div className="te-care-title-block">
        <h2 className="te-title te-care-product">{(recipe.name || 'Product name').toUpperCase()}</h2>
        <TeEyebrow tone="rust" className="te-care-eyebrow">Care</TeEyebrow>
      </div>

      <div className="te-care-body">
        <section className="te-care-section">
          <TeEyebrow tone="rust">Storage</TeEyebrow>
          <p className="te-care-text">{careText}</p>
        </section>

        <section className="te-care-section">
          <TeEyebrow tone="rust">Allergens</TeEyebrow>
          {allergenList.length > 0 ? (
            <div className="te-care-allergen-chips">
              {allergenList.map((a, i) => (
                <span key={i} className="te-care-allergen-chip">{a}</span>
              ))}
            </div>
          ) : (
            <p className="te-care-text">{allergensRaw || 'See label for allergens.'}</p>
          )}
        </section>
      </div>

      <div className="te-care-footer-wrap">
        <TeRule marginBottom="3mm"/>
        <TeFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
