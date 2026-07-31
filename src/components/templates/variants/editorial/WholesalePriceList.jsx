import {
  EditorialLogo, EditorialEyebrow, EditorialRule,
  stylizeTitle, editorialMoney,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Big brand serif (italic accent) + small-caps tagline, DC filled square
 * top-right. Thick black rule. Below: title "Wholesale *Price List*"
 * (italic on words 2..end via 'phrase-after-first' mode) + small-caps
 * EFFECTIVE date on left; cream-tinted TRADE TERMS box with a left rust
 * border stripe on the right.
 *
 * Zebra table — every other body row gets a subtle cream tint. WHOLESALE
 * column header AND values both in rust, bold. Product name column bold
 * black.
 *
 * Bottom split: ORDERING TERMS with bullet dots (left) | TO ORDER contact
 * lines (right — Call/Email/DM). Thick black rule, then footer.
 */
export function EditorialWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const effective = today.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()  // "31 JULY 2026"

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100
  const termsRaw    = brand.wholesale_terms_text ||
    `Prices valid 30 days · Minimum order ${moq} units per SKU · Orders by 6pm ready next morning · Nett 14 days or cash on collection · Custom flavours on request`
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
    <div className="tpl e-tpl e-wholesale printable">
      <header className="e-wholesale-header">
        <div className="e-wholesale-brand-block">
          <h1 className="e-brand-name e-wholesale-brand-name">
            {stylizeTitle(brand.business_name || 'Your Bakery', 'last-word')}
          </h1>
          {brand.tagline && (
            <p className="e-brand-tagline-caps e-wholesale-brand-tag">{brand.tagline}</p>
          )}
        </div>
        <EditorialLogo brand={brand} size="md"/>
      </header>

      <EditorialRule tone="black" weight="thick"/>

      <div className="e-wholesale-title-block">
        <div className="e-wholesale-title-left">
          <h2 className="e-title e-wholesale-title">
            {stylizeTitle('Wholesale Price List', 'phrase-after-first')}
          </h2>
          <EditorialEyebrow tone="muted" className="e-wholesale-effective">
            Effective {effective}
          </EditorialEyebrow>
        </div>
        <div className="e-wholesale-terms-box">
          <EditorialEyebrow tone="rust">Trade Terms</EditorialEyebrow>
          <p className="e-wholesale-terms-body">
            Wholesale is {discountPct}% off retail. Minimum order {moq} units per SKU.
          </p>
        </div>
      </div>

      <EditorialRule tone="black" weight="thick" marginTop="8mm"/>

      <table className="e-wholesale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Pack</th>
            <th className="e-num">Retail</th>
            <th className="e-num e-wholesale-th-rust">Wholesale</th>
            <th className="e-num">Batch of {moq}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className={i % 2 === 1 ? 'e-wholesale-row-alt' : ''}>
              <td className="e-wholesale-td-name">{it.name}</td>
              <td className="e-muted">{it.pack}</td>
              <td className="e-num e-muted">{editorialMoney(it.retail)}</td>
              <td className="e-num e-wholesale-td-price">{editorialMoney(it.wholesale)}</td>
              <td className="e-num e-muted">{editorialMoney(it.batchMoq)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditorialRule tone="black" weight="thick" marginTop="0"/>

      <div className="e-wholesale-terms-row">
        <div className="e-wholesale-terms-col">
          <EditorialEyebrow tone="rust">Ordering Terms</EditorialEyebrow>
          <ul className="e-wholesale-terms-list">
            {termsList.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="e-wholesale-terms-col">
          <EditorialEyebrow tone="rust">To Order</EditorialEyebrow>
          <div className="e-wholesale-order-lines">
            {brand.phone && <div>Call {brand.phone}</div>}
            {brand.email && <div>Email {brand.email}</div>}
            {brand.instagram && (
              <div>DM <span className="e-footer-social">@{brand.instagram}</span></div>
            )}
          </div>
        </div>
      </div>

      <EditorialRule tone="black" weight="thick" marginTop="8mm"/>

      <footer className="e-wholesale-footer">
        <div className="e-footer-line">
          {[brand.address_line1, brand.address_line2].filter(Boolean).join(' · ')}
        </div>
        <div className="e-footer-line">
          {[
            brand.website,
            brand.facebook ? <span key="fb" className="e-footer-social">fb/{brand.facebook}</span> : null,
          ].filter(Boolean).reduce((acc, cur, i) => {
            if (i === 0) return [cur]
            return [...acc, ' · ', cur]
          }, [])}
        </div>
      </footer>
    </div>
  )
}
