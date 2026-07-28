import { Icon } from '../lib/icons.jsx'

export default function Topbar() {
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
        <div className="avatar">
          <img src="/assets/lily-portrait.png" alt="Lily" />
        </div>
      </div>
    </div>
  )
}
