import { useEffect, useRef, useState } from 'react'
import { Icon, ICON_NAMES } from '../lib/icons.jsx'

export default function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onDoc = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  return (
    <div className="icon-picker-wrap" ref={wrapRef}>
      <button type="button" className="icon-picker-btn" onClick={() => setOpen(o => !o)}>
        <Icon name={value} size={18}/>
        <span style={{fontSize:10, color:'var(--muted)'}}>▾</span>
      </button>
      {open && (
        <div className="icon-picker-popover">
          {ICON_NAMES.map(name => (
            <button
              key={name}
              type="button"
              className={value === name ? 'active' : ''}
              onClick={() => { onChange(name); setOpen(false) }}
              title={name}
            >
              <Icon name={name} size={16}/>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
