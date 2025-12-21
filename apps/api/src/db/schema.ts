// Combine all schemas here for migrations
import { authSchema } from './auth.schema'

export const schema = {
  ...authSchema,
  // Add your other application schemas here
} as const
