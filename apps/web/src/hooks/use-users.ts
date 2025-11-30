import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

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
