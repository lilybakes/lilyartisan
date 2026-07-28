import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

export function useTable(table, orderBy = 'created_at') {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: true })
    if (error) console.error(error)
    setRows(data || [])
    setLoading(false)
  }, [table, orderBy])

  useEffect(() => { refresh() }, [refresh])

  const insert = async (row) => {
    const { data, error } = await supabase.from(table).insert(row).select().single()
    if (error) { alert(error.message); return null }
    setRows(r => [...r, data])
    return data
  }

  const update = async (id, patch) => {
    const { data, error } = await supabase.from(table).update(patch).eq('id', id).select().single()
    if (error) { alert(error.message); return null }
    setRows(r => r.map(x => x.id === id ? data : x))
    return data
  }

  const remove = async (id) => {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) { alert(error.message); return }
    setRows(r => r.filter(x => x.id !== id))
  }

  return { rows, loading, refresh, insert, update, remove }
}

export function useBomLines(recipeId) {
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!recipeId) { setLines([]); setLoading(false); return }
    setLoading(true)
    const { data } = await supabase.from('bom_lines').select('*').eq('recipe_id', recipeId).order('created_at')
    setLines(data || [])
    setLoading(false)
  }, [recipeId])

  useEffect(() => { refresh() }, [refresh])

  const addLine = async (line) => {
    const { data, error } = await supabase.from('bom_lines').insert({ ...line, recipe_id: recipeId }).select().single()
    if (error) { alert(error.message); return }
    setLines(l => [...l, data])
  }

  const removeLine = async (id) => {
    const { error } = await supabase.from('bom_lines').delete().eq('id', id)
    if (error) { alert(error.message); return }
    setLines(l => l.filter(x => x.id !== id))
  }

  return { lines, loading, refresh, addLine, removeLine }
}

export function useInventory() {
  const [rows, setRows] = useState([])
  const refresh = useCallback(async () => {
    const { data } = await supabase.from('inventory').select('*')
    setRows(data || [])
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const setStock = async (ingredient_id, qty) => {
    const { data, error } = await supabase.from('inventory')
      .upsert({ ingredient_id, stock_qty: qty, updated_at: new Date().toISOString() })
      .select().single()
    if (error) { alert(error.message); return }
    setRows(r => {
      const idx = r.findIndex(x => x.ingredient_id === ingredient_id)
      if (idx === -1) return [...r, data]
      const next = [...r]; next[idx] = data; return next
    })
  }
  return { rows, refresh, setStock }
}
