import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import users from './auth'

// Demo items table - example of user-scoped data
const demoItems = sqliteTable(
  'demo_items',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    description: text('description'),
    category: text('category', { enum: ['work', 'personal', 'other'] })
      .notNull()
      .default('other'),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('demo_items_userId_idx').on(table.userId)],
)

// Demo preferences table - example of user settings
const demoPreferences = sqliteTable('demo_preferences', {
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  theme: text('theme', { enum: ['light', 'dark', 'system'] })
    .notNull()
    .default('system'),
  notifications: integer('notifications', { mode: 'boolean' }).notNull().default(true),
  language: text('language').notNull().default('en'),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
})

export default demoItems
export { demoPreferences }
