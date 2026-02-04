import type { Queue } from '@cloudflare/workers-types'
import { config } from '@repo/config'
import type { Job } from './types'

/**
 * Enqueue a single job
 *
 * @example
 * await enqueue(c.env.JOBS, {
 *   type: 'email.send',
 *   to: user.email,
 *   subject: 'Welcome!',
 *   template: 'welcome',
 *   data: { name: user.name }
 * })
 */
export async function enqueue(queue: Queue<Job> | undefined, job: Job): Promise<void> {
  if (!config.jobs.enabled) {
    console.warn('[jobs] Jobs disabled, skipping:', job.type)
    return
  }

  if (!queue) {
    console.warn('[jobs] Queue not bound, skipping:', job.type)
    return
  }

  await queue.send(job)
}

/**
 * Enqueue multiple jobs in a batch
 *
 * @example
 * await enqueueBatch(c.env.JOBS, [
 *   { type: 'email.send', to: 'user1@example.com', ... },
 *   { type: 'email.send', to: 'user2@example.com', ... },
 * ])
 */
export async function enqueueBatch(queue: Queue<Job> | undefined, jobs: Job[]): Promise<void> {
  if (!config.jobs.enabled) {
    console.warn('[jobs] Jobs disabled, skipping batch of', jobs.length)
    return
  }

  if (!queue) {
    console.warn('[jobs] Queue not bound, skipping batch of', jobs.length)
    return
  }

  await queue.sendBatch(jobs.map((body) => ({ body })))
}
