import { TrLogo, TrEyebrow, isoDate } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm) — premium orders
 *
 * Dark navy grid paper. Thin TEAL rectangle frame border (~1.5px inset
 * ~7mm from edges).
 *
 * Inside frame, everything centered:
 *
 *  - TEAL DC square logo top center (size='lg' ~18mm)
 *  - `CERTIFICATE OF CRAFT` teal mono uppercase wide-tracked eyebrow
 *  - `This is to certify that` muted italic
 *  - HUGE Manrope 800 white product title (Title Case, tight tracking)
 *  - `was made by hand in the kitchen of` muted
 *  - Brand name in TEAL Manrope 800 large
 *  - `ARTISAN BAKERY / IPOH` mono muted subtitle
 *  - Near bottom center: TEAL OUTLINED CIRCLE (~18mm) with `MADE / BY /
 *    HAND` teal mono stacked text (3 lines) inside
 *  - Flanking thin teal-tinted rules: HEAD BAKER left / 2026-07-31 right
 *    (mono uppercase muted)
 *  - Bottom center 3-line footer: address / contact / socials (mono
 *    uppercase muted; handle in teal)
 */
export function TrCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title      = customization.title      || 'CERTIFICATE OF CRAFT'
  const introLine  = customization.intro_line || 'This is to certify that'
  const outroLine  = customization.outro_line || 'was made by hand in the kitchen of'
  const bakerName  = customization.head_baker_name || brand.head_baker_name || 'HEAD BAKER'
  const sigUrl     = customization.signature_url   || brand.head_baker_signature_url
  const sealText   = customization.seal_text       || 'MADE / BY / HAND'

  const dateStr = isoDate(new Date())

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const contactLine = [
    [brand?.address_line1, brand?.address_line2].filter(Boolean).join(', '),
    brand?.phone,
  ].filter(Boolean).join(' · ').toUpperCase()

  const websiteLine = (brand?.website || '').toUpperCase()

  const socialsLine = [
    brand?.instagram && `@${brand.instagram}`,
    brand?.facebook  && `fb/${brand.facebook}`,
  ].filter(Boolean).join(' · ').toUpperCase()

  const sealLines = sealText.split('/').map(s => s.trim())

  return (
    <div className="tpl tr-tpl tr-cert printable">
      <div className="tr-cert-border">
        <div className="tr-cert-top">
          <TrLogo brand={brand} size="lg"/>
          <TrEyebrow tone="teal" className="tr-cert-title-label">{title}</TrEyebrow>
        </div>

        <div className="tr-cert-body">
          <p className="tr-cert-intro">{introLine}</p>
          <h2 className="tr-cert-product">{recipe.name || 'Chocolate Fudge Cake'}</h2>
        </div>

        <div className="tr-cert-attribution">
          <p className="tr-cert-outro">{outroLine}</p>
          <div className="tr-cert-brand-name">
            {brand.business_name || 'The Daily Crumb'}
          </div>
          <div className="tr-cert-tagline">
            {(brand.tagline || 'ARTISAN BAKERY').toUpperCase()} / {cityLine.toUpperCase()}
          </div>
        </div>

        <div className="tr-cert-signature-row">
          <div className="tr-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="tr-cert-sig-img"/>}
            <div className="tr-cert-sig-line"/>
            <TrEyebrow tone="muted">{bakerName}</TrEyebrow>
          </div>

          <div className="tr-cert-seal">
            {sealLines.map((l, i) => (
              <span key={i} className="tr-cert-seal-line">{l}</span>
            ))}
          </div>

          <div className="tr-cert-sig-cell tr-cert-sig-cell-right">
            <div className="tr-cert-sig-line"/>
            <TrEyebrow tone="muted">{dateStr}</TrEyebrow>
          </div>
        </div>

        <div className="tr-cert-footer">
          {contactLine && <div className="tr-cert-footer-line">{contactLine}</div>}
          {websiteLine && <div className="tr-cert-footer-line">{websiteLine}</div>}
          {socialsLine && (
            <div className="tr-cert-footer-line tr-cert-footer-line-teal">
              {socialsLine}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
