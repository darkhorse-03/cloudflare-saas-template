---
description: Scaffold a new TanStack Router page
arguments:
  - name: route_path
    description: Route path (e.g., "about", "users", "users/$id")
    required: true
---

Create a new TanStack Router page at `apps/web/src/routes/$ARGUMENTS.route_path.tsx`:

1. **File location**: `apps/web/src/routes/$ARGUMENTS.route_path.tsx`

2. **Template structure**:
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

3. **If data fetching needed**:
```tsx
import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Layout } from '@/components/layout'

const dataQueryOptions = queryOptions({
  queryKey: ['data-key'],
  queryFn: async () => {
    const res = await apiClient.endpoint.$get()
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  },
})

export const Route = createFileRoute('/$ARGUMENTS.route_path')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(dataQueryOptions),
  component: PageComponent,
})

function PageComponent() {
  const { data } = useSuspenseQuery(dataQueryOptions)

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Use data here */}
      </div>
    </Layout>
  )
}
```

Follow patterns in `react-component-patterns` skill.
