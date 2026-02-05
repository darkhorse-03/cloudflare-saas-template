import path from 'node:path'
import { config } from '@repo/config'
import alchemy from 'alchemy'
import { D1Database, KVNamespace, Queue, R2Bucket, Worker } from 'alchemy/cloudflare'
import type { Job } from './src/jobs/types'

if (!process.env.ALCHEMY_PASSWORD) {
  throw new Error(
    'ALCHEMY_PASSWORD is not set.\nCopy .env.example to .env and set ALCHEMY_PASSWORD (any string for local dev).',
  )
}

const app = await alchemy(`${config.appName}-api`, {
  password: process.env.ALCHEMY_PASSWORD,
})

const db = await D1Database('db', {
  name: `${config.appName}-db`,
  adopt: true,
  migrationsDir: path.join(import.meta.dirname, 'drizzle'),
})

const kv = await KVNamespace('kv', {
  title: `${config.appName}-sessions`,
  adopt: true,
})

// R2 storage bucket (optional - only created if storage is enabled)
const r2 = config.storage.enabled
  ? await R2Bucket('storage', {
      name: `${config.appName}-storage`,
      adopt: true,
    })
  : null

// Background jobs queue (optional - only created if jobs are enabled)
export const jobsQueue = config.jobs.enabled
  ? await Queue<Job>('jobs-queue', {
      name: `${config.appName}-jobs`,
    })
  : null

export const api = await Worker('worker', {
  name: `${config.appName}-api`,
  entrypoint: path.join(import.meta.dirname, 'src', 'index.ts'),
  bindings: {
    DB: db,
    KV: kv,
    // Email service (optional - auth works without it, just no email verification/magic links)
    ...(process.env.RESEND_API_KEY && {
      RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY),
      FROM_EMAIL: alchemy.secret(process.env.FROM_EMAIL ?? ''),
    }),
    // OAuth providers (optional)
    ...(process.env.GOOGLE_CLIENT_ID && {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: alchemy.secret(process.env.GOOGLE_CLIENT_SECRET ?? ''),
    }),
    ...(process.env.GITHUB_CLIENT_ID && {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: alchemy.secret(process.env.GITHUB_CLIENT_SECRET ?? ''),
    }),
    // Cloudflare Turnstile bot protection (optional)
    ...(process.env.TURNSTILE_SECRET_KEY && {
      TURNSTILE_SECRET_KEY: alchemy.secret(process.env.TURNSTILE_SECRET_KEY),
    }),
    // R2 storage (optional)
    ...(r2 && { R2: r2 }),
    // Polar.sh payments (optional)
    ...(process.env.POLAR_ACCESS_TOKEN && {
      POLAR_ACCESS_TOKEN: alchemy.secret(process.env.POLAR_ACCESS_TOKEN),
      POLAR_WEBHOOK_SECRET: alchemy.secret(process.env.POLAR_WEBHOOK_SECRET ?? ''),
    }),
    // Background jobs queue (optional)
    ...(jobsQueue && { JOBS: jobsQueue }),
  },
  // Queue consumer configuration
  eventSources: jobsQueue
    ? [
        {
          queue: jobsQueue,
          settings: {
            batchSize: config.jobs.queue.batchSize,
            maxRetries: config.jobs.queue.maxRetries,
          },
        },
      ]
    : [],
  // Cron triggers for scheduled jobs
  crons: config.jobs.enabled
    ? [config.jobs.cron.sessionCleanup, config.jobs.cron.expiredTokens]
    : [],
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
      persist: true,
    },
    traces: {
      enabled: true,
      persist: true,
    },
  },
})

await app.finalize()
