import path from 'node:path'
import alchemy from 'alchemy'
import { D1Database, KVNamespace, Worker } from 'alchemy/cloudflare'

const app = await alchemy('underdog-api')

const db = await D1Database('db', {
  name: 'underdog-db',
  migrationsDir: path.join(import.meta.dirname, 'drizzle', 'migrations'),
})

const kv = await KVNamespace('kv', {
  title: 'underdog-sessions',
})

export const api = await Worker('worker', {
  name: 'underdog-api',
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
})

await app.finalize()
