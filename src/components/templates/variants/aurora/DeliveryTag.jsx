/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * The ENTIRE PAGE is the aurora gradient background. Small white outlined
 * "punch hole" circle at the top, then the white letter-tracked brand
 * name. "MADE THIS MORNING" purple-tint eyebrow, huge white Manrope
 * extrabold product title. A semi-transparent glass rounded box holds
 * the "KEEP ME HAPPY" instruction. White small-caps social/contact
 * footer at the bottom.
 */
export function AuDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
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
    <div className="tpl au-tpl au-delivery printable">
      <div className="au-delivery-hole"/>

      <div className="au-delivery-brand-name">
        {(brand.business_name || 'Your Bakery').toUpperCase()}
      </div>

      <div className="au-delivery-eyebrow">{eyebrow.toUpperCase()}</div>
      <h2 className="au-title au-delivery-product">
        {(recipe.name || 'Product name').toUpperCase()}
      </h2>

      <div className="au-delivery-glass">
        <div className="au-delivery-glass-label">KEEP ME HAPPY</div>
        <p className="au-delivery-care-body">{careBody}</p>
      </div>

      <div className="au-delivery-footer">
        {socials && <div className="au-delivery-footer-line">{socials}</div>}
        {contact && <div className="au-delivery-footer-line">{contact}</div>}
      </div>
    </div>
  )
}
