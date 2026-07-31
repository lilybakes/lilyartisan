import {
  QuietEyebrow, QuietShortRule, QuietLogo, quietMoney,
} from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * Full rust background. Top-left: brand name + tagline in CREAM (per your
 * mockup this is where the palette inverts). Top-right: DC in cream mono
 * (still no bounding box per design law).
 *
 * FRESH FROM OUR KITCHEN mono muted-cream eyebrow, then a MASSIVE light-
 * weight title in cream wrapping 2 lines. Short thin cream accent rule,
 * description cream, "FROM RM 10.00" mono cream. Bottom: socials cream
 * left, website cream muted right.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Fresh from our kitchen"
 *   customization.cta_prefix    — default "From"
 *   customization.desc_override — overrides recipe.description
 */
export function QuietSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl q-tpl q-social printable">
      <header className="q-social-header">
        <div className="q-social-brand-block">
          <h1 className="q-brand-name q-social-brand-name">{brand.business_name || 'Your Bakery'}</h1>
          {brand.tagline && (
            <p className="q-brand-tagline q-social-brand-tag">{brand.tagline}</p>
          )}
        </div>
        <QuietLogo brand={brand} size="md" tone="cream"/>
      </header>

      <div className="q-social-body">
        <QuietEyebrow tone="cream" className="q-social-eyebrow">{eyebrow}</QuietEyebrow>

        <h2 className="q-title q-social-title">{recipe.name || 'Product name'}</h2>
        <QuietShortRule tone="cream"/>

        {desc && <p className="q-social-desc">{desc}</p>}

        {suggested > 0 && (
          <div className="q-social-price">
            {ctaPrefix.toUpperCase()} {quietMoney(suggested)}
          </div>
        )}
      </div>

      <footer className="q-social-footer">
        <div className="q-social-handles">{socials}</div>
        <div className="q-social-website">{brand.website || ''}</div>
      </footer>
    </div>
  )
}
