import { KraftBrandLockup, KraftDoubleRule, KraftSeal, KraftFooter, kraftMoney } from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait, 210×297mm) — B2B buyer
 *
 * Matches Image 1 (Wholesale Price List):
 *   • Header lockup left
 *   • Double horizontal rules
 *   • Left: "Wholesale Price List" big slab + italic effective date
 *   • Right: brown-bordered rectangle "TRADE TERMS" section
 *   • Table with dotted separators
 *     Header: PRODUCT · PACK · RETAIL · WHOLESALE · BATCH OF 10 (tracked caps brown)
 *     Rows: name bold ink | pack | retail | WHOLESALE bold brown | batch
 *   • Italic muted "All prices in Malaysian Ringgit (RM)."
 *   • "ORDERING TERMS" eyebrow + bulleted list
 *   • Bottom-right: dashed circular seal "TRADE PRICES 2026"
 *   • Dashed-divider split footer
 */
export function KraftWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const effective = today.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const year = today.getFullYear()

  const items = recipes.map(r => {
    const retail = Number(r.suggested_price ?? r.suggestedPrice ?? 0)
    const wholesale = +(retail * 0.7).toFixed(2)  // 30% off retail
    const batch10 = +(wholesale * 10).toFixed(2)
    return {
      name: r.name,
      pack: r.category === 'Bread' ? '1 loaf' : '1 piece',
      retail, wholesale, batch10,
    }
  })

  return (
    <div className="tpl k-tpl k-wholesale printable">
      <header className="k-wholesale-header">
        <KraftBrandLockup brand={brand} size="md" layout="row"/>
      </header>

      <KraftDoubleRule/>

      <div className="k-wholesale-title-block">
        <div className="k-wholesale-title-left">
          <h2>Wholesale Price List</h2>
          <div className="k-wholesale-effective">Effective {effective}</div>
        </div>
        <div className="k-wholesale-terms-box">
          <div className="k-eyebrow">Trade Terms</div>
          <div className="k-wholesale-terms-body">
            <b>30% off retail</b><br/>MOQ 10 units per SKU
          </div>
        </div>
      </div>

      <table className="k-wholesale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Pack</th>
            <th className="k-num">Retail</th>
            <th className="k-num">Wholesale</th>
            <th className="k-num">Batch of 10</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="k-name">{it.name}</td>
              <td>{it.pack}</td>
              <td className="k-num">{it.retail.toFixed(2)}</td>
              <td className="k-num k-wprice">{it.wholesale.toFixed(2)}</td>
              <td className="k-num">{it.batch10.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="k-wholesale-caption">All prices in Malaysian Ringgit (RM).</div>

      <div className="k-eyebrow k-wholesale-terms-title">Ordering Terms</div>
      <ul className="k-wholesale-terms-list">
        <li>Prices valid 30 days from the effective date</li>
        <li>Minimum order 10 units per SKU</li>
        <li>Orders placed by 6pm are ready next morning</li>
        <li>Nett 14 days, or cash on collection</li>
        <li>Custom flavours on request</li>
      </ul>

      <div className="k-wholesale-seal-wrap">
        <KraftSeal text={`TRADE / PRICES / ${year}`} size={98} rotation={-5}/>
      </div>

      <KraftFooter brand={brand} layout="split" showSocials={false}/>
    </div>
  )
}
