import { zValidator } from '@hono/zod-validator'
import { updatePreferencesSchema } from '@repo/shared'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { getDb } from '@/db'
import { demoPreferences } from '@/db/schema/demo'
import type { AppContext } from '@/env'
import { getAuthUser, requireAuth } from '@/middleware/auth'

export const preferencesRoutes = new Hono<AppContext>()
  // Get user preferences
  .get('/', requireAuth, async (c) => {
    const user = getAuthUser(c)
    const db = getDb(c.env.DB)

    let userPrefs = await db.query.demoPreferences.findFirst({
      where: eq(demoPreferences.userId, user.id),
    })

    // Create default preferences if they don't exist
    if (!userPrefs) {
      await db.insert(demoPreferences).values({
        userId: user.id,
        theme: 'system',
        notifications: true,
        language: 'en',
      })

      userPrefs = await db.query.demoPreferences.findFirst({
        where: eq(demoPreferences.userId, user.id),
      })
    }

    return c.json({ preferences: userPrefs })
  })

  // Update user preferences
  .patch('/', requireAuth, zValidator('json', updatePreferencesSchema), async (c) => {
    const user = getAuthUser(c)
    const data = c.req.valid('json')
    const db = getDb(c.env.DB)

    // Get existing or create default
    const existing = await db.query.demoPreferences.findFirst({
      where: eq(demoPreferences.userId, user.id),
    })

    if (existing) {
      // Update existing
      await db
        .update(demoPreferences)
        .set({
          theme: data.theme ?? existing.theme,
          notifications: data.notifications ?? existing.notifications,
          language: data.language ?? existing.language,
        })
        .where(eq(demoPreferences.userId, user.id))
    } else {
      // Create with provided values or defaults
      await db.insert(demoPreferences).values({
        userId: user.id,
        theme: data.theme ?? 'system',
        notifications: data.notifications ?? true,
        language: data.language ?? 'en',
      })
    }

    const updated = await db.query.demoPreferences.findFirst({
      where: eq(demoPreferences.userId, user.id),
    })

    return c.json({ preferences: updated })
  })
