import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

const DEFAULTS = {
  id: 1,
  owner_name: 'Lily',
  business_name: 'Lily Artisan',
  app_name: 'Baker|Nomics',
  logo_data_url: null,
  currency: 'RM',
  default_target_food_cost_pct: 28,
}

const SettingsContext = createContext({
  settings: DEFAULTS,
  loading: true,
  updateSettings: async () => {},
})

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single()
    if (error) {
      console.warn('Settings load failed, using defaults:', error.message)
      setSettings(DEFAULTS)
    } else {
      setSettings({ ...DEFAULTS, ...data })
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateSettings = async (patch) => {
    const { data, error } = await supabase.from('settings')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', 1).select().single()
    if (error) { alert(error.message); return }
    setSettings(s => ({ ...s, ...data }))
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
