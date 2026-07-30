import { BrandHeader, BrandFooter } from './parts.jsx'

function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

/**
 * Multi-recipe wholesale price list — for cafes, retailers, corporate orders.
 * Shows retail (suggested) alongside wholesale (retail × 0.7) and a per-batch
 * bulk price. A4 portrait.
 */
export function WholesalePriceList({ recipes, brand }) {
  const currency = brand.currency || 'RM'
  const items = (recipes || []).filter(r => r?.name)
  const wholesaleDiscount = 0.7  // 30% off retail

  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="tpl tpl-wholesale printable" style={{ '--brand': brand.brand_color }}>
      <BrandHeader brand={brand}/>

      <div className="tpl-wholesale-title-row">
        <div>
          <h1 className="tpl-wholesale-title">Wholesale Price List</h1>
          <div className="tpl-wholesale-effective">Effective {today}</div>
        </div>
        <div className="tpl-wholesale-terms-badge">
          Wholesale = 30% off retail<br/>
          MOQ 10 units per SKU
        </div>
      </div>

      <table className="tpl-wholesale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style={{textAlign:'center'}}>Pack</th>
            <th style={{textAlign:'right'}}>Retail</th>
            <th style={{textAlign:'right'}}>Wholesale</th>
            <th style={{textAlign:'right'}}>Batch of 10</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan="5" className="tpl-empty">Add recipes to build your price list.</td></tr>
          )}
          {items.map(r => {
            const wholesale = (r.suggested_price || 0) * wholesaleDiscount
            const batch10   = wholesale * 10
            return (
              <tr key={r.id}>
                <td>
                  <div className="tpl-wholesale-name">{r.name}</div>
                  {r.description && <div className="tpl-wholesale-desc">{r.description}</div>}
                </td>
                <td style={{textAlign:'center'}}>1 {r.category === 'Bread' ? 'loaf' : 'piece'}</td>
                <td style={{textAlign:'right'}}>{money(r.suggested_price, currency)}</td>
                <td style={{textAlign:'right', fontWeight:700, color:'var(--brand)'}}>{money(wholesale, currency)}</td>
                <td style={{textAlign:'right', fontWeight:800}}>{money(batch10, currency)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="tpl-wholesale-terms">
        <h3>Terms</h3>
        <ul>
          <li>Prices valid for 30 days from the effective date above.</li>
          <li>Minimum order quantity: 10 units per SKU.</li>
          <li>Orders placed by 6pm are ready for pickup the following morning.</li>
          <li>Payment terms: nett 14 days from invoice date, or cash on collection.</li>
          <li>Custom flavours available on request — please enquire for lead time.</li>
        </ul>
      </div>

      <BrandFooter brand={brand}/>
    </div>
  )
}
