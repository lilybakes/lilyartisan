import {
  TrEyebrow, TrRule, TrFooter, trMoney, isoYearMonth,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait, 148×210mm) — counter/customer
 *
 * Dark navy grid paper.
 *
 * Header row: `The Daily Crumb` Manrope 800 white LEFT + mono subtitle
 * `ARTISAN BAKERY / IPOH`, teal mono `MENU / 2026-07` (ISO year-month) on
 * the RIGHT.
 *
 * Thin teal hair rule.
 *
 * Category blocks — each starts with a TEAL JetBrains Mono uppercase
 * wide-tracked eyebrow (BREAD, COOKIES, CAKES, MUFFINS) with a small hair
 * rule extending to the right of the label until it fades — code section
 * marker feel. NOT filled chips.
 *
 * Menu items: Manrope 700 off-white product name left, prices in TEAL
 * JetBrains Mono bold right (bare number, no RM prefix). Small mono
 * muted description under each name.
 *
 * Bottom: thin hair + centered footer.
 */
export function TrMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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

  const monthLabel = customization.header_eyebrow ||
    `MENU / ${isoYearMonth(new Date())}`

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  return (
    <div className="tpl tr-tpl tr-menu printable">
      <header className="tr-menu-header">
        <div className="tr-menu-brand">
          <div className="tr-menu-brand-name">
            {brand.business_name || 'The Daily Crumb'}
          </div>
          <div className="tr-menu-brand-sub">
            {(brand.tagline || 'ARTISAN BAKERY').toUpperCase()} / {cityLine.toUpperCase()}
          </div>
        </div>
        <TrEyebrow tone="teal" className="tr-menu-header-right">{monthLabel}</TrEyebrow>
      </header>

      <TrRule tone="hair" marginTop="3mm" marginBottom="6mm"/>

      <div className="tr-menu-body">
        {sortedCats.length === 0 && (
          <p className="tr-empty">// no recipes marked show_in_menu — toggle via Content drawer</p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="tr-menu-cat-block">
            <div className="tr-menu-cat-header">
              <span className="tr-menu-cat-label">{cat}</span>
              <span className="tr-menu-cat-rule"/>
            </div>
            <div className="tr-menu-cat-items">
              {grouped[cat].map((item, i) => (
                <div key={i} className="tr-menu-item">
                  <div className="tr-menu-item-body">
                    <div className="tr-menu-item-name">{item.name}</div>
                    {item.description && (
                      <div className="tr-menu-item-desc">{item.description}</div>
                    )}
                  </div>
                  <div className="tr-menu-item-price">
                    {trMoney(item.suggested_price || 0, { bare: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="tr-menu-footer-wrap">
        <TrRule tone="hair" marginTop="auto" marginBottom="3mm"/>
        <TrFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
