/**
 * Ornamental SVG components used across templates.
 * All accept a `color` prop; default is the CSS var --brand which resolves to
 * the baker's chosen brand color.
 */

/* Wax seal — used on Classic Card, Product Label, Certificate.
   The initials render inside; if blank, a fleur-de-lis substitute is drawn. */
export function WaxSeal({ size = 60, initials, color = 'var(--brand)' }) {
  const abbr = (initials || 'B').split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" style={{display:'block'}}>
      <defs>
        <radialGradient id={`ws-${abbr}`} cx="0.3" cy="0.3" r="0.9">
          <stop offset="0%"  stopColor="rgba(255,255,255,0.55)"/>
          <stop offset="40%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      {/* Wobbly seal edge */}
      <path
        d="M 30 3
           C 34 5, 40 4, 43 8
           C 49 8, 54 13, 54 19
           C 58 22, 57 30, 53 34
           C 55 40, 51 46, 45 47
           C 43 52, 36 55, 30 53
           C 24 55, 17 52, 15 47
           C 9 46, 5 40, 7 34
           C 3 30, 2 22, 6 19
           C 6 13, 11 8, 17 8
           C 20 4, 26 5, 30 3 Z"
        fill={color}
      />
      <path
        d="M 30 3 C 34 5, 40 4, 43 8 C 49 8, 54 13, 54 19 C 58 22, 57 30, 53 34
           C 55 40, 51 46, 45 47 C 43 52, 36 55, 30 53 C 24 55, 17 52, 15 47
           C 9 46, 5 40, 7 34 C 3 30, 2 22, 6 19 C 6 13, 11 8, 17 8
           C 20 4, 26 5, 30 3 Z"
        fill={`url(#ws-${abbr})`}
      />
      {/* Inner ring */}
      <circle cx="30" cy="30" r="18" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
      <text
        x="30" y="35" textAnchor="middle"
        fontFamily="'Playfair Display', 'Cormorant Garamond', serif"
        fontSize={abbr.length === 1 ? 22 : abbr.length === 2 ? 16 : 12}
        fontStyle="italic" fontWeight="700"
        fill="rgba(255,255,255,0.92)"
        letterSpacing="0.5"
      >{abbr}</text>
    </svg>
  )
}

/* Star sparkle — used as tiny decorative accent */
export function Sparkle({ size = 12, color = 'var(--brand)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{display:'inline-block', verticalAlign:'middle'}}>
      <path d="M 10 0 L 11.5 8.5 L 20 10 L 11.5 11.5 L 10 20 L 8.5 11.5 L 0 10 L 8.5 8.5 Z" fill={color}/>
    </svg>
  )
}

/* Wheat sprig — two facing stalks with a central dot */
export function WheatSprig({ width = 90, color = 'var(--brand)' }) {
  const leaf = (x, y) => (
    <ellipse cx={x} cy={y} rx="1.6" ry="3.4" fill={color} opacity="0.75"/>
  )
  return (
    <svg width={width} viewBox="0 0 100 40" style={{display:'block'}}>
      {/* Left stalk */}
      <line x1="30" y1="36" x2="30" y2="8" stroke={color} strokeWidth="0.8"/>
      {leaf(28, 10)}{leaf(32, 10)}
      {leaf(27, 15)}{leaf(33, 15)}
      {leaf(27, 20)}{leaf(33, 20)}
      {leaf(27, 25)}{leaf(33, 25)}
      {leaf(28, 30)}{leaf(32, 30)}
      {/* Center dot with ring */}
      <circle cx="50" cy="22" r="4" fill="none" stroke={color} strokeWidth="0.8"/>
      <circle cx="50" cy="22" r="1.4" fill={color}/>
      {/* Right stalk */}
      <line x1="70" y1="36" x2="70" y2="8" stroke={color} strokeWidth="0.8"/>
      {leaf(68, 10)}{leaf(72, 10)}
      {leaf(67, 15)}{leaf(73, 15)}
      {leaf(67, 20)}{leaf(73, 20)}
      {leaf(67, 25)}{leaf(73, 25)}
      {leaf(68, 30)}{leaf(72, 30)}
    </svg>
  )
}

/* Botanical branch — used at certificate corners */
export function BotanicalBranch({ size = 130, color = 'var(--brand)', mirror = false }) {
  const leaves = []
  for (let i = 0; i < 7; i++) {
    const t = i / 6
    const x = 15 + t * 90
    const y = 100 - t * 85
    const angle = -35 + t * 20
    leaves.push({ x, y, angle, size: 10 - t * 3 })
  }
  return (
    <svg width={size} height={size} viewBox="0 0 130 130"
      style={{ transform: mirror ? 'scaleX(-1)' : 'none' }}>
      {/* Main stem — curved */}
      <path d="M 15 115 Q 55 75, 115 15" stroke={color} strokeWidth="0.9" fill="none"/>
      {/* Small branches off the stem */}
      <path d="M 40 90 Q 30 80, 15 78" stroke={color} strokeWidth="0.6" fill="none" opacity="0.7"/>
      <path d="M 75 55 Q 82 50, 92 52" stroke={color} strokeWidth="0.6" fill="none" opacity="0.7"/>
      {/* Leaves */}
      {leaves.map((L, i) => (
        <g key={i} transform={`translate(${L.x} ${L.y}) rotate(${L.angle})`}>
          <ellipse cx="0" cy="0" rx={L.size} ry={L.size / 3.4} fill={color} opacity="0.72"/>
          <path d={`M -${L.size} 0 L ${L.size} 0`} stroke={color} strokeWidth="0.3" opacity="0.5"/>
        </g>
      ))}
      {/* Berries */}
      <circle cx="30" cy="105" r="2.4" fill={color}/>
      <circle cx="26" cy="99"  r="2.4" fill={color}/>
      <circle cx="100" cy="30" r="2.4" fill={color}/>
    </svg>
  )
}

/* Twine string — used on Care Card and Delivery Tag */
export function TwineArc({ width = 200, color = '#8B7355' }) {
  return (
    <svg width={width} height="20" viewBox="0 0 200 20" style={{display:'block'}}>
      <path d="M 5 5 Q 100 20, 195 5" stroke={color} strokeWidth="1.2" fill="none" strokeDasharray="1 2" strokeLinecap="round"/>
    </svg>
  )
}

/* Heart doodle — small hand-drawn heart for Care Card */
export function HeartDoodle({ size = 16, color = 'var(--brand)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{display:'inline-block', verticalAlign:'middle'}}>
      <path d="M 10 17 C 5 14, 2 10, 3 6 C 4 3, 8 3, 10 6 C 12 3, 16 3, 17 6 C 18 10, 15 14, 10 17 Z"
            fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  )
}

/* Chalk dust ellipse — for chalkboard menu */
export function ChalkFlourish({ width = 60, color = '#F4F1E7' }) {
  return (
    <svg width={width} viewBox="0 0 60 12" style={{display:'block', opacity:0.55}}>
      <path d="M 2 6 Q 15 3, 28 6 T 58 6" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.65"/>
      <path d="M 5 8 Q 20 10, 30 8"       stroke={color} strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )
}

/* Grommet + string — for the Delivery Tag hole */
export function TagGrommet({ size = 12, color = 'var(--brand)' }) {
  return (
    <svg width={size * 2} height={size + 8} viewBox="0 0 24 20" style={{display:'block'}}>
      <circle cx="12" cy="10" r="6" fill="none" stroke={color} strokeWidth="1.6"/>
      <circle cx="12" cy="10" r="3" fill="#F5F6FA"/>
      <path d="M 12 3 Q 18 5, 22 2" stroke="#8B7355" strokeWidth="1" fill="none" opacity="0.6"/>
    </svg>
  )
}
