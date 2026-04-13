import type { StrippableFeature } from '../types.js'

/**
 * Maps features to npm packages that should be removed from package.json
 * when the feature is not selected.
 */
export const FEATURE_DEPENDENCIES: Record<
  StrippableFeature,
  { packages: string[]; locations: string[] }
> = {
  payments: {
    packages: ['@polar-sh/better-auth', '@polar-sh/sdk'],
    locations: ['apps/api', 'apps/web'],
  },
  email: {
    packages: ['resend', '@react-email/components', '@react-email/render'],
    locations: ['apps/api'],
  },
  turnstile: {
    packages: ['@marsidev/react-turnstile'],
    locations: ['apps/web'],
  },
  storage: {
    packages: [],
    locations: [],
  },
  jobs: {
    packages: [],
    locations: [],
  },
  workflows: {
    packages: [],
    locations: [],
  },
  docs: {
    packages: [],
    locations: [],
  },
  marketing: {
    packages: [],
    locations: [],
  },
  'google-oauth': {
    packages: [],
    locations: [],
  },
  'github-oauth': {
    packages: [],
    locations: [],
  },
  demo: {
    packages: [],
    locations: [],
  },
}
