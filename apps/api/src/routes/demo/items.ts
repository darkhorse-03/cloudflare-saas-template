import { zValidator } from '@hono/zod-validator'
import { createItemSchema, updateItemSchema } from '@repo/shared'
import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { getDb } from '@/db'
import demoItems from '@/db/schema/demo'
import type { AppContext } from '@/env'
import { getAuthUser, requireAuth } from '@/middleware/auth'

export const itemsRoutes = new Hono<AppContext>()
  .get('/', requireAuth, async (c) => {
    const user = getAuthUser(c)
    const db = getDb(c.env.DB)
    const userItems = await db.query.demoItems.findMany({
      where: eq(demoItems.userId, user.id),
      orderBy: (items, { desc }) => [desc(items.createdAt)],
    })
    return c.json({ items: userItems })
  })
  .post('/', requireAuth, zValidator('json', createItemSchema), async (c) => {
    const user = getAuthUser(c)
    const data = c.req.valid('json')
    const db = getDb(c.env.DB)
    const newItem = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: data.title,
      description: data.description,
      category: data.category,
    }
    await db.insert(demoItems).values(newItem)
    return c.json({ item: newItem }, 201)
  })
  .patch('/:id', requireAuth, zValidator('json', updateItemSchema), async (c) => {
    const user = getAuthUser(c)
    const id = c.req.param('id')
    const data = c.req.valid('json')
    const db = getDb(c.env.DB)

    const item = await db.query.demoItems.findFirst({
      where: and(eq(demoItems.id, id), eq(demoItems.userId, user.id)),
    })

    if (!item) {
      return c.json({ error: 'Item not found' }, 404)
    }

    await db
      .update(demoItems)
      .set({
        title: data.title ?? item.title,
        description: data.description ?? item.description,
        category: data.category ?? item.category,
      })
      .where(eq(demoItems.id, id))

    const updated = await db.query.demoItems.findFirst({
      where: eq(demoItems.id, id),
    })
    return c.json({ item: updated })
  })
  .delete('/:id', requireAuth, async (c) => {
    const user = getAuthUser(c)
    const id = c.req.param('id')
    const db = getDb(c.env.DB)

    const item = await db.query.demoItems.findFirst({
      where: and(eq(demoItems.id, id), eq(demoItems.userId, user.id)),
    })

    if (!item) {
      return c.json({ error: 'Item not found' }, 404)
    }

    await db.delete(demoItems).where(eq(demoItems.id, id))
    return c.json({ success: true })
  })
