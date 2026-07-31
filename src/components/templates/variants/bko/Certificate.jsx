import { BkoLogo, BkoSeal } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape) — premium orders
 *
 * FIELD MAPPING:
 *   customization.title           — default "Certificate of Craft"
 *   customization.intro_line      — default "This is to certify that"
 *   customization.outro_line      — default "was crafted with care in the kitchen of"
 *   customization.head_baker_name — override for brand.head_baker_name
 *                                   default label "Head Baker" if neither is set
 *   customization.signature_url   — override for brand.head_baker_signature_url
 *   customization.seal_text       — default "BAKED / WITH / CARE"
 */
export function BkoCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title        = customization.title      || 'Certificate of Craft'
  const introLine     = customization.intro_line || 'This is to certify that'
  const outroLine     = customization.outro_line || 'was crafted with care in the kitchen of'
  const bakerName      = customization.head_baker_name || brand.head_baker_name || 'Head Baker'
  const signatureUrl  = customization.signature_url    || brand.head_baker_signature_url
  const sealText       = customization.seal_text || 'BAKED / WITH / CARE'

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const address = [brand?.address_line1 || brand?.address, brand?.address_line2]
    .filter(Boolean).join(' · ')
  const contact = [
    brand?.website,
    brand?.instagram && `@${brand.instagram}`,
    brand?.facebook && `fb/${brand.facebook}`,
    brand?.phone || brand?.contact_phone,
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl b-tpl b-cert printable">
      <div className="b-cert-border">
        <div className="b-cert-logo-wrap">
          <BkoLogo brand={brand} size="lg"/>
        </div>

        <div className="b-eyebrow b-eyebrow-accent b-cert-eyebrow">{title}</div>

        <div className="b-cert-intro">{introLine}</div>
        <h2 className="b-cert-product">{recipe.name || 'Product name'}</h2>

        <div className="b-cert-outro">{outroLine}</div>
        <div className="b-cert-brand">{brand.business_name || 'Your Bakery'}</div>
        {brand.tagline && (
          <p className="b-cert-tagline">— {brand.tagline} —</p>
        )}

        <div className="b-cert-signature-row">
          <div className="b-cert-sig-block">
            {signatureUrl && (
              <img src={signatureUrl} alt="signature" className="b-cert-signature-img"/>
            )}
            <div>{bakerName}</div>
          </div>
          <div className="b-cert-seal-center">
            <BkoSeal text={sealText} size={82}/>
          </div>
          <div className="b-cert-sig-block b-right">{today}</div>
        </div>

        <div className="b-cert-footer">
          {address && <div>{address}</div>}
          {contact && (
            <div dangerouslySetInnerHTML={{
              __html: contact
                .replace(/@\w+/g, m => `<span class="b-accent">${m}</span>`)
                .replace(/fb\/\w+/g, m => `<span class="b-accent">${m}</span>`),
            }}/>
          )}
        </div>
      </div>
    </div>
  )
}
