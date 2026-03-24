import { Link } from 'react-router-dom'
import { PawPrint, AlertCircle, LogIn, LogOut, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function Header() {
  const { user, signOut, openModal } = useAuth()

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PetOS</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Find Care
            </Link>
            <Link
              to="/search?category=emergency_vets"
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition-colors font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              Emergency Vets
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/account"
                  className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-700 transition-colors font-medium"
                >
                  <User className="w-3.5 h-3.5" />
                  {user.email?.split('@')[0]}
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => openModal('default')}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </button>
            )}

            {/* PetOS Health official partner */}
            <a
              href="https://petoshealth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex flex-col items-center px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors leading-tight"
            >
              <span className="text-[9px] font-semibold uppercase tracking-widest opacity-70">Official Partner</span>
              <span className="text-sm font-bold">PetOS Health</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
