import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} — PetOS Directory` : 'PetOS Directory'
    return () => { document.title = prev }
  }, [title])
}
