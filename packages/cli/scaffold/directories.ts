import type { StrippableFeature } from '../types.js'

/**
 * Maps each feature to the files and directories it exclusively owns.
 * These paths are deleted entirely when the feature is not selected.
 * Paths are relative to the project root.
 */
export const FEATURE_OWNED_PATHS: Record<StrippableFeature, string[]> = {
  storage: [
    'apps/api/src/routes/storage',
    'apps/api/src/lib/storage',
    'apps/web/src/components/storage',
    'apps/web/src/hooks/storage',
    'apps/web/src/routes/dashboard/storage.tsx',
  ],
  payments: [
    'apps/api/src/auth/polar-plugin.ts',
    'apps/web/src/components/payments',
    'apps/web/src/hooks/payments',
    'apps/web/src/routes/dashboard/billing.tsx',
    'apps/web/src/routes/pricing.tsx',
  ],
  email: [
    'apps/api/src/lib/email',
    'apps/api/src/auth/email-plugins.ts',
    'apps/api/src/db/schema/email.ts',
    'apps/api/src/jobs/handlers/email.ts',
  ],
  jobs: ['apps/api/src/jobs'],
  workflows: ['apps/api/src/workflows'],
  turnstile: ['apps/web/src/components/auth/turnstile.tsx'],
  docs: ['apps/docs'],
  marketing: [
    'apps/web/src/components/marketing',
    'apps/web/src/components/demos',
    'apps/web/src/components/header.tsx',
    'apps/web/src/components/footer.tsx',
    'apps/web/src/components/layout.tsx',
    'apps/web/src/components/feature-cards.tsx',
    'apps/web/src/components/service-binding-card.tsx',
    'apps/web/src/components/architecture-diagram.tsx',
    'apps/web/src/components/hono-rpc-card.tsx',
    'apps/web/src/components/react-query-card.tsx',
  ],
  'google-oauth': [], // All handled by markers in shared files
  'github-oauth': [], // All handled by markers in shared files
  demo: [
    'apps/api/src/routes/demo',
    'apps/api/src/routes/seed.ts',
    'apps/api/src/db/schema/demo.ts',
    'apps/api/src/jobs/handlers/export.ts',
    'apps/api/src/jobs/handlers/cleanup.ts',
    'apps/web/src/routes/dashboard/items.tsx',
    'apps/web/src/components/demo',
    'apps/web/src/hooks/demo',
  ],
}
