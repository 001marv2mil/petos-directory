import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/context/AuthContext'
import { PageShell } from '@/components/layout/PageShell'
import ScrollToTop from '@/components/common/ScrollToTop'

const HomePage = lazy(() => import('@/pages/HomePage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const CityPage = lazy(() => import('@/pages/CityPage'))
const CategoryPage = lazy(() => import('@/pages/CategoryPage'))
const ProviderPage = lazy(() => import('@/pages/ProviderPage'))
const StatePage = lazy(() => import('@/pages/StatePage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const AccountPage = lazy(() => import('@/pages/AccountPage'))
const ClaimPage = lazy(() => import('@/pages/ClaimPage'))
const BusinessDashboardPage = lazy(() => import('@/pages/BusinessDashboardPage'))
const AdminClaimsPage = lazy(() => import('@/pages/AdminClaimsPage'))
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const FaqPage = lazy(() => import('@/pages/FaqPage'))
const CostCalculatorPage = lazy(() => import('@/pages/CostCalculatorPage'))
const EmergencyVetReportPage = lazy(() => import('@/pages/EmergencyVetReportPage'))
const AvailabilityReportPage = lazy(() => import('@/pages/AvailabilityReportPage'))

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
          <Routes>
            <Route element={<PageShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/calculator" element={<CostCalculatorPage />} />
              <Route path="/reports/emergency-vet-access-2026" element={<EmergencyVetReportPage />} />
              <Route path="/reports/pet-service-availability-2026" element={<AvailabilityReportPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/:state" element={<StatePage />} />
              <Route path="/:state/:city" element={<CityPage />} />
              <Route path="/:state/:city/:category" element={<CategoryPage />} />
              <Route path="/provider/:slug" element={<ProviderPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/:state/:city/faq" element={<FaqPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/claim/:slug" element={<ClaimPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/dashboard" element={<BusinessDashboardPage />} />
              <Route path="/admin/claims" element={<AdminClaimsPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/not-found" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
