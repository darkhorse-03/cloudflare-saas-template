import type { FeatureDefinition, FeatureName } from '../types.js'

export const FEATURE_CATALOG: Record<FeatureName, FeatureDefinition> = {
  storage: {
    name: 'storage',
    label: 'Storage (R2)',
    description: 'File uploads and avatar management via Cloudflare R2',
    use_when: 'Your app needs file uploads, images, avatars, or document attachments',
    recommended_with: ['jobs'],
    depends_on: [],
    env_vars: [], // R2 is auto-provisioned via Alchemy
  },
  payments: {
    name: 'payments',
    label: 'Payments (Polar)',
    description: 'Subscription billing and checkout via Polar.sh',
    use_when: 'Your app has paid plans, subscriptions, or one-time purchases',
    recommended_with: ['email'],
    depends_on: [],
    env_vars: [
      { name: 'POLAR_ACCESS_TOKEN', url: 'polar.sh/settings' },
      { name: 'POLAR_WEBHOOK_SECRET', url: 'polar.sh/settings/webhooks' },
    ],
  },
  email: {
    name: 'email',
    label: 'Email (Resend)',
    description: 'Transactional email — verification, magic links, welcome emails',
    use_when: 'You need email verification, magic link login, or notification emails',
    recommended_with: ['jobs'],
    depends_on: [],
    env_vars: [
      { name: 'RESEND_API_KEY', url: 'resend.com/api-keys' },
      { name: 'FROM_EMAIL', url: 'your sending email address' },
    ],
  },
  jobs: {
    name: 'jobs',
    label: 'Background Jobs (Queues)',
    description: 'Async background processing via Cloudflare Queues',
    use_when: 'You need async work outside the request cycle (email delivery, exports, cleanup)',
    recommended_with: ['email'],
    depends_on: [],
    env_vars: [],
  },
  workflows: {
    name: 'workflows',
    label: 'Workflows (Cloudflare)',
    description: 'Multi-step durable orchestration via Cloudflare Workflows',
    use_when: 'You need multi-day processes, onboarding sequences, or sagas',
    recommended_with: ['jobs', 'email'],
    depends_on: [],
    env_vars: [],
  },
  turnstile: {
    name: 'turnstile',
    label: 'Bot Protection (Turnstile)',
    description: 'Cloudflare Turnstile CAPTCHA on auth forms',
    use_when: 'You want bot protection on sign-in/sign-up forms',
    recommended_with: [],
    depends_on: [],
    env_vars: [{ name: 'TURNSTILE_SECRET_KEY', url: 'dash.cloudflare.com/turnstile' }],
  },
  docs: {
    name: 'docs',
    label: 'Documentation Site',
    description: 'Fumadocs + TanStack Start documentation app',
    use_when: 'Your product needs user-facing documentation or API docs',
    recommended_with: [],
    depends_on: [],
    env_vars: [],
  },
  marketing: {
    name: 'marketing',
    label: 'Marketing Pages',
    description: 'Landing page with hero, features, comparisons, and CTA',
    use_when: 'You need a public landing page with marketing content',
    recommended_with: [],
    depends_on: [],
    env_vars: [],
  },
  'google-oauth': {
    name: 'google-oauth',
    label: 'Google OAuth',
    description: 'Sign in with Google',
    use_when: 'Your users expect Google sign-in (consumer apps)',
    recommended_with: [],
    depends_on: [],
    env_vars: [
      { name: 'GOOGLE_CLIENT_ID', url: 'console.cloud.google.com/apis/credentials' },
      { name: 'GOOGLE_CLIENT_SECRET', url: 'console.cloud.google.com/apis/credentials' },
    ],
  },
  'github-oauth': {
    name: 'github-oauth',
    label: 'GitHub OAuth',
    description: 'Sign in with GitHub',
    use_when: 'Your users are developers who expect GitHub sign-in',
    recommended_with: [],
    depends_on: [],
    env_vars: [
      { name: 'GITHUB_CLIENT_ID', url: 'github.com/settings/developers' },
      { name: 'GITHUB_CLIENT_SECRET', url: 'github.com/settings/developers' },
    ],
  },
}

export const ALL_FEATURES = Object.keys(FEATURE_CATALOG) as FeatureName[]
