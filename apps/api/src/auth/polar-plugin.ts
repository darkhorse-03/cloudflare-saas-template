import { checkout, polar, portal, webhooks } from '@polar-sh/better-auth'
import { config } from '@repo/config'
import type { Env } from '../env'
import { log } from '../lib/logger'

// biome-ignore lint/suspicious/noExplicitAny: Polar client type is dynamic
export function getPolarPlugin(polarClient: any, env?: Env) {
  return polar({
    client: polarClient,
    createCustomerOnSignUp: true,
    // Include externalId on creation to avoid the plugin trying to update it later
    // (Polar doesn't allow updating externalId once set)
    // Type assertion needed - the runtime spreads these params into customers.create()
    getCustomerCreateParams: async ({ user }) =>
      ({ externalId: user.id }) as { metadata?: Record<string, string | number | boolean> },
    use: [
      checkout({
        products: Object.entries(config.payments.plans).flatMap(([slug, plan]) => {
          const pricing = plan.pricing as Record<
            string,
            { price: number; productId: string } | undefined
          >
          return Object.entries(pricing)
            .filter(
              (entry): entry is [string, { price: number; productId: string }] =>
                !!entry[1]?.productId,
            )
            .map(([type, p]) => ({
              productId: p.productId,
              slug: `${slug}-${type}`,
            }))
        }),
        successUrl: config.payments.successUrl,
        authenticatedUsersOnly: true,
      }),
      portal(),
      webhooks({
        secret: env?.POLAR_WEBHOOK_SECRET ?? '',
        // biome-ignore lint/suspicious/useAwait: Type requires async but no await needed yet
        onPayload: async (payload) => {
          log.info('polar.webhook', { type: payload.type })
        },
      }),
    ],
  })
}
