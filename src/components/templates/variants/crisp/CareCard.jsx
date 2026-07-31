import { CrispBrandLockup, CrispRule, CrispEyebrow, CrispFooter } from './_parts.jsx'

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
export function CrispCareCard({ recipe = {}, brand = {} }) {
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
    <div className="tpl c-tpl c-care printable">
      <header className="c-header">
        <CrispBrandLockup brand={brand} size="sm" layout="row"/>
      </header>

      <CrispRule/>

      <div className="c-care-body">
        <CrispEyebrow tone="brown">Thank you for choosing us</CrispEyebrow>
        <h2 className="c-care-product">{recipe.name || 'Product name'}</h2>

        <div className="c-care-row">
          <span className="c-care-dot c-care-dot-filled"/>
          <div>
            <div className="c-care-row-title">Storage</div>
            <div className="c-care-row-text">{careText}</div>
          </div>
        </div>

        <div className="c-care-row">
          <span className="c-care-dot"/>
          <div>
            <div className="c-care-row-title">Allergens</div>
            <div className="c-care-row-text">{allergensText}</div>
          </div>
        </div>
      </div>

      <CrispFooter brand={brand} layout="stacked"/>
    </div>
  )
}
