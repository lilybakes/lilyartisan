import { UNITS, convert } from './units'

export function unitCostBase(ing) {
  const u = UNITS[ing.purchase_unit]
  if (!u) return 0
  const q = ing.purchase_qty * u.toBase * (1 - (ing.waste_pct || 0) / 100)
  return q > 0 ? ing.purchase_price / q : 0
}

export function lineCost(ing, qty, unit) {
  const pu = UNITS[ing.purchase_unit], uu = UNITS[unit]
  if (!pu || !uu) return { ok: false, reason: 'unknown unit' }
  const baseCost = unitCostBase(ing)
  if (pu.dim === uu.dim) {
    return { ok: true, cost: qty * uu.toBase * baseCost, bridged: false }
  }
  const c = convert(qty, unit, ing.purchase_unit, ing.density_g_ml)
  if (!c.ok) return { ok: false, reason: c.reason }
  return { ok: true, cost: c.value * pu.toBase * baseCost, bridged: c.bridged }
}

export function recipeCostTotal(bomLines, ingredientsById) {
  return bomLines.reduce((sum, l) => {
    const ing = ingredientsById[l.ingredient_id]
    if (!ing) return sum
    const r = lineCost(ing, l.qty, l.unit)
    return sum + (r.ok ? r.cost : 0)
  }, 0)
}

export function costPerPortion(recipe, bomLines, ingredientsById) {
  const total = recipeCostTotal(bomLines, ingredientsById)
  return recipe.yield_portions > 0 ? total / recipe.yield_portions : 0
}

export function suggestedPrice(recipe, bomLines, ingredientsById) {
  const cpp = costPerPortion(recipe, bomLines, ingredientsById)
  const pct = (recipe.target_food_cost_pct || 28) / 100
  return pct > 0 ? cpp / pct : 0
}

// Currency-aware money formatter. Default RM for backwards-compat.
export function money(n, currency = 'RM') {
  return `${currency} ${(isFinite(n) ? n : 0).toFixed(2)}`
}

export function initials(s) {
  return s.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
}

export const CHIP_COLORS = ['#7367f0', '#00cfe8', '#ff9f43', '#28c76f', '#ff6b9d', '#a855f7']
