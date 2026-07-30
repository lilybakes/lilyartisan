// BakeOnomics logo — "The Margin b"
// Two-tone wordmark: "Bake" (navy) + "Onomics" (violet)

export function Logo({
  size = 40,
  variant = 'gradient',
  showWordmark = false,
  subLabel,
  theme = 'light',
}) {
  const gradId = 'bnGrad'
  const showTrack = size >= 24
  const wordInk    = theme === 'dark' ? '#FFFFFF' : '#1F2440'
  const wordAccent = theme === 'dark' ? '#C084FC' : '#6C5CE7'

  const badge = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      role="img"
      aria-label="BakeOnomics"
      style={{ flex: '0 0 auto', display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#C026D3"/>
          <stop offset="1" stopColor="#7C3AED"/>
        </linearGradient>
      </defs>

      {variant === 'gradient' && <rect width="96" height="96" rx="26" fill={`url(#${gradId})`}/>}
      {variant === 'mono'     && <rect width="96" height="96" rx="26" fill="#1F2440"/>}
      {variant === 'outline'  && (
        <rect x="2" y="2" width="92" height="92" rx="27" fill="none" stroke="#FFFFFF" strokeWidth="4"/>
      )}

      <rect x="26" y="20" width="10" height="56" rx="5" fill="#FFFFFF"/>
      {showTrack && (
        <circle cx="52" cy="54" r="17" fill="none" stroke="#FFFFFF" strokeOpacity="0.34" strokeWidth="10"/>
      )}
      <circle
        cx="52" cy="54" r="17"
        fill="none"
        stroke={variant === 'outline' ? '#C084FC' : '#FFFFFF'}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="78 107"
        transform="rotate(-90 52 54)"
      />
    </svg>
  )

  if (!showWordmark) return badge

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {badge}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 19,
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: wordInk,
          }}
        >
          Bake<span style={{ color: wordAccent }}>Onomics</span>
        </div>
        {subLabel && (
          <div
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.16em',
              color: '#A2A8BE',
            }}
          >
            {subLabel}
          </div>
        )}
      </div>
    </div>
  )
}

export default Logo
