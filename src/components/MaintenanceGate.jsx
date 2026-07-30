import { useAuth } from '../lib/auth.jsx'
import { usePlatformStatus } from '../lib/platform.js'
import Maintenance from '../pages/Maintenance.jsx'

/**
 * Wraps the authenticated app.
 *   - If maintenance_mode is on AND user is not sysadmin → show maintenance page
 *   - If maintenance_mode is on AND user IS sysadmin    → show a red banner + normal app
 *   - Otherwise → normal app
 */
export default function MaintenanceGate({ children }) {
  const { isSysadmin } = useAuth() || {}
  const { status, loading } = usePlatformStatus()

  // While loading, don't gate anything — never flash the maintenance page
  if (loading || !status) return children

  const inMaintenance = !!status.maintenance_mode

  if (inMaintenance && !isSysadmin) {
    return <Maintenance message={status.maintenance_message}/>
  }

  if (inMaintenance && isSysadmin) {
    return (
      <>
        <div className="sysadmin-maintenance-strip">
          <strong>⚠ Maintenance mode is ON.</strong> Regular users see the maintenance page. You bypass it. Turn it off in <a href="/app/sysadmin/platform">Sysadmin → Platform</a>.
        </div>
        {children}
      </>
    )
  }

  return children
}
