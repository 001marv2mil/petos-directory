import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/context/AuthContext'
import { PageShell } from '@/components/layout/PageShell'
import HomePage from '@/pages/HomePage'
import SearchPage from '@/pages/SearchPage'
import CityPage from '@/pages/CityPage'
import CategoryPage from '@/pages/CategoryPage'
import ProviderPage from '@/pages/ProviderPage'
import StatePage from '@/pages/StatePage'
import PrivacyPage from '@/pages/PrivacyPage'
import AccountPage from '@/pages/AccountPage'
import ClaimPage from '@/pages/ClaimPage'
import BusinessDashboardPage from '@/pages/BusinessDashboardPage'
import AdminClaimsPage from '@/pages/AdminClaimsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import FaqPage from '@/pages/FaqPage'
import CostCalculatorPage from '@/pages/CostCalculatorPage'
import EmergencyVetReportPage from '@/pages/EmergencyVetReportPage'
import ScrollToTop from '@/components/common/ScrollToTop'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<PageShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/calculator" element={<CostCalculatorPage />} />
            <Route path="/reports/emergency-vet-access-2026" element={<EmergencyVetReportPage />} />
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
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}