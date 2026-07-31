function money(n, currency = 'RM') {
  return `${currency}${Number(n || 0).toFixed(2)}`
}

/**
 * Wholesale Price List — "Corporate B2B, Elegant"
 * Clean sans, muted greys, precise table, no ornamentation.
 */
export function WholesalePriceList({ recipes, brand }) {
  const currency = brand.currency || 'RM'
  const items = (recipes || []).filter(r => r?.name)
  const discount = 0.7
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="tpl tpl-wholesale-v2 printable" style={{ '--brand': brand.brand_color }}>
      {/* Report header */}
      <div className="tpl-wholesale-v2-top">
        <div className="tpl-wholesale-v2-top-brand">
          {brand.logo_data_url && <img src={brand.logo_data_url} alt="" className="tpl-wholesale-v2-logo"/>}
          <div>
            <div className="tpl-wholesale-v2-brand-name">{brand.business_name || 'Your Bakery'}</div>
            {brand.tagline && <div className="tpl-wholesale-v2-brand-tag">{brand.tagline}</div>}
          </div>
        </div>
        <div className="tpl-wholesale-v2-top-meta">
          <div className="tpl-wholesale-v2-doc-label">WHOLESALE</div>
          <div className="tpl-wholesale-v2-doc-num">PRICE LIST · {today}</div>
        </div>
      </div>

      <div className="tpl-wholesale-v2-title-block">
        <h1>Wholesale Price Schedule</h1>
        <div className="tpl-wholesale-v2-terms-line">
          <span><strong>Wholesale rate</strong> 30% below retail</span>
          <span className="tpl-wholesale-v2-sep"/>
          <span><strong>MOQ</strong> 10 units per SKU</span>
          <span className="tpl-wholesale-v2-sep"/>
          <span><strong>Validity</strong> 30 days from issue</span>
        </div>
      </div>

      <table className="tpl-wholesale-v2-table">
        <thead>
          <tr>
            <th style={{width:'8%'}}>Ref</th>
            <th style={{width:'42%'}}>Product</th>
            <th style={{width:'10%', textAlign:'center'}}>Pack</th>
            <th style={{width:'13%', textAlign:'right'}}>Retail</th>
            <th style={{width:'13%', textAlign:'right'}}>Wholesale</th>
            <th style={{width:'14%', textAlign:'right'}}>10 units</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan="6" className="tpl-empty" style={{textAlign:'center', padding:24}}>Add recipes to build your price list.</td></tr>
          )}
          {items.map((r, i) => {
            const w = (r.suggested_price || 0) * discount
            const b = w * 10
            const ref = (r.category?.[0]?.toUpperCase() || 'X') + String(i + 1).padStart(2, '0')
            return (
              <tr key={r.id}>
                <td className="tpl-wholesale-v2-ref">{ref}</td>
                <td>
                  <div className="tpl-wholesale-v2-name">{r.name}</div>
                  {r.description && <div className="tpl-wholesale-v2-desc">{r.description}</div>}
                </td>
                <td style={{textAlign:'center'}}>1 {r.category === 'Bread' ? 'loaf' : 'pc'}</td>
                <td style={{textAlign:'right'}}>{money(r.suggested_price, currency)}</td>
                <td style={{textAlign:'right', fontWeight:600, color:'var(--brand)'}}>{money(w, currency)}</td>
                <td style={{textAlign:'right', fontWeight:700}}>{money(b, currency)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="tpl-wholesale-v2-terms-block">
        <h3>Terms &amp; Conditions</h3>
        <div className="tpl-wholesale-v2-terms-grid">
          <div>
            <div className="tpl-wholesale-v2-terms-label">Payment</div>
            <div>Nett 14 days from invoice date. Cash on collection accepted.</div>
          </div>
          <div>
            <div className="tpl-wholesale-v2-terms-label">Lead time</div>
            <div>Orders placed before 6pm ready for pickup by 8am next day.</div>
          </div>
          <div>
            <div className="tpl-wholesale-v2-terms-label">Custom orders</div>
            <div>Custom flavours and larger batches available on request.</div>
          </div>
          <div>
            <div className="tpl-wholesale-v2-terms-label">Delivery</div>
            <div>Metro area delivery available; enquire for rates.</div>
          </div>
        </div>
      </div>

      <footer className="tpl-wholesale-v2-footer">
        <div>
          {brand.address && <div>{brand.address}</div>}
        </div>
        <div className="tpl-wholesale-v2-footer-right">
          {brand.contact_phone && <div>{brand.contact_phone}</div>}
          {brand.contact_email && <div>{brand.contact_email}</div>}
          {brand.website && <div>{brand.website}</div>}
        </div>
      </footer>
    </div>
  )
}
