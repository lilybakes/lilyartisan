import { CrispBrandLockup, crispMoney } from './_parts.jsx'

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
export function CrispSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  return (
    <div className="tpl c-tpl c-social printable">
      <div className="c-social-corner"/>

      <div className="c-social-top">
        <CrispBrandLockup brand={brand} size="sm" layout="row"/>
      </div>

      <div className="c-social-center">
        <div className="c-eyebrow c-eyebrow-brown">{eyebrow}</div>
        <h2 className="c-social-name">{recipe.name || 'Product name'}</h2>
        {desc && <div className="c-social-desc">{desc}</div>}
        {suggested > 0 && (
          <div className="c-social-price-pill">{ctaPrefix} {crispMoney(suggested)}</div>
        )}
      </div>

      <div className="c-social-bottom">
        <div className="c-footer-social">
          {brand.instagram && <>@{brand.instagram}</>}
          {brand.instagram && brand.facebook && <> · </>}
          {brand.facebook && <>fb/{brand.facebook}</>}
        </div>
        <div className="c-social-website">{brand.website || ''}</div>
      </div>
    </div>
  )
}
