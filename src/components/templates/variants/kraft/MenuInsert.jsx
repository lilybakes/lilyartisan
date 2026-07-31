import { KraftBrandLockup, KraftDoubleRule, KraftFooter, kraftMoney } from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait, 148×210mm) — counter / customer
 *
 * Matches Image 10 (menu with categories):
 *   • Big centered header: monogram-lg + large "The Daily Crumb" + tagline
 *   • Double horizontal brown lines
 *   • Categories (BREAD / COOKIES / CAKES / MUFFINS) as tracked caps eyebrow, centered
 *   • Each item: bold product name + dotted leader + bold brown price
 *   • Italic muted description below name
 *   • Centered dashed-divider footer
 */
export function KraftMenuInsert({ recipes = [], brand = {} }) {
  // Group recipes by category
  const grouped = recipes.reduce((acc, r) => {
    const cat = (r.category || 'Other').toUpperCase()
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(r)
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
        <KraftBrandLockup brand={brand} size="lg" layout="column"/>
      </div>

      <KraftDoubleRule/>

      <div className="k-menu-body">
        {sortedCats.map(cat => (
          <div key={cat}>
            <div className="k-menu-cat">{cat}</div>
            {grouped[cat].map((item, i) => (
              <div key={i} className="k-menu-item">
                <div className="k-menu-item-body">
                  <div className="k-menu-item-line">
                    <span className="k-menu-item-name">{item.name}</span>
                    <span className="k-menu-item-leader"/>
                    <span className="k-menu-item-price">{kraftMoney(item.suggested_price ?? item.suggestedPrice ?? 0, { bare: true })}</span>
                  </div>
                  {item.description && <div className="k-menu-item-desc">{item.description}</div>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <KraftFooter brand={brand} layout="centered"/>
    </div>
  )
}
