import type { Database } from '@/db'
import { emailLogs } from '@/db/schema'
import type { EmailRecipient } from './types'

interface LogEmailOptions {
  to: EmailRecipient[]
  subject: string
  provider: string
  status: 'sent' | 'failed'
  messageId?: string
  error?: string
  userId?: string
  emailType?: 'verification' | 'password_reset' | 'welcome' | 'magic_link' | 'notification'
}

export async function logEmail(db: Database, options: LogEmailOptions) {
  try {
    await db.insert(emailLogs).values([
      {
        id: crypto.randomUUID(),
        userId: options.userId,
        to: JSON.stringify(options.to.map((r) => r.email)),
        subject: options.subject,
        provider: options.provider as 'resend' | 'sendgrid' | 'postmark',
        status: options.status,
        messageId: options.messageId,
        error: options.error,
        emailType: options.emailType,
      } as const,
    ] as const)
  } catch (err) {
    console.error('Failed to log email:', err)
  }
}
