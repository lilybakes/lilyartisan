import { TeLogo, TeEyebrow, teMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * Full NAVY background with a subtle white checkerboard texture at
 * ~5% opacity — the tessellating base of the whole variant, whispered
 * into the darkest surface. RIGHT-SIDE vertical rust+brown+cream
 * diagonal stripe band (~28mm wide, full height).
 *
 * Top-left brand letter-tracked cream + tagline muted. Top-right
 * (before the stripe band) quadrant logo cream tone.
 *
 * MASSIVE bold Manrope product title cream (wraps to 2 lines). Cream
 * rule. Description cream sans regular. RUST FILLED SOLID CTA
 * rectangle "FROM RM 10.00" bottom-left — the price is white on rust.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Today"
 *   customization.cta_prefix    — default "From"
 *   customization.desc_override — overrides recipe.description
 */
export function TeSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Today'
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
    <div className="tpl te-tpl te-social printable">
      <div className="te-social-tex" aria-hidden="true"/>
      <div className="te-social-stripe te-stripe-band-v te-stripe-rust-brown-cream" aria-hidden="true"/>

      <div className="te-social-inner">
        <header className="te-social-header">
          <div className="te-social-brand-block">
            <div className="te-social-brand-name">
              {(brand.business_name || 'Your Bakery').toUpperCase()}
            </div>
            <TeEyebrow tone="cream" className="te-social-brand-tag">
              {brand.tagline || 'Artisan bakery'} · {cityLine.toUpperCase()}
            </TeEyebrow>
          </div>
          <TeLogo brand={brand} size="md" tone="cream"/>
        </header>

        <div className="te-social-body">
          <TeEyebrow tone="cream-strong" className="te-social-eyebrow">{eyebrow}</TeEyebrow>
          <h2 className="te-title te-social-title">
            {(recipe.name || 'Product name').toUpperCase()}
          </h2>
          <div className="te-social-rule"/>
          {desc && <p className="te-social-desc">{desc}</p>}
        </div>

        <div className="te-social-bottom">
          {suggested > 0 && (
            <div className="te-social-cta">
              {ctaPrefix.toUpperCase()} {teMoney(suggested)}
            </div>
          )}
          <div className="te-social-footer">
            <div className="te-social-handles">{socials}</div>
            <div className="te-social-website">
              {(brand.website || '').toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
