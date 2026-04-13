import { config } from '@repo/config'
import type { Env } from '../env'

export function getSocialProviders(env?: Env) {
  return {
    // @feature google-oauth
    ...(config.auth.enableGoogleOAuth && env?.GOOGLE_CLIENT_ID
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
    // @end google-oauth
    // @feature github-oauth
    ...(config.auth.enableGitHubOAuth && env?.GITHUB_CLIENT_ID
      ? {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
    // @end github-oauth
  }
}
