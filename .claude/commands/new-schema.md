# Create Database Schema

Create new database tables and schemas for your application using Drizzle ORM and D1.

## When to Use

- Creating new database tables for features
- Adding user-scoped data (posts, items, orders, etc.)
- Defining relationships between tables
- Setting up user preferences or settings

## Decision: New File or Add to Existing?

**Create a new schema file when:**
- Starting a new feature domain (e.g., `blog.ts`, `products.ts`, `orders.ts`)
- The tables are logically separate from existing schemas

**Add to existing schema file when:**
- Tables are closely related to existing ones in that file
- It's a small addition (1-2 tables) to an existing domain

## File Location

```
apps/api/src/db/schema/{feature}.ts
```

Examples: `blog.ts`, `products.ts`, `notifications.ts`

---

## Template 1: User-Scoped Table (Most Common)

Use this for any data that belongs to a specific user (posts, items, tasks, etc.)

```typescript
import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import users from './auth'

// Example: User's blog posts
const posts = sqliteTable(
  'posts',
  {
    id: text('id').primaryKey(),
    // Foreign key to users table with cascade delete
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    // Your fields
    title: text('title').notNull(),
    content: text('content').notNull(),
    published: integer('published', { mode: 'boolean' }).notNull().default(false),

    // Auto-managed timestamps
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  // Index on userId for fast lookups
  (table) => [index('posts_userId_idx').on(table.userId)],
)

// Define relation to users (optional, enables query API)
export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}))

export default posts
```

**Route usage:**
```typescript
// Get user's posts
const userPosts = await db.query.posts.findMany({
  where: eq(posts.userId, user.id),
  orderBy: (posts, { desc }) => [desc(posts.createdAt)],
})

// Create post
await db.insert(posts).values({
  id: crypto.randomUUID(),
  userId: user.id,
  title: data.title,
  content: data.content,
})
```

---

## Template 2: User Settings Table (One-to-One)

Use this for user-specific settings, preferences, or profiles (one record per user).

```typescript
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import users from './auth'

const userSettings = sqliteTable('user_settings', {
  // userId is BOTH primary key AND foreign key
  userId: text('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Settings fields
  emailNotifications: integer('email_notifications', { mode: 'boolean' })
    .notNull()
    .default(true),
  theme: text('theme', { enum: ['light', 'dark', 'system'] })
    .notNull()
    .default('system'),
  language: text('language').notNull().default('en'),

  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
})

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}))

export default userSettings
```

**Route usage:**
```typescript
// Get or create settings
let settings = await db.query.userSettings.findFirst({
  where: eq(userSettings.userId, user.id),
})

if (!settings) {
  await db.insert(userSettings).values({ userId: user.id })
  settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, user.id),
  })
}

// Update settings
await db.update(userSettings)
  .set({ theme: 'dark', emailNotifications: false })
  .where(eq(userSettings.userId, user.id))
```

---

## Template 3: Table with Enums

Use this when you have constrained values (status, category, role, etc.)

```typescript
import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import users from './auth'

const tasks = sqliteTable(
  'tasks',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: text('title').notNull(),
    description: text('description'),

    // Enum fields - enforced at database level
    status: text('status', {
      enum: ['todo', 'in_progress', 'done', 'archived']
    }).notNull().default('todo'),

    priority: text('priority', {
      enum: ['low', 'medium', 'high', 'urgent']
    }).notNull().default('medium'),

    dueDate: integer('due_date', { mode: 'timestamp_ms' }),

    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('tasks_userId_idx').on(table.userId)],
)

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}))

export default tasks
```

**Corresponding Zod schema:**
```typescript
// packages/shared/src/tasks/schema.ts
export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(['todo', 'in_progress', 'done', 'archived']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  dueDate: z.number().optional(),
})
```

---

## Template 4: Many-to-Many (Junction Table)

Use this for relationships like tags, categories, permissions, team members, etc.

```typescript
import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import users from './auth'

// Main tables
const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
})

const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
})

// Junction table - links posts to tags
const postsTags = sqliteTable(
  'posts_tags',
  {
    postId: text('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [
    // Composite primary key
    index('posts_tags_pk').on(table.postId, table.tagId),
    // Indexes for efficient lookups
    index('posts_tags_postId_idx').on(table.postId),
    index('posts_tags_tagId_idx').on(table.tagId),
  ],
)

// Relations for query API
export const postsRelations = relations(posts, ({ many }) => ({
  postsTags: many(postsTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  postsTags: many(postsTags),
}))

export const postsTagsRelations = relations(postsTags, ({ one }) => ({
  post: one(posts, {
    fields: [postsTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postsTags.tagId],
    references: [tags.id],
  }),
}))

export default posts
export { tags, postsTags }
```

**Query with tags:**
```typescript
// Get post with its tags
const postWithTags = await db.query.posts.findFirst({
  where: eq(posts.id, postId),
  with: {
    postsTags: {
      with: {
        tag: true,
      },
    },
  },
})

// Add tag to post
await db.insert(postsTags).values({
  postId: post.id,
  tagId: tag.id,
})

// Remove tag from post
await db.delete(postsTags)
  .where(and(
    eq(postsTags.postId, post.id),
    eq(postsTags.tagId, tag.id),
  ))
```

---

## Integration Checklist

After creating your schema file, update these files:

### 1. Update `apps/api/src/db/index.ts`

```typescript
import posts from './schema/posts'  // Add your import

const schema = {
  // ...existing tables
  posts,  // Add to schema object
  // ...relations
}
```

### 2. Create shared types in `packages/shared/src/{feature}/`

Create validation schemas and types:

```typescript
// packages/shared/src/posts/posts.ts
import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  published: z.boolean().default(false),
})

export type CreatePostInput = z.infer<typeof createPostSchema>

export interface Post {
  id: string
  userId: string
  title: string
  content: string
  published: boolean
  createdAt: number
  updatedAt: number
}
```

### 3. Export from `packages/shared/src/index.ts`

```typescript
export type { Post, CreatePostInput } from './posts/posts'
export { createPostSchema } from './posts/posts'
```

---

## Migration Commands

### Generate Migration

```bash
cd apps/api
bunx drizzle-kit generate
```

This creates a new SQL migration file in `apps/api/drizzle/`.

### Apply Migration (Local Development)

Migrations are applied automatically when you run `bun dev`.

### Apply Migration (Production)

```bash
cd apps/api
bunx drizzle-kit migrate
```

---

## Reference Implementation

See working examples in:
- `apps/api/src/db/schema/demo.ts` - User-scoped tables with enums
- `apps/api/src/routes/demo/items.ts` - CRUD route with user scoping
- `apps/api/src/routes/demo/preferences.ts` - One-to-one settings pattern

## Best Practices

✅ **Always scope data to users** - Use `userId` foreign key with cascade delete
✅ **Add indexes on foreign keys** - Improves query performance
✅ **Use enums for constrained values** - Type-safe at database level
✅ **Auto-manage timestamps** - Use `$onUpdate` for `updatedAt`
✅ **Define relations** - Enables Drizzle's query API with joins
✅ **Match DB schema to Zod schema** - Keep validation in sync

❌ **Don't use barrel files** - Import schemas directly
❌ **Don't skip user ownership checks** - Always verify in routes
❌ **Don't forget indexes** - Add them for frequently queried fields
