import { KraftMonogram, KraftSeal } from './_parts.jsx'

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
 *                                   (image renders above the left signature line)
 *   customization.seal_text       — default "BAKED / WITH / CARE"
 */
export function KraftCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title        = customization.title       || 'Certificate of Craft'
  const introLine    = customization.intro_line  || 'This is to certify that'
  const outroLine    = customization.outro_line  || 'was crafted with care in the kitchen of'
  const bakerName    = customization.head_baker_name || brand.head_baker_name || 'Head Baker'
  const signatureUrl = customization.signature_url    || brand.head_baker_signature_url
  const sealText     = customization.seal_text || 'BAKED / WITH / CARE'

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
    <div className="tpl k-tpl k-cert printable">
      <div className="k-cert-outer-border">
        <div className="k-cert-inner-border">
          <div className="k-cert-monogram-wrap">
            <KraftMonogram brand={brand} size="lg"/>
          </div>

          <h1 className="k-cert-title">{title}</h1>

          <div className="k-cert-intro">{introLine}</div>
          <h2 className="k-cert-product">{recipe.name || 'Product name'}</h2>

          <div className="k-cert-outro">{outroLine}</div>
          <div className="k-cert-brand">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && (
            <p className="k-cert-tagline">— {brand.tagline} —</p>
          )}

          <div className="k-cert-signature-row">
            <div className="k-cert-sig-block">
              {signatureUrl && (
                <img src={signatureUrl} alt="signature" className="k-cert-signature-img"/>
              )}
              <div>{bakerName}</div>
            </div>
            <div className="k-cert-seal-center">
              <KraftSeal text={sealText} size={82} rotation={0}/>
            </div>
            <div className="k-cert-sig-block k-right">{today}</div>
          </div>

          <div className="k-cert-footer">
            {address && <div>{address}</div>}
            {contact && (
              <div dangerouslySetInnerHTML={{
                __html: contact
                  .replace(/@\w+/g, m => `<span class="k-brown">${m}</span>`)
                  .replace(/fb\/\w+/g, m => `<span class="k-brown">${m}</span>`),
              }}/>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
