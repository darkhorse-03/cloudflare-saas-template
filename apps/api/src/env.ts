import type { Session, User } from 'better-auth'
import type { createAuth } from './auth'
import type { WorkerEnv } from './env.d'
// @feature email
import type { EmailService } from './lib/email'
// @end email
import type { Logger } from './lib/logger'

export type Auth = ReturnType<typeof createAuth>

// Bindings are inferred from alchemy.run.ts for type safety
export interface AppContext {
  Bindings: WorkerEnv
  Variables: {
    auth: Auth
    user: User | null
    session: Session | null
    // @feature email
    emailService?: EmailService
    // @end email
    log: Logger
  }
}

// Simpler type alias for places that only need bindings
export type Env = WorkerEnv
