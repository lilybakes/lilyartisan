import {
  PaLogo, PaEyebrow, PaShortRule, PaSubtitle, PaFooter,
} from './_parts.jsx'

/**
 * 03 — CARE CARD  (A6 portrait, 105×148mm) — customer-facing
 *
 * THE most identifying template of Patisserie — a full blush-pink page.
 * Everything sits on soft pink with the gold frame border. Centered top
 * to bottom: gold DC circle, burgundy Cormorant brand name, italic muted
 * subtitle, italic mauve "Thank you, truly.", HUGE burgundy Cormorant
 * product title, short gold rule, then mauve STORAGE + ALLERGENS eyebrows
 * with dark burgundy body copy. Very romantic. Allergens render as a
 * restrained italic sentence, not chip pills.
 */
export function PaCareCard({ recipe = {}, brand = {} }) {
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

  const allergenList = allergensRaw
    .replace(/^\s*contains?\s*:?\s*/i, '')
    .replace(/\.\s*$/, '')
    .split(/\s*,\s*|\s+and\s+/i)
    .map(s => s.trim())
    .filter(Boolean)

  const allergenSentence = allergenList.length > 0
    ? joinWithAnd(allergenList.map(a => a.toLowerCase()))
    : null

  const tagline = brand.tagline || 'Artisan bakery'
  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const brandSubtitle = `${tagline} — ${cityLine}`

  return (
    <div className="tpl pa-tpl pa-care printable">
      <div className="pa-frame">
        <header className="pa-care-header">
          <PaLogo brand={brand} size="md"/>
          <div className="pa-care-brand-name">{brand.business_name || 'Your Bakery'}</div>
          <PaSubtitle className="pa-care-brand-tag">{brandSubtitle}</PaSubtitle>
          <p className="pa-care-thanks">Thank you, truly.</p>
        </header>

        <div className="pa-care-title-block">
          <h2 className="pa-title pa-care-product">{recipe.name || 'Product name'}</h2>
          <PaShortRule/>
        </div>

        <div className="pa-care-body">
          <section className="pa-care-section">
            <PaEyebrow>Storage</PaEyebrow>
            <p className="pa-care-text">{careText}</p>
          </section>

          <section className="pa-care-section">
            <PaEyebrow>Allergens</PaEyebrow>
            {allergenSentence ? (
              <p className="pa-care-allergens">Contains {allergenSentence}.</p>
            ) : (
              <p className="pa-care-text">{allergensRaw || 'See label for allergens.'}</p>
            )}
          </section>
        </div>

        <div className="pa-care-footer-wrap">
          <PaFooter brand={brand} layout="centered"/>
        </div>
      </div>
    </div>
  )
}

function joinWithAnd(list) {
  if (list.length === 0) return ''
  if (list.length === 1) return list[0]
  if (list.length === 2) return `${list[0]} and ${list[1]}`
  return `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`
}
