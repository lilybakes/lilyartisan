import {
  QuietBrandLockup, QuietEyebrow, QuietDot, QuietRule, QuietFooter, quietMoney,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Top: DC + brand left, TRADE · EFFECTIVE 31.07.2026 mono right.
 * Rust dot + title light sans, then description sans muted. Big space.
 * Table: PRODUCT / PACK / RETAIL / WHOLESALE(rust) / BATCH OF 10 mono.
 * Hairline row dividers, sans names, mono numbers, wholesale col rust.
 * ALL PRICES IN RM mono muted caption below.
 * Two-column: TERMS (list, no bullets) + TO ORDER (Call/Email/DM).
 * Hairline + split footer.
 */
export function QuietWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const effective = today.toLocaleDateString('en-GB').replace(/\//g, '.')  // 31.07.2026

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100
  const termsRaw    = brand.wholesale_terms_text ||
    `Prices valid 30 days · Minimum order ${moq} units per SKU · Orders by 6pm ready next morning · Nett 14 days or cash on collection · Custom flavours on request`
  const termsList   = termsRaw.split(/\s*·\s*|\n+/).map(s => s.trim()).filter(Boolean)

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
    <div className="tpl q-tpl q-wholesale printable">
      <header className="q-wholesale-header">
        <QuietBrandLockup brand={brand} size="sm" layout="inline"/>
        <QuietEyebrow className="q-wholesale-header-right">Trade · Effective {effective}</QuietEyebrow>
      </header>

      <div className="q-wholesale-title-block">
        <div className="q-wholesale-title-line">
          <QuietDot/>
          <h2 className="q-title q-wholesale-title">Wholesale Price List</h2>
        </div>
        <p className="q-wholesale-desc">
          Wholesale is {discountPct}% off retail. Minimum order {moq} units per SKU.
        </p>
      </div>

      <table className="q-wholesale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Pack</th>
            <th className="q-num">Retail</th>
            <th className="q-num q-wholesale-th-rust">Wholesale</th>
            <th className="q-num">Batch of {moq}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="q-wholesale-td-name">{it.name}</td>
              <td className="q-muted">{it.pack}</td>
              <td className="q-num q-muted">{it.retail.toFixed(2)}</td>
              <td className="q-num q-wholesale-td-price">{it.wholesale.toFixed(2)}</td>
              <td className="q-num">{it.batchMoq.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <QuietEyebrow className="q-wholesale-currency">All prices in {brand.currency || 'RM'}</QuietEyebrow>

      <div className="q-wholesale-terms-row">
        <div className="q-wholesale-terms-col">
          <QuietEyebrow>Terms</QuietEyebrow>
          <ul className="q-wholesale-terms-list">
            {termsList.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="q-wholesale-terms-col">
          <QuietEyebrow>To order</QuietEyebrow>
          <div className="q-wholesale-order-lines">
            {brand.phone && <div>{brand.phone}</div>}
            {brand.email && <div>{brand.email}</div>}
            {brand.instagram && (
              <div><span className="q-footer-social">@{brand.instagram}</span></div>
            )}
          </div>
        </div>
      </div>

      <div className="q-wholesale-footer-wrap">
        <QuietRule marginBottom="4mm"/>
        <QuietFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
