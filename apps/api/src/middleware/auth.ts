import type { Context, Next } from 'hono'
import type { AppContext } from '../env'

export async function authMiddleware(c: Context<AppContext>, next: Next) {
  const auth = c.get('auth')
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    c.set('user', null)
    c.set('session', null)
    await next()
    return
  }

  c.set('user', session.user)
  c.set('session', session.session)
  await next()
}

export async function requireAuth(c: Context<AppContext>, next: Next) {
  const user = c.get('user')

  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  await next()
}

// Helper to get authenticated user (throws if not authenticated)
export function getAuthUser(c: Context<AppContext>) {
  const user = c.get('user')
  if (!user) {
    throw new Error('User not authenticated')
  }
  return user
}
