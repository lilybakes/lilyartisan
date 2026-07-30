// Compute display initials from a full name.
//   "Anthony Ang Kang Keam" → "AA" (first letter of first + first letter of second word)
//   "Lily"                   → "LI"
//   ""                       → "?"
export function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// On-brand color palette — used for initials background.
export const BRAND_COLORS = [
  '#7367f0', // violet
  '#00cfe8', // cyan
  '#ff9f43', // orange
  '#28c76f', // green
  '#ff6b9d', // pink
  '#5a4fd6', // dark violet
]

// Deterministic color for a user (seeded from user_id or email).
// Same user → same color across sessions.
export function colorFromSeed(seed) {
  if (!seed) return BRAND_COLORS[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  return BRAND_COLORS[Math.abs(hash) % BRAND_COLORS.length]
}
