import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { FeatureName } from '../types.js'

/**
 * Generate project-specific CLAUDE.md and other agent context files.
 * Only includes documentation for selected features.
 */
export function generateContextFiles(
  projectDir: string,
  projectName: string,
  selectedFeatures: Set<FeatureName>,
): void {
  const content = buildClaudeMd(projectName, selectedFeatures)

  // Claude Code
  mkdirSync(join(projectDir, '.claude'), { recursive: true })
  writeFileSync(join(projectDir, '.claude', 'CLAUDE.md'), content)

  // Cursor
  mkdirSync(join(projectDir, '.cursor', 'rules'), { recursive: true })
  writeFileSync(
    join(projectDir, '.cursor', 'rules', 'project.mdc'),
    `---\ndescription: Project conventions and patterns for ${projectName}\nalwaysApply: true\n---\n\n${content}`,
  )

  // Codex
  writeFileSync(join(projectDir, 'AGENTS.md'), content)

  // Windsurf
  writeFileSync(join(projectDir, '.windsurfrules'), content)

  // Copilot
  mkdirSync(join(projectDir, '.github'), { recursive: true })
  writeFileSync(join(projectDir, '.github', 'copilot-instructions.md'), content)
}

function buildClaudeMd(projectName: string, features: Set<FeatureName>): string {
  const sections: string[] = [buildBaseSection(projectName, features)]

  const featureSections: [FeatureName, string][] = [
    ['email', EMAIL_SECTION],
    ['storage', STORAGE_SECTION],
    ['payments', PAYMENTS_SECTION],
    ['jobs', JOBS_SECTION],
    ['workflows', WORKFLOWS_SECTION],
    ['marketing', MARKETING_SECTION],
    ['docs', DOCS_SECTION],
  ]
  for (const [name, section] of featureSections) {
    if (features.has(name)) {
      sections.push(section)
    }
  }

  sections.push(buildDeploymentSection(features))
  sections.push(RATE_LIMITING_SECTION)
  sections.push(LOGGING_SECTION)

  return sections.join('\n\n')
}

function buildBaseSection(projectName: string, features: Set<FeatureName>): string {
  const stackLines = [
    '- **Backend**: Hono API (Cloudflare Worker)',
    '- **Frontend**: React + TanStack Router + React Query (Cloudflare Pages)',
    '- **UI**: Tailwind CSS + shadcn/ui',
    '- **Database**: Drizzle ORM + Cloudflare D1 (SQLite)',
    '- **Auth**: Better Auth with session management',
  ]
  const optionalStack: [FeatureName, string][] = [
    ['email', '- **Email**: Resend transactional email'],
    ['storage', '- **Storage**: Cloudflare R2'],
    ['payments', '- **Payments**: Polar.sh billing'],
    ['jobs', '- **Jobs**: Cloudflare Queues'],
    ['workflows', '- **Workflows**: Cloudflare Workflows'],
  ]
  for (const [name, line] of optionalStack) {
    if (features.has(name)) {
      stackLines.push(line)
    }
  }
  stackLines.push('- **Build**: Turborepo monorepo, Bun package manager')
  stackLines.push('- **Quality**: Ultracite (Biome) + Lefthook pre-commit hooks')

  const apps = ['api/ — Hono API worker', 'web/ — React frontend']
  if (features.has('docs')) {
    apps.push('docs/ — Documentation site (Fumadocs + TanStack Start)')
  }

  return `# ${projectName} - Cloudflare Workers Fullstack App

## Stack
${stackLines.join('\n')}

> **Note**: This project uses **Bun exclusively**. Always use \`bun\` or \`bunx\` commands.

## Monorepo Structure
\`\`\`
├── apps/
│   ├── ${apps.join('\n│   ├── ')}
├── packages/
│   ├── config/ — Shared configuration (public constants)
│   └── shared/ — Shared types and validation schemas
\`\`\`

## Quick Start
\`\`\`bash
bun install
bun dev
bun run build
bun run deploy
\`\`\`

## File Placement
- **Shared constants/types (PUBLIC)** → \`packages/config/\`
- **Shared types/validation** → \`packages/shared/src/[feature]/\`
- **API routes** → \`apps/api/src/routes/[feature]/\`
- **Database schemas** → \`apps/api/src/db/schema/\`
- **React pages** → \`apps/web/src/routes/\` (file-based routing)
- **React components** → \`apps/web/src/components/[feature]/\`
- **React Query hooks** → \`apps/web/src/hooks/[feature]/\`
- **shadcn/ui components** → \`apps/web/src/components/ui/\`

## Core Principles
- Use \`container max-w-6xl mx-auto px-4\` for layouts
- Import from \`@repo/config\` for shared constants
- Use TanStack Router \`Link\` for navigation
- Use shadcn components instead of custom UI primitives
- Provide \`sr-only\` labels for accessibility
- Export API types for RPC type safety
- Handle loading and error states explicitly
- **Always scope user data** — Check \`userId\` in database queries
- **Feature-based organization** — Group related code by feature

## API Communication (CRITICAL)

**NEVER use custom fetch calls with URL strings.** Use Hono RPC:

\`\`\`ts
import { api } from '@/lib/api'

const res = await api.demo.items.$get()
const res = await api.demo.items[':id'].$get({ param: { id } })
const res = await api.demo.items.$post({ json: data })
\`\`\`

## Authentication (CRITICAL)

**Use Better Auth's client methods:**

\`\`\`ts
import { signIn, signUp, signOut, useSession } from '@/lib/auth-client'

const { data, error } = await signIn.email({ email, password })
const { data: session, isPending } = useSession()
\`\`\``
}

const EMAIL_SECTION = `## Email Service

Use Resend for transactional email:

\`\`\`ts
const emailService = createEmailService(c.env)
await emailService.send({
  to: { email: user.email },
  subject: 'Welcome!',
  react: WelcomeEmail({ userName: user.name }),
})
\`\`\`

**Email templates:** \`apps/api/src/lib/email/templates/\`
**Email types:** verification, magic_link, password_reset, welcome`

const STORAGE_SECTION = `## File Storage

Cloudflare R2 for uploads and avatars:

\`\`\`ts
// Upload via RPC
const res = await api.storage.upload.$post({ form: formData })

// Avatar management
const res = await api.storage.avatars[':userId'].$post({ form: formData })
\`\`\`

**Routes:** \`apps/api/src/routes/storage/\`
**Config:** \`packages/config/src/index.ts\` → \`config.storage\``

const PAYMENTS_SECTION = `## Payments

Polar.sh for subscriptions and billing:

\`\`\`ts
import { useSubscription } from '@/hooks/payments/use-subscription'

const { checkout, useHasPaidPlan } = useSubscription()
const hasPaid = useHasPaidPlan()
await checkout('pro-monthly')
\`\`\`

**Config:** \`packages/config/src/index.ts\` → \`config.payments\`
**Plugin:** \`apps/api/src/auth/polar-plugin.ts\``

const JOBS_SECTION = `## Background Jobs

Cloudflare Queues for async processing:

\`\`\`ts
import { enqueue } from '@/jobs'

await enqueue(c.env.JOBS, {
  type: 'email.send',
  to: user.email,
  subject: 'Welcome!',
  template: 'welcome',
  data: { name: user.name },
})
\`\`\`

**Create new jobs:** Add to \`apps/api/src/jobs/types.ts\` and \`apps/api/src/jobs/handlers/\`
**Config:** \`packages/config/src/index.ts\` → \`config.jobs\``

const WORKFLOWS_SECTION = `## Workflows

Cloudflare Workflows for multi-step orchestration:

**Definitions:** \`apps/api/src/workflows/definitions/\`
**Types:** \`apps/api/src/workflows/types.ts\``

const MARKETING_SECTION = `## Marketing Navigation

Public navigation is configured in \`packages/config/src/index.ts\` → \`config.nav\`:

\`\`\`ts
nav: [
  { label: 'Home', href: '/', newTab: false },
  { label: 'Pricing', href: '/pricing', newTab: false },
]
\`\`\`

**Components:** \`apps/web/src/components/marketing/\`
**Layout:** \`apps/web/src/components/layout.tsx\` (Header + Footer)`

const DOCS_SECTION = `## Documentation Site

Fumadocs + TanStack Start at \`apps/docs/\`:
- Routes: \`template.zynth.dev/docs\` and \`template.zynth.dev/docs/*\`
- Worker strips \`/docs\` prefix before serving assets
- All doc pages must be listed in \`vite.config.ts\` for prerendering`

function buildDeploymentSection(features: Set<FeatureName>): string {
  const workers = ['- **Web**: Main React app', '- **API**: Hono API worker (via service binding)']
  if (features.has('docs')) {
    workers.push('- **Docs**: Documentation site (separate worker)')
  }

  return `## Deployment (Alchemy)

Uses Alchemy for infrastructure-as-code deployment to Cloudflare.

### Workers
${workers.join('\n')}

### Required Environment Variables
\`\`\`bash
CLOUDFLARE_API_TOKEN    # Workers, KV, D1, DNS permissions
CLOUDFLARE_ZONE_ID      # From Cloudflare Dashboard
ALCHEMY_PASSWORD        # State encryption password
\`\`\``
}

const RATE_LIMITING_SECTION = `## Rate Limiting

All API routes (except \`/auth/*\`) are rate-limited via Cloudflare Rate Limiting bindings.

**Middleware:** \`apps/api/src/middleware/rate-limit.ts\`
**Config:** \`packages/config/src/index.ts\` → \`config.rateLimit.tiers\``

const LOGGING_SECTION = `## Logging

Use structured JSON logging via \`c.get('log')\`:

\`\`\`ts
app.post('/items', async (c) => {
  const log = c.get('log')
  log.info('items.create', { name: data.name, userId: user.id })
  log.error('items.create.failed', { error: err.message })
})
\`\`\`

**View logs:** \`wrangler tail --format=json\``
