import { cleanupExpiredTokensHandler, cleanupSessionsHandler } from './handlers/cleanup'
import { emailSendHandler } from './handlers/email'
import { exportGenerateHandler } from './handlers/export'
import { webhookDeliverHandler } from './handlers/webhook'
import type { Job, JobHandler, JobType } from './types'

/**
 * Job handler registry
 * Maps job types to their handler functions
 */
export const handlers: { [T in JobType]: JobHandler<T> } = {
  'email.send': emailSendHandler,
  'webhook.deliver': webhookDeliverHandler,
  'cleanup.sessions': cleanupSessionsHandler,
  'cleanup.expiredTokens': cleanupExpiredTokensHandler,
  'export.generate': exportGenerateHandler,
}

/**
 * Get handler for a job type
 */
export function getHandler<T extends JobType>(type: T): JobHandler<T> {
  return handlers[type]
}

/**
 * Check if a job type is registered
 */
export function isValidJobType(type: string): type is JobType {
  return type in handlers
}

/**
 * Type guard for Job
 */
export function isValidJob(data: unknown): data is Job {
  if (!data || typeof data !== 'object') {
    return false
  }
  const job = data as { type?: unknown }
  return typeof job.type === 'string' && isValidJobType(job.type)
}
