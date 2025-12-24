import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { CreateItemInput, UpdateItemInput } from '@repo/shared'
import { api } from '@/lib/api'

export function useItems() {
  const queryClient = useQueryClient()

  // Fetch all items
  const query = useQuery({
    queryKey: ['demo-items'],
    queryFn: async () => {
      const res = await api.demo.items.$get()
      if (!res.ok) {
        throw new Error('Failed to fetch items')
      }
      return res.json()
    },
  })

  // Create item
  const createItem = useMutation({
    mutationFn: async (data: CreateItemInput) => {
      const res = await api.demo.items.$post({ json: data })
      if (!res.ok) {
        throw new Error('Failed to create item')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-items'] })
    },
  })

  // Update item
  const updateItem = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateItemInput }) => {
      const res = await api.demo.items[':id'].$patch({
        param: { id },
        json: data,
      })
      if (!res.ok) {
        throw new Error('Failed to update item')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-items'] })
    },
  })

  // Delete item
  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.demo.items[':id'].$delete({ param: { id } })
      if (!res.ok) {
        throw new Error('Failed to delete item')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-items'] })
    },
  })

  return {
    items: query.data?.items ?? [],
    isLoading: query.isLoading,
    error: query.error,
    createItem,
    updateItem,
    deleteItem,
  }
}
