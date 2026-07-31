import { CrispBrandLockup, CrispRule, CrispFooter, crispMoney } from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait) — counter / customer
 *
 * FIELD MAPPING:
 *   Item name / price / description / category — from each recipe
 *   Only recipes with show_in_menu = true are rendered
 *   customization.header_eyebrow — optional tracked-caps eyebrow above the brand
 *   customization.footer_line    — optional line above the footer
 */
export function CrispMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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
    <div className="tpl c-tpl c-menu printable">
      <header className="c-header">
        {customization.header_eyebrow && (
          <div className="c-eyebrow c-eyebrow-muted" style={{ marginBottom: '2mm' }}>
            {customization.header_eyebrow}
          </div>
        )}
        <CrispBrandLockup brand={brand} size="md" layout="row"/>
      </header>

      <CrispRule/>

      <div className="c-menu-body">
        {sortedCats.length === 0 && (
          <p className="c-empty c-menu-empty">
            No recipes marked as "show in menu" — toggle recipes on via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="c-menu-cat-block">
            <div className="c-menu-cat-row">
              <span className="c-menu-cat-lbl">{cat}</span>
              <span className="c-menu-cat-rule"/>
            </div>
            {grouped[cat].map((item, i) => (
              <div key={i} className="c-menu-item">
                <div className="c-menu-item-line">
                  <span className="c-menu-item-name">{item.name}</span>
                  <span className="c-menu-item-price">
                    {crispMoney(item.suggested_price || 0)}
                  </span>
                </div>
                {item.description && (
                  <div className="c-menu-item-desc">{item.description}</div>
                )}
              </div>
            ))}
          </div>
        ))}
        {customization.footer_line && (
          <p className="c-menu-footer-line">{customization.footer_line}</p>
        )}
      </div>

      <CrispFooter brand={brand} layout="split"/>
    </div>
  )
}
