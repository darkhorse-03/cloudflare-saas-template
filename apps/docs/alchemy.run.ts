import { config } from '@repo/config'
import alchemy from 'alchemy'
import { Vite } from 'alchemy/cloudflare'

const app = await alchemy(`${config.appName}-docs`, {
  password: process.env.ALCHEMY_PASSWORD,
})

export const docs = await Vite('docs', {
  name: `${config.appName}-docs`,
  entrypoint: './worker.ts',
  assets: 'dist/client',
  routes: [
    {
      pattern: `${config.domains.web}/docs`,
      adopt: true,
    },
    {
      pattern: `${config.domains.web}/docs/*`,
      adopt: true,
    },
    // TanStack Start server function cache (basepath workaround)
    {
      pattern: `${config.domains.web}/__tsr/*`,
      adopt: true,
    },
  ],
  url: false,
  build: {
    command: 'bun run build',
  },
})

console.log({ url: docs.url })

await app.finalize()
