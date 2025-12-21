import { createAuthClient } from 'better-auth/react'
import { cloudflareClient } from 'better-auth-cloudflare/client'

export const authClient = createAuthClient({
  // baseURL defaults to current origin (localhost:5173 in dev)
  // Requests go to /api/auth/* which worker routes to API service
  plugins: [cloudflareClient()],
  fetchOptions: {
    credentials: 'include',
  },
})

// Export React hooks provided by better-auth
export const { useSession, signIn, signUp, signOut } = authClient

export type AuthClient = typeof authClient
