import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from 'cloudflare:workers'
import { config } from '@repo/config'
import { eq } from 'drizzle-orm'
import type { Env } from '@/env'
import { getDb } from '@/db'
import demoItems from '@/db/schema/demo'
import { createEmailService } from '@/lib/email'
import { GettingStartedEmail } from '@/lib/email/templates/getting-started-email'
import { ReengagementEmail } from '@/lib/email/templates/reengagement-email'
import type { UserOnboardingParams, UserOnboardingResult } from '../types'

/**
 * User Onboarding Workflow
 *
 * Demonstrates Cloudflare Workflows for multi-day orchestration with real emails:
 * - Day 0: Initialize (workflow started on signup)
 * - Day 1: Send "getting started" tips email
 * - Day 7: Check activity, send re-engagement email if inactive
 *
 * Unlike Queues, Workflows can sleep for days and resume automatically.
 * Each step is durable - if the worker restarts, it resumes from the last checkpoint.
 */
export class UserOnboardingWorkflow extends WorkflowEntrypoint<Env, UserOnboardingParams> {
  async run(
    event: WorkflowEvent<UserOnboardingParams>,
    step: WorkflowStep,
  ): Promise<UserOnboardingResult> {
    const { userId, email, name } = event.payload
    const stepsCompleted: string[] = []
    let emailsSent = 0
    const dashboardUrl = `https://${config.domains.web}/dashboard`

    // Step 1: Log onboarding start (immediate)
    await step.do('init-onboarding', () => {
      console.log(`[Onboarding] Started for user ${userId} (${email})`)
      stepsCompleted.push('init')
      return Promise.resolve(true)
    })

    // Step 2: Wait 1 day before first engagement email
    // This is the key feature of Workflows - durable sleep across worker restarts
    await step.sleep('wait-day-1', '1 day')

    // Step 3: Send "getting started" tips email
    await step.do(
      'send-getting-started-email',
      {
        retries: {
          limit: 3,
          delay: '1 minute',
          backoff: 'exponential',
        },
      },
      async () => {
        const emailService = createEmailService(this.env)
        if (!emailService) {
          console.log('[Onboarding] Email service not configured, skipping getting started email')
          stepsCompleted.push('getting-started-skipped')
          return
        }

        const result = await emailService.send({
          to: [{ email }],
          subject: 'Tips to get started',
          react: GettingStartedEmail({ userName: name || 'there', dashboardUrl }),
          userId,
          emailType: 'notification',
        })

        if (!result.success) {
          throw new Error(`Failed to send getting started email: ${result.error}`)
        }

        console.log(`[Onboarding] Sent getting started email to ${email}`)
        stepsCompleted.push('getting-started-sent')
        emailsSent++
      },
    )

    // Step 4: Wait 7 more days
    await step.sleep('wait-day-7', '7 days')

    // Step 5: Check if user has been active (created any items)
    const hasActivity = await step.do('check-activity', async () => {
      const db = getDb(this.env.DB)
      const items = await db
        .select({ id: demoItems.id })
        .from(demoItems)
        .where(eq(demoItems.userId, userId))
        .limit(1)

      const isActive = items.length > 0
      console.log(`[Onboarding] User ${userId} activity check: ${isActive ? 'active' : 'inactive'}`)
      stepsCompleted.push('activity-checked')

      return isActive
    })

    // Step 6: Re-engage inactive users
    if (hasActivity) {
      console.log(`[Onboarding] User ${userId} is active, skipping re-engagement`)
      stepsCompleted.push('user-active')
    } else {
      await step.do(
        'send-reengagement-email',
        {
          retries: {
            limit: 3,
            delay: '1 minute',
            backoff: 'exponential',
          },
        },
        async () => {
          const emailService = createEmailService(this.env)
          if (!emailService) {
            console.log('[Onboarding] Email service not configured, skipping re-engagement email')
            stepsCompleted.push('reengagement-skipped')
            return
          }

          const result = await emailService.send({
            to: [{ email }],
            subject: 'We miss you!',
            react: ReengagementEmail({ userName: name || 'there', dashboardUrl }),
            userId,
            emailType: 'notification',
          })

          if (!result.success) {
            throw new Error(`Failed to send re-engagement email: ${result.error}`)
          }

          console.log(`[Onboarding] Sent re-engagement email to ${email}`)
          stepsCompleted.push('reengagement-sent')
          emailsSent++
        },
      )
    }

    // Step 7: Complete onboarding
    await step.do('complete', () => {
      console.log(`[Onboarding] Completed for user ${userId}. Emails sent: ${emailsSent}`)
      stepsCompleted.push('completed')
      return Promise.resolve(true)
    })

    return {
      completedAt: new Date().toISOString(),
      emailsSent,
      stepsCompleted,
    }
  }
}
