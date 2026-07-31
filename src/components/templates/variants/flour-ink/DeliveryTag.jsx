import { FiLogo, FiEyebrow, FiShortRule } from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * Full warm STONE-TAN background — the only tonal shift for this template.
 * Outlined thin circle "punch hole" at the top, outlined DC circle below,
 * letter-tracked brand name.
 *
 * MADE THIS MORNING small caps eyebrow, big letter-tracked product title
 * (naturally wraps to 2 lines), short thin ink rule under. Care body
 * sans copy. Empty space, then centered letter-tracked social handles +
 * contact at the bottom.
 */
export function FiDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
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
    <div className="tpl fi-tpl fi-delivery printable">
      <div className="fi-delivery-hole"/>

      <div className="fi-delivery-brand">
        <FiLogo brand={brand} size="md"/>
        <div className="fi-delivery-brand-name">
          {(brand.business_name || 'Your Bakery').toUpperCase()}
        </div>
      </div>

      <FiEyebrow tone="muted" className="fi-delivery-eyebrow">{eyebrow}</FiEyebrow>
      <h2 className="fi-title fi-delivery-product">
        {(recipe.name || 'Product name').toUpperCase()}
      </h2>
      <FiShortRule/>

      <p className="fi-delivery-care-body">{careBody}</p>

      <div className="fi-delivery-footer">
        {socials && <div className="fi-delivery-footer-line">{socials}</div>}
        {contact && <div className="fi-delivery-footer-line">{contact}</div>}
      </div>
    </div>
  )
}
