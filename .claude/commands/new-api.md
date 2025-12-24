---
description: Scaffold a new Hono API route
arguments:
  - name: route_name
    description: Route name (e.g., "users", "posts", "auth")
    required: true
---

Create a new Hono API route for `$ARGUMENTS.route_name`:

1. **Create route file**: `apps/api/src/routes/$ARGUMENTS.route_name.ts`

2. **Template structure**:
```ts
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

// Define schemas if needed
const createSchema = z.object({
  // Add fields here
})

const updateSchema = z.object({
  // Add fields here
})

const $ARGUMENTS.route_name = new Hono()
  .get('/', (c) => {
    // List all
    return c.json({ $ARGUMENTS.route_name: [] })
  })
  .post('/', zValidator('json', createSchema), async (c) => {
    const body = c.req.valid('json')
    // Create logic
    return c.json({ success: true }, 201)
  })
  .get('/:id', (c) => {
    const id = c.req.param('id')
    // Get by ID logic
    return c.json({ id })
  })
  .put('/:id', zValidator('json', updateSchema), async (c) => {
    const id = c.req.param('id')
    const body = c.req.valid('json')
    // Update logic
    return c.json({ id, ...body })
  })
  .delete('/:id', (c) => {
    const id = c.req.param('id')
    // Delete logic
    return c.json({ success: true })
  })

export default $ARGUMENTS.route_name
```

3. **Mount in main app** (`apps/api/src/index.ts`):
```ts
import $ARGUMENTS.route_name from './routes/$ARGUMENTS.route_name'

const app = new Hono()
  .route('/$ARGUMENTS.route_name', $ARGUMENTS.route_name)
  // ... other routes

export type ApiType = typeof app
export default app
```

4. **If using shared schemas**, create in `packages/shared/src/schemas/$ARGUMENTS.route_name.schema.ts`:
```ts
import { z } from 'zod'

export const create${ARGUMENTS.route_name}Schema = z.object({
  // Add fields here
})

export const update${ARGUMENTS.route_name}Schema = z.object({
  // Add fields here
})

export type Create${ARGUMENTS.route_name}Input = z.infer<typeof create${ARGUMENTS.route_name}Schema>
export type Update${ARGUMENTS.route_name}Input = z.infer<typeof update${ARGUMENTS.route_name}Schema>
```

Then import in route:
```ts
import { create${ARGUMENTS.route_name}Schema } from '@repo/shared/schemas'
```

## Using Database in Routes

If your route needs to interact with the database:

1. **Import database helpers**:
```ts
import { getDb } from '@/db'
import tableName from '@/db/schema/feature'
import { eq } from 'drizzle-orm'
import { getAuthUser, requireAuth } from '@/middleware/auth'
```

2. **Use in route handlers**:
```ts
const $ARGUMENTS.route_name = new Hono()
  .get('/', requireAuth, async (c) => {
    const user = getAuthUser(c)  // Get authenticated user
    const db = getDb(c.env.DB)   // Get database instance

    // Query with user scoping
    const items = await db.query.tableName.findMany({
      where: eq(tableName.userId, user.id),
    })

    return c.json({ items })
  })
```

**Need to create tables?** Use `/new-schema` command to create database schemas.

Follow patterns in `hono-api-patterns` skill.
