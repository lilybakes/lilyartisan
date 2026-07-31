import {
  LetterpressBrandLockup, LetterpressDoubleRule, LetterpressFooter,
  letterpressDate, spellOutNumber,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Textonly brand block (no monogram) — the trade doc reads as formal.
 * Double horizontal rule. Left: title + italic "Effective the thirty-first
 * of July, 2026". Right: small-caps discount terms. Serif table with
 * elegant top/bottom rules and dotted row separators. Below: italic
 * currency caption, "TERMS OF TRADE" bulleted list, then Authorised
 * Signature + Date lines (formal-contract feel), then centered footer.
 *
 * Terms text is user-editable; on save we try to spell out numbers 1-99
 * for the letterpress voice, but preserve the user's phrasing if not.
 */
export function LetterpressWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const effective = letterpressDate(today)

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100
  const termsRaw    = brand.wholesale_terms_text ||
    `Prices valid ${spellOutNumber(30)} days from the effective date · Minimum order ${spellOutNumber(moq)} units per SKU · Orders placed by six in the evening are ready next morning · Nett ${spellOutNumber(14)} days, or cash on collection · Custom flavours on request`
  const termsList   = termsRaw.split(/\s*·\s*|\n+/).map(s => s.trim()).filter(Boolean)

  const visible = recipes.filter(r => r.show_in_menu !== false)

  const items = visible.map(r => {
    const retail    = Number(r.suggested_price) || 0
    const wholesale = +(retail * factor).toFixed(2)
    const batchMoq  = +(wholesale * moq).toFixed(2)
    return {
      name:  r.name,
      pack:  r.category === 'Bread' ? '1 loaf' : '1 piece',
      retail, wholesale, batchMoq,
    }
  })

  return (
    <div className="tpl l-tpl l-wholesale printable">
      <header className="l-wholesale-header">
        <LetterpressBrandLockup brand={brand} layout="textonly"/>
      </header>

      <LetterpressDoubleRule/>

      <div className="l-wholesale-title-block">
        <div className="l-wholesale-title-left">
          <h2 className="l-wholesale-title">Wholesale Price List</h2>
          <p className="l-wholesale-effective">Effective {effective}</p>
        </div>
        <div className="l-wholesale-terms-summary">
          <div className="l-eyebrow l-eyebrow-muted">
            Wholesale = {discountPct}% off retail
          </div>
          <div className="l-eyebrow l-eyebrow-muted">
            Minimum order {moq} units per SKU
          </div>
        </div>
      </div>

      <table className="l-wholesale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Pack</th>
            <th className="l-num">Retail</th>
            <th className="l-num">Wholesale</th>
            <th className="l-num">Batch of {moq}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="l-wholesale-name">{it.name}</td>
              <td>{it.pack}</td>
              <td className="l-num">{it.retail.toFixed(2)}</td>
              <td className="l-num l-wprice">{it.wholesale.toFixed(2)}</td>
              <td className="l-num">{it.batchMoq.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="l-wholesale-currency">All prices in Malaysian Ringgit.</p>

      <div className="l-eyebrow l-eyebrow-burgundy l-wholesale-terms-title">Terms of Trade</div>
      <ul className="l-wholesale-terms-list">
        {termsList.map((t, i) => <li key={i}>{t}</li>)}
      </ul>

      <div className="l-wholesale-sig-row">
        <div className="l-wholesale-sig-cell">
          <div className="l-wholesale-sig-line"/>
          <div className="l-eyebrow l-eyebrow-muted">Authorised Signature</div>
        </div>
        <div className="l-wholesale-sig-cell">
          <div className="l-wholesale-sig-line"/>
          <div className="l-eyebrow l-eyebrow-muted">Date</div>
        </div>
      </div>

      <LetterpressFooter brand={brand} showSocials={false}/>
    </div>
  )
}
