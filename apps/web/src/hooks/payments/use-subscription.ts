import { config } from '@repo/config'
import { useQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'

/**
 * Get the current user's customer state from Polar
 */
export function useCustomerState() {
  return useQuery({
    queryKey: ['polar', 'customer', 'state'],
    queryFn: async () => {
      const result = await authClient.customer.state()
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data
    },
    enabled: config.payments.enabled,
  })
}

/**
 * Check if user has an active paid subscription
 */
export function useHasPaidPlan() {
  const { data, isLoading } = useCustomerState()
  const hasPaidPlan = data?.activeSubscriptions && data.activeSubscriptions.length > 0
  return { hasPaidPlan: !!hasPaidPlan, isLoading }
}

/**
 * Get active subscriptions
 */
export function useSubscriptions() {
  return useQuery({
    queryKey: ['polar', 'customer', 'subscriptions'],
    queryFn: async () => {
      const result = await authClient.customer.subscriptions.list({
        query: { active: true, limit: 10 },
      })
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data
    },
    enabled: config.payments.enabled,
  })
}

/**
 * Initiate checkout for a product
 */
export function checkout(slug: string) {
  return authClient.checkout({ slug })
}

/**
 * Open customer portal
 */
export function openPortal() {
  return authClient.customer.portal()
}

type BillingCycle = 'monthly' | 'yearly' | 'lifetime'

/**
 * Get all available plans with their pricing
 */
export function getPlans() {
  return Object.entries(config.payments.plans).map(([key, plan]) => {
    const pricing = plan.pricing as Record<
      BillingCycle,
      { price: number; productId: string } | undefined
    >

    return {
      key,
      name: plan.name,
      description: plan.description,
      features: plan.features,
      popular: 'popular' in plan ? plan.popular : false,
      pricing: {
        monthly: pricing.monthly,
        yearly: pricing.yearly,
        lifetime: pricing.lifetime,
      },
      // Generate checkout slugs for available pricing options
      slugs: {
        monthly: pricing.monthly?.productId ? `${key}-monthly` : null,
        yearly: pricing.yearly?.productId ? `${key}-yearly` : null,
        lifetime: pricing.lifetime?.productId ? `${key}-lifetime` : null,
      },
    }
  })
}

/**
 * Get free plan config if it exists
 */
export function getFreePlan() {
  if (!config.payments.freePlan) {
    return undefined
  }
  const { name, description, features } = config.payments.freePlan
  return { name, description, features: [...features] }
}

/**
 * Check which billing cycles are available across all plans
 */
export function getAvailableBillingCycles(): BillingCycle[] {
  const cycles = new Set<BillingCycle>()

  for (const plan of Object.values(config.payments.plans)) {
    const pricing = plan.pricing as Record<
      BillingCycle,
      { price: number; productId: string } | undefined
    >
    if (pricing.monthly?.productId) {
      cycles.add('monthly')
    }
    if (pricing.yearly?.productId) {
      cycles.add('yearly')
    }
    if (pricing.lifetime?.productId) {
      cycles.add('lifetime')
    }
  }

  return Array.from(cycles)
}
