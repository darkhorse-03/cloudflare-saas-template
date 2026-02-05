import { api } from '@repo/api/alchemy'
import { config } from '@repo/config'
import alchemy from 'alchemy'
import { DnsRecords, Vite } from 'alchemy/cloudflare'

const app = await alchemy(`${config.appName}-web`, {
  password: process.env.ALCHEMY_PASSWORD,
})

// DNS records only needed for deployment (not local dev)
if (process.env.CLOUDFLARE_ZONE_ID) {
  // Extract subdomain from config.domains.web (e.g., 'myapp.example.com' -> 'myapp')
  const subdomain = config.domains.web.split('.')[0]

  await DnsRecords('web-dns', {
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    records: [
      {
        type: 'A',
        name: subdomain,
        content: '192.0.2.1',
        proxied: true,
        ttl: 1,
      },
    ],
  })
}

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
  // Routes only needed for custom domain deployment
  ...(process.env.CLOUDFLARE_ZONE_ID && {
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
  }),
  placement: {
    mode: 'smart',
  },
})

await app.finalize()
