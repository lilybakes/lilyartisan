import {
  EditorialLogo, EditorialEyebrow, EditorialRule, stylizeTitle,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Top-half FULL-WIDTH rust masthead. "THANK YOU FOR CHOOSING US" small-caps
 * cream + product title (italic accent) in cream on rust. Bottom half is
 * cream — STORAGE and ALLERGENS sections with rust eyebrows + sans body.
 * Thick horizontal black rule near bottom, then small DC + brand identity
 * + address + socials.
 *
 * FIELD MAPPING (cascading fallbacks):
 *   Care text  = recipe.care_text ↓ recipe.storage_text ↓ brand defaults ↓ fallback
 *   Allergens  = recipe.allergens_text ↓ brand.default_allergen_notice ↓ fallback
 */
export function EditorialCareCard({ recipe = {}, brand = {} }) {
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
    <div className="tpl e-tpl e-care printable">
      <div className="e-care-masthead">
        <EditorialEyebrow tone="cream" className="e-care-thanks">Thank you for choosing us</EditorialEyebrow>
        <h2 className="e-title e-care-product">
          {stylizeTitle(recipe.name || 'Product name')}
        </h2>
      </div>

      <div className="e-care-body">
        <div className="e-care-section">
          <EditorialEyebrow tone="rust">Storage</EditorialEyebrow>
          <p className="e-care-text">{careText}</p>
        </div>

        <div className="e-care-section">
          <EditorialEyebrow tone="rust">Allergens</EditorialEyebrow>
          <p className="e-care-text">{allergensText}</p>
        </div>
      </div>

      <EditorialRule tone="black" weight="thick" marginTop="auto"/>

      <div className="e-care-footer">
        <EditorialLogo brand={brand} size="sm"/>
        <div className="e-care-footer-text">
          <div className="e-care-footer-name">{brand.business_name || 'Your Bakery'}</div>
          <div className="e-care-footer-line">
            {[
              brand.address_line1,
              brand.address_line2,
              brand.phone,
            ].filter(Boolean).join(' · ')}
          </div>
          <div className="e-care-footer-line">
            {[
              brand.website,
              brand.instagram ? <span key="ig" className="e-footer-social">@{brand.instagram}</span> : null,
              brand.facebook ? <span key="fb" className="e-footer-social">fb/{brand.facebook}</span> : null,
            ].filter(Boolean).reduce((acc, cur, i) => {
              if (i === 0) return [cur]
              return [...acc, ' · ', cur]
            }, [])}
          </div>
        </div>
      </div>
    </div>
  )
}
