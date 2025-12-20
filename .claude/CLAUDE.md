# Underdog - Cloudflare Workers Fullstack Template

## Stack
- **Backend**: Hono API (Cloudflare Worker)
- **Frontend**: React + TanStack Router + React Query (Cloudflare Pages)
- **UI**: Tailwind CSS + shadcn/ui
- **Build**: Turborepo monorepo, Bun package manager
- **Quality**: Ultracite (Biome) + Lefthook pre-commit hooks

> **Note**: This project uses **Bun exclusively**. Always use `bun` or `bunx` commands - never npm, yarn, pnpm, or npx.

## Monorepo Structure
```
├── apps/
│   ├── api/          # Hono API worker
│   └── web/          # React frontend
├── packages/
│   ├── config/       # Shared configuration
│   └── cli/          # Template scaffolding CLI
```

## File Placement
- **Shared constants/types** → `packages/config/`
- **API routes** → `apps/api/src/routes/`
- **React pages** → `apps/web/src/routes/` (file-based routing)
- **Reusable components** → `apps/web/src/components/`
- **shadcn/ui components** → `apps/web/src/components/ui/`

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
