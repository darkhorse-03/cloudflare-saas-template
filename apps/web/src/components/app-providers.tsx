'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Activity, lazy, Suspense, type ReactNode } from 'react'
import { AuthDialogProvider } from '@/components/auth/auth-dialog'
import { Toaster } from '@/components/ui/sonner'
import { useSession } from '@/lib/auth-client'
import { config } from '@repo/config'

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

function AuthGate({ children }: { children: ReactNode }) {
  const session = useSession()

  // Show loading screen ONLY on initial load, not on refetches
  const isInitialLoading = session.isPending && session.data === undefined

  if (isInitialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}

function Devtools() {
  return (
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
              render: <TanStackRouterDevtoolsPanel />,
              defaultOpen: false,
            },
          ]}
        />
      </Suspense>
    </Activity>
  )
}

export function AppProviders({ children }: { children: ReactNode }) {
  const { queryClient } = useRouteContext({ from: '__root__' })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthDialogProvider>
        <AuthGate>{children}</AuthGate>
        <Toaster />
        <Devtools />
      </AuthDialogProvider>
    </QueryClientProvider>
  )
}
