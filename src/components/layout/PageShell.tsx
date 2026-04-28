import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Header } from './Header'
import { Footer } from './Footer'
import { AuthModal } from '@/components/auth/AuthModal'
import { useAuth } from '@/context/AuthContext'

function BrowseTrigger() {
  const { user, openModal } = useAuth()
  const { pathname } = useLocation()
  const viewCount = useRef(0)
  const fired = useRef(false)

  useEffect(() => {
    if (user || fired.current) return
    // Count provider page views
    if (pathname.startsWith('/provider/')) {
      viewCount.current += 1
      if (viewCount.current >= 3) {
        fired.current = true
        setTimeout(() => openModal('browse'), 800)
      }
    }
  }, [pathname, user, openModal])

  return null
}

export function PageShell() {
  const { pathname } = useLocation()
  const canonical = `https://petosdirectory.com${pathname}`

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Helmet>
        <link rel="canonical" href={canonical} />
      </Helmet>
      <Header />
      <BrowseTrigger />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  )
}
