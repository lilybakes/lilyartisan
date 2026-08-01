/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * Cream paper. Thin navy circle "punch hole" at top center, brand
 * wordmark navy Manrope 800 + rust city eyebrow beneath.
 *
 * Big SOLID RUST circle (~62mm) centered vertically containing the
 * product name in cream Manrope 800 with a small "MADE THIS MORNING"
 * cream eyebrow above it. Both stack tightly inside the disk.
 *
 * Care body text below on cream. Footer at the bottom: navy rule +
 * rust @handle + tiny navy address/contact line.
 */
export function RpDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow = customization.eyebrow_text || 'Made this morning'
  const careBody =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Keep it under a dome at room temperature, and eat within four days. Refrigerate in hot weather.'

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  const social = brand.instagram
    ? `@${brand.instagram}`
    : (brand.facebook ? `fb/${brand.facebook}` : null)
  const contact = [brand.phone, brand.website].filter(Boolean).join(' · ')

  return (
    <div className="tpl rp-tpl rp-delivery printable">
      <div className="rp-delivery-hole"/>

      <div className="rp-delivery-brand">{brand.business_name || 'Your Bakery'}</div>
      <div className="rp-delivery-city">
        {(brand.tagline || 'Artisan bakery')} · {cityLine}
      </div>

      <div className="rp-delivery-circle">
        <div className="rp-delivery-circle-eyebrow">{eyebrow}</div>
        <h2 className="rp-delivery-circle-title">{recipe.name || 'Product name'}</h2>
      </div>

      <p className="rp-delivery-care">{careBody}</p>

      <div className="rp-delivery-footer">
        <div className="rp-delivery-footer-rule"/>
        {social && <div className="rp-delivery-footer-social">{social}</div>}
        {contact && <div className="rp-delivery-footer-line">{contact}</div>}
      </div>
    </div>
  )
}
