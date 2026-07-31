import {
  EditorialLogo, EditorialEyebrow, EditorialRule, EditorialFooter,
  stylizeTitle, editorialMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait) — counter / customer
 *
 * Top: big serif brand name (italic accent on last word), small-caps
 * tagline below. Top-right: DC brown filled square + MENU · [MONTH YEAR]
 * small-caps meta. Thick horizontal black rule.
 *
 * Each category gets a FILLED RUST FLAG (small rectangle with cream text)
 * followed by a thick rust rule extending to the right edge — the visual
 * hook of the Editorial menu. Items below: bold serif name, muted sans
 * description, bold rust price right-aligned.
 */
export function EditorialMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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
    <div className="tpl e-tpl e-menu printable">
      <header className="e-menu-header">
        <div className="e-menu-brand-block">
          <h1 className="e-brand-name e-menu-brand-name">
            {stylizeTitle(brand.business_name || 'Your Bakery', 'last-word')}
          </h1>
          {brand.tagline && (
            <p className="e-brand-tagline-caps e-menu-brand-tag">{brand.tagline}</p>
          )}
        </div>
        <div className="e-menu-meta-block">
          <EditorialLogo brand={brand} size="md"/>
          <EditorialEyebrow tone="muted" className="e-menu-meta">{menuMeta}</EditorialEyebrow>
        </div>
      </header>

      <div className="e-menu-body">
        {sortedCats.length === 0 && (
          <p className="e-menu-empty">
            No recipes marked as "show in menu" — toggle via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="e-menu-cat-block">
            <div className="e-menu-cat-header">
              <span className="e-menu-cat-tag">{cat}</span>
              <span className="e-menu-cat-rule"/>
            </div>
            {grouped[cat].map((item, i) => (
              <div key={i} className="e-menu-item">
                <div className="e-menu-item-body">
                  <div className="e-menu-item-name">{item.name}</div>
                  {item.description && (
                    <div className="e-menu-item-desc">{item.description}</div>
                  )}
                </div>
                <div className="e-menu-item-price">
                  {editorialMoney(item.suggested_price || 0)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {customization.footer_line && (
        <p className="e-menu-footer-line">{customization.footer_line}</p>
      )}

      <EditorialRule tone="black" weight="hair" marginTop="6mm"/>

      <EditorialFooter brand={brand} layout="split"/>
    </div>
  )
}
