import { BrandHeader, BrandFooter } from './parts.jsx'

/**
 * Customer-facing care card. Storage instructions, best-by, thank you.
 * A6 sized when printed — 4 fit on an A4 sheet.
 */
export function CareCard({ recipe, brand }) {
  const storage = recipe.storage_notes || brand.default_storage_notes || 'Best enjoyed within 2–3 days. Keep in a cool, dry place.'

  return (
    <div className="tpl tpl-care printable" style={{ '--brand': brand.brand_color }}>
      <BrandHeader brand={brand} compact/>

      <div className="tpl-care-body">
        <div className="tpl-care-thanks">Thank you for choosing us!</div>
        <h1 className="tpl-care-product">{recipe.name}</h1>
        <div className="tpl-care-tagline">Freshly baked with care in small batches</div>

        <div className="tpl-care-section">
          <div className="tpl-care-section-icon">🌡️</div>
          <div>
            <div className="tpl-care-section-title">Storage</div>
            <div className="tpl-care-section-body">{storage}</div>
          </div>
        </div>

        {(recipe.allergen_notice || brand.default_allergen_notice) && (
          <div className="tpl-care-section">
            <div className="tpl-care-section-icon">⚠️</div>
            <div>
              <div className="tpl-care-section-title">Allergen notice</div>
              <div className="tpl-care-section-body">{recipe.allergen_notice || brand.default_allergen_notice}</div>
            </div>
          </div>
        )}
      </div>

      <BrandFooter brand={brand}/>
    </div>
  )
}
