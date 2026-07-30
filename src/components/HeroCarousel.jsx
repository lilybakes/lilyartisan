// BakerNomics hero carousel — 5 slides, 6s autoplay, pause on hover,
// keyboard arrows, progress bar, responsive.
//
// Requires 5 images in /public/hero/:
//   hero-1.jpg  photo — hands in the dough
//   hero-2.png  screenshot — dashboard
//   hero-3.jpg  photo — handover at counter
//   hero-4.png  screenshot — one recipe
//   hero-5.jpg  photo — baker, front-on
//
// Slides 2 and 4 gracefully show a placeholder frame if the screenshot is missing.

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const VIOLET   = '#6C5CE7'
const INTERVAL = 6000

const PRIMARY = {
  fontSize: 15.5, fontWeight: 700, color: '#FFFFFF', background: VIOLET,
  borderRadius: 12, padding: '15px 26px', textDecoration: 'none', display: 'inline-block',
}
const ON_PHOTO_SECONDARY = {
  fontSize: 15.5, fontWeight: 700, color: '#FFFFFF', background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, padding: '14px 24px',
  textDecoration: 'none', display: 'inline-block',
}
const GHOST = {
  fontSize: 15.5, fontWeight: 700, color: '#4A5068', background: '#FFFFFF',
  border: '1px solid #E2E4EF', borderRadius: 12, padding: '14px 24px',
  textDecoration: 'none', display: 'inline-block',
}

// Frame with graceful placeholder if image fails to load
function Frame({ url, src, alt }) {
  const [failed, setFailed] = useState(false)
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 18, overflow: 'hidden',
      background: '#FFFFFF', border: '1px solid #E7E9F2',
      boxShadow: '0 26px 60px -22px rgba(60,40,120,0.32)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7, padding: '12px 16px',
        background: '#F5F6FA', borderBottom: '1px solid #EDEEF6',
      }}>
        {['#FF6058', '#FFBD2E', '#28CA42'].map(c => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: 999, background: c }}/>
        ))}
        <span style={{ marginLeft: 12, fontSize: 11.5, fontWeight: 600, color: '#A2A8BE' }}>{url}</span>
      </div>
      <div style={{ position: 'relative', height: 380 }}>
        {!failed ? (
          <img src={src} alt={alt} loading="lazy"
            onError={() => setFailed(true)}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}/>
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #f4f2ff 0%, #ffe9f4 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            color: '#7367f0', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em' }}>Screenshot</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#A2A8BE', marginTop: 6 }}>
              Drop the file in <code style={{fontSize:12}}>public/hero/</code>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PhotoSlide({ src, alt, priority, scrim, drift, children }) {
  return (
    <div data-bn-slide style={{ position: 'relative', flex: '0 0 100%', boxSizing: 'border-box', height: '100%', overflow: 'hidden' }}>
      <img src={src} alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          animation: `bnDrift ${drift}s ease-out forwards`,
        }}/>
      <div style={{ position: 'absolute', inset: 0, background: scrim, pointerEvents: 'none' }}/>
      {children}
    </div>
  )
}

export default function HeroCarousel() {
  const [i, setI] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      if (paused || reduced.current) return
      setElapsed(e => {
        if (e + 120 >= INTERVAL) { setI(n => (n + 1) % 5); return 0 }
        return e + 120
      })
    }, 120)
    return () => clearInterval(id)
  }, [paused])

  const go = n => { setI(n); setElapsed(0) }

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight') go((i + 1) % 5)
      if (e.key === 'ArrowLeft')  go((i + 4) % 5)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [i])

  const arrow = side => ({
    position: 'absolute', top: '50%', [side]: 22, transform: 'translateY(-50%)', zIndex: 4,
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 46, height: 46,
    border: '1px solid rgba(31,36,64,0.1)', borderRadius: 999, background: 'rgba(255,255,255,0.88)',
    color: '#1F2440', fontSize: 19, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(6px)',
  })

  return (
    <section
      data-bn-hero
      aria-roledescription="carousel"
      aria-label="BakerNomics highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ position: 'relative', height: 660, overflow: 'hidden', background: '#1F2440',
               fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`@keyframes bnDrift { from { transform: scale(1.04); } to { transform: scale(1.12); } }`}</style>

      <div data-bn-track style={{
        position: 'absolute', inset: 0, display: 'flex', width: '500%',
        transition: 'transform 800ms cubic-bezier(0.65,0,0.35,1)',
        transform: `translateX(-${i * 20}%)`,
      }}>

        {/* 1 — Hands in the dough */}
        <PhotoSlide
          src="/hero/hero-1.jpg" priority drift={14}
          alt="Baker shaping dough on a floured bench"
          scrim="linear-gradient(90deg, rgba(20,14,32,0.88) 0%, rgba(20,14,32,0.72) 38%, rgba(20,14,32,0.12) 72%, rgba(20,14,32,0) 100%)"
        >
          <div data-bn-copy style={{ position: 'absolute', top: 0, left: 0, width: 700, height: '100%', display: 'flex',
                        flexDirection: 'column', justifyContent: 'center', gap: 22,
                        padding: '0 0 40px 80px', pointerEvents: 'none' }}>
            <span style={{ alignSelf: 'flex-start', fontSize: 12.5, fontWeight: 700, color: '#F0EAFE',
                           background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)',
                           borderRadius: 999, padding: '7px 15px' }}>Made for artisan bakers</span>
            <h1 style={{ margin: 0, fontSize: 76, fontWeight: 800, letterSpacing: '-0.04em',
                         lineHeight: 0.98, color: '#FFFFFF', textWrap: 'balance' }}>
              Bake more.<br/><span style={{ color: '#D08BFF' }}>Guess less.</span>
            </h1>
            <p style={{ margin: 0, maxWidth: 520, fontSize: 18.5, fontWeight: 500, lineHeight: 1.55,
                        color: 'rgba(255,255,255,0.82)', textWrap: 'pretty' }}>
              Every ingredient, every gram, every ringgit — tracked. Know your true cost per portion before you set a single price.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 6, pointerEvents: 'auto' }}>
              <Link to="/signup" style={PRIMARY}>Start 14-day Free Trial</Link>
              <Link to="/login" style={ON_PHOTO_SECONDARY}>Sign in</Link>
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>
              No credit card required · Cancel anytime · Made in Malaysia
            </span>
          </div>
        </PhotoSlide>

        {/* 2 — The dashboard */}
        <div data-bn-slide data-bn-layout="split" style={{
          flex: '0 0 100%', boxSizing: 'border-box', height: '100%', display: 'flex',
          alignItems: 'center', gap: 56, padding: '0 104px',
          background: 'linear-gradient(115deg, #FAF7FF 0%, #F4F1FE 42%, #EFFBFA 100%)',
        }}>
          <div data-bn-copy style={{ flex: '0 0 470px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span style={{ alignSelf: 'flex-start', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em',
                           textTransform: 'uppercase', color: VIOLET, background: '#EEECFE',
                           borderRadius: 999, padding: '7px 14px' }}>The dashboard</span>
            <h2 style={{ margin: 0, fontSize: 58, fontWeight: 800, letterSpacing: '-0.04em',
                         lineHeight: 1.02, color: '#1F2440', textWrap: 'balance' }}>
              Your bakery, in one honest number.
            </h2>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 500, lineHeight: 1.55, color: '#5C6280', textWrap: 'pretty' }}>
              Recipes, average cost, and live margin — the moment you log in. No spreadsheet, no formulas, no wondering whether that order was actually worth it.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
              <Link to="/signup" style={PRIMARY}>Start 14-day Free Trial</Link>
              <a href="#features" style={GHOST}>See a 90-sec tour</a>
            </div>
          </div>
          <Frame url="app.bakernomics.com / dashboard" src="/hero/hero-2.png"
                 alt="BakerNomics dashboard showing recipes, average cost and margin"/>
        </div>

        {/* 3 — The handover */}
        <PhotoSlide
          src="/hero/hero-3.jpg" drift={16}
          alt="Baker handing a boxed order to a customer"
          scrim="linear-gradient(75deg, rgba(28,10,40,0.9) 0%, rgba(28,10,40,0.6) 45%, rgba(28,10,40,0.05) 82%)"
        >
          <div data-bn-copy style={{ position: 'absolute', top: 0, left: 0, width: 760, height: '100%', display: 'flex',
                        flexDirection: 'column', justifyContent: 'center', gap: 24,
                        padding: '0 0 40px 80px', pointerEvents: 'none' }}>
            <h2 style={{ margin: 0, fontSize: 68, fontWeight: 800, letterSpacing: '-0.04em',
                         lineHeight: 1, color: '#FFFFFF', textWrap: 'balance' }}>
              You've been pricing by feel.
            </h2>
            <p style={{ margin: 0, maxWidth: 540, fontSize: 21, fontWeight: 600, lineHeight: 1.45, color: '#D08BFF' }}>
              Start pricing by fact.
            </p>
            <p style={{ margin: 0, maxWidth: 520, fontSize: 17.5, fontWeight: 500, lineHeight: 1.55,
                        color: 'rgba(255,255,255,0.78)', textWrap: 'pretty' }}>
              That RM 12 loaf you've charged for two years? BakerNomics tells you what it actually costs today — butter hike included.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 6, pointerEvents: 'auto' }}>
              <Link to="/signup" style={PRIMARY}>Price my recipes free</Link>
            </div>
          </div>
        </PhotoSlide>

        {/* 4 — A single recipe */}
        <div data-bn-slide data-bn-layout="split" style={{
          flex: '0 0 100%', boxSizing: 'border-box', height: '100%', display: 'flex',
          alignItems: 'center', gap: 56, padding: '0 104px',
          background: 'linear-gradient(200deg, #FFF9F2 0%, #FBF4FF 48%, #F3F1FE 100%)',
        }}>
          <Frame url="app.bakernomics.com / recipes / sourdough" src="/hero/hero-4.png"
                 alt="Recipe cost breakdown with ingredient rows and cost per portion"/>
          <div data-bn-copy style={{ flex: '0 0 450px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <span style={{ alignSelf: 'flex-start', fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em',
                           textTransform: 'uppercase', color: '#B0700F', background: '#FDF0E1',
                           borderRadius: 999, padding: '7px 14px' }}>Ripple pricing</span>
            <h2 style={{ margin: 0, fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em',
                         lineHeight: 1.02, color: '#1F2440', textWrap: 'balance' }}>
              Flour goes up. You'll know first.
            </h2>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 500, lineHeight: 1.55, color: '#5C6280', textWrap: 'pretty' }}>
              Update one ingredient price and every recipe, portion cost, and suggested selling price recalculates instantly. Find the six items quietly losing you money.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
              <Link to="/signup" style={PRIMARY}>Start 14-day Free Trial</Link>
            </div>
          </div>
        </div>

        {/* 5 — The baker, front on */}
        <PhotoSlide
          src="/hero/hero-5.jpg" drift={18}
          alt="Baker standing at the counter of her bakery"
          scrim="linear-gradient(180deg, rgba(18,10,30,0.34) 0%, rgba(18,10,30,0.1) 26%, rgba(18,10,30,0.62) 58%, rgba(18,10,30,0.94) 100%)"
        >
          <div data-bn-copy style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'flex-end', gap: 18,
                        padding: '0 80px 112px', textAlign: 'center', pointerEvents: 'none' }}>
            <h2 style={{ margin: 0, maxWidth: 860, fontSize: 60, fontWeight: 800, letterSpacing: '-0.04em',
                         lineHeight: 1.02, color: '#FFFFFF', textWrap: 'balance' }}>
              Know your margin before the oven's even warm.
            </h2>
            <p style={{ margin: 0, maxWidth: 580, fontSize: 18.5, fontWeight: 500, lineHeight: 1.55,
                        color: 'rgba(255,255,255,0.84)', textWrap: 'pretty' }}>
              Join the bakers who stopped guessing. Set up your first recipe in under ten minutes.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 8, pointerEvents: 'auto' }}>
              <Link to="/signup" style={{ ...PRIMARY, fontSize: 16, padding: '16px 30px' }}>Start 14-day Free Trial</Link>
              <Link to="/login" style={{ ...ON_PHOTO_SECONDARY, fontSize: 16, padding: '15px 28px' }}>Sign in</Link>
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.62)' }}>
              No credit card required · Cancel anytime
            </span>
          </div>
        </PhotoSlide>
      </div>

      <button data-bn-arrow onClick={() => go((i + 4) % 5)} aria-label="Previous slide" style={arrow('left')}>‹</button>
      <button data-bn-arrow onClick={() => go((i + 1) % 5)} aria-label="Next slide"     style={arrow('right')}>›</button>

      <div style={{ position: 'absolute', bottom: 26, left: '50%', transform: 'translateX(-50%)', zIndex: 4,
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(31,36,64,0.08)',
                    backdropFilter: 'blur(8px)' }}>
        {[0, 1, 2, 3, 4].map(n => (
          <button key={n} onClick={() => go(n)} aria-label={`Go to slide ${n + 1}`}
            aria-current={n === i}
            style={{ height: 8, width: n === i ? 30 : 8, border: 'none', borderRadius: 999, padding: 0,
                     cursor: 'pointer', background: n === i ? VIOLET : '#C9CCDD',
                     transition: 'width 300ms ease, background 300ms ease' }}/>
        ))}
        <span style={{ width: 1, height: 14, background: '#E2E4EF' }}/>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#6E7490', fontVariantNumeric: 'tabular-nums' }}>
          {i + 1} / 5
        </span>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, zIndex: 4, background: VIOLET,
                    transition: 'width 120ms linear',
                    width: `${Math.min(100, (elapsed / INTERVAL) * 100)}%` }}/>
    </section>
  )
}
