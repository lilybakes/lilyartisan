import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/settings.jsx'
import { TEMPLATES, getTemplate } from '../components/templates/index.js'

/* ============================================================
   Preview thumbnail illustrations — abstract shapes hinting at layout
   ============================================================ */
function PreviewIllustration({ type }) {
  const white = 'rgba(255,255,255,0.96)'
  const ink   = 'rgba(31,36,64,0.15)'
  const inkStrong = 'rgba(31,36,64,0.30)'

  switch (type) {
    case 'card-lines':  // Classic Recipe Card
      return (
        <svg viewBox="0 0 150 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="35" y="12" width="90" height="66" rx="6" fill={white}/>
          <rect x="43" y="24" width="48" height="6" rx="3" fill={inkStrong}/>
          <rect x="43" y="38" width="70" height="3" rx="1.5" fill={ink}/>
          <rect x="43" y="47" width="60" height="3" rx="1.5" fill={ink}/>
          <rect x="43" y="56" width="55" height="3" rx="1.5" fill={ink}/>
        </svg>
      )
    case 'card-bars':  // Cost Breakdown — bar chart
      return (
        <svg viewBox="0 0 150 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="35" y="12" width="90" height="66" rx="6" fill={white}/>
          <rect x="47" y="55" width="14" height="16" rx="2" fill={ink}/>
          <rect x="66" y="45" width="14" height="26" rx="2" fill={inkStrong}/>
          <rect x="85" y="35" width="14" height="36" rx="2" fill={ink}/>
          <rect x="104" y="50" width="14" height="21" rx="2" fill={inkStrong}/>
        </svg>
      )
    case 'card-dots':  // Care Card — bullet-list feel
      return (
        <svg viewBox="0 0 150 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="35" y="12" width="90" height="66" rx="6" fill={white}/>
          <circle cx="47" cy="30" r="2.5" fill={inkStrong}/>
          <rect x="55" y="27" width="55" height="6" rx="3" fill={inkStrong}/>
          <circle cx="47" cy="45" r="2.5" fill={ink}/>
          <rect x="55" y="42" width="65" height="6" rx="3" fill={ink}/>
          <circle cx="47" cy="60" r="2.5" fill={ink}/>
          <rect x="55" y="57" width="45" height="6" rx="3" fill={ink}/>
        </svg>
      )
    case 'card-tag':  // Product Label — highlighted bar
      return (
        <svg viewBox="0 0 150 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="35" y="12" width="90" height="66" rx="6" fill={white}/>
          <rect x="43" y="24" width="35" height="8" rx="2" fill={inkStrong}/>
          <rect x="43" y="42" width="70" height="3" rx="1.5" fill={ink}/>
          <rect x="43" y="51" width="55" height="3" rx="1.5" fill={ink}/>
          <rect x="43" y="60" width="60" height="3" rx="1.5" fill={ink}/>
        </svg>
      )
    case 'grid':
      return (
        <svg viewBox="0 0 150 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="42" y="18" width="30" height="24" rx="3" fill={white}/>
          <rect x="78" y="18" width="30" height="24" rx="3" fill={white}/>
          <rect x="42" y="48" width="30" height="24" rx="3" fill={white}/>
          <rect x="78" y="48" width="30" height="24" rx="3" fill={white}/>
        </svg>
      )
    case 'table':
      return (
        <svg viewBox="0 0 150 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="35" y="16" width="90" height="58" rx="4" fill={white}/>
          <line x1="45" y1="30" x2="115" y2="30" stroke={inkStrong} strokeWidth="1"/>
          <line x1="45" y1="42" x2="115" y2="42" stroke={ink} strokeWidth="1"/>
          <line x1="45" y1="54" x2="115" y2="54" stroke={ink} strokeWidth="1"/>
          <line x1="45" y1="66" x2="115" y2="66" stroke={ink} strokeWidth="1"/>
        </svg>
      )
    case 'square':
      return (
        <svg viewBox="0 0 150 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="53" y="15" width="52" height="60" rx="4" fill={white}/>
          <rect x="60" y="22" width="38" height="30" rx="3" fill={ink}/>
          <rect x="60" y="58" width="24" height="4" rx="2" fill={inkStrong}/>
          <rect x="60" y="66" width="16" height="3" rx="1.5" fill={ink}/>
        </svg>
      )
    case 'circle':
      return (
        <svg viewBox="0 0 150 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="30" y="14" width="90" height="62" rx="4" fill={white}/>
          <circle cx="75" cy="45" r="16" fill="none" stroke={inkStrong} strokeWidth="2"/>
          <circle cx="75" cy="45" r="7" fill={inkStrong}/>
        </svg>
      )
    default:
      return null
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
  const [loading, setLoading]         = useState(true)

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

        <div className="tpl-grid">
          {TEMPLATES.map(t => (
            <button
              key={t.key}
              type="button"
              className={
                'tpl-card' +
                (templateKey === t.key ? ' active' : '') +
                (!t.ready ? ' soon' : '')
              }
              onClick={() => t.ready && setTemplateKey(t.key)}
              disabled={!t.ready}
            >
              <div
                className="tpl-card-preview"
                style={t.ready ? { background: t.gradient } : {}}
              >
                <PreviewIllustration type={t.preview}/>
                {t.ready ? (
                  <span className="tpl-card-size">{t.pageSize}</span>
                ) : (
                  <span className="tpl-card-soon-badge">SOON</span>
                )}
              </div>
              <div className="tpl-card-body">
                <div className="tpl-card-name">{t.name}</div>
                <div className="tpl-card-desc">{t.description}</div>
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
        <div className="templates-preview">
          <TemplateComponent
            recipe={enrichedRecipe}
            recipes={enrichedRecipes}
            brand={brand}
          />
        </div>
      )}
    </>
  )
}
