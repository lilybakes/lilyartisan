import { useEffect } from 'react'
import { Icon } from '../lib/icons.jsx'

/**
 * Full-screen image viewer.
 * - Renders the image at its natural aspect ratio, capped to 90vw / 90vh.
 * - Esc key or backdrop click closes.
 * - Optional Replace/Remove buttons (shown only if callbacks are provided).
 */
export default function ImageLightbox({ src, alt, onClose, onReplace, onRemove }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onEsc)
    // Prevent background scroll while open
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={alt || 'Image viewer'}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        <Icon name="x" size={20}/>
      </button>
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt || ''}/>
        {(onReplace || onRemove) && (
          <div className="lightbox-actions">
            {onReplace && (
              <button className="lightbox-btn primary" onClick={onReplace}>
                <Icon name="camera" size={14}/> Replace photo
              </button>
            )}
            {onRemove && (
              <button className="lightbox-btn ghost" onClick={onRemove}>
                <Icon name="trash" size={14}/> Remove photo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
