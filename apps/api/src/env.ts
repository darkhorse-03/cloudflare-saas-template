import type { D1Database, KVNamespace } from '@cloudflare/workers-types'
import type { Session, User } from 'better-auth'
import type { createAuth } from './auth'
import type { EmailService } from './lib/email'

export type Auth = ReturnType<typeof createAuth>

export interface AppContext {
  Bindings: {
    DB: D1Database
    KV: KVNamespace
    RESEND_API_KEY?: string
    FROM_EMAIL?: string
  }
  Variables: {
    auth: Auth
    user: User | null
    session: Session | null
    emailService?: EmailService
  }
}

// Simpler type alias for places that only need bindings
export type Env = AppContext['Bindings']
