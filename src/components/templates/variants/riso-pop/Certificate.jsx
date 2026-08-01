import { RpOffsetTitle, RpEyebrow } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm) — premium orders
 *
 * Cream landscape. Two big SOLID CIRCLES bleed off opposite corners —
 * rust top-left (~65mm), navy bottom-right (~65mm) — anchoring the
 * composition with the variant's colour signature.
 *
 * A thin NAVY rectangle frame sits ~7mm inset from the edges. Inside the
 * frame, everything is centered: CERTIFICATE OF CRAFT rust tracked
 * eyebrow, muted italic "This is to certify that", the offset-effect
 * product title in XL (72px), navy divider rule, muted italic "was made
 * by hand in the kitchen of", brand name in navy Manrope 800, rust
 * tracked tagline.
 *
 * Signature row: two navy rules flank a small SOLID RUST circle "seal"
 * with stacked "MADE / BY / HAND" cream tracked caps text. HEAD BAKER
 * rust label left, date rust label right. Centered address/socials
 * footer at the very bottom.
 */
export function RpCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title      = customization.title      || 'Certificate of Craft'
  const introLine  = customization.intro_line || 'This is to certify that'
  const outroLine  = customization.outro_line || 'was made by hand in the kitchen of'
  const bakerName  = customization.head_baker_name || brand.head_baker_name || 'Head Baker'
  const sigUrl     = customization.signature_url   || brand.head_baker_signature_url
  const sealText   = customization.seal_text       || 'MADE / BY / HAND'

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const tagline = `${brand.tagline || 'Artisan bakery'} · ${cityLine}`

  const contactLine = [
    [brand?.address_line1, brand?.address_line2].filter(Boolean).join(', '),
    brand?.phone,
  ].filter(Boolean).join(' · ')

  const socialsLine = [
    brand?.website,
    brand?.instagram && `@${brand.instagram}`,
    brand?.facebook && `fb/${brand.facebook}`,
  ].filter(Boolean).join(' · ')

  const sealLines = sealText.split('/').map(s => s.trim())

  return (
    <div className="tpl rp-tpl rp-cert printable">
      <div className="rp-cert-corner-rust" aria-hidden="true"/>
      <div className="rp-cert-corner-navy" aria-hidden="true"/>

      <div className="rp-cert-border">
        <RpEyebrow tone="rust" className="rp-cert-eyebrow-top">{title}</RpEyebrow>

        <div className="rp-cert-body">
          <p className="rp-cert-intro">{introLine}</p>
          <RpOffsetTitle size="xl">{recipe.name || 'Product name'}</RpOffsetTitle>

          <div className="rp-cert-divider"/>

          <p className="rp-cert-outro">{outroLine}</p>
          <div className="rp-cert-brand-name">{brand.business_name || 'Your Bakery'}</div>
          <RpEyebrow tone="rust" className="rp-cert-tagline">{tagline}</RpEyebrow>
        </div>

        <div className="rp-cert-signature-row">
          <div className="rp-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="rp-cert-sig-img"/>}
            <div className="rp-cert-sig-line"/>
            <RpEyebrow tone="rust">{bakerName}</RpEyebrow>
          </div>
          <div className="rp-cert-seal-wrap">
            <div className="rp-cert-seal">
              <div className="rp-cert-seal-inner">
                {sealLines.map((l, i) => <span key={i}>{l}</span>)}
              </div>
            </div>
          </div>
          <div className="rp-cert-sig-cell rp-cert-sig-cell-right">
            <div className="rp-cert-sig-line"/>
            <RpEyebrow tone="rust">{dateStr}</RpEyebrow>
          </div>
        </div>

        <div className="rp-cert-footer">
          {contactLine && <div className="rp-cert-footer-line">{contactLine}</div>}
          {socialsLine && <div className="rp-cert-footer-line">{socialsLine}</div>}
        </div>
      </div>
    </div>
  )
}
