import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/features')({
  component: FeaturesPage,
})

function FeaturesPage() {
  const features = [
    {
      title: 'New Project in 60 Seconds',
      timeSaved: '3 days',
      description:
        'Run one command. Answer 3 prompts. Your fullstack app is ready. No research, no decision fatigue, no configuration hell.',
      icon: '⚡',
    },
    {
      title: 'Skip 8 Hours of Auth Setup Hell',
      timeSaved: '8 hours',
      description:
        'Better Auth pre-configured. Login, signup, sessions, protected routes. All working. TanStack Form + Zod validation included. Rate limiting configured. Just start building your features.',
      icon: '🔐',
    },
    {
      title: 'Database Ready to Query',
      timeSaved: '6 hours',
      description:
        'D1 + Drizzle ORM configured. Schema defined. Migrations automated. Type-safe queries from day one. No "which ORM?" debates, no setup tutorials.',
      icon: '🗄️',
    },
    {
      title: 'Deploy Globally in 60 Seconds',
      timeSaved: '6 hours',
      description:
        'One command: bun run deploy. 300+ edge locations worldwide. Zero DevOps knowledge required. No Docker, no Kubernetes, no cloud provider confusion.',
      icon: '🌍',
    },
    {
      title: 'Catch Bugs at Compile Time, Not in Production',
      timeSaved: '4 hours',
      description:
        'End-to-end type safety with Hono RPC. API changes? Your IDE tells you immediately. Full autocomplete everywhere. Ship with confidence.',
      icon: '🎯',
    },
    {
      title: 'Zero-Latency Internal APIs',
      timeSaved: '2 hours',
      description:
        'Service Bindings for worker-to-worker calls. No public URLs, no network overhead, no security headaches. Just fast, private APIs.',
      icon: '⚡',
    },
    {
      title: 'File-Based Routing That Just Works',
      timeSaved: '1 hour',
      description:
        'Create a file, get a route. TanStack Router handles the rest. Type-safe navigation, automatic code splitting, prefetching on hover. No routing config files.',
      icon: '🗺️',
    },
    {
      title: 'AI-Assisted Development Ready',
      timeSaved: '4 hours',
      description:
        'Optimized for Claude Code. Biome auto-formatting, type-safe codebase, clear structure. AI navigates your code better, suggests accurate changes, and ships working features.',
      icon: '🤖',
    },
  ]

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl">Everything Pre-Built. Nothing to Setup.</h1>
          <p className="text-lg text-muted-foreground">
            Cloudflare Workers template optimized for AI-assisted development. Deploy in 60 seconds,
            skip 3 days of configuration.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card className="transition-shadow hover:shadow-lg" key={feature.title}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{feature.icon}</span>
                    <CardTitle>{feature.title}</CardTitle>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 font-mono text-primary text-xs">
                    Save {feature.timeSaved}
                  </div>
                </div>
                <CardDescription className="mt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  )
}
