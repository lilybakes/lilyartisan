import { initials } from '../lib/costing'
import { Icon } from '../lib/icons.jsx'

/**
 * A rounded-square identity chip used across the app.
 * - Shows `item.image_url` if set, otherwise a colored background with the initials.
 * - Pass `uploadable={true}` + `onUpload` to make it click-to-upload.
 */
export default function Chip({ item, size = 32, color, uploadable = false, onUpload }) {
  const bg = color || item?.color || '#7367f0'
  const radius = size >= 40 ? 10 : 8
  const fontSize = size < 40 ? 13 : Math.round(size * 0.34)

  const wrapperStyle = {
    width: size,
    height: size,
    background: item?.image_url ? '#f0eef8' : bg,
    fontSize,
    borderRadius: radius,
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
  }

  const inner = item?.image_url
    ? <img src={item.image_url} alt="" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
    : initials(item?.name || '')

  if (!uploadable) {
    return <div className="row-chip" style={wrapperStyle}>{inner}</div>
  }

  async function onFile(e) {
    const f = e.target.files?.[0]
    if (f && onUpload) await onUpload(f)
    if (e.target) e.target.value = ''
  }

  const iconSize = Math.max(12, Math.round(size * 0.34))

  return (
    <label className="row-chip uploadable" style={{...wrapperStyle, cursor:'pointer'}} title="Click to upload / change photo">
      {inner}
      <div className="cam-overlay">
        <Icon name="camera" size={iconSize}/>
      </div>
      <input type="file" accept="image/*" hidden onChange={onFile}/>
    </label>
  )
}
