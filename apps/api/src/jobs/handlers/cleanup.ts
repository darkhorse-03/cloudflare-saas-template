import { lt } from 'drizzle-orm'
import { sessions, verifications } from '@/db/schema'
import type { JobHandler } from '../types'

export const cleanupSessionsHandler: JobHandler<'cleanup.sessions'> = async (job, ctx) => {
  const { olderThanDays } = job
  const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000)

  ctx.log.info('job.cleanup.sessions.start', { olderThanDays, cutoff: cutoff.toISOString() })

  const result = await ctx.db.delete(sessions).where(lt(sessions.expiresAt, cutoff)).returning()

  ctx.log.info('job.cleanup.sessions.complete', { deleted: result.length })
}

export const cleanupExpiredTokensHandler: JobHandler<'cleanup.expiredTokens'> = async (
  _job,
  ctx,
) => {
  const now = new Date()

  ctx.log.info('job.cleanup.expiredTokens.start')

  const result = await ctx.db
    .delete(verifications)
    .where(lt(verifications.expiresAt, now))
    .returning()

  ctx.log.info('job.cleanup.expiredTokens.complete', { deleted: result.length })
}
