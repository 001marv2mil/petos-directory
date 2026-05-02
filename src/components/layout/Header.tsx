import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { PawPrint, AlertCircle, LogOut, User, Briefcase, ChevronDown, Shield } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'

export function Header() {
  const { user, signOut, openModal } = useAuth()
  const [ownsBusinesses, setOwnsBusinesses] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user?.email) { setOwnsBusinesses(false); return }
    let cancelled = false
    supabase
      .from('providers')
      .select('id', { count: 'exact', head: true })
      .ilike('claimed_by_email', user.email)
      .then(({ count }) => {
        if (!cancelled) setOwnsBusinesses((count ?? 0) > 0)
      })
    return () => { cancelled = true }
  }, [user?.email])

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  // Close menu on Escape
  useEffect(() => {
    if (!menuOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  const isAdmin = isAdminEmail(user?.email)
  const initials = user?.email
    ? user.email.split('@')[0].slice(0, 2).toUpperCase()
    : ''

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
              <div className="relative" ref={menuRef}>
                {/* Avatar trigger button */}
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                  >
                    {/* Identity header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        to="/account"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        role="menuitem"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        Your account
                      </Link>

                      {ownsBusinesses && (
                        <Link
                          to="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          role="menuitem"
                        >
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          Business dashboard
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                          role="menuitem"
                        >
                          <Shield className="w-4 h-4 text-amber-500" />
                          Admin
                        </Link>
                      )}
                    </div>

                    {/* Sign out — separated by border */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => { setMenuOpen(false); signOut() }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4 text-gray-400" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openModal('default')}
                className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-700 transition-colors"
              >
                Sign in
              </button>
            )}


          </div>
        </div>
      </div>
    </header>
  )
}
