import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/settings.jsx'
import { TEMPLATES, getTemplate } from '../components/templates/index.js'
import { STYLE_VARIANTS, DEFAULT_STYLE_KEY } from '../lib/template-styles.js'

/* ============================================================
   Compact template icons — small monochrome shapes on gradient chip
   ============================================================ */
function TemplateIcon({ type }) {
  const SW = 1.8
  const props = {
    width: 18, height: 18, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    strokeWidth: SW, strokeLinecap: 'round', strokeLinejoin: 'round',
  }
  switch (type) {
    case 'card-lines':  // Classic Recipe Card — document w/ lines
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2"/>
          <line x1="8" y1="8" x2="16" y2="8"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
          <line x1="8" y1="16" x2="13" y2="16"/>
        </svg>
      )
    case 'card-bars':  // Cost Breakdown — bar chart
      return (
        <svg {...props}>
          <line x1="4" y1="20" x2="20" y2="20"/>
          <rect x="6"  y="12" width="3" height="8" fill="currentColor" stroke="none"/>
          <rect x="11" y="8"  width="3" height="12" fill="currentColor" stroke="none"/>
          <rect x="16" y="14" width="3" height="6" fill="currentColor" stroke="none"/>
        </svg>
      )
    case 'card-dots':  // Care Card — bulleted list
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2"/>
          <circle cx="8" cy="9"  r="0.9" fill="currentColor" stroke="none"/>
          <line   x1="11" y1="9" x2="17" y2="9"/>
          <circle cx="8" cy="13" r="0.9" fill="currentColor" stroke="none"/>
          <line   x1="11" y1="13" x2="17" y2="13"/>
          <circle cx="8" cy="17" r="0.9" fill="currentColor" stroke="none"/>
          <line   x1="11" y1="17" x2="15" y2="17"/>
        </svg>
      )
    case 'card-tag':  // Product Label — tag shape
      return (
        <svg {...props}>
          <path d="M20.6 11.4 12 20 3 11V4h7l10.6 7.4z"/>
          <circle cx="7" cy="8" r="1.4" fill="currentColor" stroke="none"/>
        </svg>
      )
    case 'grid':  // Menu Insert — 2x2 grid
      return (
        <svg {...props}>
          <rect x="4"  y="4"  width="7" height="7" rx="1"/>
          <rect x="13" y="4"  width="7" height="7" rx="1"/>
          <rect x="4"  y="13" width="7" height="7" rx="1"/>
          <rect x="13" y="13" width="7" height="7" rx="1"/>
        </svg>
      )
    case 'table':  // Wholesale — table rows
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="14" rx="1.5"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="3" y1="14" x2="21" y2="14"/>
          <line x1="10" y1="5" x2="10" y2="19"/>
        </svg>
      )
    case 'square':  // Social Media — square with dot (camera-y)
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2.5"/>
          <circle cx="12" cy="12" r="3.5"/>
          <circle cx="17" cy="7" r="0.9" fill="currentColor" stroke="none"/>
        </svg>
      )
    case 'circle':  // Certificate — seal
      return (
        <svg {...props}>
          <circle cx="12" cy="10" r="6"/>
          <circle cx="12" cy="10" r="2" fill="currentColor" stroke="none"/>
          <path d="M9 15l-1.5 5 4.5-2 4.5 2L15 15"/>
        </svg>
      )
    default:  // fallback
      return (
        <svg {...props}>
          <rect x="5" y="3" width="14" height="18" rx="2"/>
        </svg>
      )
  }
}

function CheckBadge() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
    </svg>
  )
}

function PrinterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect x="6" y="14" width="12" height="8" rx="1"/>
    </svg>
  )
}


/* ============================================================
   Recipe enrichment (unchanged from previous)
   ============================================================ */
function enrich(recipe, bomLines, ingredients, defaultTargetPct) {
  const lines = (bomLines[recipe.id] || []).map(l => {
    const ing = ingredients[l.ingredient_id]
    if (!ing) return { ...l, ingredient_name: 'Unknown ingredient', cost: 0, unit_cost: 0 }
    const unitCost = (ing.purchase_price / (ing.purchase_qty || 1)) * (1 + (ing.waste_pct || 0) / 100)
    const cost = unitCost * (Number(l.qty) || 0)
    return { ...l, ingredient_name: ing.name, unit_cost: unitCost, cost }
  })
  const totalCost  = lines.reduce((s, l) => s + l.cost, 0)
  const perPortion = totalCost / (recipe.yield_portions || 1)
  const targetPct  = recipe.target_food_cost_pct || defaultTargetPct || 30
  const suggested  = targetPct > 0 ? perPortion / (targetPct / 100) : 0
  return {
    ...recipe, lines,
    total_cost:            totalCost,
    cost_per_portion:      perPortion,
    target_food_cost_pct:  targetPct,
    suggested_price:       suggested,
  }
}


export default function Templates() {
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const [recipes, setRecipes]         = useState([])
  const [ingredients, setIngredients] = useState({})
  const [bomLines, setBomLines]       = useState({})
  const [recipeId, setRecipeId]       = useState('')
  const [templateKey, setTemplateKey] = useState('classic')
  const [templateStyles, setTemplateStyles] = useState({})  // { classic: 'kraft', cost: 'editorial', ... }
  const [loading, setLoading]         = useState(true)

  const currentStyle = templateStyles[templateKey] || DEFAULT_STYLE_KEY
  const setCurrentStyle = (styleKey) =>
    setTemplateStyles(prev => ({ ...prev, [templateKey]: styleKey }))

  useEffect(() => {
    ;(async () => {
      const [{ data: recs }, { data: ings }, { data: bom }] = await Promise.all([
        supabase.from('recipes').select('*').order('name'),
        supabase.from('ingredients').select('*'),
        supabase.from('bom_lines').select('*'),
      ])
      const ingMap = {}
      for (const i of ings || []) ingMap[i.id] = i
      const bomMap = {}
      for (const line of bom || []) {
        if (!bomMap[line.recipe_id]) bomMap[line.recipe_id] = []
        bomMap[line.recipe_id].push(line)
      }
      setRecipes(recs || [])
      setIngredients(ingMap)
      setBomLines(bomMap)
      if (recs?.length) setRecipeId(prev => prev || recs[0].id)
      setLoading(false)
    })()
  }, [])

  const enrichedRecipes = useMemo(() => {
    return recipes.map(r => enrich(r, bomLines, ingredients, settings.default_target_food_cost_pct))
  }, [recipes, bomLines, ingredients, settings.default_target_food_cost_pct])

  const enrichedRecipe = enrichedRecipes.find(r => r.id === recipeId) || null

  const brand = useMemo(() => ({
    business_name:            settings.business_name || '',
    owner_name:               settings.owner_name || '',
    logo_data_url:            settings.logo_data_url,
    tagline:                  settings.tagline || '',
    brand_color:              settings.brand_color || '#6C5CE7',
    currency:                 settings.currency || 'RM',
    contact_phone:            settings.contact_phone || '',
    contact_email:            settings.contact_email || '',
    website:                  settings.website || '',
    address:                  settings.address || '',
    instagram:                settings.instagram || '',
    facebook:                 settings.facebook || '',
    default_storage_notes:    settings.default_storage_notes || '',
    default_allergen_notice:  settings.default_allergen_notice || '',
  }), [settings])

  const template = getTemplate(templateKey)
  const TemplateComponent = template?.ready ? template.component : null
  const isMulti = !!template?.multi

  const brandComplete = !!(settings.business_name && settings.logo_data_url)
  const readyCount = TEMPLATES.filter(t => t.ready).length
  const soonCount  = TEMPLATES.length - readyCount

  return (
    <>
      <div className="panel no-print">
        <div className="panel-head">
          <div>
            <h3>Recipe Templates</h3>
            <p className="sub">Generate personalized recipe and care sheets for your customers or kitchen. Pick a recipe and a template — everything uses the brand info from your <Link to="/app/settings">Settings page</Link>.</p>
          </div>
        </div>

        {!brandComplete && (
          <div className="tpl-nudge">
            <div className="tpl-nudge-icon"><CheckBadge/></div>
            <div>
              <b>Set up your brand first.</b> Add your logo and business name in <Link to="/app/settings">Settings</Link> to make templates look personalized. Right now they'll use fallback text.
            </div>
          </div>
        )}

        <div className="tpl-controls-row">
          <div className="tpl-recipe-field">
            <label>Recipe</label>
            <select value={recipeId} onChange={e => setRecipeId(e.target.value)} disabled={loading || recipes.length === 0}>
              {loading && <option>Loading…</option>}
              {!loading && recipes.length === 0 && <option>No recipes yet — create one first</option>}
              {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="tpl-status">
            <span className="tpl-status-ready">
              <span className="tpl-status-dot"/>
              {readyCount} templates ready
            </span>
            {soonCount > 0 && (
              <span className="tpl-status-soon">· {soonCount} in the works</span>
            )}
          </div>
        </div>

        <div className="tpl-list">
          {TEMPLATES.map(t => (
            <button
              key={t.key}
              type="button"
              className={
                'tpl-item' +
                (templateKey === t.key ? ' active' : '') +
                (!t.ready ? ' soon' : '')
              }
              onClick={() => t.ready && setTemplateKey(t.key)}
              disabled={!t.ready}
              title={t.description}
            >
              <div
                className="tpl-item-icon"
                style={t.ready ? { background: t.gradient } : {}}
              >
                <TemplateIcon type={t.preview}/>
              </div>
              <div className="tpl-item-body">
                <div className="tpl-item-header">
                  <span className="tpl-item-name">{t.name}</span>
                  {t.ready
                    ? <span className="tpl-item-size">{t.pageSize}</span>
                    : <span className="tpl-item-soon">SOON</span>}
                </div>
                <div className="tpl-item-desc">{t.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="tpl-actions-row">
          <button
            className="tpl-print-btn"
            onClick={() => window.print()}
            disabled={!TemplateComponent || (!isMulti && !enrichedRecipe)}
          >
            <PrinterIcon/>
            Print / Save as PDF
          </button>
          <span className="tpl-actions-hint">
            Uses your browser's print dialog — choose "Save as PDF" for a downloadable version.
          </span>
        </div>
      </div>

      {TemplateComponent && (isMulti || enrichedRecipe) && (
        <>
          <div className="tpl-style-row no-print">
            <div className="tpl-style-field">
              <label>Style for {template.name}</label>
              <select value={currentStyle} onChange={e => setCurrentStyle(e.target.value)}>
                {STYLE_VARIANTS.map(s => (
                  <option key={s.key} value={s.key}>
                    {s.name}{s.isDefault ? ' (default)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="tpl-style-desc">
              {STYLE_VARIANTS.find(s => s.key === currentStyle)?.description}
            </div>
          </div>

          <div className="templates-preview">
            <TemplateComponent
              recipe={enrichedRecipe}
              recipes={enrichedRecipes}
              brand={brand}
              styleVariant={currentStyle}
            />
          </div>
        </>
      )}
    </>
  )
}
