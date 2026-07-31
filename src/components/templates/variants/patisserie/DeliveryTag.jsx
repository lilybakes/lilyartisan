import { PaLogo, PaEyebrow, PaShortRule, PaSubtitle } from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * Full BLUSH PINK background — a Patisserie signature. Gold frame border.
 * Gold thin outlined circle at top (punch hole), then gold DC ring logo,
 * brand name burgundy Cormorant, italic muted subtitle, italic mauve
 * "Made this morning" eyebrow, huge burgundy Cormorant product title,
 * thin gold rule, care body copy in dark burgundy text, footer at bottom.
 */
export function PaDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
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
  ].filter(Boolean).join(' · ')
  const contact = [brand.website, brand.phone].filter(Boolean).join(' · ')

  return (
    <div className="tpl pa-tpl pa-delivery printable">
      <div className="pa-frame">
        <div className="pa-delivery-hole"/>

        <div className="pa-delivery-brand">
          <PaLogo brand={brand} size="md"/>
          <div className="pa-delivery-brand-name">
            {brand.business_name || 'Your Bakery'}
          </div>
        </div>

        <p className="pa-delivery-eyebrow">{eyebrow}</p>
        <h2 className="pa-title pa-delivery-product">
          {recipe.name || 'Product name'}
        </h2>
        <PaShortRule/>

        <p className="pa-delivery-care-body">{careBody}</p>

        <div className="pa-delivery-footer">
          {socials && <div className="pa-delivery-footer-line">{socials}</div>}
          {contact && <div className="pa-delivery-footer-line">{contact}</div>}
        </div>
      </div>
    </div>
  )
}
