import { LetterpressLogo, LetterpressShortRule } from './_parts.jsx'

/**
 * 07 — DELIVERY TAG  (A7 portrait) — per-order hang tag
 *
 * Thin double border. Oval punch hole at top. Textonly brand block, italic
 * "Handmade for you" eyebrow, big product name, short accent rule, small
 * caps care title, italic centered care body with spelled-out numbers,
 * DC in a filled burgundy OVAL (Letterpress signature — different shape
 * for this template), italic thanks line, small caps socials + phone.
 */
export function LetterpressDeliveryTag({ recipe = {}, brand = {}, customization = {} }) {
  const eyebrow   = customization.eyebrow_text    || 'Handmade for you'
  const careTitle = customization.care_title_text || 'Keep me happy'
  const thanks    = customization.thanks_text     || 'Thank you for supporting a small kitchen.'
  const careBody  =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best within four days under a cake dome at room temperature. Refrigerate in hot weather; return to room temperature half an hour before serving.'

  const socials = [
    brand?.instagram ? `@${brand.instagram}` : null,
    brand?.facebook ? `fb/${brand.facebook}` : null,
  ].filter(Boolean).join(' · ')
  const contact = [brand?.website, brand?.phone].filter(Boolean).join(' · ')

  return (
    <div className="tpl l-tpl l-delivery printable">
      <div className="l-delivery-border">
        <div className="l-delivery-inner">
          <div className="l-delivery-hole"/>

          <h1 className="l-brand-name l-delivery-brand-name">{brand.business_name || 'Your Bakery'}</h1>
          {brand.tagline && <p className="l-brand-tagline l-delivery-brand-tag">{brand.tagline}</p>}

          <p className="l-delivery-eyebrow-italic">{eyebrow}</p>
          <h2 className="l-delivery-product">{recipe.name || 'Product name'}</h2>
          <LetterpressShortRule/>

          <div className="l-eyebrow l-eyebrow-burgundy l-delivery-care-title">{careTitle}</div>
          <p className="l-delivery-care-body">{careBody}</p>

          <div className="l-delivery-monogram-wrap">
            <LetterpressLogo brand={brand} size="md" shape="oval"/>
          </div>

          <p className="l-delivery-thanks">{thanks}</p>
          {socials && (
            <div className="l-eyebrow l-eyebrow-burgundy l-delivery-socials">{socials}</div>
          )}
          {contact && (
            <div className="l-eyebrow l-eyebrow-muted l-delivery-contact">{contact}</div>
          )}
        </div>
      </div>
    </div>
  )
}
