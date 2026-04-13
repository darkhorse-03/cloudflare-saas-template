import type { RateLimit } from '@cloudflare/workers-types'
import type { MiddlewareHandler } from 'hono'
import type { AppContext } from '@/env'

/**
 * Create a rate limit middleware using a specific RateLimiter binding.
 * Each tier has its own binding with independently enforced limits.
 * Authenticated users are keyed by userId, public requests by IP.
 */
export function createRateLimiter(
  getBinding: (env: AppContext['Bindings']) => RateLimit,
): MiddlewareHandler<AppContext> {
  return async (c, next) => {
    const user = c.get('user')
    const key = user?.id ?? c.req.header('cf-connecting-ip') ?? ''

    // Empty key bypasses rate limiting (shouldn't happen in production)
    if (!key) {
      await next()
      return
    }

    const result = await getBinding(c.env).limit({ key })

    if (!result.success) {
      return c.json({ error: 'Rate limit exceeded' }, 429)
    }

    await next()
  }
}

/** Global rate limiter — applied to all API routes */
export const globalRateLimiter = createRateLimiter((env) => env.RATE_LIMITER)

// @feature storage
export const uploadRateLimiter = createRateLimiter((env) => env.RATE_LIMITER_UPLOAD)
// @end storage

// @feature demo
export const exportRateLimiter = createRateLimiter((env) => env.RATE_LIMITER_EXPORT)
export const seedRateLimiter = createRateLimiter((env) => env.RATE_LIMITER_SEED)
// @end demo
