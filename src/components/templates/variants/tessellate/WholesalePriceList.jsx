import {
  TeBrandLockup, TeEyebrow, TeRule, TeShortRule, TeFooter,
  teMoney, spellOutNumber,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Top: rust×brown×cream diagonal band (~12mm). Brand top-left,
 * EFFECTIVE date mono top-right. Bold Manrope title + short rule +
 * spelled-out description ("thirty per cent below retail…").
 *
 * Table with FILLED NAVY HEADER row (white mono column labels) and the
 * WHOLESALE column's header cell filled RUST — the eye-catch on the
 * highlighted column. Body rows on cream with hairline separators. All
 * prices bare (no RM), mono tabular numerals.
 *
 * Two columns: TERMS + TO ORDER. Two signature/date rules. Split footer.
 */
export function TeWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB').replace(/\//g, '.')  // "31.07.2026"

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100

  const discountWord = spellOutNumber(discountPct, { mode: 'lower' }) || String(discountPct)
  const moqWord      = spellOutNumber(moq,         { mode: 'lower' }) || String(moq)
  const descText     = brand.wholesale_description ||
    `Wholesale is ${discountWord} per cent below retail. Minimum order ${moqWord} units per line.`

  const termsRaw = brand.wholesale_terms_text ||
    `Prices hold for thirty days from the effective date. · Minimum order ${moqWord} units per line. · Orders placed before six in the evening are ready the next morning. · Nett fourteen days, or cash on collection. · Custom flavours on request.`
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
    <div className="tpl te-tpl te-wholesale printable">
      <div className="te-stripe-band te-stripe-rust-brown-cream te-wholesale-stripe"/>

      <header className="te-wholesale-header">
        <TeBrandLockup brand={brand} size="sm"/>
        <TeEyebrow tone="muted" className="te-wholesale-header-right">Effective {dateStr}</TeEyebrow>
      </header>

      <div className="te-wholesale-title-block">
        <h2 className="te-title te-wholesale-title">Wholesale Price List</h2>
        <TeShortRule/>
        <p className="te-wholesale-desc">{descText}</p>
      </div>

      <table className="te-wholesale-table">
        <thead>
          <tr>
            <th className="te-wholesale-th">Product</th>
            <th className="te-wholesale-th">Pack</th>
            <th className="te-wholesale-th te-num">Retail</th>
            <th className="te-wholesale-th te-wholesale-th-accent te-num">Wholesale</th>
            <th className="te-wholesale-th te-num">{moqWord} units</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="te-wholesale-td-name">{it.name.toUpperCase()}</td>
              <td className="te-muted">{it.pack.toUpperCase()}</td>
              <td className="te-num te-muted">{teMoney(it.retail, { bare: true })}</td>
              <td className="te-num te-wholesale-td-price">{teMoney(it.wholesale, { bare: true })}</td>
              <td className="te-num">{teMoney(it.batchMoq, { bare: true })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <TeEyebrow tone="muted" className="te-wholesale-currency">All prices in ringgit</TeEyebrow>

      <div className="te-wholesale-terms-row">
        <div className="te-wholesale-terms-col">
          <TeEyebrow tone="rust">Terms</TeEyebrow>
          <ul className="te-wholesale-terms-list">
            {termsList.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="te-wholesale-terms-col">
          <TeEyebrow tone="rust">To Order</TeEyebrow>
          <div className="te-wholesale-order-lines">
            {brand.phone && <div>{brand.phone}</div>}
            {brand.email && <div>{brand.email.toUpperCase()}</div>}
            {brand.instagram && (
              <div>@{brand.instagram}</div>
            )}
          </div>
        </div>
      </div>

      <div className="te-wholesale-sig-row">
        <div className="te-wholesale-sig-cell">
          <div className="te-wholesale-sig-line"/>
          <TeEyebrow tone="muted">Authorised Signature</TeEyebrow>
        </div>
        <div className="te-wholesale-sig-cell">
          <div className="te-wholesale-sig-line"/>
          <TeEyebrow tone="muted">Date</TeEyebrow>
        </div>
      </div>

      <div className="te-wholesale-footer-wrap">
        <TeRule marginTop="auto" marginBottom="4mm"/>
        <TeFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
