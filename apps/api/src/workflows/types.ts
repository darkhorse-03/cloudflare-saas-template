/**
 * Cloudflare Workflows type definitions
 * Each workflow has params (input) and result (output) types
 */

export interface UserOnboardingParams {
  userId: string
  email: string
  name: string
}

export interface UserOnboardingResult {
  completedAt: string
  emailsSent: number
  stepsCompleted: string[]
}
