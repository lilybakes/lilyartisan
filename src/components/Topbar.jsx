import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import { Icon } from '../lib/icons.jsx'
import UserAvatarMenu from './UserAvatarMenu.jsx'

export default function Topbar() {
  const { user } = useAuth() || {}
  const [links, setLinks] = useState([])

  useEffect(() => {
    if (!user?.id) return
    supabase.from('header_links')
      .select('*')
      .order('position')
      .then(({ data }) => setLinks(data || []))
  }, [user?.id])

  // Defensive dedupe: same icon+label appears only once, even if DB has stale duplicates.
  const uniqueLinks = useMemo(() => {
    const seen = new Set()
    const out = []
    for (const link of links) {
      const key = `${link.icon_name || ''}::${(link.label || '').toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)
      out.push(link)
    }
    return out
  }, [links])

  function openDrawer() {
    window.dispatchEvent(new CustomEvent('mobile-nav-open'))
  }

  return (
    <div className="topbar">
      <button className="hamburger" onClick={openDrawer} aria-label="Open menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <line x1="4" y1="7"  x2="20" y2="7"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="17" x2="20" y2="17"/>
        </svg>
      </button>

      <div className="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search recipes, ingredients…"/>
      </div>

      <div className="top-icons">
        {uniqueLinks.map(link => (
          link.url ? (
            <a key={link.id} className="icn-btn" href={link.url}
               target={link.open_in_new_tab ? '_blank' : '_self'}
               rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
               title={link.label}>
              <Icon name={link.icon_name || 'link'} size={18}/>
            </a>
          ) : (
            <div key={link.id} className="icn-btn" title={link.label}>
              <Icon name={link.icon_name || 'link'} size={18}/>
            </div>
          )
        ))}
        <div className="icn-btn" title="Notifications">
          <Icon name="bell" size={18}/>
          <span className="dot"/>
        </div>
        <UserAvatarMenu size={34}/>
      </div>
    </div>
  )
}
