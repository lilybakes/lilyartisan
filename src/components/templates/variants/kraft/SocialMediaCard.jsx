import { KraftBrandLockup, kraftMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL CARD  (1080×1080) — screen only
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text — default "Fresh from our kitchen"
 *   customization.cta_prefix   — default "From" (renders "From RM 10.00")
 *   customization.desc_override — optional override for recipe.description
 *   recipe.description         — short marketing tagline
 *   recipe.suggested_price     — price shown in pill
 */
export function KraftSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow    = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix  = customization.cta_prefix   || 'From'
  const desc       = customization.desc_override || recipe.description
  const suggested  = Number(recipe.suggested_price) || 0

  return (
    <div className="tpl k-tpl k-social printable">
      <div className="k-social-top">
        <KraftBrandLockup brand={brand} size="md" layout="column"/>
      </div>

      <div className="k-social-center">
        <div className="k-eyebrow k-social-eyebrow">{eyebrow}</div>
        <h2 className="k-social-name">{recipe.name || 'Product name'}</h2>
        {desc && <div className="k-social-desc">{desc}</div>}
        {suggested > 0 && (
          <div className="k-social-price-pill">{ctaPrefix} {kraftMoney(suggested)}</div>
        )}
      </div>

      <div className="k-social-bottom">
        <div className="k-social-handles">
          {brand.instagram && <>@{brand.instagram}</>}
          {brand.instagram && brand.facebook && <> · </>}
          {brand.facebook && <>fb/{brand.facebook}</>}
        </div>
        <div>{brand.website || ''}</div>
      </div>
    </div>
  )
}
