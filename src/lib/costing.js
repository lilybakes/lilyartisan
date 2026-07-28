import { UNITS, convert } from './units'

// Cost per BASE unit of the ingredient's own purchase dimension
// (per g if purchased by mass, per ml if by volume, per pcs if by count).
export function unitCostBase(ing) {
  const u = UNITS[ing.purchase_unit]
  if (!u) return 0
  const purchaseBaseQty = ing.purchase_qty * u.toBase * (1 - (ing.waste_pct || 0) / 100)
  if (purchaseBaseQty <= 0) return 0
  return ing.purchase_price / purchaseBaseQty
}

// Cost of a single BOM line, converting the recipe's usage unit into
// the ingredient's purchase dimension (density-bridging when needed).
export function lineCost(ing, qty, unit) {
  const purchaseU = UNITS[ing.purchase_unit]
  const useU = UNITS[unit]
  if (!purchaseU || !useU) return { ok: false, reason: 'unknown unit' }
  const baseCost = unitCostBase(ing)

  if (purchaseU.dim === useU.dim) {
    const baseQty = qty * useU.toBase
    return { ok: true, cost: baseQty * baseCost, bridged: false }
  }

  const conv = convert(qty, unit, ing.purchase_unit, ing.density_g_ml)
  if (!conv.ok) return { ok: false, reason: conv.reason }
  return { ok: true, cost: conv.value * purchaseU.toBase * baseCost, bridged: conv.bridged }
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

export function money(n) {
  return 'RM ' + (isFinite(n) ? n : 0).toFixed(2)
}
