import type { StrippableFeature } from '../types.js'

/**
 * Some files need complete replacement rather than marker stripping.
 * These are files where partial stripping doesn't make sense.
 */
export interface FileReplacement {
  /** Path relative to project root */
  path: string
  /** When to apply this replacement */
  condition: (removedFeatures: Set<StrippableFeature>) => boolean
  /** Replacement file content */
  content: string
}

export const FILE_REPLACEMENTS: FileReplacement[] = [
  {
    // When marketing is removed, the landing page becomes a redirect to /dashboard
    path: 'apps/web/src/routes/index.tsx',
    condition: (removed) => removed.has('marketing'),
    content: `import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})
`,
  },
]
