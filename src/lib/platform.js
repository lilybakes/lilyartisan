import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'

/**
 * Fetches platform_settings once on mount.
 * Returns the raw row so consumers can read whichever fields they care about.
 *
 * Fields of interest:
 *   signups_enabled       — Signup page checks this
 *   maintenance_mode      — MaintenanceGate checks this
 *   maintenance_message   — shown on the maintenance page
 *   announcement_enabled  — AnnouncementBanner checks this
 *   announcement_message  — banner content
 *   announcement_severity — 'info' | 'warning' | 'critical'
 */
export function usePlatformStatus() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchIt = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
    setStatus(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchIt() }, [fetchIt])

  return { status, loading, refresh: fetchIt }
}
