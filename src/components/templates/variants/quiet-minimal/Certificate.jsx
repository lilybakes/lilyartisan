import {
  QuietEyebrow, QuietDot, QuietRule, QuietSeal,
} from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape) — premium orders
 *
 * Thin outlined border around the entire card. Everything centered.
 * Small rust dot top center. CERTIFICATE OF CRAFT mono muted.
 * Big whitespace, then "This is to certify that" sans muted, MASSIVE
 * light sans product title, "was crafted with care in the kitchen of"
 * sans muted, brand name bold, tagline muted. More whitespace.
 * Bottom-center: thin outlined circle "BAKED / WITH / CARE" mono rust.
 * Signature: hairline + HEAD BAKER mono muted left, hairline +
 * 31.07.2026 mono muted right. Centered footer at very bottom.
 */
export function QuietCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title      = customization.title      || 'Certificate of Craft'
  const introLine  = customization.intro_line || 'This is to certify that'
  const outroLine  = customization.outro_line || 'was crafted with care in the kitchen of'
  const bakerName  = customization.head_baker_name    || brand.head_baker_name || 'Head Baker'
  const sigUrl     = customization.signature_url      || brand.head_baker_signature_url
  const sealText   = customization.seal_text          || 'BAKED / WITH / CARE'

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB').replace(/\//g, '.')  // "31.07.2026"

  const contact = [
    [brand?.address_line1, brand?.address_line2].filter(Boolean).join(', '),
    brand?.phone,
  ].filter(Boolean).join(' · ')

  const socials = [
    brand?.website,
    brand?.instagram && `@${brand.instagram}`,
    brand?.facebook && `fb/${brand.facebook}`,
  ].filter(Boolean)

  return (
    <div className="tpl q-tpl q-cert printable">
      <div className="q-cert-border">
        <div className="q-cert-top">
          <QuietDot/>
          <QuietEyebrow className="q-cert-title-label">{title}</QuietEyebrow>
        </div>

        <div className="q-cert-body">
          <p className="q-cert-intro">{introLine}</p>
          <h2 className="q-title q-cert-product">{recipe.name || 'Product name'}</h2>
          <p className="q-cert-outro">{outroLine}</p>
          <div className="q-cert-brand-name">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <p className="q-cert-tagline">{brand.tagline}</p>}
        </div>

        <div className="q-cert-signature-row">
          <div className="q-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="q-cert-sig-img"/>}
            <QuietRule/>
            <QuietEyebrow>{bakerName}</QuietEyebrow>
          </div>
          <div className="q-cert-seal-wrap">
            <QuietSeal text={sealText} size={82}/>
          </div>
          <div className="q-cert-sig-cell">
            <QuietRule/>
            <QuietEyebrow className="q-cert-date">{dateStr}</QuietEyebrow>
          </div>
        </div>

        <footer className="q-cert-footer">
          {contact && <div className="q-footer-line">{contact}</div>}
          {socials.length > 0 && (
            <div className="q-footer-line">
              {socials.map((s, i) => (
                <span key={i}>
                  {i > 0 && ' · '}
                  <span className={s === brand?.website ? '' : 'q-footer-social'}>{s}</span>
                </span>
              ))}
            </div>
          )}
        </footer>
      </div>
    </div>
  )
}
