import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema/*.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: '../../.alchemy/miniflare/v3/d1/miniflare-D1DatabaseObject/521c0713e9679c1d16286111067cbe17d24e2af8fe74fc402869b8811a3b99ae.sqlite',
  },
})
