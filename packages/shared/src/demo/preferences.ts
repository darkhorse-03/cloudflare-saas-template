import { z } from 'zod'

// Schema for user preferences example
export const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.boolean().optional(),
  language: z.string().length(2).optional(), // ISO 639-1 code
})

// Inferred input type
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>

// Response type
export interface UserPreferences {
  userId: string
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  language: string
  updatedAt: number
}
