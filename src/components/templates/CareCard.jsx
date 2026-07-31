import { TwineArc, HeartDoodle, Sparkle } from './ornaments.jsx'

/**
 * Care & Storage Card — "Warm Handwritten"
 * A6 portrait, warm off-white paper, script + serif mix, twine arc at top.
 */
export function CareCard({ recipe, brand }) {
  const storage   = recipe.storage_notes    || brand.default_storage_notes
  const allergens = recipe.allergen_notice  || brand.default_allergen_notice

  return (
    <div className="tpl tpl-care-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Twine at top */}
      <div className="tpl-care-v2-twine">
        <TwineArc width={200}/>
      </div>

      {/* Brand mark */}
      <div className="tpl-care-v2-brand">
        {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-care-v2-logo"/>}
        <div className="tpl-care-v2-brand-name">{brand.business_name || 'Your Bakery'}</div>
        {brand.tagline && <div className="tpl-care-v2-brand-tag">{brand.tagline}</div>}
      </div>

      {/* Thank you script */}
      <div className="tpl-care-v2-thanks">
        Thank you<br/>
        <span className="tpl-care-v2-thanks-em">so much</span>
      </div>

      {/* Product name */}
      <div className="tpl-care-v2-product-block">
        <div className="tpl-care-v2-product-label">for choosing our</div>
        <div className="tpl-care-v2-product">{recipe.name}</div>
      </div>

      <div className="tpl-care-v2-divider">
        <span className="tpl-care-v2-divider-rule"/>
        <HeartDoodle size={14}/>
        <span className="tpl-care-v2-divider-rule"/>
      </div>

      {/* Storage */}
      {storage && (
        <div className="tpl-care-v2-section">
          <div className="tpl-care-v2-section-label">Keep me happy</div>
          <div className="tpl-care-v2-section-body">{storage}</div>
        </div>
      )}

      {/* Allergen */}
      {allergens && (
        <div className="tpl-care-v2-section tpl-care-v2-section-warn">
          <div className="tpl-care-v2-section-label">Allergen notice</div>
          <div className="tpl-care-v2-section-body">{allergens}</div>
        </div>
      )}

      {/* Footer */}
      <footer className="tpl-care-v2-footer">
        <div className="tpl-care-v2-signoff">
          Made with <HeartDoodle size={11}/> in a small kitchen
        </div>
        <div className="tpl-care-v2-handles">
          {brand.instagram && <span>@{brand.instagram}</span>}
          {brand.facebook  && <span>fb/{brand.facebook}</span>}
          {brand.website   && <span>{brand.website}</span>}
        </div>
      </footer>

      {/* Corner sparkle */}
      <div className="tpl-care-v2-corner-sparkle"><Sparkle size={11}/></div>
    </div>
  )
}
