export default function RecipePicker({ recipes, value, onChange }) {
  return (
    <div className="recipe-select">
      <label style={{fontSize:11,color:'var(--muted)',fontFamily:'var(--mono)',textTransform:'uppercase'}}>Recipe</label>
      <select value={value || ''} onChange={e => onChange(e.target.value)}>
        {recipes.length === 0 && <option value="">— no recipes —</option>}
        {recipes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>
    </div>
  )
}
