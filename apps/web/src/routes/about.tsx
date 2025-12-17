import { createFileRoute } from '@tanstack/react-router'
import { Layout } from '@/components/layout'
import { config } from '@repo/config'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">About {config.appName}</h1>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What is this?</h2>
            <p className="text-muted-foreground leading-relaxed">
              {config.appName} is a modern fullstack template built specifically for Cloudflare
              Workers. It provides a complete foundation for building type-safe, scalable
              applications using the latest web technologies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Why Cloudflare Workers?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Cloudflare Workers deploy your code to over 300 data centers worldwide, providing
              ultra-low latency for your users no matter where they are. Combined with service
              bindings, you get zero-latency worker-to-worker communication with no network
              overhead.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">The Stack</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <strong>Hono</strong> - Fast, lightweight web framework with excellent TypeScript
                support
              </li>
              <li>
                <strong>React + TanStack Router</strong> - File-based routing with type safety
              </li>
              <li>
                <strong>React Query</strong> - Powerful data synchronization and caching
              </li>
              <li>
                <strong>Tailwind CSS + shadcn/ui</strong> - Beautiful, customizable components
              </li>
              <li>
                <strong>Turborepo</strong> - Fast, scalable monorepo builds
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-muted-foreground leading-relaxed">
              This template is designed to work seamlessly with Claude Code. Simply tell Claude what
              you want to build, and it will help you set up features, add pages, and customize the
              template to your needs.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  )
}
