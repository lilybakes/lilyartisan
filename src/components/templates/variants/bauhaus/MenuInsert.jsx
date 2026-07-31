import {
  BhEyebrow, BhRule, BhShapeChip, BhFooter, bhMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait, 148×210mm) — counter / customer
 *
 * Top ~30mm: wide solid BLACK rectangle center-top (~60% width), with a
 * YELLOW quarter-circle bulging in from the top-left corner and a RED
 * quarter-circle bulging in from the top-right corner. Very graphic and
 * iconic. Brand wordmark sits on top of the black rectangle in cream.
 *
 * MENU · JULY 2026 blue eyebrow centered. Then category blocks — each
 * starts with a solid rectangle chip badge (BREAD/blue, COOKIES/yellow,
 * CAKES/red, MUFFINS/black — from the mapping). Items below:
 *
 *   - Product name in Archivo Black uppercase
 *   - Muted body description
 *   - Bare number price right-aligned in bold
 *
 * Thick black rule + centered footer at the bottom.
 */
const CATEGORY_COLORS = {
  BREAD:    'blue',
  COOKIES:  'yellow',
  CAKES:    'red',
  MUFFINS:  'black',
  PASTRIES: 'blue',
  OTHER:    'black',
}

export function BhMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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
    <div className="tpl bh-tpl bh-menu printable">
      {/* --- Top shape composition: black rect + yellow QC + red QC --- */}
      <div className="bh-menu-top">
        <div className="bh-menu-top-yellow"/>
        <div className="bh-menu-top-black">
          <div className="bh-menu-brand-name">
            {(brand.business_name || 'Your Bakery').toUpperCase()}
          </div>
        </div>
        <div className="bh-menu-top-red"/>
      </div>

      <header className="bh-menu-header">
        <BhEyebrow tone="blue">{customization.header_eyebrow || 'Menu · July 2026'}</BhEyebrow>
      </header>

      <div className="bh-menu-body">
        {sortedCats.length === 0 && (
          <p className="bh-menu-empty">
            No recipes marked as "show in menu" — toggle via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="bh-menu-cat-block">
            <div className="bh-menu-cat-badge">
              <BhShapeChip color={CATEGORY_COLORS[cat] || 'black'} size="md">{cat}</BhShapeChip>
            </div>
            <div className="bh-menu-cat-items">
              {grouped[cat].map((item, i) => (
                <div key={i} className="bh-menu-item">
                  <div className="bh-menu-item-body">
                    <div className="bh-menu-item-name">{item.name.toUpperCase()}</div>
                    {item.description && (
                      <div className="bh-menu-item-desc">{item.description}</div>
                    )}
                  </div>
                  <div className="bh-menu-item-price">
                    {bhMoney(item.suggested_price || 0, { bare: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bh-menu-footer-wrap">
        <BhRule weight="thick" marginTop="auto" marginBottom="4mm"/>
        <BhFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
