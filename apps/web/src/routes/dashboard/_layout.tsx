import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/dashboard/_layout')({
  beforeLoad: async () => {
    const { data, error } = await authClient.getSession()

    if (error || !data?.user) {
      throw redirect({
        to: '/',
        search: {
          redirect: '/dashboard',
        },
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </div>
    </div>
  )
}
