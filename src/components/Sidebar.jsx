import { Link, NavLink } from 'react-router-dom'
import { Icon } from '../lib/icons.jsx'
import { useSettings } from '../lib/settings.jsx'

const NAV = [
  { to:'/',            label:'Dashboard',    icon:'dash',        color:'accent' },
  { to:'/ingredients', label:'Ingredients',  icon:'ingredients', color:'info' },
  { to:'/recipes',     label:'Recipes',      icon:'recipes',     color:'pink' },
  { to:'/bom',         label:'Recipe BOM',   icon:'bom',         color:'warn' },
  { to:'/costing',     label:'Yield & Cost', icon:'costing',     color:'success' },
  { to:'/pricing',     label:'Pricing',      icon:'pricing',     color:'accent' },
  { to:'/inventory',   label:'Inventory',    icon:'inventory',   color:'warn' },
]

export default function Sidebar() {
  const { settings } = useSettings()

  // Wordmark: split on "|" — first part navy, second part violet.
  // Falls back to whole-string single-color if no delimiter present.
  const [markPart1, markPart2] = (settings.app_name || 'Baker|Nomics').split('|')

  // Logo: user-uploaded logo overrides bundled Lily mark.
  const logoSrc = settings.logo_data_url || '/assets/lily-mark-white.png'

  const kicker = (settings.business_name || 'Lily Artisan').toUpperCase()

  return (
    <aside>
      <Link to="/" className="brand" style={{textDecoration:'none', color:'inherit'}}>
        <div className="brand-stamp">
          <img src={logoSrc} alt="" />
        </div>
        <div className="brand-text">
          <div className="brand-wordmark">
            <span className="part1">{markPart1}</span>
            {markPart2 && <span className="part2">{markPart2}</span>}
          </div>
          <div className="brand-kicker">{kicker}</div>
        </div>
      </Link>

      <div className="nav-section">Main</div>
      {NAV.map(n => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/'}
          className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')}
          data-color={n.color}
        >
          <span className="chip"><Icon name={n.icon} size={15}/></span>
          {n.label}
        </NavLink>
      ))}
      <div className="nav-section">System</div>
      <NavLink to="/settings" className={({isActive}) => 'nav-item' + (isActive ? ' active' : '')} data-color="muted">
        <span className="chip"><Icon name="settings" size={15}/></span>
        Settings
      </NavLink>
    </aside>
  )
}
