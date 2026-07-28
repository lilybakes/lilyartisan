import { useState } from 'react'
import { useTable } from '../lib/data'

export default function Recipes() {
  const { rows, loading, insert, remove } = useTable('recipes', 'name')
  const [f, setF] = useState({ name:'', category:'', yield_portions:'', target_food_cost_pct:'28' })

  async function add() {
    if (!f.name || !f.yield_portions) { alert('Name and yield required.'); return }
    await insert({
      name: f.name.trim(),
      category: f.category.trim() || null,
      yield_portions: parseInt(f.yield_portions),
      target_food_cost_pct: parseFloat(f.target_food_cost_pct) || 28,
    })
    setF({ name:'', category:'', yield_portions:'', target_food_cost_pct:'28' })
  }

  return (
    <div className="panel">
      <h2>Recipe Master</h2>
      <p className="sub">Define cakes/bakes and their yield (slices/portions per batch).</p>
      <table>
        <thead><tr><th>Recipe</th><th>Category</th><th className="num">Yield</th><th className="num">Target FC %</th><th></th></tr></thead>
        <tbody>
          {loading && <tr><td colSpan="5" className="empty">Loading…</td></tr>}
          {!loading && rows.length === 0 && <tr><td colSpan="5" className="empty">No recipes yet.</td></tr>}
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{r.category || '—'}</td>
              <td className="num">{r.yield_portions}</td>
              <td className="num">{r.target_food_cost_pct}%</td>
              <td><button className="ghost" onClick={() => remove(r.id)}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row-add">
        <div className="field"><label>Name</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} placeholder="e.g. Chocolate Fudge Cake"/></div>
        <div className="field"><label>Category</label><input value={f.category} onChange={e=>setF({...f,category:e.target.value})} placeholder="Cake / Cupcake / Cookie" style={{width:150}}/></div>
        <div className="field"><label>Yield (portions)</label><input type="number" step="1" value={f.yield_portions} onChange={e=>setF({...f,yield_portions:e.target.value})} style={{width:110}}/></div>
        <div className="field"><label>Target FC %</label><input type="number" step="1" value={f.target_food_cost_pct} onChange={e=>setF({...f,target_food_cost_pct:e.target.value})} style={{width:110}}/></div>
        <button className="primary" onClick={add}>+ Add Recipe</button>
      </div>
    </div>
  )
}
