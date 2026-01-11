import { useEffect, useRef } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useAuthDialog } from '@/components/auth/auth-dialog'
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
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: async ({ search }) => {
    // Handle OAuth callback redirect - if authenticated, redirect immediately
    if (search.redirect) {
      const { data: session } = await authClient.getSession()
      if (session) {
        throw redirect({ to: search.redirect })
      }
    }
  },
  component: HomePage,
})

/**
 * Opens auth dialog when redirect param is present and user is not authenticated.
 * Uses a ref to ensure dialog only opens once per redirect param.
 */
function AuthRedirectHandler({ redirectTo }: { redirectTo: string }) {
  const { openDialog } = useAuthDialog()
  const navigate = useNavigate()
  const hasOpened = useRef(false)

  useEffect(() => {
    if (hasOpened.current) {
      return
    }
    hasOpened.current = true

    // Open dialog with the redirect destination
    openDialog({ redirectTo })

    // Clear the redirect param from URL to prevent re-opening on refresh
    navigate({ to: '/', search: {}, replace: true })
  }, [openDialog, redirectTo, navigate])

  return null
}

function HomePage() {
  const { redirect: redirectTo } = Route.useSearch()

  return (
    <Layout>
      {/* Auto-open auth dialog when redirect param is present */}
      {redirectTo && <AuthRedirectHandler redirectTo={redirectTo} />}

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

      {/* 5. Why Zynth? - Competitor comparison */}
      <CompetitorComparison />

      {/* 6. Final CTA */}
      <CTASection />
    </Layout>
  )
}
