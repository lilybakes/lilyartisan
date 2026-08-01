import { TrEyebrow, TrStatusChip, trMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * Dark navy grid paper + a soft teal RADIAL GLOW in the top-right corner —
 * the "CRT monitor" vibe.
 *
 * Top row: `The Daily Crumb` Manrope 800 white LEFT + `ARTISAN BAKERY /
 * IPOH` mono muted subtitle. `• IN STOCK` teal-outlined status chip
 * top-right.
 *
 * Body: teal mono `FRESH FROM OUR KITCHEN` eyebrow, then HUGE Manrope 800
 * white 2-line product title, off-white body copy about the product, then
 * TEAL FILLED rectangle CTA `FROM RM 10.00` (dark navy text on teal, mono
 * uppercase).
 *
 * Bottom row: `@THEDAILYCRUMB · FB/THEDAILYCRUMB` mono teal LEFT,
 * `THEDAILYCRUMB.COM` mono muted RIGHT.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "FRESH FROM OUR KITCHEN"
 *   customization.cta_prefix    — default "FROM"
 *   customization.desc_override — overrides recipe.description
 */
export function TrSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'FRESH FROM OUR KITCHEN'
  const ctaPrefix = customization.cta_prefix   || 'FROM'
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
    <div className="tpl tr-tpl tr-social printable">
      <header className="tr-social-header">
        <div className="tr-social-brand">
          <div className="tr-social-brand-name">
            {brand.business_name || 'The Daily Crumb'}
          </div>
          <div className="tr-social-brand-sub">
            {(brand.tagline || 'ARTISAN BAKERY').toUpperCase()} / {cityLine.toUpperCase()}
          </div>
        </div>
        <TrStatusChip tone="teal">IN STOCK</TrStatusChip>
      </header>

      <div className="tr-social-body">
        <TrEyebrow tone="teal" className="tr-social-eyebrow">{eyebrow}</TrEyebrow>
        <h2 className="tr-social-title">{recipe.name || 'Chocolate Fudge Cake'}</h2>
        {desc && <p className="tr-social-desc">{desc}</p>}

        {suggested > 0 && (
          <div className="tr-social-cta">
            {ctaPrefix} {trMoney(suggested)}
          </div>
        )}
      </div>

      <footer className="tr-social-footer">
        <div className="tr-social-handles">{socials}</div>
        <div className="tr-social-website">
          {(brand.website || '').toUpperCase()}
        </div>
      </footer>
    </div>
  )
}
