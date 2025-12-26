// Core email types and interfaces

export interface EmailRecipient {
  email: string
  name?: string
}

export interface EmailOptions {
  to: EmailRecipient | EmailRecipient[]
  from: EmailRecipient
  subject: string
  html?: string
  react?: React.ReactElement
  text?: string
  replyTo?: EmailRecipient
}

export interface EmailSendResult {
  success: boolean
  messageId?: string
  error?: string
}

// Provider interface - all email providers must implement this
export interface EmailProvider {
  send(options: EmailOptions): Promise<EmailSendResult>
  getName(): string
}

// Template rendering types
export interface EmailTemplateContext {
  user?: {
    name: string
    email: string
  }
  [key: string]: unknown
}
