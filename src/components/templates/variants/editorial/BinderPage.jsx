import {
  EditorialLogo, EditorialEyebrow, EditorialRule,
  stylizeTitle, editorialMoney,
} from './_parts.jsx'

/**
 * 09 — RECIPE BINDER PAGE  (A4 portrait) — kitchen reference
 *
 * Full-height RUST LEFT SIDEBAR (~30% width). Contains:
 *   DC square (bordered variant, cream on rust) at top
 *   Brand name serif (cream), tagline muted-cream
 *   CATEGORY small-caps cream + value serif cream
 *   YIELD small-caps + value
 *   COST / PORTION small-caps + value
 *   SELL / PORTION small-caps + value
 *   BATCH TOTAL small-caps + value
 *   Bottom: address, phone, url, socials — all cream small
 *
 * Right cream main area:
 *   Top-right: bordered "RECIPE PHOTO (PLACEHOLDER)" box
 *   Big product title with italic accent + description italic muted
 *   2-col INGREDIENTS + METHOD, each with a rust underline
 *   CHEF'S NOTES with 5 ruled lines
 *   Thin black rule near bottom + caption
 */
export function EditorialBinderPage({ recipe = {}, brand = {} }) {
  const lines      = recipe.lines || []
  const method     = normalizeMethod(recipe.method)
  const total      = Number(recipe.total_cost)         || 0
  const perPortion = Number(recipe.cost_per_portion)   || 0
  const suggested  = Number(recipe.suggested_price)    || 0
  const photo      = recipe.image_url || recipe.imageUrl
  const y          = recipe.yield_portions || 0
  const yieldStr   = y > 0
    ? `${y} ${(recipe.category || '').toLowerCase() === 'bread' ? (y === 1 ? 'loaf' : 'loaves') : (y === 1 ? 'portion' : 'portions')}`
    : '—'

  return (
    <div className="tpl e-tpl e-binder printable">
      <aside className="e-binder-sidebar">
        <div className="e-binder-sidebar-logo">
          <EditorialLogo brand={brand} size="md" variant="bordered-on-rust"/>
        </div>
        <h1 className="e-brand-name e-binder-brand-name">{brand.business_name || 'Your Bakery'}</h1>
        {brand.tagline && <p className="e-binder-brand-tag">{brand.tagline}</p>}

        <div className="e-binder-meta-block">
          <EditorialEyebrow tone="cream">Category</EditorialEyebrow>
          <div className="e-binder-meta-val">{recipe.category || '—'}</div>
        </div>
        <div className="e-binder-meta-block">
          <EditorialEyebrow tone="cream">Yield</EditorialEyebrow>
          <div className="e-binder-meta-val">{yieldStr}</div>
        </div>
        <div className="e-binder-meta-block">
          <EditorialEyebrow tone="cream">Cost / Portion</EditorialEyebrow>
          <div className="e-binder-meta-val">{editorialMoney(perPortion)}</div>
        </div>
        <div className="e-binder-meta-block">
          <EditorialEyebrow tone="cream">Sell / Portion</EditorialEyebrow>
          <div className="e-binder-meta-val">{editorialMoney(suggested)}</div>
        </div>
        <div className="e-binder-meta-block">
          <EditorialEyebrow tone="cream">Batch Total</EditorialEyebrow>
          <div className="e-binder-meta-val">{editorialMoney(total)}</div>
        </div>

        <div className="e-binder-sidebar-footer">
          {brand.address_line1 && <div>{brand.address_line1}</div>}
          {brand.address_line2 && <div>{brand.address_line2}</div>}
          {brand.phone && <div>{brand.phone}</div>}
          {brand.website && <div>{brand.website}</div>}
          {(brand.instagram || brand.facebook) && (
            <div>
              {brand.instagram ? `@${brand.instagram}` : ''}
              {brand.instagram && brand.facebook ? ' · ' : ''}
              {brand.facebook ? `fb/${brand.facebook}` : ''}
            </div>
          )}
        </div>
      </aside>

      <div className="e-binder-main">
        <div className="e-binder-title-row">
          <div className="e-binder-title-left">
            <h2 className="e-title e-binder-title">
              {stylizeTitle(recipe.name || 'Recipe name')}
            </h2>
            {recipe.description && (
              <p className="e-binder-title-desc">{recipe.description}</p>
            )}
          </div>
          <div className="e-binder-photo">
            {photo ? (
              <img src={photo} alt={recipe.name || ''}/>
            ) : (
              <div className="e-binder-photo-placeholder">
                <div className="e-eyebrow e-eyebrow-muted">Recipe Photo</div>
                <div className="e-binder-photo-hint">(placeholder)</div>
              </div>
            )}
          </div>
        </div>

        <div className="e-binder-body">
          <section className="e-binder-section">
            <EditorialEyebrow tone="rust">Ingredients</EditorialEyebrow>
            <div className="e-binder-section-rule"/>
            {lines.length === 0 ? (
              <p className="e-empty">No ingredients linked yet.</p>
            ) : (
              <div className="e-binder-ing-list">
                {lines.map((line, idx) => (
                  <div key={idx} className="e-binder-ing-row">
                    <span className="e-binder-ing-name">{line.ingredient_name || 'Unknown'}</span>
                    <span className="e-binder-ing-qty">
                      {line.qty}{line.unit ? ` ${line.unit}` : ''}
                    </span>
                    <span className="e-binder-ing-cost">
                      {Number(line.cost || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="e-binder-section">
            <EditorialEyebrow tone="rust">Method</EditorialEyebrow>
            <div className="e-binder-section-rule"/>
            {method.length === 0 ? (
              <p className="e-empty">Add method steps via the recipe's Content drawer.</p>
            ) : (
              <ol className="e-binder-method">
                {method.map((step, i) =>
                  step.group
                    ? <li key={i} className="e-method-group">{step.group}</li>
                    : <li key={i}>{step.step}</li>
                )}
              </ol>
            )}
          </section>
        </div>

        <section className="e-binder-notes">
          <EditorialEyebrow tone="rust">Chef's Notes</EditorialEyebrow>
          <div className="e-binder-notes-lines">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="e-binder-notes-line"/>
            ))}
          </div>
        </section>

        <EditorialRule tone="black" weight="thick" marginTop="auto"/>
        <p className="e-binder-caption">
          Kitchen reference · print at 100% · {brand.business_name || 'Your Bakery'}
        </p>
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
