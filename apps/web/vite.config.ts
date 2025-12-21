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
})
