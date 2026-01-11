import { config } from '@repo/config'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Check, CreditCard, ExternalLink, Sparkles } from 'lucide-react'
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
import { Skeleton } from '@/components/ui/skeleton'
import {
  getPlans,
  openPortal,
  useCustomerState,
  useHasPaidPlan,
} from '@/hooks/payments/use-subscription'

export const Route = createFileRoute('/dashboard/billing')({
  component: BillingPage,
})

interface PlanStatusProps {
  isLoading: boolean
  hasPaidPlan: boolean
  activeSubscription?: {
    recurringInterval?: string
    currentPeriodEnd?: Date | null
  }
}

function PlanStatus({ isLoading, hasPaidPlan, activeSubscription }: PlanStatusProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
    )
  }

  if (hasPaidPlan && activeSubscription) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-2xl">Pro</span>
          <Badge variant="default">Active</Badge>
        </div>
        <div className="space-y-1 text-muted-foreground text-sm">
          <p>
            Billing cycle:{' '}
            <span className="text-foreground">
              {activeSubscription.recurringInterval === 'month' ? 'Monthly' : 'Yearly'}
            </span>
          </p>
          {activeSubscription.currentPeriodEnd && (
            <p>
              Next billing date:{' '}
              <span className="text-foreground">
                {new Date(activeSubscription.currentPeriodEnd).toLocaleDateString()}
              </span>
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-2xl">Free</span>
        <Badge variant="secondary">Current</Badge>
      </div>
      <p className="text-muted-foreground text-sm">
        You're on the free plan. Upgrade to unlock premium features.
      </p>
    </div>
  )
}

function BillingPage() {
  const { data: customerState, isLoading } = useCustomerState()
  const { hasPaidPlan } = useHasPaidPlan()
  const plans = getPlans()

  if (!config.payments.enabled) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Billing</h1>
          <p className="mt-2 text-muted-foreground">Manage your subscription and billing</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Payments are not enabled yet.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleOpenPortal = async () => {
    await openPortal()
  }

  const activeSubscription = customerState?.activeSubscriptions?.[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Billing</h1>
        <p className="mt-2 text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Current Plan
          </CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent>
          <PlanStatus
            isLoading={isLoading}
            hasPaidPlan={hasPaidPlan}
            activeSubscription={activeSubscription}
          />
        </CardContent>
        <CardFooter className="flex gap-3">
          {hasPaidPlan ? (
            <Button variant="outline" onClick={handleOpenPortal}>
              <ExternalLink className="mr-2 size-4" />
              Manage Subscription
            </Button>
          ) : (
            <Button asChild>
              <Link to="/pricing">
                <Sparkles className="mr-2 size-4" />
                Upgrade to Pro
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Plan Features */}
      {!hasPaidPlan && plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5" />
              Unlock Pro Features
            </CardTitle>
            <CardDescription>See what you're missing out on</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {plans[0]?.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Billing History */}
      {hasPaidPlan && (
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View and download your invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Access your complete billing history and download invoices from the customer portal.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleOpenPortal}>
              <ExternalLink className="mr-2 size-4" />
              View Invoices
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
