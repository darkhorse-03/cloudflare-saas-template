import type { MiddlewareHandler } from 'hono'
import type { AppContext } from '@/env'
import { createRequestLogger } from '@/lib/logger'

export const requestLogger = (): MiddlewareHandler<AppContext> => {
  return async (c, next) => {
    const requestId = crypto.randomUUID().slice(0, 8)

    c.header('X-Request-Id', requestId)

    const logger = createRequestLogger({ requestId })
    c.set('log', logger)

    // Only log errors - Cloudflare already traces requests automatically
    try {
      await next()
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      logger.error('request.error', {
        method: c.req.method,
        path: c.req.path,
        error: error.message,
        stack: error.stack,
        userId: c.get('user')?.id,
      })
      throw err
    }
  }
}
