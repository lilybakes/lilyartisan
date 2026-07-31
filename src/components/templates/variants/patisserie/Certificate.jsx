import { PaLogo, PaEyebrow, PaShortRule, PaSubtitle, PaSeal, formatLongDate } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm, fixed height) —
 * premium orders
 *
 * Gold rectangle frame surrounding the entire content. Everything centered.
 * Inside: gold-ring DC logo top center, mauve "CERTIFICATE OF CRAFT"
 * tracked caps, "This is to certify that" italic muted, HUGE burgundy
 * Cormorant product title, short gold rule underneath, "was made by hand
 * in the kitchen of" italic muted, brand name in burgundy Cormorant bold,
 * italic muted tagline.
 *
 * Near bottom: a small gold-ring circle (~60mm ≈ 16mm on print) with
 * burgundy "MADE / BY / HAND" stacked Cormorant text, flanked by thin
 * gold rules for signature/date labels ("HEAD BAKER" left in mauve
 * tracked caps, "31 JULY 2026" right).
 */
export function PaCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title      = customization.title      || 'Certificate of Craft'
  const introLine  = customization.intro_line || 'This is to certify that'
  const outroLine  = customization.outro_line || 'was made by hand in the kitchen of'
  const bakerName  = customization.head_baker_name || brand.head_baker_name || 'Head Baker'
  const sigUrl     = customization.signature_url   || brand.head_baker_signature_url
  const sealText   = customization.seal_text       || 'MADE / BY / HAND'

  const dateStr = formatLongDate(new Date()).toUpperCase()

  const tagline = brand.tagline || 'Artisan bakery'
  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const brandSubtitle = `${tagline} — ${cityLine}`

  return (
    <div className="tpl pa-tpl pa-cert printable">
      <div className="pa-frame">
        <div className="pa-cert-top">
          <PaLogo brand={brand} size="lg"/>
          <PaEyebrow className="pa-cert-title-label">{title}</PaEyebrow>
        </div>

        <div className="pa-cert-body">
          <PaSubtitle className="pa-cert-intro">{introLine}</PaSubtitle>
          <h2 className="pa-title pa-cert-product">
            {recipe.name || 'Product name'}
          </h2>
          <PaShortRule/>
        </div>

        <div className="pa-cert-attribution">
          <PaSubtitle className="pa-cert-outro">{outroLine}</PaSubtitle>
          <div className="pa-cert-brand-name">
            {brand.business_name || 'Your Bakery'}
          </div>
          <PaSubtitle className="pa-cert-tagline">{brandSubtitle}</PaSubtitle>
        </div>

        <div className="pa-cert-signature-row">
          <div className="pa-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="pa-cert-sig-img"/>}
            <div className="pa-cert-sig-line"/>
            <PaEyebrow>{bakerName}</PaEyebrow>
          </div>
          <div className="pa-cert-seal-wrap">
            <PaSeal text={sealText} size={60}/>
          </div>
          <div className="pa-cert-sig-cell pa-cert-sig-cell-right">
            <div className="pa-cert-sig-line"/>
            <PaEyebrow>{dateStr}</PaEyebrow>
          </div>
        </div>
      </div>
    </div>
  )
}
