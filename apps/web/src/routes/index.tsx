import { createFileRoute } from '@tanstack/react-router'
import { Moon, Sun } from 'lucide-react'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
import { FeatureCards } from '@/components/feature-cards'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute top-4 right-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="cursor-pointer">
          {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">underdog</h1>
          <p className="text-muted-foreground">Fullstack Cloudflare Workers Template</p>
        </header>

        <main className="space-y-12">
          {/* Architecture Diagram */}
          <section>
            <h2 className="text-lg font-semibold text-center mb-6">Service Binding Architecture</h2>
            <ArchitectureDiagram />
          </section>

          {/* Interactive Feature Cards */}
          <section>
            <h2 className="text-lg font-semibold text-center mb-6">Stack Features</h2>
            <FeatureCards />
          </section>
        </main>

        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>Built with Cloudflare Workers, Hono, TanStack, Alchemy</p>
        </footer>
      </div>
    </div>
  )
}
