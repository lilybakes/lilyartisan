import {
  LetterpressLogo, LetterpressFleuron, LetterpressFooter,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Thin brown double border. Everything centered. DC square top, brand
 * name+tagline, "WITH OUR THANKS" eyebrow, big product name, tiny
 * fleuron accent, then STORAGE and ALLERGEN NOTICE blocks.
 */
export function LetterpressCareCard({ recipe = {}, brand = {} }) {
  const careText =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best day of baking. Store in an airtight container up to three days.'

  const allergensText =
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    'See label for allergens.'

  return (
    <div className="tpl l-tpl l-care printable">
      <div className="l-care-border">
        <div className="l-care-inner">
          <div className="l-care-logo-wrap">
            <LetterpressLogo brand={brand} size="md" shape="square"/>
          </div>
          <h1 className="l-brand-name l-care-brand-name">{brand.business_name || 'Your Bakery'}</h1>
          {brand.tagline && <p className="l-brand-tagline l-care-brand-tag">{brand.tagline}</p>}

          <div className="l-eyebrow l-eyebrow-burgundy l-care-eyebrow">With our thanks</div>
          <h2 className="l-care-product">{recipe.name || 'Product name'}</h2>

          <div className="l-care-fleuron"><LetterpressFleuron size={20}/></div>

          <div className="l-eyebrow l-eyebrow-burgundy l-care-section-lbl">Storage</div>
          <p className="l-care-body-text">{careText}</p>

          <div className="l-eyebrow l-eyebrow-burgundy l-care-section-lbl">Allergen Notice</div>
          <p className="l-care-body-text">{allergensText}</p>

          <div className="l-care-footer-wrap">
            <LetterpressFooter brand={brand}/>
          </div>
        </div>
      </div>
    </div>
  )
}
