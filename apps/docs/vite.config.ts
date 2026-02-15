import react from '@vitejs/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import mdx from 'fumadocs-mdx/vite'

export default defineConfig({
  base: '/docs/',
  server: {
    port: 3000,
  },
  plugins: [
    mdx(await import('./source.config')),
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          outputPath: 'index.html',
          enabled: true,
          crawlLinks: false,
        },
      },
      // All pages must be listed explicitly for staticFunctionMiddleware to generate cache files
      pages: [
        { path: '/' },
        { path: '/api/search' },
        // Docs pages
        { path: '/docs' },
        { path: '/docs/getting-started' },
        { path: '/docs/features' },
        { path: '/docs/installation' },
        // Guides
        { path: '/docs/guides/api-routes' },
        { path: '/docs/guides/auth' },
        { path: '/docs/guides/database' },
        { path: '/docs/guides/deployment' },
        { path: '/docs/guides/jobs' },
        { path: '/docs/guides/logging' },
        { path: '/docs/guides/pages' },
        { path: '/docs/guides/rate-limiting' },
        { path: '/docs/guides/payments' },
        { path: '/docs/guides/storage' },
        // Reference
        { path: '/docs/reference/commands' },
        { path: '/docs/reference/configuration' },
        { path: '/docs/reference/project-structure' },
      ],
    }),
    react(),
  ],
})
