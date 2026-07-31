import { TeLogo, TeEyebrow, TeShortRule } from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * MIDDLE: rust×cream CHECKERBOARD BAND (~30mm tall, ~5-6mm tiles),
 * centered — the eye-catch. Above it: outlined "punch hole" circle,
 * quadrant logo, brand name. Below the checker: MADE THIS MORNING
 * rust mono eyebrow, bold Manrope product title, care body copy.
 *
 * BOTTOM: full-width navy×cream diagonal band (~16mm), with a small
 * centered mono contact footer overlaid above it.
 */
export function TeDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow  = customization.eyebrow_text || 'Made this morning'
  const careBody =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Keep it under a dome at room temperature, and eat within four days. Refrigerate in hot weather.'

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ').toUpperCase()
  const contact = [brand.website, brand.phone].filter(Boolean).join(' · ').toUpperCase()

  return (
    <div className="tpl te-tpl te-delivery printable">
      <div className="te-delivery-hole"/>

      <div className="te-delivery-brand">
        <TeLogo brand={brand} size="md"/>
        <div className="te-delivery-brand-name">
          {(brand.business_name || 'Your Bakery').toUpperCase()}
        </div>
      </div>

      <div className="te-delivery-check te-check-rust-cream"/>

      <div className="te-delivery-body">
        <TeEyebrow tone="rust" className="te-delivery-eyebrow">{eyebrow}</TeEyebrow>
        <h2 className="te-title te-delivery-product">
          {(recipe.name || 'Product name').toUpperCase()}
        </h2>
        <TeShortRule/>
        <p className="te-delivery-care-body">{careBody}</p>
      </div>

      <div className="te-delivery-footer">
        {socials && <div className="te-delivery-footer-line">{socials}</div>}
        {contact && <div className="te-delivery-footer-line">{contact}</div>}
      </div>

      <div className="te-delivery-stripe te-stripe-band te-stripe-navy-cream"/>
    </div>
  )
}
