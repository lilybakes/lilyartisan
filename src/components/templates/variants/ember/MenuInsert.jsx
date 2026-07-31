import {
  EmberBrandLockup, EmberEyebrow, EmberCategoryTag, EmberRule, EmberFooter, emberMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait) — counter / customer
 *
 * Brand heavy condensed uppercase left (typically wraps 2 lines), meta
 * stack right (ARTISAN BAKERY line + MENU · MONTH YEAR line). Thick black
 * rule. Each category is a FILLED EMBER rectangle tag (BREAD, COOKIES,
 * CAKES, MUFFINS). Items below: product name heavy condensed uppercase
 * black, muted sans description, bare-number price bold ember right.
 * Hairline + centered footer.
 */
export function EmberMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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
    <div className="tpl em-tpl em-menu printable">
      <header className="em-menu-header">
        <EmberBrandLockup brand={brand} size="lg"/>
        <div className="em-menu-meta-block">
          {brand.tagline && (
            <EmberEyebrow tone="muted">{brand.tagline}</EmberEyebrow>
          )}
          <EmberEyebrow tone="muted">{menuMeta}</EmberEyebrow>
        </div>
      </header>

      <EmberRule/>

      <div className="em-menu-body">
        {sortedCats.length === 0 && (
          <p className="em-menu-empty">
            No recipes marked as "show in menu" — toggle via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="em-menu-cat-block">
            <EmberCategoryTag>{cat}</EmberCategoryTag>
            <div className="em-menu-cat-items">
              {grouped[cat].map((item, i) => (
                <div key={i} className="em-menu-item">
                  <div className="em-menu-item-body">
                    <div className="em-menu-item-name">{item.name.toUpperCase()}</div>
                    {item.description && (
                      <div className="em-menu-item-desc">{item.description}</div>
                    )}
                  </div>
                  <div className="em-menu-item-price">
                    {emberMoney(item.suggested_price || 0, { bare: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="em-menu-footer-wrap">
        <EmberRule marginTop="auto" weight="hair" marginBottom="4mm"/>
        <EmberFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
