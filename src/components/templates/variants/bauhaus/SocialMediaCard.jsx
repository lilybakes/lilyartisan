import { bhMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * Full-bleed solid YELLOW background — the marigold. A small BLUE quarter-
 * circle bulges in from the top-right corner (~50mm radius), and a small
 * RED quarter-circle bulges in from the bottom-left corner (~40mm radius).
 *
 * Content: brand info top-left (black Archivo Black wordmark + tagline).
 * "FRESH FROM OUR KITCHEN" red-orange (vermillion) eyebrow. HUGE black
 * Archivo Black title (naturally wraps to 2 lines). Black body copy. Then
 * a solid BLACK filled rectangle CTA "FROM RM 10.00" with cream text at
 * the bottom of the composition.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Fresh from our kitchen"
 *   customization.cta_prefix    — default "From"
 *   customization.desc_override — overrides recipe.description
 */
export function BhSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
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
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl bh-tpl bh-social printable">
      <div className="bh-social-qc-blue"/>
      <div className="bh-social-qc-red"/>

      <header className="bh-social-header">
        <div className="bh-social-brand-name">
          {(brand.business_name || 'Your Bakery').toUpperCase()}
        </div>
        <div className="bh-social-brand-tag">
          {brand.tagline || 'Artisan bakery'} — {cityLine.toUpperCase()}
        </div>
      </header>

      <div className="bh-social-body">
        <div className="bh-social-eyebrow">{eyebrow.toUpperCase()}</div>
        <h2 className="bh-title bh-social-title">
          {(recipe.name || 'Product name').toUpperCase()}
        </h2>
        {desc && <p className="bh-social-desc">{desc}</p>}
      </div>

      <footer className="bh-social-footer">
        {suggested > 0 && (
          <div className="bh-social-cta">
            {ctaPrefix.toUpperCase()} {bhMoney(suggested)}
          </div>
        )}
        <div className="bh-social-handles">
          <div>{socials}</div>
          {brand.website && <div className="bh-social-website">{brand.website.toUpperCase()}</div>}
        </div>
      </footer>
    </div>
  )
}
