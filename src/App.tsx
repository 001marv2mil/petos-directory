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
import CostCalculatorPage from '@/pages/CostCalculatorPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PageShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/calculator" element={<CostCalculatorPage />} />
            <Route path="/:state" element={<StatePage />} />
            <Route path="/:state/:city" element={<CityPage />} />
            <Route path="/:state/:city/:category" element={<CategoryPage />} />
            <Route path="/provider/:slug" element={<ProviderPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/claim/:slug" element={<ClaimPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
