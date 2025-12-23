import type { D1Database, KVNamespace } from '@cloudflare/workers-types'
import type { Session, User } from 'better-auth'
import type { createAuth } from './auth'

export type Auth = ReturnType<typeof createAuth>

export interface AppContext {
  Bindings: {
    DB: D1Database
    KV: KVNamespace
  }
  Variables: {
    auth: Auth
    user: User | null
    session: Session | null
  }
}

// Simpler type alias for places that only need bindings
export type Env = AppContext['Bindings']
