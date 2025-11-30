import { createFileRoute } from '@tanstack/react-router'
import { useUsers, useHealth } from '../lib/api'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers()
  const { data: health } = useHealth()

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">underdog Template</h1>
          <p className="text-zinc-400">Hono + TanStack Router + React Query</p>
          {health && (
            <p className="text-xs text-zinc-500 mt-2">
              API Status: {health.status}
            </p>
          )}
        </header>

        <main>
          <h2 className="text-xl font-semibold mb-4">Users</h2>

          {usersLoading && (
            <p className="text-zinc-400">Loading users...</p>
          )}

          {usersError && (
            <p className="text-red-400">Error loading users</p>
          )}

          {users && (
            <ul className="space-y-3">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-4 bg-zinc-900 rounded-lg border border-zinc-800"
                >
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-zinc-400">{user.email}</p>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  )
}
