import { api } from '@repo/api/alchemy'
import alchemy from 'alchemy'
import { Vite } from 'alchemy/cloudflare'

const app = await alchemy('web')

export const web = await Vite('web', {
  entrypoint: './worker.ts',
  bindings: {
    api,
  },
  assets: {
    run_worker_first: ['/api/*'],
  },
})

console.log({ url: web.url })

await app.finalize()
