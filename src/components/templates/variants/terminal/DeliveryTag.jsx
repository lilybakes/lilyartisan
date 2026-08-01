import { TrLogo, TrStatusChip, TrBarBlock } from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait, 74×105mm) — per-order hang tag
 *
 * Dark solid navy — NO grid (too small).
 *
 * Top: thin teal outlined CIRCLE punch hole at very top center.
 * Below: TEAL outlined SQUARE DC logo.
 * Below: `The Daily Crumb` Manrope 800 centered white.
 * `ARTISAN BAKERY / IPOH` mono muted uppercase.
 * Below: `• BAKED TODAY` teal-outlined rounded status chip.
 * Below: HUGE `Chocolate` / `Fudge Cake` Manrope 800 white title (wraps
 * naturally to 2 lines).
 * Below: KEEP ME HAPPY block — dark elevated bg + teal left bar + teal
 * `KEEP ME HAPPY` eyebrow + off-white care body text.
 * Footer at bottom center: teal `@THEDAILYCRUMB · FB/THEDAILYCRUMB` mono,
 * muted `THEDAILYCRUMB.COM · +60 5-123 4567`.
 */
export function TrDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow = customization.eyebrow_text || 'BAKED TODAY'
  const careBody =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Keep at room temperature under a dome. Best within four days. Refrigerate in hot weather.'

  const socials = [
    brand.instagram ? `@${brand.instagram}` : null,
    brand.facebook  ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ').toUpperCase()

  const contact = [brand.website, brand.phone].filter(Boolean).join(' · ').toUpperCase()

  return (
    <div className="tpl tr-tpl tr-delivery printable">
      <div className="tr-delivery-hole"/>

      <div className="tr-delivery-brand">
        <TrLogo brand={brand} size="sm"/>
        <div className="tr-delivery-brand-name">
          {brand.business_name || 'The Daily Crumb'}
        </div>
        <div className="tr-delivery-brand-sub">
          {(brand.tagline || 'ARTISAN BAKERY').toUpperCase()} / {(brand.city || 'IPOH').toUpperCase()}
        </div>
      </div>

      <div className="tr-delivery-chip-row">
        <TrStatusChip tone="teal">{eyebrow}</TrStatusChip>
      </div>

      <h2 className="tr-delivery-product">
        {recipe.name || 'Chocolate Fudge Cake'}
      </h2>

      <TrBarBlock tone="teal" className="tr-delivery-care">
        <div className="tr-bar-block-eyebrow tr-bar-block-eyebrow-teal">KEEP ME HAPPY</div>
        <p className="tr-bar-block-body">{careBody}</p>
      </TrBarBlock>

      <div className="tr-delivery-footer">
        {socials && (
          <div className="tr-delivery-footer-line tr-delivery-footer-line-teal">
            {socials}
          </div>
        )}
        {contact && <div className="tr-delivery-footer-line">{contact}</div>}
      </div>
    </div>
  )
}
