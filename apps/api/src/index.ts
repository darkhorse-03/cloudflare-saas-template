import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

const routes = app
  .get('/', (c) => {
    return c.json({ message: 'Welcome to underdog API' })
  })
  .get('/ping', (c) => {
    return c.json({ pong: Date.now() })
  })
  .get('/time', (c) => {
    return c.json({
      iso: new Date().toISOString(),
      unix: Date.now(),
    })
  })
  .get('/random', (c) => {
    return c.json({
      number: Math.floor(Math.random() * 100),
      uuid: crypto.randomUUID(),
    })
  })

export type AppType = typeof routes
export default app
