import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'

export function useAuth() {
  const queryClient = useQueryClient()

  // Get current session
  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await authClient.getSession()
      if (error) {
        return null
      }
      return data
    },
  })

  // Sign in mutation
  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await authClient.signIn.email({ email, password })
      if (error) {
        throw new Error(error.message || 'Failed to sign in')
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  // Sign up mutation
  const signUp = useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string
      password: string
      name: string
    }) => {
      const { data, error } = await authClient.signUp.email({ email, password, name })
      if (error) {
        throw new Error(error.message || 'Failed to sign up')
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  // Sign out mutation
  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await authClient.signOut()
      if (error) {
        throw new Error(error.message || 'Failed to sign out')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] })
    },
  })

  return {
    session,
    user: session?.user ?? null,
    isLoading,
    isAuthenticated: !!session?.user,
    signIn,
    signUp,
    signOut,
  }
}
