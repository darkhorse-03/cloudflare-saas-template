// @feature payments
import { polarClient } from '@polar-sh/better-auth'
// @end payments
// @feature email
import { emailOTPClient, magicLinkClient } from 'better-auth/client/plugins'
// @end email
import { lastLoginMethodClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  fetchOptions: {
    credentials: 'include', // Ensure cookies are sent cross-origin
  },
  plugins: [
    // @feature email
    emailOTPClient(),
    magicLinkClient(),
    // @end email
    lastLoginMethodClient(),
    // @feature payments
    polarClient(),
    // @end payments
  ],
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
