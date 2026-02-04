import { config } from '@repo/config'
import { getDb } from '@/db'
import type { Env } from '@/env'
import { createRequestLogger } from '@/lib/logger'
import { cleanupExpiredTokensHandler, cleanupSessionsHandler } from './handlers/cleanup'
import type { JobContext } from './types'

/**
 * Handle scheduled cron triggers
 * This is called by the Worker's scheduled handler
 */
export async function handleScheduled(
  event: ScheduledEvent,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  const log = createRequestLogger({ requestId: `cron-${Date.now()}` })
  const db = getDb(env.DB)
  const jobCtx: JobContext = { env, db, log }

  log.info('cron.start', { cron: event.cron, scheduledTime: event.scheduledTime })

  try {
    // Match cron expression to job
    if (event.cron === config.jobs.cron.sessionCleanup) {
      await cleanupSessionsHandler({ type: 'cleanup.sessions', olderThanDays: 30 }, jobCtx)
    } else if (event.cron === config.jobs.cron.expiredTokens) {
      await cleanupExpiredTokensHandler({ type: 'cleanup.expiredTokens' }, jobCtx)
    } else {
      log.warn('cron.unknown', { cron: event.cron })
    }

    log.info('cron.complete', { cron: event.cron })
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    log.error('cron.failed', { cron: event.cron, error })
    throw err
  }
}
