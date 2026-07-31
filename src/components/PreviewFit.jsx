import { useEffect, useRef, useState } from 'react'

/**
 * Auto-scales a print-sized child template (A4/A5/A7/1:1) to fit the parent
 * container's width — the same pattern browser print-preview uses.
 *
 * Mechanics:
 *   • `outerRef`    — `display: block; width: 100%`. Always tracks the
 *     parent's usable width via `clientWidth`. This is what we measure
 *     the container against.
 *   • `wrapRef`     — `display: inline-block`. Its `offsetWidth/Height`
 *     give us the child template's NATURAL size. We neutralise its
 *     transform (via direct DOM style) for one synchronous read per
 *     measure so we get the true unscaled dimensions.
 *   • `viewportRef` — sized explicitly to `naturalDim × scale`. `overflow:
 *     hidden` clips anything outside. `margin: 0 auto` centres the scaled
 *     preview inside the outer container on wide viewports where the
 *     template fits at natural size.
 *
 * ResizeObserver on the outer wrapper AND the wrap re-measures on either
 * viewport reflow (rotation, drawer open/close) or template swap (Cost
 * Breakdown → Certificate: A4 portrait → A4 landscape).
 *
 * On viewports narrower than the template, a small percentage chip +
 * Fit/Actual toggle appears so users can view at 100% and pinch-zoom for
 * fine detail. When no scaling is needed, the toggle stays hidden and
 * the child renders untouched at natural size.
 */
export default function PreviewFit({ children }) {
  const outerRef    = useRef(null)
  const viewportRef = useRef(null)
  const wrapRef     = useRef(null)
  const [scale,   setScale]   = useState(1)
  const [natural, setNatural] = useState({ w: 0, h: 0 })
  const [mode,    setMode]    = useState('fit')  // 'fit' | 'actual'

  useEffect(() => {
    const outer = outerRef.current
    const wrap  = wrapRef.current
    if (!outer || !wrap) return

    const measure = () => {
      // Neutralise the transform to read the child's natural size, restore
      // it in the same tick. No visible flicker in practice — the browser
      // batches this within a single layout pass.
      const savedTransform       = wrap.style.transform
      const savedTransformOrigin = wrap.style.transformOrigin
      wrap.style.transform       = 'none'
      wrap.style.transformOrigin = 'top left'
      const naturalW = wrap.offsetWidth
      const naturalH = wrap.offsetHeight
      wrap.style.transform       = savedTransform
      wrap.style.transformOrigin = savedTransformOrigin

      const containerW = outer.clientWidth
      if (naturalW === 0 || containerW === 0) return

      // Only scale DOWN. If the child fits, leave it at natural size.
      const nextScale = naturalW > containerW ? containerW / naturalW : 1

      setNatural(prev =>
        prev.w === naturalW && prev.h === naturalH ? prev : { w: naturalW, h: naturalH })
      setScale(prev => Math.abs(prev - nextScale) < 0.0005 ? prev : nextScale)
    }

    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => measure())
    ro.observe(outer)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [children])

  const canScale       = scale < 0.999
  const effectiveScale = mode === 'actual' ? 1 : scale
  const viewportWidth  = natural.w > 0
    ? (mode === 'actual' ? natural.w : natural.w * scale)
    : undefined
  const viewportHeight = natural.h > 0
    ? (mode === 'actual' ? natural.h : natural.h * scale)
    : undefined

  return (
    <div ref={outerRef} className="pv-fit">
      {canScale && (
        <div className="pv-fit-bar no-print">
          <span className="pv-fit-pct">{Math.round(effectiveScale * 100)}%</span>
          <div className="pv-fit-toggle" role="tablist">
            <button
              type="button"
              className={mode === 'fit' ? 'active' : ''}
              onClick={() => setMode('fit')}
              aria-pressed={mode === 'fit'}
            >Fit width</button>
            <button
              type="button"
              className={mode === 'actual' ? 'active' : ''}
              onClick={() => setMode('actual')}
              aria-pressed={mode === 'actual'}
            >Actual size</button>
          </div>
        </div>
      )}

      <div
        ref={viewportRef}
        className="pv-fit-viewport"
        style={{
          width: viewportWidth,
          height: viewportHeight,
          overflow: mode === 'actual' ? 'auto' : 'hidden',
          WebkitOverflowScrolling: 'touch',
          margin: '0 auto',
        }}
      >
        <div
          ref={wrapRef}
          className="pv-fit-inner"
          style={{
            transform: `scale(${effectiveScale})`,
            transformOrigin: 'top left',
            display: 'inline-block',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
