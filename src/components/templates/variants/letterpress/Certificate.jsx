import {
  LetterpressLogo, LetterpressSeal, LetterpressCornerOrnament,
  letterpressDate,
} from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape) — premium orders
 *
 * Double thin brown border with a fleuron ornament in each corner.
 * DC monogram in square top-center. Italic serif "Certificate of Craft"
 * title. Formal centered text: "This is to certify that" · product name
 * (large uppercase serif) · "was crafted with care in the kitchen of" ·
 * brand name (uppercase burgundy serif) · italic "— tagline —" ·
 * filled burgundy circular "BAKED / WITH / CARE" seal. Signature line
 * left + date line right, footer contact at bottom center.
 */
export function LetterpressCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title      = customization.title      || 'Certificate of Craft'
  const introLine  = customization.intro_line || 'This is to certify that'
  const outroLine  = customization.outro_line || 'was crafted with care in the kitchen of'
  const bakerName  = customization.head_baker_name    || brand.head_baker_name || 'Head Baker'
  const sigUrl     = customization.signature_url      || brand.head_baker_signature_url
  const sealText   = customization.seal_text          || 'BAKED / WITH / CARE'

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()  // "31 JULY 2026"

  const address = [brand?.address_line1 || brand?.address, brand?.address_line2]
    .filter(Boolean).join(' · ')
  const contact = [
    brand?.website,
    brand?.instagram && `@${brand.instagram}`,
    brand?.facebook && `fb/${brand.facebook}`,
    brand?.phone,
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl l-tpl l-cert printable">
      <div className="l-cert-outer">
        <div className="l-cert-inner">
          <div className="l-cert-corner l-cert-corner-tl"><LetterpressCornerOrnament size={22} rotate={0}/></div>
          <div className="l-cert-corner l-cert-corner-tr"><LetterpressCornerOrnament size={22} rotate={90}/></div>
          <div className="l-cert-corner l-cert-corner-bl"><LetterpressCornerOrnament size={22} rotate={270}/></div>
          <div className="l-cert-corner l-cert-corner-br"><LetterpressCornerOrnament size={22} rotate={180}/></div>

          <div className="l-cert-logo-wrap">
            <LetterpressLogo brand={brand} size="md" shape="square"/>
          </div>

          <h1 className="l-cert-title">{title}</h1>

          <p className="l-cert-intro">{introLine}</p>
          <h2 className="l-cert-product">{recipe.name || 'Product name'}</h2>

          <p className="l-cert-outro">{outroLine}</p>
          <div className="l-cert-brand">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <p className="l-cert-tagline">— {brand.tagline} —</p>}

          <div className="l-cert-seal-wrap">
            <LetterpressSeal text={sealText} size={80}/>
          </div>

          <div className="l-cert-sig-row">
            <div className="l-cert-sig-cell">
              {sigUrl && <img src={sigUrl} alt="signature" className="l-cert-sig-img"/>}
              <div className="l-cert-sig-line"/>
              <div className="l-eyebrow l-eyebrow-muted">{bakerName}</div>
            </div>
            <div className="l-cert-sig-cell l-cert-sig-cell-right">
              <div className="l-cert-sig-line"/>
              <div className="l-eyebrow l-eyebrow-muted">{dateStr}</div>
            </div>
          </div>

          <div className="l-cert-footer">
            {address && <div className="l-cert-footer-line">{address}</div>}
            {contact && <div className="l-cert-footer-line">{contact}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
