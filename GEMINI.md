# Code Quality & Architecture Standards

This project uses **Ultracite** (Biome-based linting/formatting) with **automated enforcement via Lefthook pre-commit hooks**.

## Code Quality (Automated)

**You don't need to think about formatting or basic linting** - it's handled automatically:

- ✅ **Pre-commit hook** runs `bun x ultracite fix` on every commit
- ✅ **Auto-formats** code (spacing, quotes, semicolons, imports)
- ✅ **Auto-fixes** common issues (unused vars, missing keys, etc.)
- ✅ **Enforces** TypeScript strict mode, React best practices, accessibility

**Manual commands (rarely needed):**
```bash
bun x ultracite fix      # Fix everything
bun x ultracite check    # Check without fixing
bun x ultracite doctor   # Diagnose setup issues
```

## Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**.

**Focus your attention on:**
1. **Architecture** - Following the patterns below (Hono routes, React components, etc.)
2. **Business logic** - Algorithms and data flow
3. **Naming** - Descriptive variable/function names
4. **Edge cases** - Error states, loading states, null checks
5. **Accessibility** - Semantic HTML, ARIA labels, keyboard navigation
6. **User experience** - Intuitive interactions, helpful error messages

**Don't worry about:**
- Formatting (spaces, quotes, semicolons) → Automated
- Import sorting → Automated
- Unused variables → Automated
- Missing React keys → Automated
- Basic TypeScript errors → Automated

---

# Project-Specific Architecture Rules

This template is a **Cloudflare Workers fullstack monorepo** using Hono, React, TanStack Router, and React Query. Follow these conventions to maintain consistency.

## Monorepo Structure

```
├── apps/
│   ├── api/          # Hono API worker (Cloudflare Worker)
│   └── web/          # React frontend (static site on Pages)
├── packages/
│   ├── config/       # Shared configuration (app name, nav, etc.)
│   └── cli/          # Template scaffolding CLI
```

### File Placement Rules

- **Shared constants/types** → `packages/config/`
- **API routes** → `apps/api/src/routes/`
- **React pages** → `apps/web/src/routes/` (file-based routing)
- **Reusable components** → `apps/web/src/components/`
- **shadcn/ui components** → `apps/web/src/components/ui/`
- **Hooks** → `apps/web/src/hooks/`
- **Types** → Co-locate with usage OR `apps/{api|web}/src/types/`

### Importing Across Packages

```ts
// ✅ Use workspace aliases
import { config } from '@repo/config'

// ❌ Don't use relative paths across packages
import { config } from '../../../packages/config/src'
```

---

## Cloudflare Workers Best Practices

### Service Bindings (Worker-to-Worker Communication)

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

### Platform Constraints

**Be aware of Cloudflare Workers limits:**
- ✅ Keep bundles under 1MB (use code splitting)
- ✅ Use edge-compatible libraries only (no Node.js built-ins)
- ✅ Stateless workers (no in-memory state between requests)
- ✅ Max 50ms CPU time per request (use Durable Objects for longer tasks)
- ❌ No file system access (use R2, KV, or D1)
- ❌ No `process.env` (use `env` bindings)

---

## Hono API Patterns

### Route Organization

```ts
// apps/api/src/routes/users.ts
import { Hono } from 'hono'

const users = new Hono()

users.get('/', (c) => c.json({ users: [] }))
users.post('/', async (c) => { /* ... */ })

export default users
```

```ts
// apps/api/src/index.ts
import users from './routes/users'

app.route('/users', users)
```

### RPC Type Safety

**Always export the API type for frontend consumption:**

```ts
// apps/api/src/index.ts
const app = new Hono()
  .get('/health', (c) => c.json({ status: 'ok' }))

export type ApiType = typeof app  // ✅ Export this!
export default app
```

```ts
// apps/web/src/lib/api-client.ts
import { hc } from 'hono/client'
import type { ApiType } from '@api/index'  // ✅ Import the type

export const apiClient = hc<ApiType>('/api')
```

### Error Handling

```ts
// ✅ Return proper HTTP status codes
app.get('/users/:id', async (c) => {
  const user = await getUser(c.req.param('id'))
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  return c.json(user)
})

// ❌ Don't throw unhandled errors
app.get('/users/:id', async (c) => {
  const user = await getUser(c.req.param('id'))
  if (!user) throw new Error('Not found')  // ❌ Unclear status code
})
```

---

## TanStack Router Conventions

### File-Based Routing

```
apps/web/src/routes/
├── __root.tsx         # Root layout
├── index.tsx          # / route
├── about.tsx          # /about route
└── users/
    ├── index.tsx      # /users route
    └── $id.tsx        # /users/:id route
```

### Route File Structure

```tsx
// apps/web/src/routes/users.tsx
import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'

export const Route = createFileRoute('/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Content */}
      </div>
    </Layout>
  )
}
```

**Always:**
- ✅ Export `Route` with `createFileRoute`
- ✅ Define component in same file (not imported from components/)
- ✅ Use `Layout` wrapper for consistent header/footer
- ✅ Use standard container: `container max-w-6xl mx-auto px-4`

### Type-Safe Navigation

```tsx
// ✅ Use Link from TanStack Router
import { Link } from '@tanstack/react-router'

<Link to="/users/$id" params={{ id: '123' }}>View User</Link>

// ❌ Don't use HTML anchor tags for internal navigation
<a href="/users/123">View User</a>
```

---

## React Query with Hono RPC

### Data Fetching Pattern

```tsx
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

function UsersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiClient.users.$get()
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{JSON.stringify(data)}</div>
}
```

**Conventions:**
- ✅ Use descriptive `queryKey` arrays: `['users', userId]`
- ✅ Handle loading and error states explicitly
- ✅ Throw errors in `queryFn` for React Query to catch
- ✅ Use mutations (`useMutation`) for POST/PUT/DELETE

---

## shadcn/ui Component Usage

### When to Use shadcn Components

```tsx
// ✅ Use shadcn components for UI primitives
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click Me</Button>
  </CardContent>
</Card>

// ❌ Don't recreate UI primitives from scratch
<div className="rounded-lg border bg-card p-6">
  <h3 className="font-semibold">Title</h3>
  <div className="mt-4">
    <button className="px-4 py-2 bg-primary text-white">Click Me</button>
  </div>
</div>
```

### Adding New shadcn Components

```bash
# ✅ Add components via CLI
cd apps/web
bunx shadcn@latest add dialog

# ✅ Components are installed to apps/web/src/components/ui/
```

### Accessibility with shadcn

**Always provide accessible labels for interactive elements:**

```tsx
// ✅ For dialogs/sheets/modals (using sr-only for hidden titles)
<SheetContent>
  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
  <SheetDescription className="sr-only">
    Navigate to different pages and adjust settings
  </SheetDescription>
  {/* Visible content */}
</SheetContent>

// ✅ For buttons with icons only
<Button variant="ghost" size="icon">
  <Menu className="h-5 w-5" />
  <span className="sr-only">Open menu</span>
</Button>
```

---

## Layout & Styling Conventions

### Container Pattern

**Use consistent max-width containers across all pages:**

```tsx
// ✅ Standard container pattern
<div className="container max-w-6xl mx-auto px-4 py-12">
  {/* Page content */}
</div>

// ❌ Don't use inconsistent widths
<div className="container max-w-4xl mx-auto px-4 py-12">  // Wrong!
```

**Standard width:** `max-w-6xl` (1152px)

### Responsive Design

```tsx
// ✅ Mobile-first responsive classes
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

// ✅ Hide on mobile, show on desktop
<nav className="hidden md:flex items-center gap-1">

// ✅ Show on mobile, hide on desktop
<div className="md:hidden">
```

### Button Semantics

```tsx
// ✅ Use <button> for interactions (not <div>)
<button
  type="button"
  onClick={handleClick}
  className="px-4 py-2 bg-primary text-white rounded"
>
  Click Me
</button>

// ❌ Don't use divs for clickable elements
<div onClick={handleClick}>Click Me</div>
```

---

## Shared Configuration Pattern

### Using @repo/config

**Store shared constants in the config package:**

```ts
// packages/config/src/index.ts
export const config = {
  appName: 'underdog',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
  ],
  social: {
    github: 'https://github.com/...',
  },
} as const
```

```tsx
// apps/web/src/components/header.tsx
import { config } from '@repo/config'

<Link to="/">{config.appName}</Link>
```

**What goes in config:**
- ✅ App name, tagline, description
- ✅ Navigation links
- ✅ Social media links
- ✅ Footer links
- ✅ Feature flags
- ❌ API URLs (use env variables)
- ❌ Secrets (use Cloudflare secrets)

---

## CLI Development (create-underdog-app)

### Modular Structure

```
packages/cli/
├── index.ts           # Entry point (orchestration only)
├── helpers/
│   ├── prompts.ts     # User input collection
│   ├── clone.ts       # Template cloning
│   ├── config.ts      # Config file updates
│   ├── git.ts         # Git initialization
│   └── install.ts     # Dependency installation
```

**Rules:**
- ✅ Keep `index.ts` under 100 lines (orchestration only)
- ✅ Each helper exports one primary function
- ✅ Use `@clack/prompts` for all user interaction
- ✅ Prefix unused error variables with `_error`
- ✅ Use template literals for string concatenation

---

## Testing (When Implemented)

### What to Test

**API (apps/api):**
- ✅ Route handlers return correct status codes
- ✅ Error cases are handled properly
- ✅ Service bindings work as expected
- ✅ Database queries return expected data

**Frontend (apps/web):**
- ✅ Components render without errors
- ✅ User interactions work correctly
- ✅ Loading/error states display properly
- ✅ Accessibility (keyboard navigation, screen readers)

### Testing Tools (TBD)

- API: Vitest + Cloudflare Workers test environment
- Frontend: Vitest + React Testing Library
- E2E: Playwright (optional)

---

## Database Patterns (When D1 is Added)

### Drizzle ORM Conventions

```ts
// ✅ Define schemas in apps/api/src/db/schema.ts
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

// ✅ Use typed queries
const user = await db.select().from(users).where(eq(users.id, userId))
```

### Migration Strategy

- ✅ One migration file per schema change
- ✅ Never edit existing migrations
- ✅ Use descriptive migration names: `0001_add_users_table.sql`
- ✅ Test migrations in development before deploying

---

## Environment Variables & Secrets

### Local Development

```toml
# apps/api/.dev.vars (gitignored)
DATABASE_URL=...
API_KEY=...
```

### Production

```bash
# Use Wrangler secrets (never commit)
wrangler secret put API_KEY
```

### Accessing in Code

```ts
// ✅ Use env bindings (Cloudflare Workers)
export default {
  fetch(request, env: Env) {
    const apiKey = env.API_KEY  // ✅
    // Never use process.env in Workers!
  }
}
```

---

## Git & Deployment

### Commit Messages

Follow conventional commits:
```
feat: add user authentication
fix: resolve mobile menu overlap
docs: update README with setup instructions
chore: upgrade dependencies
refactor: extract config helper
```

### Pre-Commit Hooks

**Lefthook automatically runs:**
```yaml
pre-commit:
  jobs:
    - run: bun x ultracite fix
      stage_fixed: true
```

No manual intervention needed - code is auto-formatted on commit.

### Deployment

```bash
# Deploy API
cd apps/api && bun run deploy

# Deploy Web
cd apps/web && bun run deploy
```

**Wrangler handles:**
- ✅ Bundling with esbuild
- ✅ Uploading to Cloudflare
- ✅ Setting up service bindings
- ✅ Applying environment variables

---

## Common Patterns Summary

### Always Do:
- ✅ Use `container max-w-6xl mx-auto px-4` for page containers
- ✅ Import from `@repo/config` for shared constants
- ✅ Use TanStack Router `Link` for navigation
- ✅ Use shadcn components instead of custom UI primitives
- ✅ Provide `sr-only` labels for screen reader accessibility
- ✅ Export API types for RPC type safety
- ✅ Use service bindings for worker-to-worker communication
- ✅ Handle loading and error states explicitly

### Never Do:
- ❌ Use inconsistent container widths
- ❌ Import across packages with relative paths
- ❌ Use HTML `<a>` tags for internal navigation
- ❌ Recreate shadcn components from scratch
- ❌ Use `<div>` with `onClick` (use `<button>`)
- ❌ Forget accessibility attributes (alt, aria-label, sr-only)
- ❌ Use `process.env` in Cloudflare Workers
- ❌ Make HTTP calls between your own workers (use service bindings)

---

This document complements Ultracite's code quality rules with project-specific architecture decisions. When in doubt, prioritize consistency with existing patterns over innovation.
