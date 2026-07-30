import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth.jsx'
import { useSettings } from '../lib/settings.jsx'
import { usePersonalization } from '../lib/personalization.jsx'
import { initials, colorFromSeed } from '../lib/initials.js'
import HeroImage from '../components/HeroImage.jsx'
import UserAvatar from '../components/UserAvatar.jsx'

export default function Personalize() {
  const { user } = useAuth() || {}
  const settingsCtx = useSettings() || {}
  const settings = settingsCtx.settings || {}
  const { hero_mode, hero_url, avatar_url, update } = usePersonalization()

  const [gallery, setGallery] = useState([])
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [flash, setFlash] = useState(null)

  // Load gallery items
  useEffect(() => {
    supabase.from('hero_gallery')
      .select('*')
      .eq('active', true)
      .order('position')
      .then(({ data }) => setGallery(data || []))
  }, [])

  function ok(msg)  { setFlash({ type: 'ok',  msg }); setTimeout(() => setFlash(null), 2500) }
  function err(msg) { setFlash({ type: 'err', msg }); setTimeout(() => setFlash(null), 4000) }

  async function safeCall(fn) {
    try { await fn() } catch (e) { err(e.message || String(e)) }
  }

  // ---------- HERO ----------
  async function uploadHero(file) {
    if (!file || !user?.id) return
    setUploadingHero(true)
    try {
      const ext = file.name.split('.').pop() || 'png'
      const path = `${user.id}/hero/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('lilyartisan-images')
        .upload(path, file, { upsert: true, cacheControl: '3600' })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('lilyartisan-images').getPublicUrl(path)
      await update({ hero_mode: 'custom', hero_url: urlData.publicUrl })
      ok('Hero image updated.')
    } catch (e) {
      err(e.message)
    } finally {
      setUploadingHero(false)
    }
  }
  const pickHeroGallery = (img) => safeCall(async () => {
    await update({ hero_mode: 'gallery', hero_url: img.image_url })
    ok(`Set to "${img.label || 'gallery image'}".`)
  })
  const resetHeroToDefault = () => safeCall(async () => { await update({ hero_mode: 'default', hero_url: null }); ok('Reset to default.') })
  const clearHero          = () => safeCall(async () => { await update({ hero_mode: 'none',    hero_url: null }); ok('Hero image removed.') })

  // ---------- AVATAR ----------
  async function uploadAvatar(file) {
    if (!file || !user?.id) return
    setUploadingAvatar(true)
    try {
      const ext = file.name.split('.').pop() || 'png'
      const path = `${user.id}/avatar/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('lilyartisan-images')
        .upload(path, file, { upsert: true, cacheControl: '3600' })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from('lilyartisan-images').getPublicUrl(path)
      await update({ avatar_url: urlData.publicUrl })
      ok('Profile picture updated.')
    } catch (e) {
      err(e.message)
    } finally {
      setUploadingAvatar(false)
    }
  }
  const clearAvatar = () => safeCall(async () => { await update({ avatar_url: null }); ok('Reset to initials.') })

  const displayName    = settings.owner_name || user?.email?.split('@')[0] || ''
  const initialsPreview = initials(displayName)
  const bgColor         = colorFromSeed(user?.id || '')

  return (
    <>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Personalize</h3>
            <p className="sub">Your dashboard hero and profile picture. Only you see the changes.</p>
          </div>
        </div>

        {flash && <div className={`flash flash-${flash.type}`} style={{marginBottom:14}}>{flash.msg}</div>}

        {/* ============ HERO ============ */}
        <div className="admin-section">
          <h4>Dashboard hero image</h4>
          <p style={{margin:'0 0 16px', color:'var(--ink-soft)', fontSize:13.5, lineHeight:1.5}}>
            The character on the right side of "Welcome back" on your dashboard.
          </p>

          <div className="personalize-preview">
            <div style={{
              position:'relative',
              width:'100%', maxWidth:400, height:220,
              margin:'0 auto',
              background:'#fff',
              borderRadius:12,
              border:'1px solid var(--line)',
              overflow:'hidden',
            }}>
              <HeroImage/>
            </div>
            <div style={{fontSize:12, color:'var(--muted)', textAlign:'center', marginTop:8}}>
              Live preview — matches your dashboard
            </div>
          </div>

          <div className="personalize-actions">
            <label className={'personalize-btn personalize-btn-primary' + (uploadingHero ? ' loading' : '')}>
              {uploadingHero ? 'Uploading…' : '📷 Upload your own'}
              <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploadingHero}
                onChange={(e) => uploadHero(e.target.files?.[0])} hidden/>
            </label>
            <button className="personalize-btn" onClick={resetHeroToDefault} disabled={hero_mode === 'default'}>
              Use default
            </button>
            <button className="personalize-btn personalize-btn-danger" onClick={clearHero} disabled={hero_mode === 'none'}>
              Show blank
            </button>
          </div>

          {gallery.length > 0 && (
            <div style={{marginTop:24}}>
              <h5 style={{margin:'0 0 12px', fontSize:12.5, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.4px'}}>
                Or pick from the gallery
              </h5>
              <div className="gallery-grid">
                {gallery.map(item => {
                  const selected = hero_mode === 'gallery' && hero_url === item.image_url
                  return (
                    <button
                      key={item.id}
                      className={'gallery-item' + (selected ? ' selected' : '')}
                      onClick={() => pickHeroGallery(item)}
                      title={item.label || ''}
                    >
                      <img src={item.image_url} alt={item.label || ''}/>
                      {selected && <div className="gallery-item-check">✓</div>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* ============ AVATAR ============ */}
        <div className="admin-section">
          <h4>Profile picture</h4>
          <p style={{margin:'0 0 16px', color:'var(--ink-soft)', fontSize:13.5, lineHeight:1.5}}>
            Shown in the top-right corner. If you don't upload one, your initials appear on an on-brand color.
          </p>

          <div className="avatar-preview-row">
            <div className="avatar-preview-slot">
              <div className="avatar-preview-label">Current</div>
              <UserAvatar size={80}/>
            </div>
            {avatar_url && (
              <div className="avatar-preview-slot">
                <div className="avatar-preview-label">Fallback (initials)</div>
                <div className="avatar avatar-initials avatar-ring" style={{width:80, height:80, background:bgColor}}>
                  <span style={{fontSize:34, fontWeight:700, color:'#fff'}}>{initialsPreview}</span>
                </div>
              </div>
            )}
          </div>

          <div className="personalize-actions" style={{marginTop:14}}>
            <label className={'personalize-btn personalize-btn-primary' + (uploadingAvatar ? ' loading' : '')}>
              {uploadingAvatar ? 'Uploading…' : '📷 Upload profile picture'}
              <input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploadingAvatar}
                onChange={(e) => uploadAvatar(e.target.files?.[0])} hidden/>
            </label>
            <button className="personalize-btn personalize-btn-danger" onClick={clearAvatar} disabled={!avatar_url}>
              Remove — use initials
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
