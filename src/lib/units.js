export const UNITS = {
  g:    { dim: 'mass',   toBase: 1,        label: 'g' },
  kg:   { dim: 'mass',   toBase: 1000,     label: 'kg' },
  oz:   { dim: 'mass',   toBase: 28.3495,  label: 'oz' },
  lb:   { dim: 'mass',   toBase: 453.592,  label: 'lb' },
  ml:   { dim: 'volume', toBase: 1,        label: 'ml' },
  l:    { dim: 'volume', toBase: 1000,     label: 'L' },
  tsp:  { dim: 'volume', toBase: 4.92892,  label: 'tsp' },
  tbsp: { dim: 'volume', toBase: 14.7868,  label: 'tbsp' },
  cup:  { dim: 'volume', toBase: 236.588,  label: 'cup' },
  pcs:  { dim: 'count',  toBase: 1,        label: 'pcs' },
}
export const UNIT_KEYS = Object.keys(UNITS)

export function convert(qty, fromUnit, toUnit, densityGml) {
  const f = UNITS[fromUnit], t = UNITS[toUnit]
  if (!f || !t) return { ok: false, reason: 'unknown unit' }
  if (f.dim === t.dim) {
    const baseQty = qty * f.toBase
    return { ok: true, value: baseQty / t.toBase, bridged: false }
  }
  const isMassVol = (f.dim === 'mass' && t.dim === 'volume') || (f.dim === 'volume' && t.dim === 'mass')
  if (isMassVol && densityGml) {
    let grams = f.dim === 'mass' ? qty * f.toBase : (qty * f.toBase) * densityGml
    if (t.dim === 'mass') return { ok: true, value: grams / t.toBase, bridged: true }
    return { ok: true, value: (grams / densityGml) / t.toBase, bridged: true }
  }
  return { ok: false, reason: 'no density set — cannot bridge mass ↔ volume' }
}
