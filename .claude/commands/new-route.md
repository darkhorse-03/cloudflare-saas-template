---
description: Scaffold a new TanStack Router page
arguments:
  - name: route_path
    description: Route path (e.g., "about", "users", "users/$id")
    required: true
---

Create a new TanStack Router page at `apps/web/src/routes/$ARGUMENTS.route_path.tsx`:

## 1. Choose Layout Type

**Marketing/Public pages** → Use `Layout` component (Header + Footer)
**Dashboard pages** → Already wrapped by `/dashboard/route.tsx` (no layout needed)

## 2. Basic Page Template (Marketing)

**File:** `apps/web/src/routes/$ARGUMENTS.route_path.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'

export const Route = createFileRoute('/$ARGUMENTS.route_path')({
  component: PageComponent,
})

function PageComponent() {
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">$ARGUMENTS.route_path</h1>
        {/* Add your content here */}
      </div>
    </Layout>
  )
}
```

## 3. Basic Page Template (Dashboard)

**File:** `apps/web/src/routes/dashboard/$ARGUMENTS.route_path.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$ARGUMENTS.route_path')({
  component: PageComponent,
})

function PageComponent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">$ARGUMENTS.route_path</h1>
        <p className="text-muted-foreground">Page description</p>
      </div>
      {/* Add your content here */}
    </div>
  )
}
```

## 4. With Data Fetching (Using Custom Hook)

**IMPORTANT:** For data fetching with React Query, create a separate hook file following feature-based organization:

**Hook file:** `apps/web/src/hooks/[feature]/use-[resource].ts`

```tsx
// apps/web/src/hooks/items/use-items.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateItemInput, UpdateItemInput } from '@repo/shared'
import { api } from '@/lib/api'

export function useItems() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await api.items.$get()
      if (!res.ok) {
        throw new Error('Failed to fetch items')
      }
      return res.json()
    },
  })

  const createItem = useMutation({
    mutationFn: async (data: CreateItemInput) => {
      const res = await api.items.$post({ json: data })
      if (!res.ok) {
        throw new Error('Failed to create item')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  return {
    items: query.data?.items ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createItem,
  }
}
```

**Route file:** `apps/web/src/routes/dashboard/items.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useItems } from '@/hooks/items/use-items'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/dashboard/items')({
  component: ItemsPage,
})

function ItemsPage() {
  const { items, isLoading, error } = useItems()

  if (isLoading) {
    return <div>Loading items...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Items</h1>
          <p className="text-muted-foreground">Manage your items</p>
        </div>
        <Button>Add Item</Button>
      </div>

      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
    </div>
  )
}
```

## 5. With SSR Prefetching (Loader Pattern)

For pages that need SSR data prefetching:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Layout } from '@/components/layout'

const itemsQueryOptions = queryOptions({
  queryKey: ['items'],
  queryFn: async () => {
    const res = await api.items.$get()
    if (!res.ok) {
      throw new Error('Failed to fetch items')
    }
    return res.json()
  },
})

export const Route = createFileRoute('/$ARGUMENTS.route_path')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(itemsQueryOptions),
  component: PageComponent,
})

function PageComponent() {
  const { data } = useSuspenseQuery(itemsQueryOptions)

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Use data here - guaranteed to be loaded */}
      </div>
    </Layout>
  )
}
```

## 6. Adding to Sidebar Navigation

To add dashboard pages to the sidebar, update `apps/web/src/components/dashboard-sidebar.tsx`:

```tsx
const navItems = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: Home,
  },
  // Add your new route here
  {
    title: '$ARGUMENTS.route_path',
    url: '/dashboard/$ARGUMENTS.route_path',
    icon: YourIcon, // Import from lucide-react
  },
]
```

## File Organization

```
apps/web/src/
├── routes/
│   ├── index.tsx                    # Marketing homepage
│   ├── about.tsx                    # Marketing page
│   └── dashboard/
│       ├── route.tsx                # Dashboard layout (don't modify)
│       ├── index.tsx                # Dashboard home
│       └── $ARGUMENTS.route_path.tsx # Your new page
├── hooks/
│   └── [feature]/
│       └── use-[resource].ts        # React Query hooks
└── components/
    └── [feature]/
        └── [component].tsx          # Feature components
```

Follow patterns in `react-component-patterns` skill.
