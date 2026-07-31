import {
  EmberBrandLockup, EmberEyebrow, EmberRule, EmberFooter, emberMoney,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Brand heavy condensed black left; ARTISAN BAKERY line + EFFECTIVE date
 * stacked muted right. Thick black rule.
 *
 * Left: massive title heavy condensed uppercase black. Right: filled
 * NEAR-BLACK rounded card with TRADE TERMS ember eyebrow + huge condensed
 * "30% OFF" cream + retail/MOQ subtitle muted-cream.
 *
 * Table with FILLED EMBER header bar (cream small caps) + subtle warm
 * cream zebra rows. WHOLESALE column bold ember. Bottom split: ORDERING
 * TERMS with bullet dots + TO ORDER contact lines with @handle bold ember.
 * Signature/date rules with AUTHORISED SIGNATURE + DATE labels.
 */
export function EmberWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const effective = today.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100
  const termsRaw    = brand.wholesale_terms_text ||
    `Prices valid 30 days from the effective date · Minimum order ${moq} units per SKU · Orders by 6pm are ready the next morning · Nett 14 days, or cash on collection`
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
    <div className="tpl em-tpl em-wholesale printable">
      <header className="em-wholesale-header">
        <EmberBrandLockup brand={brand} size="md"/>
        <div className="em-wholesale-meta-block">
          {brand.tagline && (
            <EmberEyebrow tone="muted">{brand.tagline}</EmberEyebrow>
          )}
          <EmberEyebrow tone="muted">Effective {effective}</EmberEyebrow>
        </div>
      </header>

      <EmberRule/>

      <div className="em-wholesale-title-block">
        <div className="em-wholesale-title-left">
          <h2 className="em-title em-wholesale-title">WHOLESALE<br/>PRICE LIST</h2>
        </div>
        <div className="em-wholesale-terms-card">
          <EmberEyebrow tone="ember">Trade Terms</EmberEyebrow>
          <div className="em-wholesale-terms-headline">{discountPct}% OFF</div>
          <div className="em-wholesale-terms-sub">Retail price · MOQ {moq} units per SKU</div>
        </div>
      </div>

      <table className="em-wholesale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Pack</th>
            <th className="em-num">Retail</th>
            <th className="em-num">Wholesale</th>
            <th className="em-num">Batch of {moq}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className={i % 2 === 1 ? 'em-wholesale-row-alt' : ''}>
              <td className="em-wholesale-td-name">{it.name}</td>
              <td className="em-muted">{it.pack}</td>
              <td className="em-num em-muted">{emberMoney(it.retail)}</td>
              <td className="em-num em-wholesale-td-price">{emberMoney(it.wholesale)}</td>
              <td className="em-num em-muted">{emberMoney(it.batchMoq)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="em-wholesale-terms-row">
        <div className="em-wholesale-terms-col">
          <EmberEyebrow>Ordering Terms</EmberEyebrow>
          <ul className="em-wholesale-terms-list">
            {termsList.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="em-wholesale-terms-col">
          <EmberEyebrow>To Order</EmberEyebrow>
          <div className="em-wholesale-order-lines">
            {brand.phone && <div>{brand.phone}</div>}
            {brand.email && <div>{brand.email}</div>}
            {brand.instagram && (
              <div><span className="em-footer-social">@{brand.instagram}</span></div>
            )}
          </div>
        </div>
      </div>

      <div className="em-wholesale-sig-row">
        <div className="em-wholesale-sig-cell">
          <div className="em-wholesale-sig-line"/>
          <EmberEyebrow tone="muted">Authorised Signature</EmberEyebrow>
        </div>
        <div className="em-wholesale-sig-cell">
          <div className="em-wholesale-sig-line"/>
          <EmberEyebrow tone="muted">Date</EmberEyebrow>
        </div>
      </div>

      <div className="em-wholesale-footer-wrap">
        <EmberRule marginTop="auto" weight="hair" marginBottom="4mm"/>
        <EmberFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
