import type { Session, User } from 'better-auth'
import type { createAuth } from './auth'
import type { WorkerEnv } from './env.d'
import type { EmailService } from './lib/email'

export type Auth = ReturnType<typeof createAuth>

// Bindings are inferred from alchemy.run.ts for type safety
export interface AppContext {
  Bindings: WorkerEnv
  Variables: {
    auth: Auth
    user: User | null
    session: Session | null
    emailService?: EmailService
  }
}

// Simpler type alias for places that only need bindings
export type Env = WorkerEnv
