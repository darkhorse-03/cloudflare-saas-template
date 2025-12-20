import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { FeatureCards } from '@/components/feature-cards'
import { config } from '@repo/config'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{config.appName}</h1>
          <p className="text-lg text-muted-foreground mb-8">{config.tagline}</p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{config.description}</p>
        </section>

        {/* Architecture Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-6">Service Binding Architecture</h2>
          <ArchitectureDiagram />
        </section>

        {/* Features Section */}
        <section>
          <h2 className="text-2xl font-semibold text-center mb-6">Stack Features</h2>
          <FeatureCards />
        </section>
      </div>
    </Layout>
  )
}
