import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { PricingCards } from '@/components/payments/pricing-cards'

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
})

function PricingPage() {
  return (
    <Layout>
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-bold text-4xl tracking-tight sm:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Choose the plan that works for you. Upgrade, downgrade, or cancel anytime.
            </p>
          </div>

          <PricingCards />

          <div className="mt-16 text-center">
            <p className="text-muted-foreground text-sm">
              All plans include a 14-day money-back guarantee. No questions asked.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
