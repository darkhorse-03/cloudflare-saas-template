# Cloudflare Workers Patterns

## Service Bindings (Worker-to-Worker Communication)

**Use service bindings for internal communication** (zero-latency, no network overhead):

```ts
// ✅ Service binding (apps/api/src/index.ts)
export default {
  fetch(request, env) {
    return apiWorker.fetch(request, env)
  }
}

// ❌ Don't use HTTP calls between your own workers
const response = await fetch('https://api.yoursite.com/internal')
```

**Configure in wrangler.toml:**
```toml
[[services]]
binding = "API"
service = "my-api-worker"
```

## Platform Constraints

**Be aware of Cloudflare Workers limits:**

- ✅ Keep bundles under 1MB (use code splitting)
- ✅ Use edge-compatible libraries only (no Node.js built-ins)
- ✅ Stateless workers (no in-memory state between requests)
- ✅ Max 50ms CPU time per request (use Durable Objects for longer tasks)
- ❌ No file system access (use R2, KV, or D1)
- ❌ No `process.env` (use `env` bindings)

## Environment Variables & Secrets

**Local development:**
```toml
# apps/api/.dev.vars (gitignored)
DATABASE_URL=...
API_KEY=...
```

**Production:**
```bash
# Use Wrangler secrets (never commit)
wrangler secret put API_KEY
```

**Accessing in code:**
```ts
// ✅ Use env bindings (Cloudflare Workers)
export default {
  fetch(request, env: Env) {
    const apiKey = env.API_KEY
    const dbUrl = env.DATABASE_URL
  }
}

// ❌ Never use process.env in Workers
const apiKey = process.env.API_KEY  // This won't work!
```

**Type env bindings:**
```ts
// apps/api/src/types/env.ts
export interface Env {
  API_KEY: string
  DATABASE_URL: string
  DB: D1Database  // If using D1
  BUCKET: R2Bucket  // If using R2
}
```

## Database (D1)

**Accessing D1 from Hono:**
```ts
import { Hono } from 'hono'
import type { Env } from './types/env'

const app = new Hono<{ Bindings: Env }>()
  .get('/users', async (c) => {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM users'
    ).all()
    return c.json({ users: results })
  })
```

**With Drizzle ORM:**
```ts
import { drizzle } from 'drizzle-orm/d1'
import { users } from './db/schema'

const app = new Hono<{ Bindings: Env }>()
  .get('/users', async (c) => {
    const db = drizzle(c.env.DB)
    const allUsers = await db.select().from(users)
    return c.json({ users: allUsers })
  })
```

## KV Storage

**Accessing KV:**
```ts
const app = new Hono<{ Bindings: Env }>()
  .get('/cache/:key', async (c) => {
    const key = c.req.param('key')
    const value = await c.env.CACHE.get(key)
    return c.json({ value })
  })
  .put('/cache/:key', async (c) => {
    const key = c.req.param('key')
    const { value } = await c.req.json()
    await c.env.CACHE.put(key, value)
    return c.json({ success: true })
  })
```

## R2 Storage

**Uploading files:**
```ts
const app = new Hono<{ Bindings: Env }>()
  .put('/upload/:filename', async (c) => {
    const filename = c.req.param('filename')
    const body = await c.req.arrayBuffer()
    await c.env.BUCKET.put(filename, body)
    return c.json({ success: true })
  })
  .get('/download/:filename', async (c) => {
    const filename = c.req.param('filename')
    const object = await c.env.BUCKET.get(filename)
    if (!object) {
      return c.json({ error: 'Not found' }, 404)
    }
    return new Response(object.body)
  })
```

## CORS Handling

```ts
import { cors } from 'hono/cors'

const app = new Hono()
  .use('/*', cors({
    origin: ['https://yourdomain.com'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }))
```

## Deployment

**Deploy API:**
```bash
cd apps/api
bun run deploy  # Runs wrangler deploy
```

**Deploy Web:**
```bash
cd apps/web
bun run deploy  # Deploys to Cloudflare Pages
```

**Wrangler handles:**
- ✅ Bundling with esbuild
- ✅ Uploading to Cloudflare
- ✅ Setting up service bindings
- ✅ Applying environment variables

## Common Patterns

**Edge-compatible libraries:**
- ✅ Hono (web framework)
- ✅ Zod (validation)
- ✅ Drizzle ORM (database)
- ✅ date-fns (date utilities)
- ❌ Express (uses Node.js APIs)
- ❌ fs, path, crypto (Node.js built-ins)

**Error handling:**
```ts
const app = new Hono()
  .onError((err, c) => {
    console.error(err)
    return c.json({ error: 'Internal server error' }, 500)
  })
```

**Scheduled events (Cron Triggers):**
```ts
export default {
  async scheduled(event, env, ctx) {
    // Runs on schedule defined in wrangler.toml
    console.log('Cron job executed')
  }
}
```
