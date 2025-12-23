import path from 'node:path'
import { config } from '@repo/config'
import alchemy from 'alchemy'
import { D1Database, KVNamespace, Worker } from 'alchemy/cloudflare'

const app = await alchemy(`${config.appName}-api`)

const db = await D1Database('db', {
  name: `${config.appName}-db`,
  adopt: true,
  migrationsDir: path.join(import.meta.dirname, 'drizzle'),
})

const kv = await KVNamespace('kv', {
  title: `${config.appName}-sessions`,
})

export const api = await Worker('worker', {
  name: `${config.appName}-api`,
  entrypoint: path.join(import.meta.dirname, 'src', 'index.ts'),
  bindings: {
    DB: db,
    KV: kv,
  },
  compatibilityFlags: ['nodejs_compat'],
  url: false,
  placement: {
    mode: 'smart',
  },
  dev: {
    port: 8787,
  },
  observability: {
    logs: {
      enabled: true,
      persist: false,
    },
    traces: {
      enabled: true,
      persist: false,
    },
  },
})

await app.finalize()
