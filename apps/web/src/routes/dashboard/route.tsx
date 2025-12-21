import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardBreadcrumb } from '@/components/dashboard-breadcrumb'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/dashboard')({
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
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mr-2 h-4" orientation="vertical" />
          <DashboardBreadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
