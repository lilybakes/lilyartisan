import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Compact one-line "Coming Soon" strip.
 *
 * Reads the same sysadmin-editable list from `content_blocks` (key='coming_soon')
 * that the full <ComingSoonWidget/> on the Settings page uses, but renders as a
 * quiet horizontal strip of up to 4 pill labels. Tooltip on each pill shows the
 * full description. If no visible items exist, the strip renders nothing at all.
 *
 * Intentionally minimal — no header, no icons beyond a small clock, no CTA.
 */
export default function ComingSoonStrip() {
  const [items, setItems] = useState(null)   // null = loading

  useEffect(() => {
    supabase.from('content_blocks')
      .select('content')
      .eq('key', 'coming_soon')
      .maybeSingle()
      .then(({ data }) => {
        setItems(Array.isArray(data?.content) ? data.content : [])
      })
  }, [])

  if (items === null) return null
  const visible = items.filter(it => it.visible !== false).slice(0, 4)
  if (visible.length === 0) return null

  return (
    <div className="coming-soon-strip" aria-label="Coming soon">
      <span className="coming-soon-strip-label">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 15 15"/>
        </svg>
        On the roadmap
      </span>
      <div className="coming-soon-strip-items">
        {visible.map((it, i) => (
          <span
            key={i}
            className="coming-soon-strip-item"
            title={it.description || it.title}
          >
            {it.title}
          </span>
        ))}
      </div>
    </div>
  )
}
