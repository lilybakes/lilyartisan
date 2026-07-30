import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Reads the sysadmin-editable Coming Soon list from content_blocks.
 * Drop this anywhere in your user-facing Settings page.
 *
 * Props:
 *   title    — heading (default "Coming Soon")
 *   subtitle — sub-heading (default matches the existing user Settings copy)
 *
 * Renders nothing if there are no items.
 */
export default function ComingSoonWidget({
  title = 'Coming Soon',
  subtitle = 'Placeholders for future customization.',
} = {}) {
  const [items, setItems] = useState(null)   // null = loading, [] = none, [...] = items

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
  if (items.length === 0) return null

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          <p className="sub">{subtitle}</p>
        </div>
      </div>
      <div className="coming-soon-grid">
        {items.map((it, i) => (
          <div key={i} className="coming-soon-card">
            <div className="coming-soon-title">{it.title}</div>
            <div className="coming-soon-desc">{it.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
