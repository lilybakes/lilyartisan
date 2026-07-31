import { LetterpressShortRule, letterpressMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL CARD  (1080×1080) — screen only
 *
 * The centerpiece of the Vintage Letterpress set.
 * Thin brown double outer border, cream ground, big italic Playfair title,
 * short accent rule, description, small-caps price line, delicate brand
 * block at bottom. Every dimension tuned so the title breathes.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Fresh from our kitchen"
 *   customization.cta_prefix    — default "From" (renders "From RM 10.00")
 *   customization.desc_override — optional override for recipe.description
 *   recipe.description          — italic serif line under the title
 *   recipe.suggested_price      — small-caps burgundy price line
 */
export function LetterpressSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook ? `fb/${brand.facebook}` : null,
    brand?.website || null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl l-tpl l-social printable">
      <div className="l-social-border">
        <div className="l-social-inner">

          <div className="l-social-eyebrow-wrap">
            <div className="l-eyebrow l-eyebrow-burgundy l-social-eyebrow">{eyebrow}</div>
          </div>

          <div className="l-social-center">
            <h2 className="l-social-name">{recipe.name || 'Product name'}</h2>
            <LetterpressShortRule/>
            {desc && <p className="l-social-desc">{desc}</p>}
            {suggested > 0 && (
              <div className="l-eyebrow l-eyebrow-burgundy l-social-price">
                {ctaPrefix} {letterpressMoney(suggested)}
              </div>
            )}
          </div>

          <div className="l-social-bottom">
            <h3 className="l-social-brand-name">{brand.business_name || 'Your Bakery'}</h3>
            {brand.tagline && <p className="l-social-brand-tag">{brand.tagline}</p>}
            {socials && (
              <div className="l-eyebrow l-eyebrow-burgundy l-social-handles">{socials}</div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
