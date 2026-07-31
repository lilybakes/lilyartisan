import {
  VerdantEyebrow, VerdantDecorCircle,
} from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * Full dark-green background. Thin outlined circle "punch hole" at top
 * center. Brand serif cream centered + ARTISAN BAKERY · IPOH small caps
 * cream. MADE THIS MORNING small caps mint-tinted eyebrow. Product name
 * big serif cream centered. Rounded darker-green tinted callout box:
 * KEEP ME HAPPY cream eyebrow + care body copy. Decorative light-green
 * circle overflowing bottom-left. Centered handles + phone at the base.
 */
export function VerdantDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text    || 'Made this morning'
  const careTitle = customization.care_title_text || 'Keep me happy'
  const careBody  =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Keep under a dome at room temperature and eat within four days. Refrigerate in hot weather.'

  const brandLine = `Artisan bakery${
    brand?.city ? ` · ${brand.city}` : (brand?.address_line2 ? ` · ${brand.address_line2.split(',').pop().trim()}` : ' · Ipoh')
  }`

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')
  const contact = [brand.website, brand.phone].filter(Boolean).join(' · ')

  return (
    <div className="tpl v-tpl v-delivery printable">
      <VerdantDecorCircle size={200} bottom={-90} left={-80} tone="green-tint-on-green"/>

      <div className="v-delivery-hole"/>

      <div className="v-delivery-brand-block">
        <h1 className="v-brand-name v-brand-cream v-delivery-brand-name">{brand.business_name || 'Your Bakery'}</h1>
        <VerdantEyebrow tone="cream" className="v-delivery-brand-line">{brandLine.replace(/^Artisan bakery/, brand.tagline || 'Artisan bakery')}</VerdantEyebrow>
      </div>

      <VerdantEyebrow tone="cream" className="v-delivery-eyebrow">{eyebrow}</VerdantEyebrow>
      <h2 className="v-title v-delivery-product">{recipe.name || 'Product name'}</h2>

      <div className="v-delivery-care-box">
        <VerdantEyebrow tone="cream">{careTitle}</VerdantEyebrow>
        <p className="v-delivery-care-body">{careBody}</p>
      </div>

      <div className="v-delivery-footer">
        {socials && <div className="v-delivery-footer-line">{socials}</div>}
        {contact && <div className="v-delivery-footer-line">{contact}</div>}
      </div>
    </div>
  )
}
