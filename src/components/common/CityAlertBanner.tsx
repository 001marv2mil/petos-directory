import { useAuth } from '@/context/AuthContext'
import { Bell } from 'lucide-react'

interface Props {
  city: string
  category?: string
}

export function CityAlertBanner({ city, category }: Props) {
  const { user, openModal } = useAuth()

  if (user) return null

  const label = category
    ? `new ${category.toLowerCase()} listings in ${city}`
    : `new pet care providers in ${city}`

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm">
      <Bell className="w-4 h-4 text-amber-600 shrink-0" />
      <p className="text-amber-800 flex-1">
        <span className="font-semibold">Get notified</span> when {label} are added to PetOS Directory.
      </p>
      <button
        onClick={() => openModal('alert')}
        className="shrink-0 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors"
      >
        Sign up for alerts
      </button>
    </div>
  )
}
