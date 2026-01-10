import { config } from '@repo/config'
import type { Env } from '../env'

export function getSocialProviders(env?: Env) {
  return {
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
  }
}
