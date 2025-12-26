import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { users } from './auth'

export const emailLogs = sqliteTable(
  'email_logs',
  {
    id: text('id').primaryKey(),

    // Optional user association (null for pre-signup emails)
    userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),

    // Email details
    to: text('to').notNull(), // JSON array of recipients
    subject: text('subject').notNull(),

    // Delivery tracking
    provider: text('provider', { enum: ['resend', 'sendgrid', 'postmark'] })
      .notNull()
      .default('resend'),
    status: text('status', { enum: ['sent', 'failed', 'bounced', 'delivered'] })
      .notNull()
      .default('sent'),
    messageId: text('message_id'), // Provider's message ID
    error: text('error'), // Error message if failed

    // Metadata
    emailType: text('email_type', {
      enum: ['verification', 'password_reset', 'welcome', 'magic_link', 'notification'],
    }),

    // Timestamps
    sentAt: integer('sent_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index('email_logs_userId_idx').on(table.userId),
    index('email_logs_status_idx').on(table.status),
    index('email_logs_sentAt_idx').on(table.sentAt),
    index('email_logs_emailType_idx').on(table.emailType),
  ],
)
