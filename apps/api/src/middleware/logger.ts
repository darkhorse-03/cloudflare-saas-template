import type { MiddlewareHandler } from 'hono'
import type { AppContext } from '@/env'
import { createRequestLogger } from '@/lib/logger'

export const requestLogger = (): MiddlewareHandler<AppContext> => {
  return async (c, next) => {
    const requestId = crypto.randomUUID().slice(0, 8)
    const start = Date.now()

    c.header('X-Request-Id', requestId)

    const logger = createRequestLogger({ requestId })
    c.set('log', logger)

    logger.info('request.start', {
      method: c.req.method,
      path: c.req.path,
    })

    try {
      await next()
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      logger.error('request.error', {
        error: error.message,
        stack: error.stack,
      })
      throw err
    }

    const duration = Date.now() - start
    const userId = c.get('user')?.id

    logger.info('request.end', {
      status: c.res.status,
      duration,
      ...(userId && { userId }),
    })
  }
}
