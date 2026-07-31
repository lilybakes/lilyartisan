import {
  VerdantEyebrow, VerdantDecorCircle, verdantMoney,
} from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * Full dark-green background. Two decorative light-green circles float in
 * the right half (large top-right, smaller bottom-right) plus a thin
 * outlined circle in the top-right corner — the soft nature-inspired
 * flourishes that anchor the Verdant voice.
 *
 * Top-left: brand serif cream + ARTISAN BAKERY · IPOH small caps cream.
 * Body left-aligned: FRESH FROM OUR KITCHEN mint eyebrow, MASSIVE serif
 * product title cream (wraps 2 lines), description muted-cream sans.
 * CTA: rounded pill cream fill with dark green bold text "From RM 10.00".
 * Bottom: @handles left cream, website right cream muted.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Fresh from our kitchen"
 *   customization.cta_prefix    — default "From"
 *   customization.desc_override — overrides recipe.description
 */
export function VerdantSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  const brandLine = `${brand.tagline || 'Artisan bakery'}${
    brand?.city ? ` · ${brand.city}` : (brand?.address_line2 ? ` · ${brand.address_line2.split(',').pop().trim()}` : ' · Ipoh')
  }`

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl v-tpl v-social printable">
      <VerdantDecorCircle size={520} top={-160} right={-160} tone="green-tint-on-green"/>
      <VerdantDecorCircle size={280} bottom={-100} right={-40} tone="green-tint-on-green" outlined/>
      <VerdantDecorCircle size={90}  top={40}  right={40}  tone="green-tint-on-green" outlined/>

      <header className="v-social-header">
        <h1 className="v-brand-name v-brand-cream v-social-brand-name">{brand.business_name || 'Your Bakery'}</h1>
        <VerdantEyebrow tone="cream" className="v-social-brand-line">{brandLine}</VerdantEyebrow>
      </header>

      <div className="v-social-body">
        <VerdantEyebrow tone="cream" className="v-social-eyebrow">{eyebrow}</VerdantEyebrow>
        <h2 className="v-title v-social-title">{recipe.name || 'Product name'}</h2>
        {desc && <p className="v-social-desc">{desc}</p>}

        {suggested > 0 && (
          <div className="v-social-cta">
            {ctaPrefix} {verdantMoney(suggested)}
          </div>
        )}
      </div>

      <footer className="v-social-footer">
        <div className="v-social-handles">{socials}</div>
        <div className="v-social-website">{brand.website || ''}</div>
      </footer>
    </div>
  )
}
