export default function SysadminPlaceholder({ title, description, comingIn = 'Delta 3' }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>{title}</h3>
          <p className="sub">{description}</p>
        </div>
      </div>
      <div className="sysadmin-placeholder">
        <div className="sysadmin-placeholder-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 3"/>
          </svg>
        </div>
        <div className="sysadmin-placeholder-title">Coming in {comingIn}</div>
        <div className="sysadmin-placeholder-desc">
          This module is scaffolded and will be built next. The navigation, guards,
          and route are all in place — we're just filling in the interface.
        </div>
      </div>
    </div>
  )
}
