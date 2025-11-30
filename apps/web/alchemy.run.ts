import { api } from '@repo/api/alchemy'
import alchemy from 'alchemy'
import { Vite } from 'alchemy/cloudflare'

const app = await alchemy('underdog-web')

export const web = await Vite('underdog-web', {
  entrypoint: './worker.ts',
  bindings: {
    api,
  },
  assets: {
    run_worker_first: ['/api/*'],
  },
  domains: [
    "underdog.sarimahmed.net"
  ],
  placement: {
    mode: 'smart',
  }
})

console.log({ url: web.url })

await app.finalize()
