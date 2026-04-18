import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { usePets } from '@/hooks/usePets'
import { MyPets } from '@/components/pets/MyPets'
import { PageMeta } from '@/components/common/PageMeta'
import { Heart, Bell, LogOut, User } from 'lucide-react'

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const { pets } = usePets()

  if (!user) return <Navigate to="/" replace />

  const displayName = user.email?.split('@')[0] ?? 'there'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <PageMeta
        title="My Account — PetOS Directory"
        description="Manage your pets, favorites, and alerts on PetOS Directory."
        path="/account"
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Hey, {displayName} 👋</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>

      {/* My Pets */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <MyPets />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/search"
          className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all group"
        >
          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm group-hover:text-blue-700 transition-colors">Favorites</p>
            <p className="text-xs text-gray-400">Browse saved providers</p>
          </div>
        </Link>

        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4">
          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Alerts</p>
            <p className="text-xs text-gray-400">
              {pets.length > 0 ? `Active for ${pets.length} pet${pets.length > 1 ? 's' : ''}` : 'Set up city alerts'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
