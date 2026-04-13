import { fileURLToPath, URL } from 'node:url'
import { config } from '@repo/config'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // alchemy(), // Disabled during TanStack Start migration - will add back for deployment
    config.devtools.enabled && devtools(),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          crawlLinks: false,
        },
      },
      pages: [
        { path: '/' },
        { path: '/pricing' },
        // Dashboard routes are NOT listed = SPA behavior (no prerendering)
      ],
    }),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Note: manualChunks removed - conflicts with TanStack Start SSR externals
    // TanStack Start handles code splitting automatically
  },
  ssr: {
    external: ['better-auth', 'better-auth-cloudflare', '@better-auth/core'],
  },
  server: {
    allowedHosts: true, // Allow ngrok and other tunneling services
  },
})
