# Underdog - Cloudflare Workers Fullstack Template

## Stack
- **Backend**: Hono API (Cloudflare Worker)
- **Frontend**: React + TanStack Router + React Query (Cloudflare Pages)
- **UI**: Tailwind CSS + shadcn/ui
- **Database**: Drizzle ORM + Cloudflare D1 (SQLite)
- **Auth**: Better Auth with session management
- **Build**: Turborepo monorepo, Bun package manager
- **Quality**: Ultracite (Biome) + Lefthook pre-commit hooks

> **Note**: This project uses **Bun exclusively**. Always use `bun` or `bunx` commands - never npm, yarn, pnpm, or npx.

## Monorepo Structure
```
├── apps/
│   ├── api/          # Hono API worker
│   │   ├── src/
│   │   │   ├── routes/          # API routes
│   │   │   ├── db/              # Database schemas and setup
│   │   │   └── middleware/      # Auth and other middleware
│   │   └── drizzle/             # Database migrations
│   └── web/          # React frontend
│       └── src/
│           ├── routes/          # TanStack Router pages
│           ├── components/      # React components
│           ├── hooks/           # React Query hooks
│           └── lib/             # Utilities
├── packages/
│   ├── config/       # Shared configuration (public constants)
│   ├── shared/       # Shared types and validation schemas
│   └── cli/          # Template scaffolding CLI
```

## Quick Start

```bash
# Install dependencies
bun install

# Start development servers
bun dev

# Build for production
bun run build

# Deploy to Cloudflare
bun run deploy
```

## File Placement
- **Shared constants/types (PUBLIC)** → `packages/config/` ⚠️ **Everything here is exposed to frontend**
- **Shared types/validation** → `packages/shared/src/[feature]/`
- **API routes** → `apps/api/src/routes/[feature]/`
- **Database schemas** → `apps/api/src/db/schema/`
- **React pages** → `apps/web/src/routes/` (file-based routing)
- **React components** → `apps/web/src/components/[feature]/`
- **React Query hooks** → `apps/web/src/hooks/[feature]/`
- **shadcn/ui components** → `apps/web/src/components/ui/`

> **Security Note:** Never put secrets, API keys, or sensitive data in `packages/config`. Use environment variables (`c.env`) on the API side for sensitive configuration.

## Import Aliases
```ts
// ✅ Use workspace aliases
import { config } from '@repo/config'

// Frontend aliases
import { Button } from '@/components/ui/button'
```

## Key Commands
```bash
bun dev              # Start dev servers
bun run build        # Build all apps
bun run deploy       # Deploy to Cloudflare
bun x ultracite fix  # Format/lint (auto on commit)
```

## Code Quality (Automated)
Pre-commit hook automatically runs `bun x ultracite fix` on every commit.
Focus on architecture, business logic, and UX - formatting is handled automatically.

## Core Principles
- Use consistent `container max-w-6xl mx-auto px-4` for layouts
- Import from `@repo/config` for shared constants
- Use TanStack Router `Link` for navigation
- Use shadcn components instead of custom UI primitives
- Provide `sr-only` labels for accessibility
- Export API types for RPC type safety
- Use service bindings for worker-to-worker communication
- Handle loading and error states explicitly
- **Always scope user data** - Check `userId` in database queries to prevent unauthorized access
- **Feature-based organization** - Group related code by feature, not by type
- **Separate data fetching** - Use custom hooks in `hooks/[feature]/` for React Query operations

## Navigation Structure

This template has **two navigation systems**:

### 1. Marketing Navigation (Header)
**Location:** `apps/web/src/components/header.tsx`

Simple top navigation bar for public pages:
- Used by: Landing page, About, Features, etc.
- Layout: `<Layout>` component (Header + Footer)
- Routes: `apps/web/src/routes/[page].tsx`
- **Navigation items:** Defined in `packages/config/src/index.ts` → `config.nav`

**To add a new public page to the header:**
1. Add route to config:
```tsx
// packages/config/src/index.ts
nav: [
  // ... existing items
  { label: 'Pricing', href: '/pricing' },
]
```
2. Create route: `apps/web/src/routes/pricing.tsx`

### 2. Dashboard Navigation (Sidebar)
**Location:** `apps/web/src/components/dashboard-sidebar.tsx`

Collapsible sidebar for authenticated dashboard pages:
- **Header section**: App branding and dashboard link
- **Content section**: Navigation menu items (Overview, Analytics, Team, Items, etc.)
- **Footer section**: User dropdown menu (Profile, Settings, Theme toggle, Sign out)
- Used by: All `/dashboard/*` routes
- Layout: `apps/web/src/routes/dashboard/route.tsx` (wraps all dashboard pages)
- **Navigation items:** Defined directly in `dashboard-sidebar.tsx` (NOT in config.ts)

**To add a new dashboard page to the sidebar:**

1. Create route: `apps/web/src/routes/dashboard/my-page.tsx`
2. Update `dashboard-sidebar.tsx` navItems array:
```tsx
// apps/web/src/components/dashboard-sidebar.tsx
import { MyIcon } from 'lucide-react'

const navItems = [
  // ... existing items
  {
    title: 'My Page',
    url: '/dashboard/my-page',
    icon: MyIcon,
  },
]
```

> **Note:** Dashboard navigation is separate from public navigation in `config.ts` because dashboard pages are authenticated and have different navigation patterns.

## Claude Commands

Use these commands to scaffold new code following established patterns:

- **`/new-api`** - Create a new Hono API route with CRUD operations
  - Creates: `apps/api/src/routes/[name].ts`
  - Includes: Zod validation, database integration, user scoping
  - See: `.claude/commands/new-api.md`

- **`/new-schema`** - Create new database tables with Drizzle ORM
  - Creates: `apps/api/src/db/schema/[feature].ts`
  - Templates: User-scoped tables, settings, enums, many-to-many
  - Includes: Migration workflow, integration checklist
  - See: `.claude/commands/new-schema.md`

- **`/new-route`** - Create a new TanStack Router page
  - Creates: `apps/web/src/routes/[path].tsx`
  - Options: Marketing page vs Dashboard page
  - Includes: Data fetching patterns, SSR prefetching
  - See: `.claude/commands/new-route.md`

- **`/new-component`** - Create a new React component
  - Creates: `apps/web/src/components/[feature]/[name].tsx`
  - Includes: shadcn/ui integration, data fetching with hooks
  - See: `.claude/commands/new-component.md`

- **`/new-form`** - Create a form with TanStack Form + Zod
  - Creates: Form component and validation schema
  - Includes: Field validation, async validation, React Query integration
  - See: `.claude/commands/new-form.md`

**Pattern:** All commands follow feature-based organization and separation of concerns
