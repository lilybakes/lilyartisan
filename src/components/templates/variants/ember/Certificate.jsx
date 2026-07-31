import { EmberEyebrow, EmberRule, EmberSeal } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm) — premium orders
 *
 * Top: horizontal gradient stripe (burgundy→red→orange) with a rounded
 * bottom edge (via border-radius on the strip). Below on cream:
 *
 * CERTIFICATE OF CRAFT ember small caps centered. "This is to certify
 * that" muted sans. MASSIVE product name heavy condensed uppercase black
 * centered — the main event. "was made by hand in the kitchen of" muted
 * sans. Brand name heavy condensed uppercase ember red. Muted sans
 * tagline.
 *
 * Filled circular GRADIENT seal (burgundy→red→orange) with "MADE / BY /
 * HAND" heavy condensed uppercase cream — centered between two thick
 * black signature rules with HEAD BAKER (left) and date (right).
 *
 * Centered footer with contact + @handle in bold ember. Full-width
 * near-black bar at the very bottom edge — signature Ember frame.
 */
export function EmberCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title      = customization.title      || 'Certificate of Craft'
  const introLine  = customization.intro_line || 'This is to certify that'
  const outroLine  = customization.outro_line || 'was made by hand in the kitchen of'
  const bakerName  = customization.head_baker_name || brand.head_baker_name || 'Head Baker'
  const sigUrl     = customization.signature_url   || brand.head_baker_signature_url
  const sealText   = customization.seal_text       || 'MADE / BY / HAND'

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()

  const contact = [
    [brand?.address_line1, brand?.address_line2].filter(Boolean).join(', '),
    brand?.phone,
  ].filter(Boolean).join(' · ')

  const socials = [
    brand?.website,
    brand?.instagram && <span key="ig" className="em-footer-social">@{brand.instagram}</span>,
    brand?.facebook && `fb/${brand.facebook}`,
  ].filter(Boolean)

  return (
    <div className="tpl em-tpl em-cert printable">
      <div className="em-cert-top-stripe" aria-hidden="true"/>

      <div className="em-cert-body">
        <EmberEyebrow className="em-cert-title-label">{title}</EmberEyebrow>

        <div className="em-cert-inner">
          <p className="em-cert-intro">{introLine}</p>
          <h2 className="em-title em-cert-product">
            {(recipe.name || 'Product name').toUpperCase()}
          </h2>
          <p className="em-cert-outro">{outroLine}</p>
          <div className="em-cert-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
          {brand.tagline && <p className="em-cert-tagline">{brand.tagline}</p>}
        </div>

        <div className="em-cert-signature-row">
          <div className="em-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="em-cert-sig-img"/>}
            <EmberRule/>
            <EmberEyebrow tone="muted">{bakerName}</EmberEyebrow>
          </div>
          <div className="em-cert-seal-wrap">
            <EmberSeal text={sealText} size={96}/>
          </div>
          <div className="em-cert-sig-cell em-cert-sig-cell-right">
            <EmberRule/>
            <EmberEyebrow tone="muted">{dateStr}</EmberEyebrow>
          </div>
        </div>

        <div className="em-cert-footer">
          {contact && <div className="em-cert-footer-line">{contact}</div>}
          {socials.length > 0 && (
            <div className="em-cert-footer-line">
              {socials.reduce((acc, cur, i) => {
                if (i === 0) return [cur]
                return [...acc, ' · ', cur]
              }, [])}
            </div>
          )}
        </div>
      </div>

      <div className="em-cert-bottom-bar" aria-hidden="true"/>
    </div>
  )
}
