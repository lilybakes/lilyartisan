import {
  RpOffsetTitle, RpBrandLockup, RpEyebrow, RpRule, RpFooter,
  rpMoney,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Brand top-left. RUST filled chip "EFFECTIVE 31 JULY 2026" top-right.
 * Thick navy rule. Big partial RUST circle bleeding off the LEFT edge in
 * the upper-middle behind the title — the offset-effect title layers
 * over the circle.
 *
 * Right column of the title row: solid NAVY TRADE TERMS card in cream:
 * TRADE TERMS / 30% off retail / MOQ 10 units per SKU.
 *
 * Table: navy header row, WHOLESALE column header is filled RUST (the
 * highlight). Ingredient rows on cream with hair rules, wholesale prices
 * rendered RUST bold. Terms + To Order two-column below, then two
 * signature rules, then split footer.
 */
export function RpWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100

  const descText = brand.wholesale_description ||
    `Wholesale pricing sits ${discountPct}% below our retail rates. Minimum order of ${moq} units per SKU applies to all lines below.`

  const termsRaw = brand.wholesale_terms_text ||
    `Prices hold for 30 days from the effective date. · Minimum order ${moq} units per line. · Orders placed before 6pm are ready the next morning. · Nett 14 days, or cash on collection. · Custom flavours on request.`
  const termsList = termsRaw.split(/\s*·\s*|\n+/).map(s => s.trim()).filter(Boolean)

  const visible = recipes.filter(r => r.show_in_menu !== false)

  const items = visible.map(r => {
    const retail    = Number(r.suggested_price) || 0
    const wholesale = +(retail * factor).toFixed(2)
    const batchMoq  = +(wholesale * moq).toFixed(2)
    return {
      name:      r.name,
      pack:      r.category === 'Bread' ? '1 loaf' : '1 piece',
      retail, wholesale, batchMoq,
    }
  })

  return (
    <div className="tpl rp-tpl rp-wholesale printable">
      <div className="rp-wholesale-corner" aria-hidden="true"/>

      <header className="rp-wholesale-header">
        <RpBrandLockup brand={brand}/>
        <div className="rp-wholesale-chip">Effective {dateStr}</div>
      </header>

      <RpRule tone="navy-thick" className="rp-wholesale-rule"/>

      <div className="rp-wholesale-title-row">
        <div className="rp-wholesale-title-block">
          <RpOffsetTitle size="md">Wholesale Price List</RpOffsetTitle>
          <p className="rp-wholesale-desc">{descText}</p>
        </div>
        <div className="rp-wholesale-terms-card">
          <RpEyebrow tone="rust">Trade Terms</RpEyebrow>
          <p><strong>{discountPct}%</strong> off retail</p>
          <p>Batch of <strong>{moq}</strong> per SKU</p>
        </div>
      </div>

      <table className="rp-wholesale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Pack</th>
            <th className="rp-num">Retail</th>
            <th className="rp-num rp-wholesale-th-price">Wholesale</th>
            <th className="rp-num">Batch of {moq}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="rp-wholesale-td-name">{it.name}</td>
              <td>{it.pack}</td>
              <td className="rp-num">{rpMoney(it.retail, { bare: true })}</td>
              <td className="rp-num rp-wholesale-td-price">{rpMoney(it.wholesale, { bare: true })}</td>
              <td className="rp-num">{rpMoney(it.batchMoq, { bare: true })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="rp-wholesale-terms-row">
        <div className="rp-wholesale-terms-col">
          <RpEyebrow tone="rust">Terms</RpEyebrow>
          <ul className="rp-wholesale-terms-list">
            {termsList.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="rp-wholesale-terms-col">
          <RpEyebrow tone="rust">To Order</RpEyebrow>
          <div className="rp-wholesale-order-lines">
            {brand.phone && <div>{brand.phone}</div>}
            {brand.email && <div>{brand.email}</div>}
            {brand.instagram && <div>@{brand.instagram}</div>}
          </div>
        </div>
      </div>

      <div className="rp-wholesale-sig-row">
        <div className="rp-wholesale-sig-cell">
          <div className="rp-wholesale-sig-line"/>
          <RpEyebrow tone="rust">Authorised Signature</RpEyebrow>
        </div>
        <div className="rp-wholesale-sig-cell">
          <div className="rp-wholesale-sig-line"/>
          <RpEyebrow tone="rust">Date</RpEyebrow>
        </div>
      </div>

      <div className="rp-wholesale-footer-wrap">
        <RpRule tone="navy-thick" className="rp-wholesale-footer-rule"/>
        <RpFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
