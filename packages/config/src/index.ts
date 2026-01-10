/**
 * Shared configuration for the entire application
 * Used by both web and API workers
 *
 * ⚠️ WARNING: Everything in this file is PUBLIC and exposed to the frontend.
 * ⚠️ DO NOT put secrets, API keys, or sensitive data here.
 * ⚠️ Use environment variables (c.env) for secrets on the API side.
 */

export const config = {
  appName: 'zynth',
  tagline: 'Ship in 60 Seconds, Not 3 Days',
  description:
    'Skip the setup hell. Auth, database, and type-safe APIs pre-configured. Optimized for AI-assisted development with Claude Code. Built for indie hackers who ship fast.',

  // Deployment configuration
  domains: {
    web: 'template.zynth.dev',
  },
  webUrl: 'https://template.zynth.dev',

  // SEO & Open Graph
  seo: {
    title: 'Zynth - Ship Your SaaS This Weekend',
    description:
      'Deploy in 60 seconds. Skip 3 days of setup. Cloudflare Workers template with auth, database, and type-safe APIs. Optimized for AI-assisted development with Claude Code.',
    url: 'https://template.zynth.dev',
    ogImage: 'https://template.zynth.dev/og-image.png',
  },

  // Development tools configuration
  devtools: {
    enabled: false,
  },

  // Auth feature flags
  auth: {
    enableMagicLink: true,
    enableGoogleOAuth: true,
    enableGitHubOAuth: false,
    // Cloudflare Turnstile (bot protection)
    // Get keys from: https://dash.cloudflare.com/turnstile
    turnstileSiteKey: '', // Leave empty to disable
  },

  // Storage configuration (Cloudflare R2 + Images)
  // Set enabled: true and configure R2 bucket to activate
  storage: {
    enabled: true,
    // General upload limits
    maxFileSize: 10 * 1024 * 1024, // 10MB default
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
    // Avatar-specific settings
    avatars: {
      maxSize: 2 * 1024 * 1024, // 2MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    },
  },

  // Payments configuration (Polar.sh)
  // Set enabled: true and configure products in Polar dashboard
  payments: {
    enabled: true, // Enable when ready to accept payments

    // Define plans/tiers - developers can add more plans as needed
    // Each plan maps to Polar product IDs for different billing cycles
    // Optional free tier - remove to hide free plan
    freePlan: {
      name: 'Free',
      description: 'Perfect for getting started',
      features: ['Basic features', 'Community support', 'Limited usage'],
    },

    // Paid plans - add/remove as needed
    plans: {
      pro: {
        name: 'Pro',
        description: 'For serious builders',
        features: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
        popular: true, // Show "Most Popular" badge
        pricing: {
          // Only include pricing options you want to offer
          monthly: { price: 19, productId: 'a7c921ed-cc4f-4a5b-af31-2ba88f7d6334' },
          // yearly: { price: 15, productId: '' }, // price per month, billed annually
          // lifetime: { price: 299, productId: '' },
        },
      },
      // Example: Add more tiers
      // enterprise: {
      //   name: 'Enterprise',
      //   description: 'For teams and organizations',
      //   features: ['Everything in Pro', 'Custom integrations', 'Dedicated support'],
      //   pricing: {
      //     monthly: { price: 49, productId: '' },
      //     yearly: { price: 39, productId: '' },
      //   },
      // },
    },

    // Plan hierarchy for access control (index determines priority)
    // Higher index = more access. Used by hasAccess() helper.
    // e.g., ['pro', 'enterprise'] means enterprise users can access pro features
    hierarchy: ['pro'],

    // Checkout success/cancel URLs
    successUrl: '/dashboard?payment=success',
    cancelUrl: '/pricing',

    // Use 'sandbox' for testing, 'production' for live
    server: 'sandbox' as const,
  },

  // Public/Marketing navigation links (Header component only)
  // Note: Dashboard sidebar navigation is defined separately in dashboard-sidebar.tsx
  nav: [
    { label: 'Home', href: '/', newTab: false },
    { label: 'Pricing', href: '/pricing', newTab: false },
    { label: 'Docs', href: '/docs', newTab: true },
  ],

  // Public footer links
  footer: {
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'GitHub', href: 'https://github.com/yourusername/your-repo' },
    ],
  },

  // Social links (optional)
  social: {
    github: 'https://github.com/yourusername/your-repo',
    twitter: '',
  },

  // Marketing content
  marketing: {
    hero: {
      headline: 'Ship Your SaaS This Weekend',
      subheadline: 'Not Next Quarter',
      description:
        'Skip the setup hell. Pre-configured auth, database, and type-safe APIs. Optimized for Claude Code.',
      cliCommand: 'bunx create-zynth-app',
      trustSignal: 'Built for indie hackers who ship fast with AI',
    },

    painPoints: [
      {
        id: 'auth',
        title: 'Auth + Sessions',
        timeWithout: '8 hours',
        timeWith: '0 minutes',
        tasksWithout: [
          'Choose auth library',
          'Setup sessions',
          'Build login/signup forms',
          'Form validation',
          'Protected routes',
          'Rate limiting',
          'Bot protection',
        ],
        tasksWith: [
          'Better Auth pre-built',
          'Forms ready',
          'Sessions working',
          'Rate limiting configured',
          'Bot protection ready',
        ],
        quoteWithout: '"Auth is a nightmare"',
        quoteWith: '"Already shipping"',
      },
      {
        id: 'database',
        title: 'Database + ORM',
        timeWithout: '6 hours',
        timeWith: '0 minutes',
        tasksWithout: [
          'Choose ORM',
          'Configure D1',
          'Write schema',
          'Setup migrations',
          'Debug bindings',
          'Test locally',
        ],
        tasksWith: ['D1 ready', 'Drizzle configured', 'Schema working', 'Migrations automated'],
        quoteWithout: '"Finally works in prod"',
        quoteWith: '"Just works"',
      },
      {
        id: 'deployment',
        title: 'Deployment Config',
        timeWithout: '6 hours',
        timeWith: '1 command',
        tasksWithout: [
          'Read Cloudflare docs',
          'Configure wrangler',
          'Setup env variables',
          'Debug worker issues',
          'Production secrets',
        ],
        tasksWith: ['bun run deploy', "That's it"],
        quoteWithout: '"Production is broken"',
        quoteWith: '"Deployed globally"',
      },
      {
        id: 'type-safety',
        title: 'Type-Safe APIs',
        timeWithout: '4 hours',
        timeWith: '0 minutes',
        tasksWithout: [
          'Setup RPC client',
          'Configure Hono',
          'Share types manually',
          'Debug mismatches',
        ],
        tasksWith: ['Hono RPC ready', 'Auto-typed endpoints', 'Full IDE support'],
        quoteWithout: '"Runtime errors everywhere"',
        quoteWith: '"Catches errors at compile"',
      },
    ],

    timeline: [
      {
        time: 0,
        label: 'CLI Running',
        details: ['Cloning template', 'Installing dependencies', 'Configuring project'],
      },
      {
        time: 20,
        label: 'Auth Ready',
        details: [
          'Better Auth configured',
          'Login/signup forms working',
          'Session management active',
        ],
      },
      {
        time: 40,
        label: 'Database Ready',
        details: ['D1 database provisioned', 'Drizzle ORM connected', 'Migrations applied'],
      },
      {
        time: 60,
        label: 'Deployed',
        details: ['Code on Cloudflare edge', '300+ locations worldwide', 'Ready for users'],
      },
    ],

    cta: {
      title: 'Ready to Ship This Weekend?',
      subtitle: 'Deploy in 60 seconds. Skip 3 days of setup.',
      primaryAction: 'Get Started',
      secondaryActions: [
        { label: 'View on GitHub', href: 'https://github.com/yourusername/your-repo' },
        { label: 'Read Docs', href: '/docs' },
      ],
    },
  },
} as const

export type Config = typeof config
