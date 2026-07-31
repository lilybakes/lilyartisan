import {
  QuietBrandLockup, QuietEyebrow, QuietRule, QuietFooter, quietMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait) — counter / customer
 *
 * Top: textonly brand left, MENU · [MONTH YEAR] mono right. Big space.
 * Each category is drawn with a thin vertical RUST BAR to the left of the
 * items block, spanning the block's height. The category label ("BREAD",
 * "COOKIES") sits in mono rust to the right of the bar, near the top.
 * Item rows: sans name left, muted sans description below, mono price
 * right-aligned. Hairline + split footer.
 */
export function QuietMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const menuMeta = customization.header_eyebrow || `Menu · ${monthYear}`

  return (
    <div className="tpl q-tpl q-menu printable">
      <header className="q-menu-header">
        <QuietBrandLockup brand={brand} layout="textonly"/>
        <QuietEyebrow className="q-menu-meta">{menuMeta}</QuietEyebrow>
      </header>

      <div className="q-menu-body">
        {sortedCats.length === 0 && (
          <p className="q-menu-empty">
            No recipes marked as "show in menu" — toggle via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="q-menu-cat-block">
            <div className="q-menu-cat-bar"/>
            <div className="q-menu-cat-label">
              <QuietEyebrow tone="rust">{cat}</QuietEyebrow>
            </div>
            <div className="q-menu-cat-items">
              {grouped[cat].map((item, i) => (
                <div key={i} className="q-menu-item">
                  <div className="q-menu-item-body">
                    <div className="q-menu-item-name">{item.name}</div>
                    {item.description && (
                      <div className="q-menu-item-desc">{item.description}</div>
                    )}
                  </div>
                  <div className="q-menu-item-price">
                    {quietMoney(item.suggested_price || 0, { bare: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="q-menu-footer-wrap">
        <QuietRule marginBottom="4mm"/>
        <QuietFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
