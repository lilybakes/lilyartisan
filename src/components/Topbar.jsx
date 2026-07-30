import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import { Icon } from '../lib/icons.jsx'
import UserAvatar from './UserAvatar.jsx'

// Small icon lookup for the custom "header link" icons stored in DB
function HeaderLinkIcon({ name }) {
  const props = { width:18, height:18, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', strokeWidth:1.8, strokeLinecap:'round', strokeLinejoin:'round' }
  switch (name) {
    case 'globe': return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    case 'grid':  return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    case 'bell':  return <svg {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
    case 'help':  return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    default:      return <svg {...props}><circle cx="12" cy="12" r="9"/></svg>
  }
}

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
        {links.map(link => (
          link.url ? (
            <a key={link.id} className="icn-btn" href={link.url}
               target={link.open_in_new_tab ? '_blank' : '_self'}
               rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
               title={link.label}>
              <HeaderLinkIcon name={link.icon_name}/>
            </a>
          ) : (
            <div key={link.id} className="icn-btn" title={link.label}>
              <HeaderLinkIcon name={link.icon_name}/>
            </div>
          )
        ))}
        <div className="icn-btn" title="Notifications">
          <HeaderLinkIcon name="bell"/>
          <span className="dot"/>
        </div>
        <UserAvatar size={34}/>
      </div>
    </div>
  )
}
