import type { Database } from '@/db'
import type { Env } from '@/env'
import type { Logger } from '@/lib/logger'

/**
 * Job context passed to all handlers
 */
export interface JobContext {
  env: Env
  db: Database
  log: Logger
}

/**
 * Job definitions - add new job types here
 *
 * Each job type has:
 * - type: Unique identifier (use dot notation: 'category.action')
 * - ...params: Job-specific parameters
 *
 * Example:
 * | { type: 'image.process'; key: string; sizes: number[] }
 */
export type Job =
  | {
      type: 'email.send'
      to: string
      subject: string
      template: string
      data: Record<string, unknown>
    }
  | { type: 'webhook.deliver'; url: string; payload: unknown; attempt?: number }
  | { type: 'cleanup.sessions'; olderThanDays: number }
  | { type: 'cleanup.expiredTokens' }
  | { type: 'export.generate'; userId: string; format: 'csv' | 'json'; rows: number }

/**
 * Extract job type string union
 */
export type JobType = Job['type']

/**
 * Extract specific job by type
 */
export type JobOfType<T extends JobType> = Extract<Job, { type: T }>

/**
 * Handler function signature for a specific job type
 */
export type JobHandler<T extends JobType> = (job: JobOfType<T>, ctx: JobContext) => Promise<void>

/**
 * Result of job execution
 */
export type JobResult = { success: true } | { success: false; error: string; retry: boolean }
