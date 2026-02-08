import type {
  D1Database,
  IncomingRequestCfProperties,
  KVNamespace,
} from '@cloudflare/workers-types'
import { config } from '@repo/config'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { captcha, lastLoginMethod } from 'better-auth/plugins'
import { withCloudflare } from 'better-auth-cloudflare'
import { getDb } from '@/db'
import { createEmailService } from '@/lib/email'
import { VerificationEmail } from '@/lib/email/templates/verification-email'
import { WelcomeEmail } from '@/lib/email/templates/welcome-email'
import type { Env } from '../env'
import { getEmailPlugins } from './email-plugins'
import { getPolarPlugin } from './polar-plugin'
import { getSocialProviders } from './social-providers'

function createAuth(env?: Env, cf?: IncomingRequestCfProperties) {
  // biome-ignore lint/suspicious/noExplicitAny: D1 type mismatch between runtime and CLI
  const db = env ? getDb(env.DB) : ({} as any)
  const emailService = env ? createEmailService(env) : null

  const polarClient =
    config.payments.enabled && env?.POLAR_ACCESS_TOKEN
      ? new (require('@polar-sh/sdk').Polar)({
          accessToken: env.POLAR_ACCESS_TOKEN,
          server: config.payments.server,
        })
      : null

  return betterAuth({
    baseURL: config.webUrl,
    basePath: '/auth',
    trustedOrigins: [
      config.webUrl,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:8787',
    ],
    socialProviders: getSocialProviders(env),
    ...withCloudflare(
      {
        autoDetectIpAddress: true,
        geolocationTracking: true,
        cf: cf || {},
        d1: env ? { db, options: { usePlural: true, debugLogs: true } } : undefined,
        kv: env?.KV as KVNamespace | undefined,
      },
      {
        emailAndPassword: {
          enabled: true,
          autoSignIn: false,
          requireEmailVerification: !!emailService,
        },
        rateLimit: {
          enabled: true,
          window: 60,
          max: 100,
          // Custom rules must have window >= 60s for Cloudflare KV minimum TTL
          // These override Better Auth's default 10s window for auth routes
          customRules: {
            '/sign-in/*': { window: 60, max: 10 },
            '/sign-up/*': { window: 60, max: 5 },
            '/change-password': { window: 60, max: 5 },
            '/change-email': { window: 60, max: 5 },
          },
        },
      },
    ),
    // These must come AFTER withCloudflare spread to override its defaults
    advanced: {
      // Cross-subdomain cookies disabled - this template uses same-domain API (/api/*)
      // Enable if you need auth shared across subdomains (e.g., api.example.com + app.example.com)
      crossSubDomainCookies: {
        enabled: false,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    account: {
      storeStateStrategy: 'cookie',
    },
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
      ...(config.auth.turnstileSiteKey && env?.TURNSTILE_SECRET_KEY
        ? [captcha({ provider: 'cloudflare-turnstile', secretKey: env.TURNSTILE_SECRET_KEY })]
        : []),
      lastLoginMethod({
        customResolveMethod: (ctx) => {
          if (ctx.path === '/magic-link/verify') {
            return 'magic-link'
          }
          if (ctx.path === '/email-otp/verify-email') {
            return 'email-otp'
          }
          return null
        },
      }),
      ...(emailService ? getEmailPlugins(emailService) : []),
      ...(polarClient ? [getPolarPlugin(polarClient, env)] : []),
    ],
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

export const auth = createAuth()
export { createAuth }
