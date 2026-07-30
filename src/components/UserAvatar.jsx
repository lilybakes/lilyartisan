import { useAuth } from '../lib/auth.jsx'
import { useSettings } from '../lib/settings.jsx'
import { usePersonalization } from '../lib/personalization.jsx'
import { initials, colorFromSeed } from '../lib/initials.js'

export default function UserAvatar({ size = 34, showRing = true }) {
  const { user } = useAuth() || {}
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const { avatar_url } = usePersonalization()

  const name       = settings.owner_name || user?.email?.split('@')[0] || ''
  const seed       = user?.id || user?.email || ''
  const showImage  = !!avatar_url
  const displayInitials = initials(name)
  const bgColor    = colorFromSeed(seed)

  const style = {
    width: size,
    height: size,
    ...(showImage ? {} : { background: bgColor }),
  }

  return (
    <div
      className={'avatar' + (showRing ? ' avatar-ring' : '') + (showImage ? ' avatar-photo' : ' avatar-initials')}
      style={style}
      title={name}
    >
      {showImage ? (
        <img src={avatar_url} alt={name}/>
      ) : (
        <span style={{fontSize: Math.round(size * 0.42), fontWeight: 700, color: '#fff', letterSpacing: 0.3}}>
          {displayInitials}
        </span>
      )}
    </div>
  )
}
