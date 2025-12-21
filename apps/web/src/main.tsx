import { createRouter, RouterProvider } from '@tanstack/react-router'
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
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
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
