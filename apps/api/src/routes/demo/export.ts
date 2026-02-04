import { zValidator } from '@hono/zod-validator'
import { exportRequestSchema } from '@repo/shared'
import { Hono } from 'hono'
import type { AppContext } from '@/env'
import { enqueue } from '@/jobs'
import { getAuthUser, requireAuth } from '@/middleware/auth'

export const exportRoutes = new Hono<AppContext>().post(
  '/',
  requireAuth,
  zValidator('json', exportRequestSchema),
  async (c) => {
    const user = getAuthUser(c)
    const { format, rows } = c.req.valid('json')
    const log = c.get('log')

    log.info('export.request', { userId: user.id, format, rows })

    await enqueue(c.env.JOBS, {
      type: 'export.generate',
      userId: user.id,
      format,
      rows,
    })

    return c.json({
      queued: true,
      message: `Export job queued: ${rows} rows in ${format} format`,
    })
  },
)
