import { FiLogo, FiEyebrow, FiSeal } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm) — premium orders
 *
 * Thin rectangular border framing the entire content. Everything centered.
 * Outlined thin DC circle at the top, CERTIFICATE OF CRAFT small caps
 * eyebrow. Wide gap.
 *
 * "This certifies that" muted sans centered. MASSIVE letter-tracked light
 * product title centered. Wide gap. "was made by hand in the kitchen of"
 * muted sans. Brand name letter-tracked light. Tagline + city small caps
 * eyebrow muted.
 *
 * Below: HEAVY OUTLINED circle "MADE / BY / HAND" — much thicker stroke
 * than the DC monogram (3px vs 1px), anchoring the composition. Two thin
 * horizontal rules flank it — HEAD BAKER left, date right, both labeled
 * in small caps below.
 *
 * Centered footer at the bottom with address, contact, and socials —
 * @handle rendered in light-black to match the whole variant's restraint.
 */
export function FiCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title      = customization.title      || 'Certificate of Craft'
  const introLine  = customization.intro_line || 'This certifies that'
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
    <div className="tpl fi-tpl fi-cert printable">
      <div className="fi-cert-border">
        <div className="fi-cert-top">
          <FiLogo brand={brand} size="lg"/>
          <FiEyebrow tone="muted" className="fi-cert-title-label">{title}</FiEyebrow>
        </div>

        <div className="fi-cert-body">
          <p className="fi-cert-intro">{introLine}</p>
          <h2 className="fi-title fi-cert-product">
            {(recipe.name || 'Product name').toUpperCase()}
          </h2>
        </div>

        <div className="fi-cert-attribution">
          <p className="fi-cert-outro">{outroLine}</p>
          <div className="fi-cert-brand-name">
            {(brand.business_name || 'Your Bakery').toUpperCase()}
          </div>
          <FiEyebrow tone="muted" className="fi-cert-tagline">
            {brand.tagline || 'Artisan bakery'} · {cityLine.toUpperCase()}
          </FiEyebrow>
        </div>

        <div className="fi-cert-signature-row">
          <div className="fi-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="fi-cert-sig-img"/>}
            <div className="fi-cert-sig-line"/>
            <FiEyebrow tone="muted">{bakerName}</FiEyebrow>
          </div>
          <div className="fi-cert-seal-wrap">
            <FiSeal text={sealText} size={96}/>
          </div>
          <div className="fi-cert-sig-cell fi-cert-sig-cell-right">
            <div className="fi-cert-sig-line"/>
            <FiEyebrow tone="muted">{dateStr}</FiEyebrow>
          </div>
        </div>

        <div className="fi-cert-footer">
          {contactLine && <div className="fi-cert-footer-line">{contactLine}</div>}
          {socialsLine && <div className="fi-cert-footer-line">{socialsLine}</div>}
        </div>
      </div>
    </div>
  )
}
