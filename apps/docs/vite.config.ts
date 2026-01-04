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

      pages: [
        // Root
        { path: '/' },
        { path: '/api/search' },
        // Doc pages
        { path: '/features' },
        { path: '/getting-started' },
        { path: '/installation' },
        // Guides
        { path: '/guides/api-routes' },
        { path: '/guides/auth' },
        { path: '/guides/database' },
        { path: '/guides/deployment' },
        { path: '/guides/pages' },
        // Reference
        { path: '/reference/commands' },
        { path: '/reference/configuration' },
        { path: '/reference/project-structure' },
      ],
    }),
    react(),
  ],
})
