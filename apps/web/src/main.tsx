import { createRouter, RouterProvider } from '@tanstack/react-router'
import { Activity, lazy, StrictMode, Suspense, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { AuthDialogProvider } from './components/auth/auth-dialog'
import { Toaster } from './components/ui/sonner'
// biome-ignore lint: false positive
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider'
import { useSession } from './lib/auth-client'

import { routeTree } from './routeTree.gen'
import './styles.css'
import { config } from '@repo/config'
import { NotFound } from './components/not-found'

// Lazy load devtools only when needed
const TanStackDevtools = lazy(() =>
  import('@tanstack/react-devtools').then((m) => ({ default: m.TanStackDevtools })),
)
const ReactQueryDevtoolsPanel = lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtoolsPanel })),
)
const TanStackRouterDevtoolsPanel = lazy(() =>
  import('@tanstack/react-router-devtools').then((m) => ({
    default: m.TanStackRouterDevtoolsPanel,
  })),
)

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
    auth: {
      isAuthenticated: false,
      user: null,
    },
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFound,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const session = useSession()

  // Show loading screen ONLY on initial load, not on refetches
  // isPending = no cached data, isFetching = any fetch happening
  // We only want to show loading when there's no data at all (initial load)
  const isInitialLoading = session.isPending && session.data === undefined

  // Use ref to create stable auth context that only changes when user ID changes
  // This prevents router re-renders when session refetches with same data
  const user = session.data?.user ?? null
  const authRef = useRef({ isAuthenticated: false, user: null as typeof user })

  // Only update auth ref when user ID actually changes (login/logout)
  if (authRef.current.user?.id !== user?.id) {
    authRef.current = { isAuthenticated: !!user, user }
  }

  const auth = authRef.current

  if (isInitialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      </div>
    )
  }

  return (
    <>
      <RouterProvider context={{ ...TanStackQueryProviderContext, auth }} router={router} />
      <Toaster />
      <Activity mode={config.devtools.enabled ? 'visible' : 'hidden'}>
        <Suspense fallback={null}>
          <TanStackDevtools
            plugins={[
              {
                name: 'TanStack Query',
                render: <ReactQueryDevtoolsPanel />,
                defaultOpen: false,
              },
              {
                name: 'TanStack Router',
                render: <TanStackRouterDevtoolsPanel router={router} />,
                defaultOpen: false,
              },
            ]}
          />
        </Suspense>
      </Activity>
    </>
  )
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <AuthDialogProvider>
          <InnerApp />
        </AuthDialogProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}
