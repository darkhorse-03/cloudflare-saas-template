import { z } from 'zod'

export const exportRequestSchema = z.object({
  format: z.enum(['csv', 'json']).default('json'),
  rows: z.number().min(1).max(1000).default(100),
})

export type ExportRequestInput = z.infer<typeof exportRequestSchema>
