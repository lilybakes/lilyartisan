import { TeLogo, TeEyebrow, TeSeal } from './_parts.jsx'

/**
 * 10 — CERTIFICATE OF CRAFT  (A4 landscape, 297×210mm) — premium orders
 *
 * FIXED height: 210mm (not min-height) so it doesn't elongate. Thin
 * rectangular border framing all content. Everything centered.
 * Quadrant logo at the top, "CERTIFICATE OF CRAFT" rust mono eyebrow.
 *
 * "This certifies that" muted sans centered. MASSIVE bold Manrope
 * product title centered. "was made by hand in the kitchen of" muted
 * sans. Brand name letter-tracked bold. Tagline + city mono muted.
 *
 * MADE BY HAND seal — rust×navy checkerboard border around a cream
 * inner square with stacked text. Two thin horizontal rules flank it:
 * HEAD BAKER left, date right.
 *
 * Centered mono footer at the bottom.
 */
export function TeCertificate({ recipe = {}, brand = {}, customization = {} }) {
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
    <div className="tpl te-tpl te-cert printable">
      <div className="te-cert-border">
        <div className="te-cert-top">
          <TeLogo brand={brand} size="lg"/>
          <TeEyebrow tone="rust" className="te-cert-title-label">{title}</TeEyebrow>
        </div>

        <div className="te-cert-body">
          <p className="te-cert-intro">{introLine}</p>
          <h2 className="te-title te-cert-product">
            {(recipe.name || 'Product name').toUpperCase()}
          </h2>
        </div>

        <div className="te-cert-attribution">
          <p className="te-cert-outro">{outroLine}</p>
          <div className="te-cert-brand-name">
            {(brand.business_name || 'Your Bakery').toUpperCase()}
          </div>
          <TeEyebrow tone="muted" className="te-cert-tagline">
            {brand.tagline || 'Artisan bakery'} · {cityLine.toUpperCase()}
          </TeEyebrow>
        </div>

        <div className="te-cert-signature-row">
          <div className="te-cert-sig-cell">
            {sigUrl && <img src={sigUrl} alt="signature" className="te-cert-sig-img"/>}
            <div className="te-cert-sig-line"/>
            <TeEyebrow tone="muted">{bakerName}</TeEyebrow>
          </div>
          <div className="te-cert-seal-wrap">
            <TeSeal text={sealText} size={96}/>
          </div>
          <div className="te-cert-sig-cell te-cert-sig-cell-right">
            <div className="te-cert-sig-line"/>
            <TeEyebrow tone="muted">{dateStr}</TeEyebrow>
          </div>
        </div>

        <div className="te-cert-footer">
          {contactLine && <div className="te-cert-footer-line">{contactLine}</div>}
          {socialsLine && <div className="te-cert-footer-line">{socialsLine}</div>}
        </div>
      </div>
    </div>
  )
}
