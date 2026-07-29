import { useEffect, useMemo, useState } from 'react'
import { useTable } from '../lib/data'
import { supabase } from '../lib/supabase'
import { useSettings } from '../lib/settings.jsx'
import Chip from '../components/Chip.jsx'
import { costPerPortion, suggestedPrice, money, CHIP_COLORS } from '../lib/costing'

export default function Pricing() {
  const { settings } = useSettings()
  const { rows: recipes, update } = useTable('recipes', 'name')
  const { rows: ingredients } = useTable('ingredients', 'name')
  const [allBom, setAllBom] = useState([])

  useEffect(() => {
    supabase.from('bom_lines').select('*').then(({ data }) => setAllBom(data || []))
  }, [])

  const ingById = useMemo(() => Object.fromEntries(ingredients.map(i => [i.id, i])), [ingredients])
  const bomByRecipe = useMemo(() => {
    const m = {}
    for (const l of allBom) (m[l.recipe_id] ??= []).push(l)
    return m
  }, [allBom])

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h3>Selling Price Calculator</h3><p className="sub">Suggested price = cost per portion ÷ target food-cost %. Ingredient price changes flow through automatically.</p></div>
      </div>
      <table className="responsive-table">
        <thead><tr><th>Recipe</th><th className="num">Cost/Portion</th><th className="num">Target FC %</th><th className="num">Suggested Price</th><th className="num">Margin</th></tr></thead>
        <tbody>
          {recipes.length === 0 && <tr><td colSpan="5" className="empty">No recipes yet.</td></tr>}
          {recipes.map((r, idx) => {
            const lines = bomByRecipe[r.id] || []
            const cpp = costPerPortion(r, lines, ingById)
            const sp = suggestedPrice(r, lines, ingById)
            const margin = sp > 0 ? ((sp - cpp) / sp * 100) : 0
            const color = CHIP_COLORS[idx % CHIP_COLORS.length]
            return (
              <tr key={r.id}>
                <td><div className="row-name"><Chip item={r} size={40} color={color}/><strong>{r.name}</strong></div></td>
                <td className="num" data-label="Cost / Portion">{money(cpp, settings.currency)}</td>
                <td className="num" data-label="Target FC %">
                  <input type="number" step="1" defaultValue={r.target_food_cost_pct}
                    style={{width:80, textAlign:'right'}}
                    onBlur={e => {
                      const v = parseFloat(e.target.value)
                      if (v && v !== Number(r.target_food_cost_pct)) update(r.id, { target_food_cost_pct: v })
                    }}/>
                </td>
                <td className="num" data-label="Suggested Price"><strong>{money(sp, settings.currency)}</strong></td>
                <td className="num" data-label="Margin"><span className="pill ok">{margin.toFixed(1)}%</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="hint" style={{marginTop:10}}>Editing the target and tabbing out saves it.</p>
    </div>
  )
}
