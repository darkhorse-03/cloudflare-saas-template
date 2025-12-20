import { config } from '@repo/config'
import { createFileRoute } from '@tanstack/react-router'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { FeatureCards } from '@/components/feature-cards'
import { Layout } from '@/components/layout'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="mb-4 font-bold text-4xl md:text-5xl">{config.appName}</h1>
          <p className="mb-8 text-lg text-muted-foreground">{config.tagline}</p>
          <p className="mx-auto max-w-2xl text-muted-foreground text-sm">{config.description}</p>
        </section>

        {/* Architecture Section */}
        <section className="mb-16">
          <h2 className="mb-6 text-center font-semibold text-2xl">Service Binding Architecture</h2>
          <ArchitectureDiagram />
        </section>

        {/* Features Section */}
        <section>
          <h2 className="mb-6 text-center font-semibold text-2xl">Stack Features</h2>
          <FeatureCards />
        </section>
      </div>
    </Layout>
  )
}
