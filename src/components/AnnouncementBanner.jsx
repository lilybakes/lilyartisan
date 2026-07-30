import { useState } from 'react'
import { usePlatformStatus } from '../lib/platform.js'

const SEV_ICON = {
  info:     '💡',
  warning:  '⚠️',
  critical: '🚨',
}

export default function AnnouncementBanner() {
  const { status } = usePlatformStatus()
  const [dismissed, setDismissed] = useState(false)

  if (!status?.announcement_enabled) return null
  if (!status.announcement_message?.trim()) return null
  if (dismissed) return null

  const severity = status.announcement_severity || 'info'

  return (
    <div className={`announcement-banner announcement-${severity}`}>
      <div className="announcement-inner">
        <span className="announcement-icon">{SEV_ICON[severity]}</span>
        <span className="announcement-text">{status.announcement_message}</span>
        <button className="announcement-close" onClick={() => setDismissed(true)} aria-label="Dismiss">✕</button>
      </div>
    </div>
  )
}
