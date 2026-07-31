import {
  FiBrandLockup, FiEyebrow, FiRule, FiShortRule, FiFooter,
  fiMoney, spellOutNumber,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Brand top-left, EFFECTIVE date small caps letter-tracked top-right.
 * Massive letter-tracked light title + short thin rule + sans description
 * with spelled-out numbers ("thirty per cent below retail. Minimum order
 * ten units per line.").
 *
 * Hairline table with small-caps column headers. Product names uppercased
 * light sans, prices bare (no RM), wholesale column bold. "ALL PRICES IN
 * RINGGIT" small caps caption below.
 *
 * Two columns: TERMS (bulletless list, spelled-out numbers throughout)
 * and TO ORDER (contact lines with @handle). Two signature/date rules
 * with small-caps labels. Split footer.
 */
export function FiWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB').replace(/\//g, '.')  // "31.07.2026"

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100

  const discountWord = spellOutNumber(discountPct, { mode: 'lower' }) || String(discountPct)
  const moqWord      = spellOutNumber(moq,         { mode: 'lower' }) || String(moq)
  const descText     = brand.wholesale_description ||
    `Wholesale is ${discountWord} per cent below retail. Minimum order ${moqWord} units per line.`

  // Default terms use spelled-out numbers throughout — matches the mockup
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
    <div className="tpl fi-tpl fi-wholesale printable">
      <header className="fi-wholesale-header">
        <FiBrandLockup brand={brand} size="sm"/>
        <FiEyebrow tone="muted" className="fi-wholesale-header-right">Effective {dateStr}</FiEyebrow>
      </header>

      <div className="fi-wholesale-title-block">
        <h2 className="fi-title fi-wholesale-title">Wholesale Price List</h2>
        <FiShortRule/>
        <p className="fi-wholesale-desc">{descText}</p>
      </div>

      <table className="fi-wholesale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Pack</th>
            <th className="fi-num">Retail</th>
            <th className="fi-num">Wholesale</th>
            <th className="fi-num">{moqWord} units</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="fi-wholesale-td-name">{it.name.toUpperCase()}</td>
              <td className="fi-muted">{it.pack.toUpperCase()}</td>
              <td className="fi-num fi-muted">{fiMoney(it.retail, { bare: true })}</td>
              <td className="fi-num fi-wholesale-td-price">{fiMoney(it.wholesale, { bare: true })}</td>
              <td className="fi-num">{fiMoney(it.batchMoq, { bare: true })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <FiEyebrow tone="muted" className="fi-wholesale-currency">All prices in ringgit</FiEyebrow>

      <div className="fi-wholesale-terms-row">
        <div className="fi-wholesale-terms-col">
          <FiEyebrow tone="muted">Terms</FiEyebrow>
          <ul className="fi-wholesale-terms-list">
            {termsList.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="fi-wholesale-terms-col">
          <FiEyebrow tone="muted">To Order</FiEyebrow>
          <div className="fi-wholesale-order-lines">
            {brand.phone && <div>{brand.phone}</div>}
            {brand.email && <div>{brand.email.toUpperCase()}</div>}
            {brand.instagram && (
              <div>@{brand.instagram}</div>
            )}
          </div>
        </div>
      </div>

      <div className="fi-wholesale-sig-row">
        <div className="fi-wholesale-sig-cell">
          <div className="fi-wholesale-sig-line"/>
          <FiEyebrow tone="muted">Authorised Signature</FiEyebrow>
        </div>
        <div className="fi-wholesale-sig-cell">
          <div className="fi-wholesale-sig-line"/>
          <FiEyebrow tone="muted">Date</FiEyebrow>
        </div>
      </div>

      <div className="fi-wholesale-footer-wrap">
        <FiRule marginTop="auto" marginBottom="4mm"/>
        <FiFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
