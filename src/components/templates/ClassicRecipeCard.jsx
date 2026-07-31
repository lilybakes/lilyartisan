import { WaxSeal, Sparkle, WheatSprig } from './ornaments.jsx'

/**
 * Classic Recipe Card — "Kraft Deli, Modern-Warm"
 * A5 portrait. Cream paper, serif recipe name, wax seal, wheat sprig ornament.
 */
export function ClassicRecipeCard({ recipe, brand }) {
  return (
    <div className="tpl tpl-classic-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Top-right sparkle */}
      <div className="tpl-classic-v2-sparkle-tr">
        <Sparkle size={10}/>
      </div>

      {/* Wax seal top-left */}
      <div className="tpl-classic-v2-seal">
        <WaxSeal size={62} initials={brand.business_name}/>
      </div>

      {/* Brand mark strip */}
      <div className="tpl-classic-v2-brand">
        {brand.logo_data_url && (
          <img src={brand.logo_data_url} alt="" className="tpl-classic-v2-logo"/>
        )}
        <div className="tpl-classic-v2-brand-text">
          <div className="tpl-classic-v2-brand-name">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <div className="tpl-classic-v2-brand-tag">{brand.tagline}</div>}
        </div>
      </div>

      {/* Ornament divider */}
      <div className="tpl-classic-v2-ornament">
        <span className="tpl-classic-v2-rule"/>
        <Sparkle size={8}/>
        <span className="tpl-classic-v2-rule"/>
      </div>

      {/* Recipe hero */}
      <div className="tpl-classic-v2-hero">
        <div className="tpl-classic-v2-eyebrow">Recipe Card</div>
        <h1 className="tpl-classic-v2-name">{recipe.name}</h1>
        <div className="tpl-classic-v2-meta">
          <span>Yields {recipe.yield_portions} portions</span>
          {recipe.category && <><span className="tpl-classic-v2-dot">·</span><span>{recipe.category}</span></>}
        </div>
      </div>

      {/* Ingredients */}
      <div className="tpl-classic-v2-section">
        <div className="tpl-classic-v2-section-title">
          <span>Ingredients</span>
          <span className="tpl-classic-v2-count">{recipe.lines.length}</span>
        </div>
        <div className="tpl-classic-v2-ing-grid">
          {recipe.lines.map((l, i) => (
            <div key={i} className="tpl-classic-v2-ing">
              <span className="tpl-classic-v2-ing-qty">{l.qty} {l.unit || ''}</span>
              <span className="tpl-classic-v2-ing-dot"/>
              <span className="tpl-classic-v2-ing-name">{l.ingredient_name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Method */}
      {recipe.method && (
        <div className="tpl-classic-v2-section">
          <div className="tpl-classic-v2-section-title">
            <span>Method</span>
          </div>
          <div className="tpl-classic-v2-method">{recipe.method}</div>
        </div>
      )}

      {/* Sepia note in bottom-left */}
      <div className="tpl-classic-v2-note">
        <div className="tpl-classic-v2-note-tape"/>
        <em>Baked with intention · {new Date().getFullYear()}</em>
      </div>

      {/* Footer with wheat sprig */}
      <footer className="tpl-classic-v2-footer">
        <WheatSprig width={110}/>
        <div className="tpl-classic-v2-footer-contact">
          {brand.address && <div className="tpl-classic-v2-footer-address">{brand.address}</div>}
          <div className="tpl-classic-v2-footer-row">
            {brand.contact_phone && <span>{brand.contact_phone}</span>}
            {brand.website       && <span>{brand.website}</span>}
            {brand.instagram     && <span>@{brand.instagram}</span>}
            {brand.facebook      && <span>fb/{brand.facebook}</span>}
          </div>
        </div>
      </footer>
    </div>
  )
}
