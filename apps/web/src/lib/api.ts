import { createApiClient } from '@repo/api-client'
import { useQuery } from '@tanstack/react-query'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export const api = createApiClient(API_URL)

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.users.$get()
      return res.json()
    },
  })
}

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: async () => {
      const res = await api.users[':id'].$get({ param: { id: String(id) } })
      return res.json()
    },
    enabled: !!id,
  })
}

export const useHealth = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const res = await api.health.$get()
      return res.json()
    },
  })
}
