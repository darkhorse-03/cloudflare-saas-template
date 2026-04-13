import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { config } from '@repo/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from '@/auth'
import type { AppContext } from '@/env'
// @feature jobs
import { handleScheduled, processJobBatch } from '@/jobs'
// @end jobs
// @feature email
import { createEmailService } from '@/lib/email'
// @end email
import { authMiddleware } from '@/middleware/auth'
import { requestLogger } from '@/middleware/logger'
import { globalRateLimiter } from '@/middleware/rate-limit'
// @feature storage
import { uploadRateLimiter } from '@/middleware/rate-limit'
// @end storage
// @feature demo
import { exportRateLimiter, seedRateLimiter } from '@/middleware/rate-limit'
import { exportRoutes } from '@/routes/demo/export'
import { itemsRoutes } from '@/routes/demo/items'
import { onboardingRoutes } from '@/routes/demo/onboarding'
import { preferencesRoutes } from '@/routes/demo/preferences'
import { todosRoutes } from '@/routes/demo/todos'
import { seedRoutes } from '@/routes/seed'
// @end demo
// @feature storage
import { storageRoutes } from '@/routes/storage'
// @end storage

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

// @feature email
app.use('/*', async (c, next) => {
  const emailService = createEmailService(c.env)
  if (emailService) {
    c.set('emailService', emailService)
  }
  await next()
})
// @end email

app.use('/*', authMiddleware)

app.all('/auth/*', (c) => {
  const auth = c.get('auth')
  return auth.handler(c.req.raw)
})

// Define routes separately for proper type inference
const apiRoutes = new Hono<AppContext>()

// Global rate limit on all API routes (excludes /auth/* which is handled separately)
apiRoutes.use('/*', globalRateLimiter)

// @feature storage
apiRoutes.use('/storage/upload', uploadRateLimiter)
apiRoutes.use('/storage/avatars/*', uploadRateLimiter)
// @end storage
// @feature demo
apiRoutes.use('/demo/export/*', exportRateLimiter)
apiRoutes.use('/seed/*', seedRateLimiter)
// @end demo

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
  // @feature demo
  .route('/demo/todos', todosRoutes)
  .route('/demo/items', itemsRoutes)
  .route('/demo/preferences', preferencesRoutes)
  .route('/demo/export', exportRoutes)
  .route('/demo/onboarding', onboardingRoutes)
  // @end demo
  // @feature storage
  .route('/storage', storageRoutes)
  // @end storage
  // @feature demo
  .route('/seed', seedRoutes)
// @end demo

// Mount routes on app
app.route('/', apiRoutesWithTypes)

// Export the apiRoutes type for RPC client
export type AppType = typeof apiRoutesWithTypes

// @feature workflows
export { UserOnboardingWorkflow } from '@/workflows'
// @end workflows

export default {
  fetch: app.fetch,
  // @feature jobs
  queue: processJobBatch,
  scheduled: handleScheduled,
  // @end jobs
}
