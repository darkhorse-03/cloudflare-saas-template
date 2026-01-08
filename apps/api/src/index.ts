import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { config } from '@repo/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from '@/auth'
import type { AppContext } from '@/env'
import { createEmailService } from '@/lib/email'
import { authMiddleware } from '@/middleware/auth'
import { itemsRoutes } from '@/routes/demo/items'
import { preferencesRoutes } from '@/routes/demo/preferences'
import { todosRoutes } from '@/routes/demo/todos'
import { seedRoutes } from '@/routes/seed'
import { storageRoutes } from '@/routes/storage'
import { logger } from 'hono/logger'

const app = new Hono<AppContext>()

// CORS middleware
app.use(
  '/*',
  cors({
    origin: (origin) => origin, // Allow all origins (return the requesting origin)
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
  }),
)

app.use(logger())

// Create auth instance and attach to context
app.use('/*', async (c, next) => {
  const auth = createAuth(c.env, c.req.raw.cf as IncomingRequestCfProperties)
  c.set('auth', auth)
  await next()
})

// Create email service instance and attach to context (optional)
app.use('/*', async (c, next) => {
  const emailService = createEmailService(c.env)
  if (emailService) {
    c.set('emailService', emailService)
  }
  await next()
})

// Extract session globally - sets user/session in context
app.use('/*', authMiddleware)

// Auth routes - handle all Better Auth endpoints
// Note: /api prefix is stripped by the web worker before reaching here
app.all('/auth/*', (c) => {
  const auth = c.get('auth')
  return auth.handler(c.req.raw)
})

// API routes
const routes = app
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
  // Demo routes - delete this when building your app
  .route('/demo/todos', todosRoutes)
  .route('/demo/items', itemsRoutes)
  .route('/demo/preferences', preferencesRoutes)
  // Storage routes (R2 file uploads)
  .route('/storage', storageRoutes)
  // ⚠️  Seed routes - REMOVE BEFORE PRODUCTION DEPLOYMENT
  .route('/seed', seedRoutes)

export type AppType = typeof routes
export default app
