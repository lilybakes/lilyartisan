import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Gallery() {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [flash, setFlash]       = useState(null)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('hero_gallery').select('*').order('position')
    if (error) console.error(error)
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function ok(msg)  { setFlash({ type:'ok',  msg }); setTimeout(() => setFlash(null), 2500) }
  function err(msg) { setFlash({ type:'err', msg }); setTimeout(() => setFlash(null), 4000) }

  async function upload(file) {
    if (!file) return
    setUploading(true)
    try {
      const ext = file.name.split('.').pop() || 'png'
      const path = `gallery/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('lilyartisan-images')
        .upload(path, file, { upsert: true, cacheControl: '3600' })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('lilyartisan-images').getPublicUrl(path)
      const maxPos = items.reduce((m, i) => Math.max(m, i.position), 0)
      const { error } = await supabase.from('hero_gallery').insert({
        image_url: urlData.publicUrl,
        label: file.name.replace(/\.[^.]+$/, ''),
        position: maxPos + 1,
      })
      if (error) throw error
      await load()
      ok('Gallery item added.')
    } catch (e) {
      err(e.message)
    } finally {
      setUploading(false)
    }
  }

  async function toggle(id, current) {
    try {
      const { error } = await supabase.from('hero_gallery').update({ active: !current }).eq('id', id)
      if (error) throw error
      await load()
    } catch (e) { err(e.message) }
  }

  async function updateLabel(id, label) {
    try {
      const { error } = await supabase.from('hero_gallery').update({ label }).eq('id', id)
      if (error) throw error
    } catch (e) { err(e.message) }
  }

  async function remove(id, label) {
    if (!confirm(`Remove "${label || 'this item'}" from the gallery? Users who already picked it will keep it (the URL stays valid).`)) return
    try {
      const { error } = await supabase.from('hero_gallery').delete().eq('id', id)
      if (error) throw error
      await load()
      ok('Removed.')
    } catch (e) { err(e.message) }
  }

  async function move(i, dir) {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const a = items[i], b = items[j]
    try {
      await supabase.from('hero_gallery').update({ position: b.position }).eq('id', a.id)
      await supabase.from('hero_gallery').update({ position: a.position }).eq('id', b.id)
      await load()
    } catch (e) { err(e.message) }
  }

  return (
    <div className="panel">
      <div className="panel-head">
        <div>
          <h3>Hero Image Gallery</h3>
          <p className="sub">The image bank users can pick from on their Personalize page. Includes 3 seeded defaults — add or remove any.</p>
        </div>
        <label className={'primary' + (uploading ? '' : '')} style={{cursor:'pointer', display:'inline-flex', alignItems:'center', padding:'9px 18px', borderRadius:8, background:'var(--accent)', color:'#fff', fontSize:13.5, fontWeight:600, boxShadow:'0 3px 8px rgba(115,103,240,0.28)'}}>
          {uploading ? 'Uploading…' : '+ Upload new'}
          <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploading} hidden
            onChange={(e) => upload(e.target.files?.[0])}/>
        </label>
      </div>

      {flash && <div className={`flash flash-${flash.type}`} style={{marginBottom:14}}>{flash.msg}</div>}

      {loading ? (
        <p className="empty">Loading gallery…</p>
      ) : items.length === 0 ? (
        <p className="empty">No gallery items yet. Upload some.</p>
      ) : (
        <div className="sysgallery-grid">
          {items.map((it, i) => (
            <div key={it.id} className={'sysgallery-card' + (it.active ? '' : ' inactive')}>
              <div className="sysgallery-thumb">
                <img src={it.image_url} alt={it.label || ''}/>
                {!it.active && <div className="sysgallery-inactive-overlay">Hidden</div>}
              </div>
              <div className="sysgallery-body">
                <input
                  className="sysgallery-label-input"
                  defaultValue={it.label || ''}
                  placeholder="Label (internal)"
                  onBlur={(e) => updateLabel(it.id, e.target.value)}
                />
                <div className="sysgallery-meta">
                  Position #{it.position} · {it.image_url.startsWith('/gallery/') ? 'Static default' : 'Uploaded'}
                </div>
                <div className="sysgallery-controls">
                  <button className="edit" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                  <button className="edit" onClick={() => move(i, +1)} disabled={i === items.length - 1}>↓</button>
                  <button className="edit" onClick={() => toggle(it.id, it.active)}>
                    {it.active ? 'Hide' : 'Show'}
                  </button>
                  <button className="ghost" onClick={() => remove(it.id, it.label)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
