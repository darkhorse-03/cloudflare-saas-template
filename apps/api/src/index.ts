import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { config } from '@repo/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createAuth } from '@/auth'
import type { AppContext } from '@/env'
import { createEmailService } from '@/lib/email'
import { authMiddleware } from '@/middleware/auth'
import { itemsRoutes } from '@/routes/demo/items'
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

app.use(logger())

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
  .route('/storage', storageRoutes)
  .route('/seed', seedRoutes)

// Mount routes on app
app.route('/', apiRoutes)

// Export the apiRoutes type for RPC client
export type AppType = typeof apiRoutes
export default app
