import {
  RpOffsetTitle, RpBrandLockup, RpEyebrow, RpFooter,
  parseAllergens,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Small SOLID NAVY circle bleeds off the top-right corner (~22mm). A
 * bigger SOLID RUST circle (~55mm) bleeds off the bottom-left corner.
 * Content on cream between them: brand lockup top-left, then the
 * offset-effect product title.
 *
 * STORAGE eyebrow (rust) + navy body. ALLERGENS eyebrow (rust) + a row
 * of NAVY-filled chips (WHEAT / DAIRY / EGGS in cream text). Centered
 * footer at the bottom.
 */
export function RpCareCard({ recipe = {}, brand = {} }) {
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
  const allergenList = parseAllergens(allergensRaw)

  return (
    <div className="tpl rp-tpl rp-care printable">
      <div className="rp-care-corner-navy" aria-hidden="true"/>
      <div className="rp-care-corner-rust" aria-hidden="true"/>

      <header className="rp-care-header">
        <RpBrandLockup brand={brand}/>
      </header>

      <RpEyebrow tone="rust" className="rp-care-eyebrow-thanks">
        Thank you for choosing us
      </RpEyebrow>

      <div className="rp-care-title-block">
        <RpOffsetTitle size="sm">{recipe.name || 'Product name'}</RpOffsetTitle>
      </div>

      <div className="rp-care-body">
        <section className="rp-care-section">
          <RpEyebrow tone="rust">Storage</RpEyebrow>
          <p className="rp-care-text">{careText}</p>
        </section>

        <section className="rp-care-section">
          <RpEyebrow tone="rust">Allergens</RpEyebrow>
          {allergenList.length > 0 ? (
            <div className="rp-care-allergens">
              {allergenList.map((a, i) => (
                <span key={i} className="rp-care-allergen-chip">{a}</span>
              ))}
            </div>
          ) : (
            <p className="rp-care-text">{allergensRaw || 'See label for allergens.'}</p>
          )}
        </section>
      </div>

      <div className="rp-care-footer-wrap">
        <RpFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
