import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/features')({
  component: FeaturesPage,
})

function FeaturesPage() {
  const features = [
    {
      title: 'Service Bindings',
      description: 'Zero-latency worker-to-worker communication with no public API exposure.',
    },
    {
      title: 'Type-Safe RPC',
      description: 'End-to-end type safety from API to frontend using Hono RPC client.',
    },
    {
      title: 'File-Based Routing',
      description: 'TanStack Router provides automatic route generation and type safety.',
    },
    {
      title: 'Smart Caching',
      description: 'React Query handles data fetching, caching, and synchronization automatically.',
    },
    {
      title: 'Edge Computing',
      description: 'Deploy globally on Cloudflare Workers for ultra-low latency.',
    },
    {
      title: 'Modern Tooling',
      description: 'Built with Vite, TypeScript, Tailwind CSS, and shadcn/ui components.',
    },
  ]

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl">Features</h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to build modern fullstack applications
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
