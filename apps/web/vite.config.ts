import { fileURLToPath, URL } from 'node:url'
import { config } from '@repo/config'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import alchemy from 'alchemy/cloudflare/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    alchemy(),
    config.devtools.enabled && devtools(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tailwindcss(),
    {
      name: 'html-transform',
      transformIndexHtml(html: string) {
        return html
          .replace(/{{APP_NAME}}/g, config.appName)
          .replace(/{{DESCRIPTION}}/g, config.description)
          .replace(/{{SEO_TITLE}}/g, config.seo.title)
          .replace(/{{SEO_DESCRIPTION}}/g, config.seo.description)
          .replace(/{{OG_URL}}/g, config.seo.url)
          .replace(/{{OG_IMAGE}}/g, config.seo.ogImage)
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tanstack-vendor': [
            '@tanstack/react-query',
            '@tanstack/react-router',
            '@tanstack/react-form',
          ],
          'radix-vendor': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          'auth-vendor': ['better-auth', 'better-auth-cloudflare'],
          'ui-vendor': ['lucide-react', 'sonner'],
        },
      },
    },
  },
  ssr: {
    external: ['better-auth', 'better-auth-cloudflare', '@better-auth/core'],
  },
})
