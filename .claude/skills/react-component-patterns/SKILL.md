# React Component Patterns

## TanStack Router File-Based Routing

**Route structure:**
```
apps/web/src/routes/
├── __root.tsx         # Root layout
├── index.tsx          # / route
├── about.tsx          # /about route
└── users/
    ├── index.tsx      # /users route
    └── $id.tsx        # /users/:id route
```

**Route file with loader (recommended):**
```tsx
// apps/web/src/routes/users.tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Layout } from '@/components/layout'

const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: async () => {
    const res = await apiClient.users.$get()
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  },
})

export const Route = createFileRoute('/users')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(usersQueryOptions),
  component: UsersPage,
})

function UsersPage() {
  const { data } = useSuspenseQuery(usersQueryOptions)

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {data.users.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </Layout>
  )
}
```

**Route with params:**
```tsx
// apps/web/src/routes/users/$id.tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Layout } from '@/components/layout'

const userQueryOptions = (id: string) => queryOptions({
  queryKey: ['users', id],
  queryFn: async () => {
    const res = await apiClient.users[':id'].$get({ param: { id } })
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  },
})

export const Route = createFileRoute('/users/$id')({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData(userQueryOptions(id)),
  component: UserPage,
})

function UserPage() {
  const { id } = Route.useParams()
  const { data } = useSuspenseQuery(userQueryOptions(id))

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <h1>{data.user.name}</h1>
      </div>
    </Layout>
  )
}
```

**Pattern:**
- ✅ Define `queryOptions` for reusability
- ✅ Use `loader` to prefetch data before render
- ✅ Use `useSuspenseQuery` in component (no loading states needed)
- ✅ Export `Route` with `createFileRoute`
- ✅ Use `Layout` wrapper for consistent header/footer
- ✅ Use standard container: `container max-w-6xl mx-auto px-4`

## Custom Hooks

**File structure:**
```
apps/web/src/hooks/
├── use-users.ts
├── use-auth.ts
└── use-theme.ts
```

**Query hook pattern:**
```ts
// apps/web/src/hooks/use-users.ts
import { queryOptions, useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export const usersQueryOptions = queryOptions({
  queryKey: ['users'],
  queryFn: async () => {
    const res = await apiClient.users.$get()
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  },
})

// For use with loaders (suspense)
export function useUsers() {
  return useSuspenseQuery(usersQueryOptions)
}

// For use without loaders (manual loading states)
export function useUsersOptional() {
  return useQuery(usersQueryOptions)
}
```

**Custom logic hook:**
```ts
// apps/web/src/hooks/use-auth.ts
import { useLocalStorage } from './use-local-storage'

export function useAuth() {
  const [token, setToken] = useLocalStorage('auth-token', null)

  const login = async (email: string, password: string) => {
    const res = await apiClient.auth.login.$post({ json: { email, password } })
    const data = await res.json()
    setToken(data.token)
  }

  const logout = () => setToken(null)

  return { token, login, logout, isAuthenticated: !!token }
}
```

## Type-Safe Navigation

```tsx
// ✅ Use Link from TanStack Router
import { Link } from '@tanstack/react-router'

<Link to="/users/$id" params={{ id: '123' }}>View User</Link>

// ❌ Don't use HTML anchor tags for internal navigation
<a href="/users/123">View User</a>
```

## Mutations with React Query

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { createUserSchema, type CreateUserInput } from '@repo/shared/schemas'

function CreateUserForm() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: CreateUserInput) => {
      const res = await apiClient.users.$post({ json: data })
      if (!res.ok) throw new Error('Failed to create')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = createUserSchema.parse({
      email: formData.get('email'),
      name: formData.get('name'),
    })
    mutation.mutate(data)
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>
}
```

## shadcn/ui Component Usage

```tsx
// ✅ Good
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click Me</Button>
  </CardContent>
</Card>

// ❌ Bad - don't recreate from scratch
<div className="rounded-lg border bg-card p-6">
  <h3 className="font-semibold">Title</h3>
  <button className="px-4 py-2 bg-primary text-white">Click Me</button>
</div>
```

**Adding new components:**
```bash
cd apps/web
bunx shadcn@latest add dialog
```

## Accessibility

```tsx
// ✅ For dialogs/sheets (using sr-only for hidden titles)
<SheetContent>
  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
  <SheetDescription className="sr-only">
    Navigate to different pages
  </SheetDescription>
</SheetContent>

// ✅ For icon-only buttons
<Button variant="ghost" size="icon">
  <Menu className="h-5 w-5" />
  <span className="sr-only">Open menu</span>
</Button>
```

## Form Validation with Zod

```tsx
import { createUserSchema, type CreateUserInput } from '@repo/shared/schemas'

function CreateUserForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = createUserSchema.safeParse({
      email: formData.get('email'),
      name: formData.get('name'),
    })

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      setErrors(fieldErrors)
      return
    }

    await apiClient.users.$post({ json: result.data })
  }
}
```

## React Query Conventions

- ✅ Define `queryOptions` for reusability
- ✅ Use loaders with `useSuspenseQuery` (no loading states)
- ✅ Use `useQuery` when loading states needed
- ✅ Use descriptive `queryKey` arrays: `['users', userId]`
- ✅ Invalidate queries after mutations
- ✅ Extract to custom hooks in `hooks/`
