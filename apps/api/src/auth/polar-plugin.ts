import { checkout, polar, portal, webhooks } from '@polar-sh/better-auth'
import { config } from '@repo/config'
import type { Env } from '../env'

// biome-ignore lint/suspicious/noExplicitAny: Polar client type is dynamic
export function getPolarPlugin(polarClient: any, env?: Env) {
  return polar({
    client: polarClient,
    createCustomerOnSignUp: true,
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
        onPayload: (payload) => {
          console.log('[Polar Webhook]', payload.type)
        },
      }),
    ],
  })
}
