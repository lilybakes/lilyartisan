import {
  FiEyebrow, FiRule, FiShortRule, FiFooter, fiMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait) — counter / customer
 *
 * Centered top: letter-tracked brand name, short thin rule below, MENU
 * eyebrow. Then category blocks — each starts with a small caps muted
 * label (BREAD, COOKIES, CAKES, MUFFINS), followed by items:
 *
 *   • Product name letter-tracked light sans (uppercased)
 *   • Muted sans description below
 *   • Bare number price right-aligned (no currency prefix per the mockup)
 *
 * Thin hairline at the bottom, then centered footer.
 */
export function FiMenuInsert({ recipes = [], brand = {}, customization = {} }) {
  const visible = recipes.filter(r => r.show_in_menu !== false)

  const grouped = visible.reduce((acc, r) => {
    const cat = (r.category || 'Other').toUpperCase()
    ;(acc[cat] = acc[cat] || []).push(r)
    return acc
  }, {})
  const categoryOrder = ['BREAD', 'COOKIES', 'CAKES', 'MUFFINS', 'PASTRIES', 'OTHER']
  const sortedCats = Object.keys(grouped).sort((a, b) => {
    const ai = categoryOrder.indexOf(a); const bi = categoryOrder.indexOf(b)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  })

  return (
    <div className="tpl fi-tpl fi-menu printable">
      <header className="fi-menu-header">
        <div className="fi-menu-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <FiShortRule/>
        <FiEyebrow tone="muted">{customization.header_eyebrow || 'Menu'}</FiEyebrow>
      </header>

      <div className="fi-menu-body">
        {sortedCats.length === 0 && (
          <p className="fi-menu-empty">
            No recipes marked as "show in menu" — toggle via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="fi-menu-cat-block">
            <FiEyebrow tone="muted" className="fi-menu-cat-label">{cat}</FiEyebrow>
            <div className="fi-menu-cat-items">
              {grouped[cat].map((item, i) => (
                <div key={i} className="fi-menu-item">
                  <div className="fi-menu-item-body">
                    <div className="fi-menu-item-name">{item.name.toUpperCase()}</div>
                    {item.description && (
                      <div className="fi-menu-item-desc">{item.description}</div>
                    )}
                  </div>
                  <div className="fi-menu-item-price">
                    {fiMoney(item.suggested_price || 0, { bare: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="fi-menu-footer-wrap">
        <FiRule marginTop="auto" marginBottom="4mm"/>
        <FiFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
