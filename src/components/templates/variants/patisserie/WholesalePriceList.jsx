import {
  PaEyebrow, PaRule, PaSubtitle, PaFooter,
  paMoney, spellOutNumber, formatLongDate,
} from './_parts.jsx'

/**
 * 06 — WHOLESALE PRICE LIST  (A4 portrait) — B2B buyer
 *
 * Gold framed. Brand centered top, italic subtitle. Then title "Wholesale
 * Price List" LEFT-aligned in HUGE burgundy Cormorant, italic muted
 * subtitle "Effective the thirty-first of July, 2026" underneath.
 * RIGHT-aligned: two short body lines "Wholesale is 30% below retail" /
 * "Minimum order 10 units per line" (dark burgundy, no box).
 *
 * Table with mauve tracked caps headers, hair rules between rows, WHOLESALE
 * column in BURGUNDY bold, others in dark body. NO filled highlight column.
 * Under the table: "All prices in Malaysian Ringgit." italic muted. TERMS
 * block left with bulleted list of spelled-out prose lines + TO ORDER
 * block right with contact lines (@handle in burgundy). Signature/date
 * lines at bottom, mauve tracked caps labels.
 */
export function PaWholesalePriceList({ recipes = [], brand = {} }) {
  const today = new Date()
  const effectiveWords = formatDateAsProse(today)   // "the thirty-first of July, 2026"
  const dateLine = formatLongDate(today)             // "31 July 2026"

  const discountPct = Number(brand.wholesale_discount_pct) || 30
  const moq         = Number(brand.wholesale_moq) || 10
  const factor      = 1 - discountPct / 100

  const discountWord = spellOutNumber(discountPct, { mode: 'lower' }) || String(discountPct)
  const moqWord      = spellOutNumber(moq,         { mode: 'lower' }) || String(moq)

  const termsRaw = brand.wholesale_terms_text ||
    `Prices valid thirty days from the effective date. · Minimum order ${moqWord} units per SKU. · Orders by six in the evening are ready next morning. · Nett fourteen days, or cash on collection. · Custom flavours on request.`
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

  const tagline = brand.tagline || 'Artisan bakery'
  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const brandSubtitle = `${tagline} — ${cityLine}`

  return (
    <div className="tpl pa-tpl pa-wholesale printable">
      <div className="pa-frame">
        <header className="pa-wholesale-header">
          <div className="pa-wholesale-brand-name">{brand.business_name || 'Your Bakery'}</div>
          <PaSubtitle className="pa-wholesale-brand-tag">{brandSubtitle}</PaSubtitle>
        </header>

        <div className="pa-wholesale-title-row">
          <div className="pa-wholesale-title-left">
            <h2 className="pa-title pa-wholesale-title">Wholesale Price List</h2>
            <PaSubtitle className="pa-wholesale-effective">
              Effective {effectiveWords}
            </PaSubtitle>
          </div>
          <div className="pa-wholesale-title-right">
            <div className="pa-wholesale-note">Wholesale is {discountPct}% below retail</div>
            <div className="pa-wholesale-note">Minimum order {moq} units per line</div>
          </div>
        </div>

        <table className="pa-wholesale-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Pack</th>
              <th className="pa-num">Retail</th>
              <th className="pa-num">Wholesale</th>
              <th className="pa-num">{moq} units</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td className="pa-wholesale-td-name">{it.name}</td>
                <td className="pa-muted">{it.pack}</td>
                <td className="pa-num pa-muted">{paMoney(it.retail, { bare: true })}</td>
                <td className="pa-num pa-wholesale-td-price">{paMoney(it.wholesale, { bare: true })}</td>
                <td className="pa-num">{paMoney(it.batchMoq, { bare: true })}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <PaSubtitle className="pa-wholesale-currency">All prices in Malaysian Ringgit.</PaSubtitle>

        <div className="pa-wholesale-terms-row">
          <div className="pa-wholesale-terms-col">
            <PaEyebrow>Ordering Terms</PaEyebrow>
            <ul className="pa-wholesale-terms-list">
              {termsList.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          <div className="pa-wholesale-terms-col">
            <PaEyebrow>To Order</PaEyebrow>
            <div className="pa-wholesale-order-lines">
              {brand.phone && <div>{brand.phone}</div>}
              {brand.email && <div>{brand.email}</div>}
              {brand.instagram && (
                <div className="pa-wholesale-order-handle">@{brand.instagram}</div>
              )}
            </div>
          </div>
        </div>

        <div className="pa-wholesale-sig-row">
          <div className="pa-wholesale-sig-cell">
            <div className="pa-wholesale-sig-line"/>
            <PaEyebrow>Authorised Signature</PaEyebrow>
          </div>
          <div className="pa-wholesale-sig-cell">
            <div className="pa-wholesale-sig-line"/>
            <PaEyebrow>{dateLine}</PaEyebrow>
          </div>
        </div>

        <div className="pa-wholesale-footer-wrap">
          <PaRule marginTop="auto" marginBottom="4mm"/>
          <PaFooter brand={brand} layout="split"/>
        </div>
      </div>
    </div>
  )
}

/**
 * Format a Date as "the thirty-first of July, 2026" — spelled-out ordinal
 * day, full month name, year in digits.
 */
function formatDateAsProse(d) {
  const months = ['January','February','March','April','May','June',
    'July','August','September','October','November','December']
  const day = d.getDate()
  return `${ordinalWord(day)} of ${months[d.getMonth()]}, ${d.getFullYear()}`
}

function ordinalWord(n) {
  const ordinals = {
    1:'the first', 2:'the second', 3:'the third', 4:'the fourth', 5:'the fifth',
    6:'the sixth', 7:'the seventh', 8:'the eighth', 9:'the ninth', 10:'the tenth',
    11:'the eleventh', 12:'the twelfth', 13:'the thirteenth', 14:'the fourteenth',
    15:'the fifteenth', 16:'the sixteenth', 17:'the seventeenth', 18:'the eighteenth',
    19:'the nineteenth', 20:'the twentieth', 21:'the twenty-first', 22:'the twenty-second',
    23:'the twenty-third', 24:'the twenty-fourth', 25:'the twenty-fifth',
    26:'the twenty-sixth', 27:'the twenty-seventh', 28:'the twenty-eighth',
    29:'the twenty-ninth', 30:'the thirtieth', 31:'the thirty-first',
  }
  return ordinals[n] || `the ${n}th`
}
