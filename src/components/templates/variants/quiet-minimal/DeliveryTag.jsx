import {
  QuietBrandLockup, QuietEyebrow, QuietDot, QuietRule,
} from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * Thin outlined circle "punch hole" at very top. Textonly brand + tiny rust
 * dot right. HANDMADE FOR YOU mono muted eyebrow, product name in sans,
 * KEEP ME HAPPY mono RUST + care body. Generous empty space, thanks line
 * sans, hairline, then socials-rust + muted-contact stacked at bottom.
 */
export function QuietDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text    || 'Handmade for you'
  const careTitle = customization.care_title_text || 'Keep me happy'
  const thanks    = customization.thanks_text     || 'Thank you for supporting a small kitchen.'
  const careBody  =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best within 4 days under a cake dome at room temperature. Refrigerate in hot weather; back to room temp 30 minutes before serving.'

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')
  const contact = [brand.website, brand.phone].filter(Boolean).join(' · ')

  return (
    <div className="tpl q-tpl q-delivery printable">
      <div className="q-delivery-hole"/>

      <header className="q-delivery-header">
        <QuietBrandLockup brand={brand} layout="textonly"/>
        <QuietDot/>
      </header>

      <QuietEyebrow className="q-delivery-eyebrow">{eyebrow}</QuietEyebrow>
      <h2 className="q-title q-delivery-product">{recipe.name || 'Product name'}</h2>

      <div className="q-delivery-care">
        <QuietEyebrow tone="rust">{careTitle}</QuietEyebrow>
        <p className="q-delivery-care-body">{careBody}</p>
      </div>

      <p className="q-delivery-thanks">{thanks}</p>

      <div className="q-delivery-footer-wrap">
        <QuietRule marginBottom="3mm"/>
        {socials && (
          <div className="q-delivery-socials q-footer-social">{socials}</div>
        )}
        {contact && (
          <div className="q-delivery-contact q-muted">{contact}</div>
        )}
      </div>
    </div>
  )
}
