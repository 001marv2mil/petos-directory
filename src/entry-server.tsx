import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import type { HelmetServerState } from 'react-helmet-async'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PageShell } from '@/components/layout/PageShell'
import HomePage from '@/pages/HomePage'
import SearchPage from '@/pages/SearchPage'
import CityPage from '@/pages/CityPage'
import CategoryPage from '@/pages/CategoryPage'
import ProviderPage from '@/pages/ProviderPage'
import StatePage from '@/pages/StatePage'
import PrivacyPage from '@/pages/PrivacyPage'
import EmergencyVetReportPage from '@/pages/EmergencyVetReportPage'
import NotFoundPage from '@/pages/NotFoundPage'

type SSRHelmetContext = { helmet?: HelmetServerState }

export function render(url: string) {
  const helmetContext: SSRHelmetContext = {}
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <StaticRouter location={url}>
          <AuthProvider>
            <Routes>
              <Route element={<PageShell />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/:state" element={<StatePage />} />
                <Route path="/:state/:city" element={<CityPage />} />
                <Route path="/:state/:city/:category" element={<CategoryPage />} />
                <Route path="/provider/:slug" element={<ProviderPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/reports/emergency-vet-access-2026" element={<EmergencyVetReportPage />} />
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </AuthProvider>
        </StaticRouter>
      </QueryClientProvider>
    </HelmetProvider>
  )

  return { html, helmet: helmetContext.helmet as HelmetServerState | undefined }
}
