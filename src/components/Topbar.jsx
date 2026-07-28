import { Icon } from '../lib/icons.jsx'
import { useSettings } from '../lib/settings.jsx'
import { initials } from '../lib/costing'

export default function Topbar() {
  const { settings } = useSettings()
  return (
    <div className="topbar">
      <div className="search">
        <Icon name="search" size={18}/>
        <input placeholder="Search recipes, ingredients…"/>
      </div>
      <div className="top-icons">
        <div className="icn-btn"><Icon name="globe" size={18}/></div>
        <div className="icn-btn"><Icon name="grid" size={18}/></div>
        <div className="icn-btn"><Icon name="bell" size={18}/><span className="dot"/></div>
        <div className="avatar">{initials(settings.owner_name || 'Lily')}</div>
      </div>
    </div>
  )
}
