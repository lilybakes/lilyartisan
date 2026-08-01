import {
  RpOffsetTitle, RpEyebrow, RpRule, RpFooter, rpMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait, 148×210mm) — counter / customer
 *
 * Top-left: partial rust + navy overlapping circles bleeding into the
 * top-left corner (navy uses mix-blend-mode:multiply — deep-brown overlap).
 * Offset-effect brand name sits on top; MENU · JULY 2026 rust tracked
 * caps to the right.
 *
 * Thick navy rule underlines the header. Category badges (BREAD, COOKIES,
 * CAKES, MUFFINS) are solid NAVY chips. Items: bold navy name, muted
 * italic description, RUST bold price right-aligned.
 *
 * Big partial RUST circle bleeding off the RIGHT edge in the lower half
 * — prices layer on top of it so the circle appears "under" the digits.
 */
export function RpMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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
  const monthName = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const menuLabel = customization.header_eyebrow || `Menu · ${monthName}`

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  return (
    <div className="tpl rp-tpl rp-menu printable">
      <div className="rp-menu-shapes-top" aria-hidden="true">
        <div className="rp-circle rp-circle-rust"/>
        <div className="rp-circle rp-circle-navy rp-circle-blend"/>
      </div>
      <div className="rp-menu-shapes-bottom" aria-hidden="true">
        <div className="rp-circle rp-circle-rust"/>
      </div>

      <header className="rp-menu-header">
        <div className="rp-menu-brand-block">
          <RpOffsetTitle size="md">{brand.business_name || 'Your Bakery'}</RpOffsetTitle>
          <RpEyebrow tone="rust" className="rp-menu-header-eyebrow-tag">
            {(brand.tagline || 'Artisan bakery')} · {cityLine}
          </RpEyebrow>
        </div>
        <div className="rp-menu-header-right">
          <RpEyebrow tone="rust" className="rp-menu-header-eyebrow-rust">{menuLabel}</RpEyebrow>
        </div>
      </header>

      <RpRule tone="navy-thick" className="rp-menu-rule"/>

      <div className="rp-menu-body">
        {sortedCats.length === 0 && (
          <p className="rp-menu-empty">
            No recipes marked as "show in menu" — toggle via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="rp-menu-cat-block">
            <div className="rp-menu-cat-label">{cat}</div>
            <div className="rp-menu-cat-items">
              {grouped[cat].map((item, i) => (
                <div key={i} className="rp-menu-item">
                  <div className="rp-menu-item-body">
                    <div className="rp-menu-item-name">{item.name}</div>
                    {item.description && (
                      <div className="rp-menu-item-desc">{item.description}</div>
                    )}
                  </div>
                  <div className="rp-menu-item-price">
                    {rpMoney(item.suggested_price || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rp-menu-footer-wrap">
        <RpRule tone="hair" className="rp-menu-footer-rule"/>
        <RpFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
