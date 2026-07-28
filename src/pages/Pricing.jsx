import { useEffect, useMemo, useState } from 'react'
import { useTable } from '../lib/data'
import { supabase } from '../lib/supabase'
import { costPerPortion, suggestedPrice, money } from '../lib/costing'

export default function Pricing() {
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
      <h2>Selling Price Calculator</h2>
      <p className="sub">Suggested price = cost per portion ÷ target food-cost %. Ingredient price changes flow through automatically.</p>
      <table>
        <thead><tr><th>Recipe</th><th className="num">Cost/Portion</th><th className="num">Target FC %</th><th className="num">Suggested Price</th><th className="num">Margin</th></tr></thead>
        <tbody>
          {recipes.length === 0 && <tr><td colSpan="5" className="empty">No recipes yet.</td></tr>}
          {recipes.map(r => {
            const lines = bomByRecipe[r.id] || []
            const cpp = costPerPortion(r, lines, ingById)
            const sp = suggestedPrice(r, lines, ingById)
            const margin = sp > 0 ? ((sp - cpp) / sp * 100) : 0
            return (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td className="num">{money(cpp)}</td>
                <td className="num">
                  <input type="number" step="1" defaultValue={r.target_food_cost_pct}
                    style={{width:70,textAlign:'right'}}
                    onBlur={e => {
                      const v = parseFloat(e.target.value)
                      if (v && v !== Number(r.target_food_cost_pct)) update(r.id, { target_food_cost_pct: v })
                    }}/>
                </td>
                <td className="num">{money(sp)}</td>
                <td className="num">{margin.toFixed(1)}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <p className="hint">Editing the target and tabbing out saves it.</p>
    </div>
  )
}
