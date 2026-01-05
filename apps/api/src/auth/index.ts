import type {
  D1Database,
  IncomingRequestCfProperties,
  KVNamespace,
} from '@cloudflare/workers-types'
import { config } from '@repo/config'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { captcha, emailOTP, lastLoginMethod, magicLink } from 'better-auth/plugins'
import { withCloudflare } from 'better-auth-cloudflare'
import { getDb } from '@/db'
import { createEmailService } from '@/lib/email'
import { MagicLinkEmail } from '@/lib/email/templates/magic-link-email'
import { OtpEmail } from '@/lib/email/templates/otp-email'
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

  // Feature flags from shared config
  const enableMagicLink = config.auth.enableMagicLink

  return betterAuth({
    baseURL: config.webUrl,
    basePath: '/auth', // Web worker strips /api, so we get /auth here
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
        domain: '.zynth.dev',
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days (in seconds)
      updateAge: 60 * 60 * 24, // Update session if older than 1 day
    },
    // OAuth providers (enabled via config + credentials from env)
    socialProviders: {
      ...(config.auth.enableGoogleOAuth && env?.GOOGLE_CLIENT_ID
        ? {
            google: {
              clientId: env.GOOGLE_CLIENT_ID,
              clientSecret: env.GOOGLE_CLIENT_SECRET,
            },
          }
        : {}),
      ...(config.auth.enableGitHubOAuth && env?.GITHUB_CLIENT_ID
        ? {
            github: {
              clientId: env.GITHUB_CLIENT_ID,
              clientSecret: env.GITHUB_CLIENT_SECRET,
            },
          }
        : {}),
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
        kv: env?.KV as KVNamespace | undefined,
      },
      {
        emailAndPassword: {
          enabled: true,
          autoSignIn: false, // Don't auto sign-in when email verification is required
          requireEmailVerification: !!emailService,
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
                dashboardUrl: `https://${config.domains.web}/dashboard`,
              }),
            })
          },
        }
      : undefined,
    plugins: [
      // Cloudflare Turnstile bot protection (if configured)
      ...(config.auth.turnstileSiteKey && env?.TURNSTILE_SECRET_KEY
        ? [
            captcha({
              provider: 'cloudflare-turnstile',
              secretKey: env.TURNSTILE_SECRET_KEY,
            }),
          ]
        : []),
      lastLoginMethod({
        customResolveMethod: (ctx) => {
          // Track magic link authentication
          if (ctx.path === '/magic-link/verify') {
            return 'magic-link'
          }
          // Track email OTP authentication
          if (ctx.path === '/email-otp/verify-email') {
            return 'email-otp'
          }
          return null
        },
      }),
      ...(emailService
        ? [
            emailOTP({
              otpLength: 6,
              expiresIn: 300, // 5 minutes
              async sendVerificationOTP({ email, otp, type }) {
                const subjectByType: Record<string, string> = {
                  'forget-password': 'Reset your password',
                  'email-verification': 'Verify your email',
                }
                await emailService.send({
                  to: { email },
                  subject: subjectByType[type] ?? 'Your sign-in code',
                  react: OtpEmail({
                    userName: email.split('@')[0],
                    otp,
                    type,
                    expiresInMinutes: 5,
                  }),
                  emailType: type === 'forget-password' ? 'password_reset' : 'verification',
                })
              },
            }),
            ...(enableMagicLink
              ? [
                  magicLink({
                    async sendMagicLink({ email, url }) {
                      await emailService.send({
                        to: { email },
                        subject: 'Sign in to your account',
                        react: MagicLinkEmail({
                          userName: email.split('@')[0],
                          magicLink: url,
                          expiresInMinutes: 10,
                        }),
                        emailType: 'magic_link',
                      })
                    },
                  }),
                ]
              : []),
          ]
        : []),
    ],
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
