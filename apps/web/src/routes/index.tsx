import { createFileRoute } from '@tanstack/react-router'
import { Moon, RefreshCw, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useHealth } from '@/hooks/use-health'
import { useTheme } from '@/hooks/use-theme'
import { useUsers } from '@/hooks/use-users'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const {
    data: users,
    isLoading: usersLoading,
    isFetching,
    error: usersError,
    refetch,
  } = useUsers()
  const { data: health } = useHealth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="cursor-pointer">
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">underdog</h1>
          <p className="text-muted-foreground">Hono + TanStack Router + React Query</p>
          {health && (
            <p className="text-xs text-muted-foreground mt-2">API Status: {health.status}</p>
          )}
        </header>

        <main>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="cursor-pointer"
            >
              <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {usersLoading && <p className="text-muted-foreground">Loading users...</p>}

          {usersError && <p className="text-destructive">Error loading users</p>}

          {users && (
            <ul className="space-y-3">
              {users.map((user) => (
                <li key={user.id} className="p-4 bg-card rounded-lg border">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </li>
              ))}
            </ul>
          )}
        </main>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Built with Biome, Turbo, Hono, TanStack Router, shadcn/ui</p>
        </footer>
      </div>
    </div>
  )
}
