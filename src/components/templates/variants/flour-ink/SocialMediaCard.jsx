import { FiLogo, FiEyebrow, fiMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * Full NEAR-BLACK ink background — the only tonal shift for this
 * template. Top-left: brand letter-tracked cream + tagline muted-cream.
 * Top-right: outlined thin DC circle in cream.
 *
 * TODAY (or custom eyebrow) small caps muted-cream. MASSIVE letter-
 * tracked light product title cream (wraps to 2 lines). Thin cream rule.
 * Description cream sans regular. OUTLINED RECTANGLE CTA "FROM RM 10.00"
 * cream — the only cta-shape on the whole variant, matching the mockup.
 *
 * Bottom: socials cream left, website cream muted right.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Today"
 *   customization.cta_prefix    — default "From"
 *   customization.desc_override — overrides recipe.description
 */
export function FiSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
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
    <div className="tpl fi-tpl fi-social printable">
      <header className="fi-social-header">
        <div className="fi-social-brand-block">
          <div className="fi-social-brand-name">
            {(brand.business_name || 'Your Bakery').toUpperCase()}
          </div>
          <FiEyebrow tone="cream" className="fi-social-brand-tag">
            {brand.tagline || 'Artisan bakery'} · {cityLine.toUpperCase()}
          </FiEyebrow>
        </div>
        <FiLogo brand={brand} size="md" tone="cream"/>
      </header>

      <div className="fi-social-body">
        <FiEyebrow tone="cream" className="fi-social-eyebrow">{eyebrow}</FiEyebrow>
        <h2 className="fi-title fi-social-title">
          {(recipe.name || 'Product name').toUpperCase()}
        </h2>
        <div className="fi-social-rule"/>
        {desc && <p className="fi-social-desc">{desc}</p>}

        {suggested > 0 && (
          <div className="fi-social-cta">
            <FiEyebrow tone="cream">{ctaPrefix} {fiMoney(suggested)}</FiEyebrow>
          </div>
        )}
      </div>

      <footer className="fi-social-footer">
        <div className="fi-social-handles">{socials}</div>
        <div className="fi-social-website">
          {(brand.website || '').toUpperCase()}
        </div>
      </footer>
    </div>
  )
}
