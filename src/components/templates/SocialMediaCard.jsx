function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

/**
 * Square social media card. Screenshot-friendly for Instagram / Facebook posts.
 * 1080×1080 equivalent scaled to 148mm for print.
 */
export function SocialMediaCard({ recipe, brand, styleVariant = 'clean-modern' }) {
  const currency = brand.currency || 'RM'
  return (
    <div className={`tpl tpl-social printable variant-${styleVariant}`} style={{ '--brand': brand.brand_color }}>
      <div className="tpl-social-bg"/>

      <div className="tpl-social-mark">
        {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-social-logo"/>}
        <div className="tpl-social-mark-text">
          <div className="tpl-social-brand">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <div className="tpl-social-tagline">{brand.tagline}</div>}
        </div>
      </div>

      <div className="tpl-social-center">
        <div className="tpl-social-eyebrow">Fresh from our kitchen</div>
        <div className="tpl-social-name">{recipe.name}</div>
        {recipe.description && (
          <div className="tpl-social-desc">{recipe.description}</div>
        )}
        {recipe.suggested_price > 0 && (
          <div className="tpl-social-price">
            <span className="tpl-social-price-label">From</span>
            <span className="tpl-social-price-value">{money(recipe.suggested_price, currency)}</span>
          </div>
        )}
      </div>

      <div className="tpl-social-footer">
        <div className="tpl-social-handles">
          {brand.instagram && <span className="tpl-social-handle">@{brand.instagram}</span>}
          {brand.facebook  && <span className="tpl-social-handle">fb/{brand.facebook}</span>}
        </div>
        {brand.website && <span className="tpl-social-web">{brand.website}</span>}
      </div>
    </div>
  )
}
