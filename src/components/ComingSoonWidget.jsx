import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Displays the Coming Soon items that sysadmin edited in /app/sysadmin/content.
 * Drop this component anywhere in your Settings page.
 *
 * Renders nothing if there are no items.
 */
export default function ComingSoonWidget() {
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

  if (items === null)   return null
  if (items.length === 0) return null

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Coming Soon</h3>
          <p className="sub">Features we're working on next.</p>
        </div>
      </div>
      <div className="coming-soon-grid">
        {items.map((it, i) => (
          <div key={i} className="coming-soon-card">
            <div className="coming-soon-badge">Coming soon</div>
            <div className="coming-soon-title">{it.title}</div>
            <div className="coming-soon-desc">{it.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
