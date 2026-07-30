import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const INTERVAL = 6000

// Mini dashboard mock — replaces external screenshot on slide 2
function MockDashboard() {
  return (
    <div className="hc-frame">
      <div className="hc-chrome">
        <span className="hc-dot hc-dot-r"/>
        <span className="hc-dot hc-dot-y"/>
        <span className="hc-dot hc-dot-g"/>
        <span className="hc-url">app.bakernomics.com / dashboard</span>
      </div>
      <div className="hc-screen">
        <div className="hc-greeting">
          <div className="hc-greeting-title">Welcome back, Lily 👋</div>
          <div className="hc-greeting-sub">Your bakery costing dashboard</div>
        </div>
        <div className="hc-stats-row">
          <div className="hc-stat hc-stat-1"><span>Recipes</span><strong>12</strong></div>
          <div className="hc-stat hc-stat-2"><span>Avg Cost</span><strong>RM 8.40</strong></div>
          <div className="hc-stat hc-stat-3"><span>Avg Margin</span><strong>62%</strong></div>
        </div>
        <div className="hc-panel">
          <div className="hc-panel-title">Cost Breakdown · Sourdough Loaf</div>
          <div className="hc-bar"><span className="hc-bar-name">Butter</span><div className="hc-bar-track"><div className="hc-bar-fill" style={{width:'82%', background:'#7367f0'}}/></div><span className="hc-bar-val">RM 1.24</span></div>
          <div className="hc-bar"><span className="hc-bar-name">Flour</span><div className="hc-bar-track"><div className="hc-bar-fill" style={{width:'64%', background:'#22C3DC'}}/></div><span className="hc-bar-val">RM 0.96</span></div>
          <div className="hc-bar"><span className="hc-bar-name">Sugar</span><div className="hc-bar-track"><div className="hc-bar-fill" style={{width:'46%', background:'#F79C42'}}/></div><span className="hc-bar-val">RM 0.68</span></div>
          <div className="hc-bar"><span className="hc-bar-name">Eggs</span><div className="hc-bar-track"><div className="hc-bar-fill" style={{width:'32%', background:'#34C77B'}}/></div><span className="hc-bar-val">RM 0.48</span></div>
        </div>
      </div>
    </div>
  )
}

// Recipe cost mock — replaces external screenshot on slide 4
function MockRecipe() {
  return (
    <div className="hc-frame">
      <div className="hc-chrome">
        <span className="hc-dot hc-dot-r"/>
        <span className="hc-dot hc-dot-y"/>
        <span className="hc-dot hc-dot-g"/>
        <span className="hc-url">app.bakernomics.com / recipes / sourdough</span>
      </div>
      <div className="hc-screen">
        <div className="hc-recipe-head">
          <div>
            <div className="hc-recipe-name">Sourdough Loaf</div>
            <div className="hc-recipe-meta">Yields 8 portions · Target 30% food cost</div>
          </div>
          <div className="hc-recipe-price">
            <div className="hc-recipe-price-lbl">Suggested price</div>
            <div className="hc-recipe-price-val">RM 12.80</div>
          </div>
        </div>
        <div className="hc-recipe-rows">
          <div className="hc-recipe-row"><span>Bread flour</span><span className="hc-recipe-qty">500 g</span><span className="hc-recipe-cost">RM 1.85</span></div>
          <div className="hc-recipe-row"><span>Levain</span><span className="hc-recipe-qty">100 g</span><span className="hc-recipe-cost">RM 0.40</span></div>
          <div className="hc-recipe-row hc-recipe-row-highlight"><span>Butter <span className="hc-recipe-tag">↑ 8%</span></span><span className="hc-recipe-qty">80 g</span><span className="hc-recipe-cost">RM 1.24</span></div>
          <div className="hc-recipe-row"><span>Sea salt</span><span className="hc-recipe-qty">10 g</span><span className="hc-recipe-cost">RM 0.04</span></div>
        </div>
        <div className="hc-recipe-summary">
          <div><span>Cost per portion</span><strong>RM 3.84</strong></div>
          <div className="hc-recipe-summary-margin"><span>Current margin</span><strong>70%</strong></div>
        </div>
      </div>
    </div>
  )
}

function PhotoSlide({ src, alt, priority, scrim, drift, children }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="hc-slide hc-slide-photo">
      {!failed ? (
        <img
          className="hc-photo"
          src={src} alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchpriority={priority ? 'high' : undefined}
          onError={() => setFailed(true)}
          style={{ animation: `hcDrift ${drift}s ease-out forwards` }}
        />
      ) : (
        <div className="hc-photo hc-photo-fallback" aria-hidden="true"/>
      )}
      <div className="hc-scrim" style={{ background: scrim }}/>
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

  return (
    <section
      className="hc"
      aria-roledescription="carousel"
      aria-label="BakerNomics highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hc-track" style={{ transform: `translateX(-${i * 20}%)` }}>

        {/* 1 — Hands in the dough */}
        <PhotoSlide
          src="/hero/hero-1.jpg" priority drift={14}
          alt="Baker shaping dough on a floured bench"
          scrim="linear-gradient(90deg, rgba(20,14,32,0.88) 0%, rgba(20,14,32,0.72) 38%, rgba(20,14,32,0.12) 72%, rgba(20,14,32,0) 100%)"
        >
          <div className="hc-copy hc-copy-left">
            <span className="hc-eyebrow hc-eyebrow-on-photo">🎂 Made for artisan bakers</span>
            <h1>Bake more.<br/><span className="hc-accent-pink">Guess less.</span></h1>
            <p>Every ingredient, every gram, every ringgit — tracked. Know your true cost per portion before you set a single price.</p>
            <div className="hc-ctas">
              <Link to="/signup" className="hc-btn hc-btn-primary">Start 14-day Free Trial</Link>
              <Link to="/login" className="hc-btn hc-btn-ghost-on-photo">Sign in</Link>
            </div>
            <span className="hc-fineprint hc-fineprint-on-photo">No credit card required · Cancel anytime · Made in Malaysia</span>
          </div>
        </PhotoSlide>

        {/* 2 — The dashboard */}
        <div className="hc-slide hc-slide-split hc-slide-tint-a">
          <div className="hc-copy hc-copy-split">
            <span className="hc-eyebrow hc-eyebrow-violet">THE DASHBOARD</span>
            <h2>Your bakery, in one honest number.</h2>
            <p>Recipes, average cost, and live margin — the moment you log in. No spreadsheet, no formulas, no wondering whether that order was actually worth it.</p>
            <div className="hc-ctas">
              <Link to="/signup" className="hc-btn hc-btn-primary">Start 14-day Free Trial</Link>
              <a href="#features" className="hc-btn hc-btn-ghost">See a 90-sec tour</a>
            </div>
          </div>
          <MockDashboard/>
        </div>

        {/* 3 — The handover */}
        <PhotoSlide
          src="/hero/hero-3.jpg" drift={16}
          alt="Baker handing a boxed order to a customer"
          scrim="linear-gradient(75deg, rgba(28,10,40,0.9) 0%, rgba(28,10,40,0.6) 45%, rgba(28,10,40,0.05) 82%)"
        >
          <div className="hc-copy hc-copy-left">
            <h2>You've been pricing by feel.</h2>
            <p className="hc-lede">Start pricing by fact.</p>
            <p>That RM 12 loaf you've charged for two years? BakerNomics tells you what it actually costs today — butter hike included.</p>
            <div className="hc-ctas">
              <Link to="/signup" className="hc-btn hc-btn-primary">Price my recipes free</Link>
            </div>
          </div>
        </PhotoSlide>

        {/* 4 — A single recipe */}
        <div className="hc-slide hc-slide-split hc-slide-tint-b">
          <MockRecipe/>
          <div className="hc-copy hc-copy-split">
            <span className="hc-eyebrow hc-eyebrow-amber">RIPPLE PRICING</span>
            <h2>Flour goes up. You'll know first.</h2>
            <p>Update one ingredient price and every recipe, portion cost, and suggested selling price recalculates instantly. Find the six items quietly losing you money.</p>
            <div className="hc-ctas">
              <Link to="/signup" className="hc-btn hc-btn-primary">Start 14-day Free Trial</Link>
            </div>
          </div>
        </div>

        {/* 5 — The baker, front on */}
        <PhotoSlide
          src="/hero/hero-5.jpg" drift={18}
          alt="Baker standing at the counter of her bakery"
          scrim="linear-gradient(180deg, rgba(18,10,30,0.34) 0%, rgba(18,10,30,0.1) 26%, rgba(18,10,30,0.62) 58%, rgba(18,10,30,0.94) 100%)"
        >
          <div className="hc-copy hc-copy-center">
            <h2>Know your margin before the oven's even warm.</h2>
            <p>Join the bakers who stopped guessing. Set up your first recipe in under ten minutes.</p>
            <div className="hc-ctas">
              <Link to="/signup" className="hc-btn hc-btn-primary hc-btn-lg">Start 14-day Free Trial</Link>
              <Link to="/login" className="hc-btn hc-btn-ghost-on-photo hc-btn-lg">Sign in</Link>
            </div>
            <span className="hc-fineprint hc-fineprint-on-photo">No credit card required · Cancel anytime</span>
          </div>
        </PhotoSlide>
      </div>

      <button className="hc-arrow hc-arrow-left" onClick={() => go((i + 4) % 5)} aria-label="Previous slide">‹</button>
      <button className="hc-arrow hc-arrow-right" onClick={() => go((i + 1) % 5)} aria-label="Next slide">›</button>

      <div className="hc-dots">
        {[0, 1, 2, 3, 4].map(n => (
          <button
            key={n}
            className={'hc-dot-btn' + (n === i ? ' active' : '')}
            onClick={() => go(n)}
            aria-label={`Go to slide ${n + 1}`}
            aria-current={n === i}
          />
        ))}
        <span className="hc-dots-sep"/>
        <span className="hc-counter">{i + 1} / 5</span>
      </div>

      <div className="hc-progress" style={{ width: `${Math.min(100, (elapsed / INTERVAL) * 100)}%` }}/>
    </section>
  )
}
