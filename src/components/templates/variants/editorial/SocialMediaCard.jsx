import {
  EditorialEyebrow, stylizeTitle, editorialMoney,
} from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm) — screen only
 *
 * Editorial's magazine-cover moment. Top full-width rust masthead splits
 * THE BAKERY NAME (left) and CITY · EST. TAGLINE (right) in cream small
 * caps. Body cream, left-aligned: FRESH FROM OUR KITCHEN rust eyebrow,
 * then a MASSIVE 2-3 line serif title with one italic accent word — this
 * dominates the card. Short thick rust rule paired inline with the
 * description muted text. Filled rust rectangle price button in the
 * bottom-left, cream label inside.
 * Bottom row: social handles left, website right — small caps.
 *
 * FIELD MAPPING:
 *   customization.eyebrow_text  — default "Fresh from our kitchen"
 *   customization.cta_prefix    — default "From" (renders "From RM 10.00")
 *   customization.desc_override — overrides recipe.description
 */
export function EditorialSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  const city = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const mastheadRight = brand.tagline
    ? `${city} · ${brand.tagline}`
    : `${city} · Est. small batch`

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl e-tpl e-social printable">
      <div className="e-social-masthead">
        <div className="e-social-masthead-left">{brand.business_name || 'Your Bakery'}</div>
        <div className="e-social-masthead-right">{mastheadRight}</div>
      </div>

      <div className="e-social-body">
        <EditorialEyebrow tone="rust" className="e-social-eyebrow">{eyebrow}</EditorialEyebrow>

        <h2 className="e-title e-social-title">
          {stylizeTitle(recipe.name || 'Product name')}
        </h2>

        {desc && (
          <div className="e-social-desc-row">
            <span className="e-social-desc-rule"/>
            <span className="e-social-desc-text">{desc}</span>
          </div>
        )}

        {suggested > 0 && (
          <div className="e-social-price">
            {ctaPrefix} {editorialMoney(suggested)}
          </div>
        )}
      </div>

      <footer className="e-social-footer">
        <div className="e-footer-social e-social-handles">{socials}</div>
        <div className="e-social-website">{brand.website || ''}</div>
      </footer>
    </div>
  )
}
