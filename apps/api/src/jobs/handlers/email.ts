import { createEmailService } from '@/lib/email'
import type { JobHandler } from '../types'

export const emailSendHandler: JobHandler<'email.send'> = async (job, ctx) => {
  const { to, subject, template, data: _data } = job

  ctx.log.info('job.email.send.start', { to, template })

  const emailService = createEmailService(ctx.env)
  if (!emailService) {
    throw new Error('Email service not configured (missing RESEND_API_KEY or FROM_EMAIL)')
  }

  const result = await emailService.send({
    to: [{ email: to }],
    subject,
    html: `<p>${template}</p>`,
    emailType: 'notification',
  })

  if (!result.success) {
    throw new Error(`Email delivery failed: ${result.error}`)
  }

  ctx.log.info('job.email.send.complete', { to, template, messageId: result.messageId })
}
