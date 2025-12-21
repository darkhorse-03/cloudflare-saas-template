import { useSession } from '@/lib/auth-client'

export function useAuth() {
  // Use better-auth's built-in useSession hook
  // Deduplication is handled automatically by better-auth
  const { data: session, isPending } = useSession()

  return {
    session,
    user: session?.user ?? null,
    isLoading: isPending,
    isAuthenticated: !!session?.user,
  }
}
