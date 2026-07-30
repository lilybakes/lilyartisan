import { usePersonalization } from '../lib/personalization.jsx'

const DEFAULT_HERO_SRC = '/assets/lily-portrait.png'

/**
 * Renders the Dashboard hero image slot.
 * Renders the halo/confetti pattern always; the character image depends on mode:
 *   - 'default'  → default portrait (Lily)
 *   - 'custom'   → user-uploaded URL
 *   - 'gallery'  → URL from system gallery
 *   - 'none'     → no character, just the halo/confetti
 */
export default function HeroImage() {
  const { hero_mode, hero_url } = usePersonalization()

  let src = null
  if (hero_mode === 'default') src = DEFAULT_HERO_SRC
  else if (hero_mode === 'custom' || hero_mode === 'gallery') src = hero_url || null
  // 'none' → src stays null

  return (
    <div className="hero-art">
      <div className="hero-halo" aria-hidden="true"/>
      <div className="hero-confetti c1" aria-hidden="true"/>
      <div className="hero-confetti c2" aria-hidden="true"/>
      <div className="hero-confetti c3" aria-hidden="true"/>
      {src && (
        <img className="hero-portrait-img" src={src} alt="" loading="eager"/>
      )}
    </div>
  )
}
