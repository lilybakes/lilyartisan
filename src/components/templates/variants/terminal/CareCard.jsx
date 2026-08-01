import {
  TrLogo, TrEyebrow, TrRule, TrBarBlock, TrFooter,
  parseAllergens,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * Terminal / dark grid paper aesthetic.
 *
 * Header row: brand info LEFT (Manrope 800 name + mono muted subtitle),
 * teal DC square logo RIGHT.
 *
 * Below: `CARE_SPEC` teal mono eyebrow. Huge Manrope 800 white product
 * title.
 *
 * STORAGE block: dark-elevated bg with a TEAL 2px left vertical bar,
 * teal `STORAGE` eyebrow, off-white care body text.
 *
 * ALLERGENS block: dark-elevated bg with an AMBER left vertical bar,
 * amber `ALLERGENS` label, off-white body: `WHEAT · DAIRY · EGGS` mono
 * uppercase mid-dot separated.
 *
 * Footer at bottom: address + contact + @thedailycrumb teal mono.
 */
export function TrCareCard({ recipe = {}, brand = {} }) {
  const careText =
    recipe.care_text ||
    recipe.storage_text ||
    brand.default_care_text ||
    brand.default_storage_notes ||
    'Best on the day of baking. Keep in an airtight container up to three days.'

  const allergensRaw =
    recipe.allergens_text ||
    brand.default_allergen_notice ||
    ''

  const allergenList = parseAllergens(allergensRaw)

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'

  return (
    <div className="tpl tr-tpl tr-care printable">
      <header className="tr-care-header">
        <div className="tr-care-brand">
          <div className="tr-care-brand-name">
            {brand.business_name || 'The Daily Crumb'}
          </div>
          <div className="tr-care-brand-sub">
            {(brand.tagline || 'ARTISAN BAKERY').toUpperCase()} / {cityLine.toUpperCase()}
          </div>
        </div>
        <TrLogo brand={brand} size="md"/>
      </header>

      <TrRule tone="hair" marginTop="3mm" marginBottom="4mm"/>

      <TrEyebrow tone="teal" className="tr-care-eyebrow">CARE_SPEC</TrEyebrow>

      <h2 className="tr-care-product">{recipe.name || 'Chocolate Fudge Cake'}</h2>

      <div className="tr-care-body">
        <TrBarBlock tone="teal">
          <div className="tr-bar-block-eyebrow tr-bar-block-eyebrow-teal">STORAGE</div>
          <p className="tr-bar-block-body">{careText}</p>
        </TrBarBlock>

        <TrBarBlock tone="amber">
          <div className="tr-bar-block-eyebrow tr-bar-block-eyebrow-amber">ALLERGENS</div>
          {allergenList.length > 0 ? (
            <div className="tr-care-allergens">{allergenList.join(' · ')}</div>
          ) : (
            <p className="tr-bar-block-body">{allergensRaw || 'See label for allergens.'}</p>
          )}
        </TrBarBlock>
      </div>

      <div className="tr-care-footer-wrap">
        <TrFooter brand={brand} layout="centered"/>
      </div>
    </div>
  )
}
