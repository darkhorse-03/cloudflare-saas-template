import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { config } from '@repo/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from './auth'
import type { AppContext } from './env'

const app = new Hono<AppContext>()

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

// In-memory demo todos storage
type DemoTodo = {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

const demoTodos: DemoTodo[] = [
  { id: '1', text: 'Try the auth demo above', completed: false, createdAt: Date.now() - 3_600_000 },
  { id: '2', text: 'Create a new todo', completed: false, createdAt: Date.now() - 1_800_000 },
]

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
  // Demo todo endpoints
  .get('/demo/todos', (c) => c.json({ todos: demoTodos }))
  .post('/demo/todos', async (c) => {
    const body = await c.req.json<{ text: string }>()
    const newTodo: DemoTodo = {
      id: crypto.randomUUID(),
      text: body.text,
      completed: false,
      createdAt: Date.now(),
    }
    demoTodos.push(newTodo)
    return c.json({ todo: newTodo }, 201)
  })
  .delete('/demo/todos/:id', (c) => {
    const id = c.req.param('id')
    const index = demoTodos.findIndex((todo) => todo.id === id)
    if (index === -1) {
      return c.json({ error: 'Todo not found' }, 404)
    }
    demoTodos.splice(index, 1)
    return c.json({ success: true })
  })

export type AppType = typeof routes
export default app
