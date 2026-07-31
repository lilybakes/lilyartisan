import {
  EditorialLogo, EditorialEyebrow, EditorialRule, EditorialSeal,
  EditorialSideText, stylizeTitle,
} from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape) — premium orders
 *
 * Full-height rust LEFT band with rotated CERTIFICATE OF CRAFT small-caps
 * cream text running vertically. Top-right: brand serif bold + tagline,
 * DC filled rust square.
 *
 * Center: THIS IS TO CERTIFY THAT rust eyebrow, then a MASSIVE serif
 * product title with italic accent, then a body paragraph.
 *
 * Bottom-right: bordered thin CIRCULAR seal "BAKED WITH CARE" small caps.
 * Bottom-left: horizontal black rule + HEAD BAKER small caps.
 * Bottom-center: horizontal black rule + date small caps.
 * Footer: inline address + contact + socials.
 */
export function EditorialCertificate({ recipe = {}, brand = {}, customization = {} }) {
  const title      = customization.title      || 'Certificate of Craft'
  const introLine  = customization.intro_line || 'This is to certify that'
  const bakerName  = customization.head_baker_name    || brand.head_baker_name || 'Head Baker'
  const sigUrl     = customization.signature_url      || brand.head_baker_signature_url
  const sealText   = customization.seal_text          || 'BAKED / WITH / CARE'

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).toUpperCase()

  // Craft-story sentence — uses brand.tagline city fallback for pleasant prose
  const city = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'our neighborhood'
  const craftLine = customization.craft_line ||
    <>was crafted with care in the kitchen of <strong>{brand.business_name || 'Your Bakery'}</strong> — a small bakery in {city} working in daily batches.</>

  return (
    <div className="tpl e-tpl e-cert printable">
      <aside className="e-cert-sideband">
        <EditorialSideText>{title.toUpperCase()}</EditorialSideText>
      </aside>

      <div className="e-cert-main">
        <header className="e-cert-header">
          <div className="e-cert-brand-block">
            <h1 className="e-brand-name e-cert-brand-name">{brand.business_name || 'Your Bakery'}</h1>
            {brand.tagline && <p className="e-brand-tagline e-cert-brand-tag">{brand.tagline}</p>}
          </div>
          <EditorialLogo brand={brand} size="md"/>
        </header>

        <div className="e-cert-body">
          <EditorialEyebrow tone="rust" className="e-cert-intro">{introLine}</EditorialEyebrow>
          <h2 className="e-title e-cert-product">
            {stylizeTitle(recipe.name || 'Product name')}
          </h2>
          <p className="e-cert-craft">{craftLine}</p>
        </div>

        <div className="e-cert-seal-wrap">
          <EditorialSeal text={sealText} size={90}/>
        </div>

        <div className="e-cert-sig-row">
          <div className="e-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="e-cert-sig-img"/>}
            <EditorialRule tone="black" weight="thick"/>
            <EditorialEyebrow tone="muted">{bakerName}</EditorialEyebrow>
          </div>
          <div className="e-cert-sig-cell">
            <EditorialRule tone="black" weight="thick"/>
            <EditorialEyebrow tone="muted">{dateStr}</EditorialEyebrow>
          </div>
        </div>

        <div className="e-cert-footer">
          {[
            [brand.address_line1, brand.address_line2].filter(Boolean).join(', '),
            brand.phone,
            brand.website,
            brand.instagram ? <span key="ig" className="e-footer-social">@{brand.instagram}</span> : null,
            brand.facebook ? <span key="fb" className="e-footer-social">fb/{brand.facebook}</span> : null,
          ].filter(Boolean).reduce((acc, cur, i) => {
            if (i === 0) return [cur]
            return [...acc, ' · ', cur]
          }, [])}
        </div>
      </div>
    </div>
  )
}
