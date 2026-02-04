import type { MessageBatch } from '@cloudflare/workers-types'
import { getDb } from '@/db'
import type { Env } from '@/env'
import { createRequestLogger } from '@/lib/logger'
import { getHandler, isValidJob } from './registry'
import type { Job, JobContext } from './types'

/**
 * Process a batch of jobs from the queue
 * This is called by the Worker's queue handler
 */
export async function processJobBatch(batch: MessageBatch<Job>, env: Env): Promise<void> {
  const log = createRequestLogger({ requestId: `queue-${Date.now()}` })
  const db = getDb(env.DB)

  const ctx: JobContext = { env, db, log }

  log.info('jobs.batch.start', { count: batch.messages.length, queue: batch.queue })

  for (const message of batch.messages) {
    const { body, id } = message

    if (!isValidJob(body)) {
      log.error('jobs.invalid', { id, body })
      message.ack()
      continue
    }

    const handler = getHandler(body.type)
    log.info('jobs.process.start', { id, type: body.type })

    try {
      await handler(body as never, ctx)
      message.ack()
      log.info('jobs.process.complete', { id, type: body.type })
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err)
      log.error('jobs.process.failed', { id, type: body.type, error })
      message.retry()
    }
  }

  log.info('jobs.batch.complete', { count: batch.messages.length })
}
