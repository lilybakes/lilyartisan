import {
  EmberEyebrow, EmberChip, EmberRule, EmberFooter,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Top ~40% gradient block with diagonal-cut bottom edge (matches Recipe
 * Card). THANK YOU FOR CHOOSING US small caps cream + big heavy condensed
 * product title cream inside.
 *
 * Below on cream: STORAGE section with sans body copy, then ALLERGENS
 * rendered as FILLED BLACK PILL chips (Wheat / Dairy / Eggs) — parsed
 * from allergens_text via strip-and-split.
 *
 * Thick black rule + centered footer with the brand name in big condensed
 * uppercase as the visual anchor.
 */
export function EmberCareCard({ recipe = {}, brand = {} }) {
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

  return (
    <div className="tpl em-tpl em-care printable">
      <header className="em-care-header">
        <EmberEyebrow tone="cream" className="em-care-thanks">Thank you for choosing us</EmberEyebrow>
        <h2 className="em-title em-care-product">
          {(recipe.name || 'Product name').toUpperCase()}
        </h2>
      </header>

      <div className="em-care-body">
        <section className="em-care-section">
          <EmberEyebrow>Storage</EmberEyebrow>
          <p className="em-care-text">{careText}</p>
        </section>

        <section className="em-care-section">
          <EmberEyebrow>Allergens</EmberEyebrow>
          {allergenList.length > 0 ? (
            <div className="em-care-allergen-chips">
              {allergenList.map((a, i) => <EmberChip key={i} tone="black">{a}</EmberChip>)}
            </div>
          ) : (
            <p className="em-care-text">{allergensRaw || 'See label for allergens.'}</p>
          )}
        </section>
      </div>

      <div className="em-care-footer-wrap">
        <EmberRule marginTop="auto" marginBottom="4mm"/>
        <EmberFooter brand={brand} layout="centered" showBrand={true}/>
      </div>
    </div>
  )
}
