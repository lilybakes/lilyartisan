import {
  EditorialLogo, EditorialEyebrow, EditorialRule, EditorialShortRule,
  EditorialSideText, EditorialFooter, stylizeTitle,
} from './_parts.jsx'

/**
 * 01 — RECIPE CARD  (A5 portrait, 148×210mm)
 *
 * Signature Editorial move: full-height rust vertical band on the LEFT with
 * rotated small-caps brand text ("THE DAILY CRUMB · IPOH"). DC monogram
 * square at top-left of the content area, brand name + tagline top-right.
 * Big serif title with one italicized word ("Classic *Sourdough* Loaf").
 * Two-column body — ingredients (qty in rust bold, name below) on the left,
 * "AT A GLANCE" cream-tinted box on the right with a short 2-3 sentence
 * summary drawn from recipe.description. Method as numbered sans list.
 * Thick horizontal rust rule near the bottom, then split 2-col footer.
 *
 * FIELD MAPPING:
 *   recipe.lines[]        — qty + unit + ingredient name pairs
 *   recipe.method[]       — step strings or { step, group } items
 *   recipe.category       — small caps meta
 *   recipe.yield_portions — small caps meta
 *   recipe.description    — AT A GLANCE body copy
 */
export function EditorialRecipeCard({ recipe = {}, brand = {} }) {
  const lines  = recipe.lines || []
  const method = normalizeMethod(recipe.method)

  const metaTokens = []
  if (recipe.category) metaTokens.push(recipe.category)
  if (recipe.yield_portions) {
    const y = Number(recipe.yield_portions)
    const unit = (recipe.category || '').toLowerCase() === 'bread'
      ? 'loaf' : (y === 1 ? 'portion' : 'portions')
    metaTokens.push(`Yield ${y} ${unit}`)
  }

  const glance = recipe.description || 'A crafted small-batch item made in our kitchen.'

  const cityLine = brand.city ||
    (brand.address_line2 && brand.address_line2.split(',').pop().trim()) ||
    'Ipoh'
  const sideText = `${(brand.business_name || 'Your Bakery').toUpperCase()} · ${cityLine.toUpperCase()}`

  return (
    <div className="tpl e-tpl e-recipe-card printable">
      <aside className="e-recipe-sideband">
        <EditorialSideText>{sideText}</EditorialSideText>
      </aside>

      <div className="e-recipe-main">
        <header className="e-recipe-header">
          <EditorialLogo brand={brand} size="md"/>
          <div className="e-recipe-brand-block">
            <h1 className="e-brand-name">{brand.business_name || 'Your Bakery'}</h1>
            {brand.tagline && <p className="e-brand-tagline">{brand.tagline}</p>}
          </div>
        </header>

        {metaTokens.length > 0 && (
          <EditorialEyebrow tone="rust" className="e-recipe-meta">
            {metaTokens.join(' · ')}
          </EditorialEyebrow>
        )}

        <h2 className="e-title e-recipe-title">
          {stylizeTitle(recipe.name || 'Recipe name')}
        </h2>
        <EditorialShortRule/>

        <div className="e-recipe-body">
          <div className="e-recipe-body-left">
            <EditorialEyebrow tone="rust">Ingredients</EditorialEyebrow>
            {lines.length === 0 ? (
              <p className="e-empty">No ingredients yet — link them via Recipe BOM.</p>
            ) : (
              <ul className="e-recipe-ingredients">
                {lines.map((line, idx) => (
                  <li key={idx}>
                    <div className="e-recipe-ing-qty">
                      {line.qty}{line.unit ? ` ${line.unit}` : ''}
                    </div>
                    <div className="e-recipe-ing-name">
                      {line.ingredient_name || 'Unknown ingredient'}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="e-recipe-glance">
            <EditorialEyebrow tone="rust">At a glance</EditorialEyebrow>
            <p className="e-recipe-glance-body">{glance}</p>
          </aside>
        </div>

        <section className="e-recipe-method-section">
          <EditorialEyebrow tone="rust">Method</EditorialEyebrow>
          {method.length === 0 ? (
            <p className="e-empty">
              Add method steps in the recipe's <em>Content</em> drawer.
            </p>
          ) : (
            <ol className="e-recipe-method">
              {method.map((step, i) =>
                step.group
                  ? <li key={i} className="e-method-group">{step.group}</li>
                  : <li key={i}>{step.step}</li>
              )}
            </ol>
          )}
        </section>

        <EditorialRule tone="black" weight="thick" marginTop="6mm"/>

        <EditorialFooter brand={brand} layout="split"/>
      </div>
    </div>
  )
}

function normalizeMethod(raw) {
  if (!raw || !Array.isArray(raw)) return []
  const out = []
  let lastGroup = null
  for (const item of raw) {
    if (typeof item === 'string') { out.push({ step: item }); continue }
    if (item && typeof item === 'object') {
      const g = item.group || item.group_label || item.groupLabel
      if (g && g !== lastGroup) { out.push({ group: g }); lastGroup = g }
      const s = item.step || item.text
      if (s) out.push({ step: s })
    }
  }
  return out
}
