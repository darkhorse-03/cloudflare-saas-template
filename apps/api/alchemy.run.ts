import path from 'node:path'
import alchemy from 'alchemy'
import { Worker } from 'alchemy/cloudflare'

const app = await alchemy('underdog-api')

export const api = await Worker('worker', {
  name: 'underdog-api',
  entrypoint: path.join(import.meta.dirname, 'src', 'index.ts'),
  url: false,
  placement: {
    mode: 'smart',
  },
  dev: {
    port: 8787,
  }
})

await app.finalize()
