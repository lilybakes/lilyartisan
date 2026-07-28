import { useRef, useState } from 'react'
import { initials } from '../lib/costing'
import { Icon } from '../lib/icons.jsx'
import ImageLightbox from './ImageLightbox.jsx'

/**
 * A rounded-square identity chip used across the app.
 * - Shows `item.image_url` if set, otherwise a colored background with initials.
 * - If it has an image, clicking opens a lightbox to view full size.
 * - If `uploadable` and empty, clicking opens the file picker.
 * - If `uploadable` and has an image, the lightbox shows Replace / Remove buttons.
 */
export default function Chip({ item, size = 32, color, uploadable = false, onUpload, onRemove }) {
  const fileRef = useRef(null)
  const [showLightbox, setShowLightbox] = useState(false)

  const bg = color || item?.color || '#7367f0'
  const radius = size >= 40 ? 10 : 8
  const fontSize = size < 40 ? 13 : Math.round(size * 0.34)
  const iconSize = Math.max(12, Math.round(size * 0.34))
  const hasImage = !!item?.image_url
  const isClickable = uploadable || hasImage

  const wrapperStyle = {
    width: size,
    height: size,
    background: hasImage ? '#f0eef8' : bg,
    fontSize,
    borderRadius: radius,
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
    cursor: isClickable ? 'pointer' : 'default',
  }

  const inner = hasImage
    ? <img src={item.image_url} alt="" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
    : initials(item?.name || '')

  function handleClick() {
    if (!isClickable) return
    if (hasImage) setShowLightbox(true)
    else fileRef.current?.click()
  }

  function handleReplace() {
    setShowLightbox(false)
    // Small delay so the modal close doesn't swallow the picker open
    setTimeout(() => fileRef.current?.click(), 100)
  }

  async function handleRemove() {
    if (!confirm('Remove this photo?')) return
    setShowLightbox(false)
    if (onRemove) await onRemove()
  }

  async function onFile(e) {
    const f = e.target.files?.[0]
    if (f && onUpload) await onUpload(f)
    if (e.target) e.target.value = ''
  }

  const classNames = ['row-chip']
  if (isClickable) classNames.push('clickable')
  if (uploadable && !hasImage) classNames.push('uploadable')

  const title = hasImage
    ? 'Click to view full size'
    : (uploadable ? 'Click to add photo' : undefined)

  return (
    <>
      <div
        className={classNames.join(' ')}
        style={wrapperStyle}
        onClick={handleClick}
        title={title}
      >
        {inner}
        {uploadable && !hasImage && (
          <div className="cam-overlay">
            <Icon name="camera" size={iconSize}/>
          </div>
        )}
        {uploadable && (
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile}/>
        )}
      </div>
      {showLightbox && (
        <ImageLightbox
          src={item.image_url}
          alt={item?.name || ''}
          onClose={() => setShowLightbox(false)}
          onReplace={uploadable && onUpload ? handleReplace : null}
          onRemove={uploadable && onRemove ? handleRemove : null}
        />
      )}
    </>
  )
}
