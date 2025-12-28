import { config } from '@repo/config'
import alchemy from 'alchemy'
import { Vite } from 'alchemy/cloudflare'

const app = await alchemy(`${config.appName}-docs`, {
  password: process.env.ALCHEMY_PASSWORD,
})

export const docs = await Vite('docs', {
  name: `${config.appName}-docs`,
  assets: 'dist/client',
  domains: [config.domains.docs],
  placement: {
    mode: 'smart',
  },
  url: false,
})

console.log({ url: docs.url })

await app.finalize()
