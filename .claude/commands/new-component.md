---
description: Scaffold a new React component
arguments:
  - name: component_name
    description: Component name in kebab-case (e.g., "user-card", "post-list")
    required: true
---

Create a new React component `$ARGUMENTS.component_name`:

## File Organization Strategy

**Feature-based components** → `apps/web/src/components/[feature]/$ARGUMENTS.component_name.tsx`
**Global/shared components** → `apps/web/src/components/$ARGUMENTS.component_name.tsx`

**Example structure:**
```
apps/web/src/components/
├── ui/                    # shadcn/ui components (auto-generated)
├── items/                 # Items feature components
│   ├── item-card.tsx
│   └── item-form.tsx
├── auth/                  # Auth feature components
│   └── auth-dialog.tsx
├── layout.tsx             # Global layout
└── header.tsx             # Global header
```

## 1. Basic Component Template
```tsx
interface ${ARGUMENTS.component_name}Props {
  // Add props here
}

export function ${ARGUMENTS.component_name}({  }: ${ARGUMENTS.component_name}Props) {
  return (
    <div>
      {/* Component content */}
    </div>
  )
}
```

## 2. With Data Fetching (Using Custom Hook)

**IMPORTANT:** For data fetching, create a separate hook file following feature-based organization.

**Hook file:** `apps/web/src/hooks/[feature]/use-[resource].ts`

```tsx
// apps/web/src/hooks/items/use-items.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import type { CreateItemInput, UpdateItemInput } from '@repo/shared'

export function useItems() {
  const queryClient = useQueryClient()

  const itemsQuery = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await apiClient.demo.items.$get()
      if (!res.ok) {
        throw new Error('Failed to fetch items')
      }
      return res.json()
    },
  })

  const createItem = useMutation({
    mutationFn: async (data: CreateItemInput) => {
      const res = await apiClient.demo.items.$post({ json: data })
      if (!res.ok) {
        throw new Error('Failed to create item')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  const updateItem = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateItemInput }) => {
      const res = await apiClient.demo.items[':id'].$put({
        param: { id },
        json: data,
      })
      if (!res.ok) {
        throw new Error('Failed to update item')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.demo.items[':id'].$delete({ param: { id } })
      if (!res.ok) {
        throw new Error('Failed to delete item')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] })
    },
  })

  return {
    items: itemsQuery.data?.items ?? [],
    isLoading: itemsQuery.isLoading,
    error: itemsQuery.error,
    createItem,
    updateItem,
    deleteItem,
  }
}
```

**Component file:** `apps/web/src/components/items/item-list.tsx`

```tsx
import { useItems } from '@/hooks/items/use-items'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ItemList() {
  const { items, isLoading, error } = useItems()

  if (isLoading) {
    return <div>Loading items...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

## 3. With shadcn/ui Components

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ${ARGUMENTS.component_name}Props {
  title: string
  content: string
  onAction?: () => void
}

export function ${ARGUMENTS.component_name}({ title, content, onAction }: ${ARGUMENTS.component_name}Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{content}</p>
        <Button onClick={onAction}>Action</Button>
      </CardContent>
    </Card>
  )
}
```

## 4. With Form and Mutations

**Use custom hook for mutations:**

```tsx
// Component: apps/web/src/components/items/create-item-form.tsx
import { useState } from 'react'
import { useItems } from '@/hooks/items/use-items'
import { createItemSchema } from '@repo/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CreateItemForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { createItem } = useItems()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    const result = createItemSchema.safeParse({
      title,
      description,
    })

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    createItem.mutate(result.data, {
      onSuccess: () => {
        setTitle('')
        setDescription('')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
        />
        {errors.title && (
          <p className="text-destructive text-sm">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
        {errors.description && (
          <p className="text-destructive text-sm">{errors.description}</p>
        )}
      </div>

      <Button type="submit" disabled={createItem.isPending}>
        {createItem.isPending ? 'Creating...' : 'Create Item'}
      </Button>

      {createItem.error && (
        <p className="text-destructive text-sm">{createItem.error.message}</p>
      )}
    </form>
  )
}
```

## File Organization Reference

```
apps/web/src/
├── components/
│   ├── ui/                    # shadcn/ui components (auto-generated)
│   ├── [feature]/             # Feature-specific components
│   │   ├── item-list.tsx
│   │   ├── item-card.tsx
│   │   └── create-item-form.tsx
│   ├── layout.tsx             # Global layout
│   └── header.tsx             # Global components
├── hooks/
│   ├── [feature]/             # Feature-specific hooks
│   │   └── use-items.ts      # React Query hooks with CRUD operations
│   ├── use-auth.ts            # Global hooks
│   └── use-theme.ts
└── routes/
    └── dashboard/
        └── items.tsx          # Page that uses components + hooks
```

**Best Practices:**
- ✅ Separate data fetching into hooks (`hooks/[feature]/use-[resource].ts`)
- ✅ Keep components focused on presentation
- ✅ Use feature-based organization for related components
- ✅ Export types from `@repo/shared` for API contracts
- ✅ Handle loading and error states explicitly
- ✅ Use shadcn/ui components instead of custom primitives

Follow patterns in `react-component-patterns` and `layout-patterns` skills.
