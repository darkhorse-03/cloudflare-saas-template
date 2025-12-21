import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { AuthDialogProvider } from '@/components/auth/auth-dialog'

// biome-ignore lint: false positive
interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <AuthDialogProvider>
      <Outlet />
    </AuthDialogProvider>
  ),
})
