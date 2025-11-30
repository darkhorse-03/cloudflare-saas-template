import { createFileRoute } from '@tanstack/react-router'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { FeatureCards } from '@/components/feature-cards'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-6 max-w-3xl flex-1 flex flex-col">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-1">underdog</h1>
          <p className="text-sm text-muted-foreground">Fullstack Cloudflare Workers Template</p>
        </header>

        <main className="space-y-6 flex-1">
          <section>
            <h2 className="text-sm font-semibold text-center mb-4">Service Binding Architecture</h2>
            <ArchitectureDiagram />
          </section>

          <section>
            <h2 className="text-sm font-semibold text-center mb-4">Stack Features</h2>
            <FeatureCards />
          </section>
        </main>

        <footer className="py-4 text-center text-xs text-muted-foreground">
          <p>Built with Cloudflare Workers, Hono, TanStack, Alchemy</p>
        </footer>
      </div>
    </div>
  )
}
