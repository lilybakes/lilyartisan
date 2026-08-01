import { RpBrandLockup, RpEyebrow, rpMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * FULL RUST background — the only template with a saturated fill. Brand
 * lockup top-left in cream (name Manrope 800, cream tagline underneath).
 * Thin cream OUTLINED circle top-right (~18mm). Big SOLID BROWN circle
 * bleeds off the bottom-right corner (~90mm) — the brown ties back to
 * the overprint colour elsewhere in the set.
 *
 * FRESH FROM OUR KITCHEN cream tracked eyebrow. Huge product title in
 * cream Manrope 800 (no offset — the rust ground is busy enough). Cream
 * body copy. CREAM filled rectangle CTA "From RM 10.00" in rust text —
 * the eye-catch button. Bottom row: cream @handle left, cream website
 * right.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Fresh from our kitchen"
 *   customization.cta_prefix    — default "From"
 *   customization.desc_override — overrides recipe.description
 */
export function RpSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  const social = brand.instagram
    ? `@${brand.instagram}`
    : (brand.facebook ? `fb/${brand.facebook}` : '')

  return (
    <div className="tpl rp-tpl rp-social printable">
      <div className="rp-social-corner" aria-hidden="true"/>
      <div className="rp-social-corner-ring" aria-hidden="true"/>

      <header className="rp-social-header">
        <RpBrandLockup brand={brand} tone="oncolor"/>
      </header>

      <div className="rp-social-body">
        <RpEyebrow tone="cream" className="rp-social-eyebrow">{eyebrow}</RpEyebrow>
        <h2 className="rp-social-title">{recipe.name || 'Product name'}</h2>
        {desc && <p className="rp-social-desc">{desc}</p>}

        {suggested > 0 && (
          <div className="rp-social-cta">
            {ctaPrefix} {rpMoney(suggested)}
          </div>
        )}
      </div>

      <footer className="rp-social-footer">
        <div className="rp-social-handles">{social}</div>
        <div className="rp-social-website">{brand.website || ''}</div>
      </footer>
    </div>
  )
}
