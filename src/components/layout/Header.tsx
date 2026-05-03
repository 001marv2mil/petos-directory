import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { PawPrint, AlertCircle, LogOut, User, Briefcase, ChevronDown, Shield, Search, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { isAdminEmail } from '@/lib/admin'

export function Header() {
  const { user, signOut, openModal } = useAuth()
  const [ownsBusinesses, setOwnsBusinesses] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
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
    <header className="bg-white border-b border-gray-200/60 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-8 h-8 bg-emerald-700 rounded-lg flex items-center justify-center">
                <PawPrint className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-gray-900 tracking-tight">PetOS</span>
                <span className="text-xs font-medium text-gray-400 hidden sm:inline">Directory</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link to="/search" className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors font-medium">
                <Search className="w-3.5 h-3.5" />
                Find Care
              </Link>
              <Link
                to="/search?category=emergency_vets"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Emergency
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    </div>

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
                className="px-4 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Sign in
              </button>
            )}

            <button
              onClick={() => setMobileNavOpen(o => !o)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link
              to="/search"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
            >
              <Search className="w-4 h-4 text-gray-400" />
              Find Care
            </Link>
            <Link
              to="/search?category=emergency_vets"
              onClick={() => setMobileNavOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium"
            >
              <AlertCircle className="w-4 h-4" />
              Emergency Vets
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
