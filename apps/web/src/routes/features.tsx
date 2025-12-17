import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'

export const Route = createFileRoute('/features')({
  component: FeaturesPage,
})

function FeaturesPage() {
  const features = [
    {
      title: 'Service Bindings',
      description:
        'Zero-latency worker-to-worker communication with no public API exposure.',
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
      description:
        'React Query handles data fetching, caching, and synchronization automatically.',
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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Features</h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to build modern fullstack applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 border border-border rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
