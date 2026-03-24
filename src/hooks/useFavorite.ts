import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'

export function useFavorite(providerId: string) {
  const { user, openModal } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user || !providerId) { setIsFavorited(false); return }

    supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider_id', providerId)
      .maybeSingle()
      .then(({ data }) => setIsFavorited(!!data))
  }, [user, providerId])

  const toggle = useCallback(async (e?: React.MouseEvent) => {
    e?.stopPropagation()
    e?.preventDefault()

    if (!user) {
      openModal('favorite')
      return
    }

    setLoading(true)
    if (isFavorited) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('provider_id', providerId)
      setIsFavorited(false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, provider_id: providerId })
      setIsFavorited(true)
    }
    setLoading(false)
  }, [user, providerId, isFavorited, openModal])

  return { isFavorited, toggle, loading }
}
