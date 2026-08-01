import {
  TrBrandLockup, TrEyebrow, TrRule, TrStatusChip, TrFooter,
  trMoney, isoDate,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait, 210×297mm) — B2B buyer
 *
 * Dark navy grid paper.
 *
 * Header row: brand lockup left (DC square + name + `ARTISAN BAKERY / IPOH`
 * subtitle), `EFFECTIVE 2026-07-31` teal-outlined chip right (ISO date).
 *
 * Thin teal hair rule.
 *
 * Title row: `TRADE / PRICE_LIST` teal mono eyebrow, big Manrope 800 white
 * title "Wholesale Price List", muted italic description below. RIGHT:
 * DISCOUNT box with thin teal border, teal mono `DISCOUNT` eyebrow, HUGE
 * teal mono `-30%`, mono lowercase `moq: 10 units / sku`.
 *
 * Table: teal-filled header row (dark navy text on teal, mono uppercase
 * wide-tracked — `PRODUCT` `PACK` `RETAIL` `WHOLESALE` `×10`). Body rows
 * on dark with teal-tinted hairlines, WHOLESALE column values in bold
 * teal mono, other prices in mono muted.
 *
 * `// ALL PRICES IN MYR` double-slash comment style mono dim caption.
 *
 * Two-column: TERMS (teal eyebrow + off-white bullet list) + TO ORDER
 * (teal eyebrow + contact lines, @thedailycrumb bright teal). Signature
 * lines with mono uppercase labels above thin teal rules.
 *
 * Split footer.
 */
export function TrWholesalePriceList({ recipes = [], brand = {} }) {
  const dateStr = isoDate(new Date())

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100

  const descText = brand.wholesale_description ||
    `Trade pricing for regular buyers. Wholesale is ${discountPct}% below retail. Minimum order ${moq} units per SKU.`

  const termsRaw = brand.wholesale_terms_text ||
    `Prices hold for 30 days from the effective date. · Minimum order ${moq} units per SKU. · Orders placed before 18:00 ready next morning. · Net 14 days, or cash on collection. · Custom flavours on request.`
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
    <div className="tpl tr-tpl tr-wholesale printable">
      <header className="tr-wholesale-header">
        <TrBrandLockup brand={brand} size="sm"/>
        <TrStatusChip tone="teal" bullet={false}>EFFECTIVE {dateStr}</TrStatusChip>
      </header>

      <TrRule tone="hair" marginTop="4mm" marginBottom="6mm"/>

      <div className="tr-wholesale-title-row">
        <div className="tr-wholesale-title-left">
          <TrEyebrow tone="teal" className="tr-wholesale-eyebrow">TRADE / PRICE_LIST</TrEyebrow>
          <h2 className="tr-wholesale-title">Wholesale Price List</h2>
          <p className="tr-wholesale-desc">{descText}</p>
        </div>
        <aside className="tr-wholesale-discount-card">
          <div className="tr-wholesale-discount-label">DISCOUNT</div>
          <div className="tr-wholesale-discount-value">-{discountPct}%</div>
          <div className="tr-wholesale-discount-moq">moq: {moq} units / sku</div>
        </aside>
      </div>

      <table className="tr-wholesale-table">
        <thead>
          <tr>
            <th>PRODUCT</th>
            <th>PACK</th>
            <th className="tr-num">RETAIL</th>
            <th className="tr-num">WHOLESALE</th>
            <th className="tr-num">×{moq}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="tr-wholesale-td-name">{it.name}</td>
              <td className="tr-muted">{it.pack}</td>
              <td className="tr-num tr-muted">{trMoney(it.retail, { bare: true })}</td>
              <td className="tr-num tr-wholesale-td-price">{trMoney(it.wholesale, { bare: true })}</td>
              <td className="tr-num">{trMoney(it.batchMoq, { bare: true })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="tr-wholesale-currency">// ALL PRICES IN MYR</div>

      <div className="tr-wholesale-terms-row">
        <div className="tr-wholesale-terms-col">
          <TrEyebrow tone="teal">TERMS</TrEyebrow>
          <ul className="tr-wholesale-terms-list">
            {termsList.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="tr-wholesale-terms-col">
          <TrEyebrow tone="teal">TO ORDER</TrEyebrow>
          <div className="tr-wholesale-order-lines">
            {brand.phone && <div>{brand.phone}</div>}
            {brand.email && <div>{brand.email}</div>}
            {brand.instagram && (
              <div className="tr-wholesale-order-handle">@{brand.instagram}</div>
            )}
          </div>
        </div>
      </div>

      <div className="tr-wholesale-sig-row">
        <div className="tr-wholesale-sig-cell">
          <div className="tr-wholesale-sig-line"/>
          <TrEyebrow tone="muted">AUTHORISED SIGNATURE</TrEyebrow>
        </div>
        <div className="tr-wholesale-sig-cell">
          <div className="tr-wholesale-sig-line"/>
          <TrEyebrow tone="muted">DATE</TrEyebrow>
        </div>
      </div>

      <div className="tr-wholesale-footer-wrap">
        <TrRule tone="hair" marginTop="auto" marginBottom="3mm"/>
        <TrFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
