import {
  LetterpressBrandLockup, LetterpressRuleWithLabel, LetterpressFooter,
  letterpressMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait) — counter / customer
 *
 * DC in square, brand block, "— LA CARTE —" rule-with-label divider.
 * Centered small-caps category labels, item name → dotted leader → price
 * rows in serif, italic centered description below each.
 */
export function LetterpressMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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

  const menuLabel = customization.header_eyebrow || 'La Carte'

  return (
    <div className="tpl l-tpl l-menu printable">
      <div className="l-menu-inner">
        <header className="l-menu-header">
          <LetterpressBrandLockup brand={brand} size="md" layout="column"/>
        </header>

        <LetterpressRuleWithLabel label={menuLabel}/>

        <div className="l-menu-body">
          {sortedCats.length === 0 && (
            <p className="l-menu-empty">
              No recipes marked as "show in menu" — toggle recipes on via the Content drawer.
            </p>
          )}
          {sortedCats.map(cat => (
            <div key={cat} className="l-menu-cat-block">
              <div className="l-eyebrow l-eyebrow-burgundy l-menu-cat-lbl">{cat}</div>
              {grouped[cat].map((item, i) => (
                <div key={i} className="l-menu-item">
                  <div className="l-menu-item-line">
                    <span className="l-menu-item-name">{item.name}</span>
                    <span className="l-menu-item-leader"/>
                    <span className="l-menu-item-price">
                      {letterpressMoney(item.suggested_price || 0, { bare: true })}
                    </span>
                  </div>
                  {item.description && (
                    <div className="l-menu-item-desc">{item.description}</div>
                  )}
                </div>
              ))}
            </div>
          ))}

          {customization.footer_line && (
            <p className="l-menu-footer-line">{customization.footer_line}</p>
          )}
        </div>

        <LetterpressFooter brand={brand}/>
      </div>
    </div>
  )
}
