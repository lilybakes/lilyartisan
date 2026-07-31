import { BkoBrandLockup, BkoRule, BkoEyebrow, BkoFooter } from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — in-box for customer
 *
 * FIELD MAPPING (with cascading fallbacks):
 *   Care text  = recipe.care_text
 *              ↓ recipe.storage_text
 *              ↓ brand.default_care_text
 *              ↓ brand.default_storage_notes
 *              ↓ hard fallback
 *   Allergens  = recipe.allergens_text
 *              ↓ brand.default_allergen_notice
 *              ↓ hard fallback
 */
export function BkoCareCard({ recipe = {}, brand = {} }) {
  const careText =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best day of baking. Store in an airtight container up to 3 days.'

  const allergensText =
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    'See label for allergens.'

  return (
    <div className="tpl b-tpl b-care printable">
      <header className="b-header">
        <BkoBrandLockup brand={brand} size="sm" layout="row"/>
      </header>

      <BkoRule/>

      <div className="b-care-body">
        <BkoEyebrow tone="accent">Thank you for choosing us</BkoEyebrow>
        <h2 className="b-care-product">{recipe.name || 'Product name'}</h2>

        <div className="b-care-row">
          <span className="b-care-dot b-care-dot-filled"/>
          <div>
            <div className="b-care-row-title">Storage</div>
            <div className="b-care-row-text">{careText}</div>
          </div>
        </div>

        <div className="b-care-row">
          <span className="b-care-dot"/>
          <div>
            <div className="b-care-row-title">Allergens</div>
            <div className="b-care-row-text">{allergensText}</div>
          </div>
        </div>
      </div>

      <BkoFooter brand={brand} layout="stacked"/>
    </div>
  )
}
