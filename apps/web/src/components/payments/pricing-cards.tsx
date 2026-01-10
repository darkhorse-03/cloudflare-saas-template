import { config } from '@repo/config'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { useAuthDialog } from '@/components/auth/auth-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  checkout,
  getAvailableBillingCycles,
  getFreePlan,
  getPlans,
  useHasPaidPlan,
} from '@/hooks/payments/use-subscription'
import { useSession } from '@/lib/auth-client'

type BillingCycle = 'monthly' | 'yearly'

function getGridClass(totalCards: number): string {
  if (totalCards >= 3) {
    return 'md:grid-cols-2 lg:grid-cols-3'
  }
  if (totalCards === 2) {
    return 'md:grid-cols-2 max-w-3xl'
  }
  return 'max-w-md'
}

function getPlanButtonLabel(hasPaidPlan: boolean, isLoggedIn: boolean): string {
  if (hasPaidPlan) {
    return 'Current Plan'
  }
  return isLoggedIn ? 'Upgrade Now' : 'Sign In to Upgrade'
}

function getFreePlanButtonLabel(hasPaidPlan: boolean, isLoggedIn: boolean): string {
  if (!isLoggedIn) {
    return 'Sign In'
  }
  return hasPaidPlan ? 'Downgrade' : 'Current Plan'
}

function getLifetimeButtonLabel(hasPaidPlan: boolean, isLoggedIn: boolean): string {
  if (hasPaidPlan) {
    return 'Already Pro'
  }
  return isLoggedIn ? 'Buy Lifetime' : 'Sign In'
}

export function PricingCards() {
  const availableCycles = getAvailableBillingCycles().filter(
    (c) => c !== 'lifetime',
  ) as BillingCycle[]
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(availableCycles[0] || 'monthly')
  const { data: session } = useSession()
  const { hasPaidPlan } = useHasPaidPlan()
  const { openDialog } = useAuthDialog()
  const plans = getPlans()
  const freePlan = getFreePlan()
  const hasLifetime = plans.some((p) => p.pricing.lifetime)
  const showBillingToggle = availableCycles.length > 1

  if (!config.payments.enabled) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Payments are not enabled yet.</p>
      </div>
    )
  }

  const handleCheckout = async (slug: string | null) => {
    if (!slug) {
      return
    }
    if (!session) {
      // Open dialog with callback for email/password, and redirect for OAuth/magic-link
      openDialog({
        onSuccess: () => checkout(slug),
        redirectTo: '/dashboard/billing',
      })
      return
    }
    await checkout(slug)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle - only show if both monthly and yearly are available */}
      {showBillingToggle && (
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </button>
        </div>
      )}

      {/* Plan Cards */}
      <div
        className={`grid gap-8 max-w-5xl mx-auto ${getGridClass(
          plans.length + (freePlan ? 1 : 0) + (hasLifetime ? 1 : 0),
        )}`}
      >
        {/* Free Plan - only if configured */}
        {freePlan && (
          <Card className="relative">
            <CardHeader>
              <CardTitle>{freePlan.name}</CardTitle>
              <CardDescription>{freePlan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {freePlan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled={!!session && !hasPaidPlan}>
                {getFreePlanButtonLabel(hasPaidPlan, !!session)}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Paid Plans */}
        {plans.map((plan) => {
          const currentPricing = plan.pricing[billingCycle]
          const slug = plan.slugs[billingCycle]
          const hasCurrentCycle = !!currentPricing

          // If this plan doesn't have the selected billing cycle, try to find an available one
          const displayPricing = currentPricing || plan.pricing.monthly || plan.pricing.yearly
          const displaySlug = slug || plan.slugs.monthly || plan.slugs.yearly

          if (!displayPricing) {
            return null
          }

          return (
            <Card
              key={plan.key}
              className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{formatPrice(displayPricing.price)}</span>
                  <span className="text-muted-foreground">/month</span>
                  {billingCycle === 'yearly' && hasCurrentCycle && (
                    <p className="text-sm text-muted-foreground mt-1">Billed annually</p>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleCheckout(displaySlug)}
                  disabled={!displaySlug || hasPaidPlan}
                >
                  {getPlanButtonLabel(hasPaidPlan, !!session)}
                </Button>
              </CardFooter>
            </Card>
          )
        })}

        {/* Lifetime Plan - only if any plan has lifetime pricing */}
        {hasLifetime && (
          <Card className="relative border-dashed">
            <CardHeader>
              <CardTitle>Lifetime</CardTitle>
              <CardDescription>One-time purchase, forever access</CardDescription>
              <div className="mt-4">
                {plans.map((plan) => {
                  if (!plan.pricing.lifetime) {
                    return null
                  }
                  return (
                    <span key={plan.key}>
                      <span className="text-4xl font-bold">
                        {formatPrice(plan.pricing.lifetime.price)}
                      </span>
                      <span className="text-muted-foreground"> once</span>
                    </span>
                  )
                })}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {['Everything included', 'Lifetime updates', 'Priority support forever'].map(
                  (feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ),
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  const lifetimePlan = plans.find((p) => p.slugs.lifetime)
                  if (lifetimePlan?.slugs.lifetime) {
                    handleCheckout(lifetimePlan.slugs.lifetime)
                  }
                }}
                disabled={hasPaidPlan}
              >
                {getLifetimeButtonLabel(hasPaidPlan, !!session)}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
