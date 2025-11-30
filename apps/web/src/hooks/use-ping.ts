import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const usePing = () => {
  return useQuery({
    queryKey: ['ping'],
    queryFn: async () => {
      const start = performance.now()
      await api.ping.$get()
      const end = performance.now()
      return Math.round(end - start)
    },
  })
}
