function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

/**
 * Social Media Card — "Editorial Magazine"
 * Cream ground, huge italic serif recipe name, magazine-style typography.
 */
export function SocialMediaCard({ recipe, brand, issueNo = null }) {
  const currency = brand.currency || 'RM'
  // Auto-derive an "issue number" if not given (based on recipe id hash or name length)
  const num = issueNo ?? String(Math.abs((recipe.name || '').split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)) % 99 + 1).padStart(2, '0')

  return (
    <div className="tpl tpl-social-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Editorial masthead */}
      <div className="tpl-social-v2-masthead">
        {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-social-v2-logo"/>}
        <div className="tpl-social-v2-mast-text">
          <div className="tpl-social-v2-brand">{brand.business_name || 'Your Bakery'}</div>
          <div className="tpl-social-v2-issue">Issue №{num} · Fresh Today</div>
        </div>
      </div>

      {/* Big italic serif name */}
      <div className="tpl-social-v2-body">
        <div className="tpl-social-v2-eyebrow">FROM OUR KITCHEN</div>
        <h1 className="tpl-social-v2-name">{recipe.name}</h1>
        {recipe.description && (
          <p className="tpl-social-v2-desc">{recipe.description}</p>
        )}
      </div>

      {/* Price block */}
      {recipe.suggested_price > 0 && (
        <div className="tpl-social-v2-price">
          <div className="tpl-social-v2-price-rule"/>
          <div className="tpl-social-v2-price-inner">
            <span className="tpl-social-v2-price-label">from</span>
            <span className="tpl-social-v2-price-value">{money(recipe.suggested_price, currency)}</span>
          </div>
          <div className="tpl-social-v2-price-rule"/>
        </div>
      )}

      {/* Footer */}
      <div className="tpl-social-v2-footer">
        <div className="tpl-social-v2-handles">
          {brand.instagram && <span>@{brand.instagram}</span>}
          {brand.facebook  && <span>fb/{brand.facebook}</span>}
        </div>
        {brand.website && <div className="tpl-social-v2-web">{brand.website}</div>}
      </div>
    </div>
  )
}
