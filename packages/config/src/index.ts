/**
 * Shared configuration for the entire application
 * Used by both web and API workers
 */

export const config = {
  appName: 'underdog',
  tagline: 'Ship in 60 Seconds, Not 3 Days',
  description:
    'Skip the setup hell. Auth, database, and type-safe APIs pre-configured. Optimized for AI-assisted development with Claude Code. Built for indie hackers who ship fast.',

  // SEO & Open Graph
  seo: {
    title: 'Underdog - Ship Your SaaS This Weekend',
    description:
      'Deploy in 60 seconds. Skip 3 days of setup. Cloudflare Workers template with auth, database, and type-safe APIs. Optimized for AI-assisted development with Claude Code.',
    url: 'https://your-domain.com',
    ogImage: 'https://your-domain.com/og-image.png',
  },

  // Development tools configuration
  devtools: {
    enabled: import.meta.env?.DEV ?? true,
  },

  // Navigation links (web only)
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Getting Started', href: '/getting-started' },
    { label: 'Features', href: '/features' },
    { label: 'About', href: '/about' },
  ],

  // Footer links (web only)
  footer: {
    links: [
      { label: 'Documentation', href: '/getting-started' },
      { label: 'GitHub', href: 'https://github.com/yourusername/underdog' },
    ],
  },

  // Social links (optional)
  social: {
    github: 'https://github.com/yourusername/underdog',
    twitter: '',
  },

  // Marketing content
  marketing: {
    hero: {
      headline: 'Ship Your SaaS This Weekend',
      subheadline: 'Not Next Quarter',
      description:
        'Skip the setup hell. Pre-configured auth, database, and type-safe APIs. Optimized for Claude Code.',
      cliCommand: 'bunx create-underdog-app',
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
        ],
        tasksWith: [
          'Better Auth pre-built',
          'Forms ready',
          'Sessions working',
          'Rate limiting configured',
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
        { label: 'View on GitHub', href: 'https://github.com/yourusername/underdog' },
        { label: 'Read Docs', href: '/getting-started' },
      ],
    },
  },
} as const

export type Config = typeof config
