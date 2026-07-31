import { PaEyebrow, PaSubtitle, paMoney } from './_parts.jsx'

/**
 * 08 — SOCIAL MEDIA CARD  (1080×1080 = 148×148mm)
 *
 * Full DEEP BURGUNDY background — the only tonal shift for this template.
 * All text in soft cream/blush colors. Thin inner cream border (~1.5mm
 * inset). Content: mauve/blush "FRESH FROM OUR KITCHEN" eyebrow at top,
 * HUGE cream Cormorant title centered, short thin cream/gold rule below,
 * italic muted-cream description, "From RM 10.00" price line. At bottom
 * centered: brand name cream Cormorant, italic subtitle, then social/
 * website line in muted cream.
 */
export function PaSocialMediaCard({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text || 'Fresh from our kitchen'
  const ctaPrefix = customization.cta_prefix   || 'From'
  const desc      = customization.desc_override || recipe.description
  const suggested = Number(recipe.suggested_price) || 0

  const tagline = brand.tagline || 'Artisan bakery'
  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const brandSubtitle = `${tagline} — ${cityLine}`

  const socialParts = []
  if (brand.instagram) socialParts.push(`@${brand.instagram}`)
  if (brand.website)   socialParts.push(brand.website)
  const socialLine = socialParts.join(' · ')

  return (
    <div className="tpl pa-tpl pa-social printable">
      <div className="pa-social-frame">
        <div className="pa-social-top">
          <PaEyebrow tone="cream" className="pa-social-eyebrow">{eyebrow}</PaEyebrow>
        </div>

        <div className="pa-social-body">
          <h2 className="pa-title pa-social-title">
            {recipe.name || 'Product name'}
          </h2>
          <div className="pa-social-rule"/>
          {desc && <p className="pa-social-desc">{desc}</p>}
          {suggested > 0 && (
            <p className="pa-social-price">{ctaPrefix} {paMoney(suggested)}</p>
          )}
        </div>

        <div className="pa-social-footer">
          <div className="pa-social-brand-name">{brand.business_name || 'Your Bakery'}</div>
          <p className="pa-social-brand-tag">{brandSubtitle}</p>
          {socialLine && <div className="pa-social-handles">{socialLine}</div>}
        </div>
      </div>
    </div>
  )
}
