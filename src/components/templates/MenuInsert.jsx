import { BrandHeader, BrandFooter } from './parts.jsx'

function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

/**
 * Multi-recipe menu insert. Groups recipes by category.
 * A5 portrait — for placing in menus or leave-behinds.
 */
export function MenuInsert({ recipes, brand }) {
  const currency = brand.currency || 'RM'
  const items = (recipes || []).filter(r => r?.name)

  // Group by category
  const groups = new Map()
  for (const r of items) {
    const cat = r.category || 'Menu'
    if (!groups.has(cat)) groups.set(cat, [])
    groups.get(cat).push(r)
  }

  return (
    <div className="tpl tpl-menu printable" style={{ '--brand': brand.brand_color }}>
      <BrandHeader brand={brand}/>

      <div className="tpl-menu-body">
        {items.length === 0 && (
          <p className="tpl-empty">Add recipes to build your menu.</p>
        )}
        {[...groups.entries()].map(([cat, recs]) => (
          <div key={cat} className="tpl-menu-category">
            <div className="tpl-menu-category-title">{cat}</div>
            <div className="tpl-menu-items">
              {recs.map(r => (
                <div key={r.id} className="tpl-menu-item">
                  <div className="tpl-menu-item-info">
                    <div className="tpl-menu-item-name">{r.name}</div>
                    {r.description && (
                      <div className="tpl-menu-item-desc">{r.description}</div>
                    )}
                  </div>
                  <div className="tpl-menu-item-price">
                    {money(r.suggested_price, currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BrandFooter brand={brand}/>
    </div>
  )
}
