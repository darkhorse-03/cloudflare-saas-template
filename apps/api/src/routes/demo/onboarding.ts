import { Hono } from 'hono'
import type { AppContext } from '@/env'
import { getAuthUser, requireAuth } from '@/middleware/auth'

export const onboardingRoutes = new Hono<AppContext>()
  /**
   * Start onboarding workflow for current user
   * In production, this would be triggered automatically on signup
   */
  .post('/start', requireAuth, async (c) => {
    const user = getAuthUser(c)
    const log = c.get('log')

    if (!c.env.ONBOARDING_WORKFLOW) {
      return c.json({ error: 'Workflow not configured' }, 400)
    }

    log.info('workflow.onboarding.start', { userId: user.id })

    const instance = await c.env.ONBOARDING_WORKFLOW.create({
      params: {
        userId: user.id,
        email: user.email,
        name: user.name || 'there',
      },
    })

    return c.json({
      started: true,
      instanceId: instance.id,
      message:
        'Onboarding workflow started. Day 1: getting started email. Day 7: re-engagement check.',
    })
  })

  /**
   * Get workflow instance status
   */
  .get('/status/:instanceId', requireAuth, async (c) => {
    const { instanceId } = c.req.param()

    if (!c.env.ONBOARDING_WORKFLOW) {
      return c.json({ error: 'Workflow not configured' }, 400)
    }

    const instance = await c.env.ONBOARDING_WORKFLOW.get(instanceId)
    const status = await instance.status()

    return c.json({
      instanceId,
      status: status.status,
      output: status.output,
      error: status.error,
    })
  })
