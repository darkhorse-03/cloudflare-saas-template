import { polarClient } from '@polar-sh/better-auth'
import { emailOTPClient, lastLoginMethodClient, magicLinkClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  fetchOptions: {
    credentials: 'include', // Ensure cookies are sent cross-origin
  },
  plugins: [emailOTPClient(), magicLinkClient(), lastLoginMethodClient(), polarClient()],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  $Infer,
  $ERROR_CODES,
  emailOtp,
  forgetPassword,
} = authClient
