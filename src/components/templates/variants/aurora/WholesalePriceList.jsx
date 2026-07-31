import {
  AuBrandLockup, AuEyebrow, AuRule, AuFooter, auMoney,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Thin full-width gradient band at top (~25mm) with brand lockup left
 * (white) and EFFECTIVE date white eyebrow right. Below on lavender
 * paper: massive Manrope extrabold title + description. Table with a
 * GRADIENT-FILLED header row (white text, WHOLESALE column highlighted
 * with a brighter pink cell). Two-col TERMS + TO ORDER, signature rules,
 * split footer.
 */
export function AuWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB').replace(/\//g, '.')

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100

  const descText     = brand.wholesale_description ||
    `Wholesale is ${discountPct}% below retail. Minimum order ${moq} units per line.`

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
    <div className="tpl au-tpl au-wholesale printable">
      <header className="au-wholesale-header">
        <AuBrandLockup brand={brand} size="sm" tone="cream"/>
        <div className="au-wholesale-header-right">EFFECTIVE {dateStr}</div>
      </header>

      <div className="au-wholesale-body">
        <div className="au-wholesale-title-block">
          <AuEyebrow tone="purple">Wholesale · Trade Rates</AuEyebrow>
          <h2 className="au-title au-wholesale-title">Wholesale Price List</h2>
          <p className="au-wholesale-desc">{descText}</p>
        </div>

        <table className="au-wholesale-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Pack</th>
              <th className="au-num">Retail</th>
              <th className="au-num au-wholesale-th-hot">Wholesale</th>
              <th className="au-num">{moq} Units</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className="au-wholesale-td-name">{it.name.toUpperCase()}</td>
                <td className="au-muted">{it.pack.toUpperCase()}</td>
                <td className="au-num au-muted">{auMoney(it.retail, { bare: true })}</td>
                <td className="au-num au-wholesale-td-price">{auMoney(it.wholesale, { bare: true })}</td>
                <td className="au-num">{auMoney(it.batchMoq, { bare: true })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="au-wholesale-currency">ALL PRICES IN RINGGIT</div>

        <div className="au-wholesale-terms-row">
          <div className="au-wholesale-terms-col">
            <AuEyebrow tone="purple">Terms</AuEyebrow>
            <ul className="au-wholesale-terms-list">
              {termsList.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          <div className="au-wholesale-terms-col">
            <AuEyebrow tone="purple">To Order</AuEyebrow>
            <div className="au-wholesale-order-lines">
              {brand.phone && <div>{brand.phone}</div>}
              {brand.email && <div>{brand.email.toUpperCase()}</div>}
              {brand.instagram && (
                <div>@{brand.instagram}</div>
              )}
            </div>
          </div>
        </div>

        <div className="au-wholesale-sig-row">
          <div className="au-wholesale-sig-cell">
            <div className="au-wholesale-sig-line"/>
            <AuEyebrow tone="purple">Authorised Signature</AuEyebrow>
          </div>
          <div className="au-wholesale-sig-cell">
            <div className="au-wholesale-sig-line"/>
            <AuEyebrow tone="purple">Date</AuEyebrow>
          </div>
        </div>

        <div className="au-wholesale-footer-wrap">
          <AuRule marginTop="auto" marginBottom="4mm"/>
          <AuFooter brand={brand} layout="split"/>
        </div>
      </div>
    </div>
  )
}
