import type { ParsedLocation } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'
import type { RouteContext } from '@/types/auth'

/**
 * Route guard that requires authentication.
 * Use in beforeLoad to protect routes.
 *
 * @example
 * export const Route = createFileRoute('/dashboard')({
 *   beforeLoad: requireAuth(),
 * })
 */
export const requireAuth = () => {
  return ({ context, location }: { context: RouteContext; location: ParsedLocation }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/',
        search: {
          redirect: location.pathname,
        },
      })
    }
  }
}

/**
 * Route guard that redirects authenticated users away.
 * Use for login/signup pages to prevent authenticated users from accessing them.
 *
 * @example
 * export const Route = createFileRoute('/login')({
 *   beforeLoad: redirectIfAuthed('/dashboard'),
 * })
 */
export const redirectIfAuthed = (to = '/dashboard') => {
  return ({ context }: { context: RouteContext }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to })
    }
  }
}
