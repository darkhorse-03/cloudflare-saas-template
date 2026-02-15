import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { config } from '@repo/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from '@/auth'
import type { AppContext } from '@/env'
import { handleScheduled, processJobBatch } from '@/jobs'
import { createEmailService } from '@/lib/email'
import { authMiddleware } from '@/middleware/auth'
import { requestLogger } from '@/middleware/logger'
import {
  exportRateLimiter,
  globalRateLimiter,
  seedRateLimiter,
  uploadRateLimiter,
} from '@/middleware/rate-limit'
import { exportRoutes } from '@/routes/demo/export'
import { itemsRoutes } from '@/routes/demo/items'
import { onboardingRoutes } from '@/routes/demo/onboarding'
import { preferencesRoutes } from '@/routes/demo/preferences'
import { todosRoutes } from '@/routes/demo/todos'
import { seedRoutes } from '@/routes/seed'
import { storageRoutes } from '@/routes/storage'

// Create base app with middleware
const app = new Hono<AppContext>()

app.use(
  '/*',
  cors({
    origin: (origin) => origin,
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
  }),
)

app.use(requestLogger())

app.use('/*', async (c, next) => {
  const cfRequest = c.req.raw as Request & { cf?: IncomingRequestCfProperties }
  const auth = createAuth(c.env, cfRequest.cf)
  c.set('auth', auth)
  await next()
})

app.use('/*', async (c, next) => {
  const emailService = createEmailService(c.env)
  if (emailService) {
    c.set('emailService', emailService)
  }
  await next()
})

app.use('/*', authMiddleware)

app.all('/auth/*', (c) => {
  const auth = c.get('auth')
  return auth.handler(c.req.raw)
})

// Define routes separately for proper type inference
const apiRoutes = new Hono<AppContext>()

// Global rate limit on all API routes (excludes /auth/* which is handled separately)
apiRoutes.use('/*', globalRateLimiter)

// Route-specific stricter rate limits
apiRoutes.use('/storage/upload', uploadRateLimiter)
apiRoutes.use('/storage/avatars/*', uploadRateLimiter)
apiRoutes.use('/demo/export/*', exportRateLimiter)
apiRoutes.use('/seed/*', seedRateLimiter)

const apiRoutesWithTypes = apiRoutes
  .get('/', (c) =>
    c.json({
      message: `Welcome to ${config.appName} API`,
      description: config.description,
    }),
  )
  .get('/ping', (c) => c.json({ pong: Date.now() }))
  .get('/time', (c) =>
    c.json({
      iso: new Date().toISOString(),
      unix: Date.now(),
    }),
  )
  .get('/random', (c) =>
    c.json({
      number: Math.floor(Math.random() * 100),
      uuid: crypto.randomUUID(),
    }),
  )
  .route('/demo/todos', todosRoutes)
  .route('/demo/items', itemsRoutes)
  .route('/demo/preferences', preferencesRoutes)
  .route('/demo/export', exportRoutes)
  .route('/demo/onboarding', onboardingRoutes)
  .route('/storage', storageRoutes)
  .route('/seed', seedRoutes)

// Mount routes on app
app.route('/', apiRoutesWithTypes)

// Export the apiRoutes type for RPC client
export type AppType = typeof apiRoutesWithTypes

// Export workflow classes (required by Cloudflare runtime)
export { UserOnboardingWorkflow } from '@/workflows'

// Worker exports with queue and scheduled handlers
export default {
  fetch: app.fetch,
  queue: processJobBatch,
  scheduled: handleScheduled,
}
