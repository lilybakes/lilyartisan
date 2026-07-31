import {
  BhBrandLockup, BhEyebrow, BhRule, BhFooter,
  bhMoney,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait, 210×297mm) — B2B buyer
 *
 * Top: brand lockup top-left, small YELLOW filled chip "EFFECTIVE 31 JULY
 * 2026" right-aligned. Thick 2px black rule under the header row.
 *
 * Title block: Archivo Black "WHOLESALE PRICE LIST" left. Big red solid
 * box top-right (~65mm wide) with white text — "TRADE TERMS / 30% OFF /
 * MOQ 10 UNITS PER SKU". Feels like a stamp.
 *
 * Table: BLACK filled header row (Manrope 700 uppercase, cream text).
 * WHOLESALE column header cell filled BLUE, BATCH OF 10 column header
 * filled YELLOW — the highlighted columns. Thin black borders on all
 * cells, sharp corners.
 *
 * Two column footer: TERMS (bulleted list) + TO ORDER (contact lines).
 * Signature/date row with thick black lines below. Split footer.
 */
export function BhWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const dateStr = today
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    .toUpperCase()

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100

  const descText     = brand.wholesale_description ||
    `Wholesale is ${discountPct}% below retail. Minimum order ${moq} units per line.`

  const termsRaw = brand.wholesale_terms_text ||
    `Prices hold for 30 days from the effective date. · Minimum order ${moq} units per line. · Orders placed before 6pm are ready the next morning. · Net 14 days, or cash on collection. · Custom flavours on request.`
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
    <div className="tpl bh-tpl bh-wholesale printable">
      <header className="bh-wholesale-header">
        <BhBrandLockup brand={brand} size="sm"/>
        <div className="bh-wholesale-effective">
          <span>EFFECTIVE {dateStr}</span>
        </div>
      </header>

      <BhRule weight="thick" marginTop="4mm" marginBottom="8mm"/>

      <div className="bh-wholesale-title-row">
        <div className="bh-wholesale-title-left">
          <BhEyebrow tone="blue">Trade Sheet</BhEyebrow>
          <h2 className="bh-title bh-wholesale-title">WHOLESALE PRICE LIST</h2>
          <p className="bh-wholesale-desc">{descText}</p>
        </div>

        <div className="bh-wholesale-terms-card">
          <div className="bh-wholesale-terms-card-eyebrow">TRADE TERMS</div>
          <div className="bh-wholesale-terms-card-big">{discountPct}% OFF</div>
          <div className="bh-wholesale-terms-card-sub">MOQ {moq} UNITS / SKU</div>
        </div>
      </div>

      <table className="bh-wholesale-table">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>PACK</th>
            <th className="bh-num">RETAIL</th>
            <th className="bh-num bh-wholesale-th-blue">WHOLESALE</th>
            <th className="bh-num bh-wholesale-th-yellow">BATCH OF {moq}</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan="5" className="bh-wholesale-empty">
              No recipes marked "show in menu" — toggle via the Content drawer.
            </td></tr>
          ) : items.map((it, i) => (
            <tr key={i}>
              <td className="bh-wholesale-td-name">{it.name.toUpperCase()}</td>
              <td className="bh-muted">{it.pack.toUpperCase()}</td>
              <td className="bh-num bh-muted">{bhMoney(it.retail, { bare: true })}</td>
              <td className="bh-num bh-wholesale-td-price">{bhMoney(it.wholesale, { bare: true })}</td>
              <td className="bh-num">{bhMoney(it.batchMoq, { bare: true })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <BhEyebrow tone="muted" className="bh-wholesale-currency">All prices in ringgit</BhEyebrow>

      <div className="bh-wholesale-terms-row">
        <div className="bh-wholesale-terms-col">
          <BhEyebrow tone="red">Ordering Terms</BhEyebrow>
          <ul className="bh-wholesale-terms-list">
            {termsList.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="bh-wholesale-terms-col">
          <BhEyebrow tone="blue">To Order</BhEyebrow>
          <div className="bh-wholesale-order-lines">
            {brand.phone && <div>{brand.phone}</div>}
            {brand.email && <div>{brand.email.toUpperCase()}</div>}
            {brand.instagram && (
              <div>@{brand.instagram}</div>
            )}
          </div>
        </div>
      </div>

      <div className="bh-wholesale-sig-row">
        <div className="bh-wholesale-sig-cell">
          <div className="bh-wholesale-sig-line"/>
          <BhEyebrow tone="muted">Authorised Signature</BhEyebrow>
        </div>
        <div className="bh-wholesale-sig-cell">
          <div className="bh-wholesale-sig-line"/>
          <BhEyebrow tone="muted">Date</BhEyebrow>
        </div>
      </div>

      <div className="bh-wholesale-footer-wrap">
        <BhRule weight="thick" marginTop="auto" marginBottom="4mm"/>
        <BhFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
