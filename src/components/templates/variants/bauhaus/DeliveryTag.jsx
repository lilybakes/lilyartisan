import { BhEyebrow } from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * Cream paper background (no full-bleed color). Black-outlined circle
 * "punch hole" at the very top. Below that: a small row of 3 solid shapes
 * near top-center — BLUE quarter-circle · YELLOW full circle · RED square.
 *
 * Brand name centered in Archivo Black caps. "MADE THIS MORNING" red
 * eyebrow. Huge black Archivo Black product title.
 *
 * Below the title: a solid YELLOW rounded rectangle box (~65×35mm) with
 * "KEEP ME HAPPY" black eyebrow label and body copy (dark gray).
 */
export function BhDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow  = customization.eyebrow_text || 'Made this morning'
  const careBody =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Keep me under a dome at room temperature, and eat within four days. Refrigerate in hot weather.'

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')
  const contact = [brand.website, brand.phone].filter(Boolean).join(' · ')

  return (
    <div className="tpl bh-tpl bh-delivery printable">
      <div className="bh-delivery-hole"/>

      <div className="bh-delivery-shapes">
        <span className="bh-delivery-qc-blue"/>
        <span className="bh-delivery-circle-yellow"/>
        <span className="bh-delivery-square-red"/>
      </div>

      <div className="bh-delivery-brand-name">
        {(brand.business_name || 'Your Bakery').toUpperCase()}
      </div>

      <BhEyebrow tone="red" className="bh-delivery-eyebrow">{eyebrow}</BhEyebrow>
      <h2 className="bh-title bh-delivery-product">
        {(recipe.name || 'Product name').toUpperCase()}
      </h2>

      <div className="bh-delivery-care-box">
        <div className="bh-delivery-care-label">KEEP ME HAPPY</div>
        <p className="bh-delivery-care-body">{careBody}</p>
      </div>

      <div className="bh-delivery-footer">
        {socials && <div className="bh-delivery-footer-line">{socials}</div>}
        {contact && <div className="bh-delivery-footer-line">{contact}</div>}
      </div>
    </div>
  )
}
