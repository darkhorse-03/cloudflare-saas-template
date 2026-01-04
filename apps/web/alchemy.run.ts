import { api } from '@repo/api/alchemy'
import { config } from '@repo/config'
import alchemy from 'alchemy'
import { DnsRecords, Vite } from 'alchemy/cloudflare'

if (!process.env.CLOUDFLARE_ZONE_ID) {
  throw new Error('CLOUDFLARE_ZONE_ID is not set')
}

const app = await alchemy(`${config.appName}-web`, {
  password: process.env.ALCHEMY_PASSWORD,
})

// Create DNS record for the web app subdomain
// Get zone ID from: Cloudflare Dashboard → zynth.dev → Overview → Zone ID
await DnsRecords('web-dns', {
  zoneId: process.env.CLOUDFLARE_ZONE_ID,
  records: [
    {
      type: 'A',
      name: 'template',
      content: '192.0.2.1',
      proxied: true,
      ttl: 1,
    },
  ],
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
  routes: [
    {
      pattern: config.domains.web,
      adopt: true,
    },
    {
      pattern: `${config.domains.web}/*`,
      adopt: true,
    },
  ],
  placement: {
    mode: 'smart',
  },
})

await app.finalize()
