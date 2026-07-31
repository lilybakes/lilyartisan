import {
  TeEyebrow, TeRule, TeShortRule, TeDotRule, TeFooter, teMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait, 148×210mm) — counter / customer
 *
 * Top: full-width navy×cream CHECKERBOARD BAND (~15mm, 3 rows visible,
 * ~5mm tiles). Below, centered brand name bold, short rule, "MENU"
 * rust mono eyebrow.
 *
 * Category blocks — each starts with a rust mono label (BREAD, COOKIES,
 * CAKES) followed by a small-squares DOT RULE as the category divider,
 * then items:
 *   • Product name bold Manrope uppercased
 *   • Muted sans description
 *   • Bare mono price right-aligned (no currency prefix)
 *
 * Thin hairline + centered mono footer at the bottom.
 */
export function TeMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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
    <div className="tpl te-tpl te-menu printable">
      <div className="te-menu-band te-check-navy-cream"/>

      <header className="te-menu-header">
        <div className="te-menu-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <TeShortRule/>
        <TeEyebrow tone="rust">{customization.header_eyebrow || 'Menu'}</TeEyebrow>
      </header>

      <div className="te-menu-body">
        {sortedCats.length === 0 && (
          <p className="te-menu-empty">
            No recipes marked as "show in menu" — toggle via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="te-menu-cat-block">
            <TeEyebrow tone="rust" className="te-menu-cat-label">{cat}</TeEyebrow>
            <TeDotRule className="te-menu-cat-dots"/>
            <div className="te-menu-cat-items">
              {grouped[cat].map((item, i) => (
                <div key={i} className="te-menu-item">
                  <div className="te-menu-item-body">
                    <div className="te-menu-item-name">{item.name.toUpperCase()}</div>
                    {item.description && (
                      <div className="te-menu-item-desc">{item.description}</div>
                    )}
                  </div>
                  <div className="te-menu-item-price">
                    {teMoney(item.suggested_price || 0, { bare: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="te-menu-footer-wrap">
        <TeRule marginTop="auto" marginBottom="4mm"/>
        <TeFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
