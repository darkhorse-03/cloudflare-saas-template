import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

const routes = app
  .get('/', (c) => {
    return c.json({ message: 'Welcome to underdog Template API' })
  })
  .get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: Date.now() })
  })
  .get('/users', (c) => {
    const users = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    ]
    return c.json(users)
  })
  .get('/users/:id', (c) => {
    const id = Number(c.req.param('id'))
    const users = [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' },
    ]
    const user = users.find((u) => u.id === id)
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    return c.json(user)
  })

export type AppType = typeof routes
export default app
