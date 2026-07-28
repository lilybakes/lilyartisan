import { Link } from 'react-router-dom'
import { Icon } from '../lib/icons.jsx'
import { useTable } from '../lib/data'

export default function Topbar() {
  const { rows: links } = useTable('header_links', 'position')

  return (
    <div className="topbar">
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
          // Not configured yet: link to settings so it's discoverable.
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
