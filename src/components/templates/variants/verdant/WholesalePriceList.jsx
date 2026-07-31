import {
  VerdantBrandLockup, VerdantEyebrow, VerdantRule, VerdantHairRule,
  VerdantFooter, verdantMoney,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Brand top-left, EFFECTIVE [date] small caps top-right, thick green rule.
 * Left: big serif title + sans description. Right: rounded card with a
 * dark-green tab strip on the left, mint fill, TRADE TERMS eyebrow, big
 * "30% off retail" black bold, muted "MOQ 10 units per SKU" subtitle.
 *
 * Table with a filled dark-green header BAR (cream small-caps text) and
 * subtle mint zebra rows. WHOLESALE column emphasized in bold black.
 * Below split into ORDERING TERMS (bulleted list, green dots) + TO ORDER
 * (contact lines with @handle in bold green). Two thick green signature
 * rules with AUTHORISED SIGNATURE / DATE labels. Hairline + split footer.
 */
export function VerdantWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const effective = today.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()  // "31 JULY 2026"

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100
  const termsRaw    = brand.wholesale_terms_text ||
    `Prices valid 30 days from the effective date · Minimum order ${moq} units per SKU · Orders by 6pm are ready the next morning · Nett 14 days, or cash on collection`
  const termsList   = termsRaw.split(/\s*·\s*|\n+/).map(s => s.trim()).filter(Boolean)

  const descText = brand.wholesale_description ||
    `Wholesale is ${discountPct}% below retail. Minimum order ${moq} units per line.`

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
    <div className="tpl v-tpl v-wholesale printable">
      <header className="v-wholesale-header">
        <VerdantBrandLockup brand={brand}/>
        <VerdantEyebrow className="v-wholesale-header-right">Effective {effective}</VerdantEyebrow>
      </header>

      <VerdantRule/>

      <div className="v-wholesale-title-block">
        <div className="v-wholesale-title-left">
          <h2 className="v-title v-wholesale-title">Wholesale Price List</h2>
          <p className="v-wholesale-desc">{descText}</p>
        </div>
        <div className="v-wholesale-terms-card">
          <div className="v-wholesale-terms-tab"/>
          <div className="v-wholesale-terms-body">
            <VerdantEyebrow>Trade Terms</VerdantEyebrow>
            <div className="v-wholesale-terms-headline">{discountPct}% off retail</div>
            <div className="v-wholesale-terms-sub">MOQ {moq} units per SKU</div>
          </div>
        </div>
      </div>

      <table className="v-wholesale-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Pack</th>
            <th className="v-num">Retail</th>
            <th className="v-num">Wholesale</th>
            <th className="v-num">Batch of {moq}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className={i % 2 === 1 ? 'v-wholesale-row-alt' : ''}>
              <td className="v-wholesale-td-name">{it.name}</td>
              <td className="v-muted">{it.pack}</td>
              <td className="v-num v-muted">{verdantMoney(it.retail)}</td>
              <td className="v-num v-wholesale-td-price">{verdantMoney(it.wholesale)}</td>
              <td className="v-num">{verdantMoney(it.batchMoq)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="v-wholesale-terms-row">
        <div className="v-wholesale-terms-col">
          <VerdantEyebrow>Ordering Terms</VerdantEyebrow>
          <ul className="v-wholesale-terms-list">
            {termsList.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div className="v-wholesale-terms-col">
          <VerdantEyebrow>To Order</VerdantEyebrow>
          <div className="v-wholesale-order-lines">
            {brand.phone && <div>{brand.phone}</div>}
            {brand.email && <div>{brand.email}</div>}
            {brand.instagram && (
              <div><span className="v-footer-social">@{brand.instagram}</span></div>
            )}
          </div>
        </div>
      </div>

      <div className="v-wholesale-sig-row">
        <div className="v-wholesale-sig-cell">
          <div className="v-wholesale-sig-line"/>
          <VerdantEyebrow tone="muted">Authorised Signature</VerdantEyebrow>
        </div>
        <div className="v-wholesale-sig-cell">
          <div className="v-wholesale-sig-line"/>
          <VerdantEyebrow tone="muted">Date</VerdantEyebrow>
        </div>
      </div>

      <div className="v-wholesale-footer-wrap">
        <VerdantHairRule marginTop="auto" marginBottom="4mm"/>
        <VerdantFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}
