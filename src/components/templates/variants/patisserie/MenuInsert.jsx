import {
  PaEyebrow, PaRule, PaShortRule, PaSubtitle, PaFooter, paMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait, 148×210mm) — counter / customer
 *
 * Very airy and centered. Gold frame. Brand name burgundy Cormorant
 * centered top, italic muted subtitle, short gold rule, mauve "MENU"
 * eyebrow. Category labels (BREAD, COOKIES, CAKES, MUFFINS) render as
 * mauve tracked caps centered above each group — delicate labels, not
 * chips. Menu items: name in dark burgundy Cormorant regular, italic
 * muted description below, price in burgundy Cormorant right-aligned.
 * No chips, no boxes — reads like a delicate print menu.
 */
export function PaMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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

  const tagline = brand.tagline || 'Artisan bakery'
  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const brandSubtitle = `${tagline} — ${cityLine}`

  return (
    <div className="tpl pa-tpl pa-menu printable">
      <div className="pa-frame">
        <header className="pa-menu-header">
          <div className="pa-menu-brand-name">{brand.business_name || 'Your Bakery'}</div>
          <PaSubtitle className="pa-menu-brand-tag">{brandSubtitle}</PaSubtitle>
          <PaShortRule/>
          <PaEyebrow>{customization.header_eyebrow || 'Menu'}</PaEyebrow>
        </header>

        <div className="pa-menu-body">
          {sortedCats.length === 0 && (
            <p className="pa-menu-empty">
              No recipes marked as "show in menu" — toggle via the Content drawer.
            </p>
          )}
          {sortedCats.map(cat => (
            <div key={cat} className="pa-menu-cat-block">
              <PaEyebrow className="pa-menu-cat-label">{cat}</PaEyebrow>
              <div className="pa-menu-cat-items">
                {grouped[cat].map((item, i) => (
                  <div key={i} className="pa-menu-item">
                    <div className="pa-menu-item-body">
                      <div className="pa-menu-item-name">{item.name}</div>
                      {item.description && (
                        <div className="pa-menu-item-desc">{item.description}</div>
                      )}
                    </div>
                    <div className="pa-menu-item-price">
                      {paMoney(item.suggested_price || 0, { bare: true })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pa-menu-footer-wrap">
          <PaRule marginTop="auto" marginBottom="4mm"/>
          <PaFooter brand={brand} layout="centered"/>
        </div>
      </div>
    </div>
  )
}
