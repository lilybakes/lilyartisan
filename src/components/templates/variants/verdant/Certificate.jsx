import {
  VerdantEyebrow, VerdantSeal, VerdantDecorCircle,
} from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm) — premium orders
 *
 * Thin rounded-rectangle border around the entire content. Decorative
 * light-green circles overflow the top-left and bottom-right corners.
 * Filled dark-green circle (with subtle gradient) at top center anchors
 * the composition, followed by CERTIFICATE OF CRAFT small caps green.
 *
 * Body centered: "This is to certify that" muted sans, MASSIVE serif
 * product title bold black, "was made by hand in the kitchen of" muted
 * sans, big serif brand name green, tagline muted. Filled dark-green
 * "MADE / BY / HAND" seal below. Two thin signature rules with HEAD
 * BAKER (left) and date (right). Centered footer.
 */
export function VerdantCertificate({ recipe = {}, brand = {}, customization = {} }) {
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
    brand?.instagram && <span key="ig" className="v-footer-social">@{brand.instagram}</span>,
    brand?.facebook && `fb/${brand.facebook}`,
  ].filter(Boolean)

  return (
    <div className="tpl v-tpl v-cert printable">
      <VerdantDecorCircle size={220} top={-100} left={-70}  tone="mint-soft"/>
      <VerdantDecorCircle size={260} bottom={-120} right={-90} tone="mint-soft"/>

      <div className="v-cert-border">
        <div className="v-cert-top">
          <VerdantSeal text="" size={64}/>
          <VerdantEyebrow className="v-cert-title-label">{title}</VerdantEyebrow>
        </div>

        <div className="v-cert-body">
          <p className="v-cert-intro">{introLine}</p>
          <h2 className="v-title v-cert-product">{recipe.name || 'Product name'}</h2>
          <p className="v-cert-outro">{outroLine}</p>
          <div className="v-cert-brand-name">{brand.business_name || 'Your Bakery'}</div>
          {brand.tagline && <p className="v-cert-tagline">{brand.tagline}</p>}
        </div>

        <div className="v-cert-signature-row">
          <div className="v-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="v-cert-sig-img"/>}
            <div className="v-cert-sig-line"/>
            <VerdantEyebrow tone="muted">{bakerName}</VerdantEyebrow>
          </div>
          <div className="v-cert-seal-wrap">
            <VerdantSeal text={sealText} size={90}/>
          </div>
          <div className="v-cert-sig-cell v-cert-sig-cell-right">
            <div className="v-cert-sig-line"/>
            <VerdantEyebrow tone="muted">{dateStr}</VerdantEyebrow>
          </div>
        </div>

        <div className="v-cert-footer">
          {contact && <div className="v-cert-footer-line">{contact}</div>}
          {socials.length > 0 && (
            <div className="v-cert-footer-line">
              {socials.reduce((acc, cur, i) => {
                if (i === 0) return [cur]
                return [...acc, ' · ', cur]
              }, [])}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
