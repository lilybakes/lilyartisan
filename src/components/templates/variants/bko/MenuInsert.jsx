import { BkoBrandLockup, BkoRule, BkoFooter, bkoMoney } from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait) — counter / customer
 *
 * FIELD MAPPING:
 *   Item name / price / description / category — from each recipe
 *   Only recipes with show_in_menu = true are rendered
 *   customization.header_eyebrow — optional tracked-caps eyebrow above the brand
 *   customization.footer_line    — optional line above the footer
 */
export function BkoMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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
    <div className="tpl b-tpl b-menu printable">
      <header className="b-header">
        {customization.header_eyebrow && (
          <div className="b-eyebrow b-eyebrow-muted" style={{ marginBottom: '2mm' }}>
            {customization.header_eyebrow}
          </div>
        )}
        <BkoBrandLockup brand={brand} size="md" layout="row"/>
      </header>

      <BkoRule/>

      <div className="b-menu-body">
        {sortedCats.length === 0 && (
          <p className="b-empty b-menu-empty">
            No recipes marked as "show in menu" — toggle recipes on via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="b-menu-cat-block">
            <div className="b-menu-cat-row">
              <span className="b-menu-cat-lbl">{cat}</span>
              <span className="b-menu-cat-rule"/>
            </div>
            {grouped[cat].map((item, i) => (
              <div key={i} className="b-menu-item">
                <div className="b-menu-item-line">
                  <span className="b-menu-item-name">{item.name}</span>
                  <span className="b-menu-item-price">
                    {bkoMoney(item.suggested_price || 0)}
                  </span>
                </div>
                {item.description && (
                  <div className="b-menu-item-desc">{item.description}</div>
                )}
              </div>
            ))}
          </div>
        ))}
        {customization.footer_line && (
          <p className="b-menu-footer-line">{customization.footer_line}</p>
        )}
      </div>

      <BkoFooter brand={brand} layout="split"/>
    </div>
  )
}
