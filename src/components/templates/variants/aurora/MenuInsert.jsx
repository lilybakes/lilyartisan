import {
  AuChip, AuRule, AuFooter, auMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait, 148×210mm) — counter / customer
 *
 * Full-width gradient band at top (~50mm) with huge white Manrope
 * extrabold brand name left, right-aligned "MENU · JULY 2026" white
 * eyebrow. Below on lavender paper: category blocks, each headed by a
 * gradient-filled pill chip (BREAD, COOKIES, CAKES), then items:
 *   • Product name Manrope extrabold uppercase
 *   • Muted description below
 *   • Bare-number price right-aligned in purple bold
 */
export function AuMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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

  const now = new Date()
  const monthLabel = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()
  const eyebrowRight = customization.header_eyebrow
    ? String(customization.header_eyebrow).toUpperCase()
    : `MENU · ${monthLabel}`

  return (
    <div className="tpl au-tpl au-menu printable">
      <header className="au-menu-header">
        <div className="au-menu-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <div className="au-menu-header-right">{eyebrowRight}</div>
      </header>

      <div className="au-menu-body">
        {sortedCats.length === 0 && (
          <p className="au-menu-empty">
            No recipes marked as "show in menu" — toggle via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="au-menu-cat-block">
            <div className="au-menu-cat-badge"><AuChip>{cat}</AuChip></div>
            <div className="au-menu-cat-items">
              {grouped[cat].map((item, i) => (
                <div key={i} className="au-menu-item">
                  <div className="au-menu-item-body">
                    <div className="au-menu-item-name">{item.name.toUpperCase()}</div>
                    {item.description && (
                      <div className="au-menu-item-desc">{item.description}</div>
                    )}
                  </div>
                  <div className="au-menu-item-price">
                    {auMoney(item.suggested_price || 0, { bare: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="au-menu-footer-wrap">
        <AuRule marginTop="auto" marginBottom="4mm"/>
        <AuFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
