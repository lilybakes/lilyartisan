import { useMemo } from 'react'
import { useTable, useInventory } from '../lib/data'
import { UNITS } from '../lib/units'
import { initials } from '../lib/costing'

export default function Inventory() {
  const { rows: ingredients } = useTable('ingredients', 'name')
  const { rows: inv, setStock } = useInventory()
  const stockByIng = useMemo(() => Object.fromEntries(inv.map(x => [x.ingredient_id, x.stock_qty])), [inv])

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Inventory <span style={{fontWeight:400, color:'var(--muted)', fontSize:13}}>(optional)</span></h3>
          <p className="sub">Stock on hand per ingredient. Flags "low" under 25% of one purchase batch.</p>
        </div>
      </div>
      <table>
        <thead><tr><th>Ingredient</th><th className="num">Stock on hand</th><th>Status</th></tr></thead>
        <tbody>
          {ingredients.length === 0 && <tr><td colSpan="3" className="empty">No ingredients yet.</td></tr>}
          {ingredients.map(i => {
            const stock = Number(stockByIng[i.id] ?? 0)
            const low = stock < i.purchase_qty * 0.25
            return (
              <tr key={i.id}>
                <td><div className="row-name"><div className="row-chip" style={{background:i.color || '#7367f0'}}>{initials(i.name)}</div><strong>{i.name}</strong></div></td>
                <td className="num">
                  <input type="number" step="0.01" defaultValue={stock} style={{width:100, textAlign:'right'}}
                    onBlur={e => {
                      const v = parseFloat(e.target.value) || 0
                      if (v !== stock) setStock(i.id, v)
                    }}/> {UNITS[i.purchase_unit]?.label}
                </td>
                <td><span className={`pill ${low ? 'low' : 'ok'}`}>{low ? 'Low stock' : 'OK'}</span></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
