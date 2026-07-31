import {
  FiLogo, FiEyebrow, FiRule, FiFooter,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Centered stacked brand (DC circle + name + tagline+city) at the top.
 * MASSIVE letter-tracked light product title, wraps to 2 lines. Then a
 * "CARE" eyebrow centered.
 *
 * Below, left-aligned: STORAGE eyebrow + body copy. ALLERGENS eyebrow +
 * a joined list ("WHEAT · DAIRY · EGGS") letter-tracked bold, with a
 * thin hairline underline extending across. Centered footer at bottom.
 */
export function FiCareCard({ recipe = {}, brand = {} }) {
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
    <div className="tpl fi-tpl fi-care printable">
      <header className="fi-care-header">
        <FiLogo brand={brand} size="md"/>
        <div className="fi-care-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <FiEyebrow tone="muted" className="fi-care-brand-tag">
          {brand.tagline || 'Artisan bakery'} · {cityLine.toUpperCase()}
        </FiEyebrow>
      </header>

      <div className="fi-care-title-block">
        <h2 className="fi-title fi-care-product">{(recipe.name || 'Product name').toUpperCase()}</h2>
        <FiEyebrow tone="muted" className="fi-care-eyebrow">Care</FiEyebrow>
      </div>

      <div className="fi-care-body">
        <section className="fi-care-section">
          <FiEyebrow tone="muted">Storage</FiEyebrow>
          <p className="fi-care-text">{careText}</p>
        </section>

        <section className="fi-care-section">
          <FiEyebrow tone="muted">Allergens</FiEyebrow>
          {allergenList.length > 0 ? (
            <>
              <div className="fi-care-allergens">{allergenList.join(' · ')}</div>
              <FiRule/>
            </>
          ) : (
            <p className="fi-care-text">{allergensRaw || 'See label for allergens.'}</p>
          )}
        </section>
      </div>

      <div className="fi-care-footer-wrap">
        <FiFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
