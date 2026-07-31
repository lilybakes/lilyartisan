import { KraftBrandLockup, KraftFooter } from './_parts.jsx'

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
export function KraftCareCard({ recipe = {}, brand = {} }) {
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
    <div className="tpl k-tpl k-care printable">
      <div className="k-care-inner">
        <KraftBrandLockup brand={brand} size="md" layout="column"/>

        <div className="k-care-thanks">Thank you, truly.</div>
        <h2 className="k-care-product">{recipe.name || 'Product name'}</h2>
        <div className="k-care-short-rule"/>

        <div className="k-care-section-lbl">How to keep it</div>
        <div className="k-care-body-text">{careText}</div>

        <div className="k-care-section-lbl">Allergens</div>
        <div className="k-care-body-text">{allergensText}</div>

        <KraftFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
