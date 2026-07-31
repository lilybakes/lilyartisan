import { ChalkFlourish, Sparkle } from './ornaments.jsx'

function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

/**
 * Menu Insert — "Café Chalkboard"
 * Dark chalkboard, chalk-white typography, handwritten feel.
 */
export function MenuInsert({ recipes, brand }) {
  const currency = brand.currency || 'RM'
  const items = (recipes || []).filter(r => r?.name)

  const groups = new Map()
  for (const r of items) {
    const cat = r.category || 'Menu'
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat).push(r)
  }

  return (
    <div className="tpl tpl-menu-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Wooden frame */}
      <div className="tpl-menu-v2-frame">
        {/* Chalk header */}
        <div className="tpl-menu-v2-header">
          {brand.logo_data_url && (
            <div className="tpl-menu-v2-logo-round">
              <img src={brand.logo_data_url} alt=""/>
            </div>
          )}
          <div className="tpl-menu-v2-brand-name">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <div className="tpl-menu-v2-brand-tag">— {brand.tagline} —</div>}
          <div className="tpl-menu-v2-title">
            <ChalkFlourish width={40}/>
            <span>Today's Menu</span>
            <ChalkFlourish width={40}/>
          </div>
        </div>

        {/* Body */}
        <div className="tpl-menu-v2-body">
          {items.length === 0 && (
            <div className="tpl-menu-v2-empty">Add recipes to build your menu</div>
          )}
          {[...groups.entries()].map(([cat, recs]) => (
            <div key={cat} className="tpl-menu-v2-cat">
              <div className="tpl-menu-v2-cat-title">
                <span className="tpl-menu-v2-cat-line"/>
                <span className="tpl-menu-v2-cat-name">— {cat} —</span>
                <span className="tpl-menu-v2-cat-line"/>
              </div>
              <div className="tpl-menu-v2-cat-items">
                {recs.map(r => (
                  <div key={r.id} className="tpl-menu-v2-item">
                    <div className="tpl-menu-v2-item-name">{r.name}</div>
                    {r.description && (
                      <div className="tpl-menu-v2-item-desc">{r.description}</div>
                    )}
                    <div className="tpl-menu-v2-item-price">{money(r.suggested_price, currency)}</div>
                    <div className="tpl-menu-v2-item-leader"/>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chalky footer */}
        <div className="tpl-menu-v2-footer">
          <ChalkFlourish width={60}/>
          <div className="tpl-menu-v2-footer-contact">
            {brand.instagram && <span>@{brand.instagram}</span>}
            {brand.facebook  && <span>fb/{brand.facebook}</span>}
            {brand.contact_phone && <span>{brand.contact_phone}</span>}
            {brand.address && <span>{brand.address.split('\n')[0]}</span>}
          </div>
          <ChalkFlourish width={60}/>
        </div>
      </div>
    </div>
  )
}
