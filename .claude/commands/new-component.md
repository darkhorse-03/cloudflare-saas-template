---
description: Scaffold a new React component
arguments:
  - name: component_name
    description: Component name in kebab-case (e.g., "user-card", "post-list")
    required: true
---

Create a new React component `$ARGUMENTS.component_name`:

1. **File location**: `apps/web/src/components/$ARGUMENTS.component_name.tsx`

2. **Basic component template**:
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

3. **With data fetching (using custom hook)**:
```tsx
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface ${ARGUMENTS.component_name}Props {
  id: string
}

export function ${ARGUMENTS.component_name}({ id }: ${ARGUMENTS.component_name}Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      const res = await apiClient.resource[':id'].$get({ param: { id } })
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {/* Use data here */}
    </div>
  )
}
```

4. **With shadcn/ui components**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ${ARGUMENTS.component_name}Props {
  title: string
  content: string
}

export function ${ARGUMENTS.component_name}({ title, content }: ${ARGUMENTS.component_name}Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{content}</p>
        <Button>Action</Button>
      </CardContent>
    </Card>
  )
}
```

5. **With form and validation**:
```tsx
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { createSchema, type CreateInput } from '@repo/shared/schemas'
import { Button } from '@/components/ui/button'

export function ${ARGUMENTS.component_name}() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: CreateInput) => {
      const res = await apiClient.resource.$post({ json: data })
      if (!res.ok) throw new Error('Failed to create')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
    },
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = createSchema.safeParse({
      // Parse form data
    })

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors)
      return
    }

    mutation.mutate(result.data)
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

Follow patterns in `react-component-patterns` and `layout-patterns` skills.
