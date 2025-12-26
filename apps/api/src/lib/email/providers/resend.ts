import { Resend } from 'resend'
import type { EmailOptions, EmailProvider, EmailSendResult } from '../types'

export class ResendProvider implements EmailProvider {
  private readonly client: Resend

  constructor(apiKey: string) {
    this.client = new Resend(apiKey)
  }

  async send(options: EmailOptions): Promise<EmailSendResult> {
    try {
      const { data, error } = await this.client.emails.send({
        from: `${options.from.name || 'Zynth'} <${options.from.email}>`,
        to: Array.isArray(options.to) ? options.to.map((r) => r.email) : [options.to.email],
        subject: options.subject,
        html: options.html,
        react: options.react,
        text: options.text,
        replyTo: options.replyTo?.email,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, messageId: data?.id }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
    }
  }

  getName(): string {
    return 'resend'
  }
}
