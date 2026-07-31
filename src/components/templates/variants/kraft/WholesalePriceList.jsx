import { KraftBrandLockup, KraftDoubleRule, KraftSeal, KraftFooter } from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * FIELD MAPPING:
 *   brand.wholesale_discount_pct — % off retail (default 30)
 *   brand.wholesale_moq           — MOQ per SKU (default 10)
 *   brand.wholesale_terms_text    — bulleted list (split on ' · ' or newlines)
 *   Product / retail from each recipe
 *   Wholesale = retail * (1 - discount/100)
 *   Batch of MOQ = wholesale * MOQ
 */
export function KraftWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const effective = today.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const year         = today.getFullYear()
  const discountPct  = Number(brand.wholesale_discount_pct) || 30
  const moq          = Number(brand.wholesale_moq) || 10
  const factor       = 1 - discountPct / 100
  const termsRaw     = brand.wholesale_terms_text ||
    'Prices valid 30 days from the effective date · Minimum order 10 units per SKU · Orders placed by 6pm are ready next morning · Nett 14 days, or cash on collection · Custom flavours on request'
  const termsList    = termsRaw.split(/\s*·\s*|\n+/).map(s => s.trim()).filter(Boolean)

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
            <b>{discountPct}% off retail</b><br/>MOQ {moq} units per SKU
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
            <th className="k-num">Batch of {moq}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i}>
              <td className="k-name">{it.name}</td>
              <td>{it.pack}</td>
              <td className="k-num">{it.retail.toFixed(2)}</td>
              <td className="k-num k-wprice">{it.wholesale.toFixed(2)}</td>
              <td className="k-num">{it.batchMoq.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="k-wholesale-caption">All prices in Malaysian Ringgit (RM).</div>

      <div className="k-eyebrow k-wholesale-terms-title">Ordering Terms</div>
      <ul className="k-wholesale-terms-list">
        {termsList.map((t, i) => <li key={i}>{t}</li>)}
      </ul>

      <div className="k-wholesale-seal-wrap">
        <KraftSeal text={`TRADE / PRICES / ${year}`} size={98} rotation={-5}/>
      </div>

      <KraftFooter brand={brand} layout="split" showSocials={false}/>
    </div>
  )
}
