import {
  VerdantBrandLockup, VerdantEyebrow, VerdantChip, VerdantRule,
  VerdantHairRule, VerdantDecorCircle, VerdantFooter, verdantMoney,
} from './_parts.jsx'

/**
 * 05 — MENU INSERT  (A5 portrait) — counter / customer
 *
 * Brand block top-left, MENU · [MONTH YEAR] small caps green top-right.
 * Thick green horizontal rule. Each category rendered as a filled dark-
 * green rounded pill tag with cream small-caps letter-spaced text.
 * Items below: product name in bold serif on the left, description in
 * muted sans below, price in bold serif green on the right. Soft
 * decorative light-green circle floats mid-right. Centered footer.
 */
export function VerdantMenuInsert({ recipes = [], brand = {}, customization = {} }) {
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
    <div className="tpl v-tpl v-menu printable">
      <VerdantDecorCircle size={280} top="42%" right={-140} tone="mint-soft"/>

      <header className="v-menu-header">
        <VerdantBrandLockup brand={brand}/>
        <VerdantEyebrow className="v-menu-meta">{menuMeta}</VerdantEyebrow>
      </header>

      <VerdantRule/>

      <div className="v-menu-body">
        {sortedCats.length === 0 && (
          <p className="v-menu-empty">
            No recipes marked as "show in menu" — toggle via the Content drawer.
          </p>
        )}
        {sortedCats.map(cat => (
          <div key={cat} className="v-menu-cat-block">
            <VerdantChip tone="green" size="lg">{cat}</VerdantChip>
            <div className="v-menu-cat-items">
              {grouped[cat].map((item, i) => (
                <div key={i} className="v-menu-item">
                  <div className="v-menu-item-body">
                    <div className="v-menu-item-name">{item.name}</div>
                    {item.description && (
                      <div className="v-menu-item-desc">{item.description}</div>
                    )}
                  </div>
                  <div className="v-menu-item-price">
                    {verdantMoney(item.suggested_price || 0)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="v-menu-footer-wrap">
        <VerdantHairRule marginTop="auto"/>
        <VerdantFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
