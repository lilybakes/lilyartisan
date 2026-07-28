import { useEffect, useMemo, useState } from 'react'
import { useTable } from '../lib/data'
import { supabase } from '../lib/supabase'
import { UNITS } from '../lib/units'
import { costPerPortion, suggestedPrice, unitCostBase, money } from '../lib/costing'

export default function Reports() {
  const { rows: recipes } = useTable('recipes', 'name')
  const { rows: ingredients } = useTable('ingredients', 'name')
  const [allBom, setAllBom] = useState([])
  useEffect(() => { supabase.from('bom_lines').select('*').then(({data}) => setAllBom(data || [])) }, [])

  const ingById = useMemo(() => Object.fromEntries(ingredients.map(i => [i.id, i])), [ingredients])
  const bomByRecipe = useMemo(() => {
    const m = {}; for (const l of allBom) (m[l.recipe_id] ??= []).push(l); return m
  }, [allBom])

  return (
    <>
      <div className="panel">
        <h2>Reports — Recipes</h2>
        <p className="sub">Cost, suggested price, and margin across all recipes.</p>
        <table>
          <thead><tr><th>Recipe</th><th>Category</th><th className="num">Cost/Portion</th><th className="num">Suggested Price</th><th className="num">Margin</th></tr></thead>
          <tbody>
            {recipes.length === 0 && <tr><td colSpan="5" className="empty">No recipes yet.</td></tr>}
            {recipes.map(r => {
              const lines = bomByRecipe[r.id] || []
              const cpp = costPerPortion(r, lines, ingById)
              const sp = suggestedPrice(r, lines, ingById)
              const margin = sp > 0 ? ((sp - cpp) / sp * 100) : 0
              return (
                <tr key={r.id}>
                  <td>{r.name}</td><td>{r.category || '—'}</td>
                  <td className="num">{money(cpp)}</td>
                  <td className="num">{money(sp)}</td>
                  <td className="num">{margin.toFixed(1)}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="panel">
        <h2>Ingredient Unit Costs</h2>
        <table>
          <thead><tr><th>Ingredient</th><th className="num">Cost / base unit</th><th className="num">Density (g/ml)</th></tr></thead>
          <tbody>
            {ingredients.map(i => {
              const dim = UNITS[i.purchase_unit]?.dim
              const baseLabel = dim === 'mass' ? 'g' : dim === 'volume' ? 'ml' : 'pcs'
              return (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td className="num">{money(unitCostBase(i))}/{baseLabel}</td>
                  <td className="num">{i.density_g_ml ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
