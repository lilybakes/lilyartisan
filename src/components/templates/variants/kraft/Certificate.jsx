import { KraftMonogram, KraftSeal } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm) — premium orders
 *
 * Matches Image 5:
 *   • Double brown border around whole certificate
 *   • Centered layout
 *   • Dashed monogram top
 *   • "Certificate of Craft" ITALIC slab-serif (unique to certificate)
 *   • "This is to certify that" italic small brown
 *   • HUGE UPPERCASE product name (slab 900)
 *   • "was crafted with care in the kitchen of" italic
 *   • Brand name UPPERCASE bold brown
 *   • Italic tagline centered with em-dashes
 *   • Bottom row: signature line (L), dashed circular seal (center), date line (R)
 *   • Footer contact centered
 */
export function KraftCertificate({ recipe = {}, brand = {}, signature = 'Head Baker' }) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const address = [brand?.address_line1, brand?.address_line2].filter(Boolean).join(' · ')
  const contact = [brand?.website, brand?.instagram && `@${brand.instagram}`,
    brand?.facebook && `fb/${brand.facebook}`, brand?.phone].filter(Boolean).join(' · ')

  return (
    <div className="tpl k-tpl k-cert printable">
      <div className="k-cert-outer-border">
        <div className="k-cert-inner-border">
          <div className="k-cert-monogram-wrap">
            <KraftMonogram brand={brand} size="lg"/>
          </div>

          <h1 className="k-cert-title">Certificate of Craft</h1>

          <div className="k-cert-intro">This is to certify that</div>
          <h2 className="k-cert-product">{recipe.name || 'Product name'}</h2>

          <div className="k-cert-outro">was crafted with care in the kitchen of</div>
          <div className="k-cert-brand">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && (
            <p className="k-cert-tagline">— {brand.tagline} —</p>
          )}

          <div className="k-cert-signature-row">
            <div className="k-cert-sig-block">{signature}</div>
            <div className="k-cert-seal-center">
              <KraftSeal text="BAKED / WITH / CARE" size={82} rotation={0}/>
            </div>
            <div className="k-cert-sig-block k-right">{today}</div>
          </div>

          <div className="k-cert-footer">
            {address && <div>{address}</div>}
            {contact && <div dangerouslySetInnerHTML={{
              __html: contact.replace(/@\w+/g, m => `<span class="k-brown">${m}</span>`)
                .replace(/fb\/\w+/g, m => `<span class="k-brown">${m}</span>`)
            }}/>}
          </div>
        </div>
      </div>
    </div>
  )
}
