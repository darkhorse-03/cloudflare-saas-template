import { useMutation } from '@tanstack/react-query'
import {
  signIn as signInAction,
  signOut as signOutAction,
  signUp as signUpAction,
  useSession,
} from '@/lib/auth-client'

export function useAuth() {
  // Use better-auth's built-in useSession hook
  // Deduplication is handled automatically by better-auth
  const { data: session, isPending } = useSession()

  // Sign in mutation
  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await signInAction.email({ email, password })
      if (error) {
        throw new Error(error.message || 'Failed to sign in')
      }
      return data
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
      const { data, error } = await signUpAction.email({ email, password, name })
      if (error) {
        throw new Error(error.message || 'Failed to sign up')
      }
      return data
    },
  })

  // Sign out mutation
  const signOut = useMutation({
    mutationFn: async () => {
      const { error } = await signOutAction()
      if (error) {
        throw new Error(error.message || 'Failed to sign out')
      }
    },
  })

  return {
    session,
    user: session?.user ?? null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
    signIn,
    signUp,
    signOut,
  }
}
