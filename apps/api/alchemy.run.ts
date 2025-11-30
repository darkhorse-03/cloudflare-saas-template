import path from 'node:path'
import alchemy from 'alchemy'
import { Worker } from 'alchemy/cloudflare'

const app = await alchemy('underdog-api')

export const api = await Worker('underdog-api', {
  entrypoint: path.join(import.meta.dirname, 'src', 'index.ts'),
  url: false,
  placement: {
    mode: 'smart',
  }
})

await app.finalize()
