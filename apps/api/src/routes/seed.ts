/**
 * ⚠️  WARNING: Remove this file before deploying to production!
 *
 * This route creates test users with known credentials.
 * It should ONLY be used during local development.
 */

import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { getDb } from '@/db'
import { users } from '@/db/schema/auth'
import type { AppContext } from '@/env'

export const seedRoutes = new Hono<AppContext>()

/**
 * Seed test user for development
 * POST /seed/test-user
 *
 * Creates a verified test user:
 *   Email: test@example.com
 *   Password: password123
 */
seedRoutes.post('/test-user', async (c) => {
  const auth = c.get('auth')
  const db = getDb(c.env.DB)

  // Check if test user already exists
  const existing = await db.select().from(users).where(eq(users.email, 'test@example.com')).get()

  if (existing) {
    return c.json({
      success: true,
      message: 'Test user already exists',
      credentials: {
        email: 'test@example.com',
        password: 'password123',
      },
    })
  }

  // Use better-auth's internal API to create user with proper password hashing
  const ctx = await auth.api.signUpEmail({
    body: {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    },
  })

  if (!ctx.user) {
    return c.json({ error: 'Failed to create test user' }, 400)
  }

  // Mark as verified
  await db.update(users).set({ emailVerified: true }).where(eq(users.email, 'test@example.com'))

  return c.json({
    success: true,
    message: 'Test user created',
    credentials: {
      email: 'test@example.com',
      password: 'password123',
    },
  })
})
