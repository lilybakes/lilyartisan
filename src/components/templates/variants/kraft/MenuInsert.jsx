import { KraftBrandLockup, KraftDoubleRule, KraftFooter, kraftMoney } from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait) — counter / customer
 *
 * FIELD MAPPING:
 *   Item name / price / description / category — from each recipe
 *   Only recipes with show_in_menu = true are rendered
 *   customization.header_eyebrow — optional tracked-caps eyebrow above the brand
 *                                  (default: none)
 *   customization.footer_line    — optional line above the footer
 */
export function KraftMenuInsert({ recipes = [], brand = {}, customization = {} }) {
  const visible = recipes.filter(r => r.show_in_menu !== false)

  // Group by category
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
    <div className="tpl k-tpl k-menu printable">
      <div className="k-menu-header">
        {customization.header_eyebrow && (
          <div className="k-eyebrow" style={{ marginBottom: '2mm' }}>
            {customization.header_eyebrow}
          </div>
        )}
        <KraftBrandLockup brand={brand} size="lg" layout="column"/>
      </div>

      <KraftDoubleRule/>

      <div className="k-menu-body">
        {sortedCats.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--k-muted)', fontStyle: 'italic', marginTop: '20mm' }}>
            No recipes marked as "show in menu" — toggle recipes on via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat}>
            <div className="k-menu-cat">{cat}</div>
            {grouped[cat].map((item, i) => (
              <div key={i} className="k-menu-item">
                <div className="k-menu-item-body">
                  <div className="k-menu-item-line">
                    <span className="k-menu-item-name">{item.name}</span>
                    <span className="k-menu-item-leader"/>
                    <span className="k-menu-item-price">
                      {kraftMoney(item.suggested_price || 0, { bare: true })}
                    </span>
                  </div>
                  {item.description && (
                    <div className="k-menu-item-desc">{item.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        {customization.footer_line && (
          <p style={{ textAlign: 'center', color: 'var(--k-muted)', fontStyle: 'italic', marginTop: '10mm', fontSize: 12 }}>
            {customization.footer_line}
          </p>
        )}
      </div>

      <KraftFooter brand={brand} layout="centered"/>
    </div>
  )
}
