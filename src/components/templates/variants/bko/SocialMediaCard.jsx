import { BkoBrandLockup, bkoMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL CARD  (1080×1080) — screen only
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Fresh from our kitchen"
 *   customization.cta_prefix    — default "From" (renders "From RM 10.00")
 *   customization.desc_override — optional override for recipe.description
 *   recipe.description          — short marketing tagline
 *   recipe.suggested_price      — price shown in bordered pill
 */
export function BkoSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  return (
    <div className="tpl b-tpl b-social printable">
      <div className="b-social-corner"/>

      <div className="b-social-top">
        <BkoBrandLockup brand={brand} size="sm" layout="row"/>
      </div>

      <div className="b-social-center">
        <div className="b-eyebrow b-eyebrow-accent">{eyebrow}</div>
        <h2 className="b-social-name">{recipe.name || 'Product name'}</h2>
        {desc && <div className="b-social-desc">{desc}</div>}
        {suggested > 0 && (
          <div className="b-social-price-pill">{ctaPrefix} {bkoMoney(suggested)}</div>
        )}
      </div>

      <div className="b-social-bottom">
        <div className="b-footer-social">
          {brand.instagram && <>@{brand.instagram}</>}
          {brand.instagram && brand.facebook && <> · </>}
          {brand.facebook && <>fb/{brand.facebook}</>}
        </div>
        <div className="b-social-website">{brand.website || ''}</div>
      </div>
    </div>
  )
}
