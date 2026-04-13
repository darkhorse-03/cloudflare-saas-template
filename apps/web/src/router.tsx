import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { routeTree } from './routeTree.gen'
import { NotFound } from './components/not-found'
import type { AuthContext } from './types/auth'

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Prevent refetching when switching tabs (better UX, less API calls)
        refetchOnWindowFocus: false,
        // Prevent refetching when component remounts
        refetchOnMount: false,
        // Prevent refetching on network reconnect (can be annoying during dev)
        refetchOnReconnect: false,
        // Keep data fresh for 5 minutes
        staleTime: 300_000, // 5 * 60 * 1000
        // Cache data for 10 minutes (longer than staleTime)
        gcTime: 600_000, // 10 * 60 * 1000
        // Retry failed requests once (good for transient errors)
        retry: 1,
      },
    },
  })

  // Default auth context for SSR/prerendering (not authenticated)
  const auth: AuthContext = {
    isAuthenticated: false,
    user: null,
  }

  const router = createRouter({
    routeTree,
    context: { queryClient, auth },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFound,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
