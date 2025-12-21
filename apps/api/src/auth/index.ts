import type { D1Database, IncomingRequestCfProperties } from '@cloudflare/workers-types'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { withCloudflare } from 'better-auth-cloudflare'
import { drizzle } from 'drizzle-orm/d1'
import { schema } from '../db/schema'
import type { Env } from '../env'

// Single auth configuration that handles both CLI and runtime scenarios
function createAuth(env?: Env, cf?: IncomingRequestCfProperties) {
  // Use actual DB for runtime, empty object for CLI schema generation
  // biome-ignore lint: false positive
  const db = env ? drizzle(env.DB, { schema, logger: true }) : ({} as any)

  return betterAuth({
    basePath: '/auth', // Web worker strips /api, so we get /auth here
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
          autoSignIn: true,
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
