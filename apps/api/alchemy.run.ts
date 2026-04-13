import path from 'node:path'
import { config } from '@repo/config'
import alchemy from 'alchemy'
import { D1Database, KVNamespace, RateLimit, Worker } from 'alchemy/cloudflare'
// @feature storage
import { R2Bucket } from 'alchemy/cloudflare'
// @end storage
// @feature jobs
import { Queue } from 'alchemy/cloudflare'
// @end jobs
// @feature workflows
import { Workflow } from 'alchemy/cloudflare'
// @end workflows
// @feature jobs
import type { Job } from './src/jobs/types'
// @end jobs
// @feature workflows
import type { UserOnboardingParams } from './src/workflows/types'
// @end workflows

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

// @feature storage
const r2 = config.storage.enabled
  ? await R2Bucket('storage', {
      name: `${config.appName}-storage`,
      adopt: true,
    })
  : null
// @end storage

// @feature jobs
export const jobsQueue = config.jobs.enabled
  ? await Queue<Job>('jobs-queue', {
      name: `${config.appName}-jobs`,
    })
  : null
// @end jobs

// @feature workflows
const onboardingWorkflow = Workflow<UserOnboardingParams>('onboarding-workflow', {
  workflowName: `${config.appName}-user-onboarding`,
  className: 'UserOnboardingWorkflow',
})
// @end workflows

// Rate limiter bindings — one per tier for independent enforcement
const rateLimiter = RateLimit({
  namespace_id: 1001,
  simple: {
    limit: config.rateLimit.tiers.global.limit,
    period: config.rateLimit.tiers.global.period,
  },
})

// @feature storage
const rateLimiterUpload = RateLimit({
  namespace_id: 1002,
  simple: {
    limit: config.rateLimit.tiers.upload.limit,
    period: config.rateLimit.tiers.upload.period,
  },
})
// @end storage

// @feature demo
const rateLimiterExport = RateLimit({
  namespace_id: 1003,
  simple: {
    limit: config.rateLimit.tiers.export.limit,
    period: config.rateLimit.tiers.export.period,
  },
})

const rateLimiterSeed = RateLimit({
  namespace_id: 1004,
  simple: {
    limit: config.rateLimit.tiers.seed.limit,
    period: config.rateLimit.tiers.seed.period,
  },
})
// @end demo

export const api = await Worker('worker', {
  name: `${config.appName}-api`,
  entrypoint: path.join(import.meta.dirname, 'src', 'index.ts'),
  bindings: {
    DB: db,
    KV: kv,
    // @feature email
    ...(process.env.RESEND_API_KEY && {
      RESEND_API_KEY: alchemy.secret(process.env.RESEND_API_KEY),
      FROM_EMAIL: alchemy.secret(process.env.FROM_EMAIL ?? ''),
    }),
    // @end email
    // @feature google-oauth
    ...(process.env.GOOGLE_CLIENT_ID && {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: alchemy.secret(process.env.GOOGLE_CLIENT_SECRET ?? ''),
    }),
    // @end google-oauth
    // @feature github-oauth
    ...(process.env.GITHUB_CLIENT_ID && {
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET: alchemy.secret(process.env.GITHUB_CLIENT_SECRET ?? ''),
    }),
    // @end github-oauth
    // @feature turnstile
    ...(process.env.TURNSTILE_SECRET_KEY && {
      TURNSTILE_SECRET_KEY: alchemy.secret(process.env.TURNSTILE_SECRET_KEY),
    }),
    // @end turnstile
    // @feature storage
    ...(r2 && { R2: r2 }),
    // @end storage
    // @feature payments
    ...(process.env.POLAR_ACCESS_TOKEN && {
      POLAR_ACCESS_TOKEN: alchemy.secret(process.env.POLAR_ACCESS_TOKEN),
      POLAR_WEBHOOK_SECRET: alchemy.secret(process.env.POLAR_WEBHOOK_SECRET ?? ''),
    }),
    // @end payments
    // @feature jobs
    ...(jobsQueue && { JOBS: jobsQueue }),
    // @end jobs
    RATE_LIMITER: rateLimiter,
    // @feature storage
    RATE_LIMITER_UPLOAD: rateLimiterUpload,
    // @end storage
    // @feature demo
    RATE_LIMITER_EXPORT: rateLimiterExport,
    RATE_LIMITER_SEED: rateLimiterSeed,
    // @end demo
    // @feature workflows
    ONBOARDING_WORKFLOW: onboardingWorkflow,
    // @end workflows
  },
  // @feature jobs
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
  crons: config.jobs.enabled
    ? [config.jobs.cron.sessionCleanup, config.jobs.cron.expiredTokens]
    : [],
  // @end jobs
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
