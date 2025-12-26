import type { D1Database, IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { config } from '@repo/config'
import { betterAuth, type User } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { withCloudflare } from 'better-auth-cloudflare'
import { getDb } from '@/db'
import { createEmailService } from '@/lib/email'
import { PasswordResetEmail } from '@/lib/email/templates/password-reset-email'
import { VerificationEmail } from '@/lib/email/templates/verification-email'
import { WelcomeEmail } from '@/lib/email/templates/welcome-email'
import type { Env } from '../env'

// Single auth configuration that handles both CLI and runtime scenarios
function createAuth(env?: Env, cf?: IncomingRequestCfProperties) {
  // Use actual DB for runtime, empty object for CLI schema generation
  // biome-ignore lint: false positive
  const db = env ? getDb(env.DB) : ({} as any)

  // Create email service if environment is available
  const emailService = env ? createEmailService(env) : null

  return betterAuth({
    basePath: '/auth', // Web worker strips /api, so we get /auth here
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days (in seconds)
      updateAge: 60 * 60 * 24, // Update session if older than 1 day
    },
    ...withCloudflare(
      {
        autoDetectIpAddress: true,
        geolocationTracking: true,
        cf: cf || {},
        d1: env
          ? {
              db,
              options: {
                usePlural: true,
                debugLogs: true,
              },
            }
          : undefined,
        kv: env?.KV,
      },
      {
        emailAndPassword: {
          enabled: true,
          autoSignIn: false, // Don't auto sign-in when email verification is required
          requireEmailVerification: !!emailService,
          sendResetPassword: emailService
            ? async ({ user, url }: { user: User; url: string }) => {
                await emailService.send({
                  to: { email: user.email },
                  subject: 'Reset your password',
                  react: PasswordResetEmail({ userName: user.name || 'there', resetUrl: url }),
                })
              }
            : undefined,
        },
        rateLimit: {
          enabled: true,
          window: 60, // Minimum KV TTL is 60s
          max: 100, // reqs/window
          customRules: {
            '/sign-in/email': {
              window: 60,
              max: 10,
            },
            '/sign-up/email': {
              window: 60,
              max: 5,
            },
          },
        },
      },
    ),
    emailVerification: emailService
      ? {
          sendOnSignUp: true,
          sendVerificationEmail: async ({ user, url }) => {
            await emailService.send({
              to: { email: user.email },
              subject: 'Verify your email address',
              react: VerificationEmail({ userName: user.name || 'there', verificationUrl: url }),
            })
          },
          autoSignInAfterVerification: true,
          async afterEmailVerification(user) {
            await emailService.send({
              to: { email: user.email },
              subject: `Welcome to ${config.appName}!`,
              react: WelcomeEmail({
                userName: user.name || 'there',
                dashboardUrl: `https://${config.domains[0]}/dashboard`,
              }),
            })
          },
        }
      : undefined,
    // Only add database adapter for CLI schema generation
    ...(env
      ? {}
      : {
          database: drizzleAdapter({} as D1Database, {
            provider: 'sqlite',
            usePlural: true,
            debugLogs: true,
          }),
        }),
  })
}

// Export for CLI schema generation
export const auth = createAuth()

// Export for runtime usage
export { createAuth }
