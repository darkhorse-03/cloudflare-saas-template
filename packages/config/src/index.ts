/**
 * Shared configuration for the entire application
 * Used by both web and API workers
 */

export const config = {
  appName: 'underdog',
  tagline: 'Fullstack Cloudflare Workers Template',
  description: 'underdog Template - Hono + TanStack Router + React Query',

  // Development tools configuration
  devtools: {
    enabled: import.meta.env?.DEV ?? true,
  },

  // Navigation links (web only)
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'About', href: '/about' },
  ],

  // Footer links (web only)
  footer: {
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'GitHub', href: 'https://github.com/yourusername/underdog' },
    ],
  },

  // Social links (optional)
  social: {
    github: 'https://github.com/yourusername/underdog',
    twitter: '',
  },
} as const

export type Config = typeof config
