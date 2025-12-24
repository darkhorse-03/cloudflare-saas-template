import type { D1Database } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'
import users, {
  accounts,
  accountsRelations,
  sessions,
  sessionsRelations,
  usersRelations,
  verifications,
} from './schema/auth'
import demoItems, { demoPreferences } from './schema/demo'

const schema = {
  users,
  sessions,
  accounts,
  verifications,
  usersRelations,
  sessionsRelations,
  accountsRelations,
  demoItems,
  demoPreferences,
}

export function getDb(database: D1Database) {
  return drizzle(database, {
    schema,
    logger: true,
  })
}

export type Database = ReturnType<typeof getDb>
