import { createFileRoute } from '@tanstack/react-router'
import { AICommandsDemo } from '@/components/demos/ai-commands-demo'
import { AuthFlowDemo } from '@/components/demos/auth-flow-demo'
import { DatabaseCRUDDemo } from '@/components/demos/database-crud-demo'
import { Layout } from '@/components/layout'
import { BeforeAfterComparison } from '@/components/marketing/before-after-comparison'
import { CompetitorComparison } from '@/components/marketing/competitor-comparison'
import { CTASection } from '@/components/marketing/cta-section'
import { HeroSection } from '@/components/marketing/hero-section'
import { TimelineDemo } from '@/components/marketing/timeline-demo'
import { ServiceBindingCard } from '@/components/service-binding-card'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <Layout>
      {/* 1. Hero Section - Emotional hook + CTA */}
      <HeroSection />

      {/* 2. Before/After Pain Points - Show time saved */}
      <BeforeAfterComparison />

      {/* 3. 60-Second Timeline - Interactive demo */}
      <TimelineDemo />

      {/* 4. Live Demos - Show what's pre-built */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-4xl tracking-tight">
              See What's Already Built For You
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              These aren't just features - they're fully working implementations you can use right
              now.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Auth Demo */}
            <AuthFlowDemo />

            {/* Database CRUD Demo */}
            <DatabaseCRUDDemo />

            {/* AI Commands Demo */}
            <AICommandsDemo />

            {/* Service Binding Demo (keep existing) */}
            <ServiceBindingCard />
          </div>
        </div>
      </section>

      {/* 5. Why Underdog? - Competitor comparison */}
      <CompetitorComparison />

      {/* 6. Final CTA */}
      <CTASection />
    </Layout>
  )
}
