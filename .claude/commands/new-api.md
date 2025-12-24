---
description: Scaffold a new Hono API route with CRUD operations
arguments:
  - name: feature_name
    description: Feature name (e.g., "posts", "products", "comments")
    required: true
  - name: route_name
    description: Route name (e.g., "posts", "products", "comments") - usually same as feature
    required: true
---

Create a new Hono API route for `$ARGUMENTS.route_name` following feature-based organization:

## 1. Create Shared Schemas & Types

**File:** `packages/shared/src/$ARGUMENTS.feature_name/$ARGUMENTS.route_name.ts`

```ts
import { z } from 'zod'

// Validation schemas
export const create${ARGUMENTS.route_name}Schema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  // Add your fields here
})

export const update${ARGUMENTS.route_name}Schema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  // Add your fields here (all optional for updates)
})

// Inferred input types
export type Create${ARGUMENTS.route_name}Input = z.infer<typeof create${ARGUMENTS.route_name}Schema>
export type Update${ARGUMENTS.route_name}Input = z.infer<typeof update${ARGUMENTS.route_name}Schema>

// API response type
export interface ${ARGUMENTS.route_name}Item {
  id: string
  userId: string
  title: string
  description?: string
  createdAt: number
  updatedAt: number
}
```

**Export from index:** Add to `packages/shared/src/index.ts`
```ts
export type { ${ARGUMENTS.route_name}Item, Create${ARGUMENTS.route_name}Input, Update${ARGUMENTS.route_name}Input } from './$ARGUMENTS.feature_name/$ARGUMENTS.route_name'
export { create${ARGUMENTS.route_name}Schema, update${ARGUMENTS.route_name}Schema } from './$ARGUMENTS.feature_name/$ARGUMENTS.route_name'
```

## 2. Create API Route

**File:** `apps/api/src/routes/$ARGUMENTS.feature_name/$ARGUMENTS.route_name.ts`

```ts
import { zValidator } from '@hono/zod-validator'
import { create${ARGUMENTS.route_name}Schema, update${ARGUMENTS.route_name}Schema } from '@repo/shared'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { getDb } from '@/db'
import ${ARGUMENTS.route_name}Table from '@/db/schema/$ARGUMENTS.feature_name'
import type { AppContext } from '@/env'
import { getAuthUser, requireAuth } from '@/middleware/auth'

export const ${ARGUMENTS.route_name}Routes = new Hono<AppContext>()
  // Get all items for current user
  .get('/', requireAuth, async (c) => {
    const user = getAuthUser(c)
    const db = getDb(c.env.DB)

    const items = await db.query.${ARGUMENTS.route_name}Table.findMany({
      where: eq(${ARGUMENTS.route_name}Table.userId, user.id),
      orderBy: (items, { desc }) => [desc(items.createdAt)],
    })

    return c.json({ items })
  })

  // Create new item
  .post('/', requireAuth, zValidator('json', create${ARGUMENTS.route_name}Schema), async (c) => {
    const user = getAuthUser(c)
    const data = c.req.valid('json')
    const db = getDb(c.env.DB)

    const newItem = {
      id: crypto.randomUUID(),
      userId: user.id,
      ...data,
    }

    await db.insert(${ARGUMENTS.route_name}Table).values(newItem)

    return c.json({ item: newItem }, 201)
  })

  // Get single item by ID
  .get('/:id', requireAuth, async (c) => {
    const user = getAuthUser(c)
    const id = c.req.param('id')
    const db = getDb(c.env.DB)

    const item = await db.query.${ARGUMENTS.route_name}Table.findFirst({
      where: and(
        eq(${ARGUMENTS.route_name}Table.id, id),
        eq(${ARGUMENTS.route_name}Table.userId, user.id),
      ),
    })

    if (!item) {
      return c.json({ error: 'Item not found' }, 404)
    }

    return c.json({ item })
  })

  // Update item
  .put('/:id', requireAuth, zValidator('json', update${ARGUMENTS.route_name}Schema), async (c) => {
    const user = getAuthUser(c)
    const id = c.req.param('id')
    const data = c.req.valid('json')
    const db = getDb(c.env.DB)

    // Verify ownership
    const existing = await db.query.${ARGUMENTS.route_name}Table.findFirst({
      where: and(
        eq(${ARGUMENTS.route_name}Table.id, id),
        eq(${ARGUMENTS.route_name}Table.userId, user.id),
      ),
    })

    if (!existing) {
      return c.json({ error: 'Item not found' }, 404)
    }

    await db
      .update(${ARGUMENTS.route_name}Table)
      .set(data)
      .where(eq(${ARGUMENTS.route_name}Table.id, id))

    const updated = await db.query.${ARGUMENTS.route_name}Table.findFirst({
      where: eq(${ARGUMENTS.route_name}Table.id, id),
    })

    return c.json({ item: updated })
  })

  // Delete item
  .delete('/:id', requireAuth, async (c) => {
    const user = getAuthUser(c)
    const id = c.req.param('id')
    const db = getDb(c.env.DB)

    // Verify ownership before delete
    const existing = await db.query.${ARGUMENTS.route_name}Table.findFirst({
      where: and(
        eq(${ARGUMENTS.route_name}Table.id, id),
        eq(${ARGUMENTS.route_name}Table.userId, user.id),
      ),
    })

    if (!existing) {
      return c.json({ error: 'Item not found' }, 404)
    }

    await db.delete(${ARGUMENTS.route_name}Table).where(eq(${ARGUMENTS.route_name}Table.id, id))

    return c.json({ success: true })
  })
```

## 3. Mount Route in Main App

**File:** `apps/api/src/index.ts`

```ts
import { ${ARGUMENTS.route_name}Routes } from '@/routes/$ARGUMENTS.feature_name/$ARGUMENTS.route_name'

const routes = app
  // ... existing routes
  .route('/$ARGUMENTS.feature_name/$ARGUMENTS.route_name', ${ARGUMENTS.route_name}Routes)

export type AppType = typeof routes
```

## File Organization

```
apps/api/src/
├── routes/
│   └── $ARGUMENTS.feature_name/
│       └── $ARGUMENTS.route_name.ts     # Named export: ${ARGUMENTS.route_name}Routes
├── db/
│   └── schema/
│       └── $ARGUMENTS.feature_name.ts   # Database table

packages/shared/src/
├── $ARGUMENTS.feature_name/
│   └── $ARGUMENTS.route_name.ts         # Schemas & types
└── index.ts                              # Re-export everything
```

## Key Patterns

**Security:**
- ✅ Always use `requireAuth` middleware for protected routes
- ✅ Always verify user ownership with `userId` checks
- ✅ Use `getAuthUser(c)` helper for type-safe user access
- ✅ Verify ownership before updates and deletes

**Structure:**
- ✅ Feature-based folder organization (`routes/[feature]/`)
- ✅ Named exports with `Routes` suffix (`export const itemsRoutes`)
- ✅ Shared schemas in `packages/shared/src/[feature]/`
- ✅ Import schemas from `@repo/shared` (barrel export)

**Types:**
- ✅ Use `AppContext` for Hono context typing
- ✅ Export response types from shared package
- ✅ Infer input types from Zod schemas

**Need to create tables?** Use `/new-schema` command to create database schemas.

## Reference Implementation

See working example: `apps/api/src/routes/demo/items.ts`
