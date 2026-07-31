import { auMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * ENTIRE PAGE is the aurora gradient background. Top-left: white brand
 * lockup, tagline in caps. Top-right: small white outlined circle. Body:
 * purple-tinted "FRESH FROM OUR KITCHEN" eyebrow, HUGE white Manrope
 * extrabold product title (two lines), white body copy. Bottom-left: a
 * WHITE rounded pill CTA carrying purple "FROM RM 10.00" text.
 */
export function AuSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ').toUpperCase()

  return (
    <div className="tpl au-tpl au-social printable">
      <header className="au-social-header">
        <div className="au-social-brand-block">
          <div className="au-social-brand-name">
            {(brand.business_name || 'Your Bakery').toUpperCase()}
          </div>
          <div className="au-social-brand-tag">
            {(brand.tagline || 'Artisan bakery').toUpperCase()} · {cityLine.toUpperCase()}
          </div>
        </div>
        <div className="au-social-mark"/>
      </header>

      <div className="au-social-body">
        <div className="au-social-eyebrow">{eyebrow.toUpperCase()}</div>
        <h2 className="au-title au-social-title">
          {(recipe.name || 'Product name').toUpperCase()}
        </h2>
        {desc && <p className="au-social-desc">{desc}</p>}

        {suggested > 0 && (
          <div className="au-social-cta">
            {ctaPrefix.toUpperCase()} {auMoney(suggested)}
          </div>
        )}
      </div>

      <footer className="au-social-footer">
        <div className="au-social-handles">{socials}</div>
        <div className="au-social-website">
          {(brand.website || '').toUpperCase()}
        </div>
      </footer>
    </div>
  )
}
