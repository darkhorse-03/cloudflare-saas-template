import type { D1Database } from '@cloudflare/workers-types'
import { config } from '@repo/config'
import type { Database } from '@/db'
import { getDb } from '@/db'
import { logEmail } from './logger'
import { ResendProvider } from './providers/resend'
import type { EmailOptions, EmailProvider, EmailSendResult } from './types'

interface EmailServiceConfig {
  provider: 'resend' // Future: | 'sendgrid' | 'postmark' | 'ses'
  apiKey: string
  fromEmail: string
  fromName?: string
}

export class EmailService {
  private readonly provider: EmailProvider
  private readonly db: Database
  private readonly defaultFrom: { email: string; name: string }

  constructor(serviceConfig: EmailServiceConfig, db: Database) {
    // Factory pattern - switch providers based on config
    switch (serviceConfig.provider) {
      case 'resend':
        this.provider = new ResendProvider(serviceConfig.apiKey)
        break
      // Future providers:
      // case 'sendgrid':
      //   this.provider = new SendGridProvider(serviceConfig.apiKey)
      //   break
      default:
        throw new Error(`Unsupported email provider: ${serviceConfig.provider}`)
    }

    this.db = db
    this.defaultFrom = {
      email: serviceConfig.fromEmail,
      name: serviceConfig.fromName || config.appName,
    }
  }

  async send(
    options: Partial<EmailOptions> & {
      userId?: string
      emailType?: 'verification' | 'password_reset' | 'welcome' | 'magic_link' | 'notification'
    },
  ): Promise<EmailSendResult> {
    const fullOptions: EmailOptions = {
      from: options.from || this.defaultFrom,
      to: options.to || [],
      subject: options.subject || '',
      html: options.html || '',
      react: options.react,
      text: options.text,
      replyTo: options.replyTo,
    }

    const result = await this.provider.send(fullOptions)

    // Log email asynchronously (don't await to prevent timing attacks)
    logEmail(this.db, {
      to: Array.isArray(fullOptions.to) ? fullOptions.to : [fullOptions.to],
      subject: fullOptions.subject,
      provider: this.provider.getName(),
      status: result.success ? 'sent' : 'failed',
      messageId: result.messageId,
      error: result.error,
      userId: options.userId,
      emailType: options.emailType,
    })

    return result
  }
}

// Factory function following existing patterns (getDb, createAuth)
export function createEmailService(env: {
  RESEND_API_KEY?: string
  FROM_EMAIL?: string
  DB: D1Database
}): EmailService | null {
  // Return null if email env vars not configured
  if (!(env.RESEND_API_KEY && env.FROM_EMAIL)) {
    return null
  }

  const db = getDb(env.DB)

  return new EmailService(
    {
      provider: 'resend',
      apiKey: env.RESEND_API_KEY,
      fromEmail: env.FROM_EMAIL,
      fromName: config.appName,
    },
    db,
  )
}
