import { z } from 'zod'

// Schemas for protected CRUD example
export const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['work', 'personal', 'other']).default('other'),
})

export const updateItemSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(['work', 'personal', 'other']).optional(),
})

// Inferred input types
export type CreateItemInput = z.infer<typeof createItemSchema>
export type UpdateItemInput = z.infer<typeof updateItemSchema>

// Response type
export interface UserItem {
  id: string
  userId: string
  title: string
  description?: string
  category: 'work' | 'personal' | 'other'
  createdAt: number
  updatedAt: number
}
