import {
  EmberEyebrow, EmberRule,
} from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * Full NEAR-BLACK chocolate background. Thin outlined circle "punch hole"
 * at the top. Below: an inset GRADIENT block (burgundy→red→orange) with a
 * diagonal-cut bottom edge. MADE THIS MORNING cream small caps + product
 * name heavy condensed uppercase cream inside the gradient.
 *
 * Below on the near-black paper: KEEP ME HAPPY ember eyebrow + care body
 * cream sans. Empty space. Brand name heavy condensed uppercase cream as
 * the visual anchor. Thin cream hairline. Centered social handles cream +
 * website muted.
 */
export function EmberDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text    || 'Made this morning'
  const careTitle = customization.care_title_text || 'Keep me happy'
  const careBody  =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Keep under a dome at room temperature and eat within four days. Refrigerate in hot weather; back to room temperature thirty minutes before serving.'

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')
  const contact = [brand.website, brand.phone].filter(Boolean).join(' · ')

  return (
    <div className="tpl em-tpl em-delivery printable">
      <div className="em-delivery-hole-wrap">
        <div className="em-delivery-hole"/>
      </div>

      <div className="em-delivery-gradient">
        <EmberEyebrow tone="cream" className="em-delivery-eyebrow">{eyebrow}</EmberEyebrow>
        <h2 className="em-title em-delivery-product">
          {(recipe.name || 'Product name').toUpperCase()}
        </h2>
      </div>

      <div className="em-delivery-body">
        <EmberEyebrow tone="ember" className="em-delivery-care-title">{careTitle}</EmberEyebrow>
        <p className="em-delivery-care-body">{careBody}</p>

        <div className="em-delivery-brand-anchor">
          {(brand.business_name || 'Your Bakery').toUpperCase()}
        </div>
      </div>

      <div className="em-delivery-footer-wrap">
        <EmberRule tone="cream" weight="hair" marginBottom="3mm"/>
        {socials && <div className="em-delivery-footer-line em-delivery-socials">{socials}</div>}
        {contact && <div className="em-delivery-footer-line em-delivery-contact">{contact}</div>}
      </div>
    </div>
  )
}
