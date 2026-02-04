import { useMutation } from '@tanstack/react-query'
import type { ExportRequestInput } from '@repo/shared'
import { api } from '@/lib/api'

export function useExport() {
  const exportData = useMutation({
    mutationFn: async (data: ExportRequestInput) => {
      const res = await api.demo.export.$post({ json: data })
      if (!res.ok) {
        throw new Error('Failed to queue export')
      }
      return res.json()
    },
  })

  return {
    exportData,
    isLoading: exportData.isPending,
    error: exportData.error,
  }
}
