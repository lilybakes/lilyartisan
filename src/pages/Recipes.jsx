import { useState } from 'react'
import { useTable } from '../lib/data'
import { useSettings } from '../lib/settings.jsx'
import { initials, CHIP_COLORS } from '../lib/costing'

export default function Recipes() {
  const { settings } = useSettings()
  const { rows, loading, insert, remove } = useTable('recipes', 'name')
  const [f, setF] = useState({ name:'', category:'', yield_portions:'', target_food_cost_pct:'' })

  async function add() {
    if (!f.name || !f.yield_portions) { alert('Name and yield required.'); return }
    await insert({
      name: f.name.trim(),
      category: f.category.trim() || null,
      yield_portions: parseInt(f.yield_portions),
      target_food_cost_pct: parseFloat(f.target_food_cost_pct) || settings.default_target_food_cost_pct,
    })
    setF({ name:'', category:'', yield_portions:'', target_food_cost_pct:'' })
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div><h3>Recipe Master</h3><p className="sub">Cakes and bakes with yield (portions per batch) and target food-cost %.</p></div>
      </div>
      <table>
        <thead><tr><th>Recipe</th><th>Category</th><th className="num">Yield</th><th className="num">Target FC%</th><th></th></tr></thead>
        <tbody>
          {loading && <tr><td colSpan="5" className="empty">Loading…</td></tr>}
          {!loading && rows.length === 0 && <tr><td colSpan="5" className="empty">No recipes yet.</td></tr>}
          {rows.map((r, idx) => {
            const color = CHIP_COLORS[idx % CHIP_COLORS.length]
            return (
              <tr key={r.id}>
                <td><div className="row-name"><div className="row-chip" style={{background:color}}>{initials(r.name)}</div><strong>{r.name}</strong></div></td>
                <td><span className="pill bridge">{r.category || '—'}</span></td>
                <td className="num">{r.yield_portions}</td>
                <td className="num">{r.target_food_cost_pct}%</td>
                <td><button className="ghost" onClick={() => remove(r.id)}>Remove</button></td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="row-add">
        <div className="field"><label>Name</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="e.g. Chocolate Fudge Cake" style={{width:240}}/></div>
        <div className="field"><label>Category</label><input value={f.category} onChange={e=>setF({...f,category:e.target.value})} placeholder="Cake / Cupcake" style={{width:150}}/></div>
        <div className="field"><label>Yield</label><input type="number" value={f.yield_portions} onChange={e=>setF({...f,yield_portions:e.target.value})} style={{width:100}}/></div>
        <div className="field"><label>Target FC %</label><input type="number" value={f.target_food_cost_pct} onChange={e=>setF({...f,target_food_cost_pct:e.target.value})} placeholder={String(settings.default_target_food_cost_pct)} style={{width:110}}/></div>
        <button className="primary" onClick={add}>+ Add Recipe</button>
      </div>
    </div>
  )
}
