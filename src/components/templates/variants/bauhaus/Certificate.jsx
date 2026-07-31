import { BhEyebrow } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm) — premium orders
 *
 * Cream paper. Three solid shapes at the corners of the page:
 *   - large BLUE quarter-circle bulging inward from the top-left corner
 *     (~50mm radius)
 *   - small YELLOW quarter-circle on the right edge
 *   - small RED square in the bottom-right corner
 *
 * Center: a thin black-outlined rectangle frame holding the certificate
 * content. Inside the frame:
 *   - CERTIFICATE OF CRAFT blue eyebrow at top
 *   - "This is to certify that" muted line
 *   - MASSIVE all-black Archivo Black product title
 *   - "was made by hand in the kitchen of" muted line
 *   - Brand name in bold BLUE Archivo Black caps
 *   - Tagline · city muted line
 *   - Near the bottom: a small YELLOW filled circle (~15mm) with tiny
 *     stacked "MADE / BY / HAND" black text, flanked by two solid black
 *     signature/date lines
 */
export function BhCertificate({ recipe = {}, brand = {}, customization = {} }) {
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

  const sealLines = sealText.split('/').map(s => s.trim())

  return (
    <div className="tpl bh-tpl bh-cert printable">
      {/* Corner shape composition */}
      <div className="bh-cert-qc-blue"/>
      <div className="bh-cert-qc-yellow"/>
      <div className="bh-cert-sq-red"/>

      <div className="bh-cert-frame">
        <div className="bh-cert-frame-top">
          <BhEyebrow tone="blue" className="bh-cert-title-label">{title}</BhEyebrow>
        </div>

        <div className="bh-cert-body">
          <p className="bh-cert-intro">{introLine}</p>
          <h2 className="bh-title bh-cert-product">
            {(recipe.name || 'Product name').toUpperCase()}
          </h2>
        </div>

        <div className="bh-cert-attribution">
          <p className="bh-cert-outro">{outroLine}</p>
          <div className="bh-cert-brand-name">
            {(brand.business_name || 'Your Bakery').toUpperCase()}
          </div>
          <div className="bh-cert-tagline">
            {brand.tagline || 'Artisan bakery'} — {cityLine.toUpperCase()}
          </div>
        </div>

        <div className="bh-cert-signature-row">
          <div className="bh-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="bh-cert-sig-img"/>}
            <div className="bh-cert-sig-line"/>
            <BhEyebrow tone="muted">{bakerName}</BhEyebrow>
          </div>
          <div className="bh-cert-seal-wrap">
            <div className="bh-cert-seal">
              {sealLines.map((l, i) => (
                <span key={i} className="bh-cert-seal-line">{l}</span>
              ))}
            </div>
          </div>
          <div className="bh-cert-sig-cell bh-cert-sig-cell-right">
            <div className="bh-cert-sig-line"/>
            <BhEyebrow tone="muted">{dateStr}</BhEyebrow>
          </div>
        </div>
      </div>
    </div>
  )
}
