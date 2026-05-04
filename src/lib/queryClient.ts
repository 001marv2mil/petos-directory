import { QueryClient, hydrate } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

// Hydrate from SSR-dehydrated state if available
if (typeof window !== 'undefined' && (window as any).__REACT_QUERY_STATE__) {
  hydrate(queryClient, (window as any).__REACT_QUERY_STATE__)
  delete (window as any).__REACT_QUERY_STATE__
}
