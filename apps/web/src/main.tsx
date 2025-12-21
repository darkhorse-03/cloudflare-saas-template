import { config } from '@repo/config'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/router-devtools'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AuthDialogProvider } from './components/auth/auth-dialog'
// biome-ignore lint: false positive
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider'
import { useSession } from './lib/auth-client'

import { routeTree } from './routeTree.gen'
import './styles.css'

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
  // biome-ignore lint: false positive
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
      {config.devtools.enabled && (
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
      )}
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
