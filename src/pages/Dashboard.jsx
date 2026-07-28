import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTable } from '../lib/data'
import { useSettings } from '../lib/settings.jsx'
import { supabase } from '../lib/supabase'
import { Icon } from '../lib/icons.jsx'
import Chip from '../components/Chip.jsx'
import {
  costPerPortion, suggestedPrice, recipeCostTotal, lineCost,
  money, CHIP_COLORS,
} from '../lib/costing'

export default function Dashboard() {
  const nav = useNavigate()
  const { settings } = useSettings()
  const { rows: recipes } = useTable('recipes', 'name')
  const { rows: ingredients } = useTable('ingredients', 'name')
  const [allBom, setAllBom] = useState([])

  useEffect(() => { supabase.from('bom_lines').select('*').then(({data}) => setAllBom(data || [])) }, [])

  const ingById = useMemo(() => Object.fromEntries(ingredients.map(i => [i.id, i])), [ingredients])
  const bomByRecipe = useMemo(() => {
    const m = {}; for (const l of allBom) (m[l.recipe_id] ??= []).push(l); return m
  }, [allBom])

  const cur = settings.currency
  const totalRec = recipes.length
  const totalIng = ingredients.length
  const avgCpp = recipes.length
    ? recipes.reduce((s, r) => s + costPerPortion(r, bomByRecipe[r.id] || [], ingById), 0) / recipes.length
    : 0
  const avgMargin = recipes.length
    ? recipes.reduce((s, r) => {
        const lines = bomByRecipe[r.id] || []
        const cpp = costPerPortion(r, lines, ingById)
        const sp = suggestedPrice(r, lines, ingById)
        return s + (sp > 0 ? ((sp - cpp) / sp * 100) : 0)
      }, 0) / recipes.length
    : 0

  const primary = recipes[0]
  const primaryLines = primary ? (bomByRecipe[primary.id] || []) : []
  const contributions = primaryLines.map(l => {
    const ing = ingById[l.ingredient_id]; if (!ing) return null
    const r = lineCost(ing, l.qty, l.unit)
    return { name: ing.name, cost: r.ok ? r.cost : 0, color: ing.color || '#7367f0' }
  }).filter(Boolean).sort((a, b) => b.cost - a.cost)
  const maxCost = Math.max(...contributions.map(c => c.cost), 1)

  const marginPct = Math.max(0, Math.min(100, avgMargin))
  const circ = 2 * Math.PI * 52
  const dash = circ * (marginPct / 100)

  return (
    <>
      <div className="hero">
        <div className="hero-text">
          <h2 className="greet">Welcome back, {settings.owner_name} <span>👋</span></h2>
          <p>Your bakery costing dashboard. Change any ingredient price and it ripples through every recipe and suggested selling price automatically.</p>
          <div style={{paddingTop:6}}>
            <button className="cta" onClick={() => nav('/recipes')}>Manage Recipes →</button>
          </div>
        </div>
        <div className="hero-art">
          <div className="hero-halo" aria-hidden="true"/>
          <div className="hero-confetti c1" aria-hidden="true"/>
          <div className="hero-confetti c2" aria-hidden="true"/>
          <div className="hero-confetti c3" aria-hidden="true"/>
          <img className="hero-portrait-img" src="/assets/lily-portrait.png" alt="Lily" loading="eager"/>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card stat-1">
          <div>
            <div className="stat-icn"><Icon name="recipes" size={22}/></div>
            <div className="lbl">Total Recipes</div>
          </div>
          <div>
            <div className="val">{totalRec}</div>
            <div className="delta">↑ Active in catalog</div>
          </div>
        </div>
        <div className="stat-card stat-2">
          <div>
            <div className="stat-icn"><Icon name="ingredients" size={22}/></div>
            <div className="lbl">Ingredients</div>
          </div>
          <div>
            <div className="val">{totalIng}</div>
            <div className="delta">↑ In master list</div>
          </div>
        </div>
        <div className="stat-card stat-3">
          <div>
            <div className="stat-icn"><Icon name="costing" size={22}/></div>
            <div className="lbl">Avg Cost / Portion</div>
          </div>
          <div>
            <div className="val">{money(avgCpp, cur)}</div>
            <div className="delta">across all recipes</div>
          </div>
        </div>
        <div className="stat-card stat-4">
          <div>
            <div className="stat-icn"><Icon name="pricing" size={22}/></div>
            <div className="lbl">Avg Margin</div>
          </div>
          <div>
            <div className="val">{avgMargin.toFixed(1)}%</div>
            <div className="delta">healthy range</div>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>Cost Breakdown by Ingredient</h3>
              <p className="sub">{primary ? primary.name : 'No recipe yet'} — where the money goes</p>
            </div>
          </div>
          {contributions.length === 0
            ? <p className="empty">No BOM data yet. Add ingredients to a recipe to see the breakdown.</p>
            : contributions.map((c, i) => (
              <div className="chart-row" key={i}>
                <div className="name">{c.name}</div>
                <div className="bar-bg"><div className="bar-fill" style={{width:`${(c.cost/maxCost*100).toFixed(1)}%`, background:c.color}}/></div>
                <div className="val">{money(c.cost, cur)}</div>
              </div>
            ))
          }
        </div>

        <div className="panel">
          <div className="panel-head">
            <div><h3>Health Snapshot</h3><p className="sub">Average recipe margin</p></div>
          </div>
          <div className="radial">
            <svg viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="52" fill="none" stroke="#f0eef8" strokeWidth="12"/>
              <circle cx="70" cy="70" r="52" fill="none" stroke="url(#grad1)" strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                transform="rotate(-90 70 70)"/>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7367f0"/>
                  <stop offset="100%" stopColor="#28c76f"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="r-inner">
              <div className="r-val">{avgMargin.toFixed(0)}%</div>
              <div className="r-lbl">Avg. Margin</div>
            </div>
          </div>
          {primary && (
            <div style={{borderTop:'1px solid var(--line)', marginTop:16, paddingTop:14, display:'flex', justifyContent:'space-between', fontSize:12.5}}>
              <div><div style={{color:'var(--muted)'}}>Batch cost</div><div style={{fontWeight:700, fontSize:15, marginTop:2}}>{money(recipeCostTotal(primaryLines, ingById), cur)}</div></div>
              <div><div style={{color:'var(--muted)'}}>Portions</div><div style={{fontWeight:700, fontSize:15, marginTop:2}}>{primary.yield_portions}</div></div>
              <div><div style={{color:'var(--muted)'}}>Per portion</div><div style={{fontWeight:700, fontSize:15, marginTop:2}}>{money(costPerPortion(primary, primaryLines, ingById), cur)}</div></div>
            </div>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <div><h3>Recipe Overview</h3><p className="sub">Cost per portion vs suggested selling price</p></div>
        </div>
        <table>
          <thead><tr><th>Recipe</th><th>Category</th><th className="num">Cost/Portion</th><th className="num">Suggested Price</th><th className="num">Margin</th></tr></thead>
          <tbody>
            {recipes.length === 0 && <tr><td colSpan="5" className="empty">No recipes yet.</td></tr>}
            {recipes.map((r, idx) => {
              const lines = bomByRecipe[r.id] || []
              const cpp = costPerPortion(r, lines, ingById)
              const sp = suggestedPrice(r, lines, ingById)
              const m = sp > 0 ? ((sp - cpp) / sp * 100) : 0
              const color = CHIP_COLORS[idx % CHIP_COLORS.length]
              return (
                <tr key={r.id}>
                  <td><div className="row-name"><Chip item={r} size={40} color={color}/><strong>{r.name}</strong></div></td>
                  <td><span className="pill bridge">{r.category || '—'}</span></td>
                  <td className="num">{money(cpp, cur)}</td>
                  <td className="num"><strong>{money(sp, cur)}</strong></td>
                  <td className="num"><span className="pill ok">{m.toFixed(1)}%</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
