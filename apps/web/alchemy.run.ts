import { api } from '@repo/api/alchemy'
import { config } from '@repo/config'
import alchemy from 'alchemy'
import { Vite } from 'alchemy/cloudflare'

const app = await alchemy(`${config.appName}-web`)

export const web = await Vite('web', {
  name: `${config.appName}-web`,
  entrypoint: './worker.ts',
  bindings: {
    api,
  },
  url: false,
  compatibility: 'node',
  assets: {
    run_worker_first: ['/api/*'],
  },
  domains: [...config.domains],
  placement: {
    mode: 'smart',
  },
})

console.log({ url: web.url })

await app.finalize()
