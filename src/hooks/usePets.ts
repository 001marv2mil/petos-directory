import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export interface Pet {
  id: string
  user_id: string
  name: string
  type: string
  breed: string | null
  birthday: string | null
  created_at: string
}

export function usePets() {
  const { user } = useAuth()
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)

  const fetch = useCallback(async () => {
    if (!user) { setPets([]); return }
    setLoading(true)
    const { data } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
    setPets((data ?? []) as Pet[])
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const addPet = useCallback(async (pet: { name: string; type: string; breed?: string; birthday?: string }) => {
    if (!user) return
    const { data, error } = await supabase
      .from('pets')
      .insert({ ...pet, user_id: user.id })
      .select()
      .single()
    if (!error && data) setPets(prev => [...prev, data as Pet])
    return error
  }, [user])

  const deletePet = useCallback(async (id: string) => {
    await supabase.from('pets').delete().eq('id', id)
    setPets(prev => prev.filter(p => p.id !== id))
  }, [])

  return { pets, loading, addPet, deletePet, refetch: fetch }
}
