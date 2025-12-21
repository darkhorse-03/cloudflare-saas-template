import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { config } from '@repo/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createAuth } from './auth'
import type { AppContext } from './env'

const app = new Hono<AppContext>()

app.use(logger())

app.use(
  '/*',
  cors({
    origin: (origin) => origin, // Allow all origins (return the requesting origin)
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 600,
  }),
)

// Auth routes - handle all Better Auth endpoints
// Note: /api prefix is stripped by the web worker before reaching here
app.on(['POST', 'GET'], '/auth/**', (c) => {
  const auth = createAuth(c.env, c.req.raw.cf as IncomingRequestCfProperties)
  return auth.handler(c.req.raw)
})

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

export type AppType = typeof routes
export default app
