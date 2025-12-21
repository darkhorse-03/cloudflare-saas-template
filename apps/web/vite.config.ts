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
      transformIndexHtml(html) {
        return html
          .replace(/{{APP_NAME}}/g, config.appName)
          .replace(/{{DESCRIPTION}}/g, config.description)
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
