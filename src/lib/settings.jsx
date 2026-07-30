import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useAuth } from './auth.jsx'

const DEFAULTS = {
  owner_name: 'User',
  business_name: 'My Bakery',
  currency: 'RM',
  default_target_food_cost_pct: 28,
  app_name: 'Baker|Nomics',
  logo_data_url: null,
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  // useAuth() may return null if this provider is mounted above AuthProvider,
  // so guard defensively.
  const auth = useAuth()
  const userId = auth?.session?.user?.id ?? null

  const [settings, setSettings] = useState(DEFAULTS)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) { setSettings(DEFAULTS); setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) console.error('[settings load]', error)
    if (data) setSettings({ ...DEFAULTS, ...data })
    else setSettings(DEFAULTS)
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const updateSettings = async (patch) => {
    if (!userId) return
    const { data, error } = await supabase
      .from('settings')
      .update(patch)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) { alert(error.message); return }
    if (data) setSettings(prev => ({ ...prev, ...data }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading, refresh: load }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
