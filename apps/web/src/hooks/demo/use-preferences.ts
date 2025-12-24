import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UpdatePreferencesInput } from '@repo/shared'
import { api } from '@/lib/api'

export function usePreferences() {
  const queryClient = useQueryClient()

  // Fetch user preferences
  const query = useQuery({
    queryKey: ['demo-preferences'],
    queryFn: async () => {
      const res = await api.demo.preferences.$get()
      if (!res.ok) {
        throw new Error('Failed to fetch preferences')
      }
      return res.json()
    },
  })

  // Update preferences
  const updatePreferences = useMutation({
    mutationFn: async (data: UpdatePreferencesInput) => {
      const res = await api.demo.preferences.$patch({ json: data })
      if (!res.ok) {
        throw new Error('Failed to update preferences')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['demo-preferences'] })
    },
  })

  return {
    preferences: query.data?.preferences,
    isLoading: query.isLoading,
    error: query.error,
    updatePreferences,
  }
}
