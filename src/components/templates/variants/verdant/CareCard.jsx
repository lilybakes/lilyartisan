import {
  VerdantBrandLockup, VerdantEyebrow, VerdantChip, VerdantSeal,
  VerdantHairRule, VerdantDecorCircle, VerdantFooter,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Brand top-left, filled dark-green circle (subtle gradient) top-right.
 * "THANK YOU FOR CHOOSING US" small caps green, big serif product title.
 * STORAGE section + body copy. ALLERGENS section rendered as rounded
 * mint pill chips (parsed from the allergens_text — "Wheat, Dairy, Eggs"
 * becomes three chips). Decorative light-green circle overflowing the
 * bottom-left, then centered footer.
 */
export function VerdantCareCard({ recipe = {}, brand = {} }) {
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

  // Parse allergens into pills — strip "Contains:" prefix and split on commas
  const allergenList = allergensRaw
    .replace(/^\s*contains?\s*:?\s*/i, '')
    .replace(/\.\s*$/, '')
    .split(/\s*,\s*|\s+and\s+/i)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())

  return (
    <div className="tpl v-tpl v-care printable">
      <VerdantDecorCircle size={280} bottom={-140} left={-110} tone="mint-soft"/>

      <header className="v-care-header">
        <VerdantBrandLockup brand={brand} size="sm"/>
        <VerdantSeal text="" size={38}/>
      </header>

      <div className="v-care-title-block">
        <VerdantEyebrow>Thank you for choosing us</VerdantEyebrow>
        <h2 className="v-title v-care-product">{recipe.name || 'Product name'}</h2>
      </div>

      <section className="v-care-section">
        <VerdantEyebrow>Storage</VerdantEyebrow>
        <p className="v-care-text">{careText}</p>
      </section>

      <section className="v-care-section">
        <VerdantEyebrow>Allergens</VerdantEyebrow>
        {allergenList.length > 0 ? (
          <div className="v-care-allergen-chips">
            {allergenList.map((a, i) => <VerdantChip key={i} size="md">{a}</VerdantChip>)}
          </div>
        ) : (
          <p className="v-care-text">{allergensRaw || 'See label for allergens.'}</p>
        )}
      </section>

      <div className="v-care-footer-wrap">
        <VerdantHairRule marginTop="auto" marginBottom="4mm"/>
        <VerdantFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
