import { EmberEyebrow, emberMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * Full gradient background (burgundy→red→orange). A NEAR-BLACK triangular
 * band cuts into the bottom-right via clip-path — the signature Ember
 * asymmetric move. Top-left: brand heavy condensed uppercase cream, IPOH
 * (or city) small caps cream top-right.
 *
 * Body left-aligned: FRESH FROM OUR KITCHEN small caps cream eyebrow,
 * MASSIVE product name heavy condensed uppercase cream (wraps 2-3 lines),
 * description sans cream. Filled cream/off-white rectangle CTA with big
 * condensed ember text "FROM RM 10.00".
 *
 * Bottom: NEAR-BLACK bar with cream socials left + cream muted website
 * right — sits in that clipped triangular band.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Fresh from our kitchen"
 *   customization.cta_prefix    — default "From"
 *   customization.desc_override — overrides recipe.description
 */
export function EmberSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  const city = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl em-tpl em-social printable">
      <div className="em-social-dark-band" aria-hidden="true"/>

      <header className="em-social-header">
        <div className="em-social-brand-name">{(brand.business_name || 'Your Bakery').toUpperCase()}</div>
        <EmberEyebrow tone="cream" className="em-social-city">{city}</EmberEyebrow>
      </header>

      <div className="em-social-body">
        <EmberEyebrow tone="cream" className="em-social-eyebrow">{eyebrow}</EmberEyebrow>
        <h2 className="em-title em-social-title">{(recipe.name || 'Product name').toUpperCase()}</h2>
        {desc && <p className="em-social-desc">{desc}</p>}

        {suggested > 0 && (
          <div className="em-social-cta">
            {(ctaPrefix + ' ' + emberMoney(suggested)).toUpperCase()}
          </div>
        )}
      </div>

      <footer className="em-social-footer">
        <div className="em-social-handles">{socials}</div>
        <div className="em-social-website">{brand.website || ''}</div>
      </footer>
    </div>
  )
}
