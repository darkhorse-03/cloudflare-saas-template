import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

// Storage status
export function useStorageStatus() {
  return useQuery({
    queryKey: ['storage', 'status'],
    queryFn: async () => {
      const res = await api.storage.status.$get()
      if (!res.ok) {
        throw new Error('Failed to fetch storage status')
      }
      return res.json()
    },
  })
}

// List files
export function useStorageFiles(prefix?: string) {
  return useQuery({
    queryKey: ['storage', 'files', prefix],
    queryFn: async () => {
      const res = await api.storage.list.$get({
        query: prefix ? { prefix } : {},
      })
      if (!res.ok) {
        throw new Error('Failed to list files')
      }
      return res.json()
    },
  })
}

// Upload file
export function useUploadFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, prefix }: { file: File; prefix?: string }) => {
      const res = await api.storage.upload.$post({
        form: {
          file,
          prefix: prefix || 'uploads',
        },
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error((error as { error?: string }).error || 'Upload failed')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storage', 'files'] })
    },
  })
}

// Delete file
export function useDeleteFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (key: string) => {
      const res = await api.storage.files[':key{.+}'].$delete({
        param: { key },
      })
      if (!res.ok) {
        throw new Error('Failed to delete file')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storage', 'files'] })
    },
  })
}

// Avatar hooks
export function useAvatar() {
  return useQuery({
    queryKey: ['storage', 'avatar', 'me'],
    queryFn: async () => {
      const res = await api.storage.avatars.me.$get()
      if (!res.ok) {
        throw new Error('Failed to fetch avatar')
      }
      return res.json()
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const res = await api.storage.avatars.$post({
        form: { file },
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error((error as { error?: string }).error || 'Avatar upload failed')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storage', 'avatar'] })
    },
  })
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await api.storage.avatars.me.$delete()
      if (!res.ok) {
        throw new Error('Failed to delete avatar')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storage', 'avatar'] })
    },
  })
}
