import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { AuthDialog } from '@/components/auth/auth-dialog'
import type { AuthContext } from '@/types/auth'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <AuthDialog />
    </>
  ),
})
