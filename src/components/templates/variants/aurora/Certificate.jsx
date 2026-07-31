import { AuEyebrow, AuGradientCircle } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm) — premium orders
 *
 * A rounded rectangle whose BORDER is drawn as the aurora gradient (~2mm
 * thick, ~4mm corner radius), with soft radial glows of gradient color
 * in the top-left and bottom-right corners of the page. Inside the frame:
 * a small solid gradient circle mark at top, "CERTIFICATE OF CRAFT" in
 * purple caps letter-tracked, "This is to certify that" muted, HUGE navy
 * product title, "was made by hand in the kitchen of", brand name in
 * PURPLE bold, tagline muted.
 *
 * Bottom: filled GRADIENT circle "MADE BY HAND" flanked by two ink-black
 * signature/date rules with purple eyebrow labels.
 */
export function AuCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title      = customization.title      || 'Certificate of Craft'
  const introLine  = customization.intro_line || 'This is to certify that'
  const outroLine  = customization.outro_line || 'was made by hand in the kitchen of'
  const bakerName  = customization.head_baker_name || brand.head_baker_name || 'Head Baker'
  const sigUrl     = customization.signature_url   || brand.head_baker_signature_url
  const sealText   = customization.seal_text       || 'MADE / BY / HAND'

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB').replace(/\//g, '.')

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const contactLine = [
    [brand?.address_line1, brand?.address_line2].filter(Boolean).join(', '),
    brand?.phone,
  ].filter(Boolean).join(' · ')

  const socialsLine = [
    brand?.website,
    brand?.instagram && `@${brand.instagram}`,
    brand?.facebook && `fb/${brand.facebook}`,
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl au-tpl au-cert printable">
      <div className="au-cert-glow au-cert-glow-tl"/>
      <div className="au-cert-glow au-cert-glow-br"/>

      <div className="au-cert-border">
        <div className="au-cert-border-inner">
          <div className="au-cert-top">
            <AuGradientCircle size={44}/>
            <AuEyebrow tone="purple" className="au-cert-title-label">{title}</AuEyebrow>
          </div>

          <div className="au-cert-body">
            <p className="au-cert-intro">{introLine}</p>
            <h2 className="au-title au-cert-product">
              {(recipe.name || 'Product name').toUpperCase()}
            </h2>
          </div>

          <div className="au-cert-attribution">
            <p className="au-cert-outro">{outroLine}</p>
            <div className="au-cert-brand-name">
              {(brand.business_name || 'Your Bakery').toUpperCase()}
            </div>
            <div className="au-cert-tagline">
              {(brand.tagline || 'Artisan bakery').toUpperCase()} · {cityLine.toUpperCase()}
            </div>
          </div>

          <div className="au-cert-signature-row">
            <div className="au-cert-sig-cell">
              {sigUrl && <img src={sigUrl} alt="signature" className="au-cert-sig-img"/>}
              <div className="au-cert-sig-line"/>
              <AuEyebrow tone="purple">{bakerName}</AuEyebrow>
            </div>
            <div className="au-cert-seal-wrap">
              <AuGradientCircle text={sealText} size={92}/>
            </div>
            <div className="au-cert-sig-cell au-cert-sig-cell-right">
              <div className="au-cert-sig-line"/>
              <AuEyebrow tone="purple">{dateStr}</AuEyebrow>
            </div>
          </div>

          <div className="au-cert-footer">
            {contactLine && <div className="au-cert-footer-line">{contactLine}</div>}
            {socialsLine && <div className="au-cert-footer-line">{socialsLine}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
