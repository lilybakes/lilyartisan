import { useMemo } from 'react'
import { useTable, useInventory } from '../lib/data'
import { UNITS } from '../lib/units'

export default function Inventory() {
  const { rows: ingredients } = useTable('ingredients', 'name')
  const { rows: inv, setStock } = useInventory()
  const stockByIng = useMemo(() => Object.fromEntries(inv.map(x => [x.ingredient_id, x.stock_qty])), [inv])

  return (
    <div className="panel">
      <h2>Inventory <span style={{fontWeight:400,color:'var(--muted)',fontSize:13}}>(optional module)</span></h2>
      <p className="sub">Stock on hand in each ingredient's purchase unit. Flags "low" when under 25% of one purchase batch.</p>
      <table>
        <thead><tr><th>Ingredient</th><th className="num">Stock on hand</th><th>Status</th></tr></thead>
        <tbody>
          {ingredients.length === 0 && <tr><td colSpan="3" className="empty">No ingredients yet.</td></tr>}
          {ingredients.map(i => {
            const stock = Number(stockByIng[i.id] ?? 0)
            const low = stock < i.purchase_qty * 0.25
            return (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td className="num">
                  <input type="number" step="0.01" defaultValue={stock} style={{width:90,textAlign:'right'}}
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
