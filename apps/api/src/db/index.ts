import type { D1Database } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'
import { schema } from './schema'

export function getDb(database: D1Database) {
  return drizzle(database, {
    schema,
    logger: true,
  })
}

export type Database = ReturnType<typeof getDb>
