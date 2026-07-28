import { Link } from 'react-router-dom'
import { Icon } from '../lib/icons.jsx'
import { useTable } from '../lib/data'

export default function Topbar() {
  const { rows: links } = useTable('header_links', 'position')

  // Tell the Sidebar to open — the Sidebar listens for this event on window.
  const openNav = () => {
    window.dispatchEvent(new CustomEvent('mobile-nav-open'))
  }

  return (
    <div className="topbar">
      <button className="hamburger" onClick={openNav} aria-label="Open menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      <div className="search">
        <Icon name="search" size={18}/>
        <input placeholder="Search recipes, ingredients…"/>
      </div>

      <div className="top-icons">
        {links.map(l => {
          const iconEl = <Icon name={l.icon_name || 'link'} size={18}/>
          const title = l.label || 'Configure in Settings → Header Links'
          if (l.url && l.url.trim()) {
            return (
              <a
                key={l.id}
                href={l.url}
                target={l.open_in_new_tab ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="icn-btn"
                title={title}
              >
                {iconEl}
              </a>
            )
          }
          return (
            <Link key={l.id} to="/settings" className="icn-btn" title={`${title} — click to configure`}>
              {iconEl}
            </Link>
          )
        })}
        <div className="icn-btn" title="Notifications (coming soon)">
          <Icon name="bell" size={18}/>
          <span className="dot"/>
        </div>
        <div className="avatar">
          <img src="/assets/lily-portrait.png" alt="Lily"/>
        </div>
      </div>
    </div>
  )
}
