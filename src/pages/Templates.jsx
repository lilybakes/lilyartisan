import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/settings.jsx'
import { TEMPLATES, getTemplate, getTemplateComponent } from '../components/templates/index.js'
import TemplateIcon from '../components/TemplateIcon.jsx'
import PrinterIcon from '../components/PrinterIcon.jsx'
import PreviewFit from '../components/PreviewFit.jsx'
import '../components/templates-page.css'

// Enrich a raw recipe with BOM + costs
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
    ...recipe,
    lines,
    total_cost:            totalCost,
    cost_per_portion:      perPortion,
    target_food_cost_pct:  targetPct,
    suggested_price:       suggested,
  }
}

const STYLE_VARIANTS = [
  { key: 'bko',         name: 'BakeOnomics Clean',       isDefault: true,
    description: 'The default BakeOnomics theme. Purple app-brand accent on white paper, JetBrains Mono numerals, lavender allergen wash — reads like a finished printed sheet in the app\'s own visual language.' },
  { key: 'kraft',       name: 'Rustic Kraft & Stamp',
    description: 'Warm brown ink on kraft paper. Dashed seals, hand-stamped feel — reads like the small-batch bakery down the road.' },
  { key: 'crisp',       name: 'Crisp',
    description: 'White paper, thin gray rules with brown accents, JetBrains-Mono numbers — precise and clinical.' },
  { key: 'letterpress', name: 'Vintage Letterpress',
    description: 'Deep burgundy on cream, formal serif typography, restrained ornament.' },
  { key: 'editorial',   name: 'Editorial Magazine',
    description: 'Playfair Display + Archivo on cream. Rust side bands, italic-accent titles, zebra rows, bar chart. Reads designed rather than generated.' },
  { key: 'minimal',     name: 'Quiet Minimal',
    description: 'Warm off-white paper, Manrope Light titles, JetBrains Mono meta throughout. Tiny rust dot before titles, hairline dividers, generous whitespace — most restrained.' },
  { key: 'verdant',     name: 'Verdant',
    description: 'Deep forest green on cream. DM Serif Display + Manrope. Mint pill chips, numbered method chips (last step accented), soft decor circles, filled green headers on Recipe Card + Product Label.' },
  { key: 'ember',       name: 'Ember',
    description: 'Burgundy→red→orange gradient headers with diagonal-cut edges on cream. Bebas Neue heavy condensed titles + Manrope. Ember-red "01" "02" numbered steps, three-tone meta chips, filled black bars — bold and industrial.' },
  { key: 'flour-ink',   name: 'Flour & Ink',
    description: 'Single-ink minimalism, tracked capitals, 1px hairlines — no accent colour at all.' },
  { key: 'tessellate',  name: 'Tessellate',
    description: 'Rust×cream checkerboards, diagonal stripe bands, navy dot-square rules and a 2×2 quadrant logo mark on warm cream.' },
  { key: 'aurora',      name: 'Aurora',
    description: 'Purple→teal→pink gradient bands everywhere — full-bleed on Delivery + Social, rounded gradient pill chips, gradient bar chart on the Cost Sheet.' },
  { key: 'bauhaus',     name: 'Bauhaus',
    description: 'Primary blue / yellow / red geometric shapes on cream. Archivo Black caps titles, solid filled chips, sharp modernist grid.' },
  { key: 'patisserie',  name: 'Patisserie',
    description: 'Dusty pink and deep burgundy on ivory. Cormorant serif titles, Roman-numeral method steps, thin gold hairline frames — refined and romantic.' },
  { key: 'riso-pop',    name: 'Riso Pop',
    description: 'Warm cream, navy and rust with the signature offset title effect (rust copy nudged behind navy front). Overlapping solid circles with multiply-blend overprint — layered print-shop confidence.' },
  { key: 'terminal',    name: 'Terminal',
    description: 'Dark CLI theme — deep navy with a subtle teal grid, JetBrains Mono meta everywhere, teal + amber accents. Code-style naming (RECIPE_01, COST_ANALYSIS / CAKES, ISO dates). First dark-mode set.' },
]

export default function Templates() {
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const [recipes, setRecipes]           = useState([])
  const [ingredients, setIngredients]   = useState({})
  const [bomLines, setBomLines]         = useState({})
  const [recipeId, setRecipeId]         = useState('')
  const [templateKey, setTemplateKey]   = useState('classic')
  const [currentStyle, setCurrentStyle] = useState('bko')
  const [customizations, setCustoms]    = useState({})
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    ;(async () => {
      const [{ data: recs }, { data: ings }, { data: bom }, { data: customs }] = await Promise.all([
        supabase.from('recipes').select('*').order('name'),
        supabase.from('ingredients').select('*'),
        supabase.from('bom_lines').select('*'),
        supabase.from('template_customization').select('*'),
      ])
      const ingMap = {}
      for (const i of ings || []) ingMap[i.id] = i
      const bomMap = {}
      for (const line of bom || []) {
        if (!bomMap[line.recipe_id]) bomMap[line.recipe_id] = []
        bomMap[line.recipe_id].push(line)
      }
      const customMap = {}
      for (const c of customs || []) customMap[c.template_key] = c.custom || {}

      setRecipes(recs || [])
      setIngredients(ingMap)
      setBomLines(bomMap)
      setCustoms(customMap)
      if (recs?.length) setRecipeId(prev => prev || recs[0].id)
      setLoading(false)
    })()
  }, [])

  const enrichedRecipes = useMemo(() => (
    recipes.map(r => enrich(r, bomLines, ingredients, settings.default_target_food_cost_pct))
  ), [recipes, bomLines, ingredients, settings.default_target_food_cost_pct])

  const enrichedRecipe = enrichedRecipes.find(r => r.id === recipeId) || null

  const brand = useMemo(() => ({
    business_name:            settings.business_name || '',
    owner_name:               settings.owner_name || '',
    logo_data_url:            settings.logo_data_url,
    tagline:                  settings.tagline || '',
    brand_color:              settings.brand_color || '#6C5CE7',
    currency:                 settings.currency || 'RM',
    contact_phone:            settings.contact_phone || '',
    phone:                    settings.contact_phone || '',
    contact_email:            settings.contact_email || '',
    email:                    settings.contact_email || '',
    website:                  settings.website || '',
    address:                  settings.address || '',
    address_line1:            settings.address_line1 || settings.address || '',
    address_line2:            settings.address_line2 || '',
    city:                     settings.city || '',
    instagram:                settings.instagram || '',
    facebook:                 settings.facebook || '',
    default_storage_notes:    settings.default_storage_notes || '',
    default_care_text:        settings.default_care_text || '',
    default_allergen_notice:  settings.default_allergen_notice || '',
    head_baker_name:          settings.head_baker_name || '',
    head_baker_signature_url: settings.head_baker_signature_url || '',
    wholesale_discount_pct:   settings.wholesale_discount_pct ?? 30,
    wholesale_moq:            settings.wholesale_moq ?? 10,
    wholesale_terms_text:     settings.wholesale_terms_text || '',
  }), [settings])

  const template = getTemplate(templateKey)
  const { Component: TemplateComponent, dedicated: isDedicatedVariant } =
    getTemplateComponent(templateKey, currentStyle)

  const isMulti = !!template?.multi
  const canPreview = !!TemplateComponent && (isMulti || enrichedRecipe)
  const readyCount = TEMPLATES.filter(t => t.ready !== false).length
  const currentCustomization = customizations[templateKey] || {}
  const currentStyleMeta = STYLE_VARIANTS.find(s => s.key === currentStyle)

  return (
    <div className="tpl-page">
      {/* ===== LEFT SIDEBAR — Template list ===== */}
      <aside className="tpl-sidebar no-print">
        <div className="tpl-sidebar-head">
          <div className="tpl-sidebar-title">Templates</div>
          <span className="tpl-sidebar-count">
            <span className="tpl-status-dot"/> {readyCount}
          </span>
        </div>
        <div className="tpl-list">
          {TEMPLATES.map(t => {
            const isReady = t.ready !== false
            return (
              <button
                key={t.key}
                type="button"
                className={
                  'tpl-item' +
                  (templateKey === t.key ? ' active' : '') +
                  (!isReady ? ' soon' : '')
                }
                onClick={() => isReady && setTemplateKey(t.key)}
                disabled={!isReady}
                title={t.description}
              >
                <div
                  className="tpl-item-icon"
                  style={isReady ? { background: t.gradient } : {}}
                >
                  <TemplateIcon type={t.preview}/>
                </div>
                <div className="tpl-item-body">
                  <div className="tpl-item-header">
                    <span className="tpl-item-name">{t.name}</span>
                    {isReady
                      ? <span className="tpl-item-size">{t.pageSize}</span>
                      : <span className="tpl-item-soon">SOON</span>}
                  </div>
                  <div className="tpl-item-desc">{t.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </aside>

      {/* ===== RIGHT MAIN — Controls + Preview ===== */}
      <main className="tpl-main">
        <div className="tpl-main-head no-print">
          <h3>{template?.name || 'Recipe Templates'}</h3>
          <p className="sub">
            Content pulls from Recipe Master and Settings — tweak per-template snippets in{' '}
            <Link to="/app/template-customization">Template Customization</Link>.
          </p>
        </div>

        <div className="tpl-controls-panel no-print">
          {/* Mobile-only template dropdown — replaces the 10-card sidebar on
              phones. Hidden on desktop where the sidebar column shows cards. */}
          <div className="tpl-control tpl-control-template-mobile">
            <label>Template</label>
            <select
              value={templateKey}
              onChange={e => setTemplateKey(e.target.value)}
            >
              {TEMPLATES.filter(t => t.ready !== false).map(t => (
                <option key={t.key} value={t.key}>{t.name} · {t.pageSize}</option>
              ))}
            </select>
          </div>

          {!isMulti && (
            <div className="tpl-control">
              <label>Recipe</label>
              <select
                value={recipeId}
                onChange={e => setRecipeId(e.target.value)}
                disabled={loading || recipes.length === 0}
              >
                {loading && <option>Loading…</option>}
                {!loading && recipes.length === 0 && <option>No recipes yet — create one first</option>}
                {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          )}

          <div className="tpl-control">
            <label>Style</label>
            <select value={currentStyle} onChange={e => setCurrentStyle(e.target.value)}>
              {STYLE_VARIANTS.map(s => (
                <option key={s.key} value={s.key}>
                  {s.name}{s.isDefault ? ' (default)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            className="tpl-print-btn"
            onClick={() => window.print()}
            disabled={!canPreview}
          >
            <PrinterIcon/>
            <span>Print / Save as PDF</span>
          </button>
        </div>

        {currentStyleMeta?.description && (
          <div className="tpl-style-hint no-print">
            {currentStyleMeta.description}
          </div>
        )}

        {isMulti && (
          <div className="tpl-multi-notice no-print">
            <span className="tpl-multi-badge">MULTI</span>
            This template renders all {enrichedRecipes.length} recipes.
          </div>
        )}

        {canPreview && (
          <div className="templates-preview">
            <PreviewFit>
              {isDedicatedVariant ? (
                <TemplateComponent
                  recipe={enrichedRecipe}
                  recipes={enrichedRecipes}
                  brand={brand}
                  customization={currentCustomization}
                />
              ) : (
                <TemplateComponent
                  recipe={enrichedRecipe}
                  recipes={enrichedRecipes}
                  brand={brand}
                  styleVariant={currentStyle}
                  customization={currentCustomization}
                />
              )}
            </PreviewFit>
          </div>
        )}
      </main>
    </div>
  )
}
