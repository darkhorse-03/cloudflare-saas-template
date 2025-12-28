import { api } from '@repo/api/alchemy'
import { config } from '@repo/config'
import alchemy from 'alchemy'
import { Vite } from 'alchemy/cloudflare'

const app = await alchemy(`${config.appName}-web`, {
  password: process.env.ALCHEMY_PASSWORD,
})

export const web = await Vite('web', {
  name: `${config.appName}-web`,
  entrypoint: './worker.ts',
  bindings: {
    api,
  },
  url: false,
  compatibility: 'node',
  assets: {
    run_worker_first: ['/api/*', '/auth/*'],
    not_found_handling: 'single-page-application',
  },
  domains: [config.domains.web],
  placement: {
    mode: 'smart',
  },
})

await app.finalize()
