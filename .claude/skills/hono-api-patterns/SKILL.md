# Hono API Patterns

## Route Organization with Method Chaining

**File structure:**
```ts
// apps/api/src/routes/users.ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createUserSchema, updateUserSchema } from '@repo/shared/schemas'

const users = new Hono()
  .get('/', (c) => c.json({ users: [] }))
  .post('/', zValidator('json', createUserSchema), async (c) => {
    const body = c.req.valid('json')
    // Body is now typed and validated
    return c.json({ user: body }, 201)
  })
  .get('/:id', async (c) => {
    const id = c.req.param('id')
    return c.json({ user: { id } })
  })
  .put('/:id', zValidator('json', updateUserSchema), async (c) => {
    const id = c.req.param('id')
    const body = c.req.valid('json')
    return c.json({ user: { id, ...body } })
  })

export default users
```

**Mount in main app:**
```ts
// apps/api/src/index.ts
import { Hono } from 'hono'
import users from './routes/users'

const app = new Hono()
  .get('/health', (c) => c.json({ status: 'ok' }))
  .route('/users', users)

export type ApiType = typeof app  // ✅ Export for RPC type safety
export default app
```

## Zod Validation with Shared Package

**Define schemas in shared package:**
```ts
// packages/shared/src/schemas/user.schema.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
})

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
```

**Export from shared package:**
```ts
// packages/shared/src/index.ts
export * from './schemas/user.schema'
```

**Use in API routes:**
```ts
import { zValidator } from '@hono/zod-validator'
import { createUserSchema } from '@repo/shared/schemas'

const users = new Hono()
  .post('/', zValidator('json', createUserSchema), async (c) => {
    const body = c.req.valid('json')  // Typed as CreateUserInput
    return c.json({ user: body }, 201)
  })
```

**Use in frontend:**
```ts
// apps/web/src/routes/users.tsx
import { createUserSchema, type CreateUserInput } from '@repo/shared/schemas'

function CreateUserForm() {
  const handleSubmit = async (data: CreateUserInput) => {
    // Validate on frontend too
    const validated = createUserSchema.parse(data)
    await apiClient.users.$post({ json: validated })
  }
}
```

## RPC Type Safety

**Always export the API type:**
```ts
// apps/api/src/index.ts
const app = new Hono()
  .get('/health', (c) => c.json({ status: 'ok' }))
  .route('/users', users)

export type ApiType = typeof app
export default app
```

**Use in frontend:**
```ts
// apps/web/src/lib/api-client.ts
import { hc } from 'hono/client'
import type { ApiType } from '@api/index'

export const apiClient = hc<ApiType>('/api')
```

## Error Handling

```ts
const users = new Hono()
  .get('/:id', async (c) => {
    const user = await getUser(c.req.param('id'))
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    return c.json(user)
  })
```

## Validation Locations

- **Query params**: `zValidator('query', schema)`
- **JSON body**: `zValidator('json', schema)`
- **Form data**: `zValidator('form', schema)`
- **Route params**: `zValidator('param', schema)`

## Environment Variables

```ts
// ✅ Use env bindings (Cloudflare Workers)
export default {
  fetch(request, env: Env) {
    const apiKey = env.API_KEY
  }
}

// ❌ Never use process.env in Workers
```

## Shared Package Structure

```
packages/shared/
├── src/
│   ├── schemas/
│   │   ├── user.schema.ts
│   │   ├── post.schema.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
└── package.json
```
