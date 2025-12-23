import { createRouter, RouterProvider } from '@tanstack/react-router'
import { lazy, StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { AuthDialogProvider } from './components/auth/auth-dialog'
// biome-ignore lint: false positive
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider'
import { useSession } from './lib/auth-client'

import { routeTree } from './routeTree.gen'
import './styles.css'

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
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const session = useSession()

  // Show loading screen while checking session
  if (session.isPending) {
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
      <RouterProvider
        context={{
          ...TanStackQueryProviderContext,
          auth: {
            isAuthenticated: !!session.data?.user,
            user: session.data?.user ?? null,
          },
        }}
        router={router}
      />
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
