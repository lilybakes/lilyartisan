import {
  EditorialEyebrow, EditorialRule, EditorialShortRule, stylizeTitle,
} from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait) — per-order hang tag
 *
 * Narrow rust vertical band on the LEFT edge (no text). Oval punch hole
 * near the top of the cream area. Brand name + tagline, then HANDMADE FOR
 * YOU rust eyebrow, product title with italic accent, short thick black
 * rule, KEEP ME HAPPY care title, care body sans, italic thanks. Thin
 * black rule, then social handles at the bottom.
 */
export function EditorialDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
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
    brand.website,
    brand.phone,
  ].filter(Boolean).join(' · ')

  return (
    <div className="tpl e-tpl e-delivery printable">
      <aside className="e-delivery-sideband"/>

      <div className="e-delivery-main">
        <div className="e-delivery-hole"/>

        <h1 className="e-brand-name e-delivery-brand-name">{brand.business_name || 'Your Bakery'}</h1>
        {brand.tagline && (
          <p className="e-brand-tagline e-delivery-brand-tag">{brand.tagline}</p>
        )}

        <EditorialEyebrow tone="rust" className="e-delivery-eyebrow">{eyebrow}</EditorialEyebrow>
        <h2 className="e-title e-delivery-product">
          {stylizeTitle(recipe.name || 'Product name')}
        </h2>
        <EditorialShortRule tone="black"/>

        <EditorialEyebrow tone="rust" className="e-delivery-care-title">{careTitle}</EditorialEyebrow>
        <p className="e-delivery-care-body">{careBody}</p>

        <p className="e-delivery-thanks">{thanks}</p>

        <EditorialRule tone="black" weight="hair" marginTop="auto"/>

        {socials && (
          <EditorialEyebrow tone="rust" className="e-delivery-socials">{socials}</EditorialEyebrow>
        )}
      </div>
    </div>
  )
}
