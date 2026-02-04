---
description: Scaffold a new background job handler
arguments:
  - name: job_type
    description: Job type in dot notation (e.g., "image.process", "notification.send", "report.generate")
    required: true
---

Create a new background job handler for `$ARGUMENTS.job_type`:

## 1. Add Job Type Definition

**File:** `apps/api/src/jobs/types.ts`

Add to the `Job` union type:

```ts
export type Job =
  // ... existing types
  | { type: '$ARGUMENTS.job_type'; /* add your parameters */ }
```

**Example parameters based on job type:**
- `image.process` → `key: string; sizes: number[]`
- `notification.send` → `userId: string; title: string; body: string`
- `report.generate` → `reportType: string; startDate: string; endDate: string`

## 2. Create Job Handler

**File:** `apps/api/src/jobs/handlers/[category].ts`

Extract category from job type (e.g., `image.process` → `image.ts`):

```ts
import type { JobHandler } from '../types'

export const ${ARGUMENTS.job_type.replace('.', '')}Handler: JobHandler<'$ARGUMENTS.job_type'> = async (job, ctx) => {
  ctx.log.info('job.$ARGUMENTS.job_type.start', { /* log relevant params */ })

  // Your job logic here
  // Access database: ctx.db
  // Access env bindings: ctx.env
  // Access logger: ctx.log

  ctx.log.info('job.$ARGUMENTS.job_type.complete', { /* log results */ })
}
```

## 3. Register Handler

**File:** `apps/api/src/jobs/registry.ts`

```ts
import { ${ARGUMENTS.job_type.replace('.', '')}Handler } from './handlers/[category]'

export const handlers: { [T in JobType]: JobHandler<T> } = {
  // ... existing handlers
  '$ARGUMENTS.job_type': ${ARGUMENTS.job_type.replace('.', '')}Handler,
}
```

## 4. Usage

**Enqueue from any route:**

```ts
import { enqueue } from '@/jobs'

app.post('/something', async (c) => {
  // Your route logic...

  // Enqueue the job
  await enqueue(c.env.JOBS, {
    type: '$ARGUMENTS.job_type',
    // ... your parameters
  })

  return c.json({ success: true })
})
```

**Enqueue batch:**

```ts
import { enqueueBatch } from '@/jobs'

await enqueueBatch(c.env.JOBS, [
  { type: '$ARGUMENTS.job_type', /* params */ },
  { type: '$ARGUMENTS.job_type', /* params */ },
])
```

## File Organization

```
apps/api/src/jobs/
├── types.ts          # Add job type to union
├── registry.ts       # Register handler
├── handlers/
│   ├── email.ts      # email.* handlers
│   ├── webhook.ts    # webhook.* handlers
│   ├── cleanup.ts    # cleanup.* handlers
│   └── [category].ts # Your new handler
```

## Job Handler Context

The `JobContext` provides:

```ts
interface JobContext {
  env: Env          // Worker bindings (DB, KV, R2, JOBS, etc.)
  db: Database      // Drizzle database instance
  log: Logger       // Request-scoped logger
}
```

## Best Practices

**Naming:**
- ✅ Use dot notation: `category.action` (e.g., `email.send`, `image.resize`)
- ✅ Keep names descriptive but concise

**Logging:**
- ✅ Log at start and completion
- ✅ Include relevant job parameters in logs
- ✅ Log errors with context

**Error Handling:**
- ✅ Throw errors to trigger retry
- ✅ Jobs retry up to `config.jobs.queue.maxRetries` times
- ✅ After max retries, job goes to dead letter queue (if configured)

**Idempotency:**
- ✅ Design jobs to be safe to retry
- ✅ Use unique IDs to prevent duplicate processing
- ✅ Check if work was already done before proceeding

## Reference Implementation

See working examples:
- `apps/api/src/jobs/handlers/email.ts`
- `apps/api/src/jobs/handlers/webhook.ts`
- `apps/api/src/jobs/handlers/cleanup.ts`
